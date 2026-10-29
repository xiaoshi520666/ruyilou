/* =========================================================================
 *  data.js —— 【全站唯一内容数据源】
 *  ---------------------------------------------------------------------
 *  这个游戏外壳的所有"内容"（聊天、网页、文件、照片、日记）都写在这里。
 *  做剧情时，你只需要改这一个文件，不需要动任何界面代码。
 *
 *  约定：
 *   · 所有 <...> 或 「占位」字样的文本 = 待填剧情的预留位
 *   · id 不要重复；千度的 index[].page 指向 pages 里的 key
 *   · 图库照片用 scene 字段指定程序化生成的画面（无需真图片素材）
 * ========================================================================= */

/* ---------------- 图标（SVG 字符串，可自行替换） ---------------- */
const ICONS = {
  rechat: `<svg viewBox="0 0 48 48"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fe4d0"/><stop offset="1" stop-color="#12a37a"/></linearGradient></defs>
    <rect x="3" y="3" width="42" height="42" rx="10" fill="url(#g1)" stroke="rgba(255,255,255,.85)" stroke-width="1.5"/>
    <path d="M14 20c0-5 4-9 9-9s9 4 9 9-4 9-9 9c-1 0-2-.1-3-.4L15 31l1.4-3.6C15.2 26 14 23.2 14 20z" fill="#fff" opacity=".95"/>
    <circle cx="19" cy="20" r="1.6" fill="#12a37a"/><circle cx="23" cy="20" r="1.6" fill="#12a37a"/><circle cx="27" cy="20" r="1.6" fill="#12a37a"/>
    <path d="M31 26c0-3.6 3-6.5 6.6-6.5 1.2 0 2.4.3 3.4.8l2.6 1.6-.9-2.2c.5-1 .8-2.1.8-3.2 0-3.6-3-6.5-6.6-6.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/></svg>`,

  qiandu: `<svg viewBox="0 0 48 48"><defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fd4ff"/><stop offset=".5" stop-color="#2b7fd0"/><stop offset="1" stop-color="#0b3f86"/></linearGradient></defs>
    <rect x="3" y="3" width="42" height="42" rx="9" fill="url(#g2)" stroke="rgba(255,255,255,.85)" stroke-width="1.5"/>
    <circle cx="21" cy="21" r="11" fill="none" stroke="#fff" stroke-width="3.4"/>
    <path d="M29 29l8 8" stroke="#fff" stroke-width="4.4" stroke-linecap="round"/>
    <text x="21" y="26" font-size="14" font-family="Microsoft YaHei" font-weight="bold" fill="#fff" text-anchor="middle">千</text></svg>`,

  computer: `<svg viewBox="0 0 48 48"><defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eaf6ff"/><stop offset="1" stop-color="#8ab6d8"/></linearGradient></defs>
    <rect x="4" y="7" width="40" height="28" rx="3" fill="url(#g3)" stroke="#2a5b80" stroke-width="2"/>
    <rect x="8" y="11" width="32" height="20" rx="1.5" fill="#1d5f96"/>
    <path d="M10 27l8-9 6 6 5-7 9 10z" fill="#7fd8c0" opacity=".85"/>
    <circle cx="30" cy="16" r="2.6" fill="#ffe58a"/>
    <rect x="15" y="35" width="18" height="4" rx="1" fill="#7ba7c8"/>
    <rect x="9" y="39" width="30" height="4" rx="2" fill="#4d7ea3"/></svg>`,

  gallery: `<svg viewBox="0 0 48 48"><defs><linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfefff"/><stop offset="1" stop-color="#6fb8e8"/></linearGradient></defs>
    <rect x="4" y="8" width="40" height="32" rx="3" fill="#fff" stroke="#4d7ea3" stroke-width="2"/>
    <rect x="7" y="11" width="34" height="22" fill="url(#g4)"/>
    <circle cx="32" cy="17" r="3.4" fill="#ffe58a"/>
    <path d="M7 33l9-10 6 6 5-5 14 9v2H7z" fill="#2f8f6f"/>
    <rect x="17" y="38" width="14" height="3" rx="1.5" fill="#7ba7c8"/></svg>`,

  diary: `<svg viewBox="0 0 48 48"><defs><linearGradient id="g5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff8e2"/><stop offset="1" stop-color="#f0d89a"/></linearGradient></defs>
    <rect x="9" y="5" width="30" height="38" rx="3" fill="url(#g5)" stroke="#a8863f" stroke-width="2"/>
    <rect x="6" y="9" width="6" height="30" rx="3" fill="#5b4a24"/>
    <path d="M17 14h18M17 21h18M17 28h18M17 35h12" stroke="#b09a63" stroke-width="2" stroke-linecap="round"/>
    <path d="M26 30l10 10-4 1-1 4-2-3-3 2z" fill="#2b7fd0" stroke="#fff" stroke-width="1"/></svg>`,

  folder: `<svg viewBox="0 0 48 48"><path d="M4 12h15l4 5h21v24H4z" fill="#ffd479" stroke="#c99a30" stroke-width="1.6"/>
    <path d="M4 17h40v24H4z" fill="#ffe6a8" stroke="#c99a30" stroke-width="1.6"/></svg>`,
  file: `<svg viewBox="0 0 48 48"><path d="M11 4h18l10 10v30H11z" fill="#fff" stroke="#7ba7c8" stroke-width="1.6"/>
    <path d="M29 4v10h10" fill="#dceaf5" stroke="#7ba7c8" stroke-width="1.6"/>
    <path d="M16 22h16M16 28h16M16 34h10" stroke="#9fb9cc" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  drive: `<svg viewBox="0 0 48 48"><rect x="5" y="12" width="38" height="22" rx="3" fill="#cfe1f0" stroke="#5b86a8" stroke-width="1.8"/>
    <rect x="9" y="18" width="18" height="10" rx="1" fill="#8fd4ff"/>
    <circle cx="34" cy="23" r="3" fill="#7fe36b"/>
    <rect x="11" y="34" width="26" height="6" rx="2" fill="#9ab8cf"/></svg>`,
  txt: `<svg viewBox="0 0 48 48"><rect x="10" y="5" width="28" height="38" rx="2" fill="#fff" stroke="#9ab8cf" stroke-width="1.6"/>
    <path d="M15 14h18M15 20h18M15 26h18M15 32h12" stroke="#b6c9d8" stroke-width="2" stroke-linecap="round"/></svg>`,
  img: `<svg viewBox="0 0 48 48"><rect x="6" y="9" width="36" height="30" rx="2" fill="#eaf6ff" stroke="#7ba7c8" stroke-width="1.6"/>
    <circle cx="17" cy="19" r="3" fill="#ffd479"/><path d="M8 35l10-11 7 7 6-5 9 9z" fill="#5bbf9a"/></svg>`,
  exe: `<svg viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="4" fill="#2b7fd0" stroke="#fff" stroke-width="1.6"/>
    <path d="M17 24h14M24 17v14" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,
};

/* ---------------- 应用注册表（顺序 = 桌面图标与开始菜单顺序） ---------------- */
const APP_META = [
  { id: "rechat",   name: "ReChat",    sub: "即时通讯",  icon: ICONS.rechat,   w: 760, h: 520 },
  { id: "qiandu",   name: "千度",      sub: "互联网搜索", icon: ICONS.qiandu,   w: 900, h: 620 },
  { id: "computer", name: "此电脑",    sub: "文件管理",  icon: ICONS.computer, w: 780, h: 500 },
  { id: "gallery",  name: "图库",      sub: "照片查看器", icon: ICONS.gallery,  w: 820, h: 560 },
];

/* =========================================================================
 *  0. STORY —— 全局时间线与主角设定（改这里即可调整整个游戏的年代）
 * ========================================================================= */
