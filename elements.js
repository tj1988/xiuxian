// 元素管理模块 - 集中管理所有DOM元素的选择
const ElementManager = (function() {
    // 获取所有需要用到的DOM元素
    function getElements() {
        return {
            // 加载相关元素
            loadingScreen: document.getElementById('loading-screen'),
            loadingStatus: document.getElementById('loading-status'),
            errorMessage: document.getElementById('error-message'),
            retryButton: document.getElementById('retry-button'),
            
            // 通知元素
            notification: document.getElementById('notification'),
            
            // 战斗统计面板
            totalBattles: document.getElementById('total-battles'),
            bossBattles: document.getElementById('boss-battles'),
            winRate: document.getElementById('win-rate'),
            mythicCount: document.getElementById('mythic-count'),
            
            // 玩家信息元素
            levelBadge: document.getElementById('level-badge'),
            stageBadge: document.getElementById('stage-badge'),
            playerAvatar: document.getElementById('player-avatar'),
            realmDisplay: document.getElementById('realm-display'),
            ascendButton: document.getElementById('ascend-button'),
            
            // 经验和修炼进度元素
            expBar: document.getElementById('exp-bar'),
            expText: document.getElementById('exp-text'),
            expRate: document.getElementById('exp-rate'),
            stageText: document.getElementById('stage-text'),
            stageProgressContainer: document.getElementById('stage-progress-container'),
            stageBar: document.getElementById('stage-bar'),
            
            // 属性面板元素
            spiritualPower: document.getElementById('player-spiritual-power'),
            daoFoundation: document.getElementById('player-dao-foundation'),
            soulPower: document.getElementById('player-soul-power'),
            comprehension: document.getElementById('player-comprehension'),
            luck: document.getElementById('player-luck'),
            magicRegeneration: document.getElementById('magic-regeneration'),
            
            // 战斗力面板元素
            totalAttack: document.getElementById('total-attack'),
            totalDefense: document.getElementById('total-defense'),
            totalMagic: document.getElementById('total-magic'),
            totalPower: document.getElementById('total-power'),
            
            // 操作按钮
            expButton: document.getElementById('exp-button'),
            inventoryButton: document.getElementById('inventory-button'),
            equipmentButton: document.getElementById('equipment-button'),
            spellsButton: document.getElementById('spells-button'),
            meditateButton: document.getElementById('meditate-button'),
            meditationText: document.getElementById('meditation-text'),
            meditationCountdown: document.getElementById('meditation-countdown'),
            battleButton: document.getElementById('battle-button'),
            bossChallengeButton: document.getElementById('boss-challenge-button'),
            
            // 弹窗元素
            levelUpPopup: document.getElementById('level-up-popup'),
            stageUpPopup: document.getElementById('stage-up-popup'),
            equipPopup: document.getElementById('equip-popup'),
            battleResultPopup: document.getElementById('battle-result-popup'),
            battleResultText: document.getElementById('battle-result-text'),
            battleRewardText: document.getElementById('battle-reward-text'),
            ascendSuccessPopup: document.getElementById('ascend-success-popup'),
            newRealmText: document.getElementById('new-realm-text'),
            mythicPopup: document.getElementById('mythic-popup'),
            
            // 境界突破弹窗元素
            ascendModal: document.getElementById('ascend-modal'),
            closeAscend: document.getElementById('close-ascend'),
            cancelAscend: document.getElementById('cancel-ascend'),
            confirmAscend: document.getElementById('confirm-ascend'),
            nextRealmText: document.getElementById('next-realm-text'),
            ascendLevel: document.getElementById('ascend-level'),
            ascendLevelBar: document.getElementById('ascend-level-bar'),
            ascendStage: document.getElementById('ascend-stage'),
            ascendStageBar: document.getElementById('ascend-stage-bar'),
            ascendSpiritual: document.getElementById('ascend-spiritual'),
            ascendSpiritualBar: document.getElementById('ascend-spiritual-bar'),
            ascendDao: document.getElementById('ascend-dao'),
            ascendDaoBar: document.getElementById('ascend-dao-bar'),
            ascendItem: document.getElementById('ascend-item'),
            ascendItemBar: document.getElementById('ascend-item-bar'),
            ascendSpellReward: document.getElementById('ascend-spell-reward'),
            
            // 背包弹窗元素
            inventoryModal: document.getElementById('inventory-modal'),
            closeInventory: document.getElementById('close-inventory'),
            inventoryCount: document.getElementById('inventory-count'),
            itemsContainer: document.getElementById('items-container'),
            
            // 装备弹窗元素
            equipmentModal: document.getElementById('equipment-modal'),
            closeEquipment: document.getElementById('close-equipment'),
            equippedWeaponMain: document.getElementById('equipped-weapon-main'),
            equippedWeaponOff: document.getElementById('equipped-weapon-off'),
            equippedArmor: document.getElementById('equipped-armor'),
            equippedShoulder: document.getElementById('equipped-shoulder'),
            equippedCape: document.getElementById('equipped-cape'),
            equippedHead: document.getElementById('equipped-head'),
            equippedRing1: document.getElementById('equipped-ring1'),
            equippedRing2: document.getElementById('equipped-ring2'),
            equippedAmulet: document.getElementById('equipped-amulet'),
            activatedMythicEquipment: document.getElementById('activated-mythic-equipment'),
            totalSpiritual: document.getElementById('total-spiritual'),
            totalDao: document.getElementById('total-dao'),
            equipmentContainer: document.getElementById('equipment-container'),
            
            // 法术弹窗元素
            spellsModal: document.getElementById('spells-modal'),
            closeSpells: document.getElementById('close-spells'),
            spellsContainer: document.getElementById('spells-container'),
            
            // 战斗弹窗元素
            battleModal: document.getElementById('battle-modal'),
            closeBattle: document.getElementById('close-battle'),
            battlePreparation: document.getElementById('battle-preparation'),
            battleScene: document.getElementById('battle-scene'),
            bossBattleScene: document.getElementById('boss-battle-scene'),
            battleMonsterName: document.getElementById('battle-monster-name'),
            battleMessage: document.getElementById('battle-message'),
            playerHpText: document.getElementById('player-hp-text'),
            playerMpText: document.getElementById('player-mp-text'),
            playerHpBar: document.getElementById('player-hp-bar'),
            playerMpBar: document.getElementById('player-mp-bar'),
            battleMonsterImage: document.getElementById('battle-monster-image'),
            battleMonsterDisplayName: document.getElementById('battle-monster-display-name'),
            monsterHpText: document.getElementById('monster-hp-text'),
            monsterHpBar: document.getElementById('monster-hp-bar'),
            battleLog: document.getElementById('battle-log'),
            attackButton: document.getElementById('attack-button'),
            spellButton: document.getElementById('spell-button'),
            defendButton: document.getElementById('defend-button'),
            fleeButton: document.getElementById('flee-button'),
            spellSelector: document.getElementById('spell-selector'),
            
            // 神兽战斗元素
            bossChallengePanel: document.getElementById('boss-challenge-panel'),
            startBossChallenge: document.getElementById('start-boss-challenge'),
            bossName: document.getElementById('boss-name'),
            bossMessage: document.getElementById('boss-message'),
            bossPlayerHpText: document.getElementById('boss-player-hp-text'),
            bossPlayerMpText: document.getElementById('boss-player-mp-text'),
            bossPlayerHpBar: document.getElementById('boss-player-hp-bar'),
            bossPlayerMpBar: document.getElementById('boss-player-mp-bar'),
            bossImage: document.getElementById('boss-image'),
            bossDisplayName: document.getElementById('boss-display-name'),
            bossHpText: document.getElementById('boss-hp-text'),
            bossHpBar: document.getElementById('boss-hp-bar'),
            bossBattleLog: document.getElementById('boss-battle-log'),
            bossAttackButton: document.getElementById('boss-attack-button'),
            bossSpellButton: document.getElementById('boss-spell-button'),
            bossDefendButton: document.getElementById('boss-defend-button'),
            bossFleeButton: document.getElementById('boss-flee-button'),
            bossSpellSelector: document.getElementById('boss-spell-selector'),
            
            // 调试信息元素
            debugLevel: document.getElementById('debug-level'),
            debugRealm: document.getElementById('debug-realm'),
            debugStage: document.getElementById('debug-stage'),
            debugItemCount: document.getElementById('debug-item-count'),
            debugSpellCount: document.getElementById('debug-spell-count'),
            debugAutoExp: document.getElementById('debug-auto-exp'),
            debugBreakthroughCount: document.getElementById('debug-breakthrough-count'),
            debugMythicCount: document.getElementById('debug-mythic-count'),
            debugBattleCount: document.getElementById('debug-battle-count'),
            autoExpStatus: document.getElementById('auto-exp-status')
        };
    }
    
    return {
        getElements: getElements
    };
})();
    