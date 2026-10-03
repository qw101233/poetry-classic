/* ===== 应用逻辑 ===== */
const POEMS_DATA = POEMS;
const elTitle = document.getElementById('title');
const elDynasty = document.getElementById('dynasty');
const elAuthor = document.getElementById('author');
const elCategory = document.getElementById('category');
const elVerse = document.getElementById('verse');
const elAnnotation = document.getElementById('annotation');
const elTranslation = document.getElementById('translation');
const elAppreciation = document.getElementById('appreciation');
const elCount = document.getElementById('count');
const btnRefresh = document.getElementById('refresh');
const btnCopy = document.getElementById('copy');
const btnFavorite = document.getElementById('favorite');
const btnClearFav = document.getElementById('clear-fav');
const favBox = document.getElementById('favorites');
const favList = document.getElementById('favorite-list');

elCount.textContent = POEMS_DATA.length;

let currentIndex = -1;

function renderPoem(p, animate=true){
  elTitle.textContent = p.title;
  elDynasty.textContent = p.dynasty;
  elAuthor.textContent = p.author;
  elCategory.textContent = p.category;

  // 诗句逐字动画
  elVerse.innerHTML = '';
  const chars = p.verse.flatMap(line=>[...line,'\n']).filter(c=>c!=='\n' || true);
  let delay = 0;
  p.verse.forEach((line, i)=>{
    const span = document.createElement('div');
    line.split('').forEach(ch=>{
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      s.style.animationDelay = (delay * 25) + 'ms';
      span.appendChild(s);
      delay++;
    });
    elVerse.appendChild(span);
  });

  elAnnotation.textContent = p.appreciation.slice(0,1).join('\n');
  elTranslation.textContent = p.translation.join('\n');
  elAppreciation.textContent = p.appreciation.slice(1).join('\n') || p.appreciation.join('\n');

  // 切换卡片淡入
  const card = document.getElementById('card');
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = animate ? 'fadeIn .6s ease' : 'none';

  // 印章动画
  const seal = document.querySelector('.seal');
  seal.style.transform = 'rotate(0deg) scale(.6)';
  setTimeout(()=>{ seal.style.transition='transform .4s ease'; seal.style.transform='rotate(-6deg) scale(1)'; },50);
}

function randomPoem(){
  let idx;
  do { idx = Math.floor(Math.random()*POEMS_DATA.length); } while (idx === currentIndex && POEMS_DATA.length > 1);
  currentIndex = idx;
  renderPoem(POEMS_DATA[idx]);
}

// 收藏夹
const FAV_KEY = 'poem_favorites_v1';
function getFavs(){
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch(e){ return []; }
}
function saveFavs(arr){ localStorage.setItem(FAV_KEY, JSON.stringify(arr)); }
function renderFavs(){
  const favs = getFavs();
  favList.innerHTML = '';
  if (favs.length === 0){
    favBox.hidden = true;
    return;
  }
  favBox.hidden = false;
  favs.forEach((p, i)=>{
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <div class="poem-title">${p.title}</div>
        <div class="poem-meta">${p.dynasty} · ${p.author}</div>
      </div>
      <button class="remove" data-i="${i}" title="移除">×</button>
    `;
    favList.appendChild(li);
  });
  favList.querySelectorAll('.remove').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const i = +e.target.dataset.i;
      const favs = getFavs();
      favs.splice(i,1);
      saveFavs(favs);
      renderFavs();
    });
  });
}

btnRefresh.addEventListener('click', randomPoem);
btnCopy.addEventListener('click', async ()=>{
  const p = POEMS_DATA[currentIndex];
  const text = `${p.title}\n【${p.dynasty}】${p.author}\n\n${p.verse.join('\n')}\n\n【译文】\n${p.translation.join('\n')}`;
  try {
    await navigator.clipboard.writeText(text);
    btnCopy.textContent = '已复制 ✓';
    setTimeout(()=>btnCopy.textContent='复制全诗 ⎘', 1500);
  } catch(e){
    btnCopy.textContent = '复制失败';
    setTimeout(()=>btnCopy.textContent='复制全诗 ⎘', 1500);
  }
});
btnFavorite.addEventListener('click', ()=>{
  if (currentIndex < 0) return;
  const p = POEMS_DATA[currentIndex];
  const favs = getFavs();
  if (favs.some(x=>x.title === p.title)){
    btnFavorite.textContent = '已收藏 ❤';
    setTimeout(()=>btnFavorite.textContent='收藏 ❤', 1200);
    return;
  }
  favs.push({title:p.title, dynasty:p.dynasty, author:p.author});
  saveFavs(favs);
  renderFavs();
  btnFavorite.textContent = '收藏成功 ✓';
  setTimeout(()=>btnFavorite.textContent='收藏 ❤', 1200);
});
btnClearFav.addEventListener('click', ()=>{
  if (confirm('确定清空所有收藏？')){
    saveFavs([]);
    renderFavs();
  }
});

// 启动
function start(){
  // 支持 ?idx=N 指定初始诗词，?fav=1 展示收藏夹
  const params = new URLSearchParams(location.search);
  const idx = parseInt(params.get('idx'));
  if (!isNaN(idx) && idx >= 0 && idx < POEMS_DATA.length){
    currentIndex = (idx - 1 + POEMS_DATA.length) % POEMS_DATA.length; // 让 randomPoem 能切到 idx
    renderPoem(POEMS_DATA[idx]);
  } else {
    randomPoem();
  }
  renderFavs();
  if (params.get('fav') === '1' && getFavs().length > 0){
    favBox.hidden = false;
  }
}
start();