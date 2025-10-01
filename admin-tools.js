// 管理员工具页面逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 初始化游戏状态
    initCoreGame();
    
    // 更新当前等级显示
    updateCurrentLevel();
    
    // 添加所有按钮事件监听
    addDebugEventListeners();
});

// 更新当前等级显示
function updateCurrentLevel() {
    document.getElementById('current-level').textContent = gameState.level;
    document.getElementById('set-level').value = gameState.level;
    document.getElementById('set-realm').value = gameState.realm;
    document.getElementById('set-stage').value = gameState.stage;
}

// 添加所有调试按钮的事件监听
function addDebugEventListeners() {
    // 角色管理
    document.getElementById('debug-level-up').addEventListener('click', debugLevelUp);
    document.getElementById('debug-add-attributes').addEventListener('click', debugAddAttributes);
    document.getElementById('debug-fill-stage').addEventListener('click', debugFillStage);
    document.getElementById('debug-ascend-realm').addEventListener('click', debugAscendRealm);
    document.getElementById('apply-character-settings').addEventListener('click', applyCharacterSettings);
    
    // 物品管理
    document.getElementById('add-common-equip').addEventListener('click', () => addDebugEquipment('common'));
    document.getElementById('add-rare-equip').addEventListener('click', () => addDebugEquipment('rare'));
    document.getElementById('add-epic-equip').addEventListener('click', () => addDebugEquipment('epic'));
    document.getElementById('add-legendary-equip').addEventListener('click', () => addDebugEquipment('legendary'));
    document.getElementById('add-mythic-equip').addEventListener('click', addDebugMythicEquipment);
    document.getElementById('add-breakthrough-item').addEventListener('click', addDebugBreakthroughItem);
    document.getElementById('add-exp-item').addEventListener('click', addDebugExpItem);
    document.getElementById('add-boost-item').addEventListener('click', addDebugBoostItem);
    document.getElementById('add-spell-item').addEventListener('click', addDebugSpellItem);
    document.getElementById('clear-inventory').addEventListener('click', clearInventory);
    
    // 法术管理
    document.getElementById('learn-all-spells').addEventListener('click', learnAllSpells);
    document.getElementById('add-attack-spells').addEventListener('click', addAttackSpells);
    document.getElementById('add-defense-spells').addEventListener('click', addDefenseSpells);
    document.getElementById('add-support-spells').addEventListener('click', addSupportSpells);
    document.getElementById('forget-all-spells').addEventListener('click', forgetAllSpells);
    
    // 战斗管理
    document.getElementById('debug-start-battle').addEventListener('click', debugStartBattle);
    document.getElementById('debug-start-boss-battle').addEventListener('click', debugStartBossBattle);
    document.getElementById('debug-win-battle').addEventListener('click', debugWinBattle);
    document.getElementById('debug-reset-battle-stats').addEventListener('click', debugResetBattleStats);
    
    // 系统管理
    document.getElementById('debug-save-game').addEventListener('click', debugSaveGame);
    document.getElementById('debug-load-game').addEventListener('click', debugLoadGame);
    document.getElementById('debug-reset-game').addEventListener('click', debugResetGame);
    document.getElementById('debug-print-state').addEventListener('click', debugPrintState);
    document.getElementById('export-game-state').addEventListener('click', exportGameState);
    document.getElementById('import-game-state').addEventListener('click', importGameState);
}

// 快速升级
function debugLevelUp() {
    // 直接增加10级
    const levelsToAdd = 10;
    for (let i = 0; i < levelsToAdd; i++) {
        // 填充经验条来升级
        gameState.exp = gameState.expToNextLevel;
        levelUp();
    }
    
    showDebugMessage(`已提升${levelsToAdd}级，当前等级: ${gameState.level}`);
    updateCurrentLevel();
}

// 提升所有属性
function debugAddAttributes() {
    const amount = 20;
    
    gameState.spiritualPower += amount;
    gameState.daoFoundation += amount;
    gameState.soulPower += amount;
    gameState.comprehension += Math.floor(amount / 2);
    gameState.luck += Math.floor(amount / 3);
    
    showDebugMessage(`所有属性提升: 灵气+${amount}, 道基+${amount}, 神魂+${amount}, 悟性+${Math.floor(amount / 2)}, 机缘+${Math.floor(amount / 3)}`);
}

