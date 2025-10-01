// 游戏核心逻辑 - 包含游戏状态管理、数据持久化和核心功能
// 全局游戏状态变量
let gameState = {};

// 游戏境界定义
const realms = [
    {
        id: 0,
        name: "凡人境",
        color: "mortal",
        requiredLevel: 1,
        requiredSpiritual: 0,
        requiredDao: 0,
        avatar: "https://picsum.photos/id/64/200/200",
        avatarAlt: "凡人境修仙者头像，穿着朴素的修行者"
    },
    {
        id: 1,
        name: "筑基境",
        color: "foundation",
        requiredLevel: 20,
        requiredSpiritual: 50,
        requiredDao: 30,
        rewardSpell: "筑基神雷",
        avatar: "https://picsum.photos/id/91/200/200",
        avatarAlt: "筑基境修仙者头像，气质出尘"
    },
    {
        id: 2,
        name: "金丹境",
        color: "golden",
        requiredLevel: 50,
        requiredSpiritual: 150,
        requiredDao: 100,
        rewardSpell: "金丹护体",
        avatar: "https://picsum.photos/id/177/200/200",
        avatarAlt: "金丹境修仙者头像，金光环绕"
    },
    {
        id: 3,
        name: "元婴境",
        color: "nascent",
        requiredLevel: 100,
        requiredSpiritual: 300,
        requiredDao: 200,
        rewardSpell: "元婴出窍",
        avatar: "https://picsum.photos/id/342/200/200",
        avatarAlt: "元婴境修仙者头像，空灵飘逸"
    },
    {
        id: 4,
        name: "化神境",
        color: "soul",
        requiredLevel: 200,
        requiredSpiritual: 600,
        requiredDao: 400,
        rewardSpell: "化神大法",
        avatar: "https://picsum.photos/id/399/200/200",
        avatarAlt: "化神境修仙者头像，神光内敛"
    },
    {
        id: 5,
        name: "仙人境",
        color: "immortal",
        requiredLevel: 500,
        requiredSpiritual: 1000,
        requiredDao: 800,
        rewardSpell: "仙元护体",
        avatar: "https://picsum.photos/id/646/200/200",
        avatarAlt: "仙人境修仙者头像，仙气缭绕"
    }
];

// 阶段名称
const stageNames = [
    "初期", "中期", "后期", "巅峰",
    "小成", "中成", "大成",
    "圆满", "极致", "大圆满"
];

// 初始化游戏核心数据
function initCoreGame() {
    // 尝试从本地存储加载游戏状态
    const savedState = loadGameState();
    
    if (savedState) {
        gameState = savedState;
    } else {
        // 初始化新游戏状态
        gameState = {
            level: 1,
            exp: 0,
            expToNextLevel: 100,
            totalExp: 0,
            realm: 0, // 初始为凡人境
            stage: 1, // 阶段1-10
            stageProgress: 0,
            stageRequirement: 1000, // 每个小阶段需要的进度
            
            // 属性
            spiritualPower: 0, // 灵气
            daoFoundation: 0, // 道基
            soulPower: 0, // 神魂
            comprehension: 0, // 悟性
            luck: 0, // 机缘
            magicRegen: 0.1, // 灵力恢复速度
            
            // 战斗属性
            totalAttack: 0,
            totalDefense: 0,
            totalMagic: 0,
            totalPower: 0,
            
            // 战斗相关
            battleCount: 0,
            bossBattleCount: 0,
            winCount: 0,
            lastBossBattleCount: 0,
            
            // 状态标记
            autoExp: false,
            meditating: false,
            
            // 当前战斗状态
            currentHp: 100,
            currentMp: 100,
            
            // 装备
            equipment: {
                weaponMain: null,
                weaponOff: null,
                armor: null,
                shoulder: null,
                cape: null,
                head: null,
                ring1: null,
                ring2: null,
                amulet: null
            },
            activatedMythicEquipment: [],
            
            // 背包
            inventory: [],
            nextItemId: 1,
            
            // 法术
            spells: []
        };
        
        // 保存初始状态
        saveGameState();
    }
}

// 保存游戏状态到本地存储
function saveGameState() {
    try {
        localStorage.setItem('xiuxianGameState', JSON.stringify(gameState));
        return true;
    } catch (error) {
        console.error("保存游戏状态失败:", error);
        return false;
    }
}

// 从本地存储加载游戏状态
function loadGameState() {
    try {
        const savedState = localStorage.getItem('xiuxianGameState');
        if (savedState) {
            return JSON.parse(savedState);
        }
        return null;
    } catch (error) {
        console.error("加载游戏状态失败:", error);
        return null;
    }
}

// 重置游戏状态
function resetGameState() {
    if (confirm("确定要重置游戏进度吗？所有数据将被清除！")) {
        try {
            localStorage.removeItem('xiuxianGameState');
            initCoreGame();
            return true;
        } catch (error) {
            console.error("重置游戏状态失败:", error);
            return false;
        }
    }
    return false;
}

// 获得经验
function gainExp(amount) {
    if (amount <= 0) return;
    
    gameState.exp += amount;
    gameState.totalExp += amount;
    
    // 检查是否升级
    while (gameState.exp >= gameState.expToNextLevel) {
        levelUp();
    }
    
    updateUI();
    saveGameState();
}

// 升级
function levelUp() {
    // 减去升级所需经验
    gameState.exp -= gameState.expToNextLevel;
    
    // 升级
    gameState.level += 1;
    
    // 计算下一级所需经验 (每级增加20%)
    gameState.expToNextLevel = Math.floor(gameState.expToNextLevel * 1.2);
    
    // 升级属性加成
    const spiritualGain = Math.floor(Math.random() * 3) + 1;
    const daoGain = Math.floor(Math.random() * 2) + 1;
    const soulGain = Math.floor(Math.random() * 2) + 1;
    const comprehensionGain = Math.random() > 0.7 ? 1 : 0;
    const luckGain = Math.random() > 0.8 ? 1 : 0;
    
    gameState.spiritualPower += spiritualGain;
    gameState.daoFoundation += daoGain;
    gameState.soulPower += soulGain;
    gameState.comprehension += comprehensionGain;
    gameState.luck += luckGain;
    
    // 显示升级提示
    showPopup('level-up-popup');
    showNotification(`升级到${gameState.level}级！获得属性加成`);
    
    // 检查突破条件
    checkAscendCondition();
    
    updateUI();
    saveGameState();
}

// 阶段提升
function stageUp() {
    if (gameState.stage >= 10) return; // 已达到当前境界最高阶段
    
    gameState.stage += 1;
    gameState.stageProgress -= gameState.stageRequirement;
    
    // 每个阶段提升需求增加
    gameState.stageRequirement = Math.floor(gameState.stageRequirement * 1.5);
    
    // 阶段提升属性加成
    const spiritualGain = Math.floor(Math.random() * 5) + 2;
    const daoGain = Math.floor(Math.random() * 4) + 1;
    const soulGain = Math.floor(Math.random() * 4) + 1;
    
    gameState.spiritualPower += spiritualGain;
    gameState.daoFoundation += daoGain;
    gameState.soulPower += soulGain;
    
    // 显示阶段提升提示
    showPopup('stage-up-popup');
    showNotification(`提升到${stageNames[gameState.stage - 1]}！获得属性加成`);
    
    // 检查突破条件
    checkAscendCondition();
    
    updateUI();
    saveGameState();
}

