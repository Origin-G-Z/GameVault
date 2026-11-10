/* ========== data.js · 明亮配色版 ========== */
const GAMES = [
  {
    id: 1, title: "Counter-Strike 2", platform: "PC", genre: "动作", year: 2023, rating: 9.2, hours: 13.2, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #fbbf24, #ea580c)", // 亮橙黄
    description: "经典反恐精英系列的全新引擎版本，竞技性极强的FPS射击游戏。", tags: ["FPS", "射击", "竞技"]
  },
  {
    id: 2, title: "剑星", platform: "PC", genre: "动作", year: 2024, rating: 9.2, hours: 31.2, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #f43f5e, #be123c)", // 玫瑰红
    description: "动作冒险游戏，讲述了在末日环境中生存的人类与怪物战斗的故事。", tags: ["动作", "冒险", "科幻"]
  },
  {
    id: 3, title: "无人深空", platform: "PC", genre: "独立", year: 2016, rating: 8.5, hours: 12.3, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #06b6d4, #3b82f6)", // 青蓝渐变
    description: "拥有近乎无限星球的太空探索生存游戏，历经更新口碑逆袭。", tags: ["太空", "探索", "生存"]
  },
  {
    id: 4, title: "极限竞速：地平线5", platform: "PC", genre: "竞速", year: 2021, rating: 9.4, hours: 14.7, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #ec4899, #8b5cf6)", // 粉紫渐变
    description: "开放世界赛车游戏，在墨西哥的广阔地图中体验极致的速度与风景。", tags: ["赛车", "开放世界", "竞速"]
  },
  {
    id: 5, title: "识质存在 (Lies of P)", platform: "PC", genre: "RPG", year: 2023, rating: 8.8, hours: 2.8, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #94a3b8, #475569)", // 银灰
    description: "暗黑童话风格的魂类动作RPG，扮演人偶在充满谎言的城市中寻找真相。", tags: ["魂类", "暗黑", "动作"]
  },
  {
    id: 6, title: "最后生还者1", platform: "PC", genre: "动作", year: 2023, rating: 9.5, hours: 15.1, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #10b981, #047857)", // 鲜绿
    description: "剧情向末日生存神作，乔尔与艾莉的旅程令人动容。", tags: ["末日", "生存", "剧情"]
  },
  {
    id: 7, title: "最后生还者2", platform: "PC", genre: "动作", year: 2024, rating: 9.3, hours: 0, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #64748b, #1e293b)", // 深灰蓝
    description: "续作展现了更为残酷的末日世界，极具争议但也极其优秀的叙事与战斗体验。", tags: ["末日", "生存", "剧情"]
  },
  {
    id: 8, title: "Wallpaper Engine", platform: "PC", genre: "模拟", year: 2018, rating: 9.8, hours: 418.7, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #3b82f6, #1d4ed8)", // 亮蓝
    description: "神级动态壁纸软件，可以播放视频、网页和动画，并支持创意工坊。", tags: ["壁纸", "工具", "创意工坊"]
  },
  {
    id: 9, title: "赛博朋克2077", platform: "PC", genre: "RPG", year: 2020, rating: 8.8, hours: 13.7, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #facc15, #eab308)", // 赛博黄
    description: "开放世界动作冒险RPG，在夜之城体验极具沉浸感的科幻剧情。", tags: ["开放世界", "科幻", "剧情"]
  },
  {
    id: 10, title: "双人成行", platform: "PC", genre: "动作", year: 2021, rating: 9.6, hours: 11.8, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #f472b6, #ec4899)", // 粉红
    description: "必须双人合作的冒险解谜游戏，创意拉满，关卡设计极其出色。", tags: ["双人", "合作", "解谜"]
  },
  {
    id: 11, title: "文明6", platform: "PC", genre: "策略", year: 2016, rating: 9.0, hours: 14.2, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #f97316, #ea580c)", // 橙色
    description: "回合制策略神作，从石器时代走向星际时代，“再来一回合”的魔力。", tags: ["回合制", "策略", "历史"]
  },
  {
    id: 12, title: "求生之路2", platform: "PC", genre: "动作", year: 2009, rating: 9.3, hours: 5.3, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #ef4444, #b91c1c)", // 血红
    description: "经典的丧尸合作射击游戏，四人小队在末日中杀出一条血路。", tags: ["丧尸", "合作", "射击"]
  },
  {
    id: 13, title: "泰拉瑞亚", platform: "PC", genre: "独立", year: 2011, rating: 9.7, hours: 6.5, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #22c55e, #15803d)", // 草绿
    description: "2D像素沙盒生存神作，极高的自由度，建造、探索、打Boss。", tags: ["沙盒", "生存", "像素"]
  },
  {
    id: 14, title: "星露谷物语", platform: "PC", genre: "模拟", year: 2016, rating: 9.8, hours: 1.2, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #84cc16, #4d7c0f)", // 黄绿
    description: "像素风农场经营游戏，种田、钓鱼、挖矿、和镇民交朋友。", tags: ["种田", "经营", "休闲"]
  },
  {
    id: 15, title: "PEAK", platform: "PC", genre: "独立", year: 2024, rating: 8.8, hours: 11.1, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #6366f1, #4338ca)", // 靛蓝
    description: "需要团队紧密配合的攀岩登山游戏，一不小心就会跌落悬崖。", tags: ["爬山", "合作", "受苦"]
  },
  {
    id: 16, title: "过山车之星", platform: "PC", genre: "模拟", year: 2016, rating: 9.1, hours: 11.9, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #a855f7, #7e22ce)", // 紫罗兰
    description: "极具深度的游乐园建造模拟游戏，发挥创意打造你的梦幻乐园。", tags: ["建造", "模拟", "经营"]
  },
  {
    id: 17, title: "EA SPORTS FC 24", platform: "PC", genre: "模拟", year: 2023, rating: 7.8, hours: 2.4, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #14b8a6, #0f766e)", // 青绿
    description: "EA出品的足球体育游戏，体验真实的绿茵场竞技。", tags: ["体育", "足球", "竞技"]
  },
  {
    id: 18, title: "动物迷城", platform: "PC", genre: "RPG", year: 2023, rating: 8.7, hours: 7.2, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #fb923c, #c2410c)", // 浅橙
    description: "扮演动物在监狱中生存并谋划越狱的CRPG，剧情和玩法都很扎实。", tags: ["越狱", "剧情", "国产"]
  },
  {
    id: 19, title: "人类一败涂地", platform: "PC", genre: "独立", year: 2016, rating: 8.9, hours: 4.1, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #cbd5e1, #94a3b8)", // 软灰
    description: "基于物理引擎的解谜游戏，软绵绵的小人带来爆笑的联机体验。", tags: ["解谜", "物理", "搞笑"]
  },
  {
    id: 20, title: "都市：天际线2", platform: "PC", genre: "策略", year: 2023, rating: 7.5, hours: 4.4, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #0ea5e9, #0284c7)", // 天蓝
    description: "硬核城市建造模拟游戏，规划交通、水电与区域，打造超级大都市。", tags: ["城建", "模拟", "策略"]
  }
];