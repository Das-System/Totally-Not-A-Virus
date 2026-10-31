import type { AttributesData, TextKey } from "./interfaces.ts";

/** Attribute value with a locale key for its description. */
export class Attributes implements AttributesData {
    public description: TextKey;
    public value: number;

    /** Associate a numeric attribute value with its description key. */
    constructor(description: TextKey, value: number) {
        this.description = description;
        this.value = value;
    }
}
