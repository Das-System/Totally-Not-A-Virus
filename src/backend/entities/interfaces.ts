export type AttributeName = "strength" | "dexterity" | "intelligence" | "wisdom" | "luck";

export interface AttributesData {
    description: string;
    value: number;
}

export interface Items {
    name: string;
    description: string;
    attribute: AttributesData[];
    skill: Skills[];
}

export interface Skills {
    name: string;
    description: string;
    damageMulti: number;
    damageAttribute: AttributesData;
    critChance: number;
    critDamage: number;
}


export interface Buffs {
    name: string;
    description: string;
    duration: number;
    effect: string;
    singleUse: boolean;
}

export interface Slots {
    name: string;
    description: string;
    item: Items;
}