// 执行境界突破
function performAscend() {
    const currentRealm = realms[gameState.realm];
    const nextRealm = realms[gameState.realm + 1];
    
    if (!nextRealm) return; // 已经是最高境界
    
    // 检查突破条件
    const breakthroughCount = gameState.inventory.filter(item => item.type === 'breakthrough' && item.realm === gameState.realm).length;
    
    const canAscend = gameState.level >= nextRealm.requiredLevel &&
                      gameState.stage >= 10 &&
                      gameState.spiritualPower >= nextRealm.requiredSpiritual &&
                      gameState.daoFoundation >= nextRealm.requiredDao &&
                      breakthroughCount >= 1;
                      
    if (!canAscend) return;
    
    // 消耗突破丹
    const breakthroughItemIndex = gameState.inventory.findIndex(item => item.type === 'breakthrough' && item.realm === gameState.realm);
    if (breakthroughItemIndex !== -1) {
        if (gameState.inventory[breakthroughItemIndex].quantity > 1) {
            gameState.inventory[breakthroughItemIndex].quantity -= 1;
        } else {
            gameState.inventory.splice(breakthroughItemIndex, 1);
        }
    }
    
    // 提升境界
    gameState.realm += 1;
    gameState.stage = 1;
    gameState.stageProgress = 0;
    gameState.stageRequirement = 1000; // 重置阶段需求
    
    // 全属性提升50%
    gameState.spiritualPower = Math.floor(gameState.spiritualPower * 1.5);
    gameState.daoFoundation = Math.floor(gameState.daoFoundation * 1.5);
    gameState.soulPower = Math.floor(gameState.soulPower * 1.5);
    gameState.comprehension = Math.floor(gameState.comprehension * 1.5);
    gameState.luck = Math.floor(gameState.luck * 1.5);
    
    // 灵气恢复速度翻倍
    gameState.magicRegen *= 2;
    
    // 学习新法术
    learnNewSpell(nextRealm.rewardSpell);
    
    // 关闭弹窗
    toggleModal('ascend-modal');
    
    // 显示突破成功提示
    document.getElementById('new-realm-text').textContent = nextRealm.name;
    showPopup('ascend-success-popup');
    showNotification(`恭喜突破至${nextRealm.name}！`, 'success');
    
    // 更新头像框效果
    const avatarFrame = document.getElementById('avatar-frame');
    if (avatarFrame) {
        avatarFrame.classList.add('breakthrough-animation');
        setTimeout(() => {
            avatarFrame.classList.remove('breakthrough-animation');
        }, 800);
    }
    
    updateUI();
    saveGameState();
}

// 添加物品到背包
function addItemToInventory(item) {
    if (!item || gameState.inventory.length >= 50) return false;
    
    // 为物品分配ID
    item.id = gameState.nextItemId++;
    
    // 检查是否可以堆叠
    if (item.stackable) {
        const existingItem = gameState.inventory.find(i => 
            i.name === item.name && 
            i.type === item.type && 
            i.rarity === item.rarity
        );
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
            saveGameState();
            return true;
        }
    }
    
    // 确保有数量属性
    if (!item.quantity) {
        item.quantity = 1;
    }
    
    gameState.inventory.push(item);
    saveGameState();
    return true;
}

// 使用物品
function useItem(itemId) {
    const itemIndex = gameState.inventory.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;
    
    const item = gameState.inventory[itemIndex];
    
    // 根据物品类型处理使用效果
    switch (item.type) {
        case 'exp':
            // 经验道具
            gainExp(item.value);
            showNotification(`使用了${item.name}，获得${item.value}点经验`);
            break;
            
        case 'boost':
            // 增益道具
            if (item.attribute === 'spiritual') {
                gameState.spiritualPower += item.value;
                showNotification(`使用了${item.name}，灵气+${item.value}`);
            } else if (item.attribute === 'dao') {
                gameState.daoFoundation += item.value;
                showNotification(`使用了${item.name}，道基+${item.value}`);
            } else if (item.attribute === 'soul') {
                gameState.soulPower += item.value;
                showNotification(`使用了${item.name}，神魂+${item.value}`);
            } else if (item.attribute === 'comprehension') {
                gameState.comprehension += item.value;
                showNotification(`使用了${item.name}，悟性+${item.value}`);
            } else if (item.attribute === 'luck') {
                gameState.luck += item.value;
                showNotification(`使用了${item.name}，机缘+${item.value}`);
            }
            break;
            
        case 'spell':
            // 法术秘籍
            if (learnNewSpell(item.spellName)) {
                showNotification(`学会了新法术：${item.spellName}`);
            } else {
                showNotification(`已经学会了${item.spellName}`, 'warning');
                return false; // 不消耗物品
            }
            break;
            
        default:
            showNotification(`无法使用${item.name}`, 'error');
            return false;
    }
    
    // 减少物品数量或移除物品
    if (item.quantity > 1) {
        gameState.inventory[itemIndex].quantity -= 1;
    } else {
        gameState.inventory.splice(itemIndex, 1);
    }
    
    saveGameState();
    return true;
}

// 装备物品
function equipItem(itemId) {
    const itemIndex = gameState.inventory.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;
    
    const item = gameState.inventory[itemIndex];
    
    // 只处理装备类型物品
    if (item.type !== 'equipment' || item.rarity === 'mythic') return false;
    
    // 检查装备槽位是否匹配
    if (!gameState.equipment.hasOwnProperty(item.slot)) return false;
    
    // 如果已有装备，放回背包
    const currentEquipment = gameState.equipment[item.slot];
    if (currentEquipment) {
        addItemToInventory({
            name: currentEquipment.name,
            type: 'equipment',
            slot: currentEquipment.slot,
            attack: currentEquipment.attack,
            defense: currentEquipment.defense,
            spiritual: currentEquipment.spiritual,
            dao: currentEquipment.dao,
            magic: currentEquipment.magic,
            rarity: currentEquipment.rarity,
            description: currentEquipment.description,
            stackable: false
        });
    }
    
    // 装备新物品
    gameState.equipment[item.slot] = {
        id: item.id,
        name: item.name,
        slot: item.slot,
        attack: item.attack,
        defense: item.defense,
        spiritual: item.spiritual,
        dao: item.dao,
        magic: item.magic,
        rarity: item.rarity,
        description: item.description
    };
    
    // 从背包移除物品
    gameState.inventory.splice(itemIndex, 1);
    
    // 更新装备统计
    updateEquipmentStats();
    
    saveGameState();
    return true;
}

