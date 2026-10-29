/* =========================================================================
 *  main.js —— 开机动画 / 桌面图标 / 开始菜单 / 任务栏 / 屏保 / 右键菜单
 * ========================================================================= */

/* ---------------- 开机动画 ---------------- */
(function boot() {
  const bootEl = document.getElementById("boot");
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    bootEl.classList.add("hide");
    setTimeout(() => (bootEl.style.display = "none"), 800);
  };
  bootEl.addEventListener("click", finish);
  setTimeout(finish, 3400);
})();

/* ---------------- 开场卷宗 ---------------- */
(function intro() {
  const el = document.getElementById("intro");
  const go = document.getElementById("intro-go");
  if (!el || !go) return;
  let closed = false;
  const finish = () => {
    if (closed) return;
    closed = true;
    el.classList.add("hide");
    setTimeout(() => { el.style.display = "none"; }, 620);
  };
  go.addEventListener("click", finish);
  document.addEventListener("keydown", e => {
    if (closed) return;
    if (e.key === "Enter" || e.key === "Escape" || e.key === " ") { e.preventDefault(); finish(); }
  });
})();

/* ---------------- 桌面图标 ---------------- */
const iconsEl = document.getElementById("icons");
iconsEl.innerHTML = APP_META.map(a =>
  `<div class="dicon" data-id="${a.id}">
     <span class="ico">${a.icon}</span>
     <span class="lb">${a.name}</span>
   </div>`).join("");

iconsEl.querySelectorAll(".dicon").forEach(el => {
  el.addEventListener("click", () => {
    iconsEl.querySelectorAll(".dicon").forEach(x => x.classList.remove("sel"));
    el.classList.add("sel");
  });
  el.addEventListener("dblclick", () => WM.open(el.dataset.id));
});
document.getElementById("desktop").addEventListener("click", e => {
  if (!e.target.closest(".dicon")) iconsEl.querySelectorAll(".dicon").forEach(x => x.classList.remove("sel"));
});

/* ---------------- 开始菜单 ---------------- */
const startBtn = document.getElementById("start-orb");
const menu = document.getElementById("startmenu");

document.getElementById("sm-programs").innerHTML = APP_META.map(a =>
  `<div class="sm-item" data-id="${a.id}">
     <span>${a.icon}</span>
     <span><b>${a.name}</b><br><small>${a.sub}</small></span>
   </div>`).join("");
document.getElementById("sm-right").innerHTML =
  [["此电脑", ICONS.computer], ["图库", ICONS.gallery], ["千度", ICONS.qiandu], ["ReChat", ICONS.rechat]]
    .map(([n, i]) => `<div class="sm-item" data-name="${n}"><span>${i}</span><span><b>${n}</b></span></div>`).join("");

function toggleMenu(force) {
  const open = force !== undefined ? force : !menu.classList.contains("open");
  menu.classList.toggle("open", open);
  startBtn.style.boxShadow = open ? "0 0 18px rgba(140,220,255,1)" : "";
}
startBtn.addEventListener("mousedown", e => { e.stopPropagation(); toggleMenu(); });
document.addEventListener("mousedown", e => {
  if (!e.target.closest("#startmenu") && !e.target.closest("#start-orb")) toggleMenu(false);
});
document.getElementById("sm-programs").addEventListener("click", e => {
  const it = e.target.closest(".sm-item"); if (!it) return;
  WM.open(it.dataset.id); toggleMenu(false);
});
document.getElementById("sm-right").addEventListener("click", e => {
  const it = e.target.closest(".sm-item"); if (!it) return;
  const a = APP_META.find(m => m.name === it.dataset.name);
  if (a) WM.open(a.id);
  toggleMenu(false);
});
document.getElementById("sm-search-input").addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const q = e.target.value.trim();
  const hit = APP_META.find(m => m.name.includes(q) || m.sub.includes(q));
  if (hit) { WM.open(hit.id); toggleMenu(false); }
});

/* ---------------- 任务栏时钟 ---------------- */
const clockEl = document.getElementById("clock");
/* 时间线固定在 STORY.date（当前 2005/03/14），时分秒仍按本机实时走动，
   这样界面上的"现在"永远停在剧情那一年。要改日期请到 data.js → STORY */
