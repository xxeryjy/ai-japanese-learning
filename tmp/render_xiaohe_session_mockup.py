# -*- coding: utf-8 -*-
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


W, H = 1290, 2796
OUTPUT_PATH = Path(r"D:\Demo\ai-japanese-learning\output\ai-xiaohe-session-design-mockup-jp.png")
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


def bubble_height(text, text_font, max_width, padding_top=28, line_gap=14):
    lines = wrap(text, text_font, max_width)
    line_height = text_font.size + line_gap
    return padding_top * 2 + max(1, len(lines)) * line_height, lines


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
        ((960, 2100), 300, (241, 233, 222, 58)),
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
    draw.ellipse((center_x - 42, center_y - 42, center_x + 42, center_y + 42), fill=(248, 232, 236, 255))
    draw.ellipse((center_x - 32, center_y - 28, center_x + 32, center_y + 36), fill=(232, 176, 191, 255))
    draw.ellipse((center_x - 12, center_y - 6, center_x - 4, center_y + 2), fill=(70, 72, 84, 255))
    draw.ellipse((center_x + 4, center_y - 6, center_x + 12, center_y + 2), fill=(70, 72, 84, 255))
    draw.arc((center_x - 18, center_y + 6, center_x + 18, center_y + 24), start=8, end=172, fill=(70, 72, 84, 255), width=2)
    img.alpha_composite(layer)