// 卸下装备
function unequipItem(slot) {
    if (!gameState.equipment.hasOwnProperty(slot)) return false;
    
    const item = gameState.equipment[slot];
    if (!item) return false;
    
    // 将装备放回背包
    const added = addItemToInventory({
        name: item.name,
        type: 'equipment',
        slot: item.slot,
        attack: item.attack,
        defense: item.defense,
        spiritual: item.spiritual,
        dao: item.dao,
        magic: item.magic,
        rarity: item.rarity,
        description: item.description,
        stackable: false
    });
    
    if (added) {
        // 卸下装备
        gameState.equipment[slot] = null;
        
        // 更新装备统计
        updateEquipmentStats();
        
        saveGameState();
        return true;
    }
    
    showNotification('背包已满，无法卸下装备', 'error');
    return false;
}

// 激活神话装备
function activateMythicEquipment(itemId) {
    const itemIndex = gameState.inventory.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return false;
    
    const item = gameState.inventory[itemIndex];
    
    // 只处理神话装备
    if (item.type !== 'equipment' || item.rarity !== 'mythic') return false;
    
    // 添加到激活的神话装备列表
    gameState.activatedMythicEquipment.push({
        id: item.id,
        name: item.name,
        affixes: item.affixes,
        description: item.description
    });
    
    // 从背包移除物品
    gameState.inventory.splice(itemIndex, 1);
    
    // 更新战斗力
    updateBattlePowerStats();
    
    saveGameState();
    return true;
}

// 学习新法术
function learnNewSpell(spellName) {
    // 检查是否已经学会该法术
    const alreadyLearned = gameState.spells.some(spell => spell.name === spellName);
    if (alreadyLearned) return false;
    
    // 根据法术名称获取法术详情
    const newSpell = getSpellByDisplayName(spellName);
    if (!newSpell) return false;
    
    // 添加到已学会法术列表
    gameState.spells.push(newSpell);
    
    saveGameState();
    return true;
}

// 根据名称获取法术详情
function getSpellByDisplayName(displayName) {
    const spells = [
        {
            id: 1,
            name: "火球术",
            type: "attack",
            description: "释放一个火球攻击敌人，造成10-20点伤害",
            damage: {min: 10, max: 20},
            mpCost: 10,
            cooldown: 3
        },
        {
            id: 2,
            name: "寒冰箭",
            type: "attack",
            description: "发射一支冰箭，造成8-15点伤害并减速敌人",
            damage: {min: 8, max: 15},
            effect: "slow",
            mpCost: 8,
            cooldown: 4
        },
        {
            id: 3,
            name: "护盾术",
            type: "defense",
            description: "创建一个魔法护盾，吸收15点伤害",
            shield: 15,
            mpCost: 12,
            cooldown: 6
        },
        {
            id: 4,
            name: "治愈术",
            type: "support",
            description: "恢复自身10-15点生命值",
            heal: {min: 10, max: 15},
            mpCost: 15,
            cooldown: 8
        },
        {
            id: 5,
            name: "筑基神雷",
            type: "attack",
            description: "召唤神雷攻击敌人，造成25-40点伤害",
            damage: {min: 25, max: 40},
            mpCost: 20,
            cooldown: 5
        },
        {
            id: 6,
            name: "金丹护体",
            type: "defense",
            description: "形成金丹护盾，吸收50点伤害",
            shield: 50,
            mpCost: 30,
            cooldown: 10
        },
        {
            id: 7,
            name: "元婴出窍",
            type: "attack",
            description: "元婴离体攻击，造成40-60点伤害",
            damage: {min: 40, max: 60},
            mpCost: 40,
            cooldown: 8
        },
        {
            id: 8,
            name: "化神大法",
            type: "support",
            description: "暂时提升所有属性30%，持续5回合",
            effect: "buff",
            mpCost: 50,
            cooldown: 15
        },
        {
            id: 9,
            name: "仙元护体",
            type: "defense",
            description: "仙家元气护体，吸收100点伤害并反弹20%伤害",
            shield: 100,
            effect: "reflect",
            mpCost: 80,
            cooldown: 20
        }
    ];
    
    return spells.find(spell => spell.name === displayName);
}

// 获取物品图标
function getItemIcon(type) {
    switch (type) {
        case 'exp': return 'fa-star';
        case 'boost': return 'fa-potion';
        case 'spell': return 'fa-book';
        case 'material': return 'fa-cube';
        case 'breakthrough': return 'fa-flask';
        case 'equipment': return 'fa-shield';
        default: return 'fa-question';
    }
}

// 获取物品类型颜色
function getItemTypeColor(type, rarity) {
    // 如果是装备，使用稀有度颜色
    if (type === 'equipment' && rarity) {
        return getRarityColor(rarity);
    }
    
    // 其他类型物品的颜色
    switch (type) {
        case 'exp': return 'exp';
        case 'boost': return 'boost';
        case 'spell': return 'spell';
        case 'material': return 'material';
        case 'breakthrough': return 'secondary';
        default: return 'common';
    }
}

// 获取稀有度颜色
function getRarityColor(rarity) {
    switch (rarity) {
        case 'common': return 'common';
        case 'rare': return 'rare';
        case 'epic': return 'epic';
        case 'legendary': return 'legendary';
        case 'mythic': return 'mythic';
        default: return 'common';
    }
}

// 获取装备图标
function getEquipmentIcon(slot) {
    switch (slot) {
        case 'weaponMain': return 'fa-sword';
        case 'weaponOff': return 'fa-dagger';
        case 'armor': return 'fa-shield';
        case 'shoulder': return 'fa-shield fa-rotate-45';
        case 'cape': return 'fa-flag';
        case 'head': return 'fa-user-circle';
        case 'ring1':
        case 'ring2': return 'fa-diamond';
        case 'amulet': return 'fa-cross';
        default: return 'fa-shield';
    }
}

// 获取法术图标
function getSpellIcon(type) {
    switch (type) {
        case 'attack': return 'fa-bolt';
        case 'defense': return 'fa-shield';
        case 'support': return 'fa-heart';
        default: return 'fa-magic';
    }
}

