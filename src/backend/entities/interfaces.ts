export type AttributeName = "strength" | "dexterity" | "intelligence" | "wisdom" | "luck";

/** Stable reference; the database or locale interface will resolve the text. */
export type TextKey = string;

/** Skill origin, independent of its future combat calculations. */
export type SkillScope = "class" | "player" | "enemy";

/** Technical slot type, such as hand or head, independent of display text. */
export type EquipmentType = string;

/** Attribute names mapped to additive bonuses or penalties. */
export type AttributeModifiers = Partial<Record<AttributeName, number>>;

export interface AttributesData {
    description: TextKey;
    value: number;
}

/** Item data; id identifies an instance, and a null slotType prevents equipping. */
export interface Items {
    readonly id: string;
    readonly name: TextKey;
    readonly description: TextKey;
    readonly slotType: EquipmentType | null;
    readonly attribute: Readonly<AttributeModifiers>;
    readonly skill: readonly Skills[];
}

/** Skill definition without execution or damage calculations. */
export interface Skills {
    readonly id: string;
    readonly name: TextKey;
    readonly description: TextKey;
    readonly scope: SkillScope;
    readonly manaCost: number;
    readonly spCost: number;
    readonly damageMulti: number;
    readonly damageAttribute: AttributeName;
    readonly critChance: number;
    readonly critDamage: number;
}

export interface Buffs {
    name: TextKey;
    description: TextKey;
    duration: number;
    effect: string;
    singleUse: boolean;
}

/** A specific equipment slot; type determines item compatibility. */
export interface Slots {
    readonly id: string;
    readonly type: EquipmentType;
    readonly name: TextKey;
    readonly description: TextKey;
    readonly item: Items | null;
}
