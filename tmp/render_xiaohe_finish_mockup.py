# -*- coding: utf-8 -*-
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


W, H = 1290, 2796
OUTPUT_PATH = Path(r"D:\Demo\ai-japanese-learning\output\ai-xiaohe-finish-design-mockup-jp.png")
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
    canvas = Image.new("RGBA", (W, H), "#FCFBF8")
    pixels = canvas.load()

    for y in range(H):
        ratio = y / (H - 1)
        red = int(252 * (1 - ratio) + 247 * ratio)
        green = int(251 * (1 - ratio) + 246 * ratio)
        blue = int(248 * (1 - ratio) + 244 * ratio)
        for x in range(W):
            pixels[x, y] = (red, green, blue, 255)

    glows = [
        ((180, 220), 360, (247, 224, 228, 85)),
        ((1080, 280), 260, (225, 233, 244, 72)),
        ((980, 1880), 320, (241, 233, 222, 58)),
    ]

    for (cx, cy), radius, color in glows:
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        layer_draw = ImageDraw.Draw(layer)
        layer_draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=color)
        layer = layer.filter(ImageFilter.GaussianBlur(radius // 3))
        canvas.alpha_composite(layer)

    return canvas


def draw_avatar(img, center_x, center_y):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse((center_x - 58, center_y - 58, center_x + 58, center_y + 58), fill=(248, 232, 236, 255))
    draw.ellipse((center_x - 42, center_y - 34, center_x + 42, center_y + 48), fill=(232, 176, 191, 255))
    draw.ellipse((center_x - 15, center_y - 8, center_x - 5, center_y + 2), fill=(70, 72, 84, 255))
    draw.ellipse((center_x + 5, center_y - 8, center_x + 15, center_y + 2), fill=(70, 72, 84, 255))
    draw.arc((center_x - 22, center_y + 8, center_x + 22, center_y + 28), start=8, end=172, fill=(70, 72, 84, 255), width=2)
    img.alpha_composite(layer)


def draw_multiline(draw, x, y, text, size, color, max_width, bold=False, line_gap=14):
    f = font(size, bold)
    lines = wrap(text, f, max_width)
    current_y = y
    for line in lines:
        draw_text(draw, (x, current_y), line, f, color)
        current_y += size + line_gap
    return current_y


def render():
    canvas = create_background()
    draw = ImageDraw.Draw(canvas)

    frame = (120, 90, W - 120, H - 90)
    rounded_box(canvas, frame, 72, "#FFFEFC", shadow=(0, 20, 28, (160, 146, 136, 42)))
    inner = (150, 120, W - 150, H - 120)
    rounded_box(canvas, inner, 58, "#FFFEFC")

    rounded_box(canvas, (W // 2 - 110, 154, W // 2 + 110, 198), 22, "#1D2030")
    draw_text(draw, (210, 176), "9:41", font(34, True), "#2F3142", anchor="lm")
    draw_text(draw, (W - 212, 176), "5G  82%", font(28), "#6C6E7A", anchor="rm")

    content_x = 188
    content_w = W - 376

    draw_text(draw, (content_x, 274), "‹", font(58, True), "#3A3C4D")
    draw_text(draw, (content_x + 74, 276), "今天结束了", font(40, True), "#282B38")
    draw_text(draw, (content_x + 74, 324), "finish", font(24), "#A28C90")

    draw_avatar(canvas, W // 2, 520)
    rounded_box(canvas, (W // 2 - 180, 610, W // 2 + 180, 684), 28, "#F7F3F1", outline="#EEE6E1")
    draw_text(draw, (W // 2, 647), "你刚刚已经做到了。", font(28, True), "#B7848F", anchor="mm")

    draw_text(draw, (content_x, 770), "先和我问出了一句价格。", font(60, True), "#2F3446")
    draw_text(draw, (content_x, 858), "今天没有很多，只往前走了一小步。", font(30), "#8C8E98")

    card1 = (content_x, 956, W - content_x, 1268)
    rounded_box(canvas, card1, 40, "#F8F4EE", shadow=(0, 8, 14, (125, 114, 104, 10)))
    draw_text(draw, (content_x + 42, 1012), "今天发生了什么", font(26, True), "#B98D63")
    y = draw_multiline(
        draw,
        content_x + 42,
        1066,
        "你先看了中文，然后跟着小和把“请问这个多少钱”完整说了出来。",
        34,
        "#514941",
        content_w - 84,
        bold=True,
        line_gap=12,
    )
    draw_text(draw, (content_x + 42, y + 18), "没有急着往下赶，只是把这一句说稳了。", font(28), "#8A766C")

    card2 = (content_x, 1310, W - content_x, 1552)
    rounded_box(canvas, card2, 40, "#FFFFFF", shadow=(0, 8, 14, (120, 112, 108, 10)), outline="#F0E8E4")
    draw_text(draw, (content_x + 42, 1364), "今天收获", font(26, True), "#C18594")
    draw_text(draw, (content_x + 42, 1432), "不好意思，请问这个多少钱？", font(38, True), "#313547")
    draw_text(draw, (content_x + 42, 1492), "你已经能自然地把提问说完整。", font(28), "#8A8E98")

    card3 = (content_x, 1594, W - content_x, 1832)
    rounded_box(canvas, card3, 40, "#FBF4F5", shadow=(0, 8, 14, (120, 112, 108, 8)))
    draw_text(draw, (content_x + 42, 1648), "小和记住了一件事", font(26, True), "#C18594")
    draw_text(draw, (content_x + 42, 1718), "你一紧张，就会想先看中文。", font(38, True), "#313547")
    draw_text(draw, (content_x + 42, 1778), "所以下次我会先把提示放轻一点。", font(28), "#8A8E98")

    card4 = (content_x, 1876, W - content_x, 2108)
    rounded_box(canvas, card4, 40, "#F4F5F3", shadow=(0, 8, 14, (120, 112, 108, 8)))
    draw_text(draw, (content_x + 42, 1930), "明天怎么继续", font(26, True), "#7C8798")
    draw_text(draw, (content_x + 42, 1998), "明天，我们可以继续把下一句接上。", font(36, True), "#313547")
    draw_text(draw, (content_x + 42, 2056), "比如再自然地加一句回应。", font(28), "#8A8E98")

    rounded_box(canvas, (content_x, 2176, W - content_x, 2294), 38, "#343A4D", shadow=(0, 10, 16, (43, 49, 68, 40)))
    draw_text(draw, (W // 2, 2236), "回到首页", font(34, True), "#FFFDFC", anchor="mm")

    rounded_box(canvas, (content_x, 2326, W - content_x, 2428), 34, "#FFFFFDF0", outline="#EFE7E1")
    draw_text(draw, (W // 2, 2378), "看看时间线", font(30, True), "#8B7D83", anchor="mm")

    rounded_box(canvas, (W // 2 - 95, H - 180, W // 2 + 95, H - 168), 6, "#2B3144")
    canvas.convert("RGB").save(OUTPUT_PATH, quality=95)
    print(OUTPUT_PATH)


if __name__ == "__main__":
    render()
