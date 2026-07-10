from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter


W, H = 1242, 2688


def hex_rgba(value: str, alpha: int = 255) -> tuple[int, int, int, int]:
    value = value.lstrip("#")
    return (int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16), alpha)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


def vertical_gradient(size: tuple[int, int], top: tuple[int, int, int, int], bottom: tuple[int, int, int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGBA", size)
    draw = ImageDraw.Draw(img)
    tr, tg, tb, ta = top
    br, bg, bb, ba = bottom
    for y in range(h):
        t = y / max(h - 1, 1)
        color = (
            int(tr + (br - tr) * t),
            int(tg + (bg - tg) * t),
            int(tb + (bb - tb) * t),
            int(ta + (ba - ta) * t),
        )
        draw.line((0, y, w, y), fill=color)
    return img


def add_shadow(img: Image.Image, box: tuple[int, int, int, int], shadow=(214, 190, 173, 72), offset=(0, 16), blur=26, corner=42) -> None:
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x1, y1, x2, y2 = box
    ox, oy = offset
    draw.rounded_rectangle((x1 + ox, y1 + oy, x2 + ox, y2 + oy), radius=corner, fill=shadow)
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur)))


def paste_rounded(base_img: Image.Image, image: Image.Image, box: tuple[int, int, int, int], radius: int) -> None:
    x1, y1, x2, y2 = box
    target = image.resize((x2 - x1, y2 - y1))
    mask = Image.new("L", (x2 - x1, y2 - y1), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, x2 - x1, y2 - y1), radius=radius, fill=255)
    base_img.paste(target, (x1, y1), mask)


def draw_card(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill, outline=None, radius=40) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=3 if outline else 0)