// 开始战斗
function startBattle(monsterId) {
    // 定义妖兽数据
    const monsters = [
        {
            id: 1,
            name: "野狼",
            level: 5,
            hp: 200,
            attack: 15,
            defense: 5,
            expReward: 100,
            goldReward: 20,
            dropRate: 0.2,
            breakthroughRate: 0.008,
            image: "https://picsum.photos/id/237/200/200",
            imageAlt: "低级妖兽：野狼，看起来比较弱小但很凶猛"
        },
        {
            id: 2,
            name: "黑熊",
            level: 15,
            hp: 500,
            attack: 30,
            defense: 15,
            expReward: 300,
            goldReward: 50,
            dropRate: 0.2,
            breakthroughRate: 0.012,
            image: "https://picsum.photos/id/1000/200/200",
            imageAlt: "中级妖兽：黑熊，体型庞大，力量强大"
        },
        {
            id: 3,
            name: "猛虎",
            level: 30,
            hp: 1000,
            attack: 60,
            defense: 30,
            expReward: 800,
            goldReward: 150,
            dropRate: 0.2,
            breakthroughRate: 0.02,
            image: "https://picsum.photos/id/1002/200/200",
            imageAlt: "高级妖兽：猛虎，需要筑基境才能挑战"
        }
    ];
    
    // 获取选择的妖兽
    const monster = monsters.find(m => m.id === monsterId);
    if (!monster) return;
    
    // 检查是否达到挑战等级要求
    if (monster.id === 3 && gameState.realm < 1) {
        showNotification('需要达到筑基境才能挑战猛虎', 'error');
        return;
    }
    
    // 准备战斗状态
    gameState.currentBattle = {
        inProgress: true,
        monster: {
            id: monster.id,
            name: monster.name,
            maxHp: monster.hp,
            currentHp: monster.hp,
            attack: monster.attack,
            defense: monster.defense,
            image: monster.image
        },
        player: {
            maxHp: 100 + gameState.daoFoundation * 2,
            currentHp: 100 + gameState.daoFoundation * 2,
            maxMp: 100 + gameState.soulPower * 2,
            currentMp: 100 + gameState.soulPower * 2,
            isDefending: false,
            shield: 0
        },
        log: []
    };
    
    // 更新战斗UI
    document.getElementById('battle-preparation').classList.add('hidden');
    document.getElementById('battle-scene').classList.remove('hidden');
    
    document.getElementById('battle-monster-name').textContent = `与${monster.name}战斗中`;
    document.getElementById('battle-monster-image').src = monster.image;
    document.getElementById('battle-monster-display-name').textContent = monster.name;
    
    // 更新HP和MP显示
    updateBattleUI();
    
    // 添加战斗日志
    addBattleLog("战斗开始！");
    
    // 开始战斗循环
    if (battleInterval) {
        clearInterval(battleInterval);
    }
    
    // 玩家先攻
    setTimeout(() => {
        // 自动战斗循环
        battleInterval = setInterval(autoBattleTurn, 3000);
    }, 1000);
}

// 开始神兽战斗
function startBossBattle() {
    // 神兽数据
    const boss = {
        id: 101,
        name: "青龙",
        level: 50,
        hp: 5000,
        attack: 100,
        defense: 50,
        expReward: 5000,
        goldReward: 1000,
        dropRate: 0.8,
        mythicRate: 0.3,
        image: "https://picsum.photos/id/1015/200/200",
        imageAlt: "神兽青龙，传说中的东方神兽"
    };
    
    // 准备战斗状态
    gameState.currentBossBattle = {
        inProgress: true,
        boss: {
            id: boss.id,
            name: boss.name,
            maxHp: boss.hp,
            currentHp: boss.hp,
            attack: boss.attack,
            defense: boss.defense,
            image: boss.image
        },
        player: {
            maxHp: 100 + gameState.daoFoundation * 2,
            currentHp: 100 + gameState.daoFoundation * 2,
            maxMp: 100 + gameState.soulPower * 2,
            currentMp: 100 + gameState.soulPower * 2,
            isDefending: false,
            shield: 0
        },
        log: []
    };
    
    // 更新战斗UI
    document.getElementById('battle-preparation').classList.add('hidden');
    document.getElementById('boss-battle-scene').classList.remove('hidden');
    
    document.getElementById('boss-name').textContent = boss.name;
    document.getElementById('boss-image').src = boss.image;
    document.getElementById('boss-display-name').textContent = boss.name;
    
    // 更新HP和MP显示
    updateBossBattleUI();
    
    // 添加战斗日志
    addBossBattleLog("神兽降临！准备战斗！");
    
    // 开始战斗循环
    if (battleInterval) {
        clearInterval(battleInterval);
    }
    
    // 玩家先攻
    setTimeout(() => {
        // 自动战斗循环
        battleInterval = setInterval(autoBossBattleTurn, 3000);
    }, 1000);
    
    // 更新神兽战斗计数
    gameState.lastBossBattleCount = Math.floor(gameState.battleCount / 100);
}

// 自动战斗回合
function autoBattleTurn() {
    if (!gameState.currentBattle || !gameState.currentBattle.inProgress) {
        clearInterval(battleInterval);
        return;
    }
    
    // 自动选择行动（简单AI）
    const mpPercent = (gameState.currentBattle.player.currentMp / gameState.currentBattle.player.maxMp) * 100;
    
    if (mpPercent > 50 && gameState.spells.length > 0) {
        // 有足够灵力且学会了法术，使用第一个攻击法术
        const attackSpells = gameState.spells.filter(spell => spell.type === 'attack');
        if (attackSpells.length > 0) {
            useSpellInBattle(attackSpells[0].id);
        } else {
            playerAttack();
        }
    } else if (gameState.currentBattle.player.currentHp < gameState.currentBattle.player.maxHp * 0.3 && 
              gameState.spells.some(spell => spell.type === 'support' && spell.heal)) {
        // 生命值低且有治疗法术，使用治疗
        const healSpells = gameState.spells.filter(spell => spell.type === 'support' && spell.heal);
        if (healSpells.length > 0) {
            useSpellInBattle(healSpells[0].id);
        } else {
            playerDefend();
        }
    } else {
        // 普通攻击
        playerAttack();
    }
}

// 自动神兽战斗回合
function autoBossBattleTurn() {
    if (!gameState.currentBossBattle || !gameState.currentBossBattle.inProgress) {
        clearInterval(battleInterval);
        return;
    }
    
    // 自动选择行动（更智能的AI）
    const mpPercent = (gameState.currentBossBattle.player.currentMp / gameState.currentBossBattle.player.maxMp) * 100;
    const hpPercent = (gameState.currentBossBattle.player.currentHp / gameState.currentBossBattle.player.maxHp) * 100;
    
    if (hpPercent < 20 && gameState.spells.some(spell => spell.type === 'support' && spell.heal)) {
        // 生命值很低，优先治疗
        const healSpells = gameState.spells.filter(spell => spell.type === 'support' && spell.heal);
        if (healSpells.length > 0) {
            useSpellInBossBattle(healSpells[0].id);
        } else {
            bossPlayerDefend();
        }
    } else if (hpPercent < 40 && gameState.spells.some(spell => spell.type === 'defense')) {
        // 生命值较低，使用防御法术
        const defenseSpells = gameState.spells.filter(spell => spell.type === 'defense');
        if (defenseSpells.length > 0) {
            useSpellInBossBattle(defenseSpells[0].id);
        } else {
            bossPlayerDefend();
        }
    } else if (mpPercent > 60 && gameState.spells.some(spell => spell.type === 'attack' && spell.damage)) {
        // 有足够灵力，使用最强攻击法术
        const attackSpells = gameState.spells.filter(spell => spell.type === 'attack' && spell.damage)
                                            .sort((a, b) => (b.damage.max + b.damage.min) - (a.damage.max + a.damage.min));
        if (attackSpells.length > 0) {
            useSpellInBossBattle(attackSpells[0].id);
        } else {
            bossPlayerAttack();
        }
    } else {
        // 普通攻击
        bossPlayerAttack();
    }
}

