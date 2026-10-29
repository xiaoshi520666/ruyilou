/* =========================================================================
 *  apps.js —— 五个程序的界面逻辑
 *  所有"内容"都来自 data.js，本文件只负责渲染与交互
 * ========================================================================= */

/* ---------- 小工具 ---------- */
const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* localStorage 在 file:// 直接打开时可能被浏览器禁用，故带一层内存兜底 */
const _mem = {};
const Store = {
  get(k, d) {
    try { const v = localStorage.getItem(k); if (v) return JSON.parse(v); } catch (e) {}
    return _mem[k] !== undefined ? _mem[k] : d;
  },
  set(k, v) {
    _mem[k] = v;
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  },
};

/* ---------- 程序化生成照片画面（图库用，无需真实图片素材） ---------- */
function svgScene(scene, seed) {
  const rnd = (n => () => (n = (n * 9301 + 49297) % 233280) / 233280)(seed || 7);
  const S = (inner) => `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
  switch (scene) {
    case "sunset": return S(`
      <defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2b1a5e"/><stop offset=".45" stop-color="#ff7a59"/><stop offset="1" stop-color="#ffd479"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#sk)"/>
      <circle cx="200" cy="176" r="46" fill="#fff3b0" opacity=".95"/>
      <path d="M0 190 L70 140 L120 190 L180 120 L250 190 L320 150 L400 190 L400 300 L0 300Z" fill="#2a1440"/>
      <rect y="190" width="400" height="110" fill="#1b0f30" opacity=".85"/>
      <g opacity=".55"><rect x="176" y="196" width="48" height="8" fill="#ffd479"/>
      <rect x="168" y="212" width="64" height="6" fill="#ffb26b"/><rect x="180" y="226" width="40" height="5" fill="#ff8f5e"/></g>
      <g fill="#fff" opacity=".8"><circle cx="40" cy="40" r="1.6"/><circle cx="120" cy="26" r="1.2"/><circle cx="330" cy="52" r="1.5"/><circle cx="270" cy="30" r="1"/></g>`);
    case "city": return S(`
      <rect width="400" height="300" fill="#0b1a3a"/>
      <rect y="120" width="400" height="180" fill="#132a52"/>
      <circle cx="330" cy="52" r="24" fill="#fdf6d8"/><circle cx="318" cy="46" r="20" fill="#0b1a3a"/>
      ${Array.from({ length: 12 }).map((_, i) => {
        const w = 24 + Math.floor(rnd() * 22), h = 60 + Math.floor(rnd() * 130), x = i * 34;
        return `<rect x="${x}" y="${300 - h}" width="${w}" height="${h}" fill="#08142c"/>
        ${Array.from({ length: Math.floor(h / 22) }).map((__, j) =>
          Array.from({ length: 2 }).map((___, k) =>
            `<rect x="${x + 5 + k * 11}" y="${300 - h + 8 + j * 22}" width="6" height="9" fill="${rnd() > .45 ? "#ffd479" : "#5ad0ff"}" opacity="${rnd() > .3 ? .9 : .25}"/>`).join("")).join("")}`;
      }).join("")}`);
    case "sea": return S(`
      <defs><linearGradient id="s2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#bff0ff"/><stop offset=".5" stop-color="#4fc3e8"/><stop offset="1" stop-color="#0b5b86"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#s2)"/>
      <circle cx="300" cy="70" r="34" fill="#fffbe0" opacity=".9"/>
      <path d="M0 170 Q100 150 200 170 T400 170 L400 300 L0 300Z" fill="#0b5b86"/>
      <path d="M0 200 Q100 182 200 200 T400 200 L400 300 L0 300Z" fill="#084a70"/>
      <path d="M0 240 Q120 220 240 240 T400 236 L400 300 L0 300Z" fill="#063a58"/>
      <g stroke="#eafcff" stroke-width="2" opacity=".5"><path d="M40 258 q20 -8 40 0"/><path d="M180 272 q20 -8 40 0"/><path d="M280 250 q20 -8 40 0"/></g>`);
    case "forest": return S(`
      <defs><linearGradient id="s3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#dff3d8"/><stop offset="1" stop-color="#1e4a2a"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#s3)"/>
      ${Array.from({ length: 16 }).map((_, i) => {
        const x = i * 26 + rnd() * 10, h = 90 + rnd() * 110;
        return `<path d="M${x} ${300 - h} L${x + 26} ${300 - h + 60} L${x - 26} ${300 - h + 60} Z" fill="${i % 3 ? "#123c22" : "#0d2e1a"}"/>`;
      }).join("")}
      <rect y="250" width="400" height="50" fill="#0b2416"/>
      <g fill="#fff" opacity=".35"><ellipse cx="120" cy="210" rx="120" ry="16"/><ellipse cx="300" cy="240" rx="140" ry="14"/></g>`);
    case "room": return S(`
      <rect width="400" height="300" fill="#3b3026"/>
      <rect x="40" y="40" width="150" height="120" fill="#9fd8ff" stroke="#2a2119" stroke-width="6"/>
      <path d="M115 40 V160 M40 100 H190" stroke="#2a2119" stroke-width="5"/>
      <path d="M190 60 L330 90 L330 230 L190 200 Z" fill="#5b4a37"/>
      <rect x="60" y="200" width="200" height="12" fill="#6b563f"/>
      <rect x="70" y="212" width="10" height="60" fill="#4a3a2a"/><rect x="240" y="212" width="10" height="60" fill="#4a3a2a"/>
      <rect y="250" width="400" height="50" fill="#2b241c"/>
      <ellipse cx="115" cy="270" rx="120" ry="24" fill="#ffe9a8" opacity=".18"/>
      <circle cx="300" cy="70" r="16" fill="#ffe9a8" opacity=".5"/>`);
    case "stars": return S(`
      <rect width="400" height="300" fill="#050a20"/>
      <ellipse cx="200" cy="150" rx="220" ry="70" fill="#2a3f8f" opacity=".55"/>
      <ellipse cx="200" cy="150" rx="140" ry="40" fill="#6a7fd8" opacity=".35"/>
      ${Array.from({ length: 70 }).map(() => {
        const x = rnd() * 400, y = rnd() * 300, r = .6 + rnd() * 1.6;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(.3 + rnd() * .7).toFixed(2)}"/>`;
      }).join("")}`);
    case "glitch": return S(`
      <rect width="400" height="300" fill="#c9c9c9"/>
      ${Array.from({ length: 26 }).map(() => {
        const y = rnd() * 300, h = 4 + rnd() * 22, o = (rnd() * 120 - 60).toFixed(0);
        const c = ["#ff3b3b", "#2b7fd0", "#111", "#fff"][Math.floor(rnd() * 4)];
        return `<rect x="${o}" y="${y.toFixed(0)}" width="400" height="${h.toFixed(0)}" fill="${c}" opacity="${(.2 + rnd() * .5).toFixed(2)}"/>`;
      }).join("")}
      <rect x="60" y="126" width="280" height="48" fill="#111" opacity=".85"/>
      <text x="200" y="158" font-size="22" font-family="Microsoft YaHei" fill="#ff5252" text-anchor="middle">数据损坏 / DATA CORRUPTED</text>`);
    default: return S(`
      <defs><linearGradient id="s4" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8fd4ff"/><stop offset="1" stop-color="#b1a6ff"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#s4)"/>
      <circle cx="120" cy="110" r="70" fill="#fff" opacity=".35"/>
      <circle cx="280" cy="190" r="90" fill="#ffd479" opacity=".35"/>
      <g opacity=".6" stroke="#fff" stroke-width="2" fill="none"><circle cx="200" cy="150" r="100"/><circle cx="200" cy="150" r="60"/></g>`);
  }
}

/* =========================================================================
 *  Apps 注册表
 * ========================================================================= */
const Apps = {};

/* ----------------------------------------------------------------
 * 1. ReChat —— 仿微信
 *      左侧：会话选择列表（顶部为本人信息 + 登出）
 *      右侧：聊天窗口
 *      点击「登出」回到登录界面，可切换账号（肖忠纯需输密码）
 * ---------------------------------------------------------------- */
Apps.rechat = {
  mount(body, api) {
    try {
      this._mount(body, api);
    } catch (e) {
      /* 兜底：任何渲染异常都不留白屏 */
      body.innerHTML = `
        <div class="app rc-login-wrap">
          <div class="rc-login">
            <div class="lg-brand"><span class="lg-logo">R</span>
              <div><div class="lg-t">ReChat 2.6</div><div class="lg-s">载入失败</div></div>
            </div>
            <div class="lg-body">
              <div class="lg-err on">本地存档与当前版本不兼容，无法读取会话。</div>
              <button class="y2k-btn lg-btn" id="rc-fix">清空本地存档并重新载入</button>
            </div>
            <div class="lg-copy">${esc(String(e && e.message || e))}</div>
          </div>
        </div>`;
      const btn = body.querySelector("#rc-fix");
      if (btn) btn.addEventListener("click", () => {
        try {
          Object.keys(localStorage)
            .filter(k => k.indexOf("reos.v1.") === 0)
            .forEach(k => localStorage.removeItem(k));
        } catch (err) {}
        WM.close("rechat");
        setTimeout(() => WM.open("rechat"), 120);
      });
    }
  },

  _mount(body, api) {
    /* 兼容旧存档：本地记录里若还是已下线的账号，强制回到默认账号 */
    let accKey = Store.get("reos.v1.wxAcc", "liu");
    if (!RECHAT_ACCOUNTS[accKey] || (accKey !== "liu" && !(RECHAT.contactsByAccount[accKey] || []).length)) {
      accKey = "liu";
      Store.set("reos.v1.wxAcc", "liu");
    }
    const st = {
      acc: accKey,
      logged: Store.get("reos.v1.wxLogged", true),
      cur: 0,
      filter: "",
      err: "",
    };

    /* 当前账号 / 该账号下的会话列表 */
    function account() { return RECHAT_ACCOUNTS[st.acc] || RECHAT_ACCOUNTS.liu; }
    function contacts() {
      return st.acc === "liu" ? RECHAT.contacts : (RECHAT.contactsByAccount[st.acc] || []);
    }
    function setTitle() {
      const a = account();
      api.setTitle("ReChat" + (st.logged ? " - " + a.name : " - 登录"));
    }

    /* ======================= 登录界面 =======================
       只有一个干净的登录框：微信号 + 密码 + 登录。
       不显示任何账号资料、不做任何提示、不暴露除本人之外的账号。 */
    function renderLogin() {
      setTitle();
      body.innerHTML = `
        <div class="app rc-login-wrap">
          <div class="rc-login">
            <div class="lg-brand"><span class="lg-logo">R</span>
              <div><div class="lg-t">ReChat 2.6</div><div class="lg-s">${esc(STORY.appYear)} 版</div></div>
            </div>
            <div class="lg-body">
              <input class="lg-pwd lg-user" id="lg-user" spellcheck="false" autocomplete="off"
                value="${esc(RECHAT_ACCOUNTS.liu.wxid)}" placeholder="微信号">
              <input class="lg-pwd" id="lg-pwd" type="password" spellcheck="false" autocomplete="off" placeholder="密码">
              <div class="lg-err ${st.err ? "on" : ""}">${esc(st.err || "")}</div>
              <button class="y2k-btn lg-btn" id="lg-login">登 录</button>
            </div>
            <div class="lg-copy">© 1999-${esc(STORY.appYear)} ${esc(STORY.pcModel)}</div>
          </div>
        </div>`;

      const userIn = body.querySelector("#lg-user");
      const pwdIn = body.querySelector("#lg-pwd");
      const norm = s => String(s || "").replace(/\s+/g, "").toLowerCase();

      const doLogin = () => {
        const u = norm(userIn.value);
        if (!u) { userIn.focus(); return; }
        const acc = Object.values(RECHAT_ACCOUNTS).find(a =>
          norm(a.wxid) === u || norm(a.name) === u ||
          norm(a.wxid).replace(/[^a-z0-9]/g, "") === u.replace(/[^a-z0-9]/g, ""));
        const pw = norm(pwdIn.value);
        const ok = acc && (!acc.password ||
          pw === norm(acc.password) ||
          (acc.passwordAlt || []).some(x => norm(x) === pw));
        if (!ok) {
          st.err = "账号或密码错误";
          renderLogin();
          setTimeout(() => { const el = body.querySelector("#lg-user"); if (el) el.focus(); }, 30);
          return;
        }
        st.acc = acc.id; st.logged = true; st.err = ""; st.cur = 0;
        Store.set("reos.v1.wxAcc", st.acc);
        Store.set("reos.v1.wxLogged", true);
        renderMain0();
      };
      body.querySelector("#lg-login").addEventListener("click", doLogin);
      [userIn, pwdIn].forEach(el => el.addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); }));
      setTimeout(() => { if (pwdIn.isConnected) pwdIn.focus(); }, 40);
    }

    /* ======================= 主界面 ======================= */
    function renderMain0() {
      setTitle();
      const a = account();
      /* 头像内容：有 emoji 就显示 emoji（如雀巢的小鸟），否则显示首字 */
      const av = p => p.emoji ? `<span class="av-ico">${p.emoji}</span>` : esc(p.initial || "");
      const nowStr = () => {
        const d = new Date();
        return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
      };
      body.innerHTML = `
        <div class="app rc">
          <div class="rc-side">
            <div class="rc-me">
              <span class="rc-avatar" style="background:${a.avatar}">${av(a)}</span>
              <span class="rc-me-txt"><span class="nm">${esc(a.name)}</span><br><span class="sg">${esc(a.signature)}</span></span>
              <button class="rc-logout" id="rc-logout" title="退出当前账号">登出</button>
            </div>
            <div class="rc-search"><input id="rc-q" placeholder="搜索会话 / 联系人" spellcheck="false"><span>🔍</span></div>
            <div class="rc-list" id="rc-list"></div>
          </div>
          <div class="rc-main" id="rc-main"></div>
        </div>`;

      const listEl = body.querySelector("#rc-list");
      const mainEl = body.querySelector("#rc-main");
      const searchIn = body.querySelector("#rc-q");

      searchIn.addEventListener("input", e => { st.filter = e.target.value.trim(); renderList(); });
      body.querySelector("#rc-logout").addEventListener("click", () => {
        st.logged = false; st.err = "";
        Store.set("reos.v1.wxLogged", false);
        renderLogin();
      });

      /* ---- 通过搜索添加陌生人 ---- */
      function addFriend(s) {
        if (s.added) return;
        s.added = true;
        const c = {
          id: s.id, name: s.name, avatar: s.avatar, initial: s.initial, emoji: s.emoji,
          signature: s.signature, time: nowStr(), unread: 0,
          messages: [{ type: "system", text: "你已添加了「" + s.name + "」，现在可以开始聊天了。" }],
          autoReply: null,
        };
        const arr = contacts();
        arr.push(c);
        st.cur = arr.indexOf(c);
        st.filter = ""; searchIn.value = "";
        renderList(); renderMain();
        (s.onAdd || []).forEach(m => setTimeout(() => {
          c.messages.push({ from: m.from, text: m.text, time: nowStr() });
          if (WM.isOpen("rechat")) { renderList(); renderMain(); }
        }, m.delay || 600));
      }

      function renderList() {
        const f = st.filter.toLowerCase();
        const all = contacts();
        const list = all.filter(c => !f || c.name.toLowerCase().includes(f) || c.signature.toLowerCase().includes(f));
        const items = list.map(c => {
          const i = all.indexOf(c);
          const last = c.messages[c.messages.length - 1];
          const pv = last ? (last.type === "system" ? "[系统消息]" : (last.from === "me" ? "我：" : "") + (last.type === "photo" ? "[图片]" : last.text)) : "";
          return `<div class="rc-item ${i === st.cur ? "on" : ""}" data-i="${i}">
            <span class="rc-avatar" style="background:${c.avatar};width:34px;height:34px;flex:0 0 34px">${av(c)}</span>
            <span style="flex:1;min-width:0">
              <span style="display:flex;justify-content:space-between">
                <span class="nm">${esc(c.name)}</span><span class="tm">${esc(c.time || (last && last.time ? last.time : "") || "")}</span>
              </span>
              <span style="display:flex;justify-content:space-between;gap:6px">
                <span class="pv">${esc(pv)}</span>${c.unread ? `<span class="badge">${c.unread}</span>` : ""}
              </span>
            </span>
          </div>`;
        }).join("");

        /* 搜到尚未添加的陌生人时，底部出现「添加」区块 */
        const cands = f ? (RECHAT.strangers || []).filter(s => !s.added &&
          (s.wxid.toLowerCase().includes(f) || s.name.toLowerCase().includes(f))) : [];
        const extra = cands.length ? `<div class="rc-sec">添加好友</div>` + cands.map((s, k) => `
          <div class="rc-stranger">
            <span class="rc-avatar" style="background:${s.avatar};width:34px;height:34px;flex:0 0 34px">${av(s)}</span>
            <span style="flex:1;min-width:0">
              <span class="nm" style="display:block">${esc(s.name)}</span>
              <span class="pv">微信号：${esc(s.wxid)} ｜ ${esc(s.region || "")}</span>
            </span>
            <button class="rc-add" data-k="${k}">添加</button>
          </div>`).join("") : "";

        listEl.innerHTML = (items || `<div class="empty-tip">没有匹配的会话</div>`) + extra;
        listEl.querySelectorAll(".rc-item").forEach(it => it.addEventListener("click", () => {
          st.cur = +it.dataset.i; const c = all[st.cur]; c.unread = 0;
          renderList(); renderMain();
        }));
        listEl.querySelectorAll(".rc-add").forEach(b => b.addEventListener("click", e => {
          e.stopPropagation();
          addFriend(cands[+b.dataset.k]);
        }));
      }

      function renderMain() {
        const c = contacts()[st.cur];
        if (!c) { mainEl.innerHTML = `<div class="rc-empty">选择一个会话开始对话</div>`; return; }
        api.setTitle(c.name + " - ReChat (" + a.name + ")");
        mainEl.innerHTML = `
          <div class="rc-head"><span><span class="t">${esc(c.name)}</span><br><span class="sub">${esc(c.signature || "")}</span></span><span>⋯</span></div>
          <div class="rc-msg" id="rc-msg">
            ${c.messages.map(m => {
              if (m.type === "system") return `<div class="rc-sys">${esc(m.text)}</div>`;
              const body = m.type === "photo"
                ? `<span class="rc-bubble rc-photo"><span class="ph-shot">［${esc(m.text)} · 待制作］</span></span>`
                : `<span class="rc-bubble">${esc(m.text)}</span>`;
              return `<div class="rc-row ${m.from === "me" ? "me" : ""}">
                <span class="rc-avatar" style="background:${m.from === "me" ? a.avatar : c.avatar};width:32px;height:32px;flex:0 0 32px">${av(m.from === "me" ? a : c)}</span>
                <span>${body}</span></div>`;
            }).join("")}
          </div>
          <div class="rc-input">
            <div class="rc-tools"><span>😊</span><span>🖼</span><span>📎</span><span>📷</span>
              <span class="rc-me-nm">${esc(a.name)}</span></div>
            <textarea id="rc-in" placeholder="输入消息，Enter 发送，Shift+Enter 换行"></textarea>
            <div class="rc-send"><span style="color:#999;align-self:center;margin-right:auto;font-size:11px">${c.autoReply ? "对方设置了自动回复" : ""}</span>
              <button class="y2k-btn ghost">关闭</button><button class="y2k-btn" id="rc-send">发送(S)</button></div>
          </div>`;

        const msgEl = mainEl.querySelector("#rc-msg");
        msgEl.scrollTop = msgEl.scrollHeight;
        const inEl = mainEl.querySelector("#rc-in");
        mainEl.querySelector("#rc-send").addEventListener("click", send);
        mainEl.querySelector(".y2k-btn.ghost").addEventListener("click", () => api.close());
        inEl.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });

        const now = nowStr;
        function send() {
          const t = inEl.value.trim(); if (!t) return;
          c.messages.push({ from: "me", text: t, time: now() });
          c.time = now();
          inEl.value = "";
          renderMain(); renderList();
          if (c.autoReply) {
            setTimeout(() => {
              c.messages.push({ from: "them", text: c.autoReply, time: now() });
              if (WM.isOpen("rechat")) { renderMain(); renderList(); }
            }, 700);
          }
        }
      }
      renderList(); renderMain();
    }

    if (st.logged) renderMain0(); else renderLogin();
  },
};

/* ------------------------------------------------------- 2. 千度（浏览器） */
Apps.qiandu = {
  mount(body, api) {
    const st = { stack: ["qiandu://home"], i: 0, tab: "web", q: "" };
    body.innerHTML = `
      <div class="app br">
        <div class="br-tabs">
          <div class="br-tab on"><span>千度一下，你就知道</span><span class="x">✕</span></div>
          <div class="br-new" id="br-new">＋</div>
        </div>
        <div class="br-bar">
          <div class="br-nav">
            <button id="br-back" title="后退">◀</button>
            <button id="br-fwd" title="前进">▶</button>
            <button id="br-reload" title="刷新">⟳</button>
            <button id="br-home" title="主页">🏠</button>
          </div>
          <div class="br-omni"><span class="lock">🔒</span><input id="br-url" spellcheck="false"></div>
          <button class="y2k-btn" id="br-go">转到</button>
        </div>
        <div class="br-view" id="br-view"></div>
      </div>`;

    const view = body.querySelector("#br-view");
    const urlIn = body.querySelector("#br-url");
    const backBtn = body.querySelector("#br-back");
    const fwdBtn = body.querySelector("#br-fwd");

    function displayUrl(u) {
      if (u.startsWith("qiandu://home")) return "https://www.qiandu.com/";
      if (u.startsWith("qiandu://s?")) return "https://www.qiandu.com/s?wd=" + encodeURIComponent(decodeURIComponent(u.split("wd=")[1] || ""));
      if (u.startsWith("qiandu://news/")) {
        const n = NEWS[u.split("/")[3]];
        return n ? n.url : "http://www.chengduguiwen.com/news/";
      }
      if (u.startsWith("qiandu://police/doc/")) return POLICE.site.url + "?doc=" + u.split("/")[4];
      if (u.startsWith("qiandu://police/s?")) return POLICE.site.url + "?q=" + encodeURIComponent(decodeURIComponent(u.split("q=")[1] || ""));
      if (u.startsWith("qiandu://police/s")) return POLICE.site.url;
      if (u.startsWith("qiandu://police/login")) return POLICE.site.url + "/login";
      if (u.startsWith("qiandu://police")) return "http://www.cdpolice.gov.cn/";
      if (u.startsWith("qiandu://resiforum")) return RESIFORUM.site.url;
      if (u.startsWith("qiandu://weibo")) return WEIBO.site.url + "chunchun";
      if (u.startsWith("qiandu://forum/s?")) return FORUM.site.url + "search.php?q=" + encodeURIComponent(decodeURIComponent(u.split("q=")[1] || ""));
      if (u.startsWith("qiandu://forum/t/")) return FORUM.site.url + "thread-" + u.split("/")[4] + ".html";
      if (u.startsWith("qiandu://forum")) return FORUM.site.url;
      if (u.startsWith("qiandu://page/")) return "https://baike.qiandu.com/item/" + u.split("/")[3];
      return "https://www.qiandu.com/";
    }
    function go(u, replace) {
      if (replace) st.stack[st.i] = u;
      else { st.stack = st.stack.slice(0, st.i + 1); st.stack.push(u); st.i = st.stack.length - 1; }
      render();
    }
    function render() {
      const u = st.stack[st.i];
      urlIn.value = displayUrl(u);
      backBtn.disabled = st.i <= 0; fwdBtn.disabled = st.i >= st.stack.length - 1;
      view.scrollTop = 0;
      if (u.startsWith("qiandu://home")) renderHome();
      else if (u.startsWith("qiandu://s?")) renderResults(decodeURIComponent(u.split("wd=")[1] || ""));
      else if (u.startsWith("qiandu://news/")) renderNews(u.split("/")[3]);
      else if (u.startsWith("qiandu://police")) renderPolice(u);
      else if (u.startsWith("qiandu://resiforum")) renderResiForum(u);
      else if (u.startsWith("qiandu://weibo")) renderWeibo();
      else if (u.startsWith("qiandu://forum/s?")) renderForumSearch(decodeURIComponent(u.split("q=")[1] || ""));
      else if (u.startsWith("qiandu://forum/t/")) renderForumThread(u.split("/")[4]);
      else if (u.startsWith("qiandu://forum")) renderForumHome();
      else if (u.startsWith("qiandu://page/")) renderPage(u.split("/")[3]);
      else renderHome();
    }

    function searchBox(value, big) {
      const hist = Store.get("reos.v1.qdHist", []);
      return `<div class="qd-box">
          <input id="qd-in" value="${esc(value || "")}" placeholder="${big ? "输入关键词，回车搜索" : ""}" spellcheck="false">
          <button id="qd-go">千度一下</button>
        </div>
        ${hist.length ? `<div class="qd-tips" style="margin-top:10px">最近搜索：
          ${hist.slice(0, 6).map(h => `<a class="qd-h" data-q="${esc(h)}" style="color:#1a6fc4">${esc(h)}</a>`).join(" · ")}</div>` : ""}`;
    }
    function bindSearch() {
      const inp = view.querySelector("#qd-in");
      const btn = view.querySelector("#qd-go");
      const doSearch = () => {
        const q = inp.value.trim(); if (!q) return;
        const h = Store.get("reos.v1.qdHist", []);
        if (!h.includes(q)) { h.unshift(q); Store.set("reos.v1.qdHist", h.slice(0, 12)); }
        go("qiandu://s?wd=" + encodeURIComponent(q));
      };
      btn.addEventListener("click", doSearch);
      inp.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
      view.querySelectorAll(".qd-h").forEach(a => a.addEventListener("click", () =>
        go("qiandu://s?wd=" + encodeURIComponent(a.dataset.q))));
      setTimeout(() => inp && inp.focus(), 30);
    }

    function renderHome() {
      api.setTitle("千度一下，你就知道 - 千度浏览器");
      view.innerHTML = `<div class="qd-home">
        <div class="qd-logo">千度</div>
        <div class="qd-slogan">QIANDU · 千度一下，你就知道</div>
        ${searchBox("", true)}
        <div class="qd-foot">© 2003 QIANDU · 本站页面均为游戏内虚构内容 ｜ 京ICP备000000号</div>
      </div>`;
      bindSearch();
    }

    function renderResults(q) {
      st.q = q;
      api.setTitle(q + " - 千度搜索");
      const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
      // 命中判定：整词命中；整词不中时，再按「3 字以上、且含汉字」的连续片段兜底（适配无分词的中文搜索）
      // 纯英文/数字/网址不做片段兜底 —— 否则 "http://…" 里的 "ht""ww" 会误命中一堆无关词条
      const CN = /[\u4e00-\u9fa5]/;
      const score = e => {
        const hay = (e.title + " " + e.snippet + " " + e.keywords.join(" ") + " " + e.site + " " + (e.url || "")).toLowerCase();
        let s = 0;
        toks.forEach(t => {
          if (hay.includes(t)) { s += 3; return; }
          if (!CN.test(t)) return;
          for (let i = 0; i + 3 <= t.length; i++) {
            for (let j = Math.min(t.length, i + 6); j >= i + 3; j--) {
              const frag = t.slice(i, j);
              if (!CN.test(frag)) continue;
              if (hay.includes(frag)) { s += 1; return; }
            }
          }
        });
        return s;
      };
      const hits = QIANDU.index.map(e => ({ e, s: score(e) })).filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s).map(x => x.e);
      const shown = st.tab === "web" ? hits : hits.filter(h => h.tag === st.tab);
      view.innerHTML = `<div class="qd-res">
        <div class="qd-topbar">
          <span class="mini">千度</span>
          <div style="flex:1;max-width:560px">${searchBox(q)}</div>
        </div>
        <div class="qd-tabs">
          <span class="${st.tab === "web" ? "on" : ""}" data-t="web">网页</span>
          <span class="${st.tab === "image" ? "on" : ""}" data-t="image">图片</span>
        </div>
        <div class="qd-cnt">千度为您找到相关结果约 ${shown.length} 个，用时 0.0${(q.length % 9) + 1} 秒</div>
        <div class="qd-body">
          <div class="qd-main">
            ${shown.length ? shown.map(e => `
              <div class="qd-item" data-page="${esc(e.page || "missing")}" data-kind="${esc(e.kind || "web")}">
                <h3>${esc(e.title)}</h3>
                <div class="url">${esc(e.url)} ｜ ${esc(e.site)} ｜ ${esc(e.date)}</div>
                <p>${esc(e.snippet)}</p>
                <div class="tagline">标签：${esc(e.tag)} ｜ 关键词：${esc(e.keywords.join("、"))}</div>
              </div>`).join("") : `
              <div class="qd-none">
                <div class="big">很抱歉，没有找到与「${esc(q)}」相关的网页。</div>
                <div class="hint">建议：检查关键词中是否有多余的空格或错别字，<br>也可以换一种说法再试一次。</div>
              </div>`}
          </div>
          <div class="qd-side">
            <div class="qd-card qd-ad">
              <h5>推广</h5>
              ${(QIANDU.ads || []).map(a => `<div class="qd-aditem">
                <div class="at">${esc(a.title)}</div>
                <div class="ax">${esc(a.text)}</div>
                <div class="au">${esc(a.url)}</div>
              </div>`).join("")}
            </div>
          </div>
        </div>
      </div>`;
      bindSearch();
      view.querySelectorAll(".qd-tabs span").forEach(s => s.addEventListener("click", () => { st.tab = s.dataset.t; render(); }));
      view.querySelectorAll(".qd-item").forEach(it => it.addEventListener("click", () => {
        if (it.dataset.kind === "news") go("qiandu://news/" + it.dataset.page);
        else if (it.dataset.kind === "forum") go("qiandu://forum/home");
        else if (it.dataset.kind === "weibo") go("qiandu://weibo/home");
        else if (it.dataset.kind === "police") go("qiandu://police");
        else if (it.dataset.kind === "resiforum") go("qiandu://resiforum");
        else go("qiandu://page/" + it.dataset.page);
      }));
      view.querySelectorAll(".qd-side li").forEach(li => li.addEventListener("click", () => {
        if (li.dataset.q) go("qiandu://s?wd=" + encodeURIComponent(li.dataset.q));
      }));
    }

    function renderPage(key) {
      const p = QIANDU.pages[key] || QIANDU.pages.missing;
      api.setTitle(p.title + " - 千度百科");
      view.innerHTML = `<div class="wiki">
        <h1>${esc(p.title)}</h1>
        <div class="meta">${esc(p.meta || "")}</div>
        ${p.blocks.map(b => {
          if (b.type === "h2") return `<h2>${esc(b.text)}</h2>`;
          if (b.type === "p") return `<p>${esc(b.text)}</p>`;
          if (b.type === "quote") return `<blockquote>${esc(b.text)}</blockquote>`;
          if (b.type === "info") return `<div class="info">${(b.items || []).map(([k, v]) =>
            `<span class="k">${esc(k)}</span><span>${esc(v)}</span>`).join("")}</div>`;
          if (b.type === "figure") return `<figure class="figure"><div class="ph">「预留：配图」</div>
            <figcaption>${esc(b.caption || "")}</figcaption></figure>`;
          if (b.type === "locked") return `<div class="locked">${esc(b.text)}</div>`;
          return "";
        }).join("")}
        <div style="margin-top:24px"><a id="qd-back2" style="color:#1a6fc4">← 返回搜索结果</a> ｜
          <a id="qd-home2" style="color:#1a6fc4">回到千度首页</a></div>
      </div>`;
      view.querySelector("#qd-back2").addEventListener("click", () => {
        if (st.i > 0) { st.i--; render(); } else go("qiandu://home");
      });
      view.querySelector("#qd-home2").addEventListener("click", () => go("qiandu://home"));
    }

    /* ---------- 围脖（早期微博样式）：肖忠纯 chunchun 的主页 ---------- */
    /* ---------- 成都市公安局 · 档案查询系统（内网，需登录） ---------- */
    /* ---------- 成都市公安局 · 政府门户 + 档案查询系统（内网，需登录） ----------
       路由：qiandu://police          政府门户首页（新闻网页式，无需登录）
             qiandu://police/login    民警登录界面
             qiandu://police/s?q=     档案检索（需登录）
             qiandu://police/doc/<id> 档案详情（需登录，部分需二次核验） */
    function renderPolice(u) {
      const S = POLICE.site, hero = STORY.hero, P = POLICE.portal;
      const logged = Store.get("reos.v1.police", false);
      const isPortal = u === "qiandu://police" || u === "qiandu://police/" || u === "qiandu://police/home";
      const isLogin = u === "qiandu://police/login";

      const emblem = `<svg viewBox="0 0 40 40" class="ps-emb-svg"><circle cx="20" cy="20" r="17.6" fill="#0a2f5c" stroke="#c9a227" stroke-width="2"/><path d="M20 9.2l3.2 6.7 7.3.9-5.4 5 1.4 7.2-6.5-3.5-6.5 3.5 1.4-7.2-5.4-5 7.3-.9z" fill="#c9a227"/></svg>`;

      /* 统一外壳。active = 导航高亮项下标（0 首页 / 2 档案查询） */
      function shell(inner, active) {
        return `<div class="ps">
          <div class="ps-top">
            <span class="ps-emb">${emblem}</span>
            <span class="ps-title"><span class="ps-name">${esc(S.name)}</span><span class="ps-sys">${esc(S.system)}</span></span>
            <span class="ps-slogan">${esc(S.slogan)}</span>
          </div>
          <div class="ps-nav">
            ${S.nav.map((n, i) => {
              const dest = i === 0 ? "qiandu://police"
                : i === 2 ? (logged ? "qiandu://police/s" : "qiandu://police/login") : "";
              return `<span class="${i === active ? "on" : ""}"${dest ? ` data-go="${dest}"` : ""}>${esc(n)}</span>`;
            }).join("")}
            <span class="ps-who">${logged
              ? `当前用户：${esc(hero.name)}（警号 ${esc(hero.policeId)}）<a id="ps-out">［退出］</a>`
              : `未登录　<a id="ps-login-link">［民警登录］</a>`}</span>
          </div>
          <div class="ps-body">${inner}</div>
          <div class="ps-foot">${esc(S.footer)}<br>${esc(S.icp)}</div>
        </div>`;
      }

      /* 公共事件：退出 / 顶部登录入口 / 导航跳转 */
      function bindCommon() {
        const out = view.querySelector("#ps-out");
        if (out) out.addEventListener("click", () => { Store.set("reos.v1.police", false); go("qiandu://police", true); });
        const lg = view.querySelector("#ps-login-link");
        if (lg) lg.addEventListener("click", () => go("qiandu://police/login"));
        view.querySelectorAll(".ps-nav [data-go]").forEach(el =>
          el.addEventListener("click", () => go(el.dataset.go)));
      }

      /* ============ 1. 政府门户首页（新闻网页式，无需登录） ============ */
      if (isPortal) {
        api.setTitle(S.name + " · 政府门户网站");
        const picIco = `<svg viewBox="0 0 40 40" class="ps-pic-ico"><circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1"/><path d="M20 10l2.8 5.9 6.5.8-4.8 4.4 1.2 6.4-5.7-3.1-5.7 3.1 1.2-6.4-4.8-4.4 6.5-.8z" fill="rgba(255,255,255,.82)"/></svg>`;
        const portal = `
          <div class="ps-portal">
            <div class="ps-datebar">
              <span>${esc(P.dateLine)}</span>
              <span class="ps-date-r">公安内网 · 非涉密信息发布平台</span>
            </div>
            <div class="ps-ticker"><div class="ps-ticker-run"><span>${esc(P.ticker)}</span><span>${esc(P.ticker)}</span></div></div>

            <div class="ps-pwrap">
              <div class="ps-pmain">
                <div class="ps-headline">
                  <span class="ps-hl-tag">${esc(P.headline.cat)}</span>
                  <h1>${esc(P.headline.title)}</h1>
                  <p>${esc(P.headline.summary)}</p>
                  <div class="ps-hl-meta">发布时间：${esc(P.headline.date)}　｜　来源：市公安局办公室　｜　浏览次数：2417</div>
                </div>

                <div class="ps-toplist">
                  ${P.subHead.map(n => `<a class="ps-topitem">${esc(n.title)}</a>`).join("")}
                </div>

                <div class="ps-cols">
                  ${P.columns.map(col => `<div class="ps-col">
                    <div class="ps-col-h"><b>${esc(col.title)}</b><span>更多 »</span></div>
                    <ul>${col.items.map(it => `<li><span class="ps-cat">［${esc(it.cat)}］</span><a>${esc(it.title)}</a><span class="ps-dt">${esc(it.date)}</span></li>`).join("")}</ul>
                  </div>`).join("")}
                </div>

                <div class="ps-pics">
                  <div class="ps-col-h"><b>图片新闻</b><span>更多 »</span></div>
                  <div class="ps-pics-row">${P.pics.map(p => `<div class="ps-pic">
                    <div class="ps-pic-img" style="background:${esc(p.tone)}">${picIco}</div>
                    <div class="ps-pic-cap">${esc(p.cap)}</div>
                  </div>`).join("")}</div>
                </div>
              </div>

              <div class="ps-pside">
                <div class="ps-loginbox">
                  <div class="ps-col-h"><b>${esc(P.loginTitle)}</b></div>
                  <p>${esc(P.loginDesc)}</p>
                  <button class="ps-btn" id="ps-portal-login">${logged ? "进入档案查询系统" : "登　录"}</button>
                  <div class="ps-loginbox-f">${logged
                    ? `当前用户：${esc(hero.name)}（警号 ${esc(hero.policeId)}）`
                    : "账号由政工部门统一开通"}</div>
                </div>

                <div class="ps-sbox">
                  <div class="ps-col-h"><b>通知公告</b><span>更多 »</span></div>
                  <ul>${P.notices.map(n => `<li><a>${esc(n.title)}</a><span class="ps-dt">${esc(n.date)}</span></li>`).join("")}</ul>
                </div>

                <div class="ps-sbox">
                  <div class="ps-col-h"><b>办事指南</b></div>
                  <div class="ps-svc">${P.services.map(s => `<div class="ps-svc-i"><b>${esc(s.name)}</b><span>${esc(s.desc)}</span></div>`).join("")}</div>
                </div>

                <div class="ps-sbox ps-enter" id="ps-portal-enter">
                  <div class="ps-col-h"><b>档案查询系统</b></div>
                  <p>案件卷宗 · 户籍档案 · 历史归档案卷</p>
                  <button class="ps-btn">${logged ? "进入系统 »" : "登录并进入 »"}</button>
                </div>

                <div class="ps-stats">${esc(P.stats)}</div>
              </div>
            </div>
          </div>`;
        view.innerHTML = shell(portal, 0);
        bindCommon();
        const goEnter = () => go(logged ? "qiandu://police/s" : "qiandu://police/login");
        const b1 = view.querySelector("#ps-portal-login");
        if (b1) b1.addEventListener("click", goEnter);
        const b2 = view.querySelector("#ps-portal-enter");
        if (b2) b2.addEventListener("click", goEnter);
        return;
      }

      /* ============ 2. 民警登录界面 ============
         未登录时访问检索 / 档案详情也会落到这里。 */
      if (isLogin || !logged) {
        api.setTitle("民警登录 - " + S.name + S.system);
        view.innerHTML = shell(`
          <div class="ps-login">
            <div class="ps-card">
              <div class="ps-card-h">${esc(S.system)} · 民警登录</div>
              <div class="ps-warn">${esc(S.notice)}</div>
              <label class="ps-lb">用户名</label>
              <input class="ps-in" id="ps-user" spellcheck="false" autocomplete="off" placeholder="姓名拼音">
              <label class="ps-lb">密　码</label>
              <input class="ps-in" id="ps-pass" type="password" spellcheck="false" autocomplete="off" placeholder="警号后四位">
              <div class="ps-err ${st.psErr ? "on" : ""}">${esc(st.psErr || "")}</div>
              <button class="ps-btn" id="ps-go">登　录</button>
              <div class="ps-note">账号由政工部门统一开通。无法登录请联系信息通信科（内线 8100）。</div>
            </div>
            <div class="ps-side-note">本系统数据属内部管理信息，<br>严禁拍照、截屏或以任何形式外传。<br>
              <a id="ps-home-link" style="color:#0a5aa8;cursor:pointer">« 返回门户首页</a></div>
          </div>`, 2);
        const uEl = view.querySelector("#ps-user");
        const pEl = view.querySelector("#ps-pass");
        const submit = () => {
          const un = uEl.value.trim().toLowerCase();
          const pw = pEl.value.trim();
          const okUser = un === POLICE.auth.user || un === hero.name;
          const okPass = pw === POLICE.auth.pass || pw === hero.policeId;
          if (!okUser || !okPass) {
            st.psErr = "用户名或密码错误。若连续 5 次失败，账号将被锁定。";
            renderPolice("qiandu://police/login");
            return;
          }
          st.psErr = ""; st.psQ = "";
          Store.set("reos.v1.police", true);
          go("qiandu://police/s", true);
        };
        view.querySelector("#ps-go").addEventListener("click", submit);
        [uEl, pEl].forEach(el => el.addEventListener("keydown", e => { if (e.key === "Enter") submit(); }));
        const home = view.querySelector("#ps-home-link");
        if (home) home.addEventListener("click", () => go("qiandu://police"));
        bindCommon();
        setTimeout(() => { if (uEl.isConnected) uEl.focus(); }, 40);
        return;
      }

      /* ============ 3. 已登录：档案详情 ============ */
      if (u.startsWith("qiandu://police/doc/")) {
        const id = u.split("/")[4];
        const a = POLICE.archives.find(x => x.id === id);
        if (!a) { view.innerHTML = shell(`<div class="ps-empty">未找到该档案，或档案已按规定销毁。</div>`, 2); bindCommon(); return; }

        /* ---- 需身份核验的档案：先给摘要，正文锁在核验之后 ---- */
        const vKey = "reos.v1.police.v." + id;
        const verified = !!Store.get(vKey, false);
        if (a.verify && !verified) {
          if (st.vId !== id) { st.vId = id; st.vErr = ""; }
          api.setTitle(a.title + " · 身份核验 - " + S.system);
          view.innerHTML = shell(`
            <div class="ps-doc">
              <div class="ps-crumb"><a id="ps-back">« 返回检索结果</a><span>档案编号 ${esc(a.no)}</span></div>
              <div class="ps-doc-h">
                <span class="ps-level lv-${esc(a.level)}">${esc(a.level)}</span>
                <h1>${esc(a.title)}</h1>
                <div class="ps-doc-meta">${esc(a.no)}　｜　${esc(a.date)}　｜　${esc(a.status)}　｜　需核验</div>
              </div>
              <div class="ps-doc-body">
                <p class="ps-masked">${esc(a.summary)}</p>
                <div class="ps-veil">以下登记信息已加密 · 需核验查询人身份后展开</div>
                <div class="ps-verify">
                  <div class="ps-card-h">居民信息核验</div>
                  <p class="ps-verify-t">${esc(a.verify.hint)}</p>
                  <label class="ps-lb">居民姓名</label>
                  <input class="ps-in" id="ps-vname" spellcheck="false" autocomplete="off" placeholder="楼内任意一位居民的姓名">
                  <label class="ps-lb">预留电话</label>
                  <input class="ps-in" id="ps-vphone" spellcheck="false" autocomplete="off" placeholder="该居民登记的联系电话">
                  <div class="ps-err ${st.vErr ? "on" : ""}">${esc(st.vErr || "")}</div>
                  <button class="ps-btn" id="ps-vgo">核　验</button>
                  <div class="ps-note">${esc(a.verify.note || "")}</div>
                </div>
              </div>
              <div class="ps-doc-foot">核验失败 3 次以上的查询将被记录并通报所在单位。<br>
                查询人：${esc(hero.name)}（警号 ${esc(hero.policeId)}）　查询时间：2005-10-17</div>
            </div>`, 2);
          const nEl = view.querySelector("#ps-vname");
          const pEl = view.querySelector("#ps-vphone");
          const submitVerify = () => {
            const nm = nEl.value.replace(/\s+/g, "");
            const ph = pEl.value.replace(/[\s-]/g, "");
            const list = (a.verify.accept || []).filter(x => x && x.name && x.phone);
            const hit = list.some(x => x.name.replace(/\s+/g, "") === nm && x.phone.replace(/[\s-]/g, "") === ph);
            if (!nm || !ph || !hit) {
              st.vErr = a.verify.fail;
              renderPolice(u);
              return;
            }
            st.vErr = ""; st.vId = "";
            Store.set(vKey, true);
            go(u, true);
          };
          view.querySelector("#ps-vgo").addEventListener("click", submitVerify);
          [nEl, pEl].forEach(el => el.addEventListener("keydown", e => { if (e.key === "Enter") submitVerify(); }));
          view.querySelector("#ps-back").addEventListener("click", () => {
            if (st.psQ) go("qiandu://police/s?q=" + encodeURIComponent(st.psQ), true);
            else go("qiandu://police/s", true);
          });
          bindCommon();
          setTimeout(() => { if (nEl.isConnected) nEl.focus(); }, 40);
          return;
        }

        api.setTitle(a.title + " - " + S.system);
        const blocks = a.blocks.map(b => {
          if (b.type === "h2") return `<h2>${esc(b.text)}</h2>`;
          if (b.type === "p") return `<p>${esc(b.text)}</p>`;
          if (b.type === "quote") return `<blockquote>${esc(b.text)}</blockquote>`;
          if (b.type === "locked") return `<div class="ps-locked">${esc(b.text)}</div>`;
          if (b.type === "info") return `<table class="ps-info">${(b.items || []).map(([k, v]) =>
            `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>`;
          return "";
        }).join("");
        view.innerHTML = shell(`
          <div class="ps-doc">
            <div class="ps-crumb"><a id="ps-back">« 返回检索结果</a><span>档案编号 ${esc(a.no)}</span></div>
            <div class="ps-doc-h">
              <span class="ps-level lv-${esc(a.level)}">${esc(a.level)}</span>
              <h1>${esc(a.title)}</h1>
              <div class="ps-doc-meta">${esc(a.no)}　｜　${esc(a.date)}　｜　${esc(a.status)}${a.verify ? `　｜　<span class="ps-vok">身份已核验</span>` : ""}</div>
            </div>
            <div class="ps-doc-body">${blocks}</div>
            <div class="ps-doc-foot">本页为存档扫描件转录，如有出入以纸质卷宗为准。<br>
              查询人：${esc(hero.name)}（警号 ${esc(hero.policeId)}）　查询时间：2005-10-17　操作已留痕</div>
          </div>`, 2);
        view.querySelector("#ps-back").addEventListener("click", () => {
          if (st.psQ) go("qiandu://police/s?q=" + encodeURIComponent(st.psQ), true);
          else go("qiandu://police/s", true);
        });
        bindCommon();
        return;
      }

      /* ============ 4. 已登录：档案检索首页 ============ */
      const q = u.startsWith("qiandu://police/s?") ? decodeURIComponent(u.split("q=")[1] || "") : "";
      st.psQ = q;
      api.setTitle((q ? q + " - 档案检索" : "档案查询") + " - " + S.name);
      const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
      const hay = a => (a.title + " " + a.summary + " " + a.no + " " + a.status + " " + a.keywords.join(" ") + " " +
        a.blocks.map(b => (b.text || "") + (b.items ? b.items.flat().join(" ") : "")).join(" ")).toLowerCase();
      /* 命中结果按年度倒序（最新的档案排在最前），默认列表同理 */
      const list = (toks.length ? POLICE.archives.filter(a => toks.some(t => hay(a).includes(t))) : POLICE.archives)
        .slice().sort((x, y) => Number(y.year) - Number(x.year));

      view.innerHTML = shell(`
        <div class="ps-home">
          <div class="ps-search">
            <span class="ps-search-lb">档案检索</span>
            <input id="ps-q" value="${esc(q)}" spellcheck="false" placeholder="案件代号、关键词，例：巧雀如意楼">
            <button class="ps-btn ps-btn-s" id="ps-s">检　索</button>
          </div>
          <div class="ps-cnt">${toks.length ? `检索「${esc(q)}」共命中 <b>${list.length}</b> 条记录` : `档案库共 <b>${POLICE.archives.length}</b> 条可查阅记录`}</div>
          ${list.length ? `<table class="ps-table">
            <thead><tr><th>档案编号</th><th>标题</th><th>年度</th><th>密级</th><th>状态</th></tr></thead>
            <tbody>${list.map(a => `<tr data-id="${esc(a.id)}">
              <td class="no">${esc(a.no)}</td>
              <td class="tt">${esc(a.title)}<span class="su">${esc(a.summary)}</span></td>
              <td>${esc(a.year)}</td>
              <td><span class="ps-level lv-${esc(a.level)}">${esc(a.level)}</span></td>
              <td>${esc(a.status)}</td>
            </tr>`).join("")}</tbody>
          </table>` : `<div class="ps-empty">未检索到相关档案。<br><span>请更换关键词后重试，或联系档案室（内线 8021）申请调阅。</span></div>`}
          <div class="ps-tip">提示：档案正文中的「受限内容」需三级权限，当前账号无权查看。</div>
        </div>`, 2);
      const qEl = view.querySelector("#ps-q");
      const doSearch = () => go("qiandu://police/s?q=" + encodeURIComponent(qEl.value.trim()));
      view.querySelector("#ps-s").addEventListener("click", doSearch);
      qEl.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
      view.querySelectorAll(".ps-table tbody tr").forEach(tr => tr.addEventListener("click", () =>
        go("qiandu://police/doc/" + tr.dataset.id)));
      bindCommon();
    }
    /* ---------- 「居民之家」：如意楼居民自己搭的社区（早期天涯 / 猫扑版式，暖色） ---------- */
    /* ---------- 「居民之家」：如意楼居民自己搭的社区（早期天涯 / 猫扑版式，暖色） ----------
       路由：qiandu://resiforum        主题列表
             qiandu://resiforum/t/<id> 帖子详情（双击主题打开，贴吧式楼层排版） */
    function renderResiForum(route) {
      const R = RESIFORUM, s = R.site;
      const BOSS = 5; /* 站长＝酷乐小子（chunchun） */
      const m = /^qiandu:\/\/resiforum\/t\/([A-Za-z0-9_-]+)/.exec(route || "");

      const boss = R.users.find(x => x.uid === BOSS) || R.users[0];
      const userOf = name => R.users.find(u => u.name === name);
      const ava = name => {
        const u = userOf(name);
        return u ? { c: u.avatar, i: u.initial, t: u.title, p: u.posts, s: u.sign }
                 : { c: "#9a8f80", i: "匿", t: "游客", p: 0, s: "" };
      };

      const shell = (crumb, inner) => `<div class="rf">
        <div class="rf-head">
          <div class="rf-hd-l">
            <div class="rf-logo">${esc(s.name)}</div>
            <div class="rf-sub">${esc(s.sub)}</div>
            <div class="rf-url">${esc(s.url)}</div>
          </div>
          <div class="rf-hd-r">
            <div class="rf-since">开站：${esc(s.since)}</div>
            <div class="rf-since">会员 ${R.stats.members} 人　｜　帖子 ${R.stats.posts} 篇</div>
          </div>
        </div>

        <div class="rf-navbar">
          ${s.nav.map((n, i) => `<span class="rf-nb${i === 0 ? " on" : ""}">${esc(n)}</span>`).join('<i class="rf-nb-sep">|</i>')}
          <i class="rf-nb-sep">|</i><span class="rf-nb">搜索</span>
          <span class="rf-nb-right">简体中文　｜　加入收藏　｜　联系站长</span>
        </div>

        <div class="rf-path">当前位置：<a href="javascript:void(0)">${esc(s.name)}</a> &gt; ${crumb}</div>

        ${inner}

        <div class="rf-foot">
          <div class="rf-badges">${s.badges.map(b => `<span class="rf-badge">${esc(b)}</span>`).join("")}</div>
          <div class="rf-counter">您是第 <b>${String(s.counter).padStart(6, "0")}</b> 位来访者</div>
          <div class="rf-fl">${esc(s.browserTip)}</div>
          <div class="rf-fl">${esc(s.copyright)}</div>
          <div class="rf-fl rf-fnote">${esc(s.note)}</div>
        </div>
      </div>`;

      /* ============ 帖子详情：早期贴吧式楼层排版 ============ */
      if (m) {
        const t = R.threads.find(x => x.id === m[1]);
        if (!t) {
          api.setTitle("主题不存在 - " + s.name);
          view.innerHTML = shell("社区论坛", `<div class="rf-main" style="padding:16px">
            <div class="rf-box rf-guest-empty">该主题不存在，或已被站长删除。<br>
              <a href="javascript:void(0)" id="rf-back" class="rf-backlink">« 返回主题列表</a></div>
          </div>`);
          view.querySelector("#rf-back").addEventListener("click", () => go("qiandu://resiforum"));
          return;
        }

        api.setTitle(t.title + " - " + s.name);

        /* 楼层时间：以发帖日为起点，逐楼 +3 分钟 */
        const stamp = i => {
          const total = 20 * 60 + 41 + i * 3;
          const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
          const mm = String(total % 60).padStart(2, "0");
          return `${t.time} ${hh}:${mm}`;
        };

        const all = [{ f: 0, who: t.author, text: t.text || t.title, op: true }].concat(t.floors);
        const floorHtml = all.map((r, i) => {
          const a = ava(r.who);
          const isOp = !!r.op;
          return `<div class="rfp-floor${isOp ? " is-op" : ""}">
            <div class="rfp-side">
              <div class="rfp-ava" style="background:${esc(a.c)}">${esc(a.i)}</div>
              <div class="rfp-nick">${esc(r.who)}</div>
              <div class="rfp-lv">${esc(a.t)}</div>
              <div class="rfp-stat">帖 ${a.p}</div>
              ${a.s ? `<div class="rfp-sign">签名：${esc(a.s)}</div>` : ""}
            </div>
            <div class="rfp-body">
              <div class="rfp-hd">
                <span class="rfp-lou">${isOp ? "楼主" : esc(String(r.f)) + "楼"}</span>
                <span class="rfp-time">发表于 ${esc(stamp(i))}</span>
              </div>
              ${r.to ? `<div class="rfp-to">${esc(r.to)}</div>` : ""}
              ${r.text ? `<div class="rfp-text">${esc(r.text)}</div>` : ""}
              ${r.img ? `<div class="rfp-img">［图片：${esc(r.img)} · 待制作］</div>` : ""}
              <div class="rfp-act">回复　｜　引用</div>
            </div>
          </div>`;
        }).join("");

        const views = 63 + t.floors.length * 19;
        view.innerHTML = shell(`<a href="javascript:void(0)" id="rf-back2">社区论坛</a> &gt; 主题`,
          `<div class="rfp-wrap">
            <div class="rfp-bar">
              <a href="javascript:void(0)" id="rf-back" class="rf-backlink">« 返回主题列表</a>
              <span class="rfp-bar-r">回复 ${t.floors.length}　｜　点击 ${views}</span>
            </div>
            <h1 class="rfp-title">${esc(t.title)}
              ${t.pinned ? '<span class="rf-pin">置顶</span>' : ""}</h1>
            <div class="rfp-meta">作者：${esc(t.author)}　｜　发表于 ${esc(t.time)}</div>
            ${t.deleted ? '<div class="rfp-deleted">该主题已被删除，仅管理员可见。</div>' : ""}
            <div class="rfp-floors">${floorHtml}</div>
            <div class="rfp-qr">回复功能已关闭 —— 服务器空间不够了，字太多的都存不下。</div>
          </div>`);
        view.querySelector("#rf-back").addEventListener("click", () => go("qiandu://resiforum"));
        view.querySelector("#rf-back2").addEventListener("click", () => go("qiandu://resiforum"));
        return;
      }

      /* ============ 主题列表 ============ */
      api.setTitle(s.name + " - " + s.sub);

      const memberRows = R.users.map(u => `<tr>
          <td class="rf-no">No.${u.uid}</td>
          <td class="rf-who"><span class="rf-ava" style="background:${esc(u.avatar)}">${esc(u.initial)}</span>
            <span class="rf-uname">${esc(u.name)}</span>${u.uid === BOSS ? '<span class="rf-crown">站长</span>' : ""}</td>
          <td class="rf-tt">${esc(u.title)}</td>
          <td class="rf-date">${esc(u.joined)}</td>
          <td class="rf-num">${u.posts}</td>
          <td class="rf-sign">${esc(u.sign)}</td>
        </tr>`).join("");

      /* 帖子排序：置顶在前，其余按发布时间**正序**（越早越靠前） */
      const ordered = [...R.threads].sort((a, b) =>
        (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));

      /* 主题列表（双击打开） */
      const topicRows = ordered.map(t => `<tr class="rf-topic" data-id="${esc(t.id)}" title="双击打开该主题">
          <td class="rf-bname"><span class="rf-fico"></span><a href="javascript:void(0)">${esc(t.title)}</a>
            ${t.pinned ? '<span class="rf-pin">置顶</span>' : ""}
            ${t.deleted ? '<span class="rf-del-tag">已删除</span>' : ""}</td>
          <td class="rf-tt">${esc(t.author)}</td>
          <td class="rf-num">${t.floors.length}</td>
          <td class="rf-date">${esc(t.time)}</td>
        </tr>`).join("");

      view.innerHTML = shell("首页",
        `<div class="rf-main">
          <div class="rf-l">
            <div class="rf-box">
              <div class="rf-bh">社区导航</div>
              <ul class="rf-cat">
                <li class="on"><span class="rf-bul">▪</span>社区论坛</li>
                <li><span class="rf-bul">▪</span>会员名单</li>
                <li><span class="rf-bul">▪</span>留言板</li>
                <li><span class="rf-bul">▪</span>站长的窝</li>
                <li><span class="rf-bul">▪</span>帮助与站务</li>
              </ul>
            </div>
            <div class="rf-box">
              <div class="rf-bh">在线情况</div>
              <div class="rf-online"><span class="rf-dot off"></span>当前无人在线</div>
              <div class="rf-small">在线 0 人　｜　今日访客 ${R.stats.todayVisitors} 人</div>
            </div>
            <div class="rf-box">
              <div class="rf-bh">站点信息</div>
              <ul class="rf-info">
                <li><span>站长</span>${esc(boss.name)}</li>
                <li><span>开站</span>${esc(s.since)}</li>
                <li><span>程序</span>手工 HTML</li>
                <li><span>空间</span>如意楼 301 室</li>
                <li><span>备案</span>未备案</li>
              </ul>
            </div>
            <div class="rf-box">
              <div class="rf-bh">友情站点</div>
              <div class="rf-links">${R.links.map(l => `<span class="rf-link">${esc(l.name)}</span>`).join("")}</div>
              <div class="rf-small rf-link-note">交换链接请去留言板</div>
            </div>
          </div>

          <div class="rf-r">
            <div class="rf-box rf-notice">
              <div class="rf-bh">社区公告</div>
              <p>${esc(s.notice)}</p>
              <p class="rf-sig">—— ${esc(s.noticeBy)}</p>
            </div>

            <div class="rf-box">
              <div class="rf-bh">社区论坛　<span class="rf-bh-sub">共 ${R.threads.length} 个主题</span></div>
              <table class="rf-table rf-topics">
                <thead><tr><th>主题</th><th>发帖人</th><th>回复</th><th>发布时间</th></tr></thead>
                <tbody>${topicRows}</tbody>
              </table>
              <div class="rf-gone">双击主题标题即可打开帖子　｜　今日发帖 0　｜　昨日发帖 0</div>
            </div>

            <div class="rf-box">
              <div class="rf-bh">会员名单　<span class="rf-bh-sub">共 ${R.stats.members} 人</span></div>
              <table class="rf-table">
                <thead><tr><th>编号</th><th>会员</th><th>头衔</th><th>注册</th><th>帖</th><th>签名</th></tr></thead>
                <tbody>${memberRows}</tbody>
              </table>
            </div>

            <div class="rf-box">
              <div class="rf-bh">留言板</div>
              <div class="rf-guest-empty">留言板已关闭：服务器空间不够了，字太多的都存不下。</div>
            </div>
          </div>
        </div>`);

      /* 双击主题 → 打开帖子详情 */
      view.querySelectorAll(".rf-topic").forEach(tr => {
        const open = () => go("qiandu://resiforum/t/" + tr.dataset.id);
        tr.addEventListener("dblclick", open);
        const link = tr.querySelector("a");
        if (link) link.addEventListener("dblclick", e => { e.preventDefault(); open(); });
        tr.addEventListener("click", () => {
          view.querySelectorAll(".rf-topic").forEach(x => x.classList.remove("on"));
          tr.classList.add("on");
        });
      });
    }
    function renderWeibo() {
      /* chunchun 的围脖已暂时下线：索引里没有 weibo 词条时，直接当作页面不存在 */
      const online = (QIANDU.index || []).some(e => e.kind === "weibo");
      if (!online) {
        api.setTitle("无法显示该网页 - 千度");
        view.innerHTML = `<div class="qd-none" style="padding:60px 20px">
          <div class="big">无法显示该网页</div>
          <div class="hint">您要访问的页面可能已被删除，或者暂时不可用。</div>
        </div>`;
        return;
      }
      const u = WEIBO.user, s = WEIBO.site;
      api.setTitle("chunchun 的围脖 - " + s.name);
      const st_act = `${u.stats.following} 关注 ｜ ${u.stats.followers} 粉丝 ｜ ${u.stats.posts} 微博`;
      view.innerHTML = `<div class="wbo">
        <div class="wb-top">
          <span class="wb-logo">${esc(s.name)}</span>
          <span class="wb-url">${esc(s.url)}chunchun</span>
          <span class="wb-nav">首页 ｜ 我的围脖 ｜ 找人 ｜ 话题</span>
        </div>
        <div class="wb-banner">
          <span class="rc-avatar wb-av" style="background:${u.avatar}">${esc(u.initial || "")}</span>
          <div class="wb-idbox">
            <div class="wb-nick">${esc(u.nick)} <span class="wb-v" title="${esc(u.verified)}">V</span></div>
            <div class="wb-sub">${esc(u.realname)} ｜ ${esc(u.verified)}</div>
            <div class="wb-sub">${esc(u.bio)}</div>
          </div>
          <div class="wb-stat">${esc(st_act)}<br><span>${esc(u.regTime)}</span></div>
        </div>
        <div class="wb-body">
          <div class="wb-main">
            <div class="wb-bar">全部围脖（${WEIBO.posts.length}）</div>
            ${WEIBO.posts.map(p => `<div class="wb-post ${p.pinned ? "pin" : ""}">
              <span class="rc-avatar wb-pav" style="background:${u.avatar}">${esc(u.initial || "")}</span>
              <div class="wb-pbody">
                <div class="wb-pnick">${esc(u.nick)}${p.pinned ? ` <span class="wb-pin">置顶</span>` : ""}</div>
                <div class="wb-ptx">${p.text}</div>
                <div class="wb-pmeta">
                  <span>${esc(p.time)}</span><span>${esc(p.source)}</span>
                  <span class="wb-acts">转发(${p.repost}) ｜ 评论(${p.comment}) ｜ 赞(${p.like})</span>
                </div>
              </div>
            </div>`).join("")}
            <div class="wb-more">—— 没有更多围脖了 ——</div>
          </div>
          <div class="wb-side">
            <div class="wb-card wx"><h5>◆ 个人资料</h5>
              <ul>
                <li><span>昵称</span>${esc(u.nick)}</li>
                <li><span>真实姓名</span>${esc(u.realname)}</li>
                <li><span>所在地</span>${esc(u.location)}</li>
                <li><span>认证</span>${esc(u.verified)}</li>
                <li><span>注册时间</span>${esc(u.regTime)}</li>
              </ul>
            </div>
            ${(WEIBO.sideNotes && WEIBO.sideNotes.length) ? `<div class="wb-card"><h5>◆ 备注</h5>
              <div class="wb-note">${WEIBO.sideNotes.map(n => esc(n)).join("<br>")}</div></div>` : ""}
            <div class="wb-card"><h5>◆ 返回</h5>
              <div class="wb-note"><a class="wb-back">« 返回千度搜索结果</a></div></div>
          </div>
        </div>
        <div class="wb-foot">${esc(s.name)} · ${esc(s.slogan)} ｜ ${esc(s.url)} ｜ ${esc(s.icp)}<br>本页内容均为游戏内虚构</div>
      </div>`;
      const back = view.querySelector(".wb-back");
      if (back) back.addEventListener("click", () => { if (st.i > 0) { st.i--; render(); } else go("qiandu://home"); });
    }

    /* ---------- 新闻正文页：flash 为 true 时先满屏红闪 ~1.2s，再显示正文 ---------- */
    function renderNews(id) {
      const n = NEWS[id];
      if (!n) { view.innerHTML = `<div class="empty-tip">该新闻不存在或已被删除</div>`; return; }
      api.setTitle(n.title + " - " + n.site);
      if (!n.flash) { renderNewsBody(n); return; }
      const u = st.stack[st.i];   // 若期间用户已跳走，则不再显示正文
      view.innerHTML = `<div class="br-flashwrap on"><span class="noise"></span><span class="mark">402</span></div>`;
      setTimeout(() => {
        if (st.stack[st.i] !== u || !WM.isOpen("qiandu")) return;
        renderNewsBody(n);
      }, 1250);
    }
    function renderNewsBody(n) {
      const accent = n.accent || "#8c1a1a";
      view.innerHTML = `<div class="nw-wrap">
        <div class="nw-head" style="border-bottom-color:${esc(accent)}">
          <span class="nw-logo" style="color:${esc(accent)}">${esc(n.site)}</span>
          <span class="nw-tag">${esc(n.tag || "民间奇闻 · 城市异谈")}</span>
        </div>
        <h1 class="nw-title">${esc(n.title)}</h1>
        <div class="nw-meta">${esc(n.meta)}</div>
        ${n.blocks.map(b => {
          if (b.type === "p") return `<p class="nw-p">${esc(b.text)}</p>`;
          if (b.type === "img") return `<figure class="nw-fig">
            <img src="${esc(b.src)}" alt="${esc(b.caption || "")}">
            <figcaption>${esc(b.caption || "")}</figcaption></figure>`;
          if (b.type === "site") return `<p class="nw-p">${esc(b.text)}<a class="nw-link">${esc(b.link)}</a></p>`;
          return "";
        }).join("")}
      </div>`;
      view.querySelectorAll(".nw-link").forEach(a =>
        a.addEventListener("click", () => go("qiandu://forum/home")));
    }

    /* ---------- 「成都诡闻」论坛（红色色调） ---------- */
    function renderForumHome() {
      api.setTitle(FORUM.site.fullName);
      view.innerHTML = `<div class="fm">
        <div class="fm-head">
          <h1>${esc(FORUM.site.name)}</h1>
          <div class="sl">${esc(FORUM.site.slogan)} ｜ 建站于 ${esc(FORUM.site.founded)}</div>
          <div class="st">${esc(FORUM.site.stats)}</div>
        </div>
        <div class="fm-nav">
          <span class="on">首页</span><span>版块</span><span>排行</span><span id="fm-nav-search">搜索</span>
          <span style="margin-left:auto">游客 [登录] [注册]</span>
        </div>
        <div class="fm-searchbar">
          <span>站内搜索：</span>
          <input class="fm-search" id="fm-search-in" placeholder="输入关键词，如：如意楼" spellcheck="false">
          <button class="fm-sbtn" id="fm-search-go">搜 索</button>
        </div>
        <div class="fm-body">
          <div class="fm-boards">
            <div class="fm-panel">
              <h3>◆ 站内报道</h3>
              ${(FORUM.articles || []).map(a => `<div class="row at" data-n="${esc(a.news)}">
                <span class="bn">${esc(a.title)}</span>
                <span class="bi">${esc(a.author)} ｜ ${esc(a.date)}</span>
              </div>`).join("") || `<div class="fm-sidebody">「预留：暂无报道」</div>`}
            </div>
            <div class="fm-panel">
              <h3>◆ 版块列表</h3>
              ${FORUM.boards.map(b => {
                const ts = FORUM.threads.filter(t => t.board === b.id);
                return `<div class="row">
                  <span class="bn">${esc(b.name)}</span>
                  <span class="bd">${esc(b.desc)}</span>
                  <span class="bi">主题 ${ts.length}</span>
                </div>`;
              }).join("")}
            </div>
            <div class="fm-panel">
              <h3>◆ 最新主题</h3>
              ${FORUM.threads.map(t => {
                const b = FORUM.boards.find(x => x.id === t.board);
                return `<div class="row th" data-t="${esc(t.id)}">
                  ${t.hot ? `<span class="hot">HOT</span>` : ""}
                  <span class="bn">${esc(t.title)}</span>
                  <span class="bi">[${esc(b ? b.name : "")}] ${esc(t.author)} ｜ ${esc(t.time)} ｜ 看 ${esc(t.views)} / 回 ${esc(t.replies)}</span>
                </div>`;
              }).join("")}
            </div>
          </div>
          <div class="fm-side">
            <div class="fm-panel"><h3>◆ 在线会员</h3>
              <div class="fm-sidebody">站长：何编 ｜ 在线「预留」人</div></div>
            <div class="fm-panel"><h3>◆ 本周热帖</h3>
              <div class="fm-sidebody">「预留：热帖标题」<br>「预留：热帖标题」</div></div>
            <div class="fm-panel"><h3>◆ 友情链接</h3>
              <div class="fm-sidebody">千度搜索 ｜ 「预留」</div></div>
          </div>
        </div>
        <div class="fm-foot">${esc(FORUM.site.fullName)} ｜ ${esc(FORUM.site.url)} ｜ ${esc(FORUM.site.icp)}<br>本站内容均为民间传闻，请勿当真</div>
      </div>`;
      view.querySelectorAll(".row.th").forEach(r =>
        r.addEventListener("click", () => go("qiandu://forum/t/" + r.dataset.t)));
      view.querySelectorAll(".row.at").forEach(r =>
        r.addEventListener("click", () => go("qiandu://news/" + r.dataset.n)));
      bindForumSearch();
    }

    /* 论坛站内搜索：同时检索「站内报道」与「帖子」 */
    function bindForumSearch() {
      const inp = view.querySelector("#fm-search-in");
      if (!inp) return;
      const submit = () => {
        const q = inp.value.trim();
        if (!q) { inp.focus(); return; }
        go("qiandu://forum/s?q=" + encodeURIComponent(q));
      };
      inp.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
      view.querySelector("#fm-search-go").addEventListener("click", submit);
      const navS = view.querySelector("#fm-nav-search");
      if (navS) navS.addEventListener("click", () => inp.focus());
    }

    function renderForumSearch(q) {
      api.setTitle("站内搜索：" + q + " - " + FORUM.site.name);
      const key = (q || "").toLowerCase();
      const arts = (FORUM.articles || []).filter(a =>
        (a.title + " " + a.summary + " " + (a.keywords || []).join(" ")).toLowerCase().includes(key));
      const ths = FORUM.threads.filter(t =>
        (t.title + " " + t.author + " " + t.floors.map(f => f.text).join(" ")).toLowerCase().includes(key));
      view.innerHTML = `<div class="fm">
        <div class="fm-head slim"><h1 class="fm-crumb">${esc(FORUM.site.name)} › 站内搜索</h1></div>
        <div class="fm-searchbar">
          <span>站内搜索：</span>
          <input class="fm-search" id="fm-search-in" value="${esc(q)}" spellcheck="false">
          <button class="fm-sbtn" id="fm-search-go">搜 索</button>
        </div>
        <div class="fm-body">
          <div class="fm-boards">
            <div class="fm-panel">
              <h3>◆ 站内报道（${arts.length}）</h3>
              ${arts.length ? arts.map(a => `<div class="row at" data-n="${esc(a.news)}">
                <span class="bn">${esc(a.title)}</span>
                <span class="bi">${esc(a.author)} ｜ ${esc(a.date)}</span>
              </div>`).join("") : `<div class="fm-sidebody">没有匹配的报道</div>`}
            </div>
            <div class="fm-panel">
              <h3>◆ 相关主题（${ths.length}）</h3>
              ${ths.length ? ths.map(t => `<div class="row th" data-t="${esc(t.id)}">
                ${t.hot ? `<span class="hot">HOT</span>` : ""}
                <span class="bn">${esc(t.title)}</span>
                <span class="bi">${esc(t.author)} ｜ ${esc(t.time)}</span>
              </div>`).join("") : `<div class="fm-sidebody">没有匹配的主题</div>`}
            </div>
            ${arts.length + ths.length ? "" : `<div class="fm-panel"><div class="fm-sidebody">「${esc(q)}」没有任何结果。「预留：可在此补充搜索结果或提示」</div></div>`}
          </div>
          <div class="fm-side">
            <div class="fm-panel"><h3>◆ 返回</h3>
              <div class="fm-sidebody"><a class="fm-back">« 回到论坛首页</a></div></div>
            <div class="fm-panel"><h3>◆ 搜索建议</h3>
              <div class="fm-sidebody">试试：如意楼 / 402 / 封门</div></div>
          </div>
        </div>
        <div class="fm-foot">${esc(FORUM.site.url)}search.php?q=${esc(encodeURIComponent(q))}</div>
      </div>`;
      view.querySelectorAll(".row.th").forEach(r =>
        r.addEventListener("click", () => go("qiandu://forum/t/" + r.dataset.t)));
      view.querySelectorAll(".row.at").forEach(r =>
        r.addEventListener("click", () => go("qiandu://news/" + r.dataset.n)));
      view.querySelector(".fm-back").addEventListener("click", () => go("qiandu://forum/home"));
      bindForumSearch();
    }

    function renderForumThread(id) {
      const t = FORUM.threads.find(x => x.id === id);
      if (!t) { view.innerHTML = `<div class="fm"><div class="fm-body"><div class="empty-tip">主题不存在或已被删除</div></div></div>`; return; }
      const b = FORUM.boards.find(x => x.id === t.board);
      api.setTitle(t.title + " - " + FORUM.site.name);
      view.innerHTML = `<div class="fm">
        <div class="fm-head slim"><h1 class="fm-crumb">${esc(FORUM.site.name)} › ${esc(b ? b.name : "")}</h1></div>
        <div class="fm-body">
          <div class="fm-boards">
            <div class="fm-panel">
              <h3>${esc(t.title)}</h3>
              ${t.floors.map((f, i) => `<div class="fm-floor">
                <div class="au"><b>${esc(f.author)}</b><br><span>${esc(f.time || "")}</span></div>
                <div class="ct">${esc(f.text)}<div class="no">${i + 1}楼</div></div>
              </div>`).join("")}
              <div class="fm-reply">
                <textarea placeholder="回复本主题…"></textarea>
                <button class="y2k-btn" id="fm-reply">回复</button>
                <span class="fm-tip">游客身份 · 「预留：登录与回帖系统未接入」</span>
              </div>
            </div>
          </div>
          <div class="fm-side">
            <div class="fm-panel"><h3>◆ 返回</h3>
              <div class="fm-sidebody"><a class="fm-back">« 回到论坛首页</a></div></div>
            <div class="fm-panel"><h3>◆ 相关主题</h3>
              <div class="fm-sidebody">「预留：相关主题」</div></div>
          </div>
        </div>
        <div class="fm-foot">${esc(FORUM.site.url)}thread-${esc(t.id)}.html</div>
      </div>`;
      view.querySelector("#fm-reply").addEventListener("click", () => alert("预留：回帖系统未接入（游客无法回帖）"));
      view.querySelector(".fm-back").addEventListener("click", () => go("qiandu://forum/home"));
    }

    /* 浏览器工具栏 */
    body.querySelector("#br-back").addEventListener("click", () => { if (st.i > 0) { st.i--; render(); } });
    body.querySelector("#br-fwd").addEventListener("click", () => { if (st.i < st.stack.length - 1) { st.i++; render(); } });
    body.querySelector("#br-reload").addEventListener("click", render);
    body.querySelector("#br-home").addEventListener("click", () => go("qiandu://home"));
    body.querySelector("#br-go").addEventListener("click", () => go(parseUrl(urlIn.value)));
    urlIn.addEventListener("keydown", e => { if (e.key === "Enter") go(parseUrl(urlIn.value)); });
    body.querySelector("#br-new").addEventListener("click", () => go("qiandu://home"));
    body.querySelector(".br-tab .x").addEventListener("click", () => api.close());

    function parseUrl(v) {
      v = (v || "").trim();
      if (!v) return "qiandu://home";
      // 原样回车 = 刷新当前页（不重新解析，避免当前页的网址被当成关键词搜走）
      if (v === displayUrl(st.stack[st.i])) return st.stack[st.i];
      if (/^(https?:\/\/)?(www\.)?qiandu\.com\/?$/i.test(v)) return "qiandu://home";
      const m = v.match(/wd=([^&]+)/);
      if (m) return "qiandu://s?wd=" + m[1];
      if (/weibo\.c(n|om)|围脖|t\.weibo/i.test(v)) return "qiandu://weibo/home";
      /* 警局档案站不做网址直达：玩家必须在千度里搜到「成都市公安局」词条再点进去。
         在地址栏输网址只会被当成关键词搜索（见 fallback），避免「输网址就弹出官网」。 */
      if (/item\/([\w-]+)/.test(v)) return "qiandu://page/" + v.match(/item\/([\w-]+)/)[1];
      if (/chengduguiwen\.com\/news\/([\w-]+)/i.test(v)) {
        const slug = v.match(/news\/([\w-]+)/i)[1];
        const hit = Object.keys(NEWS).find(k => NEWS[k].url && NEWS[k].url.toLowerCase().includes(slug));
        return "qiandu://news/" + (hit || "news_ruyilou");
      }
      if (/chengduguiwen\.com\/bbs\/thread-([\w-]+)/i.test(v)) return "qiandu://forum/t/" + v.match(/thread-([\w-]+)/i)[1];
      const ms = v.match(/chengduguiwen\.com\/bbs\/search\.php\?q=([^&]+)/i);
      if (ms) return "qiandu://forum/s?q=" + ms[1];
      if (/chengduguiwen\.com/i.test(v)) return "qiandu://forum/home";
      if (/^qiandu:\/\//.test(v)) return v;
      /* 认不出来的东西一律当关键词搜索（含完整网址），不做任何「猜站点」的行为 */
      return "qiandu://s?wd=" + encodeURIComponent(v);
    }

    render();
  },
};

/* ------------------------------------------------------------- 3. 此电脑 */
Apps.computer = {
  mount(body, api) {
    const st = { path: [EXPLORER.tree], sel: null };
    body.innerHTML = `
      <div class="app ex">
        <div class="ex-bar">
          <button id="ex-back">◀ 后退</button><button id="ex-up">↑ 向上</button>
          <div class="ex-addr" id="ex-addr"></div>
          <input id="ex-find" placeholder="搜索" style="width:120px;height:24px;border:1px solid #a9c0d4;border-radius:3px;padding:0 6px;font-family:inherit">
        </div>
        <div class="ex-main">
          <div class="ex-nav" id="ex-nav"></div>
          <div style="flex:1;display:flex;flex-direction:column;min-width:0">
            <div class="ex-files" id="ex-files"></div>
            <div class="ex-prev" id="ex-prev"></div>
          </div>
        </div>
        <div class="ex-status" id="ex-status"></div>
      </div>`;
    const filesEl = body.querySelector("#ex-files");
    const addrEl = body.querySelector("#ex-addr");
    const navEl = body.querySelector("#ex-nav");
    const prevEl = body.querySelector("#ex-prev");
    const statusEl = body.querySelector("#ex-status");

    function cur() { return st.path[st.path.length - 1]; }

    function renderNav() {
      navEl.innerHTML = `<div class="grp">收藏夹</div>` + EXPLORER.nav.map(g =>
        `<div class="grp">${esc(g.label)}</div>` + g.items.map(it =>
          `<div class="it" data-g="${esc(it)}">🗀 ${esc(it)}</div>`).join("")).join("");
      navEl.querySelectorAll(".it").forEach(it => it.addEventListener("click", () => {
        const node = findByName(EXPLORER.tree, it.dataset.g);
        if (node) { st.path = [EXPLORER.tree]; if (node !== EXPLORER.tree) st.path.push(node); render(); }
      }));
    }
    function findByName(node, name) {
      if (node.name === name) return node;
      for (const c of (node.children || [])) { const r = findByName(c, name); if (r) return r; }
      return null;
    }

    function renderAddr() {
      addrEl.innerHTML = st.path.map((n, i) =>
        `<span class="ex-crumb ${i === st.path.length - 1 ? "cur" : ""}" data-i="${i}">${esc(n.name)}</span>`).join(`<span class="ex-crumb sep">▸</span>`);
      addrEl.querySelectorAll(".ex-crumb[data-i]").forEach(c => c.addEventListener("click", () => {
        st.path = st.path.slice(0, +c.dataset.i + 1); st.sel = null; render();
      }));
    }

    function renderFiles() {
      const n = cur();
      const kids = n.children || [];
      if (!kids.length) {
        filesEl.innerHTML = `<div class="empty-tip">此文件夹为空<br><span style="font-size:11px;color:#b0c0cf">（在 data.js → EXPLORER.tree 里补充内容）</span></div>`;
      } else {
        filesEl.innerHTML = kids.map(k =>
          `<div class="ex-f ${st.sel === k ? "sel" : ""}" data-n="${esc(k.name)}">
            <span class="ico">${k.icon || ICONS.file}</span>
            <div class="nm">${esc(k.name)}${k.locked ? " 🔒" : ""}</div>
          </div>`).join("");
        filesEl.querySelectorAll(".ex-f").forEach(fe => {
          const node = kids.find(k => k.name === fe.dataset.n);
          fe.addEventListener("click", () => { st.sel = node; renderFiles(); renderPrev(); });
          fe.addEventListener("dblclick", () => {
            if (node.type === "file") { st.sel = node; renderFiles(); renderPrev(); }
            else if (node.locked) { st.sel = node; renderFiles(); renderPrev(); }
            else { st.path.push(node); st.sel = null; render(); }
          });
        });
      }
      statusEl.innerHTML = `<span>${kids.length} 个对象</span><span>${st.sel ? esc(st.sel.name) : ""}</span><span style="margin-left:auto">RE OS 资源管理器</span>`;
    }

    function renderPrev() {
      const s = st.sel;
      if (!s) { prevEl.innerHTML = `<div style="color:#8fa4b5">详细信息<br>选中一个对象以查看</div>`; return; }
      prevEl.innerHTML = `<div style="font-weight:bold;margin-bottom:4px">${esc(s.name)}</div>
        <div>类型：${s.type === "file" ? "文件" : s.type === "drive" ? "驱动器" : "文件夹"}</div>
        <div>大小：${esc(s.size || "—")}</div>
        <div>修改日期：${esc(s.date || "—")}</div>
        ${s.note ? `<div style="margin-top:6px;color:#8a5a00">备注：${esc(s.note)}</div>` : ""}
        ${s.body ? `<div style="margin-top:6px;padding:6px;background:#fff;border:1px solid #dfe8f0;border-radius:3px;max-height:120px;overflow:auto">${esc(s.body)}</div>` : ""}
        ${s.locked ? `<div style="margin-top:6px;color:#a33">需要权限才能打开（预留：解锁条件）</div>` : ""}`;
    }

    function render() { renderNav(); renderAddr(); renderFiles(); renderPrev(); }

    body.querySelector("#ex-back").addEventListener("click", () => { if (st.path.length > 1) { st.path.pop(); st.sel = null; render(); } });
    body.querySelector("#ex-up").addEventListener("click", () => { if (st.path.length > 1) { st.path.pop(); st.sel = null; render(); } });
    body.querySelector("#ex-find").addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      const q = e.target.value.trim().toLowerCase();
      const res = [];
      (function walk(n) {
        (n.children || []).forEach(c => { if (c.name.toLowerCase().includes(q)) res.push(c); walk(c); });
      })(EXPLORER.tree);
      filesEl.innerHTML = res.length ? res.map(k =>
        `<div class="ex-f" data-p="${esc(k.name)}"><span class="ico">${k.icon || ICONS.file}</span><div class="nm">${esc(k.name)}</div></div>`).join("")
        : `<div class="empty-tip">没有找到「${esc(q)}」</div>`;
      filesEl.querySelectorAll(".ex-f").forEach(fe => fe.addEventListener("click", () => {
        const node = findByName(EXPLORER.tree, fe.dataset.p);
        st.sel = node; renderFiles(); renderPrev();
      }));
    });

    render();
  },
};

/* --------------------------------------------------------------- 4. 图库 */
Apps.gallery = {
  mount(body, api) {
    const st = { album: 0, light: -1 };
    body.innerHTML = `
      <div class="app ga">
        <div class="ga-top">
          <div class="ga-alb" id="ga-alb"></div>
          <span style="margin-left:auto;color:#5a7185" id="ga-cnt"></span>
        </div>
        <div class="ga-grid" id="ga-grid"></div>
        <div class="ga-light" id="ga-light">
          <button class="close" id="ga-close">✕</button>
          <button class="nav prev" id="ga-prev">◀</button>
          <button class="nav next" id="ga-next">▶</button>
          <div class="stage" id="ga-stage"></div>
          <div class="cap" id="ga-cap"></div>
        </div>
      </div>`;
    const albEl = body.querySelector("#ga-alb");
    const gridEl = body.querySelector("#ga-grid");
    const lightEl = body.querySelector("#ga-light");
    const stageEl = body.querySelector("#ga-stage");
    const capEl = body.querySelector("#ga-cap");

    albEl.innerHTML = GALLERY.albums.map((a, i) =>
      `<button class="${i === st.album ? "on" : ""}" data-i="${i}">${esc(a.name)}</button>`).join("");
    albEl.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      st.album = +b.dataset.i; st.light = -1; lightEl.classList.remove("on");
      albEl.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
      renderGrid();
    }));

    function photos() {
      return st.album === 0
        ? GALLERY.albums.slice(1).flatMap(a => a.photos)
        : GALLERY.albums[st.album].photos;
    }
    function renderGrid() {
      const ps = photos();
      gridEl.innerHTML = ps.map((p, i) =>
        `<div class="ga-card" data-i="${i}">
           <div class="ga-thumb">${svgScene(p.scene, i + 3)}<span class="gloss"></span></div>
           <div class="ga-cap">${esc(p.title)}<br><span style="color:#93a8b8">${esc(p.date)}</span></div>
         </div>`).join("") || `<div class="empty-tip">相册为空</div>`;
      body.querySelector("#ga-cnt").textContent = `${ps.length} 张照片`;
      gridEl.querySelectorAll(".ga-card").forEach(c => c.addEventListener("click", () => openLight(+c.dataset.i)));
    }
    function openLight(i) {
      st.light = i; lightEl.classList.add("on");
      const p = photos()[i];
      stageEl.innerHTML = svgScene(p.scene, i + 3);
      capEl.innerHTML = `<div style="font-size:14px;font-weight:bold">${esc(p.title)}</div>
        <div style="color:#9fb6c8">${esc(p.date)}</div>
        <div style="margin-top:6px;color:#cfe0ec">${esc(p.note)}</div>
        <div style="margin-top:6px;color:#7d93a5;font-size:11px">${i + 1} / ${photos().length}</div>`;
    }
    function step(d) {
      const n = photos().length; if (!n) return;
      openLight((st.light + d + n) % n);
    }
    body.querySelector("#ga-close").addEventListener("click", () => lightEl.classList.remove("on"));
    body.querySelector("#ga-prev").addEventListener("click", e => { e.stopPropagation(); step(-1); });
    body.querySelector("#ga-next").addEventListener("click", e => { e.stopPropagation(); step(1); });
    lightEl.addEventListener("click", e => { if (e.target === lightEl) lightEl.classList.remove("on"); });
    document.addEventListener("keydown", function esc2(e) {
      if (!lightEl.classList.contains("on")) return;
      if (e.key === "Escape") lightEl.classList.remove("on");
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });

    renderGrid();
  },
};

/* --------------------------------------------------------------- 5. 日记已移除 */
/* 原「日记」应用（data.js → DIARY）已按需求删除，桌面图标、开始菜单、程序注册表均不再包含它。 */
