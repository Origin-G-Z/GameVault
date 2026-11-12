// js/registry.js

// ================= 全局注册机制（兼容大小写） =================
window.GAME_DB = {};

// 定义一个内部函数
window.registerGame = function(gameData) {
  window.GAME_DB[gameData.id] = gameData;
};

// 兼容报错中全小写的调用方式
window.registergame = window.registerGame; 

// 挂载到 window，以便 detail.js 可以直接访问
window.GAMES = [
  {
    id: 'cs2',
    file: './game/cs2.js',
    title: '反恐精英2',
    en: 'Counter-Strike 2',
    desc: '一款“内核极度保守，表达极度现代”的竞技游戏。它用起源2引擎和子刷新率技术，提供了一个更精确的物理载体。',
    cover: './image/cs2.jpg',
    platforms: ['PC'],
    genres: ['射击', '电竞', '硬核'],
    isFavorite: true
  },
  {
    id: 'pragmata',
    file: './game/pragmata.js',
    title: '识质存在',
    en: 'PRAGMATA',
    desc: '一款用顶级工业水准包装的、情感内核极其鲜明的“电波系”作品。它不试图取悦所有人，却留下了深刻的划痕。',
    cover: './image/pragmata.jpg',
    platforms: ['PC', 'PS5', 'Xbox', 'NS2'],
    genres: ['动作', '科幻', '解谜'],
    isFavorite: true
  },
  {
    id: 'squad',
    file: './game/squad.js',
    title: '战术小队',
    en: 'SQUAD',
    desc: '50v50大型硬核战术射击游戏，极其强调团队沟通、指挥官调度与真实战场体验。',
    cover: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC'],
    genres: ['射击', '战术', '硬核']
  },
  {
    id: 'cod',
    file: './game/cod.js',
    title: '使命召唤',
    en: 'Call of Duty',
    desc: '经典第一人称射击系列，拥有好莱坞级别的剧情战役和爽快的多人对战。',
    cover: './image/cod.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['射击', '动作', '多人']
  },
  {
    id: 'ready-or-not',
    file: './game/ready-or-not.js',
    title: '严阵以待',
    en: 'Ready or Not',
    desc: '硬核拟真的SWAT特警战术射击游戏，面对极度危险的嫌犯，需要严谨的破门与突击战术。',
    cover: './image/ready-or-not.jpg',
    platforms: ['PC'],
    genres: ['射击', '战术', '硬核']
  },
  {
    id: 'battlefield5',
    file: './game/battlefield5.js',
    title: '战地5',
    en: 'Battlefield V',
    desc: '二战题材的大战场射击游戏，拥有极强的破坏系统和载具作战体验。',
    cover: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['射击', '动作', '大战场']
  },
  {
    id: 'titanfall2',
    file: './game/titanfall2.js',
    title: '泰坦陨落2',
    en: 'Titanfall 2',
    desc: '拥有业界顶尖的跑酷射击手感和机甲战斗，单人剧情战役更是神作。',
    cover: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['射击', '动作', '科幻']
  },
  {
    id: 'apex',
    file: './game/apex.js',
    title: 'Apex 英雄',
    en: 'Apex Legends',
    desc: '基于泰坦陨落世界观的战术竞技游戏，英雄技能与极致的滑铲射击手感结合。',
    cover: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['射击', '吃鸡', '科幻']
  },
  {
    id: 'l4d2',
    file: './game/l4d2.js',
    title: '求生之路2',
    en: 'Left 4 Dead 2',
    desc: '经典的丧尸合作射击游戏，四人小队在末日中杀出一条血路。',
    cover: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC'],
    genres: ['射击', '生存', '合作']
  },
  {
    id: 'stellar-blade',
    file: './game/stellar-blade.js',
    title: '剑星',
    en: 'Stellar Blade',
    desc: '动作冒险游戏，讲述了在末日环境中生存的人类与怪物战斗的故事。',
    cover: './image/stellar-blade.jpg',
    platforms: ['PS5', 'PC'],
    genres: ['动作', '冒险', '科幻'],
    isFavorite: true
  },
  {
    id: 'forza-horizon5',
    file: './game/forza-horizon5.js',
    title: '极限竞速：地平线5',
    en: 'Forza Horizon 5',
    desc: '开放世界赛车游戏，在墨西哥的广阔地图中体验极致的速度与风景。',
    cover: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'Xbox'],
    genres: ['竞速', '开放世界', '体育'],
    isFavorite: true
  },
  {
    id: 'forza-motorsport',
    file: './game/forza-motorsport.js',
    title: '极限竞速',
    en: 'Forza Motorsport',
    desc: '硬核拟真赛道竞速游戏，专注于真实的物理引擎与赛道驾驶体验。',
    cover: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'Xbox'],
    genres: ['竞速', '拟真', '体育'],
    isFavorite: true
  },
  {
    id: 'f1-24',
    file: './game/f1-24.js',
    title: 'F1 24',
    en: 'F1 24',
    desc: '官方授权的F1方程式赛车游戏，体验极速狂飙与车队策略。',
    cover: 'https://images.unsplash.com/photo-1541348263613-88afd3618b56?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['竞速', '体育', '拟真']
  },
  {
    id: 'fc26',
    file: './game/fc26.js',
    title: 'EA SPORTS FC 26',
    en: 'EA SPORTS FC 26',
    desc: '站在一个微妙的位置上：EA把“真实足球”做成了一个仅限离线的橱窗，而在线玩家仍被留在了那个更快、更滑的旧世界里。',
    cover: './image/fc26.jpg',
    platforms: ['PC', 'PS5', 'Xbox', 'Switch'],
    genres: ['体育', '足球', '竞技']
  },
  {
    id: 'msfs',
    file: './game/msfs.js',
    title: '微软模拟飞行',
    en: 'Microsoft Flight Simulator',
    desc: '使用真实卫星地图打造的飞行模拟器，可以在家环游世界。',
    cover: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'Xbox'],
    genres: ['模拟', '飞行', '硬核']
  },
  {
    id: 'cities-skylines2',
    file: './game/cities-skylines2.js',
    title: '都市：天际线2',
    en: 'Cities: Skylines II',
    desc: '硬核城市建造模拟游戏，规划交通、水电与区域，打造超级大都市。',
    cover: './image/city-sky-line2.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['模拟', '策略', '城建'],
    isFavorite: true
  },
  {
    id: 'cities-skylines',
    file: './game/cities-skylines.js',
    title: '都市：天际线',
    en: 'Cities: Skylines',
    desc: '经典城市建造游戏，极其丰富的内容与强大的创意工坊模组支持。',
    cover: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'PS5', 'Xbox', 'Switch'],
    genres: ['模拟', '策略', '城建']
  },
  {
    id: 'civilization6',
    file: './game/civilization6.js',
    title: '文明6',
    en: 'Civilization VI',
    desc: '回合制策略神作，从石器时代走向星际时代，“再来一回合”的魔力。',
    cover: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'Switch', 'PS5'],
    genres: ['策略', '回合制', '历史'],
    isFavorite: true
  },
  {
    id: 'euro-truck',
    file: './game/euro-truck.js',
    title: '欧洲卡车模拟2',
    en: 'Euro Truck Simulator 2',
    desc: '开着大卡车在欧洲公路上送货的模拟游戏，极致休闲放松。',
    cover: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC'],
    genres: ['模拟', '驾驶', '休闲']
  },
  {
    id: 'planet-coaster',
    file: './game/planet-coaster.js',
    title: '过山车之星',
    en: 'Planet Coaster',
    desc: '极具深度的游乐园建造模拟游戏，发挥创意打造你的梦幻乐园。',
    cover: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['模拟', '建造', '经营']
  },
  {
    id: 'raft',
    file: './game/raft.js',
    title: '木筏求生',
    en: 'Raft',
    desc: '在大海上漂流收集垃圾扩建木筏的生存游戏，支持多人合作。',
    cover: './image/raft.jpg',
    platforms: ['PC'],
    genres: ['独立', '生存', '合作']
  },
  {
    id: 'the-forest',
    file: './game/the-forest.js',
    title: '森林',
    en: 'The Forest',
    desc: '荒岛生存恐怖游戏，不仅要填饱肚子，还要面对地下洞穴里的变异野人。',
    cover: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'PS5'],
    genres: ['独立', '生存', '恐怖']
  },
  {
    id: 'phasmophobia',
    file: './game/phasmophobia.js',
    title: '恐鬼症',
    en: 'Phasmophobia',
    desc: '四人合作抓鬼游戏，依靠各种设备收集证据，极具沉浸感的恐怖体验。',
    cover: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC'],
    genres: ['独立', '恐怖', '合作']
  },
  {
    id: 'no-mans-sky',
    file: './game/no-mans-sky.js',
    title: '无人深空',
    en: 'No Man\'s Sky',
    desc: '拥有近乎无限星球的太空探索生存游戏，历经更新口碑逆袭。',
    cover: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'PS5', 'Xbox', 'Switch'],
    genres: ['独立', '探索', '太空'],
    isFavorite: true
  },
  {
    id: 'it-takes-two',
    file: './game/it-takes-two.js',
    title: '双人成行',
    en: 'It Takes Two',
    desc: '必须双人合作的冒险解谜游戏，创意拉满，关卡设计极其出色。',
    cover: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'PS5', 'Xbox', 'Switch'],
    genres: ['动作', '合作', '解谜']
  },
  {
    id: 'peak',
    file: './game/peak.js',
    title: 'PEAK',
    en: 'PEAK',
    desc: '需要团队紧密配合的攀岩登山游戏，一不小心就会跌落悬崖。',
    cover: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC'],
    genres: ['独立', '合作', '受苦']
  },
  {
    id: 'human-fall-flat',
    file: './game/human-fall-flat.js',
    title: '人类一败涂地',
    en: 'Human: Fall Flat',
    desc: '基于物理引擎的解谜游戏，软绵绵的小人带来爆笑的联机体验。',
    cover: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'Switch', 'PS5'],
    genres: ['独立', '解谜', '搞笑']
  },
  {
    id: 'stardew-valley',
    file: './game/stardew-valley.js',
    title: '星露谷物语',
    en: 'Stardew Valley',
    desc: '像素风农场经营游戏，种田、钓鱼、挖矿、和镇民交朋友。',
    cover: 'https://images.unsplash.com/photo-1590212151175-e58edd96185b?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'Switch', 'PS5'],
    genres: ['模拟', '经营', '休闲']
  },
  {
    id: 'terraria',
    file: './game/terraria.js',
    title: '泰拉瑞亚',
    en: 'Terraria',
    desc: '2D像素沙盒生存神作，极高的自由度，建造、探索、打Boss。',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC', 'Switch', 'PS5'],
    genres: ['独立', '沙盒', '生存']
  },
  {
    id: 'tlou1',
    file: './game/tlou1.js',
    title: '最后生还者1',
    en: 'The Last of Us Part I',
    desc: '剧情向末日生存神作，乔尔与艾莉的旅程令人动容。',
    cover: './image/The_last_of_us_1.jpg',
    platforms: ['PC', 'PS5'],
    genres: ['动作', '生存', '剧情'],
    isFavorite: true
  },
  {
    id: 'tlou2',
    file: './game/tlou2.js',
    title: '最后生还者2',
    en: 'The Last of Us Part II',
    desc: '续作展现了更为残酷的末日世界，极具争议但也极其优秀的叙事与战斗体验。',
    cover: './image/The_last_of_us_2.jpg',
    platforms: ['PS5'],
    genres: ['动作', '生存', '剧情'],
    isFavorite: true
  },
  {
    id: 'back-to-the-dawn',
    file: './game/back-to-the-dawn.js',
    title: '动物迷城',
    en: 'Back to the Dawn',
    desc: '扮演动物在监狱中生存并谋划越狱的CRPG，剧情和玩法都很扎实。',
    cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
    platforms: ['PC'],
    genres: ['RPG', '剧情', '独立']
  }
];