// 玩家攻击
function playerAttack() {
    if (!gameState.currentBattle || !gameState.currentBattle.inProgress) return;
    
    // 计算伤害（攻击力减去敌人防御的30%）
    const baseDamage = gameState.totalAttack;
    const defenseReduction = gameState.currentBattle.monster.defense * 0.3;
    const damage = Math.max(1, Math.floor(baseDamage - defenseReduction));
    
    // 应用伤害
    gameState.currentBattle.monster.currentHp -= damage;
    
    // 添加战斗日志
    addBattleLog(`你对${gameState.currentBattle.monster.name}造成了${damage}点伤害！`);
    
    // 更新UI
    updateBattleUI();
    
    // 检查敌人是否死亡
    if (gameState.currentBattle.monster.currentHp <= 0) {
        endBattle(true);
        return;
    }
    
    // 敌人反击
    setTimeout(enemyAttack, 1000);
}

// 玩家使用法术
function useSpellInBattle(spellId) {
    if (!gameState.currentBattle || !gameState.currentBattle.inProgress) return;
    
    // 找到法术
    const spell = gameState.spells.find(s => s.id === spellId);
    if (!spell) return;
    
    // 检查灵力是否足够
    if (gameState.currentBattle.player.currentMp < spell.mpCost) {
        addBattleLog("灵力不足，无法使用法术！");
        // 改为普通攻击
        setTimeout(playerAttack, 1000);
        return;
    }
    
    // 消耗灵力
    gameState.currentBattle.player.currentMp -= spell.mpCost;
    
    // 根据法术类型处理效果
    if (spell.type === 'attack' && spell.damage) {
        // 攻击法术
        const damage = Math.floor(Math.random() * (spell.damage.max - spell.damage.min + 1)) + spell.damage.min;
        gameState.currentBattle.monster.currentHp -= damage;
        
        addBattleLog(`你使用了${spell.name}，对${gameState.currentBattle.monster.name}造成了${damage}点伤害！`);
        
        // 检查敌人是否死亡
        if (gameState.currentBattle.monster.currentHp <= 0) {
            updateBattleUI();
            endBattle(true);
            return;
        }
    } else if (spell.type === 'defense' && spell.shield) {
        // 防御法术
        gameState.currentBattle.player.shield += spell.shield;
        addBattleLog(`你使用了${spell.name}，获得了${spell.shield}点护盾！`);
    } else if (spell.type === 'support' && spell.heal) {
        // 治疗法术
        const healAmount = Math.floor(Math.random() * (spell.heal.max - spell.heal.min + 1)) + spell.heal.min;
        gameState.currentBattle.player.currentHp = Math.min(
            gameState.currentBattle.player.currentHp + healAmount,
            gameState.currentBattle.player.maxHp
        );
        addBattleLog(`你使用了${spell.name}，恢复了${healAmount}点生命值！`);
    }
    
    // 更新UI
    updateBattleUI();
    
    // 敌人反击
    setTimeout(enemyAttack, 1000);
}

// 玩家防御
function playerDefend() {
    if (!gameState.currentBattle || !gameState.currentBattle.inProgress) return;
    
    gameState.currentBattle.player.isDefending = true;
    addBattleLog("你进入了防御姿态，减少受到的伤害！");
    
    // 更新UI
    updateBattleUI();
    
    // 敌人攻击
    setTimeout(enemyAttack, 1000);
}

// 玩家逃跑
function playerFlee() {
    if (!gameState.currentBattle || !gameState.currentBattle.inProgress) return;
    
    // 逃跑成功率70%
    const success = Math.random() < 0.7;
    
    if (success) {
        addBattleLog("你成功逃脱了战斗！");
        endBattle(false, true);
    } else {
        addBattleLog("逃跑失败，敌人发起了反击！");
        updateBattleUI();
        // 敌人攻击
        setTimeout(enemyAttack, 1000);
    }
}

// 敌人攻击
function enemyAttack() {
    if (!gameState.currentBattle || !gameState.currentBattle.inProgress) return;
    
    // 计算伤害
    let damage = gameState.currentBattle.monster.attack;
    
    // 应用防御效果
    if (gameState.currentBattle.player.isDefending) {
        damage = Math.floor(damage * 0.5); // 防御状态受到50%伤害
        gameState.currentBattle.player.isDefending = false; // 防御只持续一回合
    }
    
    // 应用护盾
    if (gameState.currentBattle.player.shield > 0) {
        const shieldAbsorb = Math.min(damage, gameState.currentBattle.player.shield);
        gameState.currentBattle.player.shield -= shieldAbsorb;
        damage -= shieldAbsorb;
    }
    
    // 应用伤害
    gameState.currentBattle.player.currentHp -= damage;
    damage = Math.max(0, damage); // 确保伤害不为负
    
    // 添加战斗日志
    addBattleLog(`${gameState.currentBattle.monster.name}对你造成了${damage}点伤害！${gameState.currentBattle.player.shield > 0 ? `剩余护盾: ${gameState.currentBattle.player.shield}` : ''}`);
    
    // 更新UI
    updateBattleUI();
    
    // 检查玩家是否死亡
    if (gameState.currentBattle.player.currentHp <= 0) {
        endBattle(false);
    }
}

// 神兽战斗 - 玩家攻击
function bossPlayerAttack() {
    if (!gameState.currentBossBattle || !gameState.currentBossBattle.inProgress) return;
    
    // 计算伤害（攻击力减去敌人防御的20%）
    const baseDamage = gameState.totalAttack;
    const defenseReduction = gameState.currentBossBattle.boss.defense * 0.2;
    const damage = Math.max(1, Math.floor(baseDamage - defenseReduction));
    
    // 应用伤害
    gameState.currentBossBattle.boss.currentHp -= damage;
    
    // 添加战斗日志
    addBossBattleLog(`你对${gameState.currentBossBattle.boss.name}造成了${damage}点伤害！`);
    
    // 更新UI
    updateBossBattleUI();
    
    // 检查神兽是否死亡
    if (gameState.currentBossBattle.boss.currentHp <= 0) {
        endBossBattle(true);
        return;
    }
    
    // 神兽反击
    setTimeout(bossAttack, 1000);
}

