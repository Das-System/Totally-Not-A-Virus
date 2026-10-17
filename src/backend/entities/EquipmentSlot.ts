import type { EquipmentType, Items, Slots, TextKey } from "./interfaces.ts";
import { Item } from "./Item.ts";

/** Equipment slot with a validated type; empty slots contain null. */
export class EquipmentSlot implements Slots {
    public readonly id: string;
    public readonly type: EquipmentType;
    public readonly name: TextKey;
    public readonly description: TextKey;
    public readonly item: Items | null;

    /** Copy an empty slot or one containing a compatible item. */
    public constructor(data: Slots) {
        if (data.item !== null && data.item.slotType !== data.type) {
            throw new RangeError("item does not match equipment slot type");
        }
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.description = data.description;
        this.item = data.item === null ? null : new Item(data.item);
        Object.freeze(this);
    }
}
