// 用 puppeteer-core 驱动系统 chromium，截取应用多个关键场景
// 9:16 竖屏（720x1280 viewport, deviceScaleFactor 1.5 -> 1080x1920 图）
const puppeteer = require('/tmp/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUT_DIR = process.argv[2] || '/root/.codebuddy/artifact/2f8a7d30-9c21-4f0b-1d37-43e8bac4e000/frames';
fs.mkdirSync(OUT_DIR, { recursive: true });

const URL_BASE = 'http://localhost:8080/index.html';

const SHOTS = [
  { idx: 4,  name: 'shot_01_poem1', label: '陶渊明 · 饮酒其五' },
  { idx: 2,  name: 'shot_02_poem2', label: '苏轼 · 水调歌头' },
  { idx: 10, name: 'shot_03_poem3', label: '辛弃疾 · 青玉案元夕' },
  { idx: 12, name: 'shot_04_poem4', label: '苏轼 · 定风波' },
  { idx: 7,  name: 'shot_05_fav',   label: '收藏喜爱的诗词' },
];

// 9:16 竖屏视口
const VIEW_W = 720;
const VIEW_H = 1280;

async function shoot(){
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--hide-scrollbars',
      '--font-render-hinting=none',
    ],
    defaultViewport: { width: VIEW_W, height: VIEW_H, deviceScaleFactor: 1.5 }
  });

  try {
    for (const shot of SHOTS){
      const page = await browser.newPage();
      await page.setViewport({ width: VIEW_W, height: VIEW_H, deviceScaleFactor: 1.5 });

      if (shot.name === 'shot_05_fav'){
        await page.goto(URL_BASE, { waitUntil: 'networkidle0' });
        await page.evaluate(() => {
          const favs = [
            { title: '静夜思', dynasty: '唐', author: '李白' },
            { title: '春望', dynasty: '唐', author: '杜甫' },
            { title: '水调歌头·明月几时有', dynasty: '宋', author: '苏轼' }
          ];
          localStorage.setItem('poem_favorites_v1', JSON.stringify(favs));
        });
        await page.goto(URL_BASE + '?idx=7&fav=1', { waitUntil: 'networkidle0' });
      } else {
        await page.goto(URL_BASE + `?idx=${shot.idx}`, { waitUntil: 'networkidle0' });
      }

      // 等诗句逐字动画完成
      await new Promise(r => setTimeout(r, 1800));

      const outPath = path.join(OUT_DIR, shot.name + '.png');
      await page.screenshot({ path: outPath, fullPage: true });
      console.log('saved', outPath);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

shoot().catch(e => { console.error(e); process.exit(1); });