const STORY = {
  year: 2005,                    // 剧情所处年份；任务栏时钟会固定显示这一年
  date: [2005, 10, 17],          // 固定日期：2005 年 10 月 17 日（周一，接到任务的当天）
  caseYear: 1999,                // 如意楼旧案发生的年份（本次是旧案重启）
  pcMadeYear: 1999,              // 这台电脑的生产年份
  pcModel: "RE OS 1999 · 台式机",
  appYear: 2004,                 // 软件版本年份（须早于剧情年份）
  hero: {
    name: "刘晨秋",                 // 真名（档案、证件上用）
    nick: "在秋日醒来",             // ReChat 昵称
    job: "青白江派出所 · 民警",
    wxid: "liuchenqiu",
    policeId: "057412",             // 警号（档案站密码 = 后四位 7412）
    initial: "秋",
  },
};

/* =========================================================================
 *  1. ReChat —— 仿微信（左侧会话列表 / 右侧聊天窗）
 * ========================================================================= */

/* 可登录账号。password 为 null 表示本机已记住密码、可直接登录。
   注：肖忠纯（chunchun）账号与围脖相关内容已按需求暂时下线，恢复时取消注释即可。 */
const RECHAT_ACCOUNTS = {
  liu: {
    id: "liu",
    name: STORY.hero.nick,
    wxid: STORY.hero.wxid,
    avatar: "#12a37a", initial: STORY.hero.initial,
    signature: STORY.hero.job,
    password: null,                     // 本机记住密码，直接登录
  },
  /* 【暂时下线】
  chunchun: {
    id: "chunchun", name: "肖忠纯", wxid: "chunchun1976",
    avatar: "#c8503f", initial: "纯", signature: "如意楼 · 楼主",
    password: "1112ruyilou", passwordAlt: ["19701112ruyilou"],
  },
  */
};

const RECHAT = {
  me: {
    name: STORY.hero.nick,
    signature: STORY.hero.job,
    avatar: "#12a37a",
    initial: STORY.hero.initial,
  },
  /* ---- 刘晨秋的会话列表 ---- */
  contacts: [
    {
      id: "zhang", name: "张警官", avatar: "#2f6fb5", initial: "张",
      signature: "青白江派出所 · 张哥",
      pinned: true, unread: 3, time: "14:43",
      messages: [
        { type: "system", text: "2005年10月17日 星期一 08:12" },
        { from: "them", text: "小刘，上次你说感兴趣的案子，代号是巧雀如意楼吗？", time: "08:12" },
        { from: "me", text: "是是是，张哥。", time: "08:13" },
        { from: "me", text: "但是我刚入职，没权限调取咱们警局的网站封存档案。", time: "08:13" },
        { from: "them", text: "不要紧，你把你的警官证给我拍来，我帮你注册账号。", time: "08:15" },
        { from: "me", type: "photo", text: "警官证照片", time: "08:16" },
        { from: "me", text: "好嘞，谢谢张哥。", time: "08:16" },
        { type: "system", text: "几个小时后" },
        { from: "them", text: "OK，账号注册完毕了。用户名就是你的名字拼音，密码是警官号后四位。网址在这里：http://www.cdpolice.gov.cn/archive", time: "14:40" },
        { from: "me", text: "谢谢哥！", time: "14:41" },
        { from: "them", text: "对了，我多嘴一句。办案过程中可以多利用千度和各种论坛搜寻关键词以获得信息。同一个关键词在不同网站能搜索的内容也不一样。", time: "14:42" },
        { from: "me", text: "好嘞哥！定不负你的期望。", time: "14:43" },
      ],
      autoReply: "在单位就按程序走，别自己加戏。",
    },
    {
      id: "sys", name: "ReChat 团队", avatar: "#7a8b99", initial: "R",
      signature: "系统消息",
      unread: 1, time: "2005-03-14",
      messages: [
        { type: "system", text: "欢迎使用 ReChat 2.6（2004 版）" },
        { from: "them", text: "你的账号已在本机保存登录状态。如需更换账号，请点击左上角的「登出」。", time: "08:00" },
      ],
      autoReply: null,
    },
    {
      id: "xiaowang", name: "小王", avatar: "#c8792f", initial: "王",
      signature: "在所里跑腿的",
      time: "09:12",
      messages: [
        { type: "system", text: "2005年10月17日 星期一 09:05" },
        { from: "them", text: "哥，你真要查当年那个邪门案子？据说死者被分成十几块藏进后厨的 hellokitty 头套里，光是听着我就特么想吐。", time: "09:05" },
        { from: "me", text: "这案子就发生在我家隔壁的隔壁的隔壁小区，我实在是心痒痒。", time: "09:08" },
        { from: "me", text: "你这是不相信哥的实力？", time: "09:08" },
        { from: "them", text: "我哪敢啊。我和你说，案发前两天，我还去如意楼的底商巧雀堂吃过饭，现在想想真是一阵恶寒。", time: "09:10" },
        { from: "me", text: "原来这个地方是两个部分啊，我还以为整栋楼就叫巧雀如意楼嘞。", time: "09:11" },
        { from: "them", text: "不说了不说了，你快开工吧，我不打扰。", time: "09:12" },
      ],
      autoReply: "哥你自己当心点，那地方邪性。",
    },

    /* 【暂时下线】值班群、未知联系人 —— 需要时取消注释
    {
      id: "group", name: "青白江派出所值班群（6）", avatar: "#8a6fd0", initial: "值",
      signature: "群公告：本周值班表已上传",
      time: "昨天 21:12",
      messages: [
        { type: "system", text: "你已加入群聊" },
        { from: "them", text: "「预留：同事在群里的闲聊 —— 可作为氛围或侧线线索位」", time: "昨天 21:12" },
      ],
      autoReply: null,
    },
    {
      id: "unknown", name: "未知联系人", avatar: "#555", initial: "?",
      signature: "对方不是你的好友",
      time: "2005-03-12",
      messages: [
        { from: "them", text: "「预留：神秘号码的第一句话 —— 高悬念位，建议留到最后填」", time: "昨天 23:47" },
      ],
      autoReply: "「预留：神秘人回复」",
    },
    */
  ],
  /* ---- 可以在通讯录搜索框里搜到并添加的陌生人（当前无，留作后期用） ---- */
  strangers: [
    /* 【暂时下线】雀巢 —— 需要时取消注释
    {
      id: "quechao",
      wxid: "nestle0330",
      name: "雀巢",
      avatar: "#6b7a4a", initial: "雀", emoji: "🐦",
      signature: "如意楼住户",
      region: "四川 成都",
      added: false,
      onAdd: [
        { from: "them", text: "你是谁？", delay: 400 },
        { from: "me", text: "我是青白江派出所的民警，刘晨秋。1999 年如意楼那件事，所里让我重新查一遍。", delay: 1000 },
        { from: "them", text: "……等了六年，总算有人来问了。", delay: 1700 },
        { from: "them", text: "你要查那件事，先从头开始。如意楼底层有一家店铺，叫巧雀堂，港式茶餐厅，开了很多年了。去那儿看看，比问我强。", delay: 2400 },
      ],
    },
    */
  ],

  /* ---- 切换到其他账号后看到的会话（当前无其他可登录账号，留作后期用） ---- */
  contactsByAccount: {
    /*
    chunchun: [ ... ],
    */
  },
};

/* =========================================================================
 *  2. 千度 —— 仿浏览器 + 搜索引擎（解谜游戏核心搜索区）
 * ========================================================================= */
