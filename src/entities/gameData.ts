import { Attributes, AttributeName } from "./intefaces";

export const ATTRIBUTES: Record<AttributeName, Attributes> = {
    strength: { description: "Your Physical Prowess", value: 0 },
    dexterity: {description: "How Nimble you are", value: 0 },
    intelligence: {description: "Big Brain", value: 0 },
    wisdom: {description: "How wise you are", value: 0 },
    luck: {description: "How Lucky you are", value: 0 }
}