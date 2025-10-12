#!/usr/bin/env python3
"""Optimize images by converting to WebP and resizing when necessary.

The script walks the ``images`` directory in the repository, converts any
non-WebP image to WebP, and resizes images whose width exceeds 1920 pixels.
Converted images replace the originals and the original files are removed so
callers can rewrite Git history to drop them entirely.  When the
``--deleted-log`` option is supplied the script records each removed file in a
newline-delimited list that downstream tooling can use to purge Git history.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Iterable, List, Optional, Tuple

from PIL import Image, ImageOps

MAX_WIDTH = 1920
DEFAULT_IMAGE_ROOT = Path("images")
SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".webp"}


def iter_image_files(root: Path) -> Iterable[Path]:
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue
        yield path


def prepare_image(img: Image.Image) -> Image.Image:
    """Return an image converted to a WebP-friendly mode while preserving alpha."""
    if img.mode in ("RGBA", "LA"):
        return img
    if img.mode == "P" and "transparency" in img.info:
        return img.convert("RGBA")
    return img.convert("RGB")


def resized_dimensions(width: int, height: int) -> Tuple[int, int]:
    if width <= MAX_WIDTH:
        return width, height
    ratio = MAX_WIDTH / width
    return MAX_WIDTH, max(1, round(height * ratio))


def convert_image(path: Path) -> Tuple[bool, bool, Path, bool]:
    """Convert ``path`` and return (converted, resized, new_path, removed_original)."""
    with Image.open(path) as src:
        img = ImageOps.exif_transpose(src)
        width, height = img.size
        new_width, new_height = resized_dimensions(width, height)
        needs_resize = (new_width, new_height) != (width, height)
        is_webp = path.suffix.lower() == ".webp"

        target_path = path if is_webp else path.with_suffix(".webp")
        target_path.parent.mkdir(parents=True, exist_ok=True)

        image_to_save = prepare_image(img)
        if needs_resize:
            image_to_save = image_to_save.resize((new_width, new_height), Image.Resampling.LANCZOS)

        if not is_webp or needs_resize:
            image_to_save.save(target_path, "WEBP", quality=90, method=6)

    removed_original = False
    if not is_webp and path.exists():
        path.unlink()
        removed_original = True

    return (not is_webp, needs_resize, target_path, removed_original)


def as_repo_relative(path: Path) -> Path:
    """Return ``path`` relative to the current working directory when possible."""
    if not path.is_absolute():
        return path
    try:
        return path.relative_to(Path.cwd())
    except ValueError:
        return path


def log_removed(paths: Iterable[Path], destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("w", encoding="utf-8") as fh:
        for item in paths:
            relative = as_repo_relative(item)
            fh.write(f"{relative.as_posix()}\n")


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Optimize repository images.")
    parser.add_argument(
        "--root",
        type=Path,
        default=DEFAULT_IMAGE_ROOT,
        help="Directory tree containing images to optimize (default: images)",
    )
    parser.add_argument(
        "--deleted-log",
        type=Path,
        help="If provided, write the relative paths of removed originals to this file.",
    )
    return parser.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    image_root = args.root

    if not image_root.exists():
        print(f"No {image_root} directory found; nothing to do.")
        return 0

    any_changes = False
    removed_paths: List[Path] = []

    for image_path in iter_image_files(image_root):
        converted, resized, new_path, removed_original = convert_image(image_path)
        if converted or resized:
            any_changes = True
            change = []
            if converted:
                change.append("converted to WebP")
            if resized:
                change.append("resized")
            print(f"Processed {image_path} -> {new_path} ({', '.join(change)})")
        if removed_original:
            removed_paths.append(image_path)

    if removed_paths and args.deleted_log:
        removed_paths.sort()
        log_removed(removed_paths, args.deleted_log)

    if not any_changes:
        print("No images required changes.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
