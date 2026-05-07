/* Diário Lunar — AudioManager v1
 * Web Audio API com sons sintetizados (zero MP3).
 * Aplicações de lições do BemLab v3:
 *  - Cleanup centralizado por id em _activeSources
 *  - Soundscape isolado em _ssGains/_ssSources (não morre em stopAll)
 *  - Unlock invisível multi-evento (touchstart/pointerdown/mousedown/click/keydown)
 *  - Sem síntese de respiração (fonte do BUG 2 do BemLab)
 *  - Persistência de volumes em localStorage
 *  - Idempotência de stopAll
 */
(function () {
  'use strict';

  var AudioManager = {};
  var ctx = null;
  var masterGain = null;
  var _unlocked = false;
  var _enabled = true;
  var _ready = false;
  var _activeSources = Object.create(null); // id -> { src, gain, type }
  var _ssGains = Object.create(null);       // soundscape: key -> gain
  var _ssOscs = Object.create(null);        // soundscape: key -> nodes
  var _ssVolumes = Object.create(null);     // persistência
  var _idCounter = 0;

  // Frequências do produto
  var FREQ = {
    nova:       111,   // Lua Nova
    crescente:  285,   // Lua Crescente
    cheia:      528,   // Lua Cheia
    minguante:  396,   // Lua Minguante
    sinoEntrada: 432,
    sinoSave:   528,
    schumann:   7.83,
    om:         136.1,
    crystal:    963
  };

  var SS_KEYS = ['agua', 'cristais', 'vento', 'om']; // soundscape disponíveis

  // ===== Persistência de volumes =====
  function _loadVolumes() {
    SS_KEYS.forEach(function (k) {
      var v = null;
      try { v = localStorage.getItem('diariolunar_ss_' + k); } catch (e) {}
      _ssVolumes[k] = (v != null ? parseFloat(v) : 0);
      if (isNaN(_ssVolumes[k])) _ssVolumes[k] = 0;
    });
    var en = null;
    try { en = localStorage.getItem('diariolunar_audio_enabled'); } catch (e) {}
    _enabled = (en === null) ? true : (en === '1');
  }
  function _saveVolume(k, v) {
    try { localStorage.setItem('diariolunar_ss_' + k, String(v)); } catch (e) {}
  }
  function _saveEnabled() {
    try { localStorage.setItem('diariolunar_audio_enabled', _enabled ? '1' : '0'); } catch (e) {}
  }

  // ===== Unlock =====
  function _ensureCtx() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = _enabled ? 1.0 : 0.0;
    masterGain.connect(ctx.destination);
    return ctx;
  }

  function _unlock() {
    if (_unlocked) return;
    var c = _ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') {
      c.resume().then(function () { _unlocked = true; _ready = true; window._dlAudioReady = true; });
    } else {
      _unlocked = true; _ready = true; window._dlAudioReady = true;
    }
    // Ping silencioso para confirmar pipeline
    try {
      var b = c.createBuffer(1, 1, 22050);
      var s = c.createBufferSource();
      s.buffer = b; s.connect(c.destination); s.start(0);
    } catch (e) {}
  }

  function _installUnlockListeners() {
    var events = ['touchstart', 'pointerdown', 'mousedown', 'click', 'keydown'];
    var fired = false;
    var fn = function () {
      if (fired) return;
      fired = true;
      _unlock();
      events.forEach(function (ev) {
        window.removeEventListener(ev, fn, true);
      });
    };
    events.forEach(function (ev) {
      window.addEventListener(ev, fn, { capture: true, passive: true });
    });
  }

  // ===== Helpers internos =====
  function _newId(type) { _idCounter++; return type + '_' + _idCounter; }

  function _stopSource(id, fadeMs) {
    var entry = _activeSources[id];
    if (!entry) return;
    var c = ctx; if (!c) { delete _activeSources[id]; return; }
    var now = c.currentTime;
    var fade = (fadeMs == null ? 80 : fadeMs) / 1000;
    try {
      entry.gain.gain.cancelScheduledValues(now);
      entry.gain.gain.setValueAtTime(entry.gain.gain.value, now);
      entry.gain.gain.linearRampToValueAtTime(0, now + fade);
    } catch (e) {}
    var stopAt = now + fade + 0.02;
    setTimeout(function () {
      try { entry.src.stop(); } catch (e) {}
      try { entry.src.disconnect(); } catch (e) {}
      try { entry.gain.disconnect(); } catch (e) {}
      delete _activeSources[id];
    }, (fade * 1000) + 30);
  }

  function _makeNoiseBuffer(durationSec, kind) {
    var c = _ensureCtx(); if (!c) return null;
    var len = Math.floor(c.sampleRate * durationSec);
    var buffer = c.createBuffer(1, len, c.sampleRate);
    var data = buffer.getChannelData(0);
    if (kind === 'pink') {
      // Paul Kellet pink noise approximation
      var b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for (var i = 0; i < len; i++) {
        var white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0+b1+b2+b3+b4+b5+b6+white*0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else {
      for (var j = 0; j < len; j++) data[j] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // ===== Tom puro (sine) com envelope ADSR =====
  function _playTone(freq, opts) {
    var c = _ensureCtx(); if (!c || !_unlocked || !_enabled) return null;
    opts = opts || {};
    var dur   = opts.duration != null ? opts.duration : 1.5;
    var attack = opts.attack != null ? opts.attack : 0.05;
    var decay  = opts.decay  != null ? opts.decay  : dur - 0.1;
    var peak   = opts.gain   != null ? opts.gain   : 0.15;
    var type   = opts.type   || 'sine';

    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, c.currentTime);
    g.gain.linearRampToValueAtTime(peak, c.currentTime + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + attack + decay);
    osc.connect(g); g.connect(masterGain);
    osc.start();
    osc.stop(c.currentTime + attack + decay + 0.05);

    var id = _newId('tone');
    _activeSources[id] = { src: osc, gain: g, type: 'tone' };
    osc.onended = function () { delete _activeSources[id]; };
    return id;
  }

  // ===== Sino (campainha cristalina) =====
  function _playBell(freq, opts) {
    opts = opts || {};
    var dur = opts.duration != null ? opts.duration : 3.0;
    return _playTone(freq, {
      type: 'sine',
      duration: dur,
      attack: 0.005,
      decay: dur - 0.01,
      gain: opts.gain != null ? opts.gain : 0.18
    });
  }

  // ===== Loop de tom contínuo (frequência lunar/ciclo) =====
  function _startContinuousTone(freq, opts) {
    var c = _ensureCtx(); if (!c || !_unlocked || !_enabled) return null;
    opts = opts || {};
    var peak = opts.gain != null ? opts.gain : 0.03;
    var fadeIn = opts.fadeIn != null ? opts.fadeIn : 1.5;

    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = opts.type || 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, c.currentTime);
    g.gain.linearRampToValueAtTime(peak, c.currentTime + fadeIn);

    // Modulação opcional Schumann (LFO sutil de amplitude)
    var lfo = null, lfoGain = null;
    if (opts.schumannPulse) {
      lfo = c.createOscillator();
      lfoGain = c.createGain();
      lfo.frequency.value = FREQ.schumann;
      lfoGain.gain.value = peak * 0.15;
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start();
    }

    osc.connect(g).connect(masterGain);
    osc.start();

    var id = _newId('cont');
    _activeSources[id] = { src: osc, gain: g, type: 'continuous', lfo: lfo, lfoGain: lfoGain };
    return id;
  }

  // ===== Soundscape sintetizado =====
  function _buildSoundscape(key) {
    var c = _ensureCtx(); if (!c) return null;
    var g = c.createGain();
    g.gain.value = 0;
    g.connect(masterGain);

    var nodes = { gain: g, parts: [] };

    if (key === 'agua') {
      // Ruído branco filtrado bandpass 400Hz com modulação suave
      var buf = _makeNoiseBuffer(4, 'white');
      var src = c.createBufferSource();
      src.buffer = buf; src.loop = true;
      var bp = c.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 400; bp.Q.value = 0.7;
      var lp = c.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 2000;
      var lfo = c.createOscillator();
      var lfoG = c.createGain();
      lfo.frequency.value = 0.3; lfoG.gain.value = 150;
      lfo.connect(lfoG).connect(bp.frequency);
      lfo.start();
      src.connect(bp).connect(lp).connect(g);
      src.start();
      nodes.parts.push(src, bp, lp, lfo, lfoG);
    }
    else if (key === 'cristais') {
      // 963Hz com shimmer (segunda voz +5° desafinada e tremolo)
      var o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = FREQ.crystal;
      var o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = FREQ.crystal * 1.005;
      var trem = c.createOscillator(); trem.frequency.value = 4.2;
      var tremG = c.createGain(); tremG.gain.value = 0.04;
      var voiceG = c.createGain(); voiceG.gain.value = 0.18;
      voiceG.gain.setValueAtTime(0.18, c.currentTime);
      trem.connect(tremG).connect(voiceG.gain);
      o1.connect(voiceG); o2.connect(voiceG); voiceG.connect(g);
      o1.start(); o2.start(); trem.start();
      nodes.parts.push(o1, o2, trem, tremG, voiceG);
    }
    else if (key === 'vento') {
      // Ruído rosa filtrado lowpass 800Hz com envelope lento (rajadas)
      var bufP = _makeNoiseBuffer(6, 'pink');
      var srcP = c.createBufferSource();
      srcP.buffer = bufP; srcP.loop = true;
      var lpV = c.createBiquadFilter();
      lpV.type = 'lowpass'; lpV.frequency.value = 800; lpV.Q.value = 0.5;
      var lfoV = c.createOscillator();
      var lfoVG = c.createGain();
      lfoV.frequency.value = 0.15; lfoVG.gain.value = 300;
      lfoV.connect(lfoVG).connect(lpV.frequency);
      lfoV.start();
      srcP.connect(lpV).connect(g);
      srcP.start();
      nodes.parts.push(srcP, lpV, lfoV, lfoVG);
    }
    else if (key === 'om') {
      // OM 136.1Hz com 3ª harmônica
      var oomA = c.createOscillator(); oomA.type='sine'; oomA.frequency.value=FREQ.om;
      var oomB = c.createOscillator(); oomB.type='sine'; oomB.frequency.value=FREQ.om*2;
      var oomBG = c.createGain(); oomBG.gain.value = 0.4;
      oomA.connect(g); oomB.connect(oomBG).connect(g);
      oomA.start(); oomB.start();
      nodes.parts.push(oomA, oomB, oomBG);
    }
    return nodes;
  }

  function _setSsVolume(key, vol, fadeMs) {
    var c = _ensureCtx(); if (!c) return;
    if (!_ssGains[key]) {
      var nodes = _buildSoundscape(key);
      if (!nodes) return;
      _ssGains[key] = nodes.gain;
      _ssOscs[key] = nodes;
    }
    var fade = (fadeMs == null ? 600 : fadeMs) / 1000;
    var now = c.currentTime;
    var g = _ssGains[key].gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(Math.max(0, Math.min(1, vol)), now + fade);
  }

  // ===== API pública =====

  AudioManager.init = function () {
    _loadVolumes();
    _installUnlockListeners();
  };

  AudioManager.isReady = function () { return _ready && _enabled; };
  AudioManager.isEnabled = function () { return _enabled; };

  AudioManager.setEnabled = function (on) {
    _enabled = !!on;
    _saveEnabled();
    if (masterGain && ctx) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(_enabled ? 1.0 : 0.0, ctx.currentTime + 0.2);
    }
    if (!_enabled) AudioManager.stopAll(0.2);
  };

  AudioManager.stopAll = function (fadeSec) {
    var fadeMs = fadeSec != null ? fadeSec * 1000 : 250;
    Object.keys(_activeSources).forEach(function (id) { _stopSource(id, fadeMs); });
  };

  // Sino de entrada (432Hz, decay 3s)
  AudioManager.playEntryBell = function () {
    if (!_unlocked) _unlock();
    return _playBell(FREQ.sinoEntrada, { duration: 3.0, gain: 0.18 });
  };

  // Sino de salvamento (528Hz)
  AudioManager.playSaveBell = function () {
    if (!_unlocked) _unlock();
    return _playBell(FREQ.sinoSave, { duration: 1.6, gain: 0.16 });
  };

  // Notify (alias)
  AudioManager.playNotify = function () {
    return AudioManager.playSaveBell();
  };

  // Som ao revelar oráculo (cristal 963Hz curto)
  AudioManager.playOracleReveal = function () {
    if (!_unlocked) _unlock();
    return _playBell(FREQ.crystal, { duration: 2.2, gain: 0.12 });
  };

  // Sequência achievement 432→528→639Hz
  AudioManager.playAchievement = function () {
    if (!_unlocked) _unlock();
    var c = _ensureCtx(); if (!c) return;
    _playBell(432, { duration: 0.9, gain: 0.16 });
    setTimeout(function () { _playBell(528, { duration: 0.9, gain: 0.16 }); }, 220);
    setTimeout(function () { _playBell(639, { duration: 1.6, gain: 0.18 }); }, 460);
  };

  // Preview curto ao trocar tema (uma única nota)
  AudioManager.playThemePreview = function (themeId) {
    if (!_unlocked) _unlock();
    var f = 528;
    if (themeId === 'noite-lunar') f = 396;
    else if (themeId === 'aurora-boreal')  f = 528;
    else if (themeId === 'petala-branca')  f = 639;
    else if (themeId === 'magia-dourada') f = 741;
    return _playBell(f, { duration: 1.4, gain: 0.14 });
  };

  // Tom contínuo da fase lunar (chamar ao entrar em diário)
  AudioManager.startLunarTone = function (lunarKey) {
    AudioManager.stopLunarTone();
    if (!_unlocked) _unlock();
    var freq = FREQ.nova;
    if (lunarKey === 'waxing') freq = FREQ.crescente;
    else if (lunarKey === 'full') freq = FREQ.cheia;
    else if (lunarKey === 'waning') freq = FREQ.minguante;
    var id = _startContinuousTone(freq, { gain: 0.03, schumannPulse: true });
    if (id) AudioManager._lunarToneId = id;
    return id;
  };

  AudioManager.stopLunarTone = function () {
    if (AudioManager._lunarToneId) {
      _stopSource(AudioManager._lunarToneId, 800);
      AudioManager._lunarToneId = null;
    }
  };

  // Atmosfera por fase do ciclo
  // 1 Renovação: 111Hz + agua
  // 2 Crescimento: 285Hz + vento
  // 3 Força: 528Hz + cristais
  // 4 Sabedoria: 396Hz + OM
  AudioManager.startCyclePhaseAmbience = function (phaseId) {
    AudioManager.stopCyclePhaseAmbience();
    if (!_unlocked) _unlock();
    var map = {
      1: { freq: FREQ.nova,       ss: 'agua' },
      2: { freq: FREQ.crescente,  ss: 'vento' },
      3: { freq: FREQ.cheia,      ss: 'cristais' },
      4: { freq: FREQ.minguante,  ss: 'om' }
    };
    var cfg = map[phaseId]; if (!cfg) return;
    var id = _startContinuousTone(cfg.freq, { gain: 0.025, schumannPulse: true, fadeIn: 2.0 });
    if (id) AudioManager._cycleToneId = id;
    AudioManager._cycleSsKey = cfg.ss;
    _setSsVolume(cfg.ss, 0.25, 1500);
  };

  AudioManager.stopCyclePhaseAmbience = function () {
    if (AudioManager._cycleToneId) {
      _stopSource(AudioManager._cycleToneId, 1200);
      AudioManager._cycleToneId = null;
    }
    if (AudioManager._cycleSsKey) {
      _setSsVolume(AudioManager._cycleSsKey, 0, 1000);
      AudioManager._cycleSsKey = null;
    }
  };

  // Soundscape mixer (timer/meditação)
  AudioManager.setSoundscapeVolume = function (key, vol) {
    if (SS_KEYS.indexOf(key) === -1) return;
    if (!_unlocked) _unlock();
    _ssVolumes[key] = vol;
    _saveVolume(key, vol);
    _setSsVolume(key, vol, 600);
  };

  AudioManager.getSoundscapeVolumes = function () {
    var out = {}; SS_KEYS.forEach(function (k) { out[k] = _ssVolumes[k] || 0; });
    return out;
  };

  AudioManager.stopSoundscapes = function () {
    SS_KEYS.forEach(function (k) {
      if (_ssGains[k]) _setSsVolume(k, 0, 600);
    });
  };

  // Haptic adaptativo (Android Vibration / iOS visual flash)
  AudioManager.haptic = function (pattern) {
    pattern = pattern || 30;
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); return; } catch (e) {}
    }
    // Fallback iOS: flash visual breve
    var flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:rgba(255,255,255,0.2);pointer-events:none;z-index:99999;transition:opacity 80ms';
    document.body.appendChild(flash);
    requestAnimationFrame(function () {
      setTimeout(function () {
        flash.style.opacity = '0';
        setTimeout(function () { if (flash.parentNode) flash.parentNode.removeChild(flash); }, 100);
      }, 60);
    });
  };

  // Cleanup completo (chamar em popstate/saída)
  AudioManager.stopEverything = function () {
    AudioManager.stopLunarTone();
    AudioManager.stopCyclePhaseAmbience();
    AudioManager.stopSoundscapes();
    AudioManager.stopAll(0.3);
  };

  window.AudioManager = AudioManager;
  // Auto-init invisível (sem toast)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', AudioManager.init, { once: true });
  } else {
    AudioManager.init();
  }
})();
