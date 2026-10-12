export type AttributeName = "strength" | "dexterity" | "intelligence" | "wisdom" | "luck";

export interface Attributes {
    description: string;
    value: number;
}

export interface Items {
    name: string;
    description: string;
    attribute: Attributes[];
    skill: Skills[];
}

export interface Skills {
    name: string;
    description: string;
    damageMulti: number;
    damageAttribute: Attributes;
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