// 填满修炼进度
function debugFillStage() {
    gameState.stageProgress = gameState.stageRequirement;
    checkStageUpCondition();
    
    showDebugMessage(`修炼进度已填满，当前阶段: ${gameState.stage}`);
}

// 突破当前境界
function debugAscendRealm() {
    if (gameState.realm >= realms.length - 1) {
        showDebugMessage("已经是最高境界，无法继续突破", true);
        return;
    }
    
    // 准备突破条件
    const nextRealm = realms[gameState.realm + 1];
    gameState.level = nextRealm.requiredLevel;
    gameState.stage = 10;
    gameState.stageProgress = gameState.stageRequirement;
    gameState.spiritualPower = nextRealm.requiredSpiritual;
    gameState.daoFoundation = nextRealm.requiredDao;
    
    // 添加突破丹
    addItemToInventory({
        name: `${realms[gameState.realm].name}突破丹`,
        type: 'breakthrough',
        realm: gameState.realm,
        description: `用于突破至${nextRealm.name}的丹药`,
        stackable: true
    });
    
    // 执行突破
    performAscend();
    
    showDebugMessage(`已突破至${realms[gameState.realm].name}`);
    updateCurrentLevel();
}

// 应用角色设置
function applyCharacterSettings() {
    const level = parseInt(document.getElementById('set-level').value);
    const realm = parseInt(document.getElementById('set-realm').value);
    const stage = parseInt(document.getElementById('set-stage').value);
    
    if (isNaN(level) || isNaN(realm) || isNaN(stage)) {
        showDebugMessage("请输入有效的数值", true);
        return;
    }
    
    if (level < 1 || level > 999) {
        showDebugMessage("等级必须在1-999之间", true);
        return;
    }
    
    if (realm < 0 || realm >= realms.length) {
        showDebugMessage("请选择有效的境界", true);
        return;
    }
    
    if (stage < 1 || stage > 10) {
        showDebugMessage("阶段必须在1-10之间", true);
        return;
    }
    
    // 应用设置
    gameState.level = level;
    gameState.realm = realm;
    gameState.stage = stage;
    
    // 调整经验值
    gameState.expToNextLevel = Math.floor(100 * Math.pow(1.2, level - 1));
    gameState.exp = Math.floor(gameState.expToNextLevel * 0.5); // 半级经验
    
    // 调整修炼进度
    gameState.stageRequirement = Math.floor(1000 * Math.pow(1.5, stage - 1));
    gameState.stageProgress = Math.floor(gameState.stageRequirement * 0.5); // 一半进度
    
    showDebugMessage(`已应用设置: 等级 ${level}, 境界 ${realms[realm].name}, 阶段 ${stage}`);
    updateCurrentLevel();
    saveGameState();
}

// 添加调试装备
function addDebugEquipment(rarity) {
    const equipment = generateRandomEquipment(rarity);
    addItemToInventory(equipment);
    showDebugMessage(`已添加${getRarityName(rarity)}装备: ${equipment.name}`);
}

// 添加调试神话装备
function addDebugMythicEquipment() {
    const equipment = generateMythicEquipment();
    addItemToInventory(equipment);
    showDebugMessage(`已添加神话装备: ${equipment.name}`);
}

// 添加突破丹
function addDebugBreakthroughItem() {
    const item = {
        name: `${realms[gameState.realm].name}突破丹`,
        type: 'breakthrough',
        realm: gameState.realm,
        description: `用于突破至${realms[gameState.realm + 1]?.name || '下一境界'}的丹药`,
        stackable: true,
        quantity: 5
    };
    
    addItemToInventory(item);
    showDebugMessage(`已添加5颗${item.name}`);
}

// 添加经验道具
function addDebugExpItem() {
    const item = {
        name: "高级经验丹",
        type: 'exp',
        value: 10000,
        description: "使用后获得10000点经验",
        stackable: true,
        usable: true
    };
    
    addItemToInventory(item);
    showDebugMessage(`已添加${item.name}: 使用后获得${item.value}点经验`);
}