function tick() {
  const now = new Date();
  const sy = (STORY && STORY.date ? STORY.date : [now.getFullYear(), now.getMonth() + 1, now.getDate()]);
  const d = new Date(sy[0], sy[1] - 1, sy[2], now.getHours(), now.getMinutes(), now.getSeconds());
  const wd = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
  clockEl.textContent =
    `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} 周${wd}` +
    ` ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  clockEl.title = `${STORY.pcModel} · 本机时间已设定为 ${d.getFullYear()} 年`;
}
tick(); setInterval(tick, 1000);

/* ---------------- 显示桌面 ---------------- */
document.getElementById("show-desktop").addEventListener("click", () => WM.minimizeAll());

/* ---------------- 千禧滤镜（CRT 扫描线） ---------------- */
document.getElementById("btn-crt").addEventListener("click", () => {
  document.getElementById("screen").classList.toggle("crt");
});

/* ---------------- 屏幕保护 ---------------- */
const Saver = (function () {
  const el = document.getElementById("saver");
  const cv = document.getElementById("saver-canvas");
  const ctx = cv.getContext("2d");
  let raf = null, stars = [], t = 0;

  function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
  function init() {
    resize();
    stars = Array.from({ length: 260 }, () => ({
      x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 1 + .2,
      c: ["#ffffff", "#9fe6ff", "#ffd9f2", "#d6ffcf"][Math.floor(Math.random() * 4)],
    }));
  }
  function frame() {
    const w = cv.width, h = cv.height;
    ctx.fillStyle = "rgba(0,0,0,.28)";
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    t += 1;
    // 千禧隧道环
    ctx.strokeStyle = "rgba(120,220,255,.28)";
    for (let i = 0; i < 6; i++) {
      const r = ((t * 1.6 + i * 90) % 900);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 星轨
    stars.forEach(s => {
      s.z -= 0.006;
      if (s.z <= 0.02) { s.z = 1.2; s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; }
      const k = 0.5 / s.z;
      const x = cx + s.x * k * w * 0.55, y = cy + s.y * k * h * 0.55;
      const r = Math.max(0.6, (1.2 - s.z) * 2.4);
      ctx.fillStyle = s.c;
      ctx.globalAlpha = Math.min(1, (1.2 - s.z) * 1.4);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    // 中心文字
    ctx.font = "bold 34px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(160,230,255,${0.35 + Math.sin(t / 26) * 0.25})`;
    ctx.fillText("RE  OS", cx, cy - 6);
    ctx.font = "13px Microsoft YaHei";
    ctx.fillStyle = "rgba(200,240,255,.45)";
    ctx.fillText("MILLENNIUM  SCREENSAVER", cx, cy + 22);
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (el.classList.contains("on")) return;
    init(); el.classList.add("on");
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, cv.width, cv.height);
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (!el.classList.contains("on")) return;
    el.classList.remove("on");
    cancelAnimationFrame(raf); raf = null;
  }
  ["mousemove", "mousedown", "keydown", "wheel", "touchstart"].forEach(ev =>
    el.addEventListener(ev, stop));
  window.addEventListener("resize", () => { if (el.classList.contains("on")) resize(); });
  return { start, stop, get on() { return el.classList.contains("on"); } };
})();

document.getElementById("btn-saver").addEventListener("click", () => Saver.start());
document.getElementById("sm-saver").addEventListener("click", () => { toggleMenu(false); Saver.start(); });

/* 闲置 90 秒自动进入屏保 */
let idleTimer = null;
function resetIdle() {
  if (Saver.on) return;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => Saver.start(), 90000);
}
["mousemove", "mousedown", "keydown", "wheel"].forEach(ev =>
  document.addEventListener(ev, resetIdle, { passive: true }));
resetIdle();

/* 关机 → 回到屏保（不做真正关机） */
document.getElementById("sm-shutdown").addEventListener("click", () => {
  toggleMenu(false);
  document.querySelectorAll(".win").forEach(w => w.remove());
  document.getElementById("task-tasks").innerHTML = "";
  Saver.start();
});

