#!/usr/bin/env node

/**
 * Claude Code Buddy 自定义 ASCII 精灵模板
 *
 * 包含 15+ 种卡通角色/动物的 ASCII 精灵模板。
 *
 * 精灵规则:
 * - 每个精灵 5 行高, 12 字符宽
 * - {E} 占位符会被替换为眼睛字符 (·/✦/×/◉/@/°)
 * - 需要 3 帧动画 (idle fidget)
 * - 第 0 行是帽子槽 (留空则可以戴帽子)
 */

const CUSTOM_SPRITES = {

  // ═══ 卡通人物 ═══

  doraemon: {
    name: '哆啦A梦',
    category: '卡通人物',
    frames: [
      ['            ','  .------. ',' ( {E}  {E}  )',' (  ●__  ) ','  `------´ '],
      ['            ','  .------. ',' ( {E}  {E}  )',' (  ●__  ) ','  `------´~'],
      ['    ♪       ','  .------. ',' ( {E}  -  )',' (  ●__  ) ','  `------´ '],
    ],
    face: (e) => `(${e}●${e})`,
    personality: '从四次元口袋里掏出代码片段, 最讨厌老鼠(和内存泄漏)',
  },

  pikachu: {
    name: '皮卡丘',
    category: '卡通人物',
    frames: [
      ['            ','  /|    |\\  ',' ( {E}  {E}  )','  ( <> )   ','   `--´    '],
      ['            ','  /|    |\\  ',' ( {E}  {E}  )','  ( <> )   ','   `--´ ⚡ '],
      ['   ⚡  ⚡   ','  /|    |\\  ',' ( {E}  {E}  )','  ( <> )   ','   `--´    '],
    ],
    face: (e) => `⚡${e}${e}⚡`,
    personality: '对写得好的代码放出赞许的电流, 对bug释放十万伏特',
  },

  totoro: {
    name: '龙猫',
    category: '卡通人物',
    frames: [
      ['            ','  /\\    /\\  ',' (  {E}  {E} )',' ( `VVV´ ) ','  `------´ '],
      ['            ','  /\\    /\\  ',' (  {E}  {E} )',' ( `VVV´ ) ','  `------´~'],
      ['    zzZ     ','  /\\    /\\  ',' (  -  -  ) ',' ( `VVV´ ) ','  `------´ '],
    ],
    face: (e) => `(${e}V${e})`,
    personality: '在你的代码森林里安静地守护, 偶尔打个雷让你重新审视架构',
  },

  kirby: {
    name: '卡比',
    category: '卡通人物',
    frames: [
      ['            ','   .----.   ','  ( {E}  {E} )','  (  __  )  ','  d`----´b  '],
      ['            ','   .----.   ','  ( {E}  {E} )','  (  O   )  ','  d`----´b  '],
      ['     ★      ','   .----.   ','  ( {E}  {E} )','  (  __  )  ','  d`----´b  '],
    ],
    face: (e) => `(${e}__${e})`,
    personality: '吸入你的bug然后变成debug大师, 偶尔会不小心把好代码也吞掉',
  },

  snoopy: {
    name: '史努比',
    category: '卡通人物',
    frames: [
      ['            ','    __      ','  ({E} )__   ','  (    )    ','  _)  (_    '],
      ['            ','    __      ','  ({E} )__   ','  (  ~ )    ','  _)  (_    '],
      ['    ♪       ','    __      ','  ({E} )__   ','  (    )    ','  _)  (_~   '],
    ],
    face: (e) => `(${e})`,
    personality: '趴在终端上方思考存在主义, 偶尔给代码写一篇黑暗风小说评论',
  },

  hellokitty: {
    name: 'Hello Kitty',
    category: '卡通人物',
    frames: [
      ['            ','  /\\ . /\\   ',' ( {E}   {E} ) ',' (       )  ','  `-----´   '],
      ['            ','  /\\ . /\\   ',' ( {E}   {E} ) ',' (   ♡   )  ','  `-----´   '],
      ['    ❀       ','  /\\ . /\\   ',' ( {E}   {E} ) ',' (       )  ','  `-----´   '],
    ],
    face: (e) => `(${e} ${e})`,
    personality: '用蝴蝶结装饰你的代码注释, 无声地表达对良好命名规范的赞赏',
  },

  // ═══ 动物系列 ═══

  shiba: {
    name: '柴犬',
    category: '动物',
    frames: [
      ['            ','  /|    |\\  ',' ( {E} ω {E} )','  (    )    ','   \\__/~    '],
      ['            ','  /|    |\\  ',' ( {E} ω {E} )','  ( .. )    ','   \\__/     '],
      ['    wow     ','  /|    |\\  ',' ( {E} ω {E} )','  (    )    ','   \\__/~    '],
    ],
    face: (e) => `(${e}ω${e})`,
    personality: 'such code, much debug, very compile, wow',
  },

  panda: {
    name: '熊猫',
    category: '动物',
    frames: [
      ['            ','  /◐    ◑\\  ',' ( {E}  {E}  )','  ( ──  )   ','  `------´  '],
      ['            ','  /◐    ◑\\  ',' ( {E}  {E}  )','  ( ── ~)   ','  `------´  '],
      ['    🎋      ','  /◐    ◑\\  ',' ( {E}  -  )','  ( ──  )   ','  `------´  '],
    ],
    face: (e) => `◐${e}${e}◑`,
    personality: '一边啃竹子一边审查代码, 动作缓慢但发现bug极其精准',
  },

  unicorn: {
    name: '独角兽',
    category: '动物',
    frames: [
      ['            ','   ∆  ___   ','  ( {E}  {E} )','  ( .◡. )  ','  `------´  '],
      ['            ','   ∆  ___   ','  ( {E}  {E} )','  ( .◡. )  ','  `------´~ '],
      ['    ✧  ✧    ','   ∆  ___   ','  ( {E}  {E} )','  ( .◡. )  ','  `------´  '],
    ],
    face: (e) => `∆${e}◡${e}`,
    personality: '只出现在零bug的代码面前, 用彩虹光标记优雅的算法',
  },

  fox: {
    name: '狐狸',
    category: '动物',
    frames: [
      ['            ','  /\\    /\\  ',' ( {E}  {E}  )',' (  w   )   ','  `---´~~   '],
      ['            ','  /\\    /\\  ',' ( {E}  {E}  )',' (  w   )   ','  `---´~    '],
      ['            ','  /\\    /\\  ',' ( {E}  -  )',' (  w   )   ','  `---´~~   '],
    ],
    face: (e) => `(${e}w${e})`,
    personality: '狡猾地找出你代码中隐藏的边界条件, 尾巴会在发现问题时竖起来',
  },

  sloth: {
    name: '树懒',
    category: '动物',
    frames: [
      ['            ','   .----.   ',' ( {E} _ {E} )','  ( --- )   ','  \\|  |/    '],
      ['            ','   .----.   ',' ( {E} _ {E} )','  ( --- )   ','   |  |     '],
      ['   z z z    ','   .----.   ',' ( -  -  )','  ( --- )   ','  \\|  |/    '],
    ],
    face: (e) => `(${e}_${e})`,
    personality: '用极其缓慢但深思熟虑的方式审查每一行代码, 从不着急',
  },

  whale: {
    name: '鲸鱼',
    category: '动物',
    frames: [
      ['            ','   .-----.  ',' (  {E}  {E} )','  (      )  ',' ~~~\\__/~~~ '],
      ['   ~  ~     ','   .-----.  ',' (  {E}  {E} )','  (      )  ',' ~~\\__/~~~  '],
      ['     💧     ','   .-----.  ',' (  {E}  {E} )','  (      )  ',' ~~~\\__/~~~ '],
    ],
    face: (e) => `(${e}  ${e})`,
    personality: '在代码的深海中遨游, 偶尔浮出水面喷出一串有用的日志',
  },

  dino: {
    name: '小恐龙',
    category: '动物',
    frames: [
      ['            ','   .---.    ','  ({E}   )   ','  /|AAA|\\   ','  ` ´ ` ´   '],
      ['            ','   .---.    ','  ({E}   )   ','  /|AAA|\\   ','   ` ` `    '],
      ['   RAWR     ','   .---.    ','  ({E}  O)   ','  /|AAA|\\   ','  ` ´ ` ´   '],
    ],
    face: (e) => `(${e}A${e})`,
    personality: '虽然是恐龙但很害怕deprecated警告, 会对过时的API咆哮',
  },

  alien: {
    name: '外星人',
    category: '科幻',
    frames: [
      ['            ','  .======.  ',' ( {E}    {E} )','  (  ~~  )  ','   \\_  _/   '],
      ['            ','  .======.  ',' ( {E}    {E} )','  (  ~~  )  ','   \\_ _/    '],
      ['   @  @     ','  .======.  ',' ( {E}    {E} )','  (  ~~  )  ','   \\_  _/   '],
    ],
    face: (e) => `(${e}~~${e})`,
    personality: '来自外星的编程语言专家, 认为人类的代码结构太原始了',
  },

  pumpkin: {
    name: '南瓜头',
    category: '万圣节',
    frames: [
      ['            ','   _||_     ','  ({E}VV{E})   ','  (WWWW)    ','   `--´     '],
      ['            ','   _||_     ','  ({E}VV{E})   ','  (MMMM)    ','   `--´     '],
      ['   ~ ~ ~    ','   _||_     ','  ({E}VV{E})   ','  (WWWW)    ','   `--´     '],
    ],
    face: (e) => `${e}VV${e}`,
    personality: '只在万圣节特别活跃, 会用恐怖的方式提醒你未处理的异常',
  },

  // ═══ 额外动物 ═══

  hamster: {
    name: '仓鼠',
    category: '动物',
    frames: [
      ['            ','  (\\  /)    ',' ( {E}  {E}  )','  (◉◉◉◉)   ','   \\  /     '],
      ['            ','  (\\  /)    ',' ( {E}  {E}  )','  (◉◉◉◉)~  ','   \\  /     '],
      ['            ','  (|  /)    ',' ( {E}  {E}  )','  (◉◉◉◉)   ','   \\  /     '],
    ],
    face: (e) => `(${e}◉${e})`,
    personality: '把代码片段存在腮帮子里, 需要的时候掏出来用',
  },

  bear: {
    name: '小熊',
    category: '动物',
    frames: [
      ['            ','  ⊂    ⊃   ',' ( {E}  {E}  )','  ( ── )    ','   \\__/     '],
      ['            ','  ⊂    ⊃   ',' ( {E}  {E}  )','  ( ── )~   ','   \\__/     '],
      ['    ☆       ','  ⊂    ⊃   ',' ( {E}  -  )','  ( ── )    ','   \\__/     '],
    ],
    face: (e) => `ʕ${e}ᴥ${e}ʔ`,
    personality: '看起来憨厚但debug时会露出凶猛的一面, 最爱蜂蜜味的代码',
  },

  butterfly: {
    name: '蝴蝶',
    category: '动物',
    frames: [
      ['            ','  }|  |{    ','  }/{E}{E}\\   ','  \\(  )/    ','   }||{     '],
      ['  }|  |{    ','  }/{E}{E}\\   ','  \\(  )/    ','   }||{     ','            '],
      ['            ','  }|  |{    ','  / {E}{E} \\   ','  \\(  )/    ','   }||{     '],
    ],
    face: (e) => `}${e}${e}{`,
    personality: '在代码花园中翩翩起舞, 专门寻找最美的设计模式',
  },

  penguin2: {
    name: '小企鹅',
    category: '动物',
    frames: [
      ['            ','   .---.    ',' /(  {E}{E} )\\  ','  |    |    ','   `--´     '],
      ['            ','   .---.    ',' /(  {E}{E} )\\  ','  | ~~ |    ','   `--´     '],
      ['   ❄        ','   .---.    ',' /(  {E}{E} )\\  ','  |    |    ','   `--´     '],
    ],
    face: (e) => `(${e}>${e})`,
    personality: '在冰冷的服务器机房里最开心, 对热门框架保持冷静的态度',
  },

  bunny: {
    name: '小白兔',
    category: '动物',
    frames: [
      ['            ','   () ()    ','  ( {E} {E} ) ','  ( .Y. )   ','   `" "´    '],
      ['            ','   () ()    ','  ( {E} {E} ) ','  ( .Y. )   ','   `" "´~   '],
      ['            ','   (| ()    ','  ( {E} {E} ) ','  ( .Y. )   ','   `" "´    '],
    ],
    face: (e) => `(${e}Y${e})`,
    personality: '蹦蹦跳跳地在代码之间穿梭, 对胡萝卜色的语法高亮情有独钟',
  },
};

