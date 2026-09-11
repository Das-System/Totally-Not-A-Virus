interface Attributes {
    name: string;
    description: string;
    value: number;
}

interface Items {
    name: string;
    description: string;
    attribute: Attributes[];
    skill: Skills[];
}

interface Skills {
    name: string;
    description: string;
    damageMulti: number;
    damageAttribute: Attributes;
    critChance: number;
    critDamage: number;
}
    // private strength: number;
    // private dexterity: number;
    // private intelligence: number;
    // private wisedome: number;
    // private luck: number;

interface Buffs {
    name: string;
    description: string;
    duration: number;
    effect: string;
    singleUse: boolean;
}

interface EquipmentSlots {
    name: string;
    description: string;
    item: Items;
}