def draw_pill(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill, text: str, text_font: ImageFont.FreeTypeFont, text_color: str, outline=None) -> None:
    draw.rounded_rectangle(box, radius=(box[3] - box[1]) // 2, fill=fill, outline=outline, width=2 if outline else 0)
    bbox = draw.textbbox((0, 0), text, font=text_font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = box[0] + ((box[2] - box[0]) - tw) / 2
    y = box[1] + ((box[3] - box[1]) - th) / 2 - 2
    draw.text((x, y), text, font=text_font, fill=text_color)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, text_font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    lines = []
    current = ""
    for ch in text:
        test = current + ch
        bbox = draw.textbbox((0, 0), test, font=text_font)
        if bbox[2] - bbox[0] <= max_width or not current:
            current = test
        else:
            lines.append(current)
            current = ch
    if current:
        lines.append(current)
    return lines


def draw_multiline(draw: ImageDraw.ImageDraw, pos: tuple[int, int], text: str, text_font: ImageFont.FreeTypeFont, fill: str, max_width: int, line_gap: int = 12) -> int:
    x, y = pos
    lines = wrap_text(draw, text, text_font, max_width)
    line_height = draw.textbbox((0, 0), "A", font=text_font)[3]
    for i, line in enumerate(lines):
        draw.text((x, y + i * (line_height + line_gap)), line, font=text_font, fill=fill)
    return y + len(lines) * (line_height + line_gap)


def draw_more_icon(draw: ImageDraw.ImageDraw, center: tuple[int, int], color: tuple[int, int, int, int]) -> None:
    cx, cy = center
    for dx in (-12, 0, 12):
        draw.ellipse((cx + dx - 4, cy - 4, cx + dx + 4, cy + 4), fill=color)


def draw_history_icon(draw: ImageDraw.ImageDraw, center: tuple[int, int], color: tuple[int, int, int, int]) -> None:
    cx, cy = center
    draw.arc((cx - 18, cy - 18, cx + 18, cy + 18), start=45, end=320, fill=color, width=4)
    draw.line((cx + 8, cy - 18, cx + 18, cy - 18), fill=color, width=4)
    draw.line((cx + 18, cy - 18, cx + 12, cy - 8), fill=color, width=4)


def draw_send_icon(draw: ImageDraw.ImageDraw, center: tuple[int, int], color: tuple[int, int, int, int]) -> None:
    cx, cy = center
    draw.polygon([(cx - 13, cy - 11), (cx + 17, cy), (cx - 13, cy + 11), (cx - 4, cy)], fill=color)


def draw_chat_icon(draw: ImageDraw.ImageDraw, center: tuple[int, int], color: str, active: bool = False) -> None:
    cx, cy = center
    draw.rounded_rectangle((cx - 16, cy - 12, cx + 16, cy + 10), radius=10, outline=color, width=4)
    draw.polygon([(cx - 4, cy + 10), (cx + 2, cy + 18), (cx + 4, cy + 10)], fill=color)
    if active:
        draw.ellipse((cx - 5, cy - 3, cx - 1, cy + 1), fill=color)
        draw.ellipse((cx + 1, cy - 3, cx + 5, cy + 1), fill=color)


def draw_home_icon(draw: ImageDraw.ImageDraw, center: tuple[int, int], color: str) -> None:
    cx, cy = center
    draw.line((cx - 20, cy - 2, cx, cy - 20, cx + 20, cy - 2), fill=color, width=4)
    draw.polygon([(cx, cy - 18), (cx - 18, cy - 2), (cx - 18, cy + 18), (cx + 18, cy + 18), (cx + 18, cy - 2)], outline=color, width=4)


def draw_bookmark_icon(draw: ImageDraw.ImageDraw, center: tuple[int, int], color: str) -> None:
    cx, cy = center
    draw.rounded_rectangle((cx - 14, cy - 20, cx + 14, cy + 18), radius=6, outline=color, width=4)
    draw.line((cx - 14, cy + 18, cx, cy + 6, cx + 14, cy + 18), fill=color, width=4)


def draw_user_icon(draw: ImageDraw.ImageDraw, center: tuple[int, int], color: str) -> None:
    cx, cy = center
    draw.ellipse((cx - 12, cy - 22, cx + 12, cy + 2), outline=color, width=4)
    draw.arc((cx - 22, cy, cx + 22, cy + 30), start=200, end=340, fill=color, width=4)


def main() -> None:
    ui = {
        "page_title": "AI \u5bf9\u8bdd",
        "intro_badge": "AI \u4f1a\u8bdd\u7ec3\u4e60\u5ba4",
        "intro_title": "\u50cf\u670b\u53cb\u4e00\u6837\u966a\u4f60\u7ec3\u65e5\u8bed",
        "intro_subtitle": "\u5148\u8bf4\u4e2d\u6587\u4e5f\u6ca1\u5173\u7cfb\uff0c\u6211\u4f1a\u63a5\u4f4f\u4f60\uff0c\u518d\u5e2e\u4f60\u6162\u6162\u5f00\u53e3\u3002",
        "intro_online": "\u5728\u7ebf\u966a\u7ec3\u4e2d",
        "scene_1": "\u7b2c\u4e00\u6b21\u89c1\u9762",
        "scene_2": "\u65c5\u884c\u70b9\u9910",
        "scene_3": "\u656c\u8bed\u9762\u8bd5",
        "scene_level": "N5-N3",
        "chat_time": "\u4eca\u5929 19:24",
        "assistant_name": "AI \u5c0f\u548c",
        "assistant_1": "\u4f60\u597d\u5440\uff0c\u5148\u522b\u7d27\u5f20\u3002\u4f60\u53ef\u4ee5\u76f4\u63a5\u7528\u4e2d\u6587\u544a\u8bc9\u6211\uff0c\u4f60\u5e0c\u671b\u7b2c\u4e00\u6b21\u89c1\u9762\u65f6\u7ed9\u4eba\u4ec0\u4e48\u611f\u89c9\uff1f",
        "user_1": "\u60f3\u81ea\u7136\u4e00\u70b9\uff0c\u6e29\u67d4\u4e00\u70b9\u3002",
        "assistant_2": "\u90a3\u6211\u4eec\u5148\u4ece\u4e00\u53e5\u8f7b\u677e\u7684\u5f00\u573a\u5f00\u59cb\u3002",
        "jp_1": "\u306f\u3058\u3081\u307e\u3057\u3066\u3001\u30a6\u30fc\u30b7\u30e3\u3067\u3059\u3002",
        "jp_2": "\u4eca\u65e5\u306f\u304a\u4f1a\u3044\u3067\u304d\u3066\u3046\u308c\u3057\u3044\u3067\u3059\u3002",
        "feedback_badge": "AI \u7ea0\u9519\u5361",
        "feedback_title": "\u518d\u53e3\u8bed\u4e00\u70b9\uff0c\u4f1a\u66f4\u50cf\u771f\u4eba\u804a\u5929",
        "feedback_desc": "\u5982\u679c\u4f60\u60f3\u663e\u5f97\u66f4\u67d4\u548c\uff0c\u53ef\u4ee5\u5c11\u4e00\u70b9\u4e66\u9762\u611f\uff0c\u591a\u4e00\u70b9\u53e3\u8bed\u6e29\u5ea6\u3002",
        "feedback_example": "\u66f4\u63a8\u8350\uff1a\u306f\u3058\u3081\u307e\u3057\u3066\u3001\u30a6\u30fc\u30b7\u30e3\u3067\u3059\u3002\u4eca\u65e5\u306f\u4f1a\u3048\u3066\u3046\u308c\u3057\u3044\u3067\u3059\u3002",
        "user_2": "\u8da3\u5473\u306f\u6620\u753b\u3092\u898b\u308b\u3053\u3068\u3067\u3059\u3002",
        "assistant_3": "\u5f88\u597d\uff0c\u8fd9\u53e5\u5df2\u7ecf\u5f88\u81ea\u7136\u4e86\u3002\u60f3\u66f4\u65e5\u5e38\u4e00\u70b9\u7684\u8bdd\uff0c\u53ef\u4ee5\u518d\u63a5\u4e00\u53e5\u201c\u6700\u8fd1\u306f\u30a2\u30cb\u30e1\u3082\u3088\u304f\u898b\u307e\u3059\u201d\u3002",
        "action_title": "\u4e0b\u4e00\u53e5\u5efa\u8bae",
        "action_1": "\u7ee7\u7eed\u8fd9\u4e2a\u573a\u666f",
        "action_2": "\u6362\u4e2a\u573a\u666f",
        "action_3": "\u53ea\u505a\u7ea0\u9519",
        "input_1": "\u8bed\u97f3\u8f93\u5165",
        "input_2": "\u53cc\u8bed\u663e\u793a",
        "input_3": "\u6162\u901f\u56de\u590d",
        "placeholder": "\u8bf4\u4e2d\u6587\u4e5f\u53ef\u4ee5\uff0c\u6211\u4f1a\u5e2e\u4f60\u63a5\u6210\u81ea\u7136\u65e5\u8bed",
        "nav_1": "\u9996\u9875",
        "nav_2": "\u5b66\u4e60",
        "nav_3": "AI",
        "nav_4": "\u6211\u7684",
    }

    base = Path(r"D:\Demo\ai-japanese-learning")
    out_dir = base / "output" / "design"
    out_dir.mkdir(parents=True, exist_ok=True)

    canvas = Image.new("RGBA", (W, H), "#FFF8F4")
    canvas.alpha_composite(vertical_gradient((W, H), hex_rgba("#FEF7F1"), hex_rgba("#FFF9FC")))

    glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow = ImageDraw.Draw(glow_layer)
    glow.ellipse((-120, -80, 520, 560), fill=hex_rgba("#FFDCE8", 180))
    glow.ellipse((850, -120, 1400, 420), fill=hex_rgba("#D7EBFF", 200))
    glow.ellipse((900, 1280, 1420, 1800), fill=hex_rgba("#FFE6C8", 115))
    glow.ellipse((-220, 1650, 340, 2220), fill=hex_rgba("#FADCEB", 110))
    canvas.alpha_composite(glow_layer.filter(ImageFilter.GaussianBlur(100)))

    font_regular = font(r"C:\Windows\Fonts\msyh.ttc", 32)
    font_small = font(r"C:\Windows\Fonts\msyh.ttc", 26)
    font_bold = font(r"C:\Windows\Fonts\msyhbd.ttc", 32)
    font_title = font(r"C:\Windows\Fonts\msyhbd.ttc", 56)
    font_chip = font(r"C:\Windows\Fonts\msyhbd.ttc", 28)
    font_page = font(r"C:\Windows\Fonts\msyhbd.ttc", 36)
    font_bubble = font(r"C:\Windows\Fonts\msyh.ttc", 34)
    font_bubble_bold = font(r"C:\Windows\Fonts\msyhbd.ttc", 34)
    font_jp = font(r"C:\Windows\Fonts\YuGothB.ttc", 40)
    font_tab = font(r"C:\Windows\Fonts\msyh.ttc", 24)
    font_tab_active = font(r"C:\Windows\Fonts\msyhbd.ttc", 24)

    banner = Image.open(base / "static/images/home/banner.jpg").convert("RGBA")
    aibot = Image.open(base / "static/images/home/ai_card.png").convert("RGBA")
    windbell = Image.open(base / "static/images/home/windbell.png").convert("RGBA")

    draw = ImageDraw.Draw(canvas)

    draw.text((72, 84), "AI", font=font_page, fill="#FF918A")
    title_bbox = draw.textbbox((0, 0), ui["page_title"], font=font_page)
    draw.text(((W - (title_bbox[2] - title_bbox[0])) / 2, 84), ui["page_title"], font=font_page, fill="#5F4030")
    for box in ((W - 170, 70, W - 106, 134), (W - 92, 70, W - 28, 134)):
        draw.rounded_rectangle(box, radius=32, fill=hex_rgba("#FFF8F3", 222), outline=hex_rgba("#F6E3D8"), width=2)
    draw_history_icon(draw, (W - 138, 102), hex_rgba("#70513B"))
    draw_more_icon(draw, (W - 60, 102), hex_rgba("#70513B"))

    intro_box = (48, 156, W - 48, 468)
    add_shadow(canvas, intro_box, blur=34, corner=44)
    paste_rounded(canvas, banner, intro_box, 44)
    intro_overlay = Image.new("RGBA", (intro_box[2] - intro_box[0], intro_box[3] - intro_box[1]), (0, 0, 0, 0))
    intro_draw = ImageDraw.Draw(intro_overlay)
    for x in range(intro_overlay.size[0]):
        alpha = int(214 - x / intro_overlay.size[0] * 145)
        intro_draw.line((x, 0, x, intro_overlay.size[1]), fill=(255, 248, 241, max(alpha, 28)))
    canvas.alpha_composite(intro_overlay, (intro_box[0], intro_box[1]))

    draw_pill(draw, (86, 190, 330, 248), hex_rgba("#FFF8F0", 220), ui["intro_badge"], font_chip, "#C88158", outline=hex_rgba("#F7E2D3"))
    draw.text((86, 274), ui["intro_title"], font=font_title, fill="#654432")
    subtitle_end = draw_multiline(draw, (86, 346), ui["intro_subtitle"], font_regular, "#7A5B46", 620, 10)
    online_y = subtitle_end + 8
    draw_pill(draw, (86, online_y, 248, online_y + 54), hex_rgba("#F3FFF6", 235), ui["intro_online"], font_small, "#4C9C66", outline=hex_rgba("#DCEEDD"))
    draw.ellipse((108, online_y + 18, 120, online_y + 30), fill=hex_rgba("#4CC96B"))
    canvas.alpha_composite(aibot.resize((290, 290)), (W - 386, 196))

    scene_row_y = 494
    draw_pill(draw, (72, scene_row_y, 326, scene_row_y + 66), hex_rgba("#FDEDF1"), ui["scene_1"], font_chip, "#DD7785")
    draw_pill(draw, (348, scene_row_y, 566, scene_row_y + 66), hex_rgba("#EAF4FF"), ui["scene_2"], font_chip, "#6396DE")
    draw_pill(draw, (588, scene_row_y, 806, scene_row_y + 66), hex_rgba("#FFF4DD"), ui["scene_3"], font_chip, "#D59A45")
    draw_pill(draw, (932, scene_row_y, 1082, scene_row_y + 66), hex_rgba("#FFF8F0"), ui["scene_level"], font_chip, "#B97C5A", outline=hex_rgba("#F2DDCF"))

    chat_box = (36, 586, W - 36, 2244)
    add_shadow(canvas, chat_box, blur=32, corner=44)
    draw_card(draw, chat_box, hex_rgba("#FFFFFF", 228), outline=hex_rgba("#F4E7DE"), radius=44)
    draw_pill(draw, (480, 618, 760, 672), hex_rgba("#FFF7EF"), ui["chat_time"], font_small, "#B68869")

    avatar = aibot.resize((74, 74))
    canvas.alpha_composite(avatar, (86, 726))
    draw.rounded_rectangle((176, 710, 1002, 886), radius=34, fill=hex_rgba("#FFF8F3"), outline=hex_rgba("#F3E3D9"), width=2)
    draw.text((210, 744), ui["assistant_name"], font=font_chip, fill="#C37E58")
    draw_multiline(draw, (210, 798), ui["assistant_1"], font_bubble, "#5B4030", 744, 10)

    user_box_1 = (428, 938, 1106, 1062)
    draw.rounded_rectangle(user_box_1, radius=32, fill=hex_rgba("#FFB9AB"))
    draw.text((468, 978), ui["user_1"], font=font_bubble_bold, fill="#FFFFFF")

    canvas.alpha_composite(avatar, (86, 1128))
    draw.rounded_rectangle((176, 1116, 964, 1328), radius=34, fill=hex_rgba("#FFF8F3"), outline=hex_rgba("#F3E3D9"), width=2)
    draw.text((210, 1150), ui["assistant_name"], font=font_chip, fill="#C37E58")
    draw.text((210, 1204), ui["assistant_2"], font=font_bubble, fill="#5B4030")
    draw.text((210, 1260), ui["jp_1"], font=font_jp, fill="#5B4030")
    draw.text((210, 1314), ui["jp_2"], font=font_jp, fill="#5B4030")

    feedback_box = (138, 1386, 1104, 1624)
    add_shadow(canvas, feedback_box, blur=22, offset=(0, 10), corner=34)
    draw_card(draw, feedback_box, hex_rgba("#FFF8EF"), outline=hex_rgba("#F3E0D0"), radius=34)
    draw_pill(draw, (176, 1420, 352, 1474), hex_rgba("#FFEAD9"), ui["feedback_badge"], font_small, "#CB7B50")
    draw.text((176, 1506), ui["feedback_title"], font=font_chip, fill="#664431")
    draw.text((176, 1552), ui["feedback_desc"], font=font_small, fill="#866856")
    draw.text((176, 1592), ui["feedback_example"], font=font_small, fill="#B17B60")

    user_box_2 = (436, 1682, 1106, 1806)
    draw.rounded_rectangle(user_box_2, radius=32, fill=hex_rgba("#FFA79A"))
    draw.text((472, 1722), ui["user_2"], font=font_bubble_bold, fill="#FFFFFF")

    canvas.alpha_composite(avatar, (86, 1862))
    draw.rounded_rectangle((176, 1848, 1008, 2044), radius=34, fill=hex_rgba("#FFF8F3"), outline=hex_rgba("#F3E3D9"), width=2)
    draw.text((210, 1882), ui["assistant_name"], font=font_chip, fill="#C37E58")
    draw_multiline(draw, (210, 1936), ui["assistant_3"], font_bubble, "#5B4030", 746, 10)

    draw.text((86, 2098), ui["action_title"], font=font_chip, fill="#785844")
    draw_pill(draw, (86, 2140, 356, 2200), hex_rgba("#FDEDF1"), ui["action_1"], font_small, "#D77886")
    draw_pill(draw, (382, 2140, 628, 2200), hex_rgba("#EAF4FF"), ui["action_2"], font_small, "#6A99DE")
    draw_pill(draw, (654, 2140, 884, 2200), hex_rgba("#FFF4DD"), ui["action_3"], font_small, "#D09A43")

    input_box = (36, 2268, W - 36, 2490)
    add_shadow(canvas, input_box, blur=30, corner=40)
    draw_card(draw, input_box, hex_rgba("#FFFFFF", 234), outline=hex_rgba("#F2E6DE"), radius=40)
    canvas.alpha_composite(windbell.resize((112, 112)), (W - 176, 2246))
    draw_pill(draw, (74, 2302, 250, 2354), hex_rgba("#FDEDF1"), ui["input_1"], font_small, "#D77886")
    draw_pill(draw, (268, 2302, 444, 2354), hex_rgba("#EAF4FF"), ui["input_2"], font_small, "#6A99DE")
    draw_pill(draw, (462, 2302, 638, 2354), hex_rgba("#FFF4DD"), ui["input_3"], font_small, "#D09A43")
    draw.rounded_rectangle((74, 2380, W - 174, 2456), radius=38, fill=hex_rgba("#FFF9F5"), outline=hex_rgba("#EDE1D9"), width=2)
    draw.ellipse((102, 2402, 136, 2436), fill=hex_rgba("#FFD5C8"))
    draw.text((154, 2394), ui["placeholder"], font=font_small, fill="#A68977")
    draw.ellipse((W - 154, 2378, W - 82, 2450), fill=hex_rgba("#FF9486"))
    draw_send_icon(draw, (W - 118, 2414), hex_rgba("#FFFFFF"))

    draw.rectangle((0, H - 170, W, H), fill=hex_rgba("#FFFFFF", 242))
    draw.line((0, H - 170, W, H - 170), fill=hex_rgba("#F0E7DF"), width=2)
    nav_items = [
        (ui["nav_1"], draw_home_icon, False),
        (ui["nav_2"], draw_bookmark_icon, False),
        (ui["nav_3"], draw_chat_icon, True),
        (ui["nav_4"], draw_user_icon, False),
    ]
    xs = [160, 430, 700, 970]
    for (label, icon_fn, active), x in zip(nav_items, xs):
        color = "#FF8D90" if active else "#9F9AA3"
        if icon_fn is draw_chat_icon:
            icon_fn(draw, (x, H - 116), color, active=True)
        else:
            icon_fn(draw, (x, H - 116), color)
        tab_font = font_tab_active if active else font_tab
        bbox = draw.textbbox((0, 0), label, font=tab_font)
        draw.text((x - (bbox[2] - bbox[0]) / 2, H - 78), label, font=tab_font, fill=color)

    out_path = out_dir / "ai-chat-page-design.png"
    canvas.save(out_path)
    print(out_path)


if __name__ == "__main__":
    main()