// 添加属性道具
function addDebugBoostItem() {
    const attributes = [
        { name: "灵气丹", attribute: "spiritual", value: 50 },
        { name: "道基丹", attribute: "dao", value: 50 },
        { name: "神魂丹", attribute: "soul", value: 50 },
        { name: "悟性丹", attribute: "comprehension", value: 20 },
        { name: "机缘丹", attribute: "luck", value: 10 }
    ];
    
    // 随机选择一种属性道具
    const randomIndex = Math.floor(Math.random() * attributes.length);
    const item = attributes[randomIndex];
    
    addItemToInventory({
        name: item.name,
        type: 'boost',
        attribute: item.attribute,
        value: item.value,
        description: `使用后${item.attribute === 'spiritual' ? '灵气' : 
                      item.attribute === 'dao' ? '道基' :
                      item.attribute === 'soul' ? '神魂' :
                      item.attribute === 'comprehension' ? '悟性' : '机缘'}增加${item.value}点`,
        stackable: true,
        usable: true
    });
    
    showDebugMessage(`已添加${item.name}: ${item.attribute === 'spiritual' ? '灵气' : 
                      item.attribute === 'dao' ? '道基' :
                      item.attribute === 'soul' ? '神魂' :
                      item.attribute === 'comprehension' ? '悟性' : '机缘'}增加${item.value}点`);
}

// 添加法术秘籍
function addDebugSpellItem() {
    const spells = [
        { name: "火球术", spellName: "火球术" },
        { name: "寒冰箭秘籍", spellName: "寒冰箭" },
        { name: "护盾术卷轴", spellName: "护盾术" },
        { name: "治愈术宝典", spellName: "治愈术" },
        { name: "筑基神雷秘法", spellName: "筑基神雷" },
        { name: "金丹护体真诀", spellName: "金丹护体" },
        { name: "元婴出窍大法", spellName: "元婴出窍" },
        { name: "化神大法秘录", spellName: "化神大法" },
        { name: "仙元护体真经", spellName: "仙元护体" }
    ];
    
    // 随机选择一种法术秘籍
    const randomIndex = Math.floor(Math.random() * spells.length);
    const item = spells[randomIndex];
    
    addItemToInventory({
        name: item.name,
        type: 'spell',
        spellName: item.spellName,
        description: `使用后可以学会${item.spellName}`,
        stackable: false,
        usable: true
    });
    
    showDebugMessage(`已添加${item.name}: 可以学会${item.spellName}`);
}

// 清空背包
function clearInventory() {
    if (confirm("确定要清空背包吗？所有物品将被删除！")) {
        gameState.inventory = [];
        saveGameState();
        showDebugMessage("背包已清空");
    }
}

// 学会所有法术
function learnAllSpells() {
    const allSpells = [
        "火球术", "寒冰箭", "护盾术", "治愈术",
        "筑基神雷", "金丹护体", "元婴出窍", "化神大法", "仙元护体"
    ];
    
    allSpells.forEach(spellName => {
        learnNewSpell(spellName);
    });
    
    showDebugMessage("已学会所有法术");
}

// 添加攻击法术
function addAttackSpells() {
    const attackSpells = ["火球术", "寒冰箭", "筑基神雷", "元婴出窍"];
    
    attackSpells.forEach(spellName => {
        learnNewSpell(spellName);
    });
    
    showDebugMessage("已添加所有攻击法术");
}

// 添加防御法术
function addDefenseSpells() {
    const defenseSpells = ["护盾术", "金丹护体", "仙元护体"];
    
    defenseSpells.forEach(spellName => {
        learnNewSpell(spellName);
    });
    
    showDebugMessage("已添加所有防御法术");
}

// 添加辅助法术
function addSupportSpells() {
    const supportSpells = ["治愈术", "化神大法"];
    
    supportSpells.forEach(spellName => {
        learnNewSpell(spellName);
    });
    
    showDebugMessage("已添加所有辅助法术");
}

// 遗忘所有法术
function forgetAllSpells() {
    if (confirm("确定要遗忘所有法术吗？")) {
        gameState.spells = [];
        saveGameState();
        showDebugMessage("已遗忘所有法术");
    }
}

// 立即开始战斗
function debugStartBattle() {
    // 选择最高级可用妖兽
    let monsterId = 3; // 猛虎
    if (gameState.realm < 1) {
        monsterId = 2; // 黑熊，如果还在凡人境
    }
    
    // 保存当前页面URL，用于战斗结束后返回
    gameState.debugReturnUrl = window.location.href;
    
    // 保存游戏状态
    saveGameState();
    
    // 跳转到游戏页面并开始战斗
    window.location.href = `v3.0_fixed_index.html?startBattle=${monsterId}`;
}

