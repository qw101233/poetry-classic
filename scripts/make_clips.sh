#!/bin/bash
# 把每张截图做成 5 秒 30fps 9:16 竖屏（1080×1920）视频片段
# 抖音 / TikTok 标准竖屏比例
set -e
FRAMES=${FRAMES:-/root/.codebuddy/artifact/2f8a7d30-9c21-4f0b-1d37-43e8bac4e000/frames}
OUT=${OUT:-/root/.codebuddy/artifact/2f8a7d30-9c21-4f0b-1d37-43e8bac4e000/clips}
mkdir -p "$OUT"

FONT="/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc"

# 竖屏尺寸
W=1080
H=1920

make_clip(){
  local src=$1
  local dst=$2
  local caption=$3
  # 缩放到 1080x1920：等比缩放使高度=1920，加左右米黄填充居中
  # (短视频常见：竖排画面 + 上下留白给水印和字幕)
  ffmpeg -y -loop 1 -t 5 -i "$src" \
    -vf "scale=-2:$H,pad=$W:$H:(ow-iw)/2:(oh-ih)/2:color=0xf3ead2, \
         fade=t=in:st=0:d=0.6,fade=t=out:st=4.0:d=1.0, \
         drawtext=fontfile=$FONT:text=$caption:fontcolor=0x3a2410:fontsize=44: \
                  x=(w-text_w)/2:y=h-100: \
                  box=1:boxcolor=0xebe0c2@0.7:boxborderw=22: \
                  shadowcolor=0x000000@0.25:shadowx=1:shadowy=1, \
         drawtext=fontfile=$FONT:text=今日一诗:fontcolor=0x7a4a1f:fontsize=26: \
                  x=50:y=60:alpha=0.75, \
         drawtext=fontfile=$FONT:text=·  古诗词鉴赏  ·:fontcolor=0x7a4a1f:fontsize=20: \
                  x=w-280:y=60:alpha=0.6" \
    -r 30 -c:v libopenh264 -pix_fmt yuv420p -preset medium -crf 20 "$dst"
}

# 每张图对应一段：缩放 + 字幕
make_clip "$FRAMES/shot_01_poem1.png" "$OUT/c01.mp4" "陶渊明 · 饮酒其五"
make_clip "$FRAMES/shot_02_poem2.png" "$OUT/c02.mp4" "苏轼 · 水调歌头"
make_clip "$FRAMES/shot_03_poem3.png" "$OUT/c03.mp4" "辛弃疾 · 青玉案元夕"
make_clip "$FRAMES/shot_04_poem4.png" "$OUT/c04.mp4" "苏轼 · 定风波"
make_clip "$FRAMES/shot_05_fav.png"   "$OUT/c05.mp4" "收藏喜爱的诗词"

ls -la "$OUT"