function renderSprite(sprite, eye, frame) {
  return sprite.frames[frame % sprite.frames.length]
    .map(line => line.replaceAll('{E}', eye))
    .join('\n');
}

function showAllSprites() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Claude Code Buddy 自定义精灵模板 (15种)              ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  const categories = {};
  for (const [key, sprite] of Object.entries(CUSTOM_SPRITES)) {
    const cat = sprite.category || '其他';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push([key, sprite]);
  }

  for (const [cat, entries] of Object.entries(categories)) {
    console.log(`\n═══ ${cat} ═══\n`);
    for (const [key, sprite] of entries) {
      console.log(`--- ${sprite.name} (${key}) ---`);
      console.log(renderSprite(sprite, '·', 0));
      console.log(`  窄屏: ${sprite.face('·')}`);
      console.log(`  个性: "${sprite.personality}"`);
      console.log('');
    }
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('使用方法:');
  console.log('  1. 修改 ~/.claude.json 的 companion.name 和 personality');
  console.log('  2. 或修改 Claude Code 源码中的 sprites.ts');
  console.log('  3. 或使用 scm1400/claude-pet 桌面宠物自定义皮肤');
  console.log('═══════════════════════════════════════════════════════');
}

if (require.main === module) showAllSprites();
module.exports = { CUSTOM_SPRITES, renderSprite };
