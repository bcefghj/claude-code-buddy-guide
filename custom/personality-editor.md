# 自定义宠物性格编辑指南

> 虽然宠物的外观（物种、稀有度、眼睛、帽子）由你的 accountUuid 决定且无法通过配置文件修改，
> 但你可以**完全自定义**宠物的名字和个性！

---

## 快速开始

### 第一步：找到配置文件

```bash
# macOS / Linux
open ~/.claude.json

# Windows
notepad %USERPROFILE%\.claude.json
```

### 第二步：编辑 companion 字段

在配置文件中找到（或添加）`companion` 字段：

```json
{
  "companion": {
    "name": "你的宠物名字",
    "personality": "你想要的宠物个性描述",
    "hatchedAt": 1743465600000
  }
}
```

### 第三步：重启 Claude Code

保存文件后重启 Claude Code，你的宠物就会使用新的名字和个性。

---

## 字段说明

### name（名字）

- **限制**：最多 12 个字符
- **建议**：用一个单词，有趣、略带荒诞
- **官方风格**：Pith, Dusker, Crumb, Brogue, Sprocket

**中文示例**：
```json
"name": "铜锣烧"
```

**有趣英文示例**：
```json
"name": "Glitch"
```

### personality（个性）

- **限制**：一句话描述
- **内容**：应该是一个具体的编程相关怪癖，影响宠物如何评论你的代码
- **稀有度越高**：个性应该越奇怪、越独特

**示例**：

```json
"personality": "坚持认为每个变量名都应该和上面那个押韵。"
```

```json
"personality": "从四次元口袋里掏出代码片段，最讨厌老鼠（和内存泄漏）。"
```

```json
"personality": "对超过三行的函数表示深深的忧虑，会在气泡里画出复杂度曲线。"
```

```json
"personality": "认为所有代码都应该用诗歌的形式书写，特别欣赏有韵律的命名。"
```

### hatchedAt（孵化时间）

- **格式**：Unix 时间戳（毫秒）
- **作用**：记录宠物首次孵化的时间
- **提示**：可以设为任意时间，比如你的生日

```javascript
// 获取当前时间戳
Date.now()
// 示例: 1743465600000 = 2025-04-01 00:00:00 UTC
```

---

## 主题化个性模板

### 哆啦A梦主题

```json
{
  "companion": {
    "name": "哆啦A梦",
    "personality": "从四次元口袋里掏出代码片段，最讨厌老鼠（和内存泄漏）。经常用竹蜻蜓飞到代码的高层架构去查看全局。"
  }
}
```

### 海贼王主题

```json
{
  "companion": {
    "name": "乔巴",
    "personality": "看到好代码会害羞地说'你夸我也不会高兴的混蛋'，同时开心地扭来扭去。能诊断代码中的各种疾病。"
  }
}
```

### 火影忍者主题

```json
{
  "companion": {
    "name": "鸣人",
    "personality": "永不放弃debug的忍道！会用影分身之术同时审查多个文件，但偶尔分身会引入新bug。"
  }
}
```

### 宝可梦主题

```json
{
  "companion": {
    "name": "皮卡丘",
    "personality": "对写得好的代码放出赞许的电流（pikaaa~），对bug释放十万伏特。拒绝进化为雷丘因为'simple is better'。"
  }
}
```

### 程序员文化主题

```json
{
  "companion": {
    "name": "Segfault",
    "personality": "在你访问空指针时发出刺耳的尖叫，但对优雅的错误处理报以满意的呼噜声。"
  }
}
```

```json
{
  "companion": {
    "name": "NullPtr",
    "personality": "坚持认为所有变量在使用前都必须初始化，否则会用空洞的眼神盯着你看。"
  }
}
```

```json
{
  "companion": {
    "name": "GitBlame",
    "personality": "总是能准确指出是谁在三年前写了那行有问题的代码，并带着审判的语气朗读提交信息。"
  }
}
```

---

## 官方名字生成机制

Claude Code 内部使用以下系统提示来生成宠物名字和个性：

```
你生成编程伴侣 —— 住在开发者终端里、偶尔评论代码的小生物。

给定稀有度、物种、属性和几个灵感词，创造：

- 名字：一个单词，最多12个字符。好记、略带荒诞。
  不要称号，不要"the X"，不要修饰语。
  想象宠物名字，不是NPC名字。
  示例：Pith, Dusker, Crumb, Brogue, Sprocket。

- 一句话个性（具体、有趣、一个会影响它如何评论代码的怪癖
  —— 应该与属性一致）

稀有度越高 = 越奇怪、越具体、越难忘。
传说级应该是真正的奇异。
不要重复 —— 每个伴侣都应该感觉独特。
```

### 灵感词库（156个）

系统会从以下词库中随机选取4个"灵感词"来辅助生成：

```
thunder, biscuit, void, accordion, moss, velvet, rust, pickle, crumb,
whisper, gravy, frost, ember, soup, marble, thorn, honey, static,
copper, dusk, sprocket, bramble, cinder, wobble, drizzle, flint,
tinsel, murmur, clatter, gloom, nectar, quartz, shingle, tremor,
umber, waffle, zephyr, bristle, dapple, fennel, gristle, huddle,
kettle, lumen, mottle, nuzzle, pebble, quiver, ripple, sable,
thistle, vellum, wicker, yonder, bauble, cobble, doily, fickle,
gambit, hubris, jostle, knoll, larder, mantle, nimbus, oracle,
plinth, quorum, relic, spindle, trellis, urchin, vortex, warble,
xenon, yoke, zenith, alcove, brogue, chisel, dirge, epoch, fathom,
glint, hearth, inkwell, jetsam, kiln, lattice, mirth, nook, obelisk,
parsnip, quill, rune, sconce, tallow, umbra, verve, wisp, yawn,
apex, brine, crag, dregs, etch, flume, gable, husk, ingot, jamb,
knurl, loam, mote, nacre, ogle, prong, quip, rind, slat, tuft,
vane, welt, yarn, bane, clove, dross, eave, fern, grit, hive,
jade, keel, lilt, muse, nape, omen, pith, rook, silt, tome,
urge, vex, wane, yew, zest
```

### 默认名字（API失败时的后备）

如果AI生成失败，系统会随机使用以下6个名字之一：
- **Crumpet**（松饼）
- **Soup**（汤）
- **Pickle**（泡菜）
- **Biscuit**（饼干）
- **Moth**（飞蛾）
- **Gravy**（肉汁）

---

## 高级技巧

### 让宠物保持安静

如果你不想让宠物在对话中发言，可以在 Claude Code 的设置中调整（宠物气泡可以静音）。

### 结合 God Roll 使用

1. 先用 `tools/buddy-roller.js` 找到你喜欢的外观组合的 UUID
2. 用 `tools/quick-swap.sh` 切换到该 UUID
3. 在 `~/.claude.json` 中自定义名字和个性
4. 重启 Claude Code，输入 `/buddy hatch`

这样你就拥有了一只外观和内在都完全自定义的宠物！
