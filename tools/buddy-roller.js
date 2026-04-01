#!/usr/bin/env node

/**
 * Claude Code Buddy Roller - 暴力破解传说级/闪光宠物UUID工具
 *
 * 原理: 复现 Claude Code 的 Mulberry32 + FNV-1a 算法,
 * 遍历 2^32 种子空间找到匹配指定条件的种子,
 * 然后生成对应的 v4 UUID。
 *
 * 用法:
 *   node buddy-roller.js --rarity legendary --shiny
 *   node buddy-roller.js --rarity legendary --species cat --hat wizard
 *   node buddy-roller.js --rarity legendary --shiny --min-stat 90
 *   node buddy-roller.js --check <uuid>
 */

const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const RARITY_WEIGHTS = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 };
const SPECIES = [
  'duck', 'goose', 'blob', 'cat', 'dragon', 'octopus', 'owl', 'penguin',
  'turtle', 'snail', 'ghost', 'axolotl', 'capybara', 'cactus', 'robot',
  'rabbit', 'mushroom', 'chonk'
];
const EYES = ['·', '✦', '×', '◉', '@', '°'];
const HATS = ['none', 'crown', 'tophat', 'propeller', 'halo', 'wizard', 'beanie', 'tinyduck'];
const STAT_NAMES = ['DEBUGGING', 'PATIENCE', 'CHAOS', 'WISDOM', 'SNARK'];
const SALT = 'friend-2026-401';
const RARITY_FLOOR = { common: 5, uncommon: 15, rare: 25, epic: 35, legendary: 50 };

const RARITY_STARS = {
  common: '★', uncommon: '★★', rare: '★★★', epic: '★★★★', legendary: '★★★★★'
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function rollRarity(rng) {
  const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (const rarity of RARITIES) {
    roll -= RARITY_WEIGHTS[rarity];
    if (roll < 0) return rarity;
  }
  return 'common';
}

function rollStats(rng, rarity) {
  const floor = RARITY_FLOOR[rarity];
  const peak = pick(rng, STAT_NAMES);
  let dump = pick(rng, STAT_NAMES);
  while (dump === peak) dump = pick(rng, STAT_NAMES);

  const stats = {};
  for (const name of STAT_NAMES) {
    if (name === peak) {
      stats[name] = Math.min(100, floor + 50 + Math.floor(rng() * 30));
    } else if (name === dump) {
      stats[name] = Math.max(1, floor - 10 + Math.floor(rng() * 15));
    } else {
      stats[name] = floor + Math.floor(rng() * 40);
    }
  }
  return stats;
}

function rollFromSeed(seed) {
  const rng = mulberry32(seed);
  const rarity = rollRarity(rng);
  const species = pick(rng, SPECIES);
  const eye = pick(rng, EYES);
  const hat = rarity === 'common' ? 'none' : pick(rng, HATS);
  const shiny = rng() < 0.01;
  const stats = rollStats(rng, rarity);
  return { rarity, species, eye, hat, shiny, stats };
}

function rollFromString(userId) {
  const key = userId + SALT;
  const seed = hashString(key);
  return { ...rollFromSeed(seed), seed, userId };
}

function generateRandomUUID() {
  const hex = '0123456789abcdef';
  let uuid = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4';
    } else if (i === 19) {
      uuid += hex[Math.floor(Math.random() * 4) + 8];
    } else {
      uuid += hex[Math.floor(Math.random() * 16)];
    }
  }
  return uuid;
}

function formatBuddy(result) {
  const lines = [];
  lines.push(`  物种: ${result.species}`);
  lines.push(`  稀有度: ${RARITY_STARS[result.rarity]} ${result.rarity}`);
  lines.push(`  眼睛: ${result.eye}`);
  lines.push(`  帽子: ${result.hat}`);
  lines.push(`  闪光: ${result.shiny ? '✦ YES!' : 'No'}`);
  lines.push('  属性:');
  for (const [name, value] of Object.entries(result.stats)) {
    const bar = '▓'.repeat(Math.floor(value / 5)) + '░'.repeat(20 - Math.floor(value / 5));
    const marker = value >= 90 ? ' 🔥' : value === 100 ? ' 💯' : '';
    lines.push(`    ${name.padEnd(10)} ${String(value).padStart(3)} ${bar}${marker}`);
  }
  if (result.userId) lines.push(`  UUID: ${result.userId}`);
  return lines.join('\n');
}

