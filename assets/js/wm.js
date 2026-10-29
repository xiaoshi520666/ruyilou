/* =========================================================================
 *  wm.js —— 窗口管理器（Aero 窗口 / 任务栏 / 拖拽 / 缩放 / 最小化）
 * ========================================================================= */
const WM = (function () {
  const desktopEl = document.getElementById("desktop");
  const windowsEl = document.getElementById("windows");
  const tasksEl   = document.getElementById("task-tasks");

  const wins = new Map();          // id -> state
  let zTop = 20;
  let cascade = 0;

  function bounds() {
    return { w: desktopEl.clientWidth, h: desktopEl.clientHeight };
  }

  function focus(id) {
    const s = wins.get(id); if (!s) return;
    if (s.min) { s.el.classList.remove("min"); s.min = false; }
    s.el.style.zIndex = ++zTop;
    document.querySelectorAll(".win.active").forEach(w => w.classList.remove("active"));
    s.el.classList.add("active");
    document.querySelectorAll(".ttask").forEach(t => t.classList.remove("active"));
    s.task.classList.add("active");
    s.task.classList.remove("mined");
  }

  function blurAll() {
    document.querySelectorAll(".win.active").forEach(w => w.classList.remove("active"));
    document.querySelectorAll(".ttask.active").forEach(t => t.classList.remove("active"));
  }

  function minimize(id) {
    const s = wins.get(id); if (!s) return;
    s.min = true; s.el.classList.add("min");
    s.el.classList.remove("active");
    s.task.classList.add("mined"); s.task.classList.remove("active");
  }

  function toggleMax(id) {
    const s = wins.get(id); if (!s) return;
    if (s.max) {
      Object.assign(s.el.style, s.rect);
      s.el.classList.remove("max"); s.max = false;
    } else {
      s.rect = { left: s.el.style.left, top: s.el.style.top, width: s.el.style.width, height: s.el.style.height };
      const b = bounds();
      s.el.style.left = "0px"; s.el.style.top = "0px";
      s.el.style.width = b.w + "px"; s.el.style.height = b.h + "px";
      s.el.classList.add("max"); s.max = true;
    }
    focus(id);
  }

  function close(id) {
    const s = wins.get(id); if (!s) return;
    if (s.api && typeof s.api.onClose === "function") s.api.onClose();
    s.el.remove(); s.task.remove(); wins.delete(id);
  }

  /* ---------- 打开应用 ---------- */
  function open(id) {
    const app = Apps[id];
    if (!app) { console.warn("未注册的应用:", id); return; }
    if (wins.has(id)) { focus(id); return wins.get(id); }

    const meta = APP_META.find(m => m.id === id) || { name: id, icon: "", w: 700, h: 460 };
    const b = bounds();
    const w = Math.min(meta.w, b.w - 20);
    const h = Math.min(meta.h, b.h - 20);
    const off = (cascade++ % 6) * 26;
    const left = Math.max(6, Math.round((b.w - w) / 2 - 120 + off));
    const top  = Math.max(6, Math.round((b.h - h) / 2 - 60 + off));

    const el = document.createElement("div");
    el.className = "win";
    el.dataset.id = id;
    el.style.cssText = `left:${left}px;top:${top}px;width:${w}px;height:${h}px;z-index:${++zTop}`;
    el.innerHTML =
      `<div class="win-title">
         <span class="wico">${meta.icon}</span>
         <span class="wtxt">${meta.name}</span>
         <span class="win-btns">
           <button class="wb min" title="最小化"></button>
           <button class="wb max" title="最大化"></button>
           <button class="wb close" title="关闭"></button>
         </span>
       </div>
       <div class="win-body"></div>
       <div class="win-resize"></div>`;
    windowsEl.appendChild(el);

    /* 任务栏按钮 */
    const task = document.createElement("div");
    task.className = "ttask";
    task.innerHTML = `<span class="wico">${meta.icon}</span><span>${meta.name}</span>`;
    task.addEventListener("mousedown", e => {
      e.stopPropagation();
      const s = wins.get(id); if (!s) return;
      if (s.min) focus(id);
      else if (s.el.classList.contains("active")) minimize(id);
      else focus(id);
    });
    tasksEl.appendChild(task);

    const state = { id, el, task, min: false, max: false, rect: null, api: null };
    wins.set(id, state);

    /* 标题栏按钮 */
    el.querySelector(".wb.min").addEventListener("click", e => { e.stopPropagation(); minimize(id); });
    el.querySelector(".wb.max").addEventListener("click", e => { e.stopPropagation(); toggleMax(id); });
    el.querySelector(".wb.close").addEventListener("click", e => { e.stopPropagation(); close(id); });
    el.querySelector(".win-title").addEventListener("dblclick", e => {
      if (!e.target.closest(".wb")) toggleMax(id);
    });

    /* 拖拽 */
    const title = el.querySelector(".win-title");
    title.addEventListener("pointerdown", e => {
      if (e.target.closest(".wb")) return;
      focus(id);
      if (state.max) return;
      const r = el.getBoundingClientRect();
      const ox = e.clientX - r.left, oy = e.clientY - r.top;
      const move = ev => {
        const bb = bounds();
        let x = ev.clientX - ox, y = ev.clientY - oy;
        x = Math.min(Math.max(x, -r.width + 90), bb.w - 90);
        y = Math.min(Math.max(y, 0), bb.h - 32);
        el.style.left = x + "px"; el.style.top = y + "px";
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    });

    /* 缩放 */
    const rz = el.querySelector(".win-resize");
    rz.addEventListener("pointerdown", e => {
      e.stopPropagation(); focus(id);
      const r = el.getBoundingClientRect();
      const sx = e.clientX, sy = e.clientY, sw = r.width, sh = r.height;
      const move = ev => {
        el.style.width  = Math.max(320, sw + ev.clientX - sx) + "px";
        el.style.height = Math.max(200, sh + ev.clientY - sy) + "px";
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    });

    el.addEventListener("pointerdown", () => focus(id));

    /* 挂载应用内容 */
    const body = el.querySelector(".win-body");
    const api = {
      id,
      el,
      body,
      close: () => close(id),
      setTitle: t => el.querySelector(".wtxt").textContent = t,
      onClose: null,
    };
    state.api = api;
    app.mount(body, api);

    focus(id);
    return state;
  }

  function minimizeAll() { wins.forEach((s, id) => { if (!s.min) minimize(id); }); }
  function isOpen(id) { return wins.has(id); }
  function count() { return wins.size; }

  /* 点击桌面空白 → 取消焦点高亮（不关闭窗口） */
  desktopEl.addEventListener("pointerdown", e => {
    if (e.target === desktopEl || e.target.closest("#wallpaper") || e.target.closest("#icons")) blurAll();
  });

  window.addEventListener("resize", () => {
    const b = bounds();
    wins.forEach(s => {
      if (s.max) { s.el.style.width = b.w + "px"; s.el.style.height = b.h + "px"; return; }
      const w = parseFloat(s.el.style.width), h = parseFloat(s.el.style.height);
      s.el.style.left = Math.min(parseFloat(s.el.style.left), Math.max(0, b.w - 90)) + "px";
      s.el.style.top  = Math.min(parseFloat(s.el.style.top),  Math.max(0, b.h - 32)) + "px";
      s.el.style.width = Math.min(w, b.w) + "px";
      s.el.style.height = Math.min(h, b.h) + "px";
    });
  });

  return { open, close, focus, minimize, toggleMax, minimizeAll, isOpen, count, wins, blurAll };
})();
