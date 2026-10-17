import { Attributes } from "./Attributes.ts";
import { ATTRIBUTES, LEVEL_THRESHOLDS } from "./gameData.ts";
import { EquipmentSlot } from "./EquipmentSlot.ts";
import { Item } from "./Item.ts";
import { Skill } from "./Skill.ts";
import type {
    AttributesData,
    Items,
    Slots,
    Skills,
    Buffs,
    AttributeName,
    TextKey
} from "./interfaces.ts";

/** Shared data and resources for all players and enemies. */
export abstract class Character {
    private _name: TextKey;
    private _health: number;
    private _maxHealth: number;
    private _mana: number;
    private _maxMana: number;
    private _sp: number;
    private _maxSp: number;
    private _initiative: number;
    private _attributes: Record<AttributeName, AttributesData>;
    private _level: number;
    private _inventory: Items[];
    private _equipmentSlots: Slots[];
    private _skills: Skills[];
    private _buffs: Buffs[];

    /** Initialize the character with a name key and neutral values. */
    protected constructor(name: TextKey) {
        this._name = name;
        this._health = 1;
        this._maxHealth = 1;
        this._mana = 1;
        this._maxMana = 1;
        this._sp = 1;
        this._maxSp = 1;
        this._initiative = 1;
        this._attributes = {
            strength: new Attributes(ATTRIBUTES.strength.description, ATTRIBUTES.strength.value),
            dexterity: new Attributes(ATTRIBUTES.dexterity.description, ATTRIBUTES.dexterity.value),
            intelligence: new Attributes(
                ATTRIBUTES.intelligence.description,
                ATTRIBUTES.intelligence.value
            ),
            wisdom: new Attributes(ATTRIBUTES.wisdom.description, ATTRIBUTES.wisdom.value),
            luck: new Attributes(ATTRIBUTES.luck.description, ATTRIBUTES.luck.value)
        };
        this._level = 1;
        this._inventory = [];
        this._equipmentSlots = [];
        this._skills = [];
        this._buffs = [];
    }

    // Getters
    /** Return the locale key for the character name. */
    public getName(): TextKey {
        return this._name;
    }
    /** Return the current health points. */
    public getHealth(): number {
        return this._health;
    }
    /** Return the maximum health points. */
    public getMaxHealth(): number {
        return this._maxHealth;
    }
    /** Return the current mana. */
    public getMana(): number {
        return this._mana;
    }
    /** Return the maximum mana. */
    public getMaxMana(): number {
        return this._maxMana;
    }
    /** Return the current SP. */
    public getSP(): number {
        return this._sp;
    }
    /** Return the maximum SP. */
    public getMaxSP(): number {
        return this._maxSp;
    }
    /** Return the initiative for the future turn order. */
    public getInitiative(): number {
        return this._initiative;
    }
    /** Return the current level. */
    public getLevel(): number {
        return this._level;
    }
    /** Return independent copies of all five attributes. */
    public getAttributes(): Record<AttributeName, AttributesData> {
        return {
            strength: { ...this._attributes.strength },
            dexterity: { ...this._attributes.dexterity },
            intelligence: { ...this._attributes.intelligence },
            wisdom: { ...this._attributes.wisdom },
            luck: { ...this._attributes.luck }
        };
    }
    /** Return a copy of the inventory list. */
    public getInventory(): Items[] {
        return [...this._inventory];
    }
    /** Return a copy of the equipment slot list. */
    public getEquipmentSlots(): Slots[] {
        return [...this._equipmentSlots];
    }
    /** Return a copy of the skill list. */
    public getSkills(): Skills[] {
        return [...this._skills];
    }
    /** Return a copy of the buff list; buff objects remain shared references. */
    public getBuffs(): Buffs[] {
        return [...this._buffs];
    }