const QIANDU = {
  // 搜索索引：keywords 命中即出现；page 指向下面 pages 的 key；locked=true 显示"内容缺失"
  index: [
    {
      id: "n0", title: "如意楼修建项目开始动工",
      url: "http://www.qienews.com.cn/news/1992/12/ruyilou.html",
      snippet: "喜讯：青白江区重点项目如意楼终于开始动工。项目主管为项目经验丰富的杨主管，负责整栋楼的电路设计与维护，房间大体装修与电梯加装工作。主体预计为四层，居住区域为2-4层。",
      keywords: ["如意楼", "青白江", "动工", "开工", "杨主管", "项目主管", "电梯", "户型图", "四层", "底商", "餐饮", "1992", "企鹅新闻"],
      tag: "web", site: "企鹅新闻", date: "1992-12",
      page: "news_gongdi", kind: "news",
    },
    {
      id: "f1", title: "成都诡闻 · 民间奇闻论坛",
      url: "http://www.chengduguiwen.com/bbs/",
      snippet: "成立于1998年的民间奇闻论坛：灵异事件、城市传说、口述怪谈。站内设有专版讨论本地旧楼传闻，欢迎亲历者提供线索。",
      keywords: ["成都诡闻", "诡闻", "论坛", "bbs", "灵异", "奇闻", "怪谈", "城市传说"],
      tag: "web", site: "成都诡闻", date: "—",
      page: "forum", kind: "forum",
    },
    /* 【暂时下线】chunchun 的围脖词条。恢复时把下面整块取消注释即可。
    {
      id: "w1", title: "chunchun 的围脖 - 个人主页",
      url: "http://t.weibo.cn/chunchun",
      snippet: "肖忠纯（网名 chunchun），成都青白江人，自称自家那栋楼的楼主。置顶微博里留了联系方式，另外还记了些年月日与旧事。",
      keywords: ["chunchun", "肖忠纯", "围脖", "微博", "微信号", "联系方式", "楼主", "chunchun1976", "网名"],
      tag: "web", site: "围脖 t.weibo.cn", date: "—",
      page: "weibo_chunchun", kind: "weibo",
    },
    */
    /* 【已下线】开发用占位词条（e1—e4）。玩家搜任何词都可能被它们兜底命中，
       搜出来全是「预留：…」，属于 bug，故整块注释，正文页 pageA/pageB/pageC/help 仍保留。 */
    /*
    {
      id: "e1", title: "「预留词条标题 A」", url: "https://baike.qiandu.com/item/placeholder-a",
      snippet: "「预留：搜索结果摘要。这里是玩家在搜索页看到的第一段文字，建议写成半遮半掩的线索。」",
      keywords: ["预留", "示例", "测试", "词条a", "placeholder"],
      tag: "web", site: "千度百科", date: "2003-07-14",
      page: "pageA",
    },
    {
      id: "e2", title: "「预留词条标题 B」", url: "https://tie.qiandu.com/post/placeholder-b",
      snippet: "「预留：论坛存档帖摘要。适合放玩家视角之外的第三方叙述。」",
      keywords: ["论坛", "存档", "帖子", "预留"],
      tag: "web", site: "千度贴吧", date: "2004-11-02",
      page: "pageB",
    },
    {
      id: "e3", title: "「预留词条标题 C（图片）」", url: "https://image.qiandu.com/search/placeholder-c",
      snippet: "「预留：图片类结果摘要。」",
      keywords: ["照片", "图片", "图库", "老照片"],
      tag: "image", site: "千度图片", date: "—",
      page: "pageC",
    },
    {
      id: "e4", title: "「预留：搜索引擎使用帮助」", url: "https://help.qiandu.com/",
      snippet: "搜索技巧、站内导航，以及本游戏的数据填写说明。",
      keywords: ["帮助", "help", "说明", "怎么用", "搜索技巧"],
      tag: "web", site: "千度帮助中心", date: "—",
      page: "help",
    },
    */
    /* 警局档案站：玩家从搜索结果点进来，而不是在地址栏输网址直达 */
    {
      id: "police",
      title: "成都市公安局 · 档案查询系统",
      url: "http://www.cdpolice.gov.cn/archive",
      snippet: "成都市公安局内网档案查询系统。在职民警凭用户名与警号登录后，可检索已归档案件的卷宗摘要。",
      keywords: ["成都市公安局", "公安局", "公安", "警局", "警察局", "档案", "档案查询", "档案馆",
        "卷宗", "旧案", "cdpolice", "gov.cn"],
      tag: "web", site: "成都公安", date: "—",
      page: "police_portal", kind: "police",
    },
    /* 论坛本体：搜「如意楼」直接可进 */
    {
      id: "t2", title: "居民之家 —— 如意楼居民自己的窝",
      url: "http://www.ruyilou-home.cn/",
      snippet: "如意楼居民自己搭的社区：楼里的事、找人说说话、老照片·旧物。站长：酷乐小子。会员 7 人。",
      keywords: ["如意楼", "ruyilou-home", "ruyilouhome", "ruyilou", "居民之家", "居民论坛", "个人主页",
        "留言板", "站长", "鲸尾", "邻居", "社区"],
      tag: "web", site: "个人主页 · 网易空间", date: "2000-04-15",
      page: "resiforum", kind: "resiforum",
    },
  ],
  // 正文页（点结果后进入）。blocks 支持：h2 / p / quote / info / figure / locked
  pages: {
    help: {
      title: "千度帮助中心 · 搜索技巧",
      meta: "最后更新：2003-01-01 ｜ 本站为游戏内虚构页面",
      blocks: [
        { type: "h2", text: "怎么搜" },
        { type: "p", text: "在输入框里填入关键词后回车，或点击「千度一下」。支持空格分词，命中任意一个词就会出现结果。" },
        { type: "h2", text: "游戏内的用法" },
        { type: "p", text: "本搜索引擎是解谜的核心区域：玩家在日记、聊天、文件里读到的任何专有名词，都可以拿回来这里搜。" },
        { type: "locked", text: "【开发者备注】所有词条内容写在 assets/js/data.js 的 QIANDU.index 与 QIANDU.pages 里。搜索索引决定「能不能搜到」，pages 决定「点进去看到什么」。两者用 page 字段关联。" },
      ],
    },
    pageA: {
      title: "「预留词条标题 A」",
      meta: "千度百科 ｜ 最近编辑：<预留> ｜ 阅读量：<预留>",
      blocks: [
        { type: "info", items: [["中文名", "<预留>"], ["类别", "<预留>"], ["时间", "<预留>"]] },
        { type: "p", text: "「预留：词条正文第一段。百科体通常负责给出客观背景，是最安全的线索投放位。」" },
        { type: "h2", text: "「预留：二级标题」" },
        { type: "p", text: "「预留：正文段落。」" },
        { type: "quote", text: "「预留：引文 / 摘录。适合放日记、公告或某人的原话。」" },
        { type: "figure", caption: "「预留：配图说明」" },
        { type: "locked", text: "「预留：需要某个条件解锁后才显示的内容 —— 条件逻辑待接入」" },
      ],
    },
    pageB: {
      title: "「预留词条标题 B」",
      meta: "千度贴吧 · 存档帖 ｜ 楼主：<预留> ｜ 回复：<预留>",
      blocks: [
        { type: "p", text: "「预留：楼主正文。」" },
        { type: "quote", text: "「预留：楼层回复 1」" },
        { type: "quote", text: "「预留：楼层回复 2 —— 此处常埋反转」" },
        { type: "p", text: "「预留：帖子被删除 / 封楼的系统提示。」" },
      ],
    },
    pageC: {
      title: "「预留词条标题 C（图片）」",
      meta: "千度图片 ｜ 尺寸：<预留>",
      blocks: [
        { type: "figure", caption: "「预留：图片说明 —— 图库里那张照片的出处可以在这里呼应」" },
        { type: "p", text: "「预留：图片页说明文字。」" },
      ],
    },
    // 未录入词条时展示的兜底页
    missing: {
      title: "该词条尚未收录",
      meta: "千度 ｜ 状态码：MISSING_ENTRY",
      blocks: [
        { type: "p", text: "你要查看的内容还没有被录入本站索引。" },
        { type: "locked", text: "【开发者备注】在 data.js 的 QIANDU.pages 里补一个同名 key 即可显示正文；在 QIANDU.index 里加一条即可被搜到。" },
      ],
    },
  },
  // 结果页右侧相关推荐
  /* 结果页右侧：纯广告位。内容与剧情完全无关，不要出现任何提示性词语 */
  ads: [
    { title: "新干线网吧 · 会员日", text: "周一至周四白天 3 元/小时，通宵 8 元，空调开放。", url: "www.xgx-netbar.com" },
    { title: "迅达办公耗材", text: "墨盒、硒鼓、复印纸五折起，市区当天送到。", url: "www.xunda-print.com" },
    { title: "惠友超市 · 春季特惠", text: "洗衣粉、食用油第二件半价，凭会员卡再减两元。", url: "www.huiyou-mart.com" },
    { title: "蓝天驾校 · 春季班", text: "C1 速成班 2800 元起，随到随学，包接送。", url: "www.lantian-drive.com" },
    { title: "川西租车", text: "自驾短租 98 元/天起，押金三天内退还。", url: "www.chuanxi-rent.com" },
    { title: "彩色铃音下载", text: "发送短信 A 到 1066 即可试听本月热门铃声。", url: "www.ring-2005.com" },
  ],
};