function parseArgs(args) {
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--rarity') opts.rarity = args[++i];
    else if (args[i] === '--species') opts.species = args[++i];
    else if (args[i] === '--eye') opts.eye = args[++i];
    else if (args[i] === '--hat') opts.hat = args[++i];
    else if (args[i] === '--shiny') opts.shiny = true;
    else if (args[i] === '--min-stat') opts.minStat = parseInt(args[++i]);
    else if (args[i] === '--limit') opts.limit = parseInt(args[++i]);
    else if (args[i] === '--check') opts.check = args[++i];
    else if (args[i] === '--help' || args[i] === '-h') opts.help = true;
  }
  return opts;
}

function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════════╗
║   Claude Code Buddy Roller - 一键爆金工具            ║
╚══════════════════════════════════════════════════════╝

用法:
  node buddy-roller.js [选项]

选项:
  --check <uuid>     查看指定UUID的宠物信息
  --rarity <r>       筛选稀有度 (common/uncommon/rare/epic/legendary)
  --species <s>      筛选物种 (duck/cat/dragon/owl/...)
  --eye <e>          筛选眼睛 (·/✦/×/◉/@/°)
  --hat <h>          筛选帽子 (crown/wizard/halo/...)
  --shiny            只搜索闪光宠物
  --min-stat <n>     要求至少一项属性 >= n
  --limit <n>        最多输出n个结果 (默认: 10)
  --help, -h         显示帮助

示例:
  node buddy-roller.js --check my-uuid-here
  node buddy-roller.js --rarity legendary --shiny
  node buddy-roller.js --rarity legendary --species cat --hat wizard
  node buddy-roller.js --rarity epic --min-stat 90 --limit 5

物种列表:
  ${SPECIES.join(', ')}

眼睛列表:
  ${EYES.join('  ')}

帽子列表:
  ${HATS.join(', ')}
`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    showHelp();
    return;
  }

  if (opts.check) {
    console.log('\n🔍 查看宠物信息...\n');
    const result = rollFromString(opts.check);
    console.log(formatBuddy(result));
    console.log('');
    return;
  }

  const limit = opts.limit || 10;
  const results = [];

  console.log('\n🎰 开始搜索匹配的宠物...');
  console.log(`条件: ${JSON.stringify(opts, null, 0)}\n`);

  const startTime = Date.now();
  const maxAttempts = 5000000;
  let attempts = 0;

  while (results.length < limit && attempts < maxAttempts) {
    attempts++;
    const uuid = generateRandomUUID();
    const result = rollFromString(uuid);

    if (opts.rarity && result.rarity !== opts.rarity) continue;
    if (opts.species && result.species !== opts.species) continue;
    if (opts.eye && result.eye !== opts.eye) continue;
    if (opts.hat && result.hat !== opts.hat) continue;
    if (opts.shiny && !result.shiny) continue;
    if (opts.minStat) {
      const maxStat = Math.max(...Object.values(result.stats));
      if (maxStat < opts.minStat) continue;
    }

    results.push(result);
    console.log(`✨ 找到 #${results.length}:`);
    console.log(formatBuddy(result));
    console.log('');
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n📊 搜索完成！`);
  console.log(`   尝试次数: ${attempts.toLocaleString()}`);
  console.log(`   找到数量: ${results.length}`);
  console.log(`   耗时: ${elapsed}s`);

  if (results.length > 0) {
    console.log('\n💡 使用方法:');
    console.log('   1. 编辑 ~/.claude.json');
    console.log('   2. 将 oauthAccount.accountUuid 修改为上面的 UUID');
    console.log('   3. 删除 companion 字段');
    console.log('   4. 重启 Claude Code, 输入 /buddy hatch');
    console.log('\n   或使用一键脚本:');
    console.log(`   bash tools/quick-swap.sh ${results[0].userId}`);
  } else {
    console.log('\n😅 未找到匹配的宠物, 请尝试放宽条件或增加 --limit');
  }
}

main();
