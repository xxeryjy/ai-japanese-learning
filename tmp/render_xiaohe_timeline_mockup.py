# -*- coding: utf-8 -*-
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


W, H = 1290, 2796
OUTPUT_PATH = Path(r"D:\Demo\ai-japanese-learning\output\ai-xiaohe-timeline-design-mockup-jp.png")
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


def draw_multiline(draw, x, y, text, size, color, max_width, bold=False, line_gap=12):
    f = font(size, bold)
    lines = wrap(text, f, max_width)
    current_y = y
    for line in lines:
        draw_text(draw, (x, current_y), line, f, color)
        current_y += size + line_gap
    return current_y


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
        ((170, 210), 340, (247, 224, 228, 78)),
        ((1070, 260), 280, (225, 233, 244, 62)),
        ((990, 2120), 320, (241, 233, 222, 52)),
    ]

    for (cx, cy), radius, color in glows:
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        layer_draw = ImageDraw.Draw(layer)
        layer_draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=color)
        layer = layer.filter(ImageFilter.GaussianBlur(radius // 3))
        canvas.alpha_composite(layer)

    return canvas


def draw_dot_line(draw, x, y1, y2, color):
    step = 18
    radius = 4
    for y in range(y1, y2, step):
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color)


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
    draw_text(draw, (content_x + 74, 276), "时间线", font(40, True), "#282B38")
    draw_text(draw, (content_x + 74, 324), "timeline", font(24), "#A28C90")

    rounded_box(canvas, (W - 400, 248, W - 188, 320), 30, "#F7F3F1", outline="#EEE6E1")
    draw_text(draw, (W - 294, 284), "最近 3 天", font(22, True), "#B7848F", anchor="mm")

    hero = (content_x, 388, W - content_x, 590)
    rounded_box(canvas, hero, 42, "#F8F4EE", shadow=(0, 8, 14, (125, 114, 104, 10)))
    draw_text(draw, (content_x + 42, 442), "这不是聊天记录。", font(42, True), "#313547")
    draw_text(draw, (content_x + 42, 506), "这是你和小和一起走过的几天。", font(30), "#8C8E98")
    rounded_box(canvas, (content_x + 42, 536, content_x + 204, 584), 22, "#F4EEEA")
    draw_text(draw, (content_x + 123, 560), "轻轻往前走", font(21, True), "#A9826A", anchor="mm")

    line_x = content_x + 56
    draw_dot_line(draw, line_x, 678, 2128, "#E5D8D8")

    # Node 1
    draw.ellipse((line_x - 12, 714 - 12, line_x + 12, 714 + 12), fill="#E9B9C6")
    draw_text(draw, (content_x + 102, 684), "7月13日", font(24, True), "#C18594")
    card1 = (content_x + 100, 726, W - content_x, 1128)
    rounded_box(canvas, card1, 40, "#FFFFFF", shadow=(0, 8, 14, (120, 112, 108, 10)), outline="#F0E8E4")
    draw_text(draw, (content_x + 140, 784), "第一次把价格问完整", font(42, True), "#313547")
    draw_text(draw, (content_x + 140, 846), "便利店场景", font(24, True), "#B98D63")
    y = draw_multiline(
        draw,
        content_x + 140,
        902,
        "你先看了中文，然后跟着小和把“请问这个多少钱”完整说了出来。",
        30,
        "#5E5A67",
        content_w - 180,
        bold=False,
        line_gap=10,
    )
    draw_text(draw, (content_x + 140, y + 22), "小和记住了：你紧张时，会想先看中文。", font(28), "#8A8E98")
    rounded_box(canvas, (content_x + 140, 1042, content_x + 312, 1094), 22, "#F8F1F3")
    draw_text(draw, (content_x + 226, 1068), "继续走一点", font(21, True), "#B87C8B", anchor="mm")

    # Node 2
    draw.ellipse((line_x - 10, 1192 - 10, line_x + 10, 1192 + 10), fill="#D8DDE7")
    draw_text(draw, (content_x + 102, 1162), "7月12日", font(24, True), "#7C8798")
    card2 = (content_x + 100, 1204, W - content_x, 1510)
    rounded_box(canvas, card2, 38, "#F4F5F3", shadow=(0, 8, 14, (120, 112, 108, 8)))
    draw_text(draw, (content_x + 140, 1258), "第一次说出敬语开头", font(38, True), "#313547")
    draw_text(draw, (content_x + 140, 1316), "你开始能稳稳地说出“不好意思”。", font(28), "#70747F")
    draw_text(draw, (content_x + 140, 1370), "那天，小和发现你越慢越自然。", font(28), "#8A8E98")
    rounded_box(canvas, (content_x + 140, 1434, content_x + 286, 1482), 22, "#F2F3F6")
    draw_text(draw, (content_x + 213, 1458), "再看这天", font(20, True), "#7C8798", anchor="mm")

    # Node 3
    draw.ellipse((line_x - 10, 1566 - 10, line_x + 10, 1566 + 10), fill="#E7D7BE")
    draw_text(draw, (content_x + 102, 1536), "7月11日", font(24, True), "#B98D63")
    card3 = (content_x + 100, 1578, W - content_x, 1838)
    rounded_box(canvas, card3, 38, "#FBF4F5", shadow=(0, 8, 14, (120, 112, 108, 8)))
    draw_text(draw, (content_x + 140, 1630), "第一次愿意直接开口", font(36, True), "#313547")
    draw_text(draw, (content_x + 140, 1688), "你没有先去选功能，而是直接跟小和说了第一句。", font(28), "#70747F")
    draw_text(draw, (content_x + 140, 1742), "从这天开始，主线才真的成立。", font(28), "#8A8E98")

    summary = (content_x, 1906, W - content_x, 2110)
    rounded_box(canvas, summary, 40, "#F7F3F1", shadow=(0, 8, 14, (120, 112, 108, 8)))
    draw_text(draw, (content_x + 42, 1960), "这几天的变化", font(26, True), "#B7848F")
    draw_text(draw, (content_x + 42, 2028), "你不是一下子学会了很多。", font(34, True), "#313547")
    draw_text(draw, (content_x + 42, 2084), "你只是越来越敢开口了。", font(30), "#8A8E98")

    rounded_box(canvas, (content_x, 2176, W - content_x, 2294), 38, "#343A4D", shadow=(0, 10, 16, (43, 49, 68, 40)))
    draw_text(draw, (W // 2, 2236), "回到首页", font(34, True), "#FFFDFC", anchor="mm")

    rounded_box(canvas, (content_x, 2326, W - content_x, 2428), 34, "#FFFFFDF0", outline="#EFE7E1")
    draw_text(draw, (W // 2, 2378), "继续今天", font(30, True), "#8B7D83", anchor="mm")

    rounded_box(canvas, (W // 2 - 95, H - 180, W // 2 + 95, H - 168), 6, "#2B3144")
    canvas.convert("RGB").save(OUTPUT_PATH, quality=95)
    print(OUTPUT_PATH)


if __name__ == "__main__":
    render()