/* =========================================================================
 *  2.5 WEIBO —— 「围脖」站点：肖忠纯（chunchun）的个人主页
 *  早期微博样式：橙红头部 + 右侧资料卡 + 左侧微博流
 * ========================================================================= */
const WEIBO = {
  site: { name: "围脖", url: "http://t.weibo.cn/", slogan: "随时随地发现新鲜事", icp: "蜀ICP备03000000号" },
  user: {
    nick: "chunchun",
    realname: "肖忠纯",
    avatar: "#c8503f", initial: "纯",
    wxid: "chunchun1970",                  // 只出现在置顶微博的「联系方式」里
    bio: "如意楼楼主。做点小生意，喜欢记点东西。",
    location: "成都 青白江区",
    regTime: "2003-09-21 注册",
    verified: "个人认证 · 如意楼业主",
    stats: { following: 96, followers: 37, posts: 214 },
  },
  /* 顺序 = 显示顺序。第一条为置顶（联系方式），其余按时间倒序 */
  posts: [
    {
      time: "2004-12-06 21:02", source: "来自 围脖网页版", pinned: true,
      text: "留个联系方式，省得老有人问。手机白天多半关着，有事直接加微信：<b>chunchun1976</b>。加的时候说清楚是哪栋楼的事，不然我不加。",
      repost: 2, comment: 6, like: 9,
    },
    {
      time: "2004-11-12 23:44", source: "来自 围脖手机版",
      text: "十一月十二日。铺子里那碗面吃到一半就凉了，二十八岁，还是一个人。这日子一年一年地过，倒也不觉得苦。",
      repost: 0, comment: 4, like: 6,
    },
    {
      time: "2004-08-30 20:15", source: "来围脖",
      text: "有人问我密码是怎么设的。我这人记性差，一辈子只记得住两样东西——我出生的那天，还有这栋楼的名字。别的丢了就丢了，这两样丢不得。",
      repost: 3, comment: 11, like: 14,
    },
    {
      time: "2004-06-18 19:30", source: "来自 围脖手机版",
      text: "如意楼一层的铺面又空了一间。这栋楼是我这辈子唯一拿得出手的东西，谁也别想动它。",
      repost: 0, comment: 2, like: 4,
    },
    {
      time: "2003-09-21 16:08", source: "来围脖",
      text: "注册了围脖，不太会用，先把名字占上。本名肖忠纯，成都青白江人。以后在这儿记点日常，欢迎捧场。",
      repost: 0, comment: 1, like: 0,
    },
  ],
  /* 右侧「备注」卡（留空则不显示） */
  sideNotes: [],
};

/* =========================================================================
 *  3. 此电脑 —— 文件资源管理器
 *  tree: { name, type:'drive'|'folder'|'file', icon, children, size, date, note }
 * ========================================================================= */
const EXPLORER = {
  nav: [
    { label: "收藏夹", items: ["下载", "最近访问的位置"] },
    { label: "库",     items: ["文档", "图片", "音乐"] },
    { label: "计算机", items: ["本地磁盘 (C:)", "数据盘 (D:)", "光盘驱动器 (E:)"] },
    { label: "网络",   items: ["家庭组", "<预留：局域网主机>"] },
  ],
  tree: {
    name: "计算机", type: "drive", icon: ICONS.drive,
    note: `${STORY.pcModel} ｜ 出厂 ${STORY.pcMadeYear} 年 ｜ 当前使用者：${STORY.hero.name}（${STORY.hero.job}）`,
    children: [
      {
        name: "本地磁盘 (C:)", type: "drive", icon: ICONS.drive, size: "—", note: "「预留：盘符说明」",
        children: [
          {
            name: "文档", type: "folder", icon: ICONS.folder,
            children: [
              { name: "值班表.txt", type: "file", icon: ICONS.txt, size: "2 KB", date: "2005-02-28",
                note: "「预留：文件内容预览」", body: "「预留：打开后的正文。文件类线索通常直给，不要藏太深。」" },
              { name: "备忘录.doc", type: "file", icon: ICONS.txt, size: "14 KB", date: "2005-03-05",
                note: "「预留：文件内容预览」", body: "「预留：备忘录正文」" },
              { name: "<预留：一个不该存在的文件>", type: "file", icon: ICONS.exe, size: "??", date: "??",
                note: "「预留：异常文件 —— 高价值悬念位」", body: "「预留：异常文件内容」" },
            ],
          },
          {
            name: "图片", type: "folder", icon: ICONS.folder,
            children: [
              { name: "扫描件_001.jpg", type: "file", icon: ICONS.img, size: "320 KB", date: "2005-02-20",
                note: "「预留：图片备注」", body: "" },
              { name: "<预留：文件名>", type: "file", icon: ICONS.img, size: "288 KB", date: "—",
                note: "「预留：图片备注」", body: "" },
            ],
          },
          {
            name: "下载", type: "folder", icon: ICONS.folder,
            children: [
              { name: "setup_qiandu.exe", type: "file", icon: ICONS.exe, size: "1.2 MB", date: "2003-04-19",
                note: "「预留：安装包说明」", body: "" },
            ],
          },
          {
            name: "系统", type: "folder", icon: ICONS.folder,
            children: [
              { name: "config.ini", type: "file", icon: ICONS.txt, size: "1 KB", date: "2005-01-01",
                note: "「预留：配置说明」", body: "「预留：配置文件正文 —— 常见藏密码位」" },
            ],
          },
        ],
      },
      {
        name: "数据盘 (D:)", type: "drive", icon: ICONS.drive, size: "—", note: "「预留：盘符说明」",
        children: [
          { name: "备份", type: "folder", icon: ICONS.folder, children: [] },
          { name: "<预留：隐藏目录>", type: "folder", icon: ICONS.folder, locked: true, children: [] },
        ],
      },
      { name: "光盘驱动器 (E:)", type: "drive", icon: ICONS.drive, note: "请将光盘插入驱动器", children: [] },
    ],
  },
};

/* =========================================================================
 *  4. 图库 —— 照片相册
 *  scene: sunset | city | sea | forest | stars | room | glitch | abstract
 * ========================================================================= */
const GALLERY = {
  albums: [
    {
      name: "全部照片",
      photos: [
        { title: "「预留：照片标题 1」", date: "2005-03-08", note: "「预留：照片备注 —— 可埋视觉线索」", scene: "sunset" },
        { title: "「预留：照片标题 2」", date: "2005-03-09", note: "「预留：照片备注」", scene: "city" },
        { title: "「预留：照片标题 3」", date: "2005-03-11", note: "「预留：照片备注」", scene: "sea" },
        { title: "「预留：照片标题 4」", date: "2005-03-10", note: "「预留：照片备注」", scene: "forest" },
        { title: "「预留：照片标题 5」", date: "2005-03-12", note: "「预留：照片备注」", scene: "room" },
        { title: "「预留：照片标题 6」", date: "2005-03-13", note: "「预留：照片备注」", scene: "stars" },
      ],
    },
    {
      name: "扫描件",
      photos: [
        { title: "扫描件_001", date: "2005-02-20", note: "「预留：扫描件备注」", scene: "abstract" },
        { title: "扫描件_002", date: "2005-02-20", note: "「预留：扫描件备注」", scene: "abstract" },
      ],
    },
    {
      name: "已损坏",
      photos: [
        { title: "IMG_0<预留>.jpg", date: "未知", note: "「预留：无法读取的文件」", scene: "glitch" },
      ],
    },
  ],
};