/* ---------------- 桌面右键菜单 ---------------- */
const ctx = document.getElementById("ctxmenu");
const desktopEl = document.getElementById("desktop");
desktopEl.addEventListener("contextmenu", e => {
  e.preventDefault();
  const items = [
    ["查看", "▸"], ["排序方式", "▸"], ["刷新", "⟳"], ["sep"],
    ["切换千禧滤镜", "📺"], ["启动屏幕保护", "✨"], ["sep"],
    ["个性化（切换壁纸）", "🎨"], ["新建文件夹", "🗀"],
  ];
  ctx.innerHTML = items.map(([n, i]) =>
    n === "sep" ? `<div class="ctx-sep"></div>`
      : `<div class="ctx-item" data-a="${n}"><span style="width:16px">${i}</span><span>${n}</span></div>`).join("");
  const w = 190;
  ctx.style.left = Math.min(e.clientX, window.innerWidth - w - 6) + "px";
  ctx.style.top = Math.min(e.clientY, window.innerHeight - items.length * 26 - 20) + "px";
  ctx.classList.add("open");
});
document.addEventListener("mousedown", e => {
  if (!e.target.closest("#ctxmenu")) ctx.classList.remove("open");
});
document.addEventListener("contextmenu", e => {
  if (!e.target.closest("#desktop")) ctx.classList.remove("open");
});
ctx.addEventListener("click", e => {
  const it = e.target.closest(".ctx-item"); if (!it) return;
  const a = it.dataset.a;
  ctx.classList.remove("open");
  if (a === "刷新") location.reload();
  if (a === "启动屏幕保护" || a === "✨") Saver.start();
  if (a === "切换千禧滤镜") document.getElementById("screen").classList.toggle("crt");
  if (a === "个性化（切换壁纸）") {
    const wp = document.getElementById("wallpaper");
    const hues = [0, 60, 120, 180, 240, 300];
    const h = hues[(hues.indexOf(+(wp.dataset.h || 0)) + 1) % hues.length];
    wp.dataset.h = h;
    wp.style.filter = `hue-rotate(${h}deg) saturate(${1 + h / 600})`;
  }
  if (a === "新建文件夹") alert("预留：新建文件夹（可接入文件树写入）");
});

/* ---------------- 全局快捷键 ---------------- */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") toggleMenu(false);
  if (e.ctrlKey && e.key.toLowerCase() === "d") { e.preventDefault(); WM.minimizeAll(); }
});

/* ---------------- 桌面便签：可拖动 · 内容自动保存 ---------------- */
(function stickyNote() {
  const desk = document.getElementById("desktop");
  const note = document.getElementById("sticky");
  const head = document.getElementById("st-head");
  const ta = document.getElementById("st-text");
  const stateEl = document.getElementById("st-state");
  if (!desk || !note || !head || !ta) return;

  const KEY = "reos.v1.sticky";
  const saved = Store.get(KEY, {}) || {};
  ta.value = saved.text || "";
  let x = typeof saved.x === "number" ? saved.x : -1;
  let y = typeof saved.y === "number" ? saved.y : -1;

  const clampPos = () => {
    const maxX = Math.max(0, desk.clientWidth - note.offsetWidth - 6);
    const maxY = Math.max(0, desk.clientHeight - note.offsetHeight - 6);
    x = Math.min(Math.max(0, x), maxX);
    y = Math.min(Math.max(0, y), maxY);
  };
  const place = () => { clampPos(); note.style.left = x + "px"; note.style.top = y + "px"; };

  if (x < 0 || y < 0) { x = desk.clientWidth - 268; y = 74; }
  place();
  window.addEventListener("resize", place);

  let drag = null;
  head.addEventListener("mousedown", e => {
    e.preventDefault();
    drag = { dx: e.clientX - note.offsetLeft, dy: e.clientY - note.offsetTop };
    note.classList.add("dragging");
    document.body.style.userSelect = "none";
  });
  document.addEventListener("mousemove", e => {
    if (!drag) return;
    x = e.clientX - drag.dx;
    y = e.clientY - drag.dy;
    place();
  });
  document.addEventListener("mouseup", () => {
    if (!drag) return;
    drag = null;
    note.classList.remove("dragging");
    document.body.style.userSelect = "";
    save();
  });

  let timer = null;
  function save() {
    Store.set(KEY, { text: ta.value, x: x, y: y });
    stateEl.textContent = "已保存 ✓";
    clearTimeout(timer);
    timer = setTimeout(() => { stateEl.textContent = "自动保存"; }, 1400);
  }
  ta.addEventListener("input", save);
})();
