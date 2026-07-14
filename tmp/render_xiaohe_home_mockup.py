# -*- coding: utf-8 -*-
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


W, H = 1290, 2796
OUTPUT_PATH = Path(r"D:\Demo\ai-japanese-learning\output\ai-xiaohe-home-design-mockup-companion.png")
FONT_DIR = Path(r"C:\Windows\Fonts")
FONT_REGULAR = str(FONT_DIR / "msyh.ttc")
FONT_BOLD = str(FONT_DIR / "msyhbd.ttc") if (FONT_DIR / "msyhbd.ttc").exists() else FONT_REGULAR


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


def rounded_box(img, box, radius, fill, shadow=None, outline=None, outline_width=1):
    x1, y1, x2, y2 = box
    if shadow:
        sx, sy, blur, shadow_color = shadow
        layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
        layer_draw = ImageDraw.Draw(layer)
        layer_draw.rounded_rectangle(
            (x1 + sx, y1 + sy, x2 + sx, y2 + sy),
            radius=radius,
            fill=shadow_color,
        )
        layer = layer.filter(ImageFilter.GaussianBlur(blur))
        img.alpha_composite(layer)

    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=outline_width)


def draw_text(draw, xy, text, text_font, fill, anchor=None, spacing=4):
    draw.text(xy, text, font=text_font, fill=fill, anchor=anchor, spacing=spacing)


def wrap(text, text_font, max_width):
    chars = list(text)
    lines = []
    current = ""
    temp_img = Image.new("RGB", (10, 10))
    temp_draw = ImageDraw.Draw(temp_img)

    for char in chars:
        test = current + char
        if temp_draw.textbbox((0, 0), test, font=text_font)[2] <= max_width or not current:
            current = test
        else:
            lines.append(current)
            current = char

    if current:
        lines.append(current)

    return lines