/* =========================================================================
 *  5. 日记 —— 【已删除】
 *  该应用已按需求移除；如需恢复，把 DIARY 数据与 Apps.diary 一并加回即可。
 * ========================================================================= */

/* =========================================================================
 *  6. NEWS —— 千度站内新闻正文页
 *  · 正文文字与原 PDF 完全一致（仅将 PDF 字体乱码标点还原为正常标点）
 *  · 图片为 PDF 内嵌原图的无损导出（assets/news/ruyilou_1.png / ruyilou_2.png），
 *    未做任何修改；img.src 为相对 index.html 的路径
 *  · 渲染顺序：搜索结果点击 → 满屏红闪约 1.2 秒 → 新闻正文
 * ========================================================================= */
const NEWS = {
  news_ruyilou: {
    site: "成都诡闻",
    accent: "#8c1a1a",
    flash: true,                    // 进入前播放满屏红闪
    tag: "民间奇闻 · 城市异谈",
    url: "http://www.chengduguiwen.com/news/1999/0409_1.html",
    title: "诅咒传闻？装修设计师完工后第二天死亡",
    meta: "成都诡闻 ｜ 编辑/校对：何志军 ｜ 1999年4月9日 ｜ 发布于：成都",
    blocks: [
      { type: "p", text: "如意楼为四川省成都市青白江区于1992年12月开始施工，1995年4月3日完工的居民楼，原计划为以如意楼为中心建造楼盘，但在主楼如意楼施工完成的第二日，主设计师杨先生因车祸意外身亡，施工计划被迫中止。" },
      { type: "img", src: "assets/news/ruyilou_1.png", caption: "如意楼完工后实拍图" },
      { type: "p", text: "原本所有人都当这只是一个不幸的巧合，直到今年一月份，如意楼搬入一批新住户，之后便怪事频发。" },
      { type: "p", text: "自打一月份起，楼内每晚便不断传出鬼哭狼嚎声，时间段固定，声音最初来源是居民楼里空闲的房间402，后来蔓延至全楼。" },
      { type: "p", text: "经过全体居民决策，决定将402室封死。下图是记者前往实地考察时拍下的照片。" },
      { type: "img", src: "assets/news/ruyilou_2.png", caption: "如意楼402室" },
      { type: "p", text: "被封死的房间看起来格外诡异，奇怪的是门口竟然没有积压已久的尘土。这个房间真的停用了吗？这栋楼真的闹鬼吗？欲知后事，请继续关注成都诡闻，会持续为你带来更多有趣的奇闻逸事。" },
      { type: "site", text: "成都诡闻官方网站：", link: "www.chengduguiwen.com/bbs/" },
    ],
  },

  /* ---- 千度搜「如意楼」命中的这一篇（企鹅新闻，1992年12月） ---- */
  news_gongdi: {
    site: "企鹅新闻",
    accent: "#1a6fc4",
    flash: false,
    tag: "本地 · 城建 · 民生",
    url: "http://www.qienews.com.cn/news/1992/12/ruyilou.html",
    title: "如意楼修建项目开始动工",
    meta: "企鹅新闻 ｜ 撰稿人：刘拖地 ｜ 发布于1992年12月",
    blocks: [
      { type: "p", text: "喜讯：青白江区重点项目如意楼终于开始动工。项目主管为项目经验丰富的杨主管，负责整栋楼的电路设计与维护，房间大体装修与电梯加装工作。" },
      { type: "img", src: "assets/news/ruyilou_plan.png", caption: "如意楼预设户型图" },
      { type: "p", text: "如意楼主体预计为四层，居住区域为2-4层。成都市居民纷纷表示期待，并且如意楼底商传闻会经营一家特色餐饮店。大家期待如意楼的建成吗？" },
    ],
  },
};

/* =========================================================================
 *  7. FORUM —— 「成都诡闻」论坛（虚构站点，整体红色色调）
 *  · 千度搜「成都诡闻」/「如意楼」均可进入；新闻文末链接直达
 *  · 帖子内容为「与新闻呼应的占位示例」，细节留给后续剧情填充
 * ========================================================================= */
const FORUM = {
  site: {
    name: "成都诡闻",
    fullName: "成都诡闻 · 民间奇闻论坛",
    url: "http://www.chengduguiwen.com/bbs/",
    slogan: "道听途说 · 城市异谈 · 信不信由你",
    founded: "1998-11-02",
    icp: "蜀ICP备1998-0000号",
    stats: "今日帖 47 ｜ 主题 1,204 ｜ 会员 8,932 ｜ 在线「预留」人",
  },
  /* 站内报道：论坛「站内搜索」可检索到，点击进入新闻正文页（这里是那篇诅咒传闻报道） */
  articles: [
    {
      id: "a1", news: "news_ruyilou",
      title: "诅咒传闻？装修设计师完工后第二天死亡",
      author: "编辑/校对：何志军", date: "1999-04-09",
      summary: "如意楼完工次日主设计师车祸身亡；今年一月新住户迁入后怪事频发，402室已被全体居民决议封死。",
      keywords: ["如意楼", "402", "402室", "闹鬼", "封门", "封楼", "杨先生", "诅咒", "车祸", "装修设计师"],
    },
  ],
  boards: [
    { id: "notice", name: "站务公告", desc: "论坛规则、公告、友链申请" },
    { id: "ghost",  name: "灵异事件", desc: "亲历、见闻、口述实录" },
    { id: "legend", name: "城市传说", desc: "都市怪谈、地方志异" },
    { id: "ruyi",   name: "如意楼专版", desc: "本站当前最热话题 · 谢绝人身攻击" },
  ],
  threads: [
    {
      id: "t1", board: "ruyi", hot: true,
      title: "【时间线汇总】如意楼事件：从开工到封门，目前已知的一切",
      author: "档案员老K", time: "1999-04-11", views: "2,048", replies: "86",
      floors: [
        { author: "档案员老K", time: "1999-04-11 09:12",
          text: "按报道与街坊口述整理：1992年12月开工；1995年4月3日完工；完工次日主设计师杨先生车祸身亡，楼盘计划中止；今年一月新住户入住；一月起每晚固定时段异响，最初来自402室；近日全体居民决议封死402。详见本站报道《诅咒传闻？装修设计师完工后第二天死亡》。「预留：时间线后续节点」" },
        { author: "夜航西楼", time: "1999-04-11 10:03",
          text: "补充一点：封门那天我在场，最怪的是门口没有灰。「预留：该回复的后续」" },
        { author: "匿名", time: "1999-04-11 11:40",
          text: "「预留：一条疑似知情人的回复，建议留悬念」" },
      ],
    },
    {
      id: "t2", board: "ghost",
      title: "昨晚两点十七分，声音又来了",
      author: "住三楼的猫", time: "1999-04-13", views: "512", replies: "34",
      floors: [
        { author: "住三楼的猫", time: "1999-04-13 02:31", text: "「预留：亲历帖正文，建议写声音出现的固定时间段」" },
        { author: "档案员老K", time: "1999-04-13 08:15", text: "「预留：站内标准回复——请提供具体方位，勿夸大」" },
      ],
    },
    {
      id: "t3", board: "ruyi",
      title: "求助：有谁知道封402用的水泥袋是哪家的？",
      author: "半步斋主", time: "1999-04-14", views: "388", replies: "21",
      floors: [
        { author: "半步斋主", time: "1999-04-14 20:07",
          text: "记者照片里门口那半袋水泥一直没人认领。「预留：水泥来源可作为解谜道具」" },
        { author: "夜航西楼", time: "1999-04-14 21:44", text: "「预留：回复占位」" },
      ],
    },
    {
      id: "t4", board: "legend",
      title: "青白江「建完死」的楼，好像不止这一栋",
      author: "采风人", time: "1999-04-15", views: "297", replies: "19",
      floors: [
        { author: "采风人", time: "1999-04-15 12:00", text: "「预留：支线怪谈，可与主线若即若离」" },
      ],
    },
    {
      id: "t5", board: "notice",
      title: "欢迎来到成都诡闻：发帖须知（1999年4月修订）",
      author: "站长·何编", time: "1999-04-02", views: "3,410", replies: "2",
      floors: [
        { author: "站长·何编", time: "1999-04-02 08:00",
          text: "本站讨论怪谈，禁止人身攻击、禁止把传闻当事实传播。「预留：版规正文」" },
      ],
    },
  ],
};