    // Setters
    /** Set the locale key for the character name. */
    public setName(name: TextKey): void {
        this._name = name;
    }
    /** Clamp health between zero and its maximum; zero indicates death. */
    public setHealth(health: number): void {
        this._health = this._clampResource(health, this._maxHealth);
    }
    /** Set maximum health to at least one without automatically restoring health. */
    public setMaxHealth(maxHealth: number): void {
        this._validateNumber(maxHealth, 1);
        this._maxHealth = maxHealth;
        this.setHealth(this._health);
    }
    /** Clamp mana between zero and its maximum. */
    public setMana(mana: number): void {
        this._mana = this._clampResource(mana, this._maxMana);
    }
    /** Set non-negative maximum mana and clamp the current mana. */
    public setMaxMana(maxMana: number): void {
        this._validateNumber(maxMana, 0);
        this._maxMana = maxMana;
        this.setMana(this._mana);
    }
    /** Clamp SP between zero and its maximum. */
    public setSp(sp: number): void {
        this._sp = this._clampResource(sp, this._maxSp);
    }
    /** Set non-negative maximum SP and clamp the current SP. */
    public setMaxSp(maxSp: number): void {
        this._validateNumber(maxSp, 0);
        this._maxSp = maxSp;
        this.setSp(this._sp);
    }
    /** Set a finite, non-negative initiative. */
    public setInitiative(initiative: number): void {
        this._validateNumber(initiative, 0);
        this._initiative = initiative;
    }
    /** Set an integer level of at least one. */
    public setLevel(level: number): void {
        this._validateNumber(level, 1);
        if (!Number.isSafeInteger(level)) {
            throw new RangeError("level must be an integer");
        }
        this._level = level;
    }
    /** Set an attribute to a finite, non-negative value. */
    public setAttribute(attribute: AttributeName, value: number): void {
        this._validateNumber(value, 0);
        this._attributes[attribute].value = value;
    }
    /** Replace the inventory; item IDs must be unique and not already equipped. */
    public setInventory(inventory: Items[]): void {
        const ITEMS = inventory.map((item) => new Item(item));
        this._validateUniqueIds(ITEMS);
        const EQUIPPED_IDS = new Set(
            this._equipmentSlots.flatMap((slot) => (slot.item ? [slot.item.id] : []))
        );
        if (ITEMS.some((item) => EQUIPPED_IDS.has(item.id))) {
            throw new RangeError("item is already equipped");
        }
        this._inventory = ITEMS;
    }
    /** Replace slots after validating types, unique IDs and exclusive item ownership. */
    public setEquipmentSlots(slots: Slots[]): void {
        const SLOTS = slots.map((slot) => new EquipmentSlot(slot));
        this._validateUniqueIds(SLOTS);
        const ITEMS = SLOTS.flatMap((slot) => (slot.item ? [slot.item] : []));
        this._validateUniqueIds(ITEMS);
        const INVENTORY_IDS = new Set(this._inventory.map((item) => item.id));
        if (ITEMS.some((item) => INVENTORY_IDS.has(item.id))) {
            throw new RangeError("equipped item is still in inventory");
        }
        this._equipmentSlots = SLOTS;
    }
    /** Replace skills with validated, immutable definitions with unique IDs. */
    public setSkills(skills: Skills[]): void {
        const SKILLS = skills.map((skill) => new Skill(skill));
        this._validateUniqueIds(SKILLS);
        this._skills = SKILLS;
    }
    /** Replace the buff list while retaining references to its objects. */
    public setBuffs(buffs: Buffs[]): void {
        this._buffs = [...buffs];
    }

    /** Check whether the character has more than zero health. */
    public isAlive(): boolean {
        return this._health > 0;
    }

    /** Apply non-negative damage and return the actual health lost. */
    public takeDamage(amount: number): number {
        this._validateNumber(amount, 0);
        const PREVIOUS_HEALTH = this._health;
        this.setHealth(this._health - amount);
        return PREVIOUS_HEALTH - this._health;
    }

    /** Heal up to maximum health without reviving dead characters. */
    public heal(amount: number): number {
        this._validateNumber(amount, 0);
        if (!this.isAlive()) {
            return 0;
        }
        const PREVIOUS_HEALTH = this._health;
        // Clamp before addition to avoid overflow with large finite values.
        this.setHealth(this._health + Math.min(amount, this._maxHealth - this._health));
        return this._health - PREVIOUS_HEALTH;
    }

    /** Equip an inventory item and return the previous slot item to the inventory. */
    public equipItem(itemId: string, slotId: string): void {
        const ITEM_INDEX = this._inventory.findIndex((item) => item.id === itemId);
        const SLOT_INDEX = this._equipmentSlots.findIndex((slot) => slot.id === slotId);
        if (ITEM_INDEX === -1 || SLOT_INDEX === -1) {
            throw new RangeError("inventory item or equipment slot not found");
        }
        const SLOT = this._equipmentSlots[SLOT_INDEX];
        const NEXT_SLOT = new EquipmentSlot({ ...SLOT, item: this._inventory[ITEM_INDEX] });
        const INVENTORY = this._inventory.filter((_, index) => index !== ITEM_INDEX);
        if (SLOT.item !== null) {
            INVENTORY.push(SLOT.item);
        }
        this._inventory = INVENTORY;
        this._equipmentSlots[SLOT_INDEX] = NEXT_SLOT;
    }

    /** Move a slot item into the inventory; return null for an empty slot. */
    public unequipItem(slotId: string): Items | null {
        const SLOT_INDEX = this._equipmentSlots.findIndex((slot) => slot.id === slotId);
        if (SLOT_INDEX === -1) {
            throw new RangeError("equipment slot not found");
        }
        const SLOT = this._equipmentSlots[SLOT_INDEX];
        if (SLOT.item === null) {
            return null;
        }
        this._inventory.push(SLOT.item);
        this._equipmentSlots[SLOT_INDEX] = new EquipmentSlot({ ...SLOT, item: null });
        return SLOT.item;
    }

