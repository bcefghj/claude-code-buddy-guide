#!/bin/bash
# ╔════════════════════════════════════════════════════════════╗
# ║  Claude Code Buddy 一键部署工具 (小白专用)                  ║
# ║  用法: curl -fsSL <raw-url> | bash                         ║
# ║  或:   bash one-click-setup.sh                              ║
# ╚════════════════════════════════════════════════════════════╝

set -e

CONFIG="$HOME/.claude.json"
BACKUP_DIR="$HOME/.claude-buddy-backups"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; PURPLE='\033[0;35m'; CYAN='\033[0;36m'
GOLD='\033[1;33m'; BOLD='\033[1m'; NC='\033[0m'

GOD_ROLLS=(
  "3f6c5f24-86f4-4131-b02b-d8f1dd1c36b8|猫头鹰 Owl|光环 Halo|✦|SNARK 100"
  "575d0192-5eec-4c6c-829c-c2ea74e52d5e|乌龟 Turtle|王冠 Crown|@|SNARK 100"
  "41c9d643-7b7f-49c5-b23d-d07700448db9|鹅 Goose|毛线帽 Beanie|°|DEBUG 100"
  "c104cad9-b477-4794-9a72-0dcc528ec4a4|章鱼 Octopus|无|×|CHAOS 100"
  "4b9afb15-f776-4005-a5ea-81c4f0f5f340|鸭子 Duck|巫师帽 Wizard|◉|CHAOS 100"
  "6b904e07-fd14-44dd-b0bd-861bf40a7c0c|鹅 Goose|巫师帽 Wizard|✦|SNARK 100"
  "9664a3ac-6d0a-4d87-aa3d-c0dce6482cca|蘑菇 Mushroom|无|✦|DEBUG 100"
  "6a1f0a5f-6a6c-4a68-bad3-c7eab61970da|章鱼 Octopus|无|◉|PATIENCE 100"
  "016ad3f9-f7d3-4cb6-a5ef-57d432c8c13d|幽灵 Ghost|巫师帽 Wizard|◉|CHAOS 100"
  "a3a4eac6-edb8-408b-900e-57b120b19ac4|幽灵 Ghost|螺旋桨 Propeller|◉|WISDOM 100"
  "c43e33a6-b046-4979-a168-544f982af407|鹅 Goose|毛线帽 Beanie|@|CHAOS 100"
  "d42f15ca-45b5-40e0-8e67-9de505c2f94e|蘑菇 Mushroom|无|·|SNARK 100"
  "94f690ee-1057-4aa8-830f-a40ba0a128f8|水豚 Capybara|王冠 Crown|◉|SNARK 100"
  "d79ecfd9-ab22-403b-b06e-88d3b01c6294|乌龟 Turtle|光环 Halo|×|PATIENCE 100"
  "417effc7-a0d2-4038-af88-98b01e6d67b0|企鹅 Penguin|小鸭子 Tinyduck|·|PATIENCE 100"
  "bf9c3bee-5aca-44c2-8ccf-ecca27941f8f|水豚 Capybara|巫师帽 Wizard|×|PATIENCE 100"
  "a7b74b5d-383b-4692-9ce8-39ab9c82425e|猫 Cat|光环 Halo|✦|DEBUG 100"
  "27a3c548-ba4f-40b1-8492-44b11160989d|蜗牛 Snail|礼帽 Tophat|×|WISDOM 100"
  "4fa7dba3-e562-4e1f-a79e-d73c46e928fc|机器人 Robot|巫师帽 Wizard|×|CHAOS 100"
  "40c3e579-c951-404c-b423-9103a05f2313|乌龟 Turtle|礼帽 Tophat|✦|CHAOS 100"
)

banner() {
  echo ""
  echo -e "${GOLD}╔══════════════════════════════════════════════════════╗${NC}"
  echo -e "${GOLD}║                                                      ║${NC}"
  echo -e "${GOLD}║   ★★★★★  Claude Code Buddy 一键部署  ★★★★★       ║${NC}"
  echo -e "${GOLD}║          传说级 + 闪光 金色宠物专用               ║${NC}"
  echo -e "${GOLD}║                                                      ║${NC}"
  echo -e "${GOLD}╚══════════════════════════════════════════════════════╝${NC}"
  echo ""
}

check_deps() {
  if ! command -v python3 &>/dev/null; then
    echo -e "${RED}错误: 需要 python3, 请先安装${NC}"
    exit 1
  fi
  if [ ! -f "$CONFIG" ]; then
    echo -e "${RED}错误: 未找到 $CONFIG${NC}"
    echo -e "${YELLOW}请先安装并登录 Claude Code${NC}"
    exit 1
  fi
}

get_current_uuid() {
  python3 -c "
import json
with open('$CONFIG') as f:
    c = json.load(f)
print(c.get('oauthAccount',{}).get('accountUuid', c.get('userID','未找到')))
" 2>/dev/null || echo "无法读取"
}