// 神兽战斗 - 玩家使用法术
function useSpellInBossBattle(spellId) {
    if (!gameState.currentBossBattle || !gameState.currentBossBattle.inProgress) return;
    
    // 找到法术
    const spell = gameState.spells.find(s => s.id === spellId);
    if (!spell) return;
    
    // 检查灵力是否足够
    if (gameState.currentBossBattle.player.currentMp < spell.mpCost) {
        addBossBattleLog("灵力不足，无法使用法术！");
        // 改为普通攻击
        setTimeout(bossPlayerAttack, 1000);
        return;
    }
    
    // 消耗灵力
    gameState.currentBossBattle.player.currentMp -= spell.mpCost;
    
    // 根据法术类型处理效果
    if (spell.type === 'attack' && spell.damage) {
        // 攻击法术
        const damage = Math.floor(Math.random() * (spell.damage.max - spell.damage.min + 1)) + spell.damage.min;
        gameState.currentBossBattle.boss.currentHp -= damage;
        
        addBossBattleLog(`你使用了${spell.name}，对${gameState.currentBossBattle.boss.name}造成了${damage}点伤害！`);
        
        // 检查神兽是否死亡
        if (gameState.currentBossBattle.boss.currentHp <= 0) {
            updateBossBattleUI();
            endBossBattle(true);
            return;
        }
    } else if (spell.type === 'defense' && spell.shield) {
        // 防御法术
        gameState.currentBossBattle.player.shield += spell.shield;
        addBossBattleLog(`你使用了${spell.name}，获得了${spell.shield}点护盾！`);
    } else if (spell.type === 'support' && spell.heal) {
        // 治疗法术
        const healAmount = Math.floor(Math.random() * (spell.heal.max - spell.heal.min + 1)) + spell.heal.min;
        gameState.currentBossBattle.player.currentHp = Math.min(
            gameState.currentBossBattle.player.currentHp + healAmount,
            gameState.currentBossBattle.player.maxHp
        );
        addBossBattleLog(`你使用了${spell.name}，恢复了${healAmount}点生命值！`);
    } else if (spell.type === 'support' && spell.effect === 'buff') {
        // 属性提升法术
        gameState.currentBossBattle.player.buffed = true;
        gameState.currentBossBattle.player.buffTurns = 5;
        addBossBattleLog(`你使用了${spell.name}，所有属性提升30%，持续5回合！`);
    }
    
    // 更新UI
    updateBossBattleUI();
    
    // 神兽反击
    setTimeout(bossAttack, 1000);
}

// 神兽战斗 - 玩家防御
function bossPlayerDefend() {
    if (!gameState.currentBossBattle || !gameState.currentBossBattle.inProgress) return;
    
    gameState.currentBossBattle.player.isDefending = true;
    addBossBattleLog("你进入了防御姿态，减少受到的伤害！");
    
    // 更新UI
    updateBossBattleUI();
    
    // 神兽攻击
    setTimeout(bossAttack, 1000);
}

// 神兽战斗 - 玩家逃跑
function bossPlayerFlee() {
    if (!gameState.currentBossBattle || !gameState.currentBossBattle.inProgress) return;
    
    // 从神兽面前逃跑成功率低，只有30%
    const success = Math.random() < 0.3;
    
    if (success) {
        addBossBattleLog("你成功逃脱了神兽的攻击！");
        endBossBattle(false, true);
    } else {
        addBossBattleLog("逃跑失败，神兽发起了猛烈攻击！");
        updateBossBattleUI();
        // 神兽攻击，逃跑失败受到额外伤害
        setTimeout(() => bossAttack(true), 1000);
    }
}

// 神兽攻击
function bossAttack(escapeFailed = false) {
    if (!gameState.currentBossBattle || !gameState.currentBossBattle.inProgress) return;
    
    // 检查是否有属性加成
    let attack = gameState.currentBossBattle.boss.attack;
    if (gameState.currentBossBattle.player.buffed) {
        // 减少buff持续时间
        gameState.currentBossBattle.player.buffTurns -= 1;
        if (gameState.currentBossBattle.player.buffTurns <= 0) {
            gameState.currentBossBattle.player.buffed = false;
            addBossBattleLog("你的属性加成效果消失了！");
        }
    }
    
    // 逃跑失败受到额外伤害
    if (escapeFailed) {
        attack = Math.floor(attack * 1.5);
    }
    
    // 计算伤害
    let damage = attack;
    
    // 应用防御效果
    if (gameState.currentBossBattle.player.isDefending) {
        damage = Math.floor(damage * 0.5); // 防御状态受到50%伤害
        gameState.currentBossBattle.player.isDefending = false; // 防御只持续一回合
    }
    
    // 应用护盾
    if (gameState.currentBossBattle.player.shield > 0) {
        const shieldAbsorb = Math.min(damage, gameState.currentBossBattle.player.shield);
        gameState.currentBossBattle.player.shield -= shieldAbsorb;
        damage -= shieldAbsorb;
    }
    
    // 应用伤害
    gameState.currentBossBattle.player.currentHp -= damage;
    damage = Math.max(0, damage); // 确保伤害不为负
    
    // 添加战斗日志
    addBossBattleLog(`${gameState.currentBossBattle.boss.name}对你造成了${damage}点伤害！${gameState.currentBossBattle.player.shield > 0 ? `剩余护盾: ${gameState.currentBossBattle.player.shield}` : ''}`);
    
    // 更新UI
    updateBossBattleUI();
    
    // 检查玩家是否死亡
    if (gameState.currentBossBattle.player.currentHp <= 0) {
        endBossBattle(false);
    }
}

// 更新战斗UI
function updateBattleUI() {
    if (!gameState.currentBattle) return;
    
    // 更新玩家HP和MP
    const playerHpPercent = (gameState.currentBattle.player.currentHp / gameState.currentBattle.player.maxHp) * 100;
    const playerMpPercent = (gameState.currentBattle.player.currentMp / gameState.currentBattle.player.maxMp) * 100;
    
    document.getElementById('player-hp-text').textContent = `${Math.max(0, gameState.currentBattle.player.currentHp)}/${gameState.currentBattle.player.maxHp}`;
    document.getElementById('player-mp-text').textContent = `${Math.max(0, gameState.currentBattle.player.currentMp)}/${gameState.currentBattle.player.maxMp}`;
    document.getElementById('player-hp-bar').style.width = `${Math.max(0, playerHpPercent)}%`;
    document.getElementById('player-mp-bar').style.width = `${Math.max(0, playerMpPercent)}%`;
    
    // 更新敌人HP
    const monsterHpPercent = (gameState.currentBattle.monster.currentHp / gameState.currentBattle.monster.maxHp) * 100;
    document.getElementById('monster-hp-text').textContent = `${Math.max(0, gameState.currentBattle.monster.currentHp)}/${gameState.currentBattle.monster.maxHp}`;
    document.getElementById('monster-hp-bar').style.width = `${Math.max(0, monsterHpPercent)}%`;
    
    // 滚动到底部
    const battleLog = document.getElementById('battle-log');
    battleLog.scrollTop = battleLog.scrollHeight;
}

// 更新神兽战斗UI
function updateBossBattleUI() {
    if (!gameState.currentBossBattle) return;
    
    // 更新玩家HP和MP
    const playerHpPercent = (gameState.currentBossBattle.player.currentHp / gameState.currentBossBattle.player.maxHp) * 100;
    const playerMpPercent = (gameState.currentBossBattle.player.currentMp / gameState.currentBossBattle.player.maxMp) * 100;
    
    document.getElementById('boss-player-hp-text').textContent = `${Math.max(0, gameState.currentBossBattle.player.currentHp)}/${gameState.currentBossBattle.player.maxHp}`;
    document.getElementById('boss-player-mp-text').textContent = `${Math.max(0, gameState.currentBossBattle.player.currentMp)}/${gameState.currentBossBattle.player.maxMp}`;
    document.getElementById('boss-player-hp-bar').style.width = `${Math.max(0, playerHpPercent)}%`;
    document.getElementById('boss-player-mp-bar').style.width = `${Math.max(0, playerMpPercent)}%`;
    
    // 更新神兽HP
    const bossHpPercent = (gameState.currentBossBattle.boss.currentHp / gameState.currentBossBattle.boss.maxHp) * 100;
    document.getElementById('boss-hp-text').textContent = `${Math.max(0, gameState.currentBossBattle.boss.currentHp)}/${gameState.currentBossBattle.boss.maxHp}`;
    document.getElementById('boss-hp-bar').style.width = `${Math.max(0, bossHpPercent)}%`;
    
    // 滚动到底部
    const battleLog = document.getElementById('boss-battle-log');
    battleLog.scrollTop = battleLog.scrollHeight;
}

