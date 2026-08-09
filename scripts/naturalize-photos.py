import os
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

ASSETS = Path(r"C:\Users\37062\.cursor\projects\c-Users-37062-Projects-minkutis-shop\assets")
OUT = Path(r"C:\Users\37062\Projects\minkutis-shop\public\products\photos")
PUBLIC = Path(r"C:\Users\37062\Projects\minkutis-shop\public")
OUT.mkdir(parents=True, exist_ok=True)

def to_f(img):
    arr = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0
    return arr

def from_f(arr):
    arr = np.clip(arr, 0, 1)
    return Image.fromarray((arr * 255.0 + 0.5).astype(np.uint8), "RGB")

def film_grain(arr, strength=0.018, seed=42):
    rng = np.random.default_rng(seed)
    h, w, _ = arr.shape
    # luminance-weighted grain (stronger in midtones)
    lum = 0.2126 * arr[..., 0] + 0.7152 * arr[..., 1] + 0.0722 * arr[..., 2]
    weight = 1.0 - np.abs(lum - 0.45) * 1.4
    weight = np.clip(weight, 0.25, 1.0)
    noise = rng.normal(0.0, strength, (h, w)).astype(np.float32)
    # slight color noise (sensor-like)
    cnoise = rng.normal(0.0, strength * 0.35, (h, w, 3)).astype(np.float32)
    grain = noise[..., None] * weight[..., None] + cnoise * weight[..., None]
    return arr + grain

def soft_vignette(arr, amount=0.12):
    h, w, _ = arr.shape
    y = np.linspace(-1, 1, h, dtype=np.float32)[:, None]
    x = np.linspace(-1, 1, w, dtype=np.float32)[None, :]
    r = np.sqrt(x * x + y * y)
    r = np.clip((r - 0.35) / 0.95, 0, 1)
    # irregular vignette
    factor = 1.0 - amount * (r ** 1.6)
    return arr * factor[..., None]

def gentle_chromatic(arr, px=0.6):
    h, w, _ = arr.shape
    # shift R/B channels by subpixel amount via roll (integer approx)
    shift = max(1, int(round(px)))
    out = arr.copy()
    out[..., 0] = np.roll(arr[..., 0], shift, axis=1)
    out[..., 2] = np.roll(arr[..., 2], -shift, axis=1)
    # blend lightly so it's subtle
    return arr * 0.85 + out * 0.15

def tone_curve(arr):
    # slight S-curve + warm shadows / cooler-ish highlights reduced
    x = arr
    # soft contrast
    x = x * 0.96 + 0.02
    x = np.clip(x, 0, 1)
    # lift blacks a touch (real cameras rarely crush to pure black)
    x = x * 0.97 + 0.018
    # warm midtones
    warm = np.array([1.02, 0.995, 0.97], dtype=np.float32)
    mid = 1.0 - np.abs(x.mean(axis=2, keepdims=True) - 0.5) * 2.0
    mid = np.clip(mid, 0, 1)
    x = x * (1.0 + (warm - 1.0) * mid * 0.55)
    # pull down specular highlights (AI often too shiny)
    lum = 0.2126 * x[..., 0] + 0.7152 * x[..., 1] + 0.0722 * x[..., 2]
    hi = np.clip((lum - 0.72) / 0.28, 0, 1)[..., None]
    x = x * (1.0 - hi * 0.08)
    return np.clip(x, 0, 1)

