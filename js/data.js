/* ========== data.js · 完整 32 款游戏数据（更新 CS2 长文） ========== */
const GAMES = [
  // ===== 核心 FPS / 战术射击 =====
  {
    id: 1, title: "Counter-Strike 2", platform: "PC", genre: "动作", year: 2023, rating: 9.2, hours: 132.5, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #fbbf24, #ea580c)",
    description: "经典反恐精英系列的全新引擎版本，竞技性极强的FPS射击游戏。", tags: ["FPS", "射击", "竞技"],
    detailContent: `
      <blockquote>
        <strong>一款“内核极度保守，表达极度现代”的竞技游戏。</strong> 它用起源2引擎和子刷新率技术，为那个你熟悉的、强调枪法、经济与团队协作的硬核世界，提供了一个更精确、也更真实的物理载体。它的魅力与挫败感同源。
      </blockquote>

      <h2>一、基础信息速览</h2>
      <table>
        <tbody>
          <tr><th>发售日期</th><td>2023年9月28日（作为CS:GO的免费升级正式上线）</td></tr>
          <tr><th>开发商 / 发行商</th><td>Valve</td></tr>
          <tr><th>平台</th><td>PC（Steam / 完美世界 / 蒸汽平台）</td></tr>
          <tr><th>游戏引擎</th><td>Source 2（起源2引擎）</td></tr>
          <tr><th>收费模式</th><td><strong>本体免费</strong>；Prime“优先状态”国区约 <strong>103元</strong>（一次性买断，解锁排位、经验与专属掉落）</td></tr>
          <tr><th>Steam 评价</th><td>整体 <strong>86%</strong> 好评（基于约 <strong>862万</strong> 条评测）；近30天好评率 <strong>82%</strong></td></tr>
          <tr><th>最高同时在线</th><td><strong>186.2万</strong>（2025年4月创下）</td></tr>
          <tr><th>TGA 2025</th><td>最佳电竞游戏</td></tr>
        </tbody>
      </table>

      <h2>二、核心玩法：一切如旧，但“精确”被重新定义</h2>
      <p>CS2的底层逻辑从未改变：<strong>5v5战术射击，经济是灵魂，一命制是压力来源</strong>。你熟悉的每一张地图、每一种枪械手感、每一套经济决策框架，几乎原封不动地保留了下来。但“精确”这个词，被Source 2引擎从服务器底层重新书写了。</p>

      <h3>2.1 经济系统：每一回合都是一道算术题</h3>
      <p>标准竞技模式采用 <strong>MR12赛制</strong>（先赢13回合者胜），半场12回合后攻防互换。经济系统驱动着每一个决策：击杀基准奖励 <strong>300美元</strong>，团队需要在“eco（经济局）”“强起”和“全装全弹”之间反复权衡。一次错误的购买选择，代价可能不只是这一回合，而是接下来两到三个回合的连锁劣势。这种<strong>将资源管理嵌入每一次交火前</strong>的设计，是CS2战术深度的真正底座。</p>
      <p><strong>Premier模式</strong>是CS2引入的全新段位体系，完全复刻职业赛场规则：地图BP（禁用/选择）、MR12、加时赛制。它用全球和区域排行榜取代了传统的段位徽章，让每一场Premier对局都带有明确的“积分”属性。对于追求纯粹竞技体验的玩家，Premier是唯一值得投入的模式。</p>

      <h3>2.2 子刷新率：服务器终于“看见”了你按下的那一瞬</h3>
      <p>这是CS2最根本的技术变革，也是理解它与CS:GO手感差异的关键。</p>
      <p>过去，服务器以固定的 <strong>Tick</strong> 间隔（64或128）来评估世界状态。如果你的操作恰好落在两个Tick之间，它只能被“归入”某个Tick，产生一种微妙的、难以言说的延迟感。CS2的<strong>子刷新率</strong>架构改变了这一点：服务器现在能够知道<strong>运动开始、开枪射击或投掷物掷出的确切瞬间</strong>，而不再受刷新频率的限制。</p>
      <p>这意味着什么？你的急停、你的第一发子弹、你的投掷物落点，在服务器端的判定与你在屏幕上的操作之间，隔阂被大幅压缩了。这种变化不是“手感变好了”那么简单，而是<strong>公平性的底层逻辑被重写了</strong>——两个同样精准的操作，不再因为网络时序的微小错位而得到不同的结果。</p>

      <h2>三、技术跃迁：体积烟雾与物理世界</h2>
      <h3>3.1 烟雾弹：从“贴图”到“物体”</h3>
      <p>CS2最直观、也最具战术颠覆性的变化，是<strong>体积烟雾弹</strong>。烟雾不再是铺在地面和空中的一张动态贴图，而是一个<strong>三维动态物体</strong>，能与环境发生真实的物理互动。</p>
      <p>它可以被<strong>子弹和高爆手雷短暂推开</strong>，撕开一个转瞬即逝的射击窗口；它会<strong>从窗口溢出、沿楼梯蔓延</strong>，而不是被生硬地切割在几何边界上；它对<strong>枪口火焰和光照</strong>做出反应，在黑暗中暴露开枪者的位置。在CS:GO时代，一颗烟雾弹的边界是“确定”的，你只需要知道烟有没有封住那条缝。在CS2里，烟雾本身成为了一个<strong>可被主动干预的战术变量</strong>：用一颗雷撕开烟墙的瞬间完成击杀，或者利用烟雾的物理扩散制造比过去复杂得多的假象，都成为了常规操作。</p>

      <h3>3.2 地图与视听：选择性重制，而非推倒重来</h3>
      <p>CS2的地图策略是<strong>保守的</strong>。Dust II、Mirage、Inferno等经典地图在保留核心布局与交火距离的前提下，基于新引擎重制了光照、材质和角色辨识度。Overpass等少数地图则获得了更彻底的重做。这种策略的代价是“新鲜感”有限，但收益是<strong>肌肉记忆的完整迁移</strong>——你不需要重新学习一张地图的每一个角落，就能感受到新引擎带来的视觉清晰度和物理真实感。</p>
      <p>音频系统同样被重做。脚步声、枪声、换弹声的方向感和距离感更加精确，信息获取的“听觉维度”被拉到了与视觉同等重要的位置。</p>

      <h2>四、电竞生态：一个仍在扩张的庞然大物</h2>
      <p>CS2的电竞体量在2026年达到了CS历史上前所未有的高度。</p>
      <p><strong>IEM科隆Major 2026</strong>时隔十年重返科隆，总奖金池为 <strong>125万美元</strong>，冠军Team Falcons独得头名奖金，并拿下了组织历史上的首个Major冠军。但比冠军归属更具标志性的是数据：该赛事创下了<strong>CS历史上最高的收视纪录</strong>——超过 <strong>1亿小时</strong> 的观看时长，峰值观众突破 <strong>275万</strong>，现场售出超过 <strong>6.7万张</strong> 门票，覆盖75个以上国家的观众。决赛在Team Falcons与FURIA之间展开，以3比0收官，m0NESY获得赛事MVP。</p>
      <p>这一数字的意义在于：CS2没有因为从CS:GO过渡期的技术争议而失去电竞观众。相反，它在一个已经极度成熟的电竞品类中，<strong>把天花板又推高了一截</strong>。</p>

      <h2>五、皮肤经济：一个独立于游戏本身的“市场”</h2>
      <p>CS2的皮肤生态已经远远超出了“游戏内装饰”的范畴，成为一个具有真实金融属性的二级市场。</p>
      <p>根据2025年的市场分析，玩家全年开启了约 <strong>4亿个</strong> 武器箱，仅钥匙销售一项就为Valve带来<strong>超过10亿美元</strong> 的毛收入。Steam社区市场全年完成了 <strong>7.54亿笔</strong> 物品交易，Valve以15%的手续费从中获得约 <strong>1.66亿美元</strong> 的收入。其中最昂贵的一笔皮肤交易，是一把售价<strong>超过100万美元</strong> 的AK-47皮肤。</p>
      <p>但这个市场同样暴露了CS2运营中<strong>最剧烈的一次震荡</strong>。2025年10月，Valve推出“汰换系统”，允许玩家用廉价皮肤合成原本只能通过开箱获得的刀具和手套。这一改动瞬间改变了高端饰品的稀缺性结构，皮肤市场总市值<strong>从约60亿美元一度跌至40亿美元</strong>，单日蒸发约 <strong>17亿美元</strong>，Steam单日新增差评超过 <strong>2000条</strong>。对于投入了真金白银的收藏者和交易者而言，这次更新是一次规则层面的“地震”；而对于普通玩家，它客观上降低了获取高级饰品的门槛。CS2的皮肤市场从来不只是一组装饰品——它是一个<strong>由Valve单方面制定规则、却承载着数十亿美元玩家资产的准金融市场</strong>，而规则的每一次变动，都会在游戏评价和社区情绪上留下真实的裂痕。</p>

      <h2>六、口碑与争议：86%好评背后的撕裂</h2>
      <p>CS2的Steam整体评价维持在 <strong>86%</strong> 好评（约862万条评测），近30天好评率 <strong>82%</strong>。这个数字放在任何一款游戏身上都堪称优秀，但对于CS2而言，它掩盖的东西和它反映的东西一样重要。</p>

      <h3>真正伤害核心体验的问题：反作弊</h3>
      <p>在所有批评中，<strong>外挂问题</strong>的权重远超其他。多个来源指向同一个结论：反作弊不力是CS2玩家流失<strong>最核心的驱动因素</strong>。硬核玩家因无法忍受匹配中的作弊现象而转向第三方对战平台（如FACEIT、ESEA），直接分流了官方服务器的流量。VAC系统在应对现代作弊软件时的滞后性，被社区反复诟病为“对竞技 integrity 的根本性侵蚀”。一个颇具讽刺意味的社区观察是：在CS2中，“<strong>问题不只是有作弊者存在，而是大家都会认为对方在作弊</strong>”——subtick和延迟带来的感知偏差，进一步放大了这种普遍性的不信任。</p>

      <h3>机制层面的争议：从“手感”到“习惯”</h3>
      <p><strong>子刷新率</strong>本身在理论上是一项进步，但在实践中，一部分玩家认为它带来了新的、难以适应的“手感”变化。争议的焦点不在于技术原理，而在于<strong>CS:GO时代积累的肌肉记忆和直觉判断，在CS2中需要被重新校准</strong>。对于一款以“十年如一日的手感”为核心资产的游戏，任何底层的改动都会引发远比普通游戏更剧烈的反馈。</p>
      <p>更大的引爆点来自 <strong>2026年3月的换弹机制更新</strong>。Valve在没有预警的情况下，颠覆了延续二十年的换弹操作逻辑，这次更新被描述为“<strong>Steam史上差评最多的更新之一</strong>”。后续的受击镜头晃动等改动，也被认为是在持续消耗老玩家的耐心。</p>

      <h3>一个无法回避的趋势：玩家基数的回落</h3>
      <p>2026年2月至7月，CS2的平均在线人数从 <strong>109万</strong> 跌至 <strong>82万</strong> 左右，峰值从 <strong>172万</strong> 回落至 <strong>133万</strong>，五个月累计流失超过 <strong>23万</strong> 日均玩家，创下近30个月的最低纪录。下滑的原因被归纳为三点：<strong>反作弊不力、机制改动引发的信任消耗、以及新内容供给的不足</strong>。CS2的玩家基数依然庞大，它仍然是Steam上最热门的游戏之一。但“仍然庞大”和“正在流失”并不矛盾——对于一个依赖长期社区信任的竞技游戏而言，后者的信号意义远大于前者的安慰价值。</p>

      <h2>七、总结：为谁而存在，因何而不可替代</h2>
      <p>CS2是一款<strong>处在持续“施工”状态中的作品</strong>。它的技术底子极其扎实：Source 2引擎、子刷新率、体积烟雾共同构建了一个比CS:GO更精确、更真实的物理与判定世界。它的电竞生态仍在扩张，收视纪录被不断刷新，皮肤经济虽然波动剧烈，却始终保持着惊人的体量。这些都是事实。</p>
      <p>但同样真实的是：<strong>反作弊的长期乏力</strong>正在侵蚀它最核心的竞技信任；<strong>机制改动的节奏与方式</strong>在反复消耗老玩家的耐心；而玩家基数的连续回落，指向一个更根本的问题——CS2需要证明它不仅能“继承”CS:GO的遗产，还能<strong>持续产出让玩家愿意留下的理由</strong>。</p>
      <p><strong>它适合你，如果：</strong></p>
      <ul>
        <li>你追求的是市面上最纯粹、最硬核、经济深度最高的5v5战术射击体验，并且愿意接受它陡峭的学习曲线和残酷的失误惩罚；</li>
        <li>你对“枪法+经济+团队协作”三位一体的竞技框架有长期投入的意愿，而不是寻求一段十几小时的线性体验；</li>
        <li>你理解并接受一个事实：CS2的乐趣<strong>不来自内容的堆砌，而来自同一套规则下无限重复的对局中，每一次微小的进步和每一次全新的博弈</strong>。</li>
      </ul>
      <p><strong>它可能不适合你，如果：</strong></p>
      <ul>
        <li>你对匹配环境中的外挂问题高度敏感，或者不愿意为了规避这一问题而转向第三方平台；</li>
        <li>你期待一款在机制和内容上“持续给出新鲜感”的游戏，而不是在近乎不变的框架中自我打磨；</li>
        <li>你更看重即时的爽快反馈而非长期的技巧积累。</li>
      </ul>
      <p>CS2不完美，但它所代表的那种<strong>纯粹、硬核、以公平为最高价值的对抗美学</strong>，至今仍然几乎没有真正的替代品。它的危机不在于“不好玩”，而在于<strong>维持这种“好玩”所需要的信任成本，正在变得越来越高</strong>。</p>
    `
  },
  {
    id: 2, title: "SQUAD (战术小队)", platform: "PC", genre: "动作", year: 2020, rating: 8.9, hours: 320.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #78716c, #292524)",
    description: "50v50大型硬核战术射击游戏，极其强调团队沟通、指挥官调度与真实战场体验。", tags: ["战术", "硬核", "射击"]
  },
  {
    id: 3, title: "使命召唤 (Call of Duty)", platform: "PC", genre: "动作", year: 2022, rating: 8.5, hours: 150.2, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #4b5563, #111827)",
    description: "经典第一人称射击系列，拥有好莱坞级别的剧情战役和爽快的多人对战。", tags: ["FPS", "射击", "多人"]
  },
  {
    id: 4, title: "严阵以待 (Ready or Not)", platform: "PC", genre: "动作", year: 2023, rating: 9.0, hours: 45.5, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #475569, #1e293b)",
    description: "硬核拟真的SWAT特警战术射击游戏，面对极度危险的嫌犯，需要严谨的破门与突击战术。", tags: ["战术", "特警", "硬核"]
  },
  {
    id: 5, title: "战地5 (Battlefield V)", platform: "PC", genre: "动作", year: 2018, rating: 8.0, hours: 35.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #ca8a04, #713f12)",
    description: "二战题材的大战场射击游戏，拥有极强的破坏系统和载具作战体验。", tags: ["二战", "大战场", "射击"]
  },
  {
    id: 6, title: "泰坦陨落2 (Titanfall 2)", platform: "PC", genre: "动作", year: 2016, rating: 9.5, hours: 20.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #0284c7, #082f49)",
    description: "拥有业界顶尖的跑酷射击手感和机甲战斗，单人剧情战役更是神作。", tags: ["机甲", "跑酷", "FPS"]
  },
  {
    id: 7, title: "Apex 英雄", platform: "PC", genre: "动作", year: 2019, rating: 8.7, hours: 85.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #ef4444, #7f1d1d)",
    description: "基于泰坦陨落世界观的战术竞技游戏，英雄技能与极致的滑铲射击手感结合。", tags: ["吃鸡", "战术竞技", "科幻"]
  },
  {
    id: 8, title: "求生之路2", platform: "PC", genre: "动作", year: 2009, rating: 9.3, hours: 5.3, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #ef4444, #450a0a)",
    description: "经典的丧尸合作射击游戏，四人小队在末日中杀出一条血路。", tags: ["丧尸", "合作", "射击"]
  },
  {
    id: 9, title: "剑星 (Stellar Blade)", platform: "PC", genre: "动作", year: 2024, rating: 9.2, hours: 31.2, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #f43f5e, #be123c)",
    description: "动作冒险游戏，讲述了在末日环境中生存的人类与怪物战斗的故事。", tags: ["动作", "冒险", "科幻"]
  },
  
  // ===== 识质存在 (PRAGMATA) 长文介绍 =====
  {
    id: 10, title: "识质存在 (PRAGMATA)", platform: "PC", genre: "RPG", year: 2026, rating: 8.8, hours: 2.8, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #94a3b8, #475569)",
    description: "暗黑童话风格的魂类动作RPG，扮演人偶在充满谎言的城市中寻找真相。", tags: ["科幻", "动作", "剧情"],
    detailContent: `
      <blockquote>
        <strong>一款用顶级工业水准包装的、情感内核极其鲜明的“电波系”作品。</strong> 它不试图取悦所有人，却在愿意适应它节奏的玩家心中，留下了一道温柔而深刻的划痕。
      </blockquote>

      <h2>一、基础信息速览</h2>
      <table>
        <tbody>
          <tr><th>发售日期</th><td>2026年4月17日（PS5 / Xbox Series X|S / PC / 欧美 NS2）；亚洲 NS2 版 4月24日</td></tr>
          <tr><th>开发商 / 发行商</th><td>卡普空（CAPCOM）</td></tr>
          <tr><th>平台</th><td>PS5、Xbox Series X/S、Nintendo Switch 2、PC</td></tr>
          <tr><th>语言</th><td>支持简体中文</td></tr>
          <tr><th>Steam 国区价格</th><td>标准版 <strong>268 元</strong>；豪华版 <strong>328 元</strong>（含服装、武器皮肤、BGM、动作、资料库原画等）</td></tr>
          <tr><th>Metacritic</th><td>媒体均分 <strong>86</strong>，用户评分 <strong>9.0</strong></td></tr>
          <tr><th>Steam 好评率</th><td>全语言 <strong>94%</strong>（发售初期一度达 96%–97%）</td></tr>
          <tr><th>销量</th><td>发售 <strong>2 天</strong>破 100 万份；<strong>16 天</strong>破 <strong>200 万份</strong></td></tr>
          <tr><th>主线时长</th><td>约 <strong>8–12 小时</strong>；含收集与终局内容可至 <strong>15–16 小时</strong></td></tr>
        </tbody>
      </table>

      <h2>二、世界观与剧情设定：月球、月丝与“死丝”</h2>
      <p>故事发生在<strong>近未来</strong>。人类在月球发现了一种名为 <strong>“月丝”（Lunum）</strong> 的神秘物质，只要输入数据，就能用它 <strong>3D 打印出任何实体</strong>。凭借这项技术，人类在月球建立了庞大的研究基地 <strong>“摇篮基地”</strong>，甚至按地球城市的面貌打印出了曼哈顿、东京等区域。</p>
      <p>然而，月丝代谢过程中会产生一种黑色副产物——<strong>“死丝”</strong>。当死丝大规模扩散并依附于机器人身上时，基地内部发生了惨剧，管理 AI <strong>“IDUS”</strong> 随之暴走，机器人开始无差别攻击人类。</p>
      <p>主角 <strong>休·威廉姆斯</strong> 是调查小队的一员，奉命前往失联的摇篮基地查明真相。任务中一场强烈的<strong>月震</strong>将队伍打散，休重伤昏迷，被一台拥有小女孩外表的仿生少女 <strong>戴安娜</strong> 发现并救治。两人自此结伴，在被失控 AI 统治的月球基地中求生，寻找返回地球的方法。</p>
      <blockquote>
        <strong>叙事核心</strong>并非“拯救世界”的宏大命题，而是<strong>两个孤独个体之间逐渐萌芽的父女关系</strong>。戴安娜的天真追问与休的外冷内热形成了持续的情感张力，构成了驱动玩家推进流程的真正动力。
      </blockquote>

      <h2>三、核心玩法详解：一场精心设计的“左右脑互搏”</h2>
      <h3>3.1 侵入面板：射击游戏里的“一笔画”</h3>
      <p>这是《识质存在》最具辨识度的机制。当你举枪瞄准敌人时，戴安娜的<strong>网格侵入面板</strong>会实时弹出。你需要在网格中<strong>从起点到终点画出一条连续的一笔画路径</strong>，途中经过的<strong>蓝色格子越多</strong>，破解伤害越高，敌人破防时间越长。</p>
      <p>面板中还有两类关键格子：</p>
      <ul>
        <li><strong>红色格子</strong>：必须避开，触碰会重置路径。</li>
        <li><strong>黄色格子</strong>：相当于技能节点，经过后会附带各种 debuff，例如<strong>增伤、控制敌人攻击同伴、群体侵入</strong>等。</li>
      </ul>
      <p>敌人的护甲极高，<strong>不完成侵入就几乎打不动</strong>。因此战斗的核心节奏变成了一个三位一体的循环：<strong>走位躲技能 → 完成一笔画侵入 → 射击破防窗口</strong>。</p>

      <h3>3.2 为什么“互搏”最终变成了“心流”</h3>
      <p>初上手时，一边射击、一边走格子、一边还要关注走位，确实会让人手忙脚乱。但游戏的设计巧妙地消解了这种混乱：</p>
      <p>休的<strong>主武器在停止射击时会自动恢复弹药</strong>。这意味着你可以在弹夹打空的间隙，自然地切回侵入面板继续走格子；而当你走完一轮侵入时，弹药也恢复得差不多了，正好进入下一轮输出窗口。</p>
      <p>熟练之后，这套循环会像齿轮一样咬合起来：<strong>侵入→射击清空弹夹→趁换弹间隙继续侵入→敌人破防倒地→近身处决</strong>。卡普空业界顶级的打击感让每一次处决都带着近乎《血源》内脏暴击的爽快反馈。</p>

      <h3>3.3 武器与模块：深度远超“一周目通关”</h3>
      <p>休可切换多种枪械，分为<strong>攻击型、控制型和辅助型</strong>。攻击型如“充能穿击者”能造成大量伤害；控制型如“静滞网”可大范围减速；辅助型如“诱饵枪”能吸引敌人火力。不过这些<strong>副武器是一次性消耗品</strong>，用完需要在地图中重新拾取，主武器则是无限续航的底牌。</p>
      <p>真正让战斗风格产生质变的是<strong>模块系统</strong>。后期可以围绕不同思路构建 Build：</p>
      <ul>
        <li><strong>骇入控场流</strong>：优先升级戴安娜的骇入能力，模块携带“递归学习”“中转扩大”“连带伤害”，以侵入为核心输出手段。</li>
        <li><strong>输出特化流</strong>：攻击模块堆叠“奇袭”“武器优势”“散兵”“最佳表现”“近距离”，配合“升温+高热模式”快速积累热量，触发致命一击。</li>
        <li><strong>生存容错流</strong>：防御模块固定生命加成、闪避回血、延长闪避窗口，适合高难度开荒。</li>
      </ul>
      <p>这套系统让“一周目通关”仅仅是开始，终局内容才是配装深度的真正试炼场。</p>

      <h2>四、角色解析：大叔与机器少女</h2>
      <h3>休·威廉姆斯</h3>
      <p><strong>身份</strong>：德尔斐公司审计员，曾从事安保工作，精通各类枪械。性格<strong>心直口快，刀子嘴豆腐心</strong>，常以直率表达掩饰内心情感。宇航服上那件充满童趣的“涂鸦宇航服”，是戴安娜亲手画上去的——这个细节本身就在讲述两人关系的变化。</p>
      <h3>戴安娜</h3>
      <p><strong>身份</strong>：由“月丝”制造的仿生少女，编号 D-I-0336-7。“戴安娜”这个名字是<strong>休为她取的</strong>，她视若珍宝。她拥有侵入系统、操控机械以及揭示敌人弱点的能力，但因数据存储有限，行为举止天真好奇，像一个真正的人类孩子。英文版由 Grace Saif 配音，日文版由<strong>东山奈央</strong>配音。</p>
      <blockquote>
        许多玩家在通关后提到，戴安娜“像真正的小孩一样真实”。她会在宇航服上涂鸦，会不停追问“地球是什么样”，正是这些看似无用的日常碎片，让这段十几小时的月球旅程拥有了远超其体量的情感重量。
      </blockquote>

      <h2>五、视觉与技术表现：卡普空近年最“炫技”的一作</h2>
      <p>《识质存在》的 PC 版是当前图形技术的一个展示窗口。它是首批<strong>同时支持路径追踪和 NVIDIA DLSS 4 多帧生成</strong>的游戏之一。</p>
      <p>路径追踪带来的改变是肉眼可见的：关闭光追时，空间站室内的反射光几乎不存在，宇航服和戴安娜的面部细节淹没在黑暗中；开启路径追踪后，整个室内仿佛被“补光灯”照亮，透明玻璃上能清晰浮现巨幕的倒影，宇航服的材质纹理和戴安娜的面部表情才真正变得<strong>可辨、可信</strong>。用评测者的话说，“科幻感拉满”并非虚言。</p>
      <p>性能方面，RTX 5080 在 4K 分辨率、开启路径追踪 + DLSS 4 倍帧生成的情况下，室内场景平均帧率可保持在 <strong>200 帧以上</strong>；即使是路径追踪 + DLSS 性能模式的基础档位，也能满足 4K/60 帧的基本需求。当然，代价是显存占用和延迟的增加，路径追踪的硬件门槛依然真实存在。</p>
      <p>值得一提的是，游戏文件仅 <strong>34.3GB</strong>，在 3A 动辄上百 GB 的时代显得相当克制，也侧面印证了卡普空 RE 引擎的资产利用效率。</p>

      <h2>六、口碑、销量与争议：一个“高开”的完整故事</h2>
      <h3>数据面：叫好又叫座</h3>
      <p>《识质存在》在商业和口碑两个维度都交出了扎实的成绩单。<strong>Metacritic 86 分</strong>、用户评分 <strong>9.0</strong>，Steam 好评率稳定在 <strong>93%–94%</strong> 区间，发售两天销量破百万，十六天翻倍至 200 万份。Steam 最高同时在线约 <strong>6.8 万人</strong>。IGN 给出 <strong>8 分</strong>，评价其为“游戏感十足”的第三人称动作射击，核心的“破解射击”玩法创意十足、战斗爽快扎实。</p>
      <h3>争议面：精致，但“不够管饱”</h3>
      <p>批评的声音同样清晰，且集中在两个维度：</p>
      <p><strong>其一，体量。</strong> 主线 <strong>8–12 小时</strong>的流程，在 268 元的定价面前让一部分玩家感到“内容单薄”。后期关卡被批评场景重复、敌人种类偏少、“堆怪”痕迹明显，Boss 战虽然有亮点，但整体未能完全摆脱卡普空式的模板感。</p>
      <p><strong>其二，门槛。</strong> “左右脑互搏”的设计是一把双刃剑。它创造了市面上罕见的心流体验，但也<strong>筛掉了相当一部分玩家</strong>。有数据显示主线通关率不到 17%，大量玩家在前两小时的适应期内选择了离开。</p>
      <p>然而，另一种视角同样值得倾听：在“3A 必须 50 小时起步”的惯性期待之外，《识质存在》代表了一种<strong>“精简、完整、不拖泥带水”的中等体量游戏</strong>的价值。通关它的那一刻，有玩家形容“<strong>觉得自己被轻轻抱了一下</strong>”——这种来自内容密度而非内容长度的满足感，恰恰是许多大体量作品难以提供的。</p>

      <h2>七、总结：为谁而做，因何而值得</h2>
      <p>《识质存在》是一款<strong>态度极其清晰的“作者性”作品</strong>。它没有试图用开放世界、海量支线或无穷刷取来延长你的停留时间；它把几乎全部赌注压在了一套前所未见的“侵入+射击”战斗系统，以及一段大叔与机器少女之间安静而真挚的关系上。</p>
      <p><strong>它适合你，如果：</strong></p>
      <ul>
        <li>你愿意花一两个小时适应一套陌生的操作节奏，并享受“从手忙脚乱到心流涌动”的成长曲线；</li>
        <li>你对<strong>有情感重量的角色羁绊</strong>没有抵抗力，愿意为一小段真诚的叙事投入十小时；</li>
        <li>你欣赏“小而完整”胜过“大而空洞”，并且不介意为这份精致支付 268 元。</li>
      </ul>
      <p><strong>它可能不适合你，如果：</strong></p>
      <ul>
        <li>你期待的是《使命召唤》式行云流水的纯射击爽感；</li>
        <li>你对解谜与射击的强制融合天然排斥；</li>
        <li>你更看重单周目的内容厚度与重复可玩性，而非一周目内的体验密度。</li>
      </ul>
      <p>它不完美，但它所尝试的事情——<strong>用一套全新的操作语言去讲述一个关于连接的故事</strong>——在 2026 年的游戏版图上，几乎没有替代品。</p>
    `
  },

  // ===== 竞速与体育 =====
  {
    id: 11, title: "极限竞速：地平线5", platform: "PC", genre: "竞速", year: 2021, rating: 9.4, hours: 114.7, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    description: "开放世界赛车游戏，在墨西哥的广阔地图中体验极致的速度与风景。", tags: ["赛车", "开放世界", "竞速"]
  },
  {
    id: 12, title: "极限竞速 (Forza Motorsport)", platform: "PC", genre: "竞速", year: 2023, rating: 8.2, hours: 60.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #0ea5e9, #0c4a6e)",
    description: "硬核拟真赛道竞速游戏，专注于真实的物理引擎与赛道驾驶体验。", tags: ["拟真", "赛道", "竞速"]
  },
  {
    id: 13, title: "F1 24", platform: "PC", genre: "竞速", year: 2024, rating: 8.4, hours: 42.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #ef4444, #991b1b)",
    description: "官方授权的F1方程式赛车游戏，体验极速狂飙与车队策略。", tags: ["F1", "方程式", "竞速"]
  },
  {
    id: 14, title: "EA SPORTS FC 24", platform: "PC", genre: "模拟", year: 2023, rating: 7.8, hours: 2.4, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #14b8a6, #134e4a)",
    description: "EA出品的足球体育游戏，体验真实的绿茵场竞技。", tags: ["体育", "足球", "竞技"]
  },

  // ===== 模拟、建造与策略 =====
  {
    id: 15, title: "微软模拟飞行 (MSFS)", platform: "PC", genre: "模拟", year: 2020, rating: 9.0, hours: 130.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #60a5fa, #1e3a8a)",
    description: "使用真实卫星地图打造的飞行模拟器，可以在家环游世界。", tags: ["飞行", "硬核", "写实"]
  },
  {
    id: 16, title: "都市：天际线2", platform: "PC", genre: "策略", year: 2023, rating: 7.5, hours: 84.4, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #38bdf8, #0284c7)",
    description: "硬核城市建造模拟游戏，规划交通、水电与区域，打造超级大都市。", tags: ["城建", "模拟", "策略"]
  },
  {
    id: 17, title: "都市：天际线", platform: "PC", genre: "策略", year: 2015, rating: 9.0, hours: 105.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #818cf8, #4338ca)",
    description: "经典城市建造游戏，极其丰富的内容与强大的创意工坊模组支持。", tags: ["城建", "模拟", "经典"]
  },
  {
    id: 18, title: "文明6", platform: "PC", genre: "策略", year: 2016, rating: 9.0, hours: 14.2, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #f97316, #7c2d12)",
    description: "回合制策略神作，从石器时代走向星际时代，“再来一回合”的魔力。", tags: ["回合制", "策略", "历史"]
  },
  {
    id: 19, title: "欧洲卡车模拟2", platform: "PC", genre: "模拟", year: 2012, rating: 9.4, hours: 45.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #fbbf24, #b45309)",
    description: "开着大卡车在欧洲公路上送货的模拟游戏，极致休闲放松。", tags: ["卡车", "驾驶", "休闲"]
  },
  {
    id: 20, title: "过山车之星", platform: "PC", genre: "模拟", year: 2016, rating: 9.1, hours: 11.9, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #a855f7, #7e22ce)",
    description: "极具深度的游乐园建造模拟游戏，发挥创意打造你的梦幻乐园。", tags: ["建造", "模拟", "经营"]
  },
  {
    id: 21, title: "动物迷城", platform: "PC", genre: "RPG", year: 2023, rating: 8.7, hours: 7.2, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #fb923c, #c2410c)",
    description: "扮演动物在监狱中生存并谋划越狱的CRPG，剧情和玩法都很扎实。", tags: ["越狱", "剧情", "国产"]
  },

  // ===== 生存、合作与独立 =====
  {
    id: 22, title: "木筏求生 (Raft)", platform: "PC", genre: "独立", year: 2022, rating: 8.8, hours: 32.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #22d3ee, #164e63)",
    description: "在大海上漂流收集垃圾扩建木筏的生存游戏，支持多人合作。", tags: ["生存", "海上", "合作"]
  },
  {
    id: 23, title: "森林 (The Forest)", platform: "PC", genre: "独立", year: 2018, rating: 8.9, hours: 25.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #16a34a, #14532d)",
    description: "荒岛生存恐怖游戏，不仅要填饱肚子，还要面对地下洞穴里的变异野人。", tags: ["生存", "恐怖", "建造"]
  },
  {
    id: 24, title: "恐鬼症 (Phasmophobia)", platform: "PC", genre: "独立", year: 2020, rating: 8.6, hours: 18.0, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #475569, #0f172a)",
    description: "四人合作抓鬼游戏，依靠各种设备收集证据，极具沉浸感的恐怖体验。", tags: ["恐怖", "抓鬼", "合作"]
  },
  {
    id: 25, title: "无人深空", platform: "PC", genre: "独立", year: 2016, rating: 8.5, hours: 12.3, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    description: "拥有近乎无限星球的太空探索生存游戏，历经更新口碑逆袭。", tags: ["太空", "探索", "生存"]
  },
  {
    id: 26, title: "双人成行", platform: "PC", genre: "动作", year: 2021, rating: 9.6, hours: 11.8, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #f472b6, #ec4899)",
    description: "必须双人合作的冒险解谜游戏，创意拉满，关卡设计极其出色。", tags: ["双人", "合作", "解谜"]
  },
  {
    id: 27, title: "PEAK", platform: "PC", genre: "独立", year: 2024, rating: 8.8, hours: 11.1, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #6366f1, #4338ca)",
    description: "需要团队紧密配合的攀岩登山游戏，一不小心就会跌落悬崖。", tags: ["爬山", "合作", "受苦"]
  },
  {
    id: 28, title: "人类一败涂地", platform: "PC", genre: "独立", year: 2016, rating: 8.9, hours: 4.1, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #cbd5e1, #94a3b8)",
    description: "基于物理引擎的解谜游戏，软绵绵的小人带来爆笑的联机体验。", tags: ["解谜", "物理", "搞笑"]
  },
  {
    id: 29, title: "星露谷物语", platform: "PC", genre: "模拟", year: 2016, rating: 9.8, hours: 1.2, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #84cc16, #4d7c0f)",
    description: "像素风农场经营游戏，种田、钓鱼、挖矿、和镇民交朋友。", tags: ["种田", "经营", "休闲"]
  },
  {
    id: 30, title: "泰拉瑞亚", platform: "PC", genre: "独立", year: 2011, rating: 9.7, hours: 6.5, isPlayed: true, isFavorite: false,
    cover: "linear-gradient(135deg, #22c55e, #15803d)",
    description: "2D像素沙盒生存神作，极高的自由度，建造、探索、打Boss。", tags: ["沙盒", "生存", "像素"]
  },
  {
    id: 31, title: "最后生还者1", platform: "PC", genre: "动作", year: 2023, rating: 9.5, hours: 15.1, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #10b981, #047857)",
    description: "剧情向末日生存神作，乔尔与艾莉的旅程令人动容。", tags: ["末日", "生存", "剧情"]
  },
  {
    id: 32, title: "最后生还者2", platform: "PC", genre: "动作", year: 2024, rating: 9.3, hours: 0, isPlayed: true, isFavorite: true,
    cover: "linear-gradient(135deg, #64748b, #1e293b)",
    description: "续作展现了更为残酷的末日世界，极具争议但也极其优秀的叙事与战斗体验。", tags: ["末日", "生存", "剧情"]
  }
];