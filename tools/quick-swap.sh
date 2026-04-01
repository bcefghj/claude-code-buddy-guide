#!/bin/bash

# Claude Code Buddy 一键换宠脚本
# 用法: bash quick-swap.sh <新UUID>
# 示例: bash quick-swap.sh 3f6c5f24-86f4-4131-b02b-d8f1dd1c36b8

set -e

CONFIG_FILE="$HOME/.claude.json"
BACKUP_FILE="$HOME/.claude.json.backup.$(date +%Y%m%d_%H%M%S)"

echo "╔══════════════════════════════════════════════╗"
echo "║   Claude Code Buddy 一键换宠脚本              ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

if [ -z "$1" ]; then
    echo "❌ 错误: 请提供新的 UUID"
    echo ""
    echo "用法: bash quick-swap.sh <UUID>"
    echo ""
    echo "推荐 God Roll UUID (传说+闪光):"
    echo "  猫头鹰+光环: 3f6c5f24-86f4-4131-b02b-d8f1dd1c36b8"
    echo "  乌龟+王冠:   575d0192-5eec-4c6c-829c-c2ea74e52d5e"
    echo "  鹅+毛线帽:   41c9d643-7b7f-49c5-b23d-d07700448db9"
    echo "  章鱼:        c104cad9-b477-4794-9a72-0dcc528ec4a4"
    echo "  猫+光环:     a7b74b5d-383b-4692-9ce8-39ab9c82425e"
    echo ""
    echo "完整列表请查看 god-rolls.md"
    exit 1
fi

NEW_UUID="$1"

if ! [[ "$NEW_UUID" =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]]; then
    echo "⚠️  警告: UUID 格式可能不正确 (应为 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)"
    echo "   继续使用: $NEW_UUID"
    echo ""
fi

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ 错误: 未找到配置文件 $CONFIG_FILE"
    echo "   请确认已安装并登录 Claude Code"
    exit 1
fi

echo "📋 步骤 1/4: 备份配置文件..."
cp "$CONFIG_FILE" "$BACKUP_FILE"
echo "   ✅ 已备份到: $BACKUP_FILE"
echo ""

echo "📋 步骤 2/4: 读取当前 UUID..."
CURRENT_UUID=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
uuid = config.get('oauthAccount', {}).get('accountUuid', '未找到')
print(uuid)
" 2>/dev/null || echo "无法读取")
echo "   当前 UUID: $CURRENT_UUID"
echo "   新的 UUID: $NEW_UUID"
echo ""

echo "📋 步骤 3/4: 修改 UUID 并清除旧宠物数据..."
python3 -c "
import json

with open('$CONFIG_FILE') as f:
    config = json.load(f)

if 'oauthAccount' not in config:
    config['oauthAccount'] = {}

config['oauthAccount']['accountUuid'] = '$NEW_UUID'

if 'companion' in config:
    del config['companion']
    print('   ✅ 已清除旧宠物数据 (companion)')

with open('$CONFIG_FILE', 'w') as f:
    json.dump(config, f, indent=2)

print('   ✅ UUID 已更新')
"
echo ""

echo "📋 步骤 4/4: 验证..."
python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
uuid = config.get('oauthAccount', {}).get('accountUuid', '未找到')
has_companion = 'companion' in config
print(f'   UUID: {uuid}')
print(f'   宠物数据: {\"已清除 ✅\" if not has_companion else \"仍存在 ⚠️\"}')
"
echo ""

echo "═══════════════════════════════════════════════"
echo "✅ 换宠完成！"
echo ""
echo "下一步:"
echo "  1. 重启 Claude Code (关闭并重新打开)"
echo "  2. 输入 /buddy hatch 孵化新宠物"
echo "  3. 输入 /buddy card 查看宠物卡片"
echo ""
echo "如需恢复原始配置:"
echo "  cp $BACKUP_FILE $CONFIG_FILE"
echo "═══════════════════════════════════════════════"
