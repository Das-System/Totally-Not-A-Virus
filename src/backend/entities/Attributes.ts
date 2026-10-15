import { AttributesData } from "./interfaces";

export class Attributes implements AttributesData {
    public description: string;
    public value: number;

    constructor(description: string, value: number) {
        this.description = description;
        this.value = value;
    }
}