def draw_bubble(img, x, y, width, text, fill, text_fill, speaker="assistant", compact=False):
    d = ImageDraw.Draw(img)
    text_font = font(32, speaker == "assistant" and not compact)
    inner_width = width - 56
    height, lines = bubble_height(text, text_font, inner_width, padding_top=26 if compact else 30, line_gap=12)
    rounded_box(
        img,
        (x, y, x + width, y + height),
        34,
        fill,
        shadow=(0, 6, 12, (120, 105, 102, 12)) if speaker == "assistant" else None,
    )
    current_y = y + (24 if compact else 28)
    for line in lines:
        draw_text(d, (x + 28, current_y), line, text_font, text_fill)
        current_y += text_font.size + 12
    return y + height


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

    draw_text(draw, (content_x, 278), "‹", font(58, True), "#3A3C4D")
    draw_text(draw, (content_x + 74, 276), "便利店先问一句", font(40, True), "#282B38")
    draw_text(draw, (content_x + 74, 324), "今天只做一件事 · 问出价格", font(27), "#8A8A96")

    rounded_box(canvas, (W - 430, 248, W - 188, 320), 30, "#F7F3F1", outline="#EEE6E1")
    draw_text(draw, (W - 309, 284), "main line", font(22, True), "#B7848F", anchor="mm")

    info_card = (content_x, 388, W - content_x, 560)
    rounded_box(canvas, info_card, 38, "#F8F4EE", shadow=(0, 8, 14, (125, 114, 104, 10)))
    draw_text(draw, (content_x + 40, 432), "今天先跟着我说一句就好。", font(34, True), "#3A3345")
    draw_text(draw, (content_x + 40, 482), "卡住也没关系，我会慢慢陪你。", font(29), "#8D7768")
    rounded_box(canvas, (content_x + 40, 512, content_x + 184, 558), 22, "#F2F3F6")
    draw_text(draw, (content_x + 112, 535), "旅行场景", font(21, True), "#7C8798", anchor="mm")
    rounded_box(canvas, (content_x + 196, 512, content_x + 314, 558), 22, "#F4EEEA")
    draw_text(draw, (content_x + 255, 535), "5 分钟", font(21, True), "#A9826A", anchor="mm")

    chat_top = 620
    draw_avatar(canvas, content_x + 44, chat_top + 44)
    draw_text(draw, (content_x + 102, chat_top + 10), "小和", font(24, True), "#C18594")
    bubble_x = content_x + 98
    bubble_w = content_w - 98

    y = chat_top + 40
    y = draw_bubble(
        canvas,
        bubble_x,
        y,
        bubble_w,
        "好，我们先从最简单的一句开始。",
        "#FFFFFF",
        "#434756",
        speaker="assistant",
        compact=True,
    )

    y += 18
    y = draw_bubble(
        canvas,
        bubble_x,
        y,
        bubble_w,
        "すみません、これはいくらですか？",
        "#FBF4F5",
        "#2F3446",
        speaker="assistant",
    )

    helper_y = y + 26
    rounded_box(canvas, (bubble_x, helper_y, bubble_x + 170, helper_y + 54), 23, "#F2F3F6")
    draw_text(draw, (bubble_x + 85, helper_y + 27), "先看中文", font(21, True), "#7A8698", anchor="mm")
    rounded_box(canvas, (bubble_x + 184, helper_y, bubble_x + 332, helper_y + 54), 23, "#F8F1F3")
    draw_text(draw, (bubble_x + 258, helper_y + 27), "看假名", font(21, True), "#B87C8B", anchor="mm")
    rounded_box(canvas, (bubble_x + 346, helper_y, bubble_x + 494, helper_y + 54), 23, "#F8F4EC")
    draw_text(draw, (bubble_x + 420, helper_y + 27), "轻一点", font(21, True), "#BB8D5D", anchor="mm")

    user_y = helper_y + 106
    user_box_w = 470
    user_box_x = W - content_x - user_box_w
    y2 = draw_bubble(
        canvas,
        user_box_x,
        user_y,
        user_box_w,
        "我想先看中文。",
        "#32384C",
        "#FFFFFF",
        speaker="user",
        compact=True,
    )
    draw_text(draw, (user_box_x + user_box_w - 112, y2 + 16), "我", font(22, True), "#9397A6")

    assist2_y = y2 + 74
    draw_avatar(canvas, content_x + 44, assist2_y + 38)
    draw_text(draw, (content_x + 102, assist2_y), "小和", font(24, True), "#C18594")
    assist2_box_y = assist2_y + 26
    assist2_end = draw_bubble(
        canvas,
        bubble_x,
        assist2_box_y,
        bubble_w,
        "可以，这句话就是：不好意思，请问这个多少钱？",
        "#FFFFFF",
        "#434756",
        speaker="assistant",
        compact=False,
    )

    assist_card_y = assist2_end + 18
    rounded_box(canvas, (bubble_x, assist_card_y, W - content_x, assist_card_y + 158), 32, "#F9F5EF", outline="#EEE5DA")
    draw_text(draw, (bubble_x + 30, assist_card_y + 28), "先记住这一句", font(23, True), "#B98D63")
    draw_text(draw, (bubble_x + 30, assist_card_y + 68), "不好意思，请问这个多少钱？", font(34, True), "#5E4B41")
    draw_text(draw, (bubble_x + 30, assist_card_y + 116), "准备好了，就跟我慢慢说一遍。", font(25), "#8A766C")

    composer = (content_x, 2240, W - content_x, 2435)
    rounded_box(canvas, composer, 42, "#FFFFFDF0", shadow=(0, -6, 16, (145, 130, 126, 12)), outline="#EFE7E1")
    rounded_box(canvas, (content_x + 30, 2278, W - content_x - 190, 2396), 34, "#F5F5F3")
    draw_text(draw, (content_x + 66, 2340), "直接说中文也可以……", font(30), "#A7A8AE")
    rounded_box(canvas, (W - content_x - 146, 2278, W - content_x - 30, 2396), 34, "#343A4D")
    draw_text(draw, (W - content_x - 88, 2338), "发送", font(29, True), "#FFFDFC", anchor="mm")

    rounded_box(canvas, (W // 2 - 95, H - 180, W // 2 + 95, H - 168), 6, "#2B3144")
    canvas.convert("RGB").save(OUTPUT_PATH, quality=95)
    print(OUTPUT_PATH)


if __name__ == "__main__":
    render()