    /** Check skill ownership, life state, mana and SP without spending resources. */
    public canUseSkill(skillId: string): boolean {
        const SKILL =
            this._skills.find((skill) => skill.id === skillId) ??
            this._equipmentSlots
                .flatMap((slot) => slot.item?.skill ?? [])
                .find((skill) => skill.id === skillId);
        return (
            SKILL !== undefined &&
            this.isAlive() &&
            this._mana >= SKILL.manaCost &&
            this._sp >= SKILL.spCost
        );
    }

    /** Prevent ambiguous IDs within a collection. */
    private _validateUniqueIds(entries: readonly { readonly id: string }[]): void {
        const IDS = new Set(entries.map((entry) => entry.id));
        if (IDS.size !== entries.length || entries.some((entry) => entry.id.trim() === "")) {
            throw new RangeError("ids must be non-empty and unique");
        }
    }

    /** Resource management: clamp health, mana and SP between zero and their maximum. */
    private _clampResource(value: number, maximum: number): number {
        if (!Number.isFinite(value)) {
            throw new RangeError("resource must be finite");
        }
        return Math.max(0, Math.min(value, maximum));
    }

    /** Validate a finite number against its lower bound. */
    private _validateNumber(value: number, minimum: number): void {
        if (!Number.isFinite(value) || value < minimum) {
            throw new RangeError("value must be finite and meet the minimum");
        }
    }
}

/** Playable character with an experience-based level. */
export abstract class Player extends Character {
    private _experience: number;

    /** Initialize a playable character with zero experience. */
    protected constructor(name: TextKey) {
        super(name);
        this._experience = 0;
    }

    /** Return the total experience earned so far. */
    public getExperience(): number {
        return this._experience;
    }
    /** Return a copy of the cumulative experience thresholds. */
    public getLevelThresholds(): readonly number[] {
        return [...LEVEL_THRESHOLDS];
    }

    /** Set total experience and recalculate the corresponding level. */
    public setExperience(experience: number): void {
        if (!Number.isSafeInteger(experience) || experience < 0) {
            throw new RangeError("experience must be a non-negative safe integer");
        }
        this._experience = experience;
        this._updateLevel();
    }

    /** Experience system: add XP and apply every level reached through cumulative thresholds. */
    public addExperience(experience: number): void {
        if (!Number.isSafeInteger(experience) || experience < 0) {
            throw new RangeError("experience must be a non-negative safe integer");
        }
        this.setExperience(this._experience + experience);
    }

    /** Return the highest level with a configured experience threshold. */
    public getMaxLevel(): number {
        return LEVEL_THRESHOLDS.length + 1;
    }

    /** Return experience needed for the next level, or null at the maximum level. */
    public getExperienceToNextLevel(): number | null {
        const THRESHOLD = LEVEL_THRESHOLDS[this.getLevel() - 1];
        return THRESHOLD === undefined ? null : THRESHOLD - this._experience;
    }

    /** Reset the level and experience to its entry threshold. */
    public override setLevel(level: number): void {
        if (!Number.isSafeInteger(level) || level < 1 || level > this.getMaxLevel()) {
            throw new RangeError("level must be within the configured player levels");
        }
        this.setExperience(level === 1 ? 0 : LEVEL_THRESHOLDS[level - 2]);
    }

    /** Grant the experience for one level; leave the state unchanged at the maximum. */
    public levelUp(): boolean {
        const THRESHOLD = LEVEL_THRESHOLDS[this.getLevel() - 1];
        if (THRESHOLD === undefined) {
            return false;
        }
        this.setExperience(THRESHOLD);
        return true;
    }

    /** Derive the level from cumulative experience thresholds. */
    private _updateLevel(): void {
        let level = 1;
        for (const THRESHOLD of LEVEL_THRESHOLDS) {
            if (this._experience < THRESHOLD) {
                break;
            }
            level += 1;
        }
        super.setLevel(level);
    }
}

// New player classes extend Player; later specializations can extend Mage.
/** Extensible base for warriors and future warrior specializations. */
export class Warrior extends Player {
    /** Create a warrior with a stable name key. */
    public constructor(name: TextKey = "character.warrior.name") {
        super(name);
    }
}

/** Extensible base for mages and future mage specializations. */
export class Mage extends Player {
    /** Create a mage with a stable name key. */
    public constructor(name: TextKey = "character.mage.name") {
        super(name);
    }
}

/** Enemy base without AI, loot distribution or combat calculations. */
export class NPC extends Character {
    public readonly enemyType: string;

    /** Create an enemy with a locale key and stable type identifier. */
    public constructor(name: TextKey = "character.npc.name", enemyType: string = "generic") {
        super(name);
        this.enemyType = enemyType;
    }
}

/** Melee enemy type as a base for future specific enemies. */
export class MeleeEnemy extends NPC {
    /** Create a melee enemy without predefined balancing. */
    public constructor(name: TextKey = "enemy.melee.name") {
        super(name, "melee");
    }
}

/** Ranged enemy type as a base for future specific enemies. */
export class RangedEnemy extends NPC {
    /** Create a ranged enemy without predefined balancing. */
    public constructor(name: TextKey = "enemy.ranged.name") {
        super(name, "ranged");
    }
}