def create_background():
    canvas = Image.new("RGBA", (W, H), "#FFF9F6")
    pixels = canvas.load()

    for y in range(H):
        ratio = y / (H - 1)
        red = int(255 * (1 - ratio) + 252 * ratio)
        green = int(249 * (1 - ratio) + 244 * ratio)
        blue = int(246 * (1 - ratio) + 248 * ratio)
        for x in range(W):
            pixels[x, y] = (red, green, blue, 255)

    glows = [
        ((220, 250), 430, (255, 220, 229, 150)),
        ((1030, 260), 360, (214, 230, 255, 110)),
        ((1090, 1960), 360, (255, 236, 210, 92)),
    ]

    for (cx, cy), radius, color in glows:
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        layer_draw = ImageDraw.Draw(layer)
        layer_draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=color)
        layer = layer.filter(ImageFilter.GaussianBlur(radius // 3))
        canvas.alpha_composite(layer)

    return canvas


def render():
    canvas = create_background()
    draw = ImageDraw.Draw(canvas)

    frame = (120, 90, W - 120, H - 90)
    rounded_box(canvas, frame, 72, "#FFFDFC", shadow=(0, 22, 30, (170, 140, 140, 60)))
    inner = (150, 120, W - 150, H - 120)
    rounded_box(canvas, inner, 58, "#FFFDFC")

    rounded_box(canvas, (W // 2 - 110, 154, W // 2 + 110, 198), 22, "#1D2030")
    draw_text(draw, (210, 176), "9:41", font(34, True), "#2F3142", anchor="lm")
    draw_text(draw, (W - 212, 176), "5G  82%", font(28), "#6C6E7A", anchor="rm")

    content_x = 198
    content_w = W - 396

    rounded_box(canvas, (content_x, 250, content_x + 240, 308), 28, "#FFF0F4")
    draw_text(draw, (content_x + 120, 279), "7月13日 星期日", font(24, True), "#D26D87", anchor="mm")

    draw_text(draw, (content_x, 356), "我在等你。", font(78, True), "#252738")
    subtitle_lines = wrap("今天不用想太多，我已经替你挑好了一小段。", font(33), content_w - 160)
    subtitle_y = 458
    for line in subtitle_lines:
        draw_text(draw, (content_x, subtitle_y), line, font(33), "#6D6F7C")
        subtitle_y += 46

    hero_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    hero_draw = ImageDraw.Draw(hero_layer)
    hero_draw.ellipse((W - 480, 230, W - 145, 565), fill=(255, 233, 239, 255))
    hero_draw.ellipse((W - 438, 274, W - 187, 525), fill=(255, 255, 255, 255))
    hero_draw.ellipse((W - 350, 324, W - 250, 424), fill=(255, 206, 218, 255))
    hero_draw.rounded_rectangle((W - 336, 398, W - 264, 510), radius=32, fill=(239, 164, 184, 255))
    hero_draw.ellipse((W - 403, 312, W - 347, 368), fill=(255, 242, 174, 255))
    hero_draw.ellipse((W - 324, 357, W - 308, 373), fill=(61, 64, 82, 255))
    hero_draw.ellipse((W - 294, 357, W - 278, 373), fill=(61, 64, 82, 255))
    hero_draw.arc((W - 332, 376, W - 272, 416), start=12, end=168, fill=(61, 64, 82, 255), width=3)
    hero_draw.rounded_rectangle((W - 520, 300, W - 386, 364), radius=24, fill=(255, 255, 255, 235))
    draw_text(hero_draw, (W - 453, 332), "我在", font(26, True), "#D16A87", anchor="mm")
    canvas.alpha_composite(hero_layer)

    rounded_box(canvas, (content_x, 570, content_x + 372, 670), 34, "#FFFFFFE8", shadow=(0, 8, 14, (140, 120, 118, 18)))
    draw_text(draw, (content_x + 44, 610), "小和想陪你做的事", font(24, True), "#D16A87")
    draw_text(draw, (content_x + 44, 646), "今天先开口一句就好", font(30, True), "#35394B")

    card1 = (content_x, 700, W - content_x, 1404)
    rounded_box(
        canvas,
        card1,
        50,
        "#FFFDFC",
        shadow=(0, 18, 26, (120, 102, 95, 28)),
        outline="#F3E6E3",
    )

    accent_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    accent_draw = ImageDraw.Draw(accent_layer)
    accent_draw.rounded_rectangle((content_x + 26, 730, W - content_x - 26, 818), radius=34, fill=(255, 242, 245, 255))
    canvas.alpha_composite(accent_layer)

    draw_text(draw, (content_x + 54, 768), "今日主线", font(26, True), "#D56F86")
    draw_text(draw, (content_x + 54, 886), "先和我问一句价格", font(62, True), "#202333")

    rounded_box(canvas, (content_x + 54, 982, content_x + 232, 1042), 24, "#F3F7FF")
    draw_text(draw, (content_x + 143, 1012), "旅行场景", font(24, True), "#6481B5", anchor="mm")
    rounded_box(canvas, (content_x + 248, 982, content_x + 388, 1042), 24, "#FFF3E8")
    draw_text(draw, (content_x + 318, 1012), "5 分钟", font(24, True), "#CF8A4B", anchor="mm")
    rounded_box(canvas, (content_x + 404, 982, content_x + 592, 1042), 24, "#FFF1F5")
    draw_text(draw, (content_x + 498, 1012), "我会接住你", font(24, True), "#D16A87", anchor="mm")

    rounded_box(canvas, (content_x + 54, 1096, W - content_x - 54, 1208), 30, "#FFF8F0")
    draw_text(draw, (content_x + 88, 1142), "我记得昨天你已经会开头了。", font(30, True), "#7A5640")
    draw_text(draw, (content_x + 88, 1183), "今天只要把一句话自然说完整。", font(30, True), "#7A5640")

    draw_text(draw, (content_x + 54, 1260), "今天只做这一件事", font(28, True), "#A07A78")
    reason_lines = wrap(
        "问出价格。",
        font(38, True),
        content_w - 108,
    )
    reason_y = 1318
    for line in reason_lines:
        draw_text(draw, (content_x + 54, reason_y), line, font(38, True), "#2F3345")
        reason_y += 52

    rounded_box(
        canvas,
        (content_x + 54, 1288, W - content_x - 54, 1408),
        38,
        "#2B3144",
        shadow=(0, 10, 16, (43, 49, 68, 60)),
    )
    draw_text(draw, (W // 2, 1348), "和小和开始今天", font(38, True), "#FFFDFC", anchor="mm")

    card2 = (content_x, 1488, W - content_x, 1818)
    rounded_box(
        canvas,
        card2,
        44,
        "#FFFFFFC8",
        shadow=(0, 12, 20, (120, 102, 95, 18)),
        outline="#F2E7E5",
    )
    draw_text(draw, (content_x + 54, 1548), "昨天", font(24, True), "#C0889A")
    draw_text(draw, (content_x + 54, 1618), "第一次把敬语开头说完整", font(48, True), "#25293A")
    echo_lines = wrap(
        "你一紧张就会想先看中文，所以我今天会放轻一点。",
        font(32),
        content_w - 108,
    )
    echo_y = 1706
    for line in echo_lines:
        draw_text(draw, (content_x + 54, echo_y), line, font(32), "#666977")
        echo_y += 44

    rounded_box(canvas, (content_x + 54, 1756, content_x + 230, 1814), 22, "#F8F1FF")
    draw_text(draw, (content_x + 142, 1785), "继续走一点", font(23, True), "#8A76B6", anchor="mm")

    card3 = (content_x, 1880, W - content_x, 2148)
    rounded_box(canvas, card3, 40, "#FFF6F8", shadow=(0, 8, 16, (120, 102, 95, 16)))
    draw_text(draw, (content_x + 54, 1948), "小和状态", font(28, True), "#D16A87")
    draw_text(draw, (content_x + 54, 2018), "今天我会陪你慢一点。", font(42, True), "#2C3040")
    state_lines = wrap(
        "想先看翻译、假名，或者想轻一点，都可以直接告诉我。",
        font(30),
        content_w - 108,
    )
    state_y = 2084
    for line in state_lines:
        draw_text(draw, (content_x + 54, state_y), line, font(30), "#666977")
        state_y += 42

    rounded_box(canvas, (content_x, 2218, W - content_x, 2354), 36, "#F7FAFF", outline="#E5EDF8")
    draw_text(draw, (content_x + 52, 2268), "设计意图", font(25, True), "#6A84AD")
    draw_text(
        draw,
        (content_x + 52, 2320),
        "像一个在等你的角色，而不是一个派任务的系统。",
        font(31, True),
        "#61708C",
    )

    rounded_box(canvas, (W // 2 - 95, H - 180, W // 2 + 95, H - 168), 6, "#2B3144")
    canvas.convert("RGB").save(OUTPUT_PATH, quality=95)
    print(OUTPUT_PATH)


if __name__ == "__main__":
    render()
