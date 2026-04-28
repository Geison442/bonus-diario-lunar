"""
Gera os ícones PWA do Diário Lunar.
Saída: icon-192.png, icon-512.png, icon-180.png, icon-maskable-512.png
"""
from PIL import Image, ImageDraw, ImageFilter
import os
import math
import random

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'icons')
os.makedirs(OUT_DIR, exist_ok=True)

# Paleta dark purple
BG_OUTER = (23, 15, 46)      # #170F2E
BG_INNER = (38, 24, 74)      # #26184A
PRIMARY  = (124, 58, 237)    # #7C3AED
SECONDARY = (192, 132, 252)  # #C084FC
LIGHT    = (250, 245, 255)   # #FAF5FF
GLOW     = (192, 132, 252)


def radial_gradient(size, inner, outer, center=None, radius_ratio=0.55):
    """Cria um gradiente radial."""
    img = Image.new('RGB', (size, size), outer)
    px = img.load()
    if center is None:
        center = (size / 2, size / 2)
    cx, cy = center
    max_r = size * radius_ratio
    for y in range(size):
        for x in range(size):
            dx = x - cx
            dy = y - cy
            d = math.sqrt(dx * dx + dy * dy)
            t = min(1.0, d / max_r)
            r = int(inner[0] + (outer[0] - inner[0]) * t)
            g = int(inner[1] + (outer[1] - inner[1]) * t)
            b = int(inner[2] + (outer[2] - inner[2]) * t)
            px[x, y] = (r, g, b)
    return img


def draw_crescent(size, safe_zone_ratio=1.0):
    """
    Desenha o ícone completo: fundo gradiente + lua crescente + estrelas.
    safe_zone_ratio < 1.0 deixa borda extra para versão maskable.
    """
    img = radial_gradient(size, BG_INNER, BG_OUTER)
    draw = ImageDraw.Draw(img, 'RGBA')

    # Centro e raio da lua (dentro da safe zone)
    cx = size / 2
    cy = size / 2
    moon_r = int(size * 0.30 * safe_zone_ratio)

    # Halo/glow externo (várias camadas semi-transparentes)
    glow_layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    for i, (r_off, alpha) in enumerate([(int(moon_r * 1.6), 18),
                                         (int(moon_r * 1.3), 28),
                                         (int(moon_r * 1.1), 42)]):
        glow_draw.ellipse(
            [cx - r_off, cy - r_off, cx + r_off, cy + r_off],
            fill=(GLOW[0], GLOW[1], GLOW[2], alpha)
        )
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=size * 0.04))
    img = Image.alpha_composite(img.convert('RGBA'), glow_layer)
    draw = ImageDraw.Draw(img, 'RGBA')

    # Lua cheia base (lavanda clara)
    moon_box = [cx - moon_r, cy - moon_r, cx + moon_r, cy + moon_r]
    draw.ellipse(moon_box, fill=(SECONDARY[0], SECONDARY[1], SECONDARY[2], 255))

    # Sombra crescente — segundo círculo deslocado para a direita-superior em cor de fundo
    offset = int(moon_r * 0.42)
    shadow_box = [moon_box[0] + offset, moon_box[1] - offset * 0.15,
                  moon_box[2] + offset, moon_box[3] - offset * 0.15]
    draw.ellipse(shadow_box, fill=(BG_INNER[0], BG_INNER[1], BG_INNER[2], 255))

    # Highlight sutil na lua crescente (gradient effect)
    highlight = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(highlight)
    h_box = [moon_box[0] + moon_r * 0.15, moon_box[1] + moon_r * 0.2,
             moon_box[0] + moon_r * 0.85, moon_box[1] + moon_r * 1.0]
    h_draw.ellipse(h_box, fill=(LIGHT[0], LIGHT[1], LIGHT[2], 60))
    highlight = highlight.filter(ImageFilter.GaussianBlur(radius=size * 0.02))
    img = Image.alpha_composite(img, highlight)
    draw = ImageDraw.Draw(img, 'RGBA')

    # Estrelas ao redor (semente fixa para reprodutibilidade)
    rng = random.Random(7)
    n_stars = max(8, size // 32)
    placed = []
    attempts = 0
    while len(placed) < n_stars and attempts < n_stars * 12:
        attempts += 1
        angle = rng.uniform(0, 2 * math.pi)
        dist = rng.uniform(moon_r * 1.55, size * 0.46 * safe_zone_ratio)
        sx = cx + math.cos(angle) * dist
        sy = cy + math.sin(angle) * dist
        # Não sobrepõe o glow do crescente
        if math.hypot(sx - cx, sy - cy) < moon_r * 1.5:
            continue
        # Mantém distância mínima entre estrelas
        if any(math.hypot(sx - px_, sy - py_) < size * 0.06 for px_, py_ in placed):
            continue
        placed.append((sx, sy))
        sr = rng.uniform(size * 0.005, size * 0.012)
        alpha = rng.randint(140, 230)
        # Star com pequeno halo
        star_glow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        sg_draw = ImageDraw.Draw(star_glow)
        sg_draw.ellipse([sx - sr * 3, sy - sr * 3, sx + sr * 3, sy + sr * 3],
                        fill=(LIGHT[0], LIGHT[1], LIGHT[2], 30))
        star_glow = star_glow.filter(ImageFilter.GaussianBlur(radius=size * 0.008))
        img = Image.alpha_composite(img, star_glow)
        draw = ImageDraw.Draw(img, 'RGBA')
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr],
                     fill=(LIGHT[0], LIGHT[1], LIGHT[2], alpha))

    return img.convert('RGB')


def main():
    print('Gerando ícones em', OUT_DIR)

    sizes = [
        ('icon-192.png', 192, 1.0),
        ('icon-512.png', 512, 1.0),
        ('icon-180.png', 180, 1.0),                     # Apple Touch Icon
        ('icon-maskable-512.png', 512, 0.62),           # Safe zone ~40% interior
    ]

    for name, size, sz_ratio in sizes:
        print(f'  -> {name} ({size}x{size}, safe_zone_ratio={sz_ratio})')
        img = draw_crescent(size, safe_zone_ratio=sz_ratio)
        out_path = os.path.join(OUT_DIR, name)
        img.save(out_path, 'PNG', optimize=True)

    # Favicon menor (32x32) para boa qualidade
    print('  -> favicon-32.png (32x32)')
    fav = draw_crescent(64, safe_zone_ratio=1.0).resize((32, 32), Image.LANCZOS)
    fav.save(os.path.join(OUT_DIR, 'favicon-32.png'), 'PNG', optimize=True)

    print('Concluído.')


if __name__ == '__main__':
    main()
