// ═══════════════════════════════════════════════════════════════════
// Diário Lunar — Vanilla JS App
// ═══════════════════════════════════════════════════════════════════
(function() {
  'use strict';

  // ─── STORAGE PREFIX ───
  var PREFIX = 'diariolunar_';
  function lsGet(key) { try { return localStorage.getItem(PREFIX + key); } catch(e) { return null; } }
  function lsSet(key, val) { try { localStorage.setItem(PREFIX + key, val); } catch(e) {} }
  function lsRemove(key) { try { localStorage.removeItem(PREFIX + key); } catch(e) {} }
  function lsGetJSON(key) { try { var v = lsGet(key); return v ? JSON.parse(v) : null; } catch(e) { return null; } }
  function lsSetJSON(key, val) { lsSet(key, JSON.stringify(val)); }

  // ─── SVG ICON PATHS ───
  var ICONS = {
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>',
    feather: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    chevronRight: '<polyline points="9 18 15 12 9 6"/>',
    chevronLeft: '<polyline points="15 18 9 12 15 6"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    barChart2: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    barChart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
    helpCircle: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    checkCircle2: '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>',
    sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    trendingUp: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>',
    sunrise: '<path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/>',
    sunset: '<path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 6 12 10 8 6"/>',
    penTool: '<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    bookOpen: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    notebookPen: '<path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M15.5 8.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z"/><path d="m13.5 10.5 2-2"/><path d="m10.5 13.5 5-5"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    messageCircle: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
  };

  function icon(name, size, color, extra) {
    size = size || 16;
    var style = 'width:' + size + 'px;height:' + size + 'px;';
    if (color) style += 'color:' + color + ';';
    if (extra) style += extra;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="' + style + '">' + (ICONS[name] || '') + '</svg>';
  }

  // ─── UTILITIES ───
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function parseLocalDate(d) { return new Date(d + 'T12:00:00'); }
  function isMobile() { return window.innerWidth <= 600; }

  function getDayEntries(data) {
    var r = [];
    for (var k in data) {
      var n = parseInt(k, 10);
      if (!isNaN(n) && n >= 1 && n <= 28) r.push([k, data[k]]);
    }
    return r;
  }

  function getPhaseByDay(day) {
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    return 4;
  }

  function calcCycleDay() {
    try {
      var startDateStr = lsGet('cycleStartDate');
      var startDay = parseInt(lsGet('cycleStartDay') || '1', 10);
      if (!startDateStr) return null;
      var startDate = parseLocalDate(startDateStr);
      var today = new Date();
      var diffDays = Math.floor((today - startDate) / 86400000);
      return Math.min(28, Math.max(1, startDay + diffDays));
    } catch(e) { return null; }
  }

  // ─── ORÁCULO LOCAL (sem API externa) ───
  // Banco de insights: 4 fases do ciclo × 4 fases lunares = 16 combinações × 2-3 insights = 36+ únicos
  var INSIGHTS_BANK = {
    // ── Fase 1: RENOVAÇÃO ──
    '1_new': [
      'A lua nova e sua fase de renovação se encontram num momento raro de recomeço. Plante intenções pequenas — elas crescerão mais fortes do que você imagina.',
      'Tudo que você cultiva no silêncio desta fase voltará multiplicado. O descanso de hoje é a fundação da força de amanhã.',
      'O céu vazio e o útero vazio compartilham a mesma promessa: tudo é possível quando se honra o nada antes do tudo.'
    ],
    '1_waxing': [
      'A lua cresce enquanto seu corpo pede recolhimento. Não force o ritmo dela — sua sabedoria está em respeitar o seu próprio.',
      'Mesmo na fase de renovação, sementes invisíveis estão germinando. Confie no que você não vê ainda.'
    ],
    '1_full': [
      'A lua brilha cheia do lado de fora enquanto você se recolhe. Permita-se essa contradição — ela é sagrada e te protege da exaustão coletiva.',
      'Hoje a lua chama você para ser vista, mas seu corpo pede silêncio. Escolha você. Sempre.'
    ],
    '1_waning': [
      'Lua minguante e fase de renovação são gêmeas: ambas pedem soltura. Deixe ir o que tentou carregar até aqui.',
      'O ciclo lunar e o seu se alinham num gesto de soltar. O que você libera agora abre espaço para o renascer.'
    ],
    // ── Fase 2: CRESCIMENTO ──
    '2_new': [
      'Lua nova e sua primavera interior dançam juntas. É o momento mais fértil para começar — diga sim àquela ideia que insiste em voltar.',
      'A semente está plantada e o solo está úmido. Sua missão hoje é apenas regar com presença.'
    ],
    '2_waxing': [
      'Você cresce na mesma direção da lua. Seu magnetismo está expandindo — comece o que estava só na imaginação.',
      'A energia que sobe em você é a mesma que sobe no céu. Use essa onda — apresente-se, escreva, ligue, comece.',
      'Tudo o que você iniciar nestes dias terá vento favorável. Confie no impulso, mas mantenha os pés na terra.'
    ],
    '2_full': [
      'Sua primavera encontra a lua cheia — e isso é poder amplificado. Coloque seu nome onde você merece estar.',
      'Você está crescendo e o universo está iluminando. Seja vista. Hoje, brilhar não é vaidade — é honra.'
    ],
    '2_waning': [
      'Mesmo enquanto a lua diminui, sua energia pessoal sobe. Use essa assimetria a seu favor — finalize o velho e prepare o novo.',
      'Você está em fase de iniciar enquanto o coletivo está soltando. Esse é seu trampolim secreto.'
    ],
    // ── Fase 3: FORÇA ──
    '3_new': [
      'Sua força interna está acesa enquanto o céu pede recolhimento. Não tenha medo de brilhar mesmo quando a lua se cala.',
      'Você é fogo no escuro. Hoje sua presença é luz para alguém que precisa.'
    ],
    '3_waxing': [
      'Energia ascendente em você e no céu. Hoje o cosmos pede liderança consciente — diga aquilo que precisa ser dito com amor.',
      'Você está magnética. Pessoas certas vão aparecer. Mantenha-se aberta sem se entregar inteira.'
    ],
    '3_full': [
      'Você está no pico da sua expressão. A lua cheia amplifica o que já brilha em você — use essa energia para ser vista, para liderar, para criar sem medo.',
      'Hoje é dia de coroar. Sua força e a lua cheia se encontram no zênite do ciclo. O que você pediu há semanas pode chegar agora.',
      'O universo prepara o palco. Seu corpo é o instrumento. Sua voz é a música. Toque sem pedir licença.'
    ],
    '3_waning': [
      'Mesmo com a lua minguando, sua força não recua. Conduza com firmeza, mas escolha onde investir essa potência — nem tudo merece seu fogo.',
      'Você ainda brilha enquanto o céu se recolhe. Use isso para fechar ciclos com elegância.'
    ],
    // ── Fase 4: SABEDORIA ──
    '4_new': [
      'Outono interior e lua nova: o silêncio se aprofunda. Aqui mora a verdade que você vinha evitando — escute sem julgar.',
      'Quando a lua se esconde e seu corpo se sensibiliza, a intuição chega como sussurro. Anote tudo, mesmo o estranho.'
    ],
    '4_waxing': [
      'Sua sensibilidade está aguda enquanto a lua cresce. Use essa lente afinada para revisar — não para se cobrar.',
      'Você vê demais hoje. Lembre-se: nem tudo o que você sente sobre os outros é seu. Devolva o que não é seu.'
    ],
    '4_full': [
      'Lua cheia + outono interior = revelação. O que você precisava ver finalmente fica claro. Seja gentil com a verdade que aparecer.',
      'A lua brilha enquanto você sente tudo. Talvez chore. Tudo bem. Lágrima de mulher cíclica é alquimia, não fraqueza.'
    ],
    '4_waning': [
      'Lua e corpo soltam juntos. Esta é a fase mais limpa do mês — escreva, queime, perdoe, libere. Amanhã renasce.',
      'Você está em duplo soltar. Permita-se desfazer o que não cabe mais. O vazio que vem em seguida é sagrado.',
      'Sua sabedoria culmina aqui: você sabe o que precisa morrer. E sabe que não precisa explicar isso para ninguém.'
    ]
  };

  function getLunarPhaseKey() {
    try {
      var lp = getLunarPhase();
      var n = (lp.name || '').toLowerCase();
      if (n.indexOf('nova') !== -1) return 'new';
      if (n.indexOf('cheia') !== -1) return 'full';
      if (n.indexOf('crescente') !== -1 || n.indexOf('quarto crescente') !== -1) return 'waxing';
      return 'waning';
    } catch(e) { return 'new'; }
  }

  function generateLocalInsight() {
    // Reusa insight do dia se já gerado hoje — coerência diária
    var todayKey = new Date().toISOString().split('T')[0];
    var savedDate = lsGet('insight_data');
    var savedInsight = lsGet('insight_atual');
    if (savedDate === todayKey && savedInsight) return savedInsight;

    var phaseId = getPhaseByDay(state.currentDay);
    var lunarKey = getLunarPhaseKey();
    var combo = phaseId + '_' + lunarKey;
    var pool = INSIGHTS_BANK[combo] || INSIGHTS_BANK['1_new'];

    var recent = lsGetJSON('recentInsights') || [];
    var available = pool.filter(function(ins) { return recent.indexOf(ins) === -1; });
    if (!available.length) available = pool.slice();

    var chosen = available[Math.floor(Math.random() * available.length)];
    recent.push(chosen);
    if (recent.length > 7) recent = recent.slice(-7);
    lsSetJSON('recentInsights', recent);
    lsSet('insight_atual', chosen);
    lsSet('insight_data', todayKey);
    return chosen;
  }

  // Mantém assinatura compatível com chamadas existentes — Promise<string|null>
  function callGeminiOracle(prompt, signal) {
    return new Promise(function(resolve) {
      // Pequeno delay para preservar a sensação ritualística da consulta
      var timer = setTimeout(function() {
        if (signal && signal.aborted) { resolve(null); return; }
        try { resolve(generateLocalInsight()); }
        catch(e) { resolve('A intuição é o oráculo mais antigo. Confie no que seu corpo já sabe.'); }
      }, 1100);
      if (signal) {
        signal.addEventListener('abort', function() { clearTimeout(timer); resolve(null); });
      }
    });
  }

  var scriptCache = {};
  function loadScript(src) {
    if (scriptCache[src]) return scriptCache[src];
    scriptCache[src] = new Promise(function(resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) { resolve(); return; }
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function(e) { delete scriptCache[src]; reject(e); };
      document.head.appendChild(s);
    });
    return scriptCache[src];
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SYSTEM DATA
  // ─────────────────────────────────────────────────────────────────────────────
  var lunarCalendar2026 = {
    newMoons: [
      { date: '2026-01-01' }, { date: '2026-01-30' }, { date: '2026-02-28' },
      { date: '2026-03-30' }, { date: '2026-04-28' }, { date: '2026-05-28' },
      { date: '2026-06-26' }, { date: '2026-07-26' }, { date: '2026-08-24' },
      { date: '2026-09-23' }, { date: '2026-10-22' }, { date: '2026-11-21' },
      { date: '2026-12-20' }
    ],
    fullMoons: [
      { date: '2026-01-15', name: 'Lua do Lobo' },    { date: '2026-02-13', name: 'Lua da Neve' },
      { date: '2026-03-15', name: 'Lua do Verme' },   { date: '2026-04-13', name: 'Lua Rosa' },
      { date: '2026-05-13', name: 'Lua das Flores' }, { date: '2026-06-11', name: 'Lua Morango' },
      { date: '2026-07-11', name: 'Lua do Cervo' },   { date: '2026-08-09', name: 'Lua do Esturjão' },
      { date: '2026-09-08', name: 'Lua da Colheita' },{ date: '2026-10-07', name: 'Lua do Caçador' },
      { date: '2026-11-06', name: 'Lua do Castor' },  { date: '2026-12-05', name: 'Lua Fria' }
    ]
  };

  var PHASES = {
    1: {
      id: 1, name: "Renovação", season: "Inverno Interior", days: "Dias 1–7",
      hex: "#818CF8", bg: "#1C1245", border: "rgba(129,140,248,0.35)", dot: "#818CF8",
      grad1: "#1C1245", grad2: "#170F2E", icon: "moon",
      desc: "Energia baixa. Momento de recolhimento, intuição e descanso profundo. Seu corpo está limpando e se preparando para um novo ciclo.",
      focus: "Descanso e Planejamento",
      keywords: ["Intuição", "Silêncio", "Limpeza", "Sonhos"],
      affirmation: "Eu me permito descansar sem culpa. Meu corpo sabe o que precisa.",
      rituals: ["Banho com sais", "Chá de camomila", "Journaling", "Dormir cedo"],
      avoid: ["Decisões importantes", "Eventos grandes", "Exercícios intensos"]
    },
    2: {
      id: 2, name: "Crescimento", season: "Primavera Interior", days: "Dias 8–14",
      hex: "#34D399", bg: "#0D2318", border: "rgba(52,211,153,0.35)", dot: "#34D399",
      grad1: "#0D2318", grad2: "#170F2E", icon: "coffee",
      desc: "Energia ascendente. A mente fica mais afiada, ideal para iniciar projetos, aprender coisas novas e socializar levemente.",
      focus: "Ação e Criatividade",
      keywords: ["Planejamento", "Início", "Curiosidade", "Movimento"],
      affirmation: "Estou pronta para crescer. Minha mente floresce com clareza.",
      rituals: ["Caminhada matinal", "Planejamento semanal", "Culinária nova", "Leitura"],
      avoid: ["Procrastinação", "Isolamento excessivo"]
    },
    3: {
      id: 3, name: "Força", season: "Verão Interior", days: "Dias 15–21",
      hex: "#C084FC", bg: "#271640", border: "rgba(192,132,252,0.35)", dot: "#C084FC",
      grad1: "#271640", grad2: "#170F2E", icon: "sun",
      desc: "Pico de energia. Magnetismo pessoal, comunicação fluida e desejo de conexão social. Ótimo para apresentações e encontros importantes.",
      focus: "Resultados e Conexão",
      keywords: ["Liderança", "Prazer", "Comunicação", "Magnetismo"],
      affirmation: "Sou magnética e poderosa. Minha luz ilumina os que estão ao meu redor.",
      rituals: ["Dança", "Encontros sociais", "Apresentações", "Networking"],
      avoid: ["Isolamento", "Subestimar seu poder"]
    },
    4: {
      id: 4, name: "Sabedoria", season: "Outono Interior", days: "Dias 22–28",
      hex: "#FBBF24", bg: "#231600", border: "rgba(251,191,36,0.35)", dot: "#FBBF24",
      grad1: "#231600", grad2: "#170F2E", icon: "feather",
      desc: "Energia declinando. O véu entre consciente e inconsciente afina. Crítica interna pode aumentar — use-a para revisão, não autopunição.",
      focus: "Avaliação e Liberação",
      keywords: ["Verdade", "Limites", "Organização", "Perdão"],
      affirmation: "Minha sensibilidade é sabedoria. Confio no processo de deixar ir.",
      rituals: ["Meditação", "Organização", "Escrita livre", "Aromaterapia"],
      avoid: ["Decisões impulsivas", "Comparações", "Excesso de compromissos"]
    }
  };

  var DAILY_PROMPTS = {
    1: "O que meu corpo está pedindo desesperadamente que eu pare de fazer para poder descansar?",
    2: "Qual peso emocional não me serve mais e estou pronta para 'deixar ir' neste ciclo?",
    3: "Se eu me tratasse com a mesma gentileza que trato minha melhor amiga, o que diria a mim mesma?",
    4: "Quais limites preciso estabelecer hoje para proteger minha bolha de energia?",
    5: "O que minha intuição tem sussurrado baixinho que eu tenho ignorado na correria?",
    6: "Se nada fosse impossível, qual semente (sonho ou projeto) eu gostaria de plantar?",
    7: "Qual pequena ação prática posso tomar amanhã para começar a materializar essa intenção?",
    8: "Com a energia voltando, qual projeto ou hobby eu gostaria de retomar?",
    9: "Se eu desenhasse um mapa para meus objetivos deste mês, qual seria o primeiro marco?",
    10: "Minha mente está mais fértil hoje. Quais ideias 'loucas' surgiram?",
    11: "Quem são as pessoas que me inspiram e como posso me conectar com elas hoje?",
    12: "Sinto minha energia subindo. Em qual tarefa desafiadora posso aplicar esse foco extra?",
    13: "Como posso mover meu corpo hoje para celebrar essa vitalidade crescente?",
    14: "Estou prestes a entrar no meu 'Verão Interior'. Como posso me preparar para brilhar?",
    15: "Sinto meu magnetismo pessoal hoje. Como posso usar essa influência para o bem?",
    16: "Qual conversa difícil eu tenho adiado e agora tenho coragem de ter?",
    17: "Se eu não tivesse medo de brilhar demais, o que eu faria ou diria hoje?",
    18: "Estou no meu ápice de energia. Qual grande decisão precisa do meu 'SIM' definitivo?",
    19: "Como posso nutrir minhas conexões mais importantes sem me esgotar?",
    20: "Olhando para minhas conquistas recentes, o que merece ser celebrado?",
    21: "Minha luz ilumina os outros. Quem precisa do meu apoio ou mentoria agora?",
    22: "Sinto a mudança de estação interna. O que meu corpo pede que eu desacelere?",
    23: "Minha crítica interna está alta? Como posso transformar essa voz em conselho sábio?",
    24: "O que não funcionou neste ciclo e estou pronta para perdoar e liberar?",
    25: "Minha sensibilidade é um superpoder. O que ela está me mostrando sobre meus limites?",
    26: "Se eu pudesse me dar um presente de conforto hoje, qual seria?",
    27: "Olhando para trás, qual foi a maior lição de sabedoria que colhi nos últimos 20 dias?",
    28: "Estou pronta para sangrar e renovar. O que desejo deixar morrer para renascer amanhã?"
  };

  var REFLECTION_EXAMPLES = [
    "Hoje percebi que meu corpo está pedindo um ritmo diferente do que minha mente quer impor. Vou tentar me escutar mais.",
    "Senti uma onda súbita de energia criativa! Aproveitei para anotar ideias sem me julgar.",
    "Estive mais sensível e emotiva hoje. Entendi que preciso de um tempo sozinha para processar.",
    "Me senti confiante e com clareza mental. Foi um ótimo dia para tomar decisões que estava adiando.",
    "Minha crítica interna estava alta hoje. Respirei fundo e tentei trocar a cobrança por autocompaixão.",
    "O cansaço bateu forte. Decidi que descansar não é preguiça — é necessidade biológica."
  ];

  var MOODS = ['😌 Calma', '⚡ Energética', '😤 Irritada', '🧠 Focada', '😢 Sensível', '😴 Cansada', '😍 Amorosa', '🌪️ Ansiosa'];

  // ─── SISTEMA DE TEMAS (3 paletas alternáveis) ───
  var THEMES = {
    'noite-lunar': {
      label: 'Noite Lunar', emoji: '🌙', sub: 'mistério e profundidade',
      primary: '#7C3AED', primaryDk: '#6D28D9',
      rose: '#7C3AED', roseDk: '#6D28D9',
      ink: '#FAF5FF', warm: '#E9D5FF',
      muted: '#C084FC', faint: '#9F67FA',
      bg: '#170F2E', surface: '#26184A',
      cream: '#1A0B35', parchment: '#150A2E',
      soft: '#3D2172', lavender: '#4C2A8C',
      border: 'rgba(124,58,237,0.25)', borderLt: 'rgba(124,58,237,0.12)',
      white: '#26184A',
      gold: '#F59E0B', purple: '#C084FC'
    },
    'aurora-boreal': {
      label: 'Aurora Boreal', emoji: '✨', sub: 'frescor e renovação',
      primary: '#06B6D4', primaryDk: '#0891B2',
      rose: '#06B6D4', roseDk: '#0891B2',
      ink: '#F0F9FF', warm: '#CFFAFE',
      muted: '#67E8F9', faint: '#22D3EE',
      bg: '#0D1F2D', surface: '#1A2F3F',
      cream: '#0F2333', parchment: '#0A1A26',
      soft: '#1E3A4D', lavender: '#244A5F',
      border: 'rgba(6,182,212,0.28)', borderLt: 'rgba(6,182,212,0.14)',
      white: '#1A2F3F',
      gold: '#FBBF24', purple: '#8B5CF6'
    },
    'petala-branca': {
      label: 'Pétala Branca', emoji: '🌸', sub: 'leveza e clareza diurna',
      primary: '#7C3AED', primaryDk: '#6D28D9',
      rose: '#7C3AED', roseDk: '#6D28D9',
      ink: '#1C1917', warm: '#44403C',
      muted: '#7C3AED', faint: '#78716C',
      bg: '#FDF4FF', surface: '#FFFFFF',
      cream: '#FAE8FF', parchment: '#F5D0FE',
      soft: '#E9D5FF', lavender: '#C084FC',
      border: 'rgba(124,58,237,0.22)', borderLt: 'rgba(124,58,237,0.10)',
      white: '#FFFFFF',
      gold: '#D97706', purple: '#A855F7'
    }
  };

  // T começa como cópia mutável do tema padrão — populado por applyTheme no init
  var T = (function() { var o = {}; var d = THEMES['noite-lunar']; for (var k in d) if (k !== 'label' && k !== 'emoji' && k !== 'sub') o[k] = d[k]; return o; })();

  function applyTheme(id, opts) {
    var theme = THEMES[id] || THEMES['noite-lunar'];
    Object.keys(theme).forEach(function(k) {
      if (k !== 'label' && k !== 'emoji' && k !== 'sub') T[k] = theme[k];
    });
    var root = document.documentElement;
    var cssMap = {
      '--bg': theme.bg, '--surface': theme.surface,
      '--primary': theme.primary, '--primary-dk': theme.primaryDk,
      '--secondary': theme.purple,
      '--ink': theme.ink, '--warm': theme.warm,
      '--muted': theme.muted, '--faint': theme.faint,
      '--cream': theme.cream, '--parchment': theme.parchment,
      '--soft': theme.soft, '--lavender': theme.lavender,
      '--border': theme.border, '--border-lt': theme.borderLt,
      '--white': theme.ink, '--gold': theme.gold, '--purple': theme.purple
    };
    Object.keys(cssMap).forEach(function(k) { root.style.setProperty(k, cssMap[k]); });
    if (document.body) document.body.style.background = theme.bg;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme.bg);
    state.theme = id;
    lsSet('theme', id);
    if (opts && opts.rerender !== false && document.getElementById('app') && document.getElementById('app').children.length) {
      render();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // APP STATE
  // ─────────────────────────────────────────────────────────────────────────────
  var state = {
    view: 'intro',
    currentDay: 1,
    journalData: {},
    selectedWeek: 1,
    dailyMode: 'quick',
    suggestedDay: null,
    showSaveMsg: false,
    oracleAbort: null,
    theme: 'noite-lunar'
  };
  var saveToastTimer = null;

  // ─── COMPUTED ───
  function getProgressStats() {
    var days = [];
    for (var i = 1; i <= 28; i++) days.push(i);
    var registeredDays = days.filter(function(d) {
      var e = state.journalData[d];
      return e && (e.mood || e.intention || e.reflectionAnswer);
    }).length;
    var streak = 0;
    for (var d = state.currentDay; d >= 1; d--) {
      var e = state.journalData[d];
      if (e && (e.mood || e.intention || e.reflectionAnswer)) streak++;
      else break;
    }
    var cyclesCompleted = state.journalData['monthly_synthesis'] ? 1 : 0;
    var levelLabel = cyclesCompleted >= 3 ? 'Sacerdotisa do Ciclo' : cyclesCompleted >= 1 ? 'Guardiã Lunar' : 'Aprendiz Lunar';
    return { registeredDays: registeredDays, streak: streak, levelLabel: levelLabel };
  }

  function getInsights() {
    var entries = getDayEntries(state.journalData);
    var moodCounts = {};
    entries.forEach(function(pair) {
      var d = pair[1];
      if (d && d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
    });
    var topMoodE = Object.entries(moodCounts).sort(function(a,b) { return b[1]-a[1]; })[0];
    var peakDay = null, peakEnergy = -1, lowDay = null, lowEnergy = 11;
    entries.forEach(function(pair) {
      var e = parseInt(pair[1] && pair[1].physicalLevel);
      if (!isNaN(e)) {
        var n = parseInt(pair[0]);
        if (e > peakEnergy) { peakEnergy = e; peakDay = n; }
        if (e < lowEnergy) { lowEnergy = e; lowDay = n; }
      }
    });
    var days = [];
    for (var i = 1; i <= 28; i++) days.push(i);
    var favPhase = [1,2,3,4].map(function(p) {
      return {
        p: p,
        avg: days.filter(function(d) { return getPhaseByDay(d) === p; }).reduce(function(s, d) {
          return s + (parseInt((state.journalData[d] || {}).physicalLevel) || 0);
        }, 0) / 7
      };
    }).sort(function(a,b) { return b.avg - a.avg; })[0];
    return {
      topMood: topMoodE ? topMoodE[0] : null,
      topMoodCount: topMoodE ? topMoodE[1] : 0,
      peakDay: peakDay,
      peakEnergy: peakEnergy >= 0 ? peakEnergy : null,
      lowDay: lowDay,
      lowEnergy: lowEnergy <= 10 ? lowEnergy : null,
      favoritePhase: entries.length > 0 && favPhase ? PHASES[favPhase.p] : null
    };
  }

  function getNotice() {
    var entries = getDayEntries(state.journalData);
    var lastDay = null;
    entries.forEach(function(pair) {
      var d = pair[1];
      if (d && (d.mood || d.intention || d.reflectionAnswer)) lastDay = parseInt(pair[0]);
    });
    if (!lastDay) return { msg: 'Comece registrando o dia de hoje. Um único check-in já começa a desenhar a sua mandala. 🌙' };
    var diff = state.currentDay - lastDay;
    if (diff >= 3) return { msg: 'Uma pausa de ' + diff + ' dias — está tudo bem. 2 minutos já reconectam você ao seu ciclo. 💛' };
    var week = Math.ceil(state.currentDay / 7);
    var wData = state.journalData['weekly_reflection_' + week] || {};
    if (!wData.energy && !wData.patterns && state.currentDay === week * 7) return { msg: 'Sua semana fechou. "Reflexões" está pronta para receber seu olhar sobre essa fase. 🍂' };
    if (!(state.journalData['monthly_synthesis'] || {}).loveLetter && state.currentDay === 28) return { msg: 'Ciclo completo! Vá até "Síntese" para ver sua mandala e escrever sua carta de amor. 🌸' };
    return null;
  }

  // ─── DATA SAVE ───
  function saveData(dayOrKey, data) {
    var prev = state.journalData[dayOrKey] || {};
    state.journalData[dayOrKey] = Object.assign({}, prev, data);
    lsSetJSON('journalData', state.journalData);
    showSaveToast();
    // Marca registro em lua cheia (para conquista) — apenas em dias 1-28 com conteúdo real
    var n = parseInt(dayOrKey, 10);
    if (!isNaN(n) && n >= 1 && n <= 28 && (data.mood || data.intention || data.reflectionAnswer)) {
      try { if (isFullMoonToday()) lsSet('fullMoonEntry', '1'); } catch(e) {}
    }
    // Atualiza estado de conquistas — pode disparar toast comemorativo
    try { checkNewlyUnlockedAchievements(); } catch(e) {}
  }

  function showSaveToast() {
    state.showSaveMsg = true;
    renderSaveToast();
    clearTimeout(saveToastTimer);
    saveToastTimer = setTimeout(function() { state.showSaveMsg = false; renderSaveToast(); }, 2200);
  }

  function updateCurrentDay(day) {
    state.currentDay = day;
    lsSet('currentDay', day.toString());
    var today = new Date().toISOString().split('T')[0];
    lsSet('cycleStartDate', today);
    lsSet('cycleStartDay', day.toString());
  }

  function setView(v) {
    state.view = v;
    lsSet('view', v);
    render();
    window.scrollTo(0, 0);
  }

  // ─── PROGRESS RING SVG ───
  function progressRingSVG(value, max, size, stroke, color) {
    size = size || 60; stroke = stroke || 5; color = color || T.rose;
    var r = (size - stroke * 2) / 2;
    var c = 2 * Math.PI * r;
    var pct = Math.min(1, value / max);
    return '<div style="position:relative;width:' + size + 'px;height:' + size + 'px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
      '<svg width="' + size + '" height="' + size + '" style="transform:rotate(-90deg);position:absolute">' +
      '<circle cx="' + (size/2) + '" cy="' + (size/2) + '" r="' + r + '" fill="none" stroke="' + T.soft + '" stroke-width="' + stroke + '"/>' +
      '<circle cx="' + (size/2) + '" cy="' + (size/2) + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - pct)) + '" style="transition:stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)"/>' +
      '</svg>' +
      '<span style="font-family:var(--serif);font-size:' + (size/4.5) + 'px;font-weight:700;color:' + T.ink + ';position:relative;z-index:1">' + value + '</span>' +
      '</div>';
  }

  // ─── TAG ───
  function tag(text, bg, color) {
    bg = bg || T.soft; color = color || T.rose;
    return '<span class="tag" style="background:' + bg + ';color:' + color + '">' + esc(text) + '</span>';
  }

  // ─── MANDALA SVG ───
  function renderMandala(size, clickable) {
    var mobile = isMobile();
    var actualSize = mobile ? Math.min(size, window.innerWidth - 80) : size;
    var days = [];
    for (var i = 1; i <= 28; i++) days.push(i);
    var filled = getDayEntries(state.journalData).filter(function(p) { var d = p[1]; return d && (d.physicalLevel || d.mood); }).length;
    var pct = filled / 28;
    var moodCounts = {};
    getDayEntries(state.journalData).forEach(function(p) { var d = p[1]; if (d && d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1; });
    var topMood = Object.entries(moodCounts).sort(function(a,b) { return b[1]-a[1]; })[0];
    var topEmoji = topMood ? (topMood[0].split(' ')[0]) : '✨';
    var phaseColors = { 1: PHASES[1].hex, 2: PHASES[2].hex, 3: PHASES[3].hex, 4: PHASES[4].hex };

    var svg = '<svg width="' + actualSize + '" height="' + actualSize + '" style="position:absolute;inset:0">';
    [0.87, 0.7, 0.53].forEach(function(r) {
      svg += '<circle cx="' + (actualSize/2) + '" cy="' + (actualSize/2) + '" r="' + (actualSize/2*r-2) + '" fill="none" stroke="' + T.border + '" stroke-width="1" stroke-dasharray="4 7" opacity="0.5"/>';
    });
    days.forEach(function(day, idx) {
      var energy = parseInt((state.journalData[day] || {}).physicalLevel) || 0;
      var angle = (idx / 28 * 360 - 90) * Math.PI / 180;
      var ph = getPhaseByDay(day);
      var color = phaseColors[ph];
      var maxL = actualSize / 2 * 0.35, minL = actualSize / 2 * 0.11;
      var barL = energy > 0 ? minL + (energy / 10) * (maxL - minL) : minL * 0.32;
      var ir = actualSize / 2 * 0.2;
      var isToday = day === state.currentDay;
      var x1 = actualSize/2 + ir * Math.cos(angle), y1 = actualSize/2 + ir * Math.sin(angle);
      var x2 = actualSize/2 + (ir + barL) * Math.cos(angle), y2 = actualSize/2 + (ir + barL) * Math.sin(angle);
      if (clickable) {
        svg += '<g class="mandala-day" data-day="' + day + '" style="cursor:pointer">';
      } else {
        svg += '<g>';
      }
      svg += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (energy > 0 ? color : T.borderLt) + '" stroke-width="' + (isToday ? 5 : 2.5) + '" stroke-linecap="round" opacity="' + (energy > 0 ? 0.85 : 0.3) + '"/>';
      if (isToday && energy > 0) svg += '<circle cx="' + x2 + '" cy="' + y2 + '" r="3.5" fill="' + color + '"/>';
      svg += '</g>';
    });
    svg += '</svg>';

    // Center
    var center = '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">' +
      '<div style="width:' + (actualSize*0.23) + 'px;height:' + (actualSize*0.23) + 'px;border-radius:50%;background:' + T.white + ';border:2px solid ' + T.border + ';box-shadow:inset 0 2px 6px rgba(0,0,0,0.06);display:flex;flex-direction:column;align-items:center;justify-content:center">' +
      '<span style="font-size:' + (actualSize*0.07) + 'px">' + topEmoji + '</span>' +
      '<span style="font-size:' + (actualSize*0.04) + 'px;color:' + T.faint + ';font-weight:600">' + Math.round(pct*100) + '%</span>' +
      '</div></div>';

    // Today indicator
    var a = ((state.currentDay - 1) / 28 * 360 - 90) * Math.PI / 180;
    var r2 = actualSize / 2 * 0.88;
    var todayInd = '<div style="position:absolute;left:' + (actualSize/2 + r2 * Math.cos(a) - 8) + 'px;top:' + (actualSize/2 + r2 * Math.sin(a) - 8) + 'px;pointer-events:none">' +
      '<div style="width:1rem;height:1rem;border-radius:50%;background:' + T.rose + ';border:2px solid ' + T.ink + ';box-shadow:0 2px 8px ' + T.rose + '60;animation:pulse 2s infinite"></div></div>';

    var hint = pct < 0.14 ? '<p style="font-size:0.75rem;color:' + T.faint + ';font-style:italic;text-align:center;max-width:18rem;margin:0.5rem auto 0">🌱 Sua mandala está nascendo. Cada dia registrado a torna mais rica e expressiva.</p>' : '';

    var legend = '<div style="display:flex;gap:0.75rem;flex-wrap:wrap;justify-content:center;margin-top:0.75rem">';
    [{ c: PHASES[1].hex, l: 'Renovação' }, { c: PHASES[2].hex, l: 'Crescimento' }, { c: PHASES[3].hex, l: 'Força' }, { c: PHASES[4].hex, l: 'Sabedoria' }].forEach(function(item) {
      legend += '<span style="display:flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:' + T.muted + '"><span style="width:0.5rem;height:0.5rem;border-radius:50%;background:' + item.c + '"></span>' + item.l + '</span>';
    });
    legend += '</div>';

    return '<div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem">' +
      '<div style="position:relative;width:' + actualSize + 'px;height:' + actualSize + 'px">' + svg + center + todayInd + '</div>' +
      hint + legend + '</div>';
  }

  // ─── FASE LUNAR (sem API — mês sinódico 29.53059d, referência 2000-01-06) ───
  function getLunarPhase() {
    var ref = new Date('2000-01-06T18:14:00Z');
    var cycle = 29.53059;
    var age = ((Date.now() - ref.getTime()) / 86400000 % cycle + cycle) % cycle;
    if (age < 1.85)  return { emoji: '🌑', name: 'Lua Nova' };
    if (age < 7.38)  return { emoji: '🌒', name: 'Lua Crescente' };
    if (age < 9.22)  return { emoji: '🌓', name: 'Quarto Crescente' };
    if (age < 14.76) return { emoji: '🌔', name: 'Gibosa Crescente' };
    if (age < 16.61) return { emoji: '🌕', name: 'Lua Cheia' };
    if (age < 22.15) return { emoji: '🌖', name: 'Gibosa Minguante' };
    if (age < 23.99) return { emoji: '🌗', name: 'Quarto Minguante' };
    return { emoji: '🌘', name: 'Lua Minguante' };
  }

  // ─── DEBOUNCE (preserva foco em inputs/textareas) ───
  function makeDebouncer(fn, delay) {
    var t = null;
    return function() {
      var args = arguments;
      var ctx = this;
      clearTimeout(t);
      t = setTimeout(function() { fn.apply(ctx, args); }, delay);
    };
  }

  // ─── SAVE FEEDBACK INDICATOR (sem perder foco) ───
  function showFieldSaveFeedback(field) {
    if (!field || !field.parentElement) return;
    var parent = field.parentElement;
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    var existing = parent.querySelector('.field-save-check');
    if (existing) existing.remove();
    var check = document.createElement('span');
    check.className = 'field-save-check';
    check.setAttribute('aria-hidden', 'true');
    check.textContent = '✓';
    check.style.cssText = 'position:absolute;right:0.625rem;bottom:0.5rem;color:#10B981;font-size:0.875rem;font-weight:700;opacity:0;transition:opacity 0.25s ease;pointer-events:none;text-shadow:0 0 8px rgba(16,185,129,0.4)';
    parent.appendChild(check);
    requestAnimationFrame(function() { check.style.opacity = '1'; });
    setTimeout(function() {
      check.style.opacity = '0';
      setTimeout(function() { if (check.parentElement) check.remove(); }, 280);
    }, 1500);
  }

  // ─── SAUDAÇÃO DINÂMICA ───
  function getDynamicGreeting() {
    var h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Bom dia';
    if (h >= 12 && h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  // ─── RELÓGIO AO VIVO (singleton, sem memory leak) ───
  var _clockInterval = null;
  function initClock() {
    if (_clockInterval) return;
    _clockInterval = setInterval(function() {
      var el = document.getElementById('live-clock');
      if (!el) return;
      var now = new Date();
      el.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }, 1000);
  }

  // ─── PWA INSTALL ───
  var deferredInstallPrompt = null;

  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredInstallPrompt = e;
    setTimeout(function() {
      var banner = document.getElementById('pwa-android-banner');
      if (banner && !isInStandaloneMode() && !lsGet('pwaInstallDismissed')) banner.style.display = 'flex';
    }, 2500);
  });

  window.addEventListener('appinstalled', function() {
    deferredInstallPrompt = null;
    lsSet('pwaInstallDismissed', '1');
    var banner = document.getElementById('pwa-android-banner');
    if (banner) banner.style.display = 'none';
  });

  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream; }
  function isInStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches || !!window.navigator.standalone;
  }

  function showIOSInstallModal() {
    var el = document.getElementById('pwa-ios-modal');
    if (!el || isInStandaloneMode() || lsGet('pwaInstallDismissed')) return;
    el.innerHTML =
      '<div style="position:fixed;inset:0;z-index:210;display:flex;align-items:flex-end;justify-content:center">' +
        '<div id="pwa-ios-bg" style="position:absolute;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px)"></div>' +
        '<div style="position:relative;width:100%;max-width:26rem;background:#26184A;border-radius:1.75rem 1.75rem 0 0;padding:1.75rem;padding-bottom:calc(1.75rem + env(safe-area-inset-bottom,0px));box-shadow:0 -20px 60px rgba(0,0,0,0.55);animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1)">' +
          '<div style="width:2.5rem;height:0.3rem;background:rgba(124,58,237,0.4);border-radius:9999px;margin:0 auto 1.25rem"></div>' +
          '<div style="text-align:center;margin-bottom:1.25rem"><span style="font-size:2.5rem">🌙</span>' +
            '<h3 style="font-family:var(--serif);font-size:1.25rem;color:#FAF5FF;font-weight:700;margin:0.5rem 0 0.25rem">Instalar no iPhone</h3>' +
            '<p style="font-size:0.8125rem;color:#C084FC;margin:0">Adicione à Tela de Início para acesso rápido</p></div>' +
          '<div style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.5rem">' +
            '<div style="display:flex;align-items:center;gap:0.875rem;padding:0.875rem;background:rgba(124,58,237,0.15);border-radius:1rem;border:1px solid rgba(124,58,237,0.3)">' +
              '<div style="width:2.25rem;height:2.25rem;min-width:2.25rem;border-radius:50%;background:#7C3AED;display:flex;align-items:center;justify-content:center">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF5FF" stroke-width="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></div>' +
              '<div><span style="font-size:0.7rem;font-weight:700;color:#9F67FA;display:block;margin-bottom:0.125rem">PASSO 1</span>' +
                '<span style="font-size:0.875rem;color:#FAF5FF">Toque em <strong>Compartilhar</strong> na barra do Safari</span></div></div>' +
            '<div style="display:flex;align-items:center;gap:0.875rem;padding:0.875rem;background:rgba(124,58,237,0.15);border-radius:1rem;border:1px solid rgba(124,58,237,0.3)">' +
              '<div style="width:2.25rem;height:2.25rem;min-width:2.25rem;border-radius:50%;background:#7C3AED;display:flex;align-items:center;justify-content:center">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF5FF" stroke-width="2.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg></div>' +
              '<div><span style="font-size:0.7rem;font-weight:700;color:#9F67FA;display:block;margin-bottom:0.125rem">PASSO 2</span>' +
                '<span style="font-size:0.875rem;color:#FAF5FF">Role e toque em <strong>Adicionar à Tela de Início</strong></span></div></div>' +
            '<div style="display:flex;align-items:center;gap:0.875rem;padding:0.875rem;background:rgba(124,58,237,0.15);border-radius:1rem;border:1px solid rgba(124,58,237,0.3)">' +
              '<div style="width:2.25rem;height:2.25rem;min-width:2.25rem;border-radius:50%;background:#7C3AED;display:flex;align-items:center;justify-content:center">' +
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF5FF" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>' +
              '<div><span style="font-size:0.7rem;font-weight:700;color:#9F67FA;display:block;margin-bottom:0.125rem">PASSO 3</span>' +
                '<span style="font-size:0.875rem;color:#FAF5FF">Toque em <strong>Adicionar</strong> para confirmar</span></div></div>' +
          '</div>' +
          '<button type="button" id="pwa-ios-dismiss" style="width:100%;padding:0.9375rem;border-radius:9999px;background:#7C3AED;color:#FAF5FF;font-weight:700;font-size:0.9375rem;border:none;cursor:pointer;font-family:var(--sans);min-height:48px;touch-action:manipulation">Entendido ✨</button>' +
        '</div></div>';
    el.classList.remove('hidden');
    document.getElementById('pwa-ios-bg').onclick = dismissIOSModal;
    document.getElementById('pwa-ios-dismiss').onclick = dismissIOSModal;
  }

  function dismissIOSModal() {
    lsSet('pwaInstallDismissed', '1');
    var el = document.getElementById('pwa-ios-modal');
    if (el) { el.innerHTML = ''; el.classList.add('hidden'); }
  }

  function injectPWAContainers() {
    if (document.getElementById('pwa-android-banner')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div id="pwa-android-banner" style="display:none;position:fixed;bottom:calc(5.75rem + env(safe-area-inset-bottom,0px));left:1rem;right:1rem;z-index:85;background:#26184A;border-radius:1.25rem;padding:0.875rem 1rem;box-shadow:0 8px 32px rgba(0,0,0,0.55);border:1px solid rgba(124,58,237,0.4);align-items:center;gap:0.75rem">' +
        '<span style="font-size:1.75rem;flex-shrink:0">🌙</span>' +
        '<div style="flex:1;min-width:0">' +
          '<p style="font-weight:700;font-size:0.875rem;color:#FAF5FF;margin:0 0 0.125rem">Instalar Diário Lunar</p>' +
          '<p style="font-size:0.7rem;color:#C084FC;margin:0">Acesso rápido na tela inicial</p>' +
        '</div>' +
        '<button type="button" id="pwa-android-install" style="background:#7C3AED;color:#FAF5FF;border:none;border-radius:9999px;padding:0.5rem 1rem;font-weight:700;font-size:0.8rem;cursor:pointer;min-height:44px;min-width:44px;touch-action:manipulation;font-family:var(--sans);flex-shrink:0;white-space:nowrap">Instalar</button>' +
        '<button type="button" id="pwa-android-dismiss" aria-label="Fechar" style="background:none;border:none;color:#9F67FA;cursor:pointer;padding:0.375rem;min-width:44px;min-height:44px;font-size:1.1rem;touch-action:manipulation;display:flex;align-items:center;justify-content:center">✕</button>' +
      '</div>' +
      '<div id="pwa-ios-modal" class="hidden"></div>';
    document.body.appendChild(wrap);
    document.getElementById('pwa-android-install').onclick = function() {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(function() { deferredInstallPrompt = null; });
      }
      document.getElementById('pwa-android-banner').style.display = 'none';
    };
    document.getElementById('pwa-android-dismiss').onclick = function() {
      lsSet('pwaInstallDismissed', '1');
      document.getElementById('pwa-android-banner').style.display = 'none';
    };
  }

  function checkPWAInstall() {
    if (isInStandaloneMode() || lsGet('pwaInstallDismissed')) return;
    if (isIOS()) setTimeout(showIOSInstallModal, 3500);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  function renderHeader() {
    var ps = getProgressStats();
    var phaseId = getPhaseByDay(state.currentDay);
    var phase = PHASES[phaseId];
    var lunarPhase = getLunarPhase();
    var navTabs = [
      { id: 'intro', label: 'Início' }, { id: 'guide', label: 'Guia' },
      { id: 'daily', label: 'Diário' }, { id: 'weekly', label: 'Reflexões' },
      { id: 'summary', label: 'Síntese' }
    ];

    var desktopNav = '<nav class="desktop-nav">';
    navTabs.forEach(function(t) {
      var active = state.view === t.id;
      desktopNav += '<button type="button" data-nav="' + t.id + '" style="padding:0.375rem 0.875rem;border-radius:9999px;font-size:0.875rem;font-weight:700;border:none;cursor:pointer;background:' + (active ? T.white : 'transparent') + ';color:' + (active ? T.rose : T.faint) + ';box-shadow:' + (active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none') + ';transition:all 0.2s;font-family:var(--sans);min-height:36px;touch-action:manipulation">' + t.label + '</button>';
    });
    desktopNav += '</nav>';

    return '<header class="app-header"><div class="app-header-inner">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">' +
        '<button type="button" data-nav="intro" style="display:flex;align-items:center;gap:0.625rem;background:none;border:none;cursor:pointer;padding:0.25rem;touch-action:manipulation" aria-label="Início">' +
          '<div style="background:' + T.rose + '18;padding:0.5rem;border-radius:50%">' + icon('moon', 20, T.rose) + '</div>' +
          '<div class="brand-text">' +
            '<p style="font-family:var(--serif);font-weight:700;color:' + T.ink + ';font-size:1.0625rem;margin:0;line-height:1">Diário Lunar</p>' +
            '<p style="font-size:0.6rem;color:' + T.faint + ';text-transform:uppercase;letter-spacing:0.12em;margin:0">Sincronize seu ciclo</p>' +
          '</div>' +
        '</button>' +
        desktopNav +
        '<div style="display:flex;align-items:center;gap:0.5rem">' +
          '<button type="button" id="header-theme-btn" aria-label="Trocar tema" title="Trocar tema" style="background:' + T.parchment + ';border:1px solid ' + T.border + ';border-radius:50%;width:2.25rem;height:2.25rem;min-width:2.25rem;display:flex;align-items:center;justify-content:center;cursor:pointer;color:' + T.muted + ';font-size:1rem;touch-action:manipulation;flex-shrink:0">🎨</button>' +
          '<div style="text-align:right">' +
            '<p style="font-size:0.8125rem;font-weight:700;color:' + T.ink + ';margin:0;font-variant-numeric:tabular-nums"><span id="live-clock">--:--</span></p>' +
            '<p style="font-size:0.65rem;color:' + T.purple + ';margin:0">' + lunarPhase.emoji + ' ' + lunarPhase.name + '</p>' +
            '<p style="font-size:0.6rem;color:' + T.faint + ';margin:0">Dia ' + state.currentDay + ' · ' + phase.name + '</p>' +
          '</div>' +
          progressRingSVG(ps.registeredDays, 28, 36, 4) +
        '</div>' +
      '</div>' +
      '<div style="height:0.1875rem;background:' + T.border + ';border-radius:9999px;overflow:hidden">' +
        '<div style="height:100%;background:linear-gradient(90deg,' + T.rose + ',' + T.purple + ');border-radius:9999px;width:' + ((ps.registeredDays/28)*100) + '%;transition:width 0.7s ease"></div>' +
      '</div>' +
    '</div></header>';
  }

  function renderBottomTabBar() {
    var tabs = [
      { id: 'intro', icon: 'home', label: 'Início' },
      { id: 'guide', icon: 'bookOpen', label: 'Guia' },
      { id: 'daily', icon: 'notebookPen', label: 'Diário', highlight: true },
      { id: 'weekly', icon: 'layers', label: 'Reflexões' },
      { id: 'summary', icon: 'star', label: 'Síntese' }
    ];
    var html = '<nav class="bottom-tab-bar">';
    tabs.forEach(function(t) {
      var active = state.view === t.id;
      html += '<button type="button" data-nav="' + t.id + '" style="display:flex;flex-direction:column;align-items:center;gap:0.125rem;padding:0.625rem 0.5rem;background:none;border:none;cursor:pointer;color:' + (active ? T.rose : T.faint) + ';position:relative;transition:color 0.15s;font-family:var(--sans);min-width:44px;min-height:48px;touch-action:manipulation;flex:1">';
      if (t.highlight && !active) html += '<span style="position:absolute;top:0.375rem;right:0.5rem;width:0.4375rem;height:0.4375rem;background:' + T.rose + ';border-radius:50%"></span>';
      html += '<div style="padding:0.375rem;border-radius:0.875rem;background:' + (active ? T.rose + '14' : 'transparent') + ';transition:background 0.15s">' + icon(t.icon, 20) + '</div>';
      html += '<span style="font-size:0.6rem;font-weight:600;letter-spacing:0.02em">' + t.label + '</span>';
      if (active) html += '<span style="position:absolute;bottom:0.25rem;width:0.25rem;height:0.25rem;background:' + T.rose + ';border-radius:50%"></span>';
      html += '</button>';
    });
    html += '</nav>';
    return html;
  }

  function renderFAB() {
    var phase = PHASES[getPhaseByDay(state.currentDay)];
    return '<div class="fab-container">' +
      '<div id="fab-panel" class="hidden" style="width:min(20rem,calc(100vw - 2rem));background:' + T.white + ';border-radius:1.5rem;box-shadow:0 20px 60px rgba(0,0,0,0.14);border:1px solid ' + T.border + ';overflow:hidden;animation:scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1)">' +
        '<div style="display:flex;border-bottom:1px solid ' + T.border + '">' +
          '<button type="button" id="fab-tab-assistant" style="flex:1;padding:0.75rem;font-size:0.75rem;font-weight:700;border:none;cursor:pointer;background:none;color:' + T.rose + ';border-bottom:2px solid ' + T.rose + ';transition:all 0.15s;font-family:var(--sans);min-height:44px;touch-action:manipulation">✨ Assistente</button>' +
          '<button type="button" id="fab-tab-map" style="flex:1;padding:0.75rem;font-size:0.75rem;font-weight:700;border:none;cursor:pointer;background:none;color:' + T.faint + ';border-bottom:2px solid transparent;transition:all 0.15s;font-family:var(--sans);min-height:44px;touch-action:manipulation">🧭 Mapa</button>' +
        '</div>' +
        '<div id="fab-content-assistant" style="padding:1rem">' + renderFABAssistant() + '</div>' +
        '<div id="fab-content-map" class="hidden" style="padding:1rem">' + renderFABMap() + '</div>' +
      '</div>' +
      '<button type="button" id="fab-toggle" style="width:3.5rem;height:3.5rem;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;background:' + T.rose + ';box-shadow:0 8px 24px ' + T.rose + '50;transition:all 0.3s;touch-action:manipulation">' + icon('sparkles', 22, T.ink) + '</button>' +
    '</div>';
  }

  function renderFABAssistant() {
    var phase = PHASES[getPhaseByDay(state.currentDay)];
    var dd = state.journalData[state.currentDay] || {};
    var hasToday = !!(dd.mood || dd.intention || dd.reflectionAnswer);
    var filled = getDayEntries(state.journalData).filter(function(p) { var d = p[1]; return d && (d.mood || d.intention || d.reflectionAnswer); });
    var text, cta, nav;
    if (!hasToday) { text = 'Você está na fase de ' + phase.name + '. Um check-in de 2 min já honra sua energia. ✨'; cta = 'Registrar hoje'; nav = 'daily'; }
    else if (!state.journalData.__oracleUsed && filled.length >= 3) { text = filled.length + ' dias registrados! Consulte o Oráculo para um insight personalizado. 🔮'; cta = 'Ir ao Diário'; nav = 'daily'; }
    else { text = 'Você vive o seu ' + phase.season + '. Foco em: ' + phase.focus + ' 💫'; cta = 'Continuar Diário'; nav = 'daily'; }

    return '<p style="font-size:0.875rem;color:' + T.ink + ';line-height:1.6;margin:0 0 0.875rem">' + esc(text) + '</p>' +
      '<div style="display:flex;gap:0.5rem;flex-wrap:wrap">' +
        '<button class="btn btn-sm btn-primary" data-nav="' + nav + '" data-fab-close="1">' + esc(cta) + '</button>' +
        '<button class="btn btn-sm btn-muted" data-nav="intro" data-fab-close="1">Início</button>' +
        '<button class="btn btn-sm btn-muted" data-nav="guide" data-fab-close="1">Guia</button>' +
        '<button class="btn btn-sm btn-muted" data-nav="daily" data-fab-close="1">Diário</button>' +
      '</div>';
  }

  function renderFABMap() {
    var phase = PHASES[getPhaseByDay(state.currentDay)];
    var ps = getProgressStats();
    var daysToWeekly = Math.max(0, Math.min(28, Math.ceil(state.currentDay / 7) * 7) - state.currentDay);
    var navItems = ['intro', 'guide', 'daily', 'weekly', 'summary'];
    var navLabels = { intro: 'Início', guide: 'Guia', daily: 'Diário', weekly: 'Reflexões', summary: 'Síntese' };

    var btns = '<div style="display:flex;flex-wrap:wrap;gap:0.375rem;margin-bottom:0.875rem">';
    navItems.forEach(function(id) {
      var active = state.view === id;
      btns += '<button type="button" data-nav="' + id + '" data-fab-close="1" style="padding:0.35rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:700;border:2px solid ' + (active ? T.rose : T.border) + ';background:' + (active ? T.rose : T.white) + ';color:' + (active ? T.white : T.muted) + ';cursor:pointer;transition:all 0.15s;font-family:var(--sans);touch-action:manipulation;min-height:36px">' + navLabels[id] + '</button>';
    });
    btns += '</div>';

    var mapItems = [
      { l: 'Dia do ciclo', v: state.currentDay + '/28' },
      { l: 'Fase atual', v: phase.name },
      { l: 'Próxima reflexão', v: daysToWeekly === 0 ? 'Disponível hoje' : 'Em ' + daysToWeekly + ' dia(s)' },
      { l: 'Dias registrados', v: ps.registeredDays + '/28' },
      { l: 'Sequência atual', v: ps.streak + ' dia(s)' }
    ];
    var rows = '';
    mapItems.forEach(function(item) {
      rows += '<div style="display:flex;justify-content:space-between;font-size:0.75rem;padding:0.375rem 0;border-bottom:1px solid ' + T.borderLt + '"><span style="color:' + T.faint + '">' + item.l + '</span><span style="font-weight:700;color:' + T.ink + '">' + item.v + '</span></div>';
    });
    // Quick actions: tema + conquistas
    var actions = '<div style="display:flex;gap:0.5rem;margin-top:0.875rem">' +
      '<button type="button" id="fab-action-theme" style="flex:1;padding:0.625rem 0.5rem;border-radius:0.875rem;border:1px solid ' + T.border + ';background:' + T.cream + ';color:' + T.ink + ';font-weight:700;font-size:0.75rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.375rem;font-family:var(--sans);min-height:44px;touch-action:manipulation">🎨 Tema</button>' +
      '<button type="button" id="fab-action-achievements" style="flex:1;padding:0.625rem 0.5rem;border-radius:0.875rem;border:1px solid ' + T.border + ';background:' + T.cream + ';color:' + T.ink + ';font-weight:700;font-size:0.75rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.375rem;font-family:var(--sans);min-height:44px;touch-action:manipulation">🏆 Conquistas</button>' +
    '</div>';
    return btns + rows + actions;
  }

  function renderSaveToast() {
    var el = document.getElementById('save-toast-wrap');
    if (!el) return;
    if (state.showSaveMsg) {
      el.innerHTML = '<div class="save-toast"><div style="background:' + T.surface + ';color:' + T.ink + ';padding:0.625rem 1.25rem;border-radius:1.25rem;box-shadow:0 8px 24px rgba(0,0,0,0.45);display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;font-weight:600;animation:fadeIn 0.3s ease;white-space:nowrap;border:1px solid ' + T.border + '">' + icon('checkCircle2', 16, '#22c55e') + ' Salvo</div></div>';
    } else {
      el.innerHTML = '';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW: INTRO
  // ─────────────────────────────────────────────────────────────────────────────
  function renderIntro() {
    var phaseId = getPhaseByDay(state.currentDay);
    var phase = PHASES[phaseId];
    var ps = getProgressStats();
    var ins = getInsights();
    var todayStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    // Capitaliza apenas a primeira letra do dia da semana, mantém "de abril" minúsculo
    todayStr = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);

    var html = '<div style="max-width:56rem;margin:0 auto;display:flex;flex-direction:column;gap:1.25rem;padding-bottom:1.5rem">';

    // Hero
    html += '<div class="hero-section" style="border-color:' + phase.border + ';background:linear-gradient(145deg,' + phase.grad1 + ',' + phase.grad2 + ')">' +
      '<div class="hero-pad" style="padding:1.75rem">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem;gap:0.75rem">' +
          '<div style="flex:1;min-width:0">' +
            '<div style="display:inline-flex;align-items:center;gap:0.375rem;background:' + T.rose + ';color:' + T.ink + ';font-size:0.65rem;font-weight:800;padding:0.25rem 0.75rem;border-radius:9999px;margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.07em">' +
              '<span style="width:0.375rem;height:0.375rem;border-radius:50%;background:rgba(255,255,255,0.8);animation:pulse 2s infinite;display:inline-block"></span> Você está aqui' +
            '</div>' +
            '<h2 class="hero-title">Fase de ' + phase.name + '</h2>' +
            '<p style="font-size:0.8125rem;color:' + T.muted + ';margin:0">' + phase.season + ' · ' + phase.days + '</p>' +
            '<p style="font-size:0.75rem;color:' + T.faint + ';margin:0.25rem 0 0">' + getDynamicGreeting() + ' · ' + todayStr + '</p>' +
          '</div>' +
          '<div style="padding:0.875rem;border-radius:1.25rem;background:rgba(255,255,255,0.08);backdrop-filter:blur(8px);border:1px solid rgba(192,132,252,0.3);flex-shrink:0">' + icon(phase.icon, 28, phase.hex) + '</div>' +
        '</div>' +
        '<p style="color:' + T.ink + ';line-height:1.7;margin-bottom:1.25rem;font-weight:500;font-size:0.9rem">' + phase.desc + '</p>' +
        '<div style="margin-bottom:1.25rem;padding:1rem 1.125rem;background:rgba(255,255,255,0.06);border-radius:1rem;border:1px solid rgba(192,132,252,0.2);backdrop-filter:blur(8px)">' +
          '<p style="font-size:0.7rem;color:' + T.muted + ';text-transform:uppercase;letter-spacing:0.1em;font-weight:700;margin:0 0 0.5rem">✨ Afirmação do Dia</p>' +
          '<p style="font-family:var(--serif);font-size:1rem;color:' + T.ink + ';font-style:italic;line-height:1.7;margin:0">"' + phase.affirmation + '"</p>' +
        '</div>';

    // Rituals + Focus
    html += '<div class="grid-2col" style="margin-bottom:1.25rem">' +
      '<div style="background:rgba(255,255,255,0.06);border-radius:1rem;padding:0.875rem;border:1px solid rgba(192,132,252,0.2)">' +
        '<p style="font-size:0.7rem;font-weight:700;color:' + T.muted + ';text-transform:uppercase;letter-spacing:0.1em;margin:0 0 0.625rem">🌿 Rituais</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:0.375rem">' + phase.rituals.map(function(r) { return tag(r, 'rgba(124,58,237,0.25)', T.ink); }).join('') + '</div>' +
      '</div>' +
      '<div style="background:rgba(255,255,255,0.06);border-radius:1rem;padding:0.875rem;border:1px solid rgba(192,132,252,0.2)">' +
        '<p style="font-size:0.7rem;font-weight:700;color:' + T.muted + ';text-transform:uppercase;letter-spacing:0.1em;margin:0 0 0.625rem">🎯 Foco</p>' +
        '<p style="font-weight:700;color:' + T.ink + ';font-size:0.875rem;line-height:1.55;margin:0 0 0.5rem">' + phase.focus + '</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:0.375rem">' + phase.keywords.map(function(k) { return tag(k, 'rgba(124,58,237,0.25)', T.ink); }).join('') + '</div>' +
      '</div>' +
    '</div>';

    html += '<div style="display:flex;gap:0.75rem;flex-wrap:wrap">' +
      '<button class="btn btn-lg btn-primary" data-nav="daily">Diário — Dia ' + state.currentDay + ' ' + icon('chevronRight', 18) + '</button>' +
      '<button class="btn btn-md btn-muted" data-nav="guide">' + icon('bookOpen', 15) + ' Guia</button>' +
    '</div></div></div>';

    // Phase selector
    html += '<div><h3 class="section-header" style="border-bottom:none;padding-bottom:0">' + icon('compass', 17, T.rose) + ' Por onde começar hoje?</h3>' +
      '<div class="grid-4phase">';
    [1,2,3,4].forEach(function(id) {
      var p = PHASES[id];
      var isCurrent = id === phaseId;
      html += '<button type="button" data-phase-start="' + id + '" style="position:relative;padding:0.875rem;border-radius:1.25rem;border:2px solid ' + (isCurrent ? p.border : T.border) + ';background:' + (isCurrent ? p.bg : T.white) + ';cursor:pointer;text-align:left;transition:all 0.2s;box-shadow:' + (isCurrent ? '0 4px 16px rgba(0,0,0,0.07)' : 'none') + ';transform:' + (isCurrent ? 'scale(1.04)' : 'scale(1)') + ';font-family:var(--sans);touch-action:manipulation">';
      if (isCurrent) html += '<span style="position:absolute;top:-0.5rem;right:-0.375rem;background:' + T.rose + ';color:' + T.ink + ';font-size:0.5rem;font-weight:800;padding:0.15rem 0.4rem;border-radius:9999px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap">ATUAL</span>';
      html += icon(p.icon, 16, isCurrent ? p.hex : 'rgba(250,245,255,0.45)', 'margin-bottom:0.375rem;display:block') +
        '<p class="phase-btn-label" style="color:' + (isCurrent ? p.hex : T.muted) + '">' + p.name + '</p>' +
        '<p style="font-size:0.6rem;color:' + T.faint + ';margin:0">' + p.days + '</p></button>';
    });
    html += '</div></div>';

    // Progress + Insights
    html += '<div class="intro-stats-grid">';

    // Progress card
    html += '<div class="card-responsive"><h3 class="section-header">' + icon('activity', 17, T.rose) + ' Seu Progresso</h3>' +
      '<div style="display:flex;align-items:center;gap:1.25rem">' +
        progressRingSVG(ps.registeredDays, 28, 72, 6) +
        '<div style="flex:1;min-width:0">' +
          '<div style="margin-bottom:0.625rem"><div style="display:flex;justify-content:space-between;font-size:0.75rem;color:' + T.faint + ';margin-bottom:0.25rem"><span>Registrados</span><span style="font-weight:700;color:' + T.ink + '">' + ps.registeredDays + '/28</span></div>' +
          '<div style="height:0.4375rem;background:' + T.parchment + ';border-radius:9999px;overflow:hidden"><div style="height:100%;background:' + T.rose + ';border-radius:9999px;width:' + ((ps.registeredDays/28)*100) + '%;transition:width 0.8s cubic-bezier(0.34,1.56,0.64,1)"></div></div></div>' +
          '<div style="display:flex;gap:0.75rem;font-size:0.75rem"><div style="text-align:center"><p style="font-size:1.25rem;font-weight:700;color:' + T.rose + ';margin:0;font-family:var(--serif)">' + ps.streak + '</p><p style="color:' + T.faint + ';margin:0">sequência</p></div>' +
          '<div><p style="font-weight:700;font-size:0.8rem;color:' + T.ink + ';margin:0 0 0.125rem">' + ps.levelLabel + '</p><p style="color:' + T.faint + ';font-size:0.7rem;margin:0">nível atual</p></div></div>' +
        '</div></div></div>';

    // Insights card
    html += '<div class="card-responsive"><h3 class="section-header">' + icon('barChart2', 17, T.rose) + ' Insights do Ciclo</h3>';
    if (ins.topMood || ins.peakDay) {
      html += '<div class="grid-2col">';
      [
        { l: 'Humor predominante', v: ins.topMood, s: ins.topMood ? ins.topMoodCount + ' dia(s)' : null },
        { l: 'Pico de energia', v: ins.peakDay ? 'Dia ' + ins.peakDay : null, s: ins.peakEnergy ? ins.peakEnergy + '/10' : null },
        { l: 'Dia mais sensível', v: ins.lowDay ? 'Dia ' + ins.lowDay : null, s: ins.lowEnergy ? ins.lowEnergy + '/10' : null },
        { l: 'Fase favorita', v: ins.favoritePhase ? ins.favoritePhase.name : null, s: 'energia média' }
      ].forEach(function(item) {
        html += '<div style="background:' + T.cream + ';padding:0.75rem;border-radius:0.875rem">' +
          '<p style="font-size:0.6rem;color:' + T.faint + ';text-transform:uppercase;letter-spacing:0.08em;margin:0 0 0.25rem">' + item.l + '</p>' +
          '<p style="font-weight:700;color:' + T.ink + ';font-size:0.8125rem;margin:0 0 0.125rem">' + (item.v ? esc(item.v) : '<span style="color:rgba(250,245,255,0.4);font-weight:400;font-style:italic;font-size:0.7rem">sem dados</span>') + '</p>' +
          (item.s && item.v ? '<p style="font-size:0.65rem;color:' + T.faint + ';margin:0">' + item.s + '</p>' : '') + '</div>';
      });
      html += '</div>';
    } else {
      html += '<div style="text-align:center;padding:2rem 1rem"><div style="width:3.5rem;height:3.5rem;border-radius:50%;background:' + T.parchment + ';display:flex;align-items:center;justify-content:center;margin:0 auto 0.875rem">' + icon('barChart2', 24, T.rose, 'opacity:0.55') + '</div>' +
        '<p style="font-family:var(--serif);font-size:1rem;color:' + T.ink + ';margin:0 0 0.375rem">Sua leitura está vazia</p>' +
        '<p style="font-size:0.8125rem;color:' + T.faint + ';margin:0 0 1rem;line-height:1.5">Registre pelo menos 3 dias para ver padrões.</p>' +
        '<button class="btn btn-sm btn-primary" data-nav="daily">Ir para o Diário</button></div>';
    }
    html += '</div></div>';

    // Mandala preview
    html += '<div class="card-responsive" style="text-align:center"><h3 class="section-header">' + icon('star', 17, T.rose) + ' Prévia da sua Mandala</h3>' +
      '<div id="mandala-intro">' + renderMandala(260, true) + '</div>' +
      '<div style="margin-top:1.25rem"><button class="btn btn-md btn-outline" data-nav="summary">Ver Síntese Completa ' + icon('chevronRight', 15) + '</button></div></div>';

    // Buttons
    html += '<div style="display:flex;justify-content:center;gap:0.75rem;flex-wrap:wrap">' +
      '<button class="btn btn-sm btn-ghost" id="btn-tutorial">' + icon('helpCircle', 14) + ' Ver Tutorial</button>' +
      '<button class="btn btn-sm btn-ghost" id="btn-recalibrate">' + icon('target', 14) + ' Recalibrar Ciclo</button>' +
    '</div>';

    html += '</div>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW: GUIA
  // ─────────────────────────────────────────────────────────────────────────────
  function renderGuide() {
    var phaseId = getPhaseByDay(state.currentDay);
    var html = '<div style="max-width:56rem;margin:0 auto;display:flex;flex-direction:column;gap:1.5rem;padding-bottom:1.5rem">' +
      '<div style="text-align:center;padding-top:0.5rem">' +
        '<h2 style="font-family:var(--serif);font-size:clamp(1.75rem,5vw,2.5rem);color:' + T.ink + ';font-weight:700;margin:0 0 0.5rem">Guia das 4 Fases</h2>' +
        '<p style="color:' + T.faint + ';margin:0;font-size:0.9375rem">Entenda a energia por trás de cada estação interna do seu ciclo.</p>' +
      '</div>';

    [1,2,3,4].forEach(function(id) {
      var p = PHASES[id];
      var isCurrent = id === phaseId;
      html += '<div style="border-radius:1.5rem;overflow:hidden;border:2px solid ' + (isCurrent ? p.border : T.border) + ';background:' + T.white + ';box-shadow:' + (isCurrent ? '0 8px 32px rgba(0,0,0,0.07)' : '0 1px 4px rgba(0,0,0,0.04)') + '">';
      if (isCurrent) html += '<div style="height:4px;background:linear-gradient(90deg,' + p.grad1 + ',' + p.hex + ')"></div>';
      html += '<div style="padding:1.5rem;' + (isCurrent ? 'background:linear-gradient(145deg,' + p.grad1 + '60,transparent)' : '') + '">' +
        '<div class="guide-card-inner">' +
          '<div style="display:flex;flex-direction:column;align-items:center;min-width:9rem;padding-top:0.5rem">' +
            '<div style="padding:1.25rem;border-radius:50%;background:' + p.bg + ';border:2px solid ' + p.border + ';margin-bottom:0.875rem">' + icon(p.icon, 32, p.hex) + '</div>' +
            '<h3 style="font-family:var(--serif);font-size:1.375rem;font-weight:700;color:' + p.hex + ';margin:0 0 0.25rem">' + p.name + '</h3>' +
            '<p style="font-size:0.7rem;color:' + T.faint + ';text-transform:uppercase;letter-spacing:0.1em;margin:0 0 0.625rem">' + p.season + '</p>' +
            tag(p.days, p.bg, p.hex) +
          '</div>' +
          '<div style="flex:1;min-width:14rem;display:flex;flex-direction:column;gap:1rem">' +
            '<p style="color:' + T.ink + ';line-height:1.7;font-size:0.9375rem;margin:0">' + p.desc + '</p>' +
            '<div style="padding:1rem;border-radius:1rem;background:' + p.bg + ';border:1px solid ' + p.border + '">' +
              '<p style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:' + T.muted + ';margin:0 0 0.5rem">✨ Afirmação</p>' +
              '<p style="font-family:var(--serif);font-size:0.9375rem;font-style:italic;color:' + p.hex + ';margin:0">"' + p.affirmation + '"</p>' +
            '</div>' +
            '<div class="grid-guide-info">' +
              '<div style="background:' + T.cream + ';padding:0.875rem;border-radius:0.875rem">' +
                '<p style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:' + T.faint + ';margin:0 0 0.5rem;display:flex;align-items:center;gap:0.25rem">' + icon('target', 10) + ' Foco</p>' +
                '<p style="font-weight:700;font-size:0.8125rem;color:' + T.ink + ';margin:0">' + p.focus + '</p></div>' +
              '<div style="background:' + T.cream + ';padding:0.875rem;border-radius:0.875rem">' +
                '<p style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:' + T.faint + ';margin:0 0 0.5rem;display:flex;align-items:center;gap:0.25rem">' + icon('heart', 10) + ' Rituais</p>' +
                '<div style="display:flex;flex-wrap:wrap;gap:0.25rem">' + p.rituals.map(function(r) { return tag(r, T.white, T.warm); }).join('') + '</div></div>' +
              '<div style="background:' + T.cream + ';padding:0.875rem;border-radius:0.875rem">' +
                '<p style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:' + T.faint + ';margin:0 0 0.5rem;display:flex;align-items:center;gap:0.25rem">' + icon('shield', 10) + ' Evite</p>' +
                '<div style="display:flex;flex-wrap:wrap;gap:0.25rem">' + p.avoid.map(function(a) { return tag(a, '#FEF2F2', '#EF4444'); }).join('') + '</div></div>' +
            '</div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:0.375rem">' + p.keywords.map(function(k) { return tag(k, p.bg, p.hex); }).join('') + '</div>' +
          '</div>' +
        '</div></div></div>';
    });
    html += '</div>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW: DIÁRIO
  // ─────────────────────────────────────────────────────────────────────────────
  function renderDaily() {
    var dd = state.journalData[state.currentDay] || {};
    var prompt = DAILY_PROMPTS[state.currentDay] || 'Como posso honrar minha energia hoje?';
    var phaseId = getPhaseByDay(state.currentDay);
    var phase = PHASES[phaseId];

    var labels = { l1: 'Corpo Físico', l2: 'Energia Emocional', intentLabel: '✨ Intenção de hoje', intentHolder: 'Minha intenção é...' };
    if (phaseId === 3) labels = { l1: 'Confiança', l2: 'Energia Social', intentLabel: '🦁 Minha liderança hoje', intentHolder: 'Hoje vou liderar com...' };
    if (phaseId === 4) labels = { l1: 'Sensibilidade', l2: 'Necessidade de Solitude', intentLabel: '🍂 Meu mantra', intentHolder: 'Eu me permito...' };

    var html = '<div style="max-width:44rem;margin:0 auto;display:flex;flex-direction:column;gap:1.25rem;padding-bottom:1.5rem">';

    // Day navigator
    html += '<div style="background:' + T.white + ';border-radius:1.5rem;border:2px solid ' + phase.border + ';overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.04);touch-action:pan-y" id="day-navigator">' +
      '<div style="height:4px;background:linear-gradient(90deg,' + phase.grad1 + ',' + phase.hex + ')"></div>' +
      '<div style="padding:1.125rem">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.875rem">' +
          '<button type="button" id="btn-prev-day"' + (state.currentDay === 1 ? ' disabled' : '') + ' style="width:2.75rem;height:2.75rem;border-radius:50%;border:none;background:' + T.parchment + ';cursor:pointer;display:flex;align-items:center;justify-content:center;color:' + (state.currentDay === 1 ? 'rgba(250,245,255,0.3)' : T.rose) + ';opacity:' + (state.currentDay === 1 ? '0.35' : '1') + ';touch-action:manipulation;flex-shrink:0" aria-label="Dia anterior">' + icon('chevronLeft', 20) + '</button>' +
          '<div style="text-align:center;flex:1" data-nav="guide">' +
            '<div style="display:flex;align-items:center;justify-content:center;gap:0.625rem">' +
              '<span style="font-family:var(--serif);font-size:clamp(2.5rem,8vw,3.25rem);font-weight:700;color:' + phase.hex + ';line-height:1">' + state.currentDay + '</span>' +
              '<div style="text-align:left">' +
                '<p style="font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:' + phase.hex + ';margin:0 0 0.125rem">' + phase.name + '</p>' +
                '<p style="font-size:0.7rem;color:' + T.faint + ';margin:0 0 0.125rem">' + phase.season + '</p>' +
                '<p style="font-size:0.65rem;color:' + T.rose + ';margin:0;display:flex;align-items:center;gap:0.25rem">' + icon('info', 10) + ' ver guia</p>' +
              '</div>' +
            '</div>';

    // Timeline
    html += '<div class="day-timeline">';
    for (var i = 1; i <= 28; i++) {
      var ph = getPhaseByDay(i);
      var phaseColor = PHASES[ph].hex;
      var hasE = !!((state.journalData[i] || {}).mood || (state.journalData[i] || {}).intention);
      var isToday = i === state.currentDay;
      var dotBg = isToday ? T.rose : (hasE ? phaseColor : 'rgba(255,255,255,0.2)');
      var dotShadow = isToday ? '0 0 0 3px rgba(124,58,237,0.35), 0 0 12px rgba(124,58,237,0.55)' : 'none';
      html += '<button type="button" class="timeline-dot" data-day="' + i + '" aria-label="Dia ' + i + '" title="Dia ' + i + '" style="width:10px;height:10px;border-radius:50%;cursor:pointer;transition:all 0.2s ease;background:' + dotBg + ';box-shadow:' + dotShadow + ';flex-shrink:0;touch-action:manipulation;border:none;padding:0"></button>';
    }
    html += '</div>' +
      '<p style="font-size:0.6rem;color:' + T.faint + ';margin:0.375rem 0 0;font-style:italic">← deslize para mudar o dia →</p>' +
    '</div>' +
    '<button type="button" id="btn-next-day"' + (state.currentDay === 28 ? ' disabled' : '') + ' style="width:2.75rem;height:2.75rem;border-radius:50%;border:none;background:' + T.parchment + ';cursor:pointer;display:flex;align-items:center;justify-content:center;color:' + (state.currentDay === 28 ? 'rgba(250,245,255,0.3)' : T.rose) + ';opacity:' + (state.currentDay === 28 ? '0.35' : '1') + ';touch-action:manipulation;flex-shrink:0" aria-label="Próximo dia">' + icon('chevronRight', 20) + '</button></div>';

    // Mode toggle
    html += '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">' +
      '<p style="font-size:0.75rem;color:' + T.faint + ';margin:0">Como quer registrar?</p>' +
      '<div style="background:' + T.parchment + ';padding:0.25rem;border-radius:9999px;display:flex;gap:2px">' +
        '<button type="button" data-mode="quick" style="padding:0.375rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:700;border:none;cursor:pointer;background:' + (state.dailyMode === 'quick' ? T.white : 'transparent') + ';color:' + (state.dailyMode === 'quick' ? T.rose : T.faint) + ';box-shadow:' + (state.dailyMode === 'quick' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none') + ';transition:all 0.2s;font-family:var(--sans);min-height:36px;touch-action:manipulation">⚡ Rápido</button>' +
        '<button type="button" data-mode="deep" style="padding:0.375rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:700;border:none;cursor:pointer;background:' + (state.dailyMode === 'deep' ? T.white : 'transparent') + ';color:' + (state.dailyMode === 'deep' ? T.rose : T.faint) + ';box-shadow:' + (state.dailyMode === 'deep' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none') + ';transition:all 0.2s;font-family:var(--sans);min-height:36px;touch-action:manipulation">🌊 Ritual</button>' +
      '</div></div></div></div>';

    // Check-in card
    html += '<div class="card-responsive"><h3 class="section-header">' + icon('sunrise', 17, phase.hex) + ' Check-in do Dia</h3>' +
      '<div style="margin-bottom:1.25rem"><p style="font-size:0.875rem;font-weight:700;color:' + T.ink + ';margin:0 0 0.75rem">Como você está se sentindo?</p>' +
      '<div class="mood-grid">';
    MOODS.forEach(function(mood) {
      var selected = dd.mood === mood;
      html += '<button type="button" data-mood="' + esc(mood) + '" style="padding:0.5rem 0.875rem;border-radius:0.875rem;border:2px solid ' + (selected ? phase.hex : T.border) + ';background:' + (selected ? phase.hex : T.white) + ';color:' + T.ink + ';font-weight:600;font-size:0.8125rem;cursor:pointer;transition:all 0.15s;transform:' + (selected ? 'scale(1.05)' : 'scale(1)') + ';font-family:var(--sans);touch-action:manipulation;min-height:40px">' + mood + '</button>';
    });
    html += '</div></div>';

    // Sliders
    html += '<div class="daily-sliders-grid">';
    [{ key: 'physicalLevel', label: labels.l1 }, { key: 'emotionalLevel', label: labels.l2 }].forEach(function(s) {
      html += '<div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">' +
        '<label style="font-size:0.8125rem;font-weight:700;color:' + T.ink + '">' + s.label + '</label>' +
        '<span style="font-size:1.25rem;font-weight:700;color:' + phase.hex + ';font-family:var(--serif)">' + (dd[s.key] || 5) + '</span></div>' +
        '<input type="range" min="1" max="10" value="' + (dd[s.key] || 5) + '" data-slider="' + s.key + '" style="width:100%;height:0.625rem;border-radius:9999px;cursor:pointer;accent-color:' + phase.hex + '">' +
        '<div style="display:flex;justify-content:space-between;font-size:0.65rem;color:rgba(250,245,255,0.55);margin-top:0.25rem"><span>Baixa</span><span>Alta</span></div></div>';
    });
    html += '</div>';

    // Intention
    html += '<div><label style="display:block;font-size:0.8125rem;font-weight:700;color:' + phase.hex + ';margin:0 0 0.5rem">' + labels.intentLabel + '</label>' +
      '<input type="text" class="dl-input" id="input-intention" placeholder="' + esc(labels.intentHolder) + '" value="' + esc(dd.intention || '') + '"></div>';

    if (state.dailyMode === 'quick') {
      html += '<div style="margin-top:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem">' +
        '<p style="font-size:0.75rem;color:' + T.faint + ';font-style:italic;margin:0">Check-in salvo automaticamente ✓</p>' +
        '<button class="btn btn-sm btn-ghost" data-mode="deep">Aprofundar → Ritual</button></div>';
    }
    html += '</div>';

    // Deep mode
    if (state.dailyMode === 'deep') {
      // Reflection
      html += '<div style="background:' + T.white + ';border-radius:1.5rem;border:2px solid ' + phase.border + ';padding:1.5rem;position:relative;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.04)">' +
        '<div style="position:absolute;top:0;right:0;padding:1.5rem;opacity:0.025;pointer-events:none;color:' + phase.hex + '">' + icon('star', 140) + '</div>' +
        '<h3 style="font-family:var(--serif);font-size:1.125rem;font-weight:700;margin:0 0 1rem;display:flex;align-items:center;gap:0.5rem;color:' + phase.hex + '">' + icon('star', 18, phase.hex) + ' Reflexão do Dia</h3>' +
        '<p style="font-family:var(--serif);font-size:1.0625rem;color:' + T.ink + ';font-style:italic;margin:0 0 1rem;line-height:1.65">"' + esc(prompt) + '"</p>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.625rem;flex-wrap:wrap;gap:0.5rem">' +
          '<span style="font-size:0.75rem;color:' + T.faint + '">Deixe fluir livremente</span>' +
          '<button class="btn btn-sm btn-muted" id="btn-use-example">Usar exemplo</button></div>' +
        '<textarea class="dl-textarea" id="textarea-reflection" style="height:9rem" placeholder="Deixe sua intuição fluir aqui...">' + esc(dd.reflectionAnswer || '') + '</textarea>' +
        '<div style="margin-top:1rem;display:flex;justify-content:flex-end">' +
          '<button class="btn btn-md btn-magic" id="btn-daily-oracle">' + icon('sparkles', 15) + ' Consultar Oráculo</button></div></div>';

      // Gratitude
      html += '<div class="card-responsive"><h3 class="section-header">' + icon('heart', 17, T.rose) + ' Gratidão</h3>' +
        '<div style="display:flex;flex-direction:column;gap:0.75rem">';
      [1,2,3].forEach(function(n) {
        html += '<div style="display:flex;align-items:center;gap:0.75rem">' +
          '<span style="font-family:var(--serif);font-weight:700;color:' + T.rose + ';font-size:1.125rem;width:1.25rem;text-align:center;flex-shrink:0">' + n + '.</span>' +
          '<input type="text" class="dl-input" data-gratitude="' + n + '" placeholder="Sou grata por..." value="' + esc(dd['gratitude' + n] || '') + '" style="flex:1"></div>';
      });
      html += '</div></div>';

      // Closing
      html += '<div style="border-radius:1.5rem;border:2px solid ' + phase.border + ';padding:1.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.04);background:linear-gradient(145deg,' + phase.grad1 + '30,' + T.white + ')">' +
        '<h3 class="section-header">' + icon('sunset', 17, phase.hex) + ' Fechamento do Dia</h3>' +
        '<div style="display:flex;flex-direction:column;gap:1.25rem">' +
          '<div><label style="font-size:0.8125rem;font-weight:700;color:' + phase.hex + ';margin:0 0 0.5rem;display:flex;align-items:center;gap:0.375rem">' + icon('lightbulb', 14) + ' O que aprendi sobre mim hoje?</label>' +
            '<textarea class="dl-textarea" id="textarea-learning" style="height:5.5rem" placeholder="Hoje notei que...">' + esc(dd.learning || '') + '</textarea></div>' +
          '<div><label style="font-size:0.8125rem;font-weight:700;color:' + phase.hex + ';margin:0 0 0.5rem;display:flex;align-items:center;gap:0.375rem">' + icon('shield', 14) + ' Como vou me cuidar amanhã?</label>' +
            '<input type="text" class="dl-input" id="input-selfcare" placeholder="Vou priorizar..." value="' + esc(dd.selfCareTomorrow || '') + '"></div>' +
        '</div></div>';
    }

    html += '</div>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW: REFLEXÕES SEMANAIS
  // ─────────────────────────────────────────────────────────────────────────────
  function renderWeekly() {
    var p = PHASES[state.selectedWeek];
    var wk = 'weekly_reflection_' + state.selectedWeek;
    var wData = state.journalData[wk] || {};

    var html = '<div style="max-width:56rem;margin:0 auto;display:flex;flex-direction:column;gap:1.5rem;padding-bottom:1.5rem">' +
      '<div style="text-align:center;padding-top:0.5rem">' +
        '<h2 style="font-family:var(--serif);font-size:clamp(1.75rem,5vw,2.5rem);color:' + T.ink + ';font-weight:700;margin:0 0 0.5rem">Reflexões Semanais</h2>' +
        '<p style="color:' + T.faint + ';margin:0 0 1.5rem;font-size:0.9375rem">Feche cada fase com intenção e aprendizado profundo.</p>' +
        '<div style="display:flex;justify-content:center;gap:0.5rem;flex-wrap:wrap">';
    [1,2,3,4].forEach(function(w) {
      var wp = PHASES[w]; var active = w === state.selectedWeek;
      html += '<button type="button" data-week="' + w + '" style="padding:0.5rem 1.125rem;border-radius:9999px;font-size:0.875rem;font-weight:700;border:2px solid ' + (active ? wp.border : T.border) + ';background:' + (active ? wp.bg : T.white) + ';color:' + (active ? wp.hex : T.muted) + ';cursor:pointer;transition:all 0.2s;box-shadow:' + (active ? '0 4px 12px rgba(0,0,0,0.06)' : 'none') + ';font-family:var(--sans);min-height:44px;touch-action:manipulation">Semana ' + w + '</button>';
    });
    html += '</div></div>';

    html += '<div style="background:' + T.white + ';border-radius:1.5rem;border:2px solid ' + p.border + ';overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05)">' +
      '<div style="height:4px;background:linear-gradient(90deg,' + p.grad1 + ',' + p.hex + ')"></div>' +
      '<div style="padding:1.5rem">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.75rem">' +
          '<div style="display:flex;align-items:center;gap:1rem">' +
            '<div style="padding:0.875rem;border-radius:1.125rem;background:' + p.bg + ';border:2px solid ' + p.border + ';flex-shrink:0">' + icon(p.icon, 28, p.hex) + '</div>' +
            '<div><h3 style="font-family:var(--serif);font-size:1.375rem;font-weight:700;color:' + p.hex + ';margin:0 0 0.25rem">Semana ' + state.selectedWeek + ': ' + p.name + '</h3>' +
              '<p style="font-size:0.8125rem;color:' + T.faint + ';margin:0">' + p.season + ' · ' + p.days + '</p></div></div>' +
          '<button class="btn btn-md btn-magic" id="btn-weekly-oracle">' + icon('sparkles', 15) + ' Analisar Padrões</button></div>';

    // Section 1
    html += '<section style="margin-bottom:1.75rem"><h3 class="section-header">' + icon('activity', 17, p.hex) + ' 1. Panorama da Semana</h3>' +
      '<div style="display:flex;flex-direction:column;gap:0.75rem"><div class="weekly-panorama-grid">' +
        '<textarea class="dl-textarea" data-weekly="energy" style="height:7.5rem" placeholder="Como foi sua energia geral? Ex: Comecei mais focada, mas senti cair perto do fim.">' + esc(wData.energy || '') + '</textarea>' +
        '<textarea class="dl-textarea" data-weekly="patterns" style="height:7.5rem" placeholder="Que padrões você notou? Ex: Fico mais crítica comigo na metade da fase.">' + esc(wData.patterns || '') + '</textarea>' +
      '</div>' +
      '<textarea class="dl-textarea" data-weekly="learning" style="height:7.5rem" placeholder="Aprendizado principal: Ex: Aprendi que não preciso carregar o mundo sozinha.">' + esc(wData.learning || '') + '</textarea></div></section>';

    // Section 2
    html += '<section style="margin-bottom:1.75rem"><h3 class="section-header">' + icon('users', 17, p.hex) + ' 2. Conexão e Ajustes</h3><div style="display:flex;flex-direction:column;gap:0.875rem">';
    [
      { key: 'workedWell', label: '✅ O que funcionou?', ph: 'Ex: A pausa para o chá da tarde me ajudou a resetar o foco.' },
      { key: 'adjustments', label: '🔧 O que ajustar?', ph: 'Ex: Preciso largar o celular uma hora antes de dormir.' }
    ].forEach(function(item) {
      html += '<div style="background:' + p.bg + ';padding:1rem;border-radius:1.25rem;border:1px solid ' + p.border + '">' +
        '<label style="display:block;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:' + p.hex + ';margin:0 0 0.625rem">' + item.label + '</label>' +
        '<input type="text" class="dl-input" data-weekly="' + item.key + '" placeholder="' + esc(item.ph) + '" value="' + esc(wData[item.key] || '') + '"></div>';
    });
    html += '</div></section>';

    // Section 3
    html += '<section style="margin-bottom:1.75rem"><h3 class="section-header">' + icon('trendingUp', 17, p.hex) + ' 3. Evolução Pessoal</h3><div class="weekly-habits-grid">';
    [
      { key: 'habitsKeep', label: '💚 Hábitos para manter', ph: 'Ex: Escrever no diário toda manhã.' },
      { key: 'habitsChange', label: '⚡ Para transformar', ph: 'Ex: Parar de me cobrar tanto.' }
    ].forEach(function(item) {
      html += '<div style="background:' + p.bg + ';border:1px solid ' + p.border + ';padding:1.125rem;border-radius:1.25rem">' +
        '<h4 style="font-size:0.875rem;font-weight:700;color:' + p.hex + ';margin:0 0 0.75rem">' + item.label + '</h4>' +
        '<textarea class="dl-textarea" data-weekly="' + item.key + '" placeholder="' + esc(item.ph) + '" style="height:6rem">' + esc(wData[item.key] || '') + '</textarea></div>';
    });
    html += '</div></section>';

    // Section 4
    html += '<section style="margin-bottom:1.75rem"><h3 class="section-header">' + icon('penTool', 17, p.hex) + ' 4. Espaço Criativo</h3>' +
      '<div style="border:3px dashed ' + T.border + ';border-radius:1.5rem;padding:1.5rem;text-align:center;background:' + T.cream + '60">' +
        icon('layout', 28, 'rgba(250,245,255,0.4)', 'margin:0 auto 0.625rem;display:block') +
        '<p style="font-size:0.8125rem;color:rgba(250,245,255,0.55);margin:0 0 0.875rem">Espaço livre: palavras, rituais, visualizações...</p>' +
        '<textarea class="dl-textarea" data-weekly="creativeSpace" style="height:9rem;text-align:center;font-family:var(--serif);font-size:1rem;background:transparent;border:none;resize:none" placeholder="Escreva, liste, imagine...">' + esc(wData.creativeSpace || '') + '</textarea></div></section>';

    // Section 5
    html += '<section><h3 class="section-header">' + icon('heart', 17, p.hex) + ' 5. Gratidão Profunda</h3>' +
      '<div style="background:' + p.bg + ';border:2px solid ' + p.border + ';border-radius:1.25rem;overflow:hidden">' +
        '<textarea class="dl-textarea" data-weekly="gratitude" style="height:6.5rem;text-align:center;font-family:var(--serif);font-size:1rem;background:transparent;border:none" placeholder="Nesta fase de ' + p.name + ', sou grata por...">' + esc(wData.gratitude || '') + '</textarea></div></section>';

    html += '</div></div></div>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VIEW: SÍNTESE
  // ─────────────────────────────────────────────────────────────────────────────
  function renderSummary() {
    var days = [];
    for (var i = 1; i <= 28; i++) days.push(i);
    var moodCounts = {};
    getDayEntries(state.journalData).forEach(function(p) { var m = (p[1] || {}).mood || '—'; moodCounts[m] = (moodCounts[m] || 0) + 1; });
    var topMood = Object.entries(moodCounts).sort(function(a,b) { return b[1]-a[1]; })[0];
    var mData = state.journalData['monthly_synthesis'] || {};
    var ps = getProgressStats();

    var phaseStats = [1,2,3,4].map(function(phaseId) {
      var pDays = days.filter(function(d) { return getPhaseByDay(d) === phaseId; });
      var avgEnergy = pDays.reduce(function(s, d) { return s + (parseInt((state.journalData[d] || {}).physicalLevel) || 0); }, 0) / pDays.length;
      var registered = pDays.filter(function(d) { return (state.journalData[d] || {}).mood || (state.journalData[d] || {}).intention; }).length;
      return { phase: PHASES[phaseId], avgEnergy: avgEnergy.toFixed(1), registered: registered, total: pDays.length };
    });

    var html = '<div style="max-width:64rem;margin:0 auto;display:flex;flex-direction:column;gap:1.5rem;padding-bottom:1.5rem">' +
      '<div style="text-align:center;padding-top:0.5rem">' +
        '<div style="display:inline-flex;padding:1.125rem;background:linear-gradient(135deg,' + T.soft + ',' + T.lavender + ');border-radius:50%;margin-bottom:1.125rem">' + icon('star', 36, T.rose) + '</div>' +
        '<h2 class="summary-title">Síntese do Ciclo</h2>' +
        '<p style="color:' + T.faint + ';margin:0 0 1.25rem;font-size:0.9375rem">Honre sua jornada. Celebre sua sabedoria.</p>' +
        '<div style="display:flex;justify-content:center;gap:0.625rem">' +
          '<button class="btn btn-sm btn-outline" id="btn-export-pdf">' + icon('barChart2', 14) + ' PDF</button>' +
          '<button class="btn btn-sm btn-outline" id="btn-export-image">' + icon('image', 14) + ' Imagem</button>' +
        '</div></div>';

    html += '<div id="printable-summary" style="display:flex;flex-direction:column;gap:1.5rem">';

    // Mandala
    html += '<div class="card-responsive" style="border-top:4px solid ' + T.rose + '"><h3 class="section-header">' + icon('compass', 17, T.rose) + ' 1. Sua Mandala de Energia</h3>' +
      '<div class="mandala-wrap">' + renderMandala(280, true) +
        '<div style="max-width:16rem;width:100%;display:flex;flex-direction:column;gap:0.875rem">' +
          '<div style="background:' + T.cream + ';padding:1.125rem;border-radius:1.125rem;border:1px solid ' + T.border + '">' +
            '<p style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:' + T.faint + ';font-weight:700;margin:0 0 0.875rem">Estatísticas do Ciclo</p>';
    [
      { l: 'Dias registrados', v: ps.registeredDays + '/28' },
      { l: 'Melhor sequência', v: ps.streak + ' dias' },
      { l: 'Humor predominante', v: topMood ? topMood[0] : '—' },
      { l: 'Nível', v: ps.levelLabel }
    ].forEach(function(item) {
      html += '<div style="display:flex;justify-content:space-between;align-items:center;font-size:0.8125rem;padding:0.375rem 0;border-bottom:1px solid ' + T.borderLt + '"><span style="color:' + T.faint + '">' + item.l + '</span><span style="font-weight:700;color:' + T.ink + '">' + esc(item.v) + '</span></div>';
    });
    html += '</div></div></div></div>';

    // Phase analysis
    html += '<div class="card-responsive"><h3 class="section-header">' + icon('barChart', 17, T.rose) + ' 2. Análise Energética por Fase</h3><div class="grid-4col">';
    phaseStats.forEach(function(ps) {
      var ph = ps.phase;
      html += '<div style="padding:1.125rem;border-radius:1.125rem;background:' + ph.bg + ';border:2px solid ' + ph.border + ';text-align:center">' +
        icon(ph.icon, 24, ph.hex, 'margin:0 auto 0.5rem;display:block') +
        '<p style="font-weight:700;font-size:0.875rem;color:' + ph.hex + ';margin:0 0 0.375rem">' + ph.name + '</p>' +
        '<p style="font-family:var(--serif);font-size:1.75rem;font-weight:700;color:' + T.ink + ';margin:0 0 0.25rem;line-height:1">' + ps.avgEnergy + '</p>' +
        '<p style="font-size:0.65rem;color:' + T.faint + ';text-transform:uppercase;letter-spacing:0.08em;margin:0 0 0.625rem">energia média</p>' +
        '<div style="background:rgba(255,255,255,0.5);border-radius:9999px;height:0.375rem;overflow:hidden;margin-bottom:0.5rem"><div style="height:100%;background:' + ph.dot + ';border-radius:9999px;width:' + ((parseFloat(ps.avgEnergy)/10)*100) + '%;transition:width 0.7s ease"></div></div>' +
        '<p style="font-size:0.65rem;color:' + T.faint + ';margin:0">' + ps.registered + '/' + ps.total + ' dias</p></div>';
    });
    html += '</div></div>';

    // Discoveries + Evolution
    html += '<div class="grid-synthesis">' +
      '<div class="card-responsive"><h3 class="section-header">' + icon('sparkles', 17, T.rose) + ' 3. Principais Descobertas</h3>';
    [1,2,3].forEach(function(n) {
      html += '<div style="position:relative;margin-bottom:0.75rem"><span style="position:absolute;left:0.75rem;top:0.875rem;font-family:var(--serif);color:' + T.rose + ';font-weight:700;font-size:1rem">' + n + '.</span>' +
        '<textarea class="dl-textarea" data-synthesis="discovery' + n + '" style="height:5rem;padding-left:2rem" placeholder="Descoberta ' + n + '...">' + esc(mData['discovery' + n] || '') + '</textarea></div>';
    });
    html += '</div>';

    html += '<div class="card-responsive"><h3 class="section-header">' + icon('trendingUp', 17, T.rose) + ' 4. Evolução & Crescimento</h3>';
    [
      { k: 'evolution', label: 'Comparado ao ciclo anterior:', ph: 'Sinto que evoluí em...' },
      { k: 'honor', label: 'Honra ao Feminino:', ph: 'Honrei meu ciclo quando...' }
    ].forEach(function(item) {
      html += '<div style="margin-bottom:1rem"><label style="display:block;font-size:0.7rem;font-weight:700;color:' + T.rose + ';text-transform:uppercase;letter-spacing:0.08em;margin:0 0 0.5rem">' + item.label + '</label>' +
        '<textarea class="dl-textarea" data-synthesis="' + item.k + '" style="height:5.5rem" placeholder="' + esc(item.ph) + '">' + esc(mData[item.k] || '') + '</textarea></div>';
    });
    html += '</div></div>';

    // Love letter
    html += '<div class="card-responsive" style="background:linear-gradient(145deg,' + T.cream + ',' + T.white + ');border:2px solid ' + T.border + '">' +
      '<h3 class="section-header">' + icon('heart', 17, T.rose) + ' 5. Carta de Amor para Mim Mesma</h3>' +
      '<div style="position:relative;padding:1.5rem;border:2px solid ' + T.rose + '20;border-radius:1.5rem;background:' + T.white + ';box-shadow:inset 0 2px 12px rgba(0,0,0,0.03)">' +
        '<textarea class="dl-textarea" data-synthesis="loveLetter" style="height:10rem;text-align:center;font-family:var(--serif);font-size:1.0625rem;line-height:1.7;background:transparent;border:none" placeholder="Querido corpo, querida alma... Eu te agradeço por me sustentar em cada fase.">' + esc(mData.loveLetter || '') + '</textarea></div>' +
      '<div class="grid-next-cycle">';
    [
      { k: 'nextCycle', label: '🔮 Próximo Ciclo', ph: 'Vou experimentar...' },
      { k: 'newRitual', label: '🌿 Novo Ritual', ph: 'Vou praticar...' },
      { k: 'selfCareFocus', label: '💛 Autocuidado', ph: 'Vou priorizar...' }
    ].forEach(function(item) {
      html += '<div style="text-align:center"><p style="font-weight:700;font-size:0.875rem;color:' + T.ink + ';margin:0 0 0.5rem">' + item.label + '</p>' +
        '<input type="text" class="dl-input" data-synthesis="' + item.k + '" placeholder="' + esc(item.ph) + '" value="' + esc(mData[item.k] || '') + '" style="text-align:center"></div>';
    });
    html += '</div></div>';

    // Calendar + Mosaic
    html += '<div class="card-responsive"><h3 class="section-header">' + icon('calendar', 17, T.rose) + ' 6. Mosaico do Ciclo & Calendário Lunar 2026</h3>' +
      '<div class="grid-lunar">';

    // Lunar calendar
    html += '<div style="background:linear-gradient(145deg,#1C0B3D,#26184A);border-radius:1.25rem;padding:1.25rem;color:' + T.ink + '">' +
      '<h4 style="font-family:var(--serif);font-size:1.0625rem;font-weight:700;text-align:center;margin-bottom:1.125rem;display:flex;align-items:center;justify-content:center;gap:0.5rem">' + icon('moon', 18) + ' Ciclos Lunares 2026</h4>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.875rem">';
    [
      { title: 'Luas Novas 🌑', data: lunarCalendar2026.newMoons, sub: false },
      { title: 'Luas Cheias 🌕', data: lunarCalendar2026.fullMoons, sub: true }
    ].forEach(function(group) {
      html += '<div><p style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;opacity:0.7;margin:0 0 0.625rem">' + group.title + '</p>' +
        '<div style="display:flex;flex-direction:column;gap:0.3rem;max-height:12rem;overflow-y:auto;-webkit-overflow-scrolling:touch">';
      group.data.forEach(function(m) {
        html += '<div style="background:rgba(255,255,255,0.1);border-radius:0.5rem;padding:0.4rem 0.625rem;font-size:0.75rem">' +
          '<p style="font-weight:700;margin:0">' + parseLocalDate(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) + '</p>' +
          (group.sub && m.name ? '<p style="opacity:0.6;font-size:0.65rem;margin:0">' + m.name + '</p>' : '') + '</div>';
      });
      html += '</div></div>';
    });
    html += '</div>' +
      '<div style="margin-top:0.875rem;padding:0.625rem;background:rgba(255,255,255,0.1);border-radius:0.75rem;font-size:0.7rem;text-align:center;opacity:0.85;font-style:italic">' + icon('sparkles', 11, '', 'display:inline;margin-right:0.25rem') + ' Novas: plantar intenções · Cheias: celebrar colheitas</div></div>';

    // Day mosaic
    html += '<div><p style="font-size:0.8125rem;color:' + T.faint + ';margin:0 0 0.875rem">Toque em qualquer dia para ver ou editar.</p>' +
      '<div style="display:flex;justify-content:space-between;font-size:0.6rem;color:' + T.faint + ';text-transform:uppercase;letter-spacing:0.07em;margin:0 0 0.5rem"><span>Renovação</span><span>Crescimento</span><span>Força</span><span>Sabedoria</span></div>' +
      '<div class="day-mosaic-grid">';
    days.forEach(function(day) {
      var de = state.journalData[day] || {};
      var ph = getPhaseByDay(day);
      var mood = de.mood;
      var energy = de.physicalLevel || 0;
      var hasEntry = de.mood || de.intention || de.reflectionAnswer;
      var isToday = day === state.currentDay;
      var bgMap = { 1: PHASES[1].bg, 2: PHASES[2].bg, 3: PHASES[3].bg, 4: PHASES[4].bg };
      html += '<button type="button" data-mosaic-day="' + day + '" style="aspect-ratio:1;border-radius:0.625rem;background:' + bgMap[ph] + ';display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid ' + (isToday ? T.rose : hasEntry ? T.border : 'transparent') + ';cursor:pointer;transition:all 0.15s;transform:' + (isToday ? 'scale(1.08)' : 'scale(1)') + ';box-shadow:' + (isToday ? '0 4px 12px ' + T.rose + '30' : 'none') + ';position:relative;font-family:var(--sans);touch-action:manipulation">';
      if (isToday) html += '<span style="position:absolute;top:-0.375rem;right:-0.375rem;width:0.5rem;height:0.5rem;background:' + T.rose + ';border:2px solid ' + T.surface + ';border-radius:50%"></span>';
      html += '<span style="font-size:0.5rem;font-weight:700;position:absolute;top:0.15rem;left:0.25rem;color:' + (isToday ? T.rose : hasEntry ? T.muted : 'rgba(250,245,255,0.35)') + '">' + day + '</span>';
      if (mood) html += '<span style="font-size:0.875rem">' + mood.split(' ')[0] + '</span>';
      else html += '<span style="width:0.3rem;height:0.3rem;border-radius:50%;background:rgba(255,255,255,0.2)"></span>';
      if (parseInt(energy) > 0) html += '<div style="position:absolute;bottom:0.2rem;width:60%;height:0.2rem;background:rgba(255,255,255,0.7);border-radius:9999px;overflow:hidden"><div style="height:100%;background:' + T.rose + '90;border-radius:9999px;width:' + ((parseInt(energy)/10)*100) + '%"></div></div>';
      html += '</button>';
    });
    html += '</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;margin-top:0.875rem">';
    [{ bg: PHASES[1].bg, l: 'Renovação' }, { bg: PHASES[2].bg, l: 'Crescimento' }, { bg: PHASES[3].bg, l: 'Força' }, { bg: PHASES[4].bg, l: 'Sabedoria' }].forEach(function(item) {
      html += '<span style="display:flex;align-items:center;gap:0.375rem;font-size:0.7rem;color:' + T.muted + '"><span style="width:0.75rem;height:0.75rem;border-radius:0.25rem;background:' + item.bg + ';border:1px solid ' + T.border + '"></span>' + item.l + '</span>';
    });
    html += '</div></div></div></div>';

    html += '</div></div>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MODALS
  // ─────────────────────────────────────────────────────────────────────────────

  function showOracleModal(type, loading, content) {
    var el = document.getElementById('oracle-modal');
    if (!el) return;
    var mobile = isMobile();
    el.innerHTML = '<div id="oracle-overlay" style="position:fixed;inset:0;z-index:200;display:flex;align-items:' + (mobile ? 'flex-end' : 'center') + ';justify-content:center;padding:' + (mobile ? '0' : '1rem') + ';background:rgba(0,0,0,0.52);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)">' +
      '<div class="oracle-modal-card">' +
        '<div style="height:4px;background:linear-gradient(90deg,' + T.rose + ',' + T.purple + ',' + T.gold + ')"></div>' +
        '<div style="padding:' + (mobile ? '1.5rem 1.25rem' : '2rem') + '">' +
          (mobile ? '<div style="width:2.5rem;height:0.3rem;background:' + T.border + ';border-radius:9999px;margin:0 auto 1.25rem"></div>' : '') +
          '<button type="button" id="btn-close-oracle" style="position:absolute;top:1rem;right:1rem;background:' + T.parchment + ';border:none;border-radius:50%;width:2.25rem;height:2.25rem;cursor:pointer;display:flex;align-items:center;justify-content:center;color:' + T.muted + ';touch-action:manipulation">' + icon('x', 16) + '</button>' +
          '<div style="text-align:center;margin-bottom:1.5rem">' +
            '<div style="display:inline-flex;padding:1rem;background:linear-gradient(135deg,' + T.soft + ',' + T.lavender + ');border-radius:50%;margin-bottom:0.875rem">' + icon('sparkles', 28, T.rose) + '</div>' +
            '<h3 style="font-family:var(--serif);font-size:1.5rem;color:' + T.ink + ';font-weight:700;margin:0 0 0.25rem">' + (type === 'daily' ? 'Insight do Dia' : 'Mentoria Semanal') + '</h3>' +
            '<p style="font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;color:' + T.gold + ';margin:0;font-weight:700">Sabedoria Estelar</p></div>' +
          (loading ?
            '<div style="display:flex;flex-direction:column;align-items:center;padding:2.5rem 0;gap:1rem">' +
              '<div style="position:relative;width:4rem;height:4rem">' +
                '<div style="position:absolute;inset:0;border-radius:50%;border:4px solid ' + T.soft + '"></div>' +
                '<div style="position:absolute;inset:0;border-radius:50%;border:4px solid transparent;border-top-color:' + T.rose + ';animation:spin 1s linear infinite"></div>' +
                '<div style="position:absolute;inset:0;margin:auto;display:flex;align-items:center;justify-content:center">' + icon('moon', 20, T.rose) + '</div></div>' +
              '<p style="font-size:0.875rem;color:' + T.faint + '">Consultando as estrelas...</p></div>'
            :
            '<div style="background:linear-gradient(135deg,' + T.cream + ',' + T.parchment + ');padding:1.5rem;border-radius:1rem;border:1px solid ' + T.soft + ';max-height:40vh;overflow-y:auto;-webkit-overflow-scrolling:touch">' +
              '<p style="font-family:var(--serif);font-size:1.125rem;color:' + T.ink + ';font-style:italic;line-height:1.7;text-align:center;margin:0">"' + esc(content || '') + '"</p></div>'
          ) +
          '<div style="margin-top:1.5rem;text-align:center"><button class="btn btn-md btn-outline" id="btn-close-oracle-2">Gratidão ✨</button></div>' +
        '</div></div></div>';
    el.classList.remove('hidden');
    document.getElementById('btn-close-oracle').onclick = closeOracleModal;
    document.getElementById('btn-close-oracle-2').onclick = closeOracleModal;
    var overlay = document.getElementById('oracle-overlay');
    if (overlay) overlay.onclick = function(e) { if (e.target === overlay) closeOracleModal(); };
  }

  function closeOracleModal() {
    if (state.oracleAbort) state.oracleAbort.abort();
    var el = document.getElementById('oracle-modal');
    if (el) { el.innerHTML = ''; el.classList.add('hidden'); }
  }

  // ─── CONFIRM MODAL ───
  function showConfirmModal(opts) {
    var el = document.getElementById('confirm-modal');
    if (!el) return;
    el.innerHTML = '<div id="confirm-overlay" style="position:fixed;inset:0;z-index:220;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)">' +
      '<div style="position:relative;width:100%;max-width:24rem;background:' + T.surface + ';border-radius:1.75rem;padding:1.75rem;box-shadow:0 20px 60px rgba(0,0,0,0.55);border:1px solid ' + T.border + ';animation:scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)">' +
        '<div style="text-align:center;margin-bottom:1.25rem">' +
          '<div style="display:inline-flex;align-items:center;justify-content:center;width:3.75rem;height:3.75rem;border-radius:50%;background:' + T.cream + ';margin-bottom:0.875rem;font-size:1.875rem;border:1px solid ' + T.border + '">' + (opts.iconEmoji || '✨') + '</div>' +
          '<h3 style="font-family:var(--serif);font-size:clamp(1.125rem,4vw,1.3125rem);color:' + T.ink + ';font-weight:700;margin:0 0 0.5rem">' + esc(opts.title) + '</h3>' +
          '<p style="font-size:0.875rem;color:' + T.muted + ';line-height:1.6;margin:0">' + esc(opts.desc) + '</p>' +
          (opts.note ? '<p style="font-size:0.75rem;color:' + T.faint + ';margin:0.625rem 0 0;font-style:italic">' + esc(opts.note) + '</p>' : '') +
        '</div>' +
        '<div style="display:flex;gap:0.625rem">' +
          '<button class="btn btn-md btn-muted" id="confirm-cancel" style="flex:1">' + esc(opts.cancelText || 'Cancelar') + '</button>' +
          '<button class="btn btn-md btn-primary" id="confirm-ok" style="flex:1">' + esc(opts.ctaText) + '</button>' +
        '</div>' +
      '</div></div>';
    el.classList.remove('hidden');
    function close() { el.innerHTML = ''; el.classList.add('hidden'); }
    document.getElementById('confirm-cancel').onclick = close;
    document.getElementById('confirm-overlay').onclick = function(e) { if (e.target.id === 'confirm-overlay') close(); };
    document.getElementById('confirm-ok').onclick = function() { close(); if (opts.onConfirm) opts.onConfirm(); };
  }

  // ─── LOADING OVERLAY ───
  function showLoadingOverlay(text) {
    var el = document.getElementById('loading-overlay');
    if (!el) return;
    el.innerHTML = '<div style="position:fixed;inset:0;z-index:230;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)">' +
      '<div style="background:' + T.surface + ';padding:2rem 2.5rem;border-radius:1.5rem;display:flex;flex-direction:column;align-items:center;gap:1rem;border:1px solid ' + T.border + ';box-shadow:0 20px 60px rgba(0,0,0,0.5);max-width:18rem;text-align:center">' +
        '<div style="position:relative;width:3.5rem;height:3.5rem">' +
          '<div style="position:absolute;inset:0;border-radius:50%;border:3px solid ' + T.soft + '"></div>' +
          '<div style="position:absolute;inset:0;border-radius:50%;border:3px solid transparent;border-top-color:' + T.rose + ';animation:spin 1s linear infinite"></div>' +
          '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.25rem">🌙</div>' +
        '</div>' +
        '<p style="font-size:0.9375rem;color:' + T.ink + ';margin:0;font-weight:600">' + esc(text || 'Processando...') + '</p>' +
      '</div></div>';
    el.classList.remove('hidden');
  }

  function hideLoadingOverlay() {
    var el = document.getElementById('loading-overlay');
    if (el) { el.innerHTML = ''; el.classList.add('hidden'); }
  }

  // ─── SUCCESS TOAST (overlay topo) ───
  function showSuccessToast(text) {
    var el = document.getElementById('success-toast-wrap');
    if (!el) {
      el = document.createElement('div');
      el.id = 'success-toast-wrap';
      document.body.appendChild(el);
    }
    el.innerHTML = '<div style="position:fixed;top:calc(1rem + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:240;background:' + T.surface + ';color:' + T.ink + ';padding:0.875rem 1.5rem;border-radius:9999px;box-shadow:0 8px 28px rgba(0,0,0,0.45);display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;font-weight:600;animation:fadeInDown 0.4s ease;border:1px solid ' + T.border + ';white-space:nowrap;max-width:calc(100vw - 2rem)">' +
      '<span style="color:#22c55e;font-size:1.125rem">✓</span> ' + esc(text) + '</div>';
    setTimeout(function() { if (el) el.innerHTML = ''; }, 2800);
  }

  // ─── THEME PICKER MODAL ───
  function showThemeModal() {
    var el = document.getElementById('theme-modal');
    if (!el) return;
    var current = state.theme || 'noite-lunar';
    var cards = '';
    Object.keys(THEMES).forEach(function(id) {
      var th = THEMES[id];
      var active = id === current;
      cards += '<button type="button" data-theme-id="' + id + '" style="display:flex;align-items:center;gap:0.875rem;padding:0.875rem;border-radius:1rem;border:2px solid ' + (active ? th.primary : T.border) + ';background:' + (active ? th.bg : T.cream) + ';cursor:pointer;text-align:left;transition:all 0.2s;font-family:var(--sans);min-height:64px;touch-action:manipulation;width:100%">' +
        '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:3rem;height:3rem;min-width:3rem;border-radius:50%;background:linear-gradient(135deg,' + th.bg + ',' + th.surface + ');border:1px solid ' + th.border + ';font-size:1.25rem">' + th.emoji + '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<p style="font-weight:700;color:' + (active ? th.primary : T.ink) + ';font-size:0.9375rem;margin:0 0 0.125rem">' + th.label + '</p>' +
          '<p style="font-size:0.75rem;color:' + T.faint + ';margin:0">' + th.sub + '</p>' +
        '</div>' +
        '<div style="display:flex;gap:0.25rem;flex-shrink:0">' +
          '<span style="width:0.875rem;height:0.875rem;border-radius:50%;background:' + th.primary + ';border:1px solid ' + th.border + '"></span>' +
          '<span style="width:0.875rem;height:0.875rem;border-radius:50%;background:' + th.purple + ';border:1px solid ' + th.border + '"></span>' +
          '<span style="width:0.875rem;height:0.875rem;border-radius:50%;background:' + th.gold + ';border:1px solid ' + th.border + '"></span>' +
        '</div>' +
        (active ? '<span style="position:absolute;top:0.5rem;right:0.5rem;font-size:0.7rem;color:' + th.primary + ';font-weight:700">●</span>' : '') +
      '</button>';
    });
    el.innerHTML = '<div id="theme-overlay" style="position:fixed;inset:0;z-index:215;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)">' +
      '<div style="position:relative;width:100%;max-width:24rem;background:' + T.surface + ';border-radius:1.75rem;padding:1.5rem;box-shadow:0 20px 60px rgba(0,0,0,0.55);border:1px solid ' + T.border + ';animation:scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)">' +
        '<button type="button" id="theme-close" aria-label="Fechar" style="position:absolute;top:0.875rem;right:0.875rem;background:' + T.parchment + ';border:none;border-radius:50%;width:2.25rem;height:2.25rem;cursor:pointer;display:flex;align-items:center;justify-content:center;color:' + T.muted + ';touch-action:manipulation">' + icon('x', 16) + '</button>' +
        '<div style="text-align:center;margin-bottom:1.25rem">' +
          '<div style="font-size:1.875rem;margin-bottom:0.375rem">🎨</div>' +
          '<h3 style="font-family:var(--serif);font-size:1.25rem;color:' + T.ink + ';font-weight:700;margin:0 0 0.25rem">Escolha seu tema</h3>' +
          '<p style="font-size:0.8125rem;color:' + T.faint + ';margin:0">Cada tema cria uma sensação diferente</p>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;gap:0.625rem">' + cards + '</div>' +
      '</div></div>';
    el.classList.remove('hidden');
    function close() { el.innerHTML = ''; el.classList.add('hidden'); }
    document.getElementById('theme-close').onclick = close;
    document.getElementById('theme-overlay').onclick = function(e) { if (e.target.id === 'theme-overlay') close(); };
    document.querySelectorAll('[data-theme-id]').forEach(function(btn) {
      btn.onclick = function() {
        var id = btn.getAttribute('data-theme-id');
        applyTheme(id);
        close();
        showSuccessToast('Tema "' + THEMES[id].label + '" aplicado');
      };
    });
  }

  // ─── CONQUISTAS (ACHIEVEMENTS) ───
  var ACHIEVEMENTS = [
    { id: 'firstSeed', emoji: '🌱', name: 'Primeira Semente', desc: 'Primeiro registro feito', total: 1 },
    { id: 'sevenNights', emoji: '🌙', name: '7 Noites', desc: '7 dias de registros', total: 7 },
    { id: 'fullCycle', emoji: '✦', name: 'Ciclo Completo', desc: '28 registros realizados', total: 28 },
    { id: 'oracle', emoji: '🔮', name: 'Oráculo Consultado', desc: 'Primeiro insight lido', total: 1 },
    { id: 'scribe', emoji: '📖', name: 'Escriba Lunar', desc: '10 entradas no diário', total: 10 },
    { id: 'fullMoon', emoji: '🌕', name: 'Lua Cheia', desc: 'Registrou durante uma lua cheia', total: 1 },
    { id: 'faithful', emoji: '💜', name: 'Fiel ao Ciclo', desc: '3 meses de uso', total: 90 },
    { id: 'stellar', emoji: '⭐', name: 'Guardiã Estelar', desc: '6 meses de uso', total: 180 },
    { id: 'master', emoji: '🏆', name: 'Mestra Lunar', desc: '1 ano de uso', total: 365 }
  ];

  function isFullMoonToday() {
    try {
      var todayMs = Date.now();
      return lunarCalendar2026.fullMoons.some(function(m) {
        var d = parseLocalDate(m.date).getTime();
        return Math.abs(todayMs - d) < 86400000 * 1.5;
      });
    } catch(e) { return false; }
  }

  function ensureFirstUseDate() {
    var v = lsGet('firstUseDate');
    if (!v) { v = new Date().toISOString(); lsSet('firstUseDate', v); }
    return v;
  }

  function getAchievementsState() {
    var firstUse = ensureFirstUseDate();
    var daysSinceFirst = Math.max(0, Math.floor((Date.now() - new Date(firstUse).getTime()) / 86400000));
    var entries = getDayEntries(state.journalData).filter(function(p) {
      var d = p[1]; return d && (d.mood || d.intention || d.reflectionAnswer);
    });
    var count = entries.length;
    var hasOracle = !!(state.journalData && state.journalData.__oracleUsed);
    var hasFullMoonEntry = !!lsGet('fullMoonEntry');

    var progressMap = {
      firstSeed: { current: Math.min(1, count), unlocked: count >= 1 },
      sevenNights: { current: Math.min(7, count), unlocked: count >= 7 },
      fullCycle: { current: Math.min(28, count), unlocked: count >= 28 },
      oracle: { current: hasOracle ? 1 : 0, unlocked: hasOracle },
      scribe: { current: Math.min(10, count), unlocked: count >= 10 },
      fullMoon: { current: hasFullMoonEntry ? 1 : 0, unlocked: hasFullMoonEntry },
      faithful: { current: Math.min(90, daysSinceFirst), unlocked: daysSinceFirst >= 90 },
      stellar: { current: Math.min(180, daysSinceFirst), unlocked: daysSinceFirst >= 180 },
      master: { current: Math.min(365, daysSinceFirst), unlocked: daysSinceFirst >= 365 }
    };
    return ACHIEVEMENTS.map(function(a) {
      var p = progressMap[a.id] || { current: 0, unlocked: false };
      return { id: a.id, emoji: a.emoji, name: a.name, desc: a.desc, total: a.total, current: p.current, unlocked: p.unlocked };
    });
  }

  function checkNewlyUnlockedAchievements() {
    var prev = lsGetJSON('unlockedAchievements') || [];
    var current = getAchievementsState().filter(function(a) { return a.unlocked; }).map(function(a) { return a.id; });
    var newly = current.filter(function(id) { return prev.indexOf(id) === -1; });
    if (newly.length > 0) {
      lsSetJSON('unlockedAchievements', current);
      // Mostra toast comemorativo do primeiro recém-desbloqueado
      var first = ACHIEVEMENTS.filter(function(a) { return a.id === newly[0]; })[0];
      if (first) {
        setTimeout(function() {
          showSuccessToast(first.emoji + ' Conquista: ' + first.name);
        }, 600);
      }
    } else if (prev.length === 0 && current.length === 0) {
      lsSetJSON('unlockedAchievements', current);
    }
  }

  function showAchievementsModal() {
    var el = document.getElementById('achievements-modal');
    if (!el) return;
    var list = getAchievementsState();
    var unlockedCount = list.filter(function(a) { return a.unlocked; }).length;
    var cards = '';
    list.forEach(function(a) {
      var pct = Math.round((a.current / a.total) * 100);
      cards += '<div style="position:relative;background:' + (a.unlocked ? T.cream : T.parchment) + ';border:1.5px solid ' + (a.unlocked ? T.rose : T.borderLt) + ';border-radius:1rem;padding:0.875rem;display:flex;flex-direction:column;align-items:center;text-align:center;gap:0.375rem;opacity:' + (a.unlocked ? '1' : '0.55') + ';transition:all 0.2s;' + (a.unlocked ? 'box-shadow:0 0 16px ' + T.rose + '30' : '') + '">' +
        '<div style="font-size:1.875rem;line-height:1;filter:' + (a.unlocked ? 'none' : 'grayscale(1)') + '">' + a.emoji + '</div>' +
        '<p style="font-weight:700;font-size:0.8125rem;color:' + (a.unlocked ? T.ink : T.muted) + ';margin:0;line-height:1.2">' + a.name + '</p>' +
        '<p style="font-size:0.65rem;color:' + T.faint + ';margin:0;line-height:1.3;min-height:1.7rem">' + a.desc + '</p>' +
        '<div style="width:100%;height:0.25rem;background:rgba(255,255,255,0.08);border-radius:9999px;overflow:hidden;margin-top:0.125rem">' +
          '<div style="height:100%;background:' + (a.unlocked ? T.rose : T.faint) + ';width:' + pct + '%;border-radius:9999px;transition:width 0.5s ease"></div>' +
        '</div>' +
        '<p style="font-size:0.6rem;color:' + T.faint + ';margin:0;font-variant-numeric:tabular-nums">' + (a.unlocked ? 'Desbloqueada' : a.current + '/' + a.total) + '</p>' +
        (a.unlocked ? '' : '<span style="position:absolute;top:0.375rem;right:0.5rem;font-size:0.625rem;opacity:0.5">🔒</span>') +
      '</div>';
    });
    var mobile = isMobile();
    el.innerHTML = '<div id="achievements-overlay" style="position:fixed;inset:0;z-index:215;display:flex;align-items:' + (mobile ? 'flex-end' : 'center') + ';justify-content:center;padding:' + (mobile ? '0' : '1rem') + ';background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)">' +
      '<div style="position:relative;width:100%;max-width:30rem;background:' + T.surface + ';border-radius:' + (mobile ? '1.75rem 1.75rem 0 0' : '1.75rem') + ';padding:1.5rem;padding-bottom:calc(1.5rem + env(safe-area-inset-bottom,0px));max-height:90vh;overflow-y:auto;-webkit-overflow-scrolling:touch;box-shadow:0 20px 60px rgba(0,0,0,0.55);border:1px solid ' + T.border + ';animation:' + (mobile ? 'slideUp' : 'scaleIn') + ' 0.35s cubic-bezier(0.16,1,0.3,1)">' +
        '<button type="button" id="achievements-close" aria-label="Fechar" style="position:absolute;top:0.875rem;right:0.875rem;background:' + T.parchment + ';border:none;border-radius:50%;width:2.25rem;height:2.25rem;cursor:pointer;display:flex;align-items:center;justify-content:center;color:' + T.muted + ';touch-action:manipulation;z-index:1">' + icon('x', 16) + '</button>' +
        (mobile ? '<div style="width:2.5rem;height:0.3rem;background:' + T.border + ';border-radius:9999px;margin:0 auto 1rem"></div>' : '') +
        '<div style="text-align:center;margin-bottom:1.25rem">' +
          '<div style="font-size:1.875rem;margin-bottom:0.375rem">🏆</div>' +
          '<h3 style="font-family:var(--serif);font-size:1.25rem;color:' + T.ink + ';font-weight:700;margin:0 0 0.25rem">Suas Conquistas</h3>' +
          '<p style="font-size:0.8125rem;color:' + T.faint + ';margin:0">' + unlockedCount + ' de ' + list.length + ' desbloqueadas</p>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(8.5rem,1fr));gap:0.625rem">' + cards + '</div>' +
      '</div></div>';
    el.classList.remove('hidden');
    function close() { el.innerHTML = ''; el.classList.add('hidden'); }
    document.getElementById('achievements-close').onclick = close;
    document.getElementById('achievements-overlay').onclick = function(e) { if (e.target.id === 'achievements-overlay') close(); };
  }

  function showDayAdvanceModal() {
    if (state.suggestedDay === null || state.suggestedDay === state.currentDay) return;
    var phase = PHASES[getPhaseByDay(state.suggestedDay)];
    var dayDiff = state.suggestedDay - state.currentDay;
    var el = document.getElementById('day-advance-modal');
    if (!el) return;
    el.innerHTML = '<div style="position:fixed;inset:0;z-index:195;display:flex;align-items:flex-end;justify-content:center;padding:1rem">' +
      '<div id="day-advance-bg" style="position:absolute;inset:0;background:rgba(0,0,0,0.22);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)"></div>' +
      '<div style="position:relative;width:100%;max-width:28rem;background:' + T.white + ';border-radius:2rem 2rem 1.5rem 1.5rem;overflow:hidden;box-shadow:0 -20px 60px rgba(0,0,0,0.14);animation:slideUp 0.5s cubic-bezier(0.16,1,0.3,1);padding-bottom:env(safe-area-inset-bottom,0px)">' +
        '<div style="height:4px;background:linear-gradient(90deg,' + phase.hex + ',' + T.rose + ')"></div>' +
        '<div style="padding:1.75rem"><div style="text-align:center;margin-bottom:1.25rem">' +
          '<span style="font-size:2.5rem">🌙</span>' +
          '<h3 style="font-family:var(--serif);font-size:1.25rem;color:' + T.ink + ';margin:0.5rem 0 0.375rem">Sentimos sua falta!</h3>' +
          '<p style="font-size:0.875rem;color:' + T.muted + ';line-height:1.6;margin:0">Baseado no seu ciclo, você está no <strong style="color:' + phase.hex + '">Dia ' + state.suggestedDay + '</strong> hoje' +
            (dayDiff > 0 ? ' (' + dayDiff + ' dia' + (dayDiff > 1 ? 's' : '') + ' passaram).' : '.') +
            '<br>Estação: ' + phase.season + ' · ' + phase.name + '</p></div>' +
          '<div style="display:flex;gap:0.75rem">' +
            '<button class="btn btn-md btn-muted" id="btn-dismiss-advance" style="flex:1">Manter Dia ' + state.currentDay + '</button>' +
            '<button class="btn btn-md btn-primary" id="btn-accept-advance" style="flex:1">Ir para Dia ' + state.suggestedDay + ' ✨</button>' +
          '</div></div></div></div>';
    el.classList.remove('hidden');
    document.getElementById('day-advance-bg').onclick = function() { state.suggestedDay = null; el.innerHTML = ''; el.classList.add('hidden'); };
    document.getElementById('btn-dismiss-advance').onclick = function() { state.suggestedDay = null; el.innerHTML = ''; el.classList.add('hidden'); };
    document.getElementById('btn-accept-advance').onclick = function() { updateCurrentDay(state.suggestedDay); state.suggestedDay = null; el.innerHTML = ''; el.classList.add('hidden'); setView('daily'); };
  }

  function showOnboarding() {
    var el = document.getElementById('onboarding-modal');
    if (!el) return;
    var onbStep = 0;
    var onbDate = '';
    var onbFeeling = '';
    var onbIntent = '';

    function renderOnb() {
      var feelings = [['😴', 'Muito cansada, precisando descansar'], ['✨', 'Mais leve, curiosa e criativa'], ['🦁', 'Confiante e cheia de energia'], ['🌊', 'Sensível, intuitiva ou irritadiça']];
      var steps = [
        { emoji: '🌑', title: 'Vamos calibrar seu ciclo', desc: 'Menos de 1 minuto. Torna tudo muito mais personalizado.', ok: !!onbDate },
        { emoji: '💫', title: 'Como você está se sentindo?', desc: 'Isso valida se o cálculo do ciclo faz sentido.', ok: !!onbFeeling },
        { emoji: '🌿', title: 'Sua primeira intenção', desc: 'Qual é a sua intenção suave para hoje?', ok: !!onbIntent }
      ];
      var s = steps[onbStep];
      var isLast = onbStep === steps.length - 1;

      var body = '';
      if (onbStep === 0) {
        body = '<div style="display:flex;flex-direction:column;gap:0.5rem">' +
          '<label style="font-size:0.8125rem;font-weight:600;color:' + T.warm + '">Primeiro dia da última menstruação:</label>' +
          '<input type="date" class="dl-input" id="onb-date" value="' + onbDate + '">' +
          '<p style="font-size:0.75rem;color:' + T.faint + ';margin:0">Usaremos para estimar em que fase você está hoje.</p></div>';
      } else if (onbStep === 1) {
        body = '<div style="display:flex;flex-direction:column;gap:0.5rem">';
        feelings.forEach(function(f) {
          body += '<button type="button" class="onb-feeling-btn" data-feeling="' + esc(f[1]) + '" style="display:flex;align-items:center;gap:0.75rem;padding:0.875rem 1rem;border-radius:1rem;min-height:52px;border:2px solid ' + (onbFeeling === f[1] ? T.rose : T.border) + ';background:' + (onbFeeling === f[1] ? T.rose + '08' : T.white) + ';cursor:pointer;text-align:left;color:' + (onbFeeling === f[1] ? T.rose : T.warm) + ';font-weight:' + (onbFeeling === f[1] ? '700' : '400') + ';transition:all 0.15s;font-family:var(--sans);touch-action:manipulation"><span style="font-size:1.25rem">' + f[0] + '</span><span style="font-size:0.875rem">' + f[1] + '</span></button>';
        });
        body += '</div>';
      } else {
        body = '<textarea class="dl-textarea" id="onb-intent" rows="3" placeholder="Ex: Me permitir descansar sem culpa, ouvindo os sinais do meu corpo.">' + esc(onbIntent) + '</textarea>';
      }

      var dots = '<div style="display:flex;gap:0.375rem;justify-content:center;margin-bottom:1.25rem">';
      steps.forEach(function(_, i) {
        dots += '<div style="height:0.3rem;border-radius:9999px;transition:all 0.3s;width:' + (i === onbStep ? '2rem' : '0.875rem') + ';background:' + (i <= onbStep ? T.rose : T.border) + '"></div>';
      });
      dots += '</div>';

      el.innerHTML = '<div style="position:fixed;inset:0;z-index:190;display:flex;align-items:flex-end;justify-content:center">' +
        '<div id="onb-bg" style="position:absolute;inset:0;background:rgba(0,0,0,0.28);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)"></div>' +
        '<div style="position:relative;width:100%;max-width:32rem;background:' + T.white + ';border-radius:2rem 2rem 0 0;padding:1.75rem;padding-bottom:calc(1.75rem + env(safe-area-inset-bottom,0px));box-shadow:0 -20px 60px rgba(0,0,0,0.14);max-height:95vh;overflow-y:auto;-webkit-overflow-scrolling:touch;animation:slideUp 0.5s cubic-bezier(0.16,1,0.3,1)">' +
          '<div style="width:2.5rem;height:0.3rem;background:' + T.border + ';border-radius:9999px;margin:0 auto 1.5rem"></div>' +
          dots +
          '<div style="text-align:center;margin-bottom:1.25rem"><span style="font-size:2.25rem">' + s.emoji + '</span>' +
            '<h3 style="font-family:var(--serif);font-size:1.25rem;color:' + T.ink + ';font-weight:700;margin:0.5rem 0 0.25rem">' + s.title + '</h3>' +
            '<p style="font-size:0.8125rem;color:' + T.faint + ';margin:0">' + s.desc + '</p></div>' +
          '<div style="margin-bottom:1.5rem">' + body + '</div>' +
          '<div style="display:flex;gap:0.75rem;align-items:center">' +
            '<button type="button" id="onb-skip" style="background:none;border:none;cursor:pointer;font-size:0.75rem;color:' + T.faint + ';font-family:var(--sans);padding:0.5rem;min-height:44px;touch-action:manipulation">Pular por agora</button>' +
            '<div style="flex:1"><button class="btn btn-md btn-primary" id="onb-next" style="width:100%"' + (!s.ok ? ' disabled' : '') + '>' + (isLast ? 'Começar Jornada ✨' : 'Próximo ' + icon('chevronRight', 15)) + '</button></div></div>' +
        '</div></div>';
      el.classList.remove('hidden');

      // Events
      document.getElementById('onb-bg').onclick = skipOnboarding;
      document.getElementById('onb-skip').onclick = skipOnboarding;
      document.getElementById('onb-next').onclick = function() {
        if (isLast) finishOnboarding();
        else { onbStep++; renderOnb(); }
      };
      if (onbStep === 0) {
        var dateInput = document.getElementById('onb-date');
        if (dateInput) dateInput.onchange = function(e) { onbDate = e.target.value; renderOnb(); };
      }
      if (onbStep === 1) {
        document.querySelectorAll('.onb-feeling-btn').forEach(function(btn) {
          btn.onclick = function() { onbFeeling = btn.getAttribute('data-feeling'); renderOnb(); };
        });
      }
      if (onbStep === 2) {
        var intentArea = document.getElementById('onb-intent');
        var nextBtn = document.getElementById('onb-next');
        if (intentArea) {
          // NÃO re-renderiza a cada tecla — apenas atualiza o estado e o botão Próximo
          intentArea.oninput = function(e) {
            onbIntent = e.target.value;
            if (nextBtn) {
              if (onbIntent) nextBtn.removeAttribute('disabled');
              else nextBtn.setAttribute('disabled', 'disabled');
            }
          };
          // Foca automaticamente para conveniência
          setTimeout(function() { intentArea.focus(); }, 50);
        }
      }
    }

    function skipOnboarding() {
      lsSet('onboardingCompleted_v1', 'true');
      el.innerHTML = ''; el.classList.add('hidden');
      var tutSeen = lsGet('tutorialSeen_v5');
      if (!tutSeen) showTutorial();
    }

    function finishOnboarding() {
      var dayOfCycle = 1;
      try {
        var lp = parseLocalDate(onbDate);
        var diff = Math.floor((new Date() - lp) / 86400000);
        dayOfCycle = Math.min(28, Math.max(1, ((diff % 28) + 28) % 28 || 28));
      } catch(e) { dayOfCycle = 1; }
      updateCurrentDay(dayOfCycle);
      if (onbIntent) {
        saveData(dayOfCycle, { intention: onbIntent });
      }
      lsSet('onboardingCompleted_v1', 'true');
      el.innerHTML = ''; el.classList.add('hidden');
      var tutSeen = lsGet('tutorialSeen_v5');
      if (!tutSeen) showTutorial();
      else setView('daily');
    }

    renderOnb();
  }

  function showTutorial() {
    var el = document.getElementById('tutorial-modal');
    if (!el) return;
    var tutStep = 0;
    var steps = [
      { emoji: '🌑', title: 'O seu ciclo em 4 fases', desc: 'Seu ciclo se divide em 4 estações internas. Cada fase tem energia, foco e cuidados únicos. O app te guia por todas elas.' },
      { emoji: '📓', title: 'Diário: coração do app', desc: 'Registre energia, humor e intenção em menos de 2 minutos. No Ritual Completo, mergulhe mais fundo quando quiser.' },
      { emoji: '🔮', title: 'Oráculo & Reflexões', desc: 'O Oráculo usa IA para gerar insights personalizados com base no seu dia e fase. As Reflexões Semanais fecham cada fase com intenção.' },
      { emoji: '🌸', title: 'Sua Mandala do Ciclo', desc: 'A cada dia registrado, sua Mandala se completa. Ela mostra seus padrões de energia — um mapa da sua natureza cíclica.' }
    ];

    function renderTut() {
      var s = steps[tutStep];
      var isLast = tutStep === steps.length - 1;
      var bodyContent = '';

      if (tutStep === 0) {
        bodyContent = '<div class="grid-4phase" style="margin:1rem 0">';
        [1,2,3,4].forEach(function(id) {
          var p = PHASES[id];
          bodyContent += '<div style="background:' + p.bg + ';border:1px solid ' + p.border + ';border-radius:1rem;padding:0.75rem;text-align:center">' +
            icon(p.icon, 18, p.hex, 'display:block;margin:0 auto 0.375rem') +
            '<span style="font-size:0.7rem;font-weight:700;color:' + p.hex + ';display:block">' + p.name + '</span>' +
            '<span style="font-size:0.6rem;color:' + T.faint + '">' + p.days + '</span></div>';
        });
        bodyContent += '</div>';
      } else if (tutStep === 1) {
        bodyContent = '<div style="margin:1rem 0;background:' + T.cream + ';border-radius:1rem;padding:1rem;border:1px solid ' + T.border + '">' +
          '<div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem">' +
            '<div style="background:' + T.rose + '18;padding:0.5rem;border-radius:0.75rem;flex-shrink:0">' + icon('notebookPen', 16, T.rose) + '</div>' +
            '<div><p style="font-weight:700;font-size:0.875rem;color:' + T.ink + ';margin:0">Check-in de hoje</p>' +
              '<p style="font-size:0.75rem;color:' + T.faint + ';margin:0">Dia 15 · Fase Força</p></div></div>' +
          '<div style="display:flex;gap:0.375rem;flex-wrap:wrap">' +
            ['😌 Calma', '⚡ Energética', '😍 Amorosa'].map(function(m) {
              return '<span style="padding:0.25rem 0.625rem;background:' + T.rose + ';color:' + T.ink + ';border-radius:9999px;font-size:0.7rem;font-weight:700">' + m + '</span>';
            }).join('') + '</div></div>';
      } else if (tutStep === 2) {
        bodyContent = '<div style="margin:1rem 0;background:linear-gradient(135deg,#1C0B3D,#26184A);border-radius:1rem;padding:1.25rem;text-align:center;color:' + T.ink + '">' +
          icon('sparkles', 22, '', 'margin:0 auto 0.5rem;opacity:0.8') +
          '<p style="font-family:var(--serif);font-style:italic;font-size:0.875rem;line-height:1.6;opacity:0.9;margin:0">"Sua sensibilidade é sua bússola mais precisa neste momento."</p>' +
          '<p style="font-size:0.65rem;opacity:0.4;margin-top:0.5rem;margin-bottom:0">— Insight gerado pela IA</p></div>';
      } else {
        bodyContent = '<div style="margin:1rem 0;display:flex;justify-content:center"><svg width="100" height="100">';
        [0.88, 0.68, 0.5].forEach(function(r) {
          bodyContent += '<circle cx="50" cy="50" r="' + (50*r-2) + '" fill="none" stroke="' + T.border + '" stroke-width="1" stroke-dasharray="4 6" opacity="0.5"/>';
        });
        for (var i = 0; i < 28; i++) {
          var a = (i / 28 * 360 - 90) * Math.PI / 180;
          var len = 8 + Math.random() * 14;
          var c = i < 7 ? PHASES[1].hex : i < 14 ? PHASES[2].hex : i < 21 ? PHASES[3].hex : PHASES[4].hex;
          bodyContent += '<line x1="' + (50+11*Math.cos(a)) + '" y1="' + (50+11*Math.sin(a)) + '" x2="' + (50+(11+len)*Math.cos(a)) + '" y2="' + (50+(11+len)*Math.sin(a)) + '" stroke="' + c + '" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>';
        }
        bodyContent += '<circle cx="50" cy="50" r="11" fill="' + T.white + '" stroke="' + T.border + '" stroke-width="2"/><text x="50" y="54" text-anchor="middle" font-size="10" fill="' + T.rose + '">✨</text></svg></div>';
      }

      var dots = '<div style="display:flex;gap:0.3rem">';
      steps.forEach(function(_, i) {
        dots += '<button type="button" class="tut-dot" data-dot="' + i + '" style="border-radius:9999px;border:none;cursor:pointer;width:' + (i === tutStep ? '1.5rem' : '0.5rem') + ';height:0.5rem;background:' + (i === tutStep ? T.rose : T.border) + ';padding:0;transition:all 0.2s;touch-action:manipulation"></button>';
      });
      dots += '</div>';

      el.innerHTML = '<div style="position:fixed;inset:0;z-index:180;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,0.42);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)">' +
        '<div class="tutorial-modal">' +
          '<div style="height:3px;background:' + T.border + ';position:relative"><div style="position:absolute;inset:0 auto 0 0;background:' + T.rose + ';border-radius:9999px;transition:width 0.5s;width:' + ((tutStep+1)/steps.length*100) + '%"></div></div>' +
          '<div style="padding:1.75rem">' +
            '<button type="button" id="tut-close" style="position:absolute;top:1rem;right:1rem;width:2rem;height:2rem;border-radius:50%;background:' + T.parchment + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:' + T.faint + ';touch-action:manipulation">' + icon('x', 14) + '</button>' +
            '<div style="text-align:center;margin-bottom:0.5rem"><span style="font-size:2.5rem">' + s.emoji + '</span>' +
              '<h3 style="font-family:var(--serif);font-size:1.25rem;color:' + T.ink + ';font-weight:700;margin:0.5rem 0 0">' + s.title + '</h3></div>' +
            bodyContent +
            '<p style="font-size:0.8125rem;color:' + T.muted + ';line-height:1.6;text-align:center;margin:0 0 1.5rem">' + s.desc + '</p>' +
            '<div style="display:flex;align-items:center;justify-content:space-between">' +
              dots +
              '<button class="btn btn-md btn-primary" id="tut-next">' + (isLast ? 'Começar! 🌙' : 'Próximo ' + icon('chevronRight', 14)) + '</button>' +
            '</div></div></div></div>';
      el.classList.remove('hidden');

      document.getElementById('tut-close').onclick = closeTutorial;
      document.getElementById('tut-next').onclick = function() {
        if (isLast) closeTutorial();
        else { tutStep++; renderTut(); }
      };
      document.querySelectorAll('.tut-dot').forEach(function(btn) {
        btn.onclick = function() { tutStep = parseInt(btn.getAttribute('data-dot')); renderTut(); };
      });
    }

    function closeTutorial() {
      lsSet('tutorialSeen_v5', 'true');
      el.innerHTML = ''; el.classList.add('hidden');
      setView('daily');
    }

    renderTut();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  function render() {
    var root = document.getElementById('app');
    if (!root) return;

    var notice = getNotice();
    var noticeHTML = '';
    if (notice) {
      noticeHTML = '<div style="margin-bottom:1.125rem;display:flex;align-items:flex-start;gap:0.75rem;background:' + T.cream + ';border:2px solid ' + T.soft + ';color:' + T.muted + ';padding:0.875rem 1rem;border-radius:1.125rem;box-shadow:0 1px 4px rgba(0,0,0,0.04);animation:fadeIn 0.5s ease">' +
        icon('sparkles', 16, T.rose, 'margin-top:0.125rem;flex-shrink:0') +
        '<p style="font-size:0.875rem;margin:0;line-height:1.5">' + notice.msg + '</p></div>';
    }

    var content = '';
    if (state.view === 'intro') content = renderIntro();
    else if (state.view === 'guide') content = renderGuide();
    else if (state.view === 'daily') content = renderDaily();
    else if (state.view === 'weekly') content = renderWeekly();
    else if (state.view === 'summary') content = renderSummary();

    root.innerHTML = '<div style="min-height:100vh;background:' + T.bg + ';font-family:var(--sans)">' +
      '<div id="day-advance-modal" class="hidden"></div>' +
      '<div id="onboarding-modal" class="hidden"></div>' +
      '<div id="tutorial-modal" class="hidden"></div>' +
      '<div id="oracle-modal" class="hidden"></div>' +
      '<div id="confirm-modal" class="hidden"></div>' +
      '<div id="theme-modal" class="hidden"></div>' +
      '<div id="achievements-modal" class="hidden"></div>' +
      '<div id="loading-overlay" class="hidden"></div>' +
      renderHeader() +
      '<main class="app-main">' + noticeHTML + content + '</main>' +
      '<div id="save-toast-wrap"></div>' +
      renderBottomTabBar() +
      renderFAB() +
    '</div>';

    bindEvents();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // EVENT BINDINGS
  // ─────────────────────────────────────────────────────────────────────────────
  function bindEvents() {
    // Navigation
    document.querySelectorAll('[data-nav]').forEach(function(btn) {
      btn.onclick = function(e) {
        e.stopPropagation();
        setView(btn.getAttribute('data-nav'));
      };
    });

    // FAB
    var fabToggle = document.getElementById('fab-toggle');
    var fabPanel = document.getElementById('fab-panel');
    if (fabToggle && fabPanel) {
      fabToggle.onclick = function() { fabPanel.classList.toggle('hidden'); };
    }
    var fabTabAssist = document.getElementById('fab-tab-assistant');
    var fabTabMap = document.getElementById('fab-tab-map');
    if (fabTabAssist && fabTabMap) {
      fabTabAssist.onclick = function() {
        document.getElementById('fab-content-assistant').classList.remove('hidden');
        document.getElementById('fab-content-map').classList.add('hidden');
        fabTabAssist.style.color = T.rose; fabTabAssist.style.borderBottom = '2px solid ' + T.rose;
        fabTabMap.style.color = T.faint; fabTabMap.style.borderBottom = '2px solid transparent';
      };
      fabTabMap.onclick = function() {
        document.getElementById('fab-content-map').classList.remove('hidden');
        document.getElementById('fab-content-assistant').classList.add('hidden');
        fabTabMap.style.color = T.rose; fabTabMap.style.borderBottom = '2px solid ' + T.rose;
        fabTabAssist.style.color = T.faint; fabTabAssist.style.borderBottom = '2px solid transparent';
      };
    }
    document.querySelectorAll('[data-fab-close]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (fabPanel) fabPanel.classList.add('hidden');
      });
    });

    // Quick actions no FAB Map: tema + conquistas
    var actTheme = document.getElementById('fab-action-theme');
    if (actTheme) actTheme.onclick = function() {
      if (fabPanel) fabPanel.classList.add('hidden');
      showThemeModal();
    };
    var actAch = document.getElementById('fab-action-achievements');
    if (actAch) actAch.onclick = function() {
      if (fabPanel) fabPanel.classList.add('hidden');
      showAchievementsModal();
    };

    // Botão tema na barra superior
    var headerTheme = document.getElementById('header-theme-btn');
    if (headerTheme) headerTheme.onclick = function() { showThemeModal(); };

    // Phase start buttons
    document.querySelectorAll('[data-phase-start]').forEach(function(btn) {
      btn.onclick = function() {
        var id = parseInt(btn.getAttribute('data-phase-start'));
        updateCurrentDay([1, 8, 15, 22][id - 1]);
        setView('daily');
      };
    });

    // Tutorial & Recalibrate
    var btnTut = document.getElementById('btn-tutorial');
    if (btnTut) btnTut.onclick = function() { showTutorial(); };
    var btnRecal = document.getElementById('btn-recalibrate');
    if (btnRecal) btnRecal.onclick = function() { showOnboarding(); };

    // Daily view events
    if (state.view === 'daily') {
      var btnPrev = document.getElementById('btn-prev-day');
      var btnNext = document.getElementById('btn-next-day');
      if (btnPrev) btnPrev.onclick = function() { if (state.currentDay > 1) { updateCurrentDay(state.currentDay - 1); render(); } };
      if (btnNext) btnNext.onclick = function() { if (state.currentDay < 28) { updateCurrentDay(state.currentDay + 1); render(); } };

      // Timeline dots
      document.querySelectorAll('.timeline-dot').forEach(function(dot) {
        dot.onclick = function(e) { e.stopPropagation(); updateCurrentDay(parseInt(dot.getAttribute('data-day'))); render(); };
      });

      // Mode toggle
      document.querySelectorAll('[data-mode]').forEach(function(btn) {
        btn.onclick = function() { state.dailyMode = btn.getAttribute('data-mode'); lsSet('dailyMode', state.dailyMode); render(); };
      });

      // Mood buttons
      document.querySelectorAll('[data-mood]').forEach(function(btn) {
        btn.onclick = function() {
          if (navigator.vibrate) navigator.vibrate(18);
          saveData(state.currentDay, { mood: btn.getAttribute('data-mood') });
          render();
        };
      });

      // Sliders — sliders devem salvar imediatamente (UX espera resposta instantânea no thumb)
      document.querySelectorAll('[data-slider]').forEach(function(input) {
        var key = input.getAttribute('data-slider');
        var display = input.parentElement.querySelector('span[style*="font-family:var(--serif)"]');
        var debouncedSave = makeDebouncer(function(val) {
          var obj = {}; obj[key] = val;
          saveData(state.currentDay, obj);
        }, 250);
        input.oninput = function() {
          if (display) display.textContent = input.value;
          debouncedSave(input.value);
        };
      });

      // Intention — debounce 800ms preserva foco
      var inputIntention = document.getElementById('input-intention');
      if (inputIntention) {
        var saveIntention = makeDebouncer(function() {
          saveData(state.currentDay, { intention: inputIntention.value });
          showFieldSaveFeedback(inputIntention);
        }, 800);
        inputIntention.oninput = saveIntention;
      }

      // Deep mode fields
      if (state.dailyMode === 'deep') {
        var textReflection = document.getElementById('textarea-reflection');
        if (textReflection) {
          var saveReflection = makeDebouncer(function() {
            saveData(state.currentDay, { reflectionAnswer: textReflection.value });
            showFieldSaveFeedback(textReflection);
          }, 800);
          textReflection.oninput = saveReflection;
        }

        var btnExample = document.getElementById('btn-use-example');
        if (btnExample) btnExample.onclick = function() {
          var ex = REFLECTION_EXAMPLES[Math.floor(Math.random() * REFLECTION_EXAMPLES.length)];
          saveData(state.currentDay, { reflectionAnswer: ex });
          render();
        };

        document.querySelectorAll('[data-gratitude]').forEach(function(input) {
          var n = input.getAttribute('data-gratitude');
          var saveGratitude = makeDebouncer(function() {
            var obj = {}; obj['gratitude' + n] = input.value;
            saveData(state.currentDay, obj);
            showFieldSaveFeedback(input);
          }, 800);
          input.oninput = saveGratitude;
        });

        var textLearning = document.getElementById('textarea-learning');
        if (textLearning) {
          var saveLearning = makeDebouncer(function() {
            saveData(state.currentDay, { learning: textLearning.value });
            showFieldSaveFeedback(textLearning);
          }, 800);
          textLearning.oninput = saveLearning;
        }

        var inputSelfcare = document.getElementById('input-selfcare');
        if (inputSelfcare) {
          var saveSelfcare = makeDebouncer(function() {
            saveData(state.currentDay, { selfCareTomorrow: inputSelfcare.value });
            showFieldSaveFeedback(inputSelfcare);
          }, 800);
          inputSelfcare.oninput = saveSelfcare;
        }

        var btnOracle = document.getElementById('btn-daily-oracle');
        if (btnOracle) btnOracle.onclick = function() {
          var dd = state.journalData[state.currentDay] || {};
          var ph = PHASES[getPhaseByDay(state.currentDay)];
          var ctrl = new AbortController();
          state.oracleAbort = ctrl;
          showOracleModal('daily', true, '');
          var prompt = 'Atue como uma sábia guia feminina e lunar (Oráculo). A usuária está no Dia ' + state.currentDay + ', fase de ' + ph.name + ' (' + ph.season + '). Contexto: ' + ph.desc + '. Dados: Físico:' + (dd.physicalLevel || 5) + '/10, Emocional:' + (dd.emotionalLevel || 5) + '/10, Humor:"' + (dd.mood || '?') + '", Intenção:"' + (dd.intention || '?') + '", Reflexão:"' + (dd.reflectionAnswer || 'silêncio') + '". Insight curto, místico mas prático. Tom acolhedor. Máximo 40 palavras. Português do Brasil.';
          callGeminiOracle(prompt, ctrl.signal).then(function(insight) {
            if (insight !== null) {
              showOracleModal('daily', false, insight);
              saveData('__oracleUsed', { used: true });
            }
          });
        };
      }

      // Swipe on day navigator
      var dayNav = document.getElementById('day-navigator');
      if (dayNav) {
        var touchStartX = null, touchStartY = null;
        dayNav.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }, { passive: true });
        dayNav.addEventListener('touchend', function(e) {
          if (touchStartX === null) return;
          var dx = e.changedTouches[0].clientX - touchStartX;
          var dy = Math.abs(e.changedTouches[0].clientY - (touchStartY || 0));
          touchStartX = null; touchStartY = null;
          if (dy > 40) return;
          if (Math.abs(dx) < 55) return;
          if (dx < 0 && state.currentDay < 28) { updateCurrentDay(state.currentDay + 1); render(); }
          if (dx > 0 && state.currentDay > 1) { updateCurrentDay(state.currentDay - 1); render(); }
        }, { passive: true });
      }
    }

    // Weekly view events
    if (state.view === 'weekly') {
      document.querySelectorAll('[data-week]').forEach(function(btn) {
        btn.onclick = function() { state.selectedWeek = parseInt(btn.getAttribute('data-week')); lsSet('selectedWeek', state.selectedWeek.toString()); render(); };
      });

      document.querySelectorAll('[data-weekly]').forEach(function(el) {
        var key = el.getAttribute('data-weekly');
        var wk = 'weekly_reflection_' + state.selectedWeek;
        var saveWeekly = makeDebouncer(function() {
          var obj = {}; obj[key] = el.value;
          saveData(wk, obj);
          showFieldSaveFeedback(el);
        }, 800);
        el.oninput = saveWeekly;
      });

      var btnWeeklyOracle = document.getElementById('btn-weekly-oracle');
      if (btnWeeklyOracle) btnWeeklyOracle.onclick = function() {
        var wk = 'weekly_reflection_' + state.selectedWeek;
        var wData = state.journalData[wk] || {};
        var ph = PHASES[state.selectedWeek];
        var ctrl = new AbortController();
        state.oracleAbort = ctrl;
        showOracleModal('weekly', true, '');
        var prompt = 'Mentora de ciclos femininos. Fase de ' + ph.name + ' (Semana ' + state.selectedWeek + '). Energia:"' + (wData.energy || 'vazio') + '", Funcionou:"' + (wData.workedWell || 'vazio') + '", Ajustar:"' + (wData.adjustments || 'vazio') + '". Identifique UM padrão e sugira UM ritual. Máximo 60 palavras. Emojis. Português do Brasil.';
        callGeminiOracle(prompt, ctrl.signal).then(function(insight) {
          if (insight !== null) showOracleModal('weekly', false, insight);
        });
      };
    }

    // Summary view events
    if (state.view === 'summary') {
      document.querySelectorAll('[data-synthesis]').forEach(function(el) {
        var key = el.getAttribute('data-synthesis');
        var saveSynthesis = makeDebouncer(function() {
          var obj = {}; obj[key] = el.value;
          saveData('monthly_synthesis', obj);
          showFieldSaveFeedback(el);
        }, 800);
        el.oninput = saveSynthesis;
      });

      document.querySelectorAll('[data-mosaic-day]').forEach(function(btn) {
        btn.onclick = function() {
          updateCurrentDay(parseInt(btn.getAttribute('data-mosaic-day')));
          setView('daily');
        };
      });

      var btnPDF = document.getElementById('btn-export-pdf');
      if (btnPDF) btnPDF.onclick = function() {
        showConfirmModal({
          iconEmoji: '📄',
          title: 'Exportar como PDF',
          desc: 'Gera um documento elegante com sua Mandala de Energia, registros do ciclo atual e insights salvos. Ideal para guardar ou imprimir.',
          note: '⏱ Pode levar alguns segundos.',
          ctaText: 'Gerar PDF',
          cancelText: 'Cancelar',
          onConfirm: function() {
            showLoadingOverlay('Gerando sua mandala...');
            // requestAnimationFrame para liberar a thread antes do trabalho pesado
            requestAnimationFrame(function() {
              loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
                .then(function() { return loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'); })
                .then(function() {
                  var el = document.getElementById('printable-summary');
                  if (!el) throw new Error('no-element');
                  return window.html2canvas(el, { scale: 2, useCORS: true, backgroundColor: T.bg });
                }).then(function(canvas) {
                  if (!canvas) throw new Error('no-canvas');
                  var pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
                  var pw = pdf.internal.pageSize.getWidth();
                  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pw, (canvas.height * pw) / canvas.width);
                  pdf.save('sintese-lunar.pdf');
                  hideLoadingOverlay();
                  showSuccessToast('Mandala exportada com sucesso!');
                }).catch(function() {
                  hideLoadingOverlay();
                  showSuccessToast('Erro ao gerar PDF — tente novamente');
                });
            });
          }
        });
      };

      var btnImage = document.getElementById('btn-export-image');
      if (btnImage) btnImage.onclick = function() {
        showConfirmModal({
          iconEmoji: '🖼',
          title: 'Salvar como Imagem',
          desc: 'Captura sua Mandala de Energia como imagem PNG para compartilhar ou guardar no celular.',
          note: '⏱ Pode levar alguns segundos.',
          ctaText: 'Salvar Imagem',
          cancelText: 'Cancelar',
          onConfirm: function() {
            showLoadingOverlay('Gerando sua mandala...');
            requestAnimationFrame(function() {
              loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
                .then(function() {
                  var el = document.getElementById('printable-summary');
                  if (!el) throw new Error('no-element');
                  return window.html2canvas(el, { scale: 2, useCORS: true, backgroundColor: T.bg });
                }).then(function(canvas) {
                  if (!canvas) throw new Error('no-canvas');
                  var a = document.createElement('a');
                  a.download = 'mandala-lunar-dia-' + state.currentDay + '.png';
                  a.href = canvas.toDataURL();
                  a.click();
                  hideLoadingOverlay();
                  showSuccessToast('Mandala exportada com sucesso!');
                }).catch(function() {
                  hideLoadingOverlay();
                  showSuccessToast('Erro ao gerar imagem — tente novamente');
                });
            });
          }
        });
      };
    }

    // Mandala clicks
    document.querySelectorAll('.mandala-day').forEach(function(g) {
      g.onclick = function() {
        var day = parseInt(g.getAttribute('data-day'));
        updateCurrentDay(day);
        setView('daily');
      };
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────────────────────
  function init() {
    // Load saved data
    try {
      var saved = lsGetJSON('journalData');
      var savedDay = lsGet('currentDay');
      var savedMode = lsGet('dailyMode');
      var savedView = lsGet('view');
      var savedWeek = lsGet('selectedWeek');
      var savedTheme = lsGet('theme');
      if (saved) state.journalData = saved;
      if (savedDay) { var p = parseInt(savedDay, 10); if (!isNaN(p)) state.currentDay = p; }
      if (savedMode) state.dailyMode = savedMode;
      if (savedView && ['intro','guide','daily','weekly','summary'].indexOf(savedView) !== -1) state.view = savedView;
      if (savedWeek) { var w = parseInt(savedWeek, 10); if (!isNaN(w) && w >= 1 && w <= 4) state.selectedWeek = w; }
      // Aplica tema salvo (sem rerender — render() ocorre logo abaixo)
      applyTheme(savedTheme && THEMES[savedTheme] ? savedTheme : 'noite-lunar', { rerender: false });
      ensureFirstUseDate();
    } catch(e) {
      console.warn('Dados corrompidos — resetando.', e);
      lsRemove('journalData');
      lsRemove('currentDay');
    }

    // Check day advance
    var calculated = calcCycleDay();
    var storedDay = parseInt(lsGet('currentDay') || '1', 10);
    if (calculated && calculated !== storedDay && calculated > 0 && calculated <= 28) {
      state.suggestedDay = calculated;
    }

    // Render
    render();

    // Start live clock & PWA install system
    injectPWAContainers();
    initClock();
    checkPWAInstall();

    // Check onboarding/tutorial
    var onboardingDone = lsGet('onboardingCompleted_v1');
    var tutorialSeen = lsGet('tutorialSeen_v5');
    if (!onboardingDone) {
      showOnboarding();
    } else if (!tutorialSeen) {
      showTutorial();
    }

    // Day advance modal
    if (state.suggestedDay !== null) {
      showDayAdvanceModal();
    }

    // Dismiss splash — minimum 2s display
    var ls = document.getElementById('loading-screen');
    if (ls) {
      var elapsed = Date.now() - (window._splashStart || Date.now());
      var delay = Math.max(0, 2000 - elapsed);
      setTimeout(function() {
        ls.classList.add('fade-out');
        setTimeout(function() { if (ls) ls.style.display = 'none'; }, 700);
      }, delay);
    }
  }

  // ─── ECOSYSTEM API ───
  window.CodigoLunar = window.CodigoLunar || {};
  window.CodigoLunar.diariolunar = {
    version: '1.0.0',
    getState: function() { return state; },
    getJournalData: function() { return state.journalData; },
    exportBackup: function() {
      return JSON.stringify({
        app: 'diariolunar',
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        data: {
          journalData: state.journalData,
          currentDay: state.currentDay,
          dailyMode: state.dailyMode
        }
      }, null, 2);
    },
    importBackup: function(jsonStr) {
      try {
        var backup = JSON.parse(jsonStr);
        if (backup.data) {
          state.journalData = backup.data.journalData || {};
          state.currentDay = backup.data.currentDay || 1;
          state.dailyMode = backup.data.dailyMode || 'quick';
          lsSetJSON('journalData', state.journalData);
          lsSet('currentDay', state.currentDay.toString());
          lsSet('dailyMode', state.dailyMode);
          render();
          return true;
        }
      } catch(e) { console.error('Erro ao importar backup:', e); }
      return false;
    }
  };

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
