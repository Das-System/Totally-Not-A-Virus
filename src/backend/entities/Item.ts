import type { AttributeModifiers, EquipmentType, Items, Skills, TextKey } from "./interfaces.ts";
import { Skill } from "./Skill.ts";

/** Immutable item data with an instance ID, slot type, attribute modifiers and skills. */
export class Item implements Items {
    public readonly id: string;
    public readonly name: TextKey;
    public readonly description: TextKey;
    public readonly slotType: EquipmentType | null;
    public readonly attribute: Readonly<AttributeModifiers>;
    public readonly skill: readonly Skills[];

    /** Copy modifiers and skills; negative modifiers are allowed as penalties. */
    public constructor(data: Items) {
        for (const VALUE of Object.values(data.attribute)) {
            if (!Number.isFinite(VALUE)) {
                throw new RangeError("attribute modifiers must be finite");
            }
        }
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.slotType = data.slotType;
        this.attribute = Object.freeze({ ...data.attribute });
        this.skill = Object.freeze(data.skill.map((skill) => new Skill(skill)));
        Object.freeze(this);
    }
}