backup_config() {
  mkdir -p "$BACKUP_DIR"
  local ts=$(date +%Y%m%d_%H%M%S)
  cp "$CONFIG" "$BACKUP_DIR/claude_${ts}.json"
  echo -e "${GREEN}已备份到: $BACKUP_DIR/claude_${ts}.json${NC}"
}

show_current() {
  echo -e "\n${CYAN}════ 当前宠物信息 ════${NC}\n"
  local uuid=$(get_current_uuid)
  echo -e "  账号UUID: ${BOLD}$uuid${NC}"

  python3 << 'PYEOF'
import json, sys

RARITIES = ['common','uncommon','rare','epic','legendary']
RARITY_W = {'common':60,'uncommon':25,'rare':10,'epic':4,'legendary':1}
SPECIES = ['duck','goose','blob','cat','dragon','octopus','owl','penguin',
           'turtle','snail','ghost','axolotl','capybara','cactus','robot',
           'rabbit','mushroom','chonk']
EYES = ['·','✦','×','◉','@','°']
HATS = ['none','crown','tophat','propeller','halo','wizard','beanie','tinyduck']
STATS = ['DEBUGGING','PATIENCE','CHAOS','WISDOM','SNARK']
SALT = 'friend-2026-401'
FLOOR = {'common':5,'uncommon':15,'rare':25,'epic':35,'legendary':50}
STARS = {'common':'★','uncommon':'★★','rare':'★★★','epic':'★★★★','legendary':'★★★★★'}
SPECIES_CN = {'duck':'鸭子','goose':'鹅','blob':'果冻','cat':'猫','dragon':'龙',
  'octopus':'章鱼','owl':'猫头鹰','penguin':'企鹅','turtle':'乌龟','snail':'蜗牛',
  'ghost':'幽灵','axolotl':'六角恐龙','capybara':'水豚','cactus':'仙人掌',
  'robot':'机器人','rabbit':'兔子','mushroom':'蘑菇','chonk':'胖球'}
HATS_CN = {'none':'无','crown':'王冠','tophat':'礼帽','propeller':'螺旋桨',
  'halo':'光环','wizard':'巫师帽','beanie':'毛线帽','tinyduck':'小鸭子'}

def mulberry32(seed):
    a = seed & 0xFFFFFFFF
    def rng():
        nonlocal a
        a = (a + 0x6d2b79f5) & 0xFFFFFFFF
        t = ((a ^ (a >> 15)) * (1 | a)) & 0xFFFFFFFF
        t = (t + (((t ^ (t >> 7)) * (61 | t)) & 0xFFFFFFFF)) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
    return rng

def fnv1a(s):
    h = 2166136261
    for c in s:
        h ^= ord(c)
        h = (h * 16777619) & 0xFFFFFFFF
    return h

def pick(rng, arr):
    import math
    return arr[int(math.floor(rng() * len(arr)))]

def roll(uid):
    import math
    key = uid + SALT
    seed = fnv1a(key)
    rng = mulberry32(seed)
    total = 100; r = rng() * total
    rarity = 'common'
    for ra in RARITIES:
        r -= RARITY_W[ra]
        if r < 0: rarity = ra; break
    species = pick(rng, SPECIES)
    eye = pick(rng, EYES)
    hat = 'none' if rarity == 'common' else pick(rng, HATS)
    shiny = rng() < 0.01
    floor = FLOOR[rarity]
    peak = pick(rng, STATS)
    dump = pick(rng, STATS)
    while dump == peak: dump = pick(rng, STATS)
    stats = {}
    for n in STATS:
        if n == peak: stats[n] = min(100, floor + 50 + int(math.floor(rng()*30)))
        elif n == dump: stats[n] = max(1, floor - 10 + int(math.floor(rng()*15)))
        else: stats[n] = floor + int(math.floor(rng()*40))
    return rarity, species, eye, hat, shiny, stats

try:
    with open('$HOME/.claude.json') as f:
        c = json.load(f)
    uid = c.get('oauthAccount',{}).get('accountUuid', c.get('userID','anon'))
    rarity, species, eye, hat, shiny, stats = roll(uid)
    print(f"  物种: {SPECIES_CN.get(species,species)} ({species})")
    print(f"  稀有度: {STARS[rarity]} {rarity}")
    print(f"  眼睛: {eye}")
    print(f"  帽子: {HATS_CN.get(hat,hat)} ({hat})")
    print(f"  闪光: {'✦ YES!' if shiny else 'No'}")
    print(f"  属性:")
    for k,v in stats.items():
        bar = '▓' * (v // 5) + '░' * (20 - v // 5)
        print(f"    {k:10s} {v:3d} {bar}")
    comp = c.get('companion')
    if comp:
        print(f"\n  名字: {comp.get('name','未命名')}")
        print(f"  个性: {comp.get('personality','无')}")
except Exception as e:
    print(f"  解析失败: {e}")
PYEOF
  echo ""
}

show_god_rolls() {
  echo -e "\n${GOLD}════ 传说级闪光 God Roll 列表 (Top 20) ════${NC}\n"
  local i=1
  for entry in "${GOD_ROLLS[@]}"; do
    IFS='|' read -r uuid species hat eye best <<< "$entry"
    printf "  ${GOLD}#%-2d${NC} %-20s 帽子:%-14s 眼睛:%-2s 最强:%-12s\n" "$i" "$species" "$hat" "$eye" "$best"
    i=$((i+1))
  done
  echo ""
}

apply_god_roll() {
  show_god_rolls
  echo -ne "${CYAN}请输入编号 (1-20): ${NC}"
  read choice
  if [[ ! "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt 20 ]; then
    echo -e "${RED}无效编号${NC}"; return
  fi
  local idx=$((choice-1))
  local entry="${GOD_ROLLS[$idx]}"
  IFS='|' read -r uuid species hat eye best <<< "$entry"

  echo -e "\n${YELLOW}你选择了: #${choice} ${species}${NC}"
  echo -e "  UUID: ${BOLD}$uuid${NC}"
  echo -e "  帽子: $hat  眼睛: $eye  最强: $best"
  echo ""
  echo -ne "${YELLOW}确认替换? (y/n): ${NC}"
  read confirm
  if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "已取消"; return
  fi

  backup_config

  python3 -c "
import json
with open('$CONFIG') as f:
    c = json.load(f)
if 'oauthAccount' not in c:
    c['oauthAccount'] = {}
c['oauthAccount']['accountUuid'] = '$uuid'
if 'companion' in c:
    del c['companion']
with open('$CONFIG','w') as f:
    json.dump(c, f, indent=2)
print('UUID 已更新, companion 已清除')
"

  echo -e "\n${GREEN}══════════════════════════════════════${NC}"
  echo -e "${GREEN}  爆金成功! 你现在拥有传说级闪光宠物!${NC}"
  echo -e "${GREEN}══════════════════════════════════════${NC}"
  echo -e "\n${YELLOW}下一步:${NC}"
  echo "  1. 重启 Claude Code"
  echo "  2. 输入 /buddy hatch 孵化新宠物"
  echo "  3. 输入 /buddy card 查看宠物卡片"
}

customize_pet() {
  echo -e "\n${CYAN}════ 自定义宠物名字和个性 ════${NC}\n"
  echo -ne "  宠物名字 (最多12字符): "
  read pet_name
  echo -ne "  宠物个性 (一句话描述): "
  read pet_personality

  if [ -z "$pet_name" ]; then
    echo -e "${RED}名字不能为空${NC}"; return
  fi

  backup_config

  python3 -c "
import json, time
with open('$CONFIG') as f:
    c = json.load(f)
c['companion'] = {
    'name': '''$pet_name''',
    'personality': '''$pet_personality''',
    'hatchedAt': int(time.time() * 1000)
}
with open('$CONFIG','w') as f:
    json.dump(c, f, indent=2)
print('  宠物信息已更新!')
"
  echo -e "\n${GREEN}  自定义完成! 重启 Claude Code 生效${NC}"
}

restore_config() {
  if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}没有找到备份文件${NC}"; return
  fi
  echo -e "\n${CYAN}════ 可用备份 ════${NC}\n"
  local files=($(ls -t "$BACKUP_DIR"/claude_*.json 2>/dev/null))
  if [ ${#files[@]} -eq 0 ]; then
    echo -e "${RED}没有备份文件${NC}"; return
  fi
  local i=1
  for f in "${files[@]}"; do
    echo "  $i. $(basename "$f")"
    i=$((i+1))
    [ $i -gt 10 ] && break
  done
  echo -ne "\n${CYAN}选择要恢复的备份编号: ${NC}"
  read choice
  if [[ ! "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -ge $i ]; then
    echo -e "${RED}无效编号${NC}"; return
  fi
  local sel="${files[$((choice-1))]}"
  cp "$sel" "$CONFIG"
  echo -e "${GREEN}  已恢复: $(basename "$sel")${NC}"
  echo -e "${YELLOW}  请重启 Claude Code${NC}"
}

main_menu() {
  banner
  check_deps

  while true; do
    echo -e "${BOLD}请选择操作:${NC}\n"
    echo -e "  ${GREEN}1${NC}. 查看当前宠物信息"
    echo -e "  ${GOLD}2${NC}. ${GOLD}一键爆金${NC} - 获得传说级闪光宠物"
    echo -e "  ${CYAN}3${NC}. 自定义宠物名字和个性"
    echo -e "  ${BLUE}4${NC}. 恢复原始配置"
    echo -e "  ${PURPLE}5${NC}. 查看 God Roll 列表"
    echo -e "  ${RED}0${NC}. 退出"
    echo ""
    echo -ne "${CYAN}请输入编号: ${NC}"
    read opt
    case $opt in
      1) show_current ;;
      2) apply_god_roll ;;
      3) customize_pet ;;
      4) restore_config ;;
      5) show_god_rolls ;;
      0) echo -e "${GREEN}再见!${NC}"; exit 0 ;;
      *) echo -e "${RED}无效选项${NC}" ;;
    esac
    echo ""
  done
}

main_menu
