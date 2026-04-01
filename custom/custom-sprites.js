#!/usr/bin/env node

/**
 * Claude Code Buddy 自定义 ASCII 精灵模板
 *
 * 本文件包含多个卡通角色的 ASCII 精灵模板,
 * 你可以用这些模板替换 Claude Code 源码中的 sprites.ts,
 * 或者作为灵感创建自己的宠物精灵。
 *
 * 精灵规则:
 * - 每个精灵 5 行高, 12 字符宽
 * - {E} 占位符会被替换为眼睛字符 (·/✦/×/◉/@/°)
 * - 需要 3 帧动画 (idle fidget)
 * - 第 0 行是帽子槽 (留空则可以戴帽子)
 */

const CUSTOM_SPRITES = {
  doraemon: {
    name: '哆啦A梦',
    description: '来自22世纪的猫型机器人, 最爱铜锣烧!',
    frames: [
      [
        '            ',
        '  .------. ',
        ' ( {E}  {E}  )',
        ' (  ●__  ) ',
        '  `------´ ',
      ],
      [
        '            ',
        '  .------. ',
        ' ( {E}  {E}  )',
        ' (  ●__  ) ',
        '  `------´~',
      ],
      [
        '    ♪       ',
        '  .------. ',
        ' ( {E}  -  )',
        ' (  ●__  ) ',
        '  `------´ ',
      ],
    ],
    face: (eye) => `(${eye}●${eye})`,
    suggestedPersonality: '从四次元口袋里掏出代码片段, 最讨厌老鼠(和内存泄漏)',
  },

  pikachu: {
    name: '皮卡丘',
    description: '会放电的黄色小精灵, 皮卡~皮卡~',
    frames: [
      [
        '            ',
        '  /|    |\\  ',
        ' ( {E}  {E}  )',
        '  ( <> )   ',
        '   `--´    ',
      ],
      [
        '            ',
        '  /|    |\\  ',
        ' ( {E}  {E}  )',
        '  ( <> )   ',
        '   `--´ ⚡ ',
      ],
      [
        '   ⚡  ⚡   ',
        '  /|    |\\  ',
        ' ( {E}  {E}  )',
        '  ( <> )   ',
        '   `--´    ',
      ],
    ],
    face: (eye) => `⚡${eye}${eye}⚡`,
    suggestedPersonality: '对写得好的代码放出赞许的电流, 对bug释放十万伏特',
  },

  totoro: {
    name: '龙猫',
    description: '只有纯真的人才能看到的森林精灵',
    frames: [
      [
        '            ',
        '  /\\    /\\  ',
        ' (  {E}  {E} )',
        ' ( `VVV´ ) ',
        '  `------´ ',
      ],
      [
        '            ',
        '  /\\    /\\  ',
        ' (  {E}  {E} )',
        ' ( `VVV´ ) ',
        '  `------´~',
      ],
      [
        '    zzZ     ',
        '  /\\    /\\  ',
        ' (  -  -  ) ',
        ' ( `VVV´ ) ',
        '  `------´ ',
      ],
    ],
    face: (eye) => `(${eye}V${eye})`,
    suggestedPersonality: '在你的代码森林里安静地守护, 偶尔打个雷让你重新审视架构',
  },

  kirby: {
    name: '卡比',
    description: '粉色的吸入大师, 会吸收一切(包括bug)',
    frames: [
      [
        '            ',
        '   .----.   ',
        '  ( {E}  {E} )',
        '  (  __  )  ',
        '  d`----´b  ',
      ],
      [
        '            ',
        '   .----.   ',
        '  ( {E}  {E} )',
        '  (  O   )  ',
        '  d`----´b  ',
      ],
      [
        '     ★      ',
        '   .----.   ',
        '  ( {E}  {E} )',
        '  (  __  )  ',
        '  d`----´b  ',
      ],
    ],
    face: (eye) => `(${eye}__${eye})`,
    suggestedPersonality: '吸入你的bug然后变成debug大师, 但偶尔会不小心把好代码也吞掉',
  },

  snoopy: {
    name: '史努比',
    description: '世界上最有名的小猎犬, 喜欢趴在狗屋上思考人生',
    frames: [
      [
        '            ',
        '    __      ',
        '  ({E} )__   ',
        '  (    )    ',
        '  _)  (_    ',
      ],
      [
        '            ',
        '    __      ',
        '  ({E} )__   ',
        '  (  ~ )    ',
        '  _)  (_    ',
      ],
      [
        '    ♪       ',
        '    __      ',
        '  ({E} )__   ',
        '  (    )    ',
        '  _)  (_~   ',
      ],
    ],
    face: (eye) => `(${eye})`,
    suggestedPersonality: '趴在终端上方思考存在主义哲学, 偶尔给代码写一篇黑暗风小说评论',
  },

  hellokitty: {
    name: 'Hello Kitty',
    description: '没有嘴巴的白色小猫, 但总能表达心意',
    frames: [
      [
        '            ',
        '  /\\ . /\\   ',
        ' ( {E}   {E} ) ',
        ' (       )  ',
        '  `-----´   ',
      ],
      [
        '            ',
        '  /\\ . /\\   ',
        ' ( {E}   {E} ) ',
        ' (   ♡   )  ',
        '  `-----´   ',
      ],
      [
        '    ❀       ',
        '  /\\ . /\\   ',
        ' ( {E}   {E} ) ',
        ' (       )  ',
        '  `-----´   ',
      ],
    ],
    face: (eye) => `(${eye} ${eye})`,
    suggestedPersonality: '用蝴蝶结装饰你的代码注释, 无声地表达对良好命名规范的赞赏',
  },
};

function renderSprite(sprite, eye, frame) {
  return sprite.frames[frame % sprite.frames.length]
    .map(line => line.replaceAll('{E}', eye))
    .join('\n');
}

function showAllSprites() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Claude Code Buddy 自定义精灵模板                     ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  for (const [key, sprite] of Object.entries(CUSTOM_SPRITES)) {
    console.log(`━━━ ${sprite.name} (${key}) ━━━`);
    console.log(`${sprite.description}\n`);

    for (let f = 0; f < 3; f++) {
      console.log(`帧 ${f + 1}:`);
      console.log(renderSprite(sprite, '·', f));
      console.log('');
    }

    console.log(`窄屏表情: ${sprite.face('·')}`);
    console.log(`推荐个性: "${sprite.suggestedPersonality}"`);
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('如何使用这些精灵:');
  console.log('');
  console.log('方法1: 修改 ~/.claude.json 的 companion.name 和 personality');
  console.log('  (只能修改名字和个性, 不能改变 ASCII 精灵)');
  console.log('');
  console.log('方法2: 修改 Claude Code 源码中的 sprites.ts');
  console.log('  1. 找到 Claude Code 安装目录');
  console.log('  2. 修改 src/buddy/sprites.ts 中的 BODIES 对象');
  console.log('  3. 将你喜欢的精灵替换对应物种的帧数据');
  console.log('  4. 重启 Claude Code');
  console.log('');
  console.log('方法3: 使用社区桌面宠物项目');
  console.log('  scm1400/claude-pet 支持自定义皮肤上传');
  console.log('═══════════════════════════════════════════════════════');
}

if (require.main === module) {
  showAllSprites();
}

module.exports = { CUSTOM_SPRITES, renderSprite };