/* =========================================================================
 *  8. POLICE —— 成都市公安局 · 档案查询系统（内网，需警号登录）
 *  · auth：用户名 = 姓名拼音，密码 = 警号后四位
 *  · archives[]：档案条目，keywords 参与站内检索
 * ========================================================================= */
const POLICE = {
  site: {
    name: "成都市公安局",
    system: "档案查询系统",
    url: "http://www.cdpolice.gov.cn/archive",
    slogan: "对党忠诚　服务人民　执法公正　纪律严明",
    nav: ["首页", "警务公开", "档案查询", "便民服务", "警民互动"],
    notice: "本系统仅限在职民警使用。所有查询操作均记录警号与时间，禁止截屏、外传。",
    footer: "成都市公安局 主办　｜　地址：成都市青羊区人民中路　｜　总机 028-8660 0000",
    icp: "蜀 ICP 备 05000000 号　｜　川公网安备 51010500000000 号",
  },
  /* 登录凭据：用户名可填拼音或姓名；密码为警号后四位 */
  auth: { user: "liuchenqiu", pass: "7412" },

  /* 门户首页（未登录时首先看到的政府新闻式首页）。
     时间锚点 2005-10-17，所有条目均为公开政务信息，不含案情。 */
  portal: {
    dateLine: "2005 年 10 月 17 日　星期一　｜　乙酉年九月十五　｜　成都　多云转阴 16～22℃",
    ticker: "★ 欢迎访问成都市公安局政府网站　｜　全市公安机关深入开展秋季严打整治专项行动　｜　第二代居民身份证换发工作有序推进　｜　户籍档案数字化归档工作进入收尾阶段 ★",
    headline: {
      cat: "公安要闻",
      title: "全市公安机关启动秋季严打整治专项行动",
      summary: "为维护我市社会治安稳定，市公安局决定自 10 月起在全市范围内开展为期三个月的秋季严打整治专项行动，重点打击严重暴力犯罪与多发性侵财犯罪，并同步组织出租房屋、流动人口清查登记。市局要求各单位严格落实责任制，确保专项行动取得实效。",
      date: "2005-10-17",
    },
    subHead: [
      { title: "户政管理部门通报三季度全市人口数据", date: "2005-10-15" },
      { title: "青白江分局开展辖区出租屋与暂住人口清查", date: "2005-10-14" },
      { title: "档案管理系统升级完成，历史卷宗分批上线检索", date: "2005-10-10" },
      { title: "交警支队发布秋冬季节行车安全提示", date: "2005-10-09" },
    ],
    columns: [
      {
        title: "警务要闻",
        items: [
          { cat: "刑侦", title: "我市侦破一起系列入室盗窃案", date: "10-16" },
          { cat: "治安", title: "集中整治校园周边治安秩序", date: "10-15" },
          { cat: "户政", title: "二代证换发窗口延长服务时间", date: "10-13" },
          { cat: "交管", title: "城区新增 12 处电子监控点位", date: "10-12" },
          { cat: "消防", title: "开展人员密集场所消防安全检查", date: "10-11" },
        ],
      },
      {
        title: "基层动态",
        items: [
          { cat: "青白江", title: "分局组织社区民警入户走访", date: "10-16" },
          { cat: "金牛", title: "派出所调解邻里纠纷获赠锦旗", date: "10-14" },
          { cat: "武侯", title: "开展暂住人口登记宣传活动", date: "10-12" },
          { cat: "成华", title: "警民共建平安小区座谈会", date: "10-10" },
          { cat: "锦江", title: "巡逻民警救助走失儿童", date: "10-08" },
        ],
      },
    ],
    notices: [
      { title: "关于 2005 年度下半年民警体检安排的通知", date: "10-13" },
      { title: "档案查询系统账号年审及权限清理通知", date: "10-11" },
      { title: "关于启用新版常住人口登记表的公告", date: "10-08" },
      { title: "信息通信科内网设备维护公告", date: "10-06" },
    ],
    pics: [
      { tone: "#123f6e", cap: "专项行动动员大会" },
      { tone: "#1b5a86", cap: "民警社区走访" },
    ],
    services: [
      { name: "户籍办理", desc: "迁入 · 迁出 · 变更" },
      { name: "证件申领", desc: "身份证 · 暂住证" },
      { name: "报警求助", desc: "110 · 96110" },
      { name: "档案查询", desc: "内网系统 · 需登录" },
    ],
    loginTitle: "民警登录",
    loginDesc: "档案查询系统为公安内网应用，仅限在职民警凭用户名与警号登录。",
    stats: "本站访问量 00382417　｜　今日 00241",
  },

  archives: [
    {
      id: "ruyilou",
      no: "刑·1999-0418",
      title: "「巧雀如意楼」案 · 情况摘要",
      year: "1999",
      status: "未破 · 存档",
      level: "秘密",
      date: "1999-04-18 立案",
      keywords: ["巧雀如意楼", "如意楼", "402", "402室", "封门", "分尸", "巧雀堂", "无名尸", "1999", "人命案", "命案"],
      summary: "1999 年 4 月 17 日，青白江区如意楼底商「巧雀堂」后厨发现人体残肢，同日于该楼 402 室发现疑似第一现场。死者身份未查实，案件至今未破。",
      blocks: [
        { type: "info", items: [
          ["案件代号", "巧雀如意楼"],
          ["案件类别", "故意杀人"],
          ["立案时间", "1999 年 4 月 18 日"],
          ["案发地点", "青白江区如意楼（底商巧雀堂 · 402 室）"],
          ["承办单位", "青白江区分局刑侦大队"],
          ["案件状态", "未破 · 已存档"],
        ] },
        { type: "h2", text: "一、发现经过" },
        { type: "p", text: "1999 年 4 月 17 日 6 时 40 分许，巧雀堂店员开门备货时，于后厨最内侧储物柜闻到异味，柜门内有渗液痕迹，随即报警。" },
        { type: "p", text: "现场勘查中，在该储物柜内三只玩偶头套中发现人体残肢，合计十三块。部分残肢用报纸包裹，报纸日期为 4 月 14 日。" },
        { type: "p", text: "同日上午 10 时许，勘查人员破拆此前已被住户自行封死的 402 室。室内无打斗痕迹，地面检出与残肢一致的少量生物检材，初步认定为第一现场。" },
        { type: "h2", text: "二、死者情况" },
        { type: "p", text: "死者为男性，年龄约 25 至 35 岁，身高约 172 厘米，身份未能查实。着深色夹克、深色长裤，衣标已被剪除，口袋内无证件、无票据。" },
        { type: "quote", text: "法医意见（摘录）：死亡时间约为发现前 3 至 5 日；创口工具为长刃锐器，分割手法较为熟练，不排除有相关从业经验者作案。" },
        { type: "h2", text: "三、调查情况" },
        { type: "p", text: "402 室自 1999 年 1 月起由该楼住户联名要求封死，封条完好，门缝无积尘。住户普遍反映「夜间有怪声」，但无一人承认持有该房间钥匙。" },
        { type: "p", text: "该楼产权人肖忠纯（男，1976 年生），案发期间不在本地，经多次联系未取得有效证言。" },
        { type: "p", text: "底商巧雀堂经营者李某某称案发时段店内正常营业，但无法提供 4 月 14 日至 16 日的完整进货与出入库单据。" },
        { type: "p", text: "楼内住户、租户共 21 人接受询问，未取得直接指向性证言。有住户提及「封门之后仍有脚步声」，未予采信。" },
        { type: "locked", text: "【受限内容 · 需三级权限】证物清单、现场照片、法医鉴定全文未在本级系统公开。" },
        { type: "h2", text: "四、存档意见" },
        { type: "p", text: "1999 年 5 月，因死者身份无法确认、现场物证缺乏比对样本，案件以「线索中断」报请存档。建议在死者身份查实后重启侦查。" },
      ],
    },
    {
      id: "yang",
      no: "交·1995-0404",
      title: "杨某交通事故 · 结案报告（摘录）",
      year: "1995",
      status: "已结案",
      level: "内部",
      date: "1995-04-04 立案",
      keywords: ["杨", "设计师", "总设计师", "车祸", "交通事故", "如意楼", "1995", "逃逸"],
      summary: "如意楼工程总设计师杨某于工程完工次日因交通事故身亡，肇事车辆逃逸。1996 年以「肇事者不明」结案。",
      blocks: [
        { type: "info", items: [
          ["案件类别", "交通肇事逃逸"],
          ["立案时间", "1995 年 4 月 4 日"],
          ["案发地点", "青白江区大弯街道 · 未命名路段"],
          ["当事人", "杨某（男，1958 年生，如意楼工程总设计师）"],
          ["案件状态", "已结案（肇事者不明）"],
        ] },
        { type: "h2", text: "一、事故经过" },
        { type: "p", text: "1995 年 4 月 4 日 21 时 30 分许，杨某骑自行车沿未命名路段由南向北行驶，与一辆同向行驶的机动车发生碰撞，杨某当场死亡，肇事车辆驶离现场。" },
        { type: "p", text: "现场未提取到有效轮胎印与漆片，路段无照明、无监控。周边住户证言相互矛盾，未形成有效线索。" },
        { type: "h2", text: "二、结案意见" },
        { type: "p", text: "1996 年 3 月，因肇事车辆与驾驶人始终未能查明，本案以「肇事者不明」结案，卷宗存档。" },
        { type: "quote", text: "附注：如意楼工程于 1995 年 4 月 3 日通过竣工验收，杨某身亡于验收次日。该时间关系在当年舆情中被反复提及。" },
        { type: "locked", text: "【受限内容 · 需三级权限】事故现场照片、车辆排查记录未在本级系统公开。" },
      ],
    },
    {
      id: "queque",
      no: "商·2003-0921",
      title: "巧雀堂 · 个体工商户登记信息",
      year: "2003",
      status: "存续",
      level: "公开",
      date: "2003-09-21 变更",
      keywords: ["巧雀堂", "茶餐厅", "底商", "工商", "登记", "李", "如意楼", "2003"],
      summary: "如意楼底商「巧雀堂」港式茶餐厅登记信息：经营者李某某，经营场所为如意楼 1 层 1—3 号铺，2003 年办理经营范围变更。",
      blocks: [
        { type: "info", items: [
          ["字号名称", "巧雀堂"],
          ["经营者", "李某某"],
          ["经营场所", "青白江区如意楼 1 层 1—3 号铺"],
          ["经营范围", "中餐制售、预包装食品零售"],
          ["成立日期", "1998 年 11 月"],
          ["登记状态", "存续"],
        ] },
        { type: "h2", text: "变更记录" },
        { type: "p", text: "2003 年 9 月，经营范围由「快餐制售」变更为「中餐制售、预包装食品零售」，经营场所面积未变。" },
        { type: "p", text: "该铺面产权归属如意楼业主肖忠纯。据登记附卷的租赁备案，铺面租金自 2003 年起存在多次逾期缴纳记录。" },
      ],
    },

    /* ---------- 居民档案（需二次核验） ----------
       核验规则：verify.accept 里放 { name, phone }，玩家填的名字与电话命中任意一条即通过。
       现在留空 —— 待居民真实姓名、电话在论坛帖子里铺好后，再往这里补。 */
    {
      id: "residents",
      no: "户·2005-0317",
      title: "如意楼 · 居民档案查询",
      year: "2005",
      status: "在册",
      level: "秘密",
      date: "2005-03-17 更新",
      keywords: ["如意楼", "居民", "住户", "户籍", "人口", "登记", "居民档案", "档案查询", "楼里", "邻居"],
      summary: "如意楼在册住户共 7 户，分布于 2—4 层。本页为实名查询，需核验身份后方可展开完整登记信息。",
      verify: {
        hint: "为保护住户个人信息，本页需填写楼内任意一位居民的姓名与其预留联系电话，核验通过后方可查看。",
        note: "核验记录将记入查询日志，请勿代查。",
        accept: [
          /* 例：{ name: "小李", phone: "0288xxxxxxx" }, */
        ],
        ok: "身份核验通过。以下为完整登记信息。",
        fail: "姓名与预留电话不匹配，或该居民未在本系统登记。",
      },
      blocks: [
        { type: "info", items: [
          ["楼栋名称", "如意楼（青白江区）"],
          ["建筑层数", "地上 4 层：1 层底商，2—4 层居住"],
          ["在册户数", "7 户"],
          ["登记状态", "在册"],
          ["最近更新", "2005 年 3 月 17 日"],
        ] },
        { type: "h2", text: "一、在册居民一览" },
        { type: "p", text: "登记表按户排列，每户记录姓名、性别、出生年月、迁入时间与预留联系电话。共 7 户，其中 402 室登记为空户。" },
        { type: "info", items: [
          ["201 室", "登记 1 户"],
          ["202 室", "登记 1 户"],
          ["301 室", "登记 1 户"],
          ["302 室", "登记 1 户"],
          ["401 室", "登记 1 户"],
          ["402 室", "空户（1999 年 1 月起无人登记）"],
          ["403 室", "登记 2 户"],
        ] },
        { type: "p", text: "402 室一栏备注：「该室自 1999 年 1 月由住户联名申请封门，户籍未迁出，亦无新增登记。」" },
        { type: "h2", text: "二、查询日志" },
        { type: "p", text: "本页近三个月被查询 11 次，其中 9 次由同一警号发起（非本所）。" },
        { type: "locked", text: "【受限内容 · 需三级权限】完整户籍登记表、身份证号、联系电话、迁入迁出原始凭证未在本级系统公开。" },
      ],
    },
  ],
};