// 立即挑战神兽
function debugStartBossBattle() {
    // 保存当前页面URL，用于战斗结束后返回
    gameState.debugReturnUrl = window.location.href;
    
    // 确保可以挑战神兽
    gameState.lastBossBattleCount = Math.floor(gameState.battleCount / 100) - 1;
    
    // 保存游戏状态
    saveGameState();
    
    // 跳转到游戏页面并开始神兽战斗
    window.location.href = "v3.0_fixed_index.html?startBossBattle=1";
}

// 直接获得战斗胜利
function debugWinBattle() {
    // 增加战斗计数和胜利计数
    gameState.battleCount += 1;
    gameState.winCount += 1;
    
    // 获得大量经验
    const expReward = 10000;
    gainExp(expReward);
    
    // 获得修炼进度
    const cultivationGain = 5000;
    gameState.stageProgress += cultivationGain;
    checkStageUpCondition();
    
    // 获得高级装备
    const equipment = generateRandomEquipment('epic');
    addItemToInventory(equipment);
    
    // 获得突破丹
    addItemToInventory({
        name: `${realms[gameState.realm].name}突破丹`,
        type: 'breakthrough',
        realm: gameState.realm,
        description: `用于突破至${realms[gameState.realm + 1]?.name || '下一境界'}的丹药`,
        stackable: true,
        quantity: 2
    });
    
    showDebugMessage(`已获得战斗胜利: 获得${expReward}经验, ${cultivationGain}修炼进度, ${equipment.name}和2颗突破丹`);
}

// 重置战斗统计
function debugResetBattleStats() {
    if (confirm("确定要重置战斗统计吗？")) {
        gameState.battleCount = 0;
        gameState.bossBattleCount = 0;
        gameState.winCount = 0;
        gameState.lastBossBattleCount = 0;
        saveGameState();
        showDebugMessage("战斗统计已重置");
    }
}

// 保存游戏状态
function debugSaveGame() {
    if (saveGameState()) {
        showDebugMessage("游戏状态已保存");
    } else {
        showDebugMessage("保存游戏状态失败", true);
    }
}

// 加载游戏状态
function debugLoadGame() {
    const loadedState = loadGameState();
    if (loadedState) {
        gameState = loadedState;
        showDebugMessage("游戏状态已加载");
        updateCurrentLevel();
    } else {
        showDebugMessage("加载游戏状态失败", true);
    }
}

// 重置游戏进度
function debugResetGame() {
    if (confirm("确定要重置所有游戏进度吗？此操作不可恢复！")) {
        if (resetGameState()) {
            showDebugMessage("游戏进度已重置");
            updateCurrentLevel();
        } else {
            showDebugMessage("重置游戏进度失败", true);
        }
    }
}

// 打印游戏状态到控制台
function debugPrintState() {
    console.log("当前游戏状态:", gameState);
    showDebugMessage("游戏状态已打印到控制台");
}

// 导出游戏状态
function exportGameState() {
    try {
        const gameStateJson = JSON.stringify(gameState, null, 2);
        document.getElementById('game-state-json').value = gameStateJson;
        showDebugMessage("游戏状态已导出");
    } catch (error) {
        console.error("导出游戏状态失败:", error);
        showDebugMessage("导出游戏状态失败", true);
    }
}

// 导入游戏状态
function importGameState() {
    try {
        const gameStateJson = document.getElementById('game-state-json').value;
        if (!gameStateJson) {
            showDebugMessage("请输入有效的游戏状态JSON", true);
            return;
        }
        
        const importedState = JSON.parse(gameStateJson);
        gameState = importedState;
        saveGameState();
        showDebugMessage("游戏状态已导入");
        updateCurrentLevel();
    } catch (error) {
        console.error("导入游戏状态失败:", error);
        showDebugMessage("导入游戏状态失败: " + error.message, true);
    }
}

// 显示调试消息
function showDebugMessage(message, isError = false) {
    // 创建临时通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ${isError ? 'bg-red-600' : 'bg-green-600'} text-white`;
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 获取稀有度名称
function getRarityName(rarity) {
    const rarityNames = {
        'common': '普通',
        'rare': '稀有',
        'epic': '史诗',
        'legendary': '传说',
        'mythic': '神话'
    };
    
    return rarityNames[rarity] || rarity;
}
    