def micro_texture_break(arr, seed=7):
    """Break perfectly uniform fur sheen with low-freq mottling."""
    rng = np.random.default_rng(seed)
    h, w, _ = arr.shape
    # low-res noise upscaled
    nh, nw = max(8, h // 48), max(8, w // 48)
    blotch = rng.normal(0.0, 1.0, (nh, nw)).astype(np.float32)
    blotch_img = from_f(np.clip(0.5 + blotch * 0.08, 0, 1)[..., None].repeat(3, axis=2))
    blotch_img = blotch_img.resize((w, h), Image.Resampling.BILINEAR)
    b = to_f(blotch_img)[..., 0:1]
    return arr * (0.985 + b * 0.03)

def naturalize(img: Image.Image, seed=42, strength=1.0) -> Image.Image:
    # Mild blur kills AI oversharpness
    img = img.convert("RGB")
    blur = 0.45 * strength
    img = img.filter(ImageFilter.GaussianBlur(radius=blur))
    # slight unsharp after blur (camera-like, not AI crisp)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=55, threshold=3))

    arr = to_f(img)
    arr = micro_texture_break(arr, seed=seed)
    arr = tone_curve(arr)
    arr = film_grain(arr, strength=0.016 * strength, seed=seed)
    arr = soft_vignette(arr, amount=0.10 * strength)
    arr = gentle_chromatic(arr, px=0.5)

    out = from_f(arr)
    # slight saturation pull + warmth via color
    out = ImageEnhance.Color(out).enhance(0.92)
    out = ImageEnhance.Contrast(out).enhance(0.97)
    out = ImageEnhance.Brightness(out).enhance(1.01)
    # very slight additional grain via PIL noise approximation: jpeg roundtrip later
    return out

def save_jpg(img, path, quality=88):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    # two-pass mild jpeg to introduce natural compression texture
    tmp = path.with_suffix(".tmp.jpg")
    img.save(tmp, "JPEG", quality=92, optimize=True, subsampling=1)
    Image.open(tmp).convert("RGB").save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    tmp.unlink(missing_ok=True)
    print("wrote", path, img.size)

def save_png(img, path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    # PNG after naturalize; add tiny dither via jpg intermediate then png
    # Better: save as PNG with slight noise already baked
    img.save(path, "PNG", optimize=True)
    print("wrote", path, img.size)

NEW = {
    "panda_book": "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-2901c888-5a3d-4187-b658-bf2fff5a7b7e.png",
    "lifestyle_woman": "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-2f30b845-74f1-40d4-a3d8-05a4a8ec7814.png",
    "koala_book": "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-c770de8b-43b1-4ceb-9ec6-75ad27eef167.png",
    "group_chair": "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-0990e816-0546-4776-a4ec-66eade6024c6.png",
    "red_book": "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-409355af-ba0e-450a-b54a-a4acd829cf6b.png",
}

# --- New product shots (book table) as primary catalog images ---
jobs = [
    (NEW["panda_book"], OUT / "product-panda-1.png", "png", 11),
    (NEW["koala_book"], OUT / "product-koala-1.png", "png", 22),
    (NEW["red_book"], OUT / "product-red-panda-1.png", "png", 33),
    # also jpg copies for flexibility
    (NEW["panda_book"], OUT / "product-panda-1.jpg", "jpg", 11),
    (NEW["koala_book"], OUT / "product-koala-1.jpg", "jpg", 22),
    (NEW["red_book"], OUT / "product-red-panda-1.jpg", "jpg", 33),
    # lifestyle from new set
    (NEW["lifestyle_woman"], OUT / "lifestyle-woman.jpg", "jpg", 44),
    (NEW["group_chair"], OUT / "lifestyle-collection.jpg", "jpg", 55),
    # hero candidates
    (NEW["group_chair"], PUBLIC / "hero-plushie.jpg", "jpg", 55),
    (NEW["lifestyle_woman"], PUBLIC / "hero-lifestyle.jpg", "jpg", 44),
]

# Existing lifestyle assets → catalog expected names
existing_map = [
    ("lifestyle-panda-hug.jpg", OUT / "lifestyle-panda.jpg", 61),
    ("lifestyle-koala-kid.jpg", OUT / "lifestyle-koala.jpg", 62),
    ("lifestyle-red-panda-shoulders.jpg", OUT / "lifestyle-red-panda.jpg", 63),
    ("lifestyle-red-outdoor.jpg", OUT / "lifestyle-red-outdoor.jpg", 64),
    ("warm-panda.jpg", OUT / "warm-panda.jpg", 71),
    ("warm-koala.jpg", OUT / "warm-koala.jpg", 72),
    ("warm-red-panda.jpg", OUT / "warm-red-panda.jpg", 73),
]

# Extra product variants if present
for i in range(2, 5):
    for fam in ("panda", "koala"):
        name = f"product-{fam}-{i}.jpg"
        if (ASSETS / name).exists():
            existing_map.append((name, OUT / name, 80 + i))
for i in range(2, 4):
    name = f"product-red-panda-{i}.jpg"
    if (ASSETS / name).exists():
        existing_map.append((name, OUT / name, 90 + i))

for src_name, dest, fmt, seed in jobs:
    src = ASSETS / src_name
    img = Image.open(src)
    # upscale 800->1200 for sharper web display after softening
    if max(img.size) < 1100:
        img = img.resize((1200, 1200), Image.Resampling.LANCZOS)
    nat = naturalize(img, seed=seed, strength=1.05)
    if fmt == "png":
        save_png(nat, dest)
    else:
        save_jpg(nat, dest, quality=87)

for src_name, dest, seed in existing_map:
    src = ASSETS / src_name
    if not src.exists():
        print("skip missing", src_name)
        continue
    img = Image.open(src)
    nat = naturalize(img, seed=seed, strength=0.95)
    save_jpg(nat, dest, quality=88)

# Also put a warm hero alt if hero-plushie-warm exists
warm_hero = ASSETS / "hero-plushie-warm.jpg"
if warm_hero.exists():
    nat = naturalize(Image.open(warm_hero), seed=99, strength=0.9)
    save_jpg(nat, PUBLIC / "hero-plushie-warm.jpg", quality=88)

print("DONE")