// 添加战斗日志
function addBattleLog(message) {
    if (!gameState.currentBattle) return;
    
    gameState.currentBattle.log.push(message);
    
    const battleLog = document.getElementById('battle-log');
    if (battleLog) {
        // 只显示最近10条日志
        const logToShow = gameState.currentBattle.log.slice(-10);
        battleLog.innerHTML = logToShow.map(line => `<p>${line}</p>`).join('');
        battleLog.scrollTop = battleLog.scrollHeight;
    }
}

// 添加神兽战斗日志
function addBossBattleLog(message) {
    if (!gameState.currentBossBattle) return;
    
    gameState.currentBossBattle.log.push(message);
    
    const battleLog = document.getElementById('boss-battle-log');
    if (battleLog) {
        // 只显示最近10条日志
        const logToShow = gameState.currentBossBattle.log.slice(-10);
        battleLog.innerHTML = logToShow.map(line => `<p>${line}</p>`).join('');
        battleLog.scrollTop = battleLog.scrollHeight;
    }
}

// 结束战斗
function endBattle(victory, flee = false) {
    if (!gameState.currentBattle) return;
    
    // 清除战斗循环
    if (battleInterval) {
        clearInterval(battleInterval);
        battleInterval = null;
    }
    
    gameState.currentBattle.inProgress = false;
    
    // 更新战斗计数
    gameState.battleCount += 1;
    
    let resultText, rewardText = "";
    
    if (victory) {
        // 战斗胜利
        gameState.winCount += 1;
        
        // 定义妖兽奖励
        const rewards = {
            1: { exp: 100, gold: 20, dropRate: 0.2, breakthroughRate: 0.008 },
            2: { exp: 300, gold: 50, dropRate: 0.2, breakthroughRate: 0.012 },
            3: { exp: 800, gold: 150, dropRate: 0.2, breakthroughRate: 0.02 }
        };
        
        const monsterId = gameState.currentBattle.monster.id;
        const reward = rewards[monsterId] || rewards[1];
        
        // 获得经验
        gainExp(reward.exp);
        
        // 获得修炼进度
        const cultivationGain = Math.floor(Math.random() * 50) + 30;
        gameState.stageProgress += cultivationGain;
        checkStageUpCondition();
        
        // 随机掉落物品
        let itemDropped = false;
        if (Math.random() < reward.dropRate) {
            const newEquipment = generateRandomEquipment();
            addItemToInventory(newEquipment);
            addBattleLog(`战斗胜利！获得了${newEquipment.name}！`);
            itemDropped = true;
        }
        
        // 随机掉落突破丹
        if (Math.random() < reward.breakthroughRate) {
            const breakthroughItem = {
                name: `${realms[gameState.realm].name}突破丹`,
                type: 'breakthrough',
                realm: gameState.realm,
                description: `用于突破至${realms[gameState.realm + 1]?.name || '下一境界'}的丹药`,
                stackable: true
            };
            addItemToInventory(breakthroughItem);
            addBattleLog(`恭喜获得${breakthroughItem.name}！`);
            itemDropped = true;
        }
        
        // 更新结果文本
        resultText = "战斗胜利！";
        rewardText = `获得${reward.exp}经验，${cultivationGain}修炼进度 ${itemDropped ? '和1件物品' : ''}`;
    } else if (flee) {
        // 成功逃跑
        resultText = "成功逃脱！";
        rewardText = "没有获得奖励";
    } else {
        // 战斗失败
        resultText = "战斗失败！";
        rewardText = "损失部分经验";
        
        // 失败惩罚 - 失去当前经验的10%
        const expLost = Math.floor(gameState.exp * 0.1);
        gameState.exp = Math.max(0, gameState.exp - expLost);
        rewardText = `损失${expLost}点经验`;
    }
    
    // 更新战斗结果弹窗
    document.getElementById('battle-result-text').textContent = resultText;
    document.getElementById('battle-reward-text').textContent = rewardText;
    
    // 显示战斗结果
    setTimeout(() => {
        showPopup('battle-result-popup');
        toggleModal('battle-modal');
        
        // 清理战斗状态
        gameState.currentBattle = null;
        
        // 更新UI
        updateUI();
        updateBattleStatsPanel();
        checkBossChallengeCondition();
        
        // 保存游戏状态
        saveGameState();
    }, 1500);
}

// 结束神兽战斗
function endBossBattle(victory, flee = false) {
    if (!gameState.currentBossBattle) return;
    
    // 清除战斗循环
    if (battleInterval) {
        clearInterval(battleInterval);
        battleInterval = null;
    }
    
    gameState.currentBossBattle.inProgress = false;
    
    // 更新战斗计数
    gameState.battleCount += 1;
    gameState.bossBattleCount += 1;
    
    let resultText, rewardText = "";
    
    if (victory) {
        // 战斗胜利
        gameState.winCount += 1;
        
        // 获得大量经验
        const expReward = 5000;
        gainExp(expReward);
        
        // 获得大量修炼进度
        const cultivationGain = 1000;
        gameState.stageProgress += cultivationGain;
        checkStageUpCondition();
        
        // 高概率掉落物品
        let itemDropped = false;
        const dropRate = 0.8; // 80%概率掉落装备
        const mythicRate = 0.3; // 30%概率掉落神话装备
        
        if (Math.random() < mythicRate) {
            // 掉落神话装备
            const mythicEquipment = generateMythicEquipment();
            addItemToInventory(mythicEquipment);
            addBossBattleLog(`恭喜！获得了神话装备${mythicEquipment.name}！`);
            itemDropped = true;
        } else if (Math.random() < dropRate) {
            // 掉落普通装备
            const newEquipment = generateRandomEquipment('legendary');
            addItemToInventory(newEquipment);
            addBossBattleLog(`战斗胜利！获得了${newEquipment.name}！`);
            itemDropped = true;
        }
        
        // 必定获得突破丹
        const breakthroughItem = {
            name: `${realms[gameState.realm].name}突破丹`,
            type: 'breakthrough',
            realm: gameState.realm,
            description: `用于突破至${realms[gameState.realm + 1]?.name || '下一境界'}的丹药`,
            stackable: true,
            quantity: 3 // 一次获得3个
        };
        addItemToInventory(breakthroughItem);
        addBossBattleLog(`获得3颗${breakthroughItem.name}！`);
        
        // 更新结果文本
        resultText = "神兽挑战胜利！";
        rewardText = `获得${expReward}经验，${cultivationGain}修炼进度，3颗突破丹 ${itemDropped ? '和1件珍贵装备' : ''}`;
    } else if (flee) {
        // 成功逃跑
        resultText = "成功逃脱！";
        rewardText = "没有获得奖励";
    } else {
        // 战斗失败
        resultText = "神兽挑战失败！";
        rewardText = "损失大量经验";
        
        // 失败惩罚 - 失去当前经验的30%
        const expLost = Math.floor(gameState.exp * 0.3);
        gameState.exp = Math.max(0, gameState.exp - expLost);
        rewardText = `损失${expLost}点经验`;
    }
    
    // 更新战斗结果弹窗
    document.getElementById('battle-result-text').textContent = resultText;
    document.getElementById('battle-reward-text').textContent = rewardText;
    
    // 显示战斗结果
    setTimeout(() => {
        showPopup('battle-result-popup');
        toggleModal('battle-modal');
        
        // 清理战斗状态
        gameState.currentBossBattle = null;
        
        // 更新UI
        updateUI();
        updateBattleStatsPanel();
        
        // 保存游戏状态
        saveGameState();
    }, 1500);
}

