"""Stronger second-pass naturalization for AI product photos."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

OUT = Path(r"C:\Users\37062\Projects\minkutis-shop\public\products\photos")
PUBLIC = Path(r"C:\Users\37062\Projects\minkutis-shop\public")
ASSETS = Path(r"C:\Users\37062\.cursor\projects\c-Users-37062-Projects-minkutis-shop\assets")

def to_f(img):
    return np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0

def from_f(arr):
    return Image.fromarray((np.clip(arr, 0, 1) * 255.0 + 0.5).astype(np.uint8), "RGB")

def local_variance_noise(arr, seed, amount=0.022):
    rng = np.random.default_rng(seed)
    h, w, _ = arr.shape
    # multi-scale grain
    out = arr.copy()
    for scale, amp in ((1, 1.0), (2, 0.55), (4, 0.3)):
        nh, nw = max(4, h // scale), max(4, w // scale)
        n = rng.normal(0, amount * amp, (nh, nw, 1)).astype(np.float32)
        n_img = from_f(np.clip(0.5 + n.repeat(3, 2), 0, 1)).resize((w, h), Image.Resampling.BILINEAR)
        nf = to_f(n_img)[..., 0:1] - 0.5
        out = out + nf
    return out

def reduce_sheen(arr):
    lum = 0.2126 * arr[..., 0] + 0.7152 * arr[..., 1] + 0.0722 * arr[..., 2]
    # compress bright specular fur highlights
    hi = np.clip((lum - 0.65) / 0.35, 0, 1)[..., None]
    arr = arr * (1.0 - hi * 0.14) + 0.55 * hi * 0.06
    # lift crushed blacks slightly
    lo = np.clip((0.18 - lum) / 0.18, 0, 1)[..., None]
    arr = arr + lo * 0.03
    return np.clip(arr, 0, 1)

def warm_grade(arr):
    # Kodak-ish: warm shadows, slightly muted greens
    shadows = np.clip(1.0 - arr.mean(2, keepdims=True) * 2.2, 0, 1)
    arr = arr + shadows * np.array([0.018, 0.008, -0.01], dtype=np.float32)
    arr[..., 1] *= 0.985
    arr[..., 2] *= 0.975
    return np.clip(arr, 0, 1)

def soft_vignette(arr, amount=0.16):
    h, w, _ = arr.shape
    y = np.linspace(-1.1, 1.1, h, dtype=np.float32)[:, None]
    x = np.linspace(-1.1, 1.1, w, dtype=np.float32)[None, :]
    r = np.sqrt(x * x + y * y)
    mask = np.clip((r - 0.25) / 1.05, 0, 1) ** 1.4
    return arr * (1.0 - amount * mask[..., None])

def contact_shadow(arr, strength=0.08):
    """Darken slightly near bottom-center contact zones (table)."""
    h, w, _ = arr.shape
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    xx = np.linspace(-1, 1, w, dtype=np.float32)[None, :]
    # soft oval near lower mid
    oval = np.exp(-((yy - 0.72) ** 2) / 0.08 - (xx ** 2) / 0.35)
    return arr * (1.0 - oval[..., None] * strength)

def blur_book_text_zone(img: Image.Image) -> Image.Image:
    """Slightly soften generic AI book spine text region (lower-left of subject)."""
    w, h = img.size
    # approximate book spine / cover text band
    box = (int(w * 0.18), int(h * 0.55), int(w * 0.55), int(h * 0.82))
    region = img.crop(box).filter(ImageFilter.GaussianBlur(radius=1.4))
    # mild desat of text area
    region = ImageEnhance.Contrast(region).enhance(0.92)
    region = ImageEnhance.Color(region).enhance(0.9)
    out = img.copy()
    out.paste(region, box[:2])
    return out

def naturalize_strong(img: Image.Image, seed=1, book_soften=True) -> Image.Image:
    img = img.convert("RGB")
    if max(img.size) < 1100:
        img = img.resize((1400, 1400), Image.Resampling.LANCZOS)

    # Kill plastic sharpness
    img = img.filter(ImageFilter.GaussianBlur(radius=0.7))
    # Mild camera-like sharpen
    img = img.filter(ImageFilter.UnsharpMask(radius=1.4, percent=40, threshold=4))

    if book_soften:
        img = blur_book_text_zone(img)

    arr = to_f(img)
    arr = reduce_sheen(arr)
    arr = warm_grade(arr)
    arr = local_variance_noise(arr, seed=seed, amount=0.02)
    arr = contact_shadow(arr, strength=0.06)
    arr = soft_vignette(arr, amount=0.14)

    # subtle channel misalignment
    shift = 1
    ca = arr.copy()
    ca[..., 0] = np.roll(arr[..., 0], shift, axis=1)
    ca[..., 2] = np.roll(arr[..., 2], -shift, axis=0)
    arr = arr * 0.88 + ca * 0.12

    out = from_f(arr)
    out = ImageEnhance.Color(out).enhance(0.90)
    out = ImageEnhance.Contrast(out).enhance(0.95)
    out = ImageEnhance.Sharpness(out).enhance(0.85)
    return out

def save_png(img, path):
    img.save(path, "PNG", optimize=True)
    print("png", path, img.size)

def save_jpg(img, path, q=86):
    tmp = Path(str(path) + ".tmp.jpg")
    img.save(tmp, "JPEG", quality=90, optimize=True, subsampling=1)
    Image.open(tmp).convert("RGB").save(path, "JPEG", quality=q, optimize=True, progressive=True)
    tmp.unlink(missing_ok=True)
    print("jpg", path, img.size)

NEW = {
    "panda": ASSETS / "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-2901c888-5a3d-4187-b658-bf2fff5a7b7e.png",
    "woman": ASSETS / "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-2f30b845-74f1-40d4-a3d8-05a4a8ec7814.png",
    "koala": ASSETS / "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-c770de8b-43b1-4ceb-9ec6-75ad27eef167.png",
    "group": ASSETS / "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-0990e816-0546-4776-a4ec-66eade6024c6.png",
    "red": ASSETS / "c__Users_37062_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-409355af-ba0e-450a-b54a-a4acd829cf6b.png",
}

# Product shots
for key, seed, book in (("panda", 101, True), ("koala", 202, True), ("red", 303, True)):
    nat = naturalize_strong(Image.open(NEW[key]), seed=seed, book_soften=book)
    save_png(nat, OUT / f"product-{key if key != 'red' else 'red-panda'}-1.png".replace("product-panda-1.png", "product-panda-1.png"))
    # fix naming
# explicit
pairs = [
    ("panda", "product-panda-1", True, 101),
    ("koala", "product-koala-1", True, 202),
    ("red", "product-red-panda-1", True, 303),
]
for key, name, book, seed in pairs:
    nat = naturalize_strong(Image.open(NEW[key]), seed=seed, book_soften=book)
    save_png(nat, OUT / f"{name}.png")
    save_jpg(nat, OUT / f"{name}.jpg")

# Lifestyle woman (no book soften)
nat = naturalize_strong(Image.open(NEW["woman"]), seed=404, book_soften=False)
save_jpg(nat, OUT / "lifestyle-woman.jpg", q=87)
save_jpg(nat, PUBLIC / "hero-lifestyle.jpg", q=87)

# Collection — keep but not as main hero (wrong SKUs). Softer pass.
nat = naturalize_strong(Image.open(NEW["group"]), seed=505, book_soften=False)
save_jpg(nat, OUT / "lifestyle-collection.jpg", q=87)

print("strong pass done")