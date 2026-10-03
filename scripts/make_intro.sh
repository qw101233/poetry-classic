#!/bin/bash
# 制作开场和结尾的"文字片头/片尾"（9:16 竖屏 1080×1920）
set -e
OUT=${OUT:-/root/.codebuddy/artifact/2f8a7d30-9c21-4f0b-1d37-43e8bac4e000/clips}
FONT="/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc"

W=1080
H=1920

# 开场：米黄底淡入标题（与短视频主题统一）
ffmpeg -y -f lavfi -i color=size=${W}x${H}:color=0xf3ead2:duration=4 -r 30 \
  -vf "fade=t=in:st=0:d=1.0, \
       drawtext=fontfile=$FONT:text=今日一诗:fontcolor=0x7a4a1f:fontsize=140: \
                x=(w-text_w)/2:y=(h-text_h)/2-80:alpha='if(lt(t,1.0),t,if(gt(t,3.0),4-t,1))', \
       drawtext=fontfile=$FONT:text=古典诗词鉴赏:fontcolor=0xa87532:fontsize=48: \
                x=(w-text_w)/2:y=(h-text_h)/2+50:alpha='if(lt(t,1.0),t-0.3,if(gt(t,3.0),3.7-t,0.7))', \
       drawtext=fontfile=$FONT:text=·  水墨意象 · 像素画卷  ·:fontcolor=0x6b4a23:fontsize=26: \
                x=(w-text_w)/2:y=(h-text_h)/2+150:alpha='if(lt(t,1.5),t-1.0,if(gt(t,3.5),4.5-t,0.5))', \
       drawtext=fontfile=$FONT:text=—  Follow for daily verses —:fontcolor=0x6b4a23:fontsize=22: \
                x=(w-text_w)/2:y=h-100:alpha='if(lt(t,1.5),t-1.2,if(gt(t,3.5),4.5-t,0.4))'" \
  -c:v libopenh264 -pix_fmt yuv420p -crf 22 "$OUT/c00_intro.mp4"

# 结尾：米黄底淡入结尾
ffmpeg -y -f lavfi -i color=size=${W}x${H}:color=0xf3ead2:duration=4 -r 30 \
  -vf "fade=t=in:st=0:d=0.8, \
       drawtext=fontfile=$FONT:text=水墨意象 · 像素画卷:fontcolor=0xa87532:fontsize=52: \
                x=(w-text_w)/2:y=(h-text_h)/2-40:alpha='if(lt(t,0.8),t*1.2,if(gt(t,3.0),4-t,1))', \
       drawtext=fontfile=$FONT:text=扫码访问 · 一键收藏:fontcolor=0x3a2410:fontsize=36: \
                x=(w-text_w)/2:y=(h-text_h)/2+50:alpha='if(lt(t,1.0),t-0.5,if(gt(t,3.0),3.5-t,0.8))', \
       drawtext=fontfile=$FONT:text=·  感 谢 观 看  ·:fontcolor=0x6b4a23:fontsize=28: \
                x=(w-text_w)/2:y=h-100:alpha='if(lt(t,1.5),t-1.2,if(gt(t,3.5),4.5-t,0.5))', \
       drawtext=fontfile=$FONT:text=github.com/你的用户名:fontcolor=0x6b4a23:fontsize=20: \
                x=(w-text_w)/2:y=h-160:alpha='if(lt(t,1.5),t-1.2,if(gt(t,3.5),4.5-t,0.4))'" \
  -c:v libopenh264 -pix_fmt yuv420p -crf 22 "$OUT/c06_outro.mp4"

ls -la "$OUT"