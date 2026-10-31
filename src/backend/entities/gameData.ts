import type { AttributesData, AttributeName } from "./interfaces.ts";

export const ATTRIBUTES: Record<AttributeName, AttributesData> = {
    strength: { description: "attribute.strength.description", value: 0 },
    dexterity: { description: "attribute.dexterity.description", value: 0 },
    intelligence: { description: "attribute.intelligence.description", value: 0 },
    wisdom: { description: "attribute.wisdom.description", value: 0 },
    luck: { description: "attribute.luck.description", value: 0 }
};

// Provisional cumulative experience thresholds for levels 2, 3 and 4.
export const LEVEL_THRESHOLDS: readonly number[] = [100, 200, 300];