/* ============================================================
 *  9. RESIFORUM —— 「居民之家」
 *     如意楼居民自己搭的社区（早期天涯 / 猫扑式的文字社区版式，暖色调）
 *     · 站长：酷乐小子（＝ chunchun，如意楼楼主，住 301 室），2000 年 4 月 15 日闭站
 *     · 闭站信息只在帖子 7（酷乐小子的闭站公告）里出现，不重复
 *     · 背景图：assets/forum/bg.jpg（暗红花纹瓷砖，暖色）
 * ============================================================ */
const RESIFORUM = {
  site: {
    name: "居民之家",
    sub: "如意楼 · 我们自己给自己做的窝",
    url: "http://www.ruyilou-home.cn/",
    bg: "assets/forum/bg.jpg",
    nav: ["首页", "社区论坛", "留言板", "会员名单", "站长的窝", "帮助"],
    /* 站长欢迎公告（闭站信息由帖子 7 承担，此处不提） */
    notice: "欢迎大家来到居民之家。楼里的事、楼里的人，都可以在这儿说说。发帖请先看帮助。",
    noticeBy: "酷乐小子",
    counter: 4821,
    since: "1995 年 5 月 1 日",
    copyright: "Copyright © 1995-2000 居民之家　｜　站长：酷乐小子　｜　服务器：如意楼 301 室　｜　未备案",
    browserTip: "建议使用 IE 5.0 以上、800×600 分辨率浏览　｜　简体中文 GB2312",
    note: "本站为个人主页，未备案。服务器架在如意楼 301 室。",
    /* 页脚 88×31 徽章，纯装饰 */
    badges: ["IE 5.0", "NETSCAPE NOW!", "800×600", "手工 HTML", "GB2312"],
  },

  stats: { members: 7, threads: 7, posts: 33, todayVisitors: 12, online: 0 },

  /* 会员名单。站长＝酷乐小子（chunchun）。
     uid 6「巧雀堂老板有事联系168xxxx0239」＝ 小李父亲。 */
  users: [
    { uid: 1, name: "nestle",      avatar: "#8a6a3a", initial: "雀", title: "老会员",   joined: "1995-05-02", posts: 2, sign: "别问我为什么叫这个。" },
    { uid: 2, name: "风雨尘的十月", avatar: "#5b7fa8", initial: "风", title: "正式会员", joined: "1995-05-02", posts: 3, sign: "十月风大，记得关窗。" },
    { uid: 3, name: "炎辰大鸽子",   avatar: "#a35a45", initial: "炎", title: "正式会员", joined: "1995-11-08", posts: 4, sign: "鸽子又飞了。" },
    { uid: 4, name: "飞雪幻月",     avatar: "#6b6b93", initial: "雪", title: "正式会员", joined: "1995-05-02", posts: 3, sign: "下雪的时候我才上来。" },
    { uid: 5, name: "酷乐小子",     avatar: "#4a7a68", initial: "酷", title: "站长",     joined: "1995-04-20", posts: 4, sign: "本站是我发起的，有事找我说。" },
    { uid: 6, name: "巧雀堂老板有事联系168xxxx0239", avatar: "#7a6a52", initial: "巧", title: "初级会员", joined: "1995-05-03", posts: 4, sign: "巧雀堂，底楼港式茶餐厅。" },
    { uid: 7, name: "7鲸尾",       avatar: "#3a6a9a", initial: "鲸", title: "正式会员", joined: "1995-05-02", posts: 4, sign: "全楼的线路我都清楚。" },
  ],

  boards: [
    { name: "楼里的事",     mod: "酷乐小子",      threads: 2, posts: 10, desc: "谁家水管漏了、谁家又搬走了，都在这儿说。" },
    { name: "找人说说话",   mod: "风雨尘的十月",  threads: 3, posts: 14, desc: "夜里睡不着的时候，楼里总有人在。" },
    { name: "老照片·旧物",  mod: "飞雪幻月",      threads: 1, posts: 2,  desc: "楼没盖好之前长什么样，这里还有几张。" },
    { name: "站务与意见",   mod: "酷乐小子",      threads: 1, posts: 7,  desc: "打不开、头像变方块、想加版块，都发这儿。" },
  ],

  /* 友情站点：早期个人主页标配，纯装饰，与剧情无关 */
  links: [
    { name: "网易个人主页空间", url: "www.netease.com/home" },
    { name: "碧海银沙",         url: "www.silversand.net" },
    { name: "千度贴吧",         url: "tie.qiandu.com" },
    { name: "免费计数器申请",   url: "www.counter-free.com" },
    { name: "小游戏合集",       url: "www.minigame-2000.com" },
    { name: "同学录",           url: "www.classmate.cn" },
  ],

  /* 帖子（甲方文案原样收录）。
     floors: [{ f: 楼层号, who: 发帖人, text: 内容, to: 「回复 x楼」（可选）, img: 图片说明（可选） }]
     deleted: 「帖子已删除」标记 */
  threads: [
    {
      id: "p1",
      title: "这里是我父亲交给我管理的产业",
      author: "酷乐小子", time: "1995-05-01",
      text: "这里是我父亲交给我管理的产业，希望各位租户能按时交租。这个论坛是我发起的，目的是大家多交流，打造一个友善的邻里环境。",
      floors: [
        { f: 1, who: "nestle", text: "好的捏^_^。" },
        { f: 2, who: "风雨尘的十月", text: "收到" },
        { f: 3, who: "7鲸尾", text: "1" },
        { f: 4, who: "飞雪幻月", text: "1" },
        { f: 5, who: "巧雀堂老板有事联系168xxxx0239", text: "1" },
        { f: 5, who: "酷乐小子", text: "哈哈没想到大家都到齐了，真好。第一个月我给大家免租！" },
      ],
    },
    {
      id: "p2",
      title: "201，你下次教育孩子能不能小点声？天天往死里打自己家小孩，是不是亲生的？",
      author: "匿名", time: "1995-07-18", deleted: true,
      floors: [
        { f: 1, who: "巧雀堂老板有事联系168xxxx0239", text: "老子教育孩子不用你管！" },
        { f: 2, who: "巧雀堂老板有事联系168xxxx0239", text: "想解决这事吗？有种你别匿名发帖，咱们线下详谈。" },
      ],
    },
    {
      id: "p3",
      title: "最近不知道你们在晚上十点钟左右有没有听见过比较刺耳的哭声？",
      author: "nestle", time: "1995-11-20",
      text: "打扰大家，晚上好。最近不知道你们在晚上十点钟左右有没有听见过比较刺耳的哭声？好像已经持续好几天了。",
      floors: [
        { f: 1, who: "飞雪幻月", text: "我和楼主有同样的情况。我有神经衰弱，麻烦各位还请稍微安静一点。" },
        { f: 2, who: "nestle", to: "回复 1楼", text: "不是邻居发出的。我听的很清楚，那是婴儿和女人的哭声。" },
        { f: 3, who: "7鲸尾", text: "没有吧？楼主，你是不是最近梦游又犯了，在梦里听见的？" },
        { f: 4, who: "风雨尘的十月", text: "我也听到了，我可以为雀巢作证。一开始是从楼上402方向传出来，后来一路蔓延到楼下。" },
        { f: 5, who: "炎辰大鸽子", text: "不会是402闹鬼吧？" },
        { f: 6, who: "飞雪幻月", to: "回复 5楼", text: "炎辰，似乎就是从你搬进来后才发生这种事的，你不解释一下？" },
        { f: 7, who: "酷乐小子", text: "大家先别慌，肯定就是谁家看电视声音太大了，都别制造恐慌了。" },
      ],
    },
    {
      id: "p4",
      title: "不是最近这个破楼怎么总停电啊？",
      author: "匿名", time: "1996-01-19",
      text: "不是最近这个破楼怎么总停电啊？大半夜我下楼倒垃圾，楼道里忽闪忽闪的，总感觉有人在我周围走动，吓死人了。",
      floors: [
        { f: 1, who: "炎辰大鸽子", text: "楼主你也太疑神疑鬼了。我们这里物业跑路了，电压不稳而已。你一个大男人怕啥？" },
        { f: 2, who: "7鲸尾", to: "回复 1楼", text: "你咋知道他是大男人？他不是匿名了吗？" },
        { f: 3, who: "炎辰大鸽子", to: "回复 2楼", text: "大哥我们这楼里哪有女孩？" },
        { f: 4, who: "匿名", text: "炎辰每晚特定时间都出去晃悠，他最有发言权。" },
        { f: 5, who: "炎辰大鸽子", to: "回复 4楼", text: "楼上的，是不是我室友？？看你不顺眼很久了，别瞎说。" },
      ],
    },
    {
      id: "p5",
      title: "关于 402 室的处理",
      author: "酷乐小子", time: "1996-01-25",
      text: "最近应大家强烈要求，用砖块封死了402室。本人承诺短时间内不会开启此房间。同时也希望大家，不要再骚扰我了，否则我会报警处理。",
      floors: [
        { f: 1, who: "酷乐小子", img: "一张菜刀的图片", text: "" },
      ],
    },
    {
      id: "p6",
      title: "最近巧雀堂后厨有点臭，你们谁闻到了吗？",
      author: "匿名", time: "2000-04-12",
      floors: [
        { f: 1, who: "匿名", text: "我天，我也觉得。他们食材放坏了吧？以后再也不去了。" },
        { f: 2, who: "匿名", text: "他们店这几天都停业了，莫名其妙的。那个店长又出去赌博了吧。" },
        { f: 3, who: "匿名", to: "回复 2楼", text: "我看是。这老板一开始还以为是啥好人，结果又家暴又赌博。心疼他儿子小李哦，看着乖乖瘦瘦的，身上都是伤。" },
      ],
    },
    {
      id: "p7",
      title: "关于闭站",
      author: "酷乐小子", time: "2000-04-15", pinned: true,
      text: "最近发生了这么多事……论坛也这么冷清，我决定今日起进行闭站处理。感谢各位这么长时间以来的关照了，虽然……不知道为什么会发生这种事，但还是希望各位离开如意楼后，还能各自安好。",
      floors: [],
    },
  ],
};