// 生成随机装备
function generateRandomEquipment(minRarity = 'common') {
    const slots = [
        'weaponMain', 'weaponOff', 'armor', 'shoulder', 
        'cape', 'head', 'ring1', 'ring2', 'amulet'
    ];
    
    const rarities = [
        { name: 'common', weight: 50, prefix: '' },
        { name: 'rare', weight: 30, prefix: '优质的' },
        { name: 'epic', weight: 15, prefix: '卓越的' },
        { name: 'legendary', weight: 5, prefix: '传说的' }
    ];
    
    // 根据最小稀有度过滤
    const minIndex = rarities.findIndex(r => r.name === minRarity);
    const availableRarities = minIndex !== -1 ? rarities.slice(minIndex) : rarities;
    
    // 随机选择槽位
    const slot = slots[Math.floor(Math.random() * slots.length)];
    
    // 随机选择稀有度（带权重）
    let totalWeight = availableRarities.reduce((sum, r) => sum + r.weight, 0);
    let random = Math.random() * totalWeight;
    let rarity = availableRarities[0];
    
    for (let r of availableRarities) {
        random -= r.weight;
        if (random <= 0) {
            rarity = r;
            break;
        }
    }
    
    // 根据槽位生成装备名称
    const baseNames = {
        weaponMain: ['长剑', '大刀', '法杖', '长枪'],
        weaponOff: ['匕首', '短棍', '副手盾', '拳套'],
        armor: ['皮甲', '铁甲', '布甲', '链甲'],
        shoulder: ['肩甲', '护肩', '肩垫', '肩铠'],
        cape: ['披风', '斗篷', '围巾', '法袍'],
        head: ['头盔', '帽子', '头巾', '头冠'],
        ring1: ['铁戒', '铜戒', '银戒', '金戒'],
        ring2: ['铁戒', '铜戒', '银戒', '金戒'],
        amulet: ['护身符', '项链', '吊坠', '徽章']
    };
    
    const baseName = baseNames[slot][Math.floor(Math.random() * baseNames[slot].length)];
    const name = `${rarity.prefix}${baseName}`;
    
    // 根据稀有度生成属性
    const rarityMultiplier = {
        'common': 1,
        'rare': 1.5,
        'epic': 2.5,
        'legendary': 4
    };
    
    const levelFactor = Math.max(1, gameState.level / 10);
    const multiplier = rarityMultiplier[rarity.name] * levelFactor;
    
    let attack = 0, defense = 0, spiritual = 0, dao = 0, magic = 0;
    
    // 根据槽位生成主要属性
    switch (slot) {
        case 'weaponMain':
        case 'weaponOff':
            attack = Math.floor(Math.random() * 10 * multiplier) + 1;
            magic = Math.floor(Math.random() * 5 * multiplier) + 1;
            break;
        case 'armor':
        case 'shoulder':
            defense = Math.floor(Math.random() * 10 * multiplier) + 1;
            dao = Math.floor(Math.random() * 5 * multiplier) + 1;
            break;
        case 'cape':
        case 'head':
            defense = Math.floor(Math.random() * 5 * multiplier) + 1;
            spiritual = Math.floor(Math.random() * 5 * multiplier) + 1;
            break;
        case 'ring1':
        case 'ring2':
        case 'amulet':
            spiritual = Math.floor(Math.random() * 5 * multiplier) + 1;
            dao = Math.floor(Math.random() * 5 * multiplier) + 1;
            magic = Math.floor(Math.random() * 5 * multiplier) + 1;
            break;
    }
    
    // 生成描述
    const descriptions = [
        `一件${rarity.prefix}${baseName}，能增强持有者的能力`,
        `品质优良的${baseName}，适合${realms[gameState.realm].name}使用`,
        `经过精心打造的${baseName}，蕴含灵力`,
        `具有神秘力量的${baseName}，能提升战斗力`
    ];
    
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    return {
        name: name,
        type: 'equipment',
        slot: slot,
        attack: attack,
        defense: defense,
        spiritual: spiritual,
        dao: dao,
        magic: magic,
        rarity: rarity.name,
        description: description,
        stackable: false
    };
}

// 生成神话装备
function generateMythicEquipment() {
    const mythicEquipment = [
        {
            name: "鸿蒙开天剑",
            slot: "weaponMain",
            description: "蕴含开天辟地之力的神剑，能斩断世间万物",
            affixes: [
                { name: "攻击力", value: 100 },
                { name: "暴击率", value: 20 },
                { name: "灵气", value: 50 }
            ]
        },
        {
            name: "混沌不灭甲",
            slot: "armor",
            description: "由混沌之气锻造的神甲，刀枪不入，水火不侵",
            affixes: [
                { name: "防御力", value: 80 },
                { name: "生命值", value: 300 },
                { name: "道基", value: 50 }
            ]
        },
        {
            name: "太虚神行靴",
            slot: "cape",
            description: "踏虚空而行，瞬息千里，闪避一切攻击",
            affixes: [
                { name: "闪避率", value: 30 },
                { name: "速度", value: 50 },
                { name: "悟性", value: 30 }
            ]
        },
        {
            name: "轮回生死戒",
            slot: "ring1",
            description: "掌控生死轮回之力，能起死回生",
            affixes: [
                { name: "生命恢复", value: 20 },
                { name: "灵力恢复", value: 30 },
                { name: "机缘", value: 50 }
            ]
        },
        {
            name: "万象归一冠",
            slot: "head",
            description: "洞察世间万象，看破一切虚妄",
            affixes: [
                { name: "神魂", value: 80 },
                { name: "法术强度", value: 50 },
                { name: "悟性", value: 50 }
            ]
        }
    ];
    
    // 随机选择一个神话装备
    const randomIndex = Math.floor(Math.random() * mythicEquipment.length);
    const equipment = mythicEquipment[randomIndex];
    
    // 返回神话装备，增加必要属性
    return {
        ...equipment,
        type: 'equipment',
        rarity: 'mythic',
        stackable: false
    };
}
    