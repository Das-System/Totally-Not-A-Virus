import type { AttributeName, Skills, SkillScope, TextKey } from "./interfaces.ts";

/** Immutable skill definition; execution belongs to the future combat system. */
export class Skill implements Skills {
    public readonly id: string;
    public readonly name: TextKey;
    public readonly description: TextKey;
    public readonly scope: SkillScope;
    public readonly manaCost: number;
    public readonly spCost: number;
    public readonly damageMulti: number;
    public readonly damageAttribute: AttributeName;
    public readonly critChance: number;
    public readonly critDamage: number;

    /** Copy skill data, requiring finite, non-negative costs and factors. */
    public constructor(data: Skills) {
        for (const VALUE of [
            data.manaCost,
            data.spCost,
            data.damageMulti,
            data.critChance,
            data.critDamage
        ]) {
            if (!Number.isFinite(VALUE) || VALUE < 0) {
                throw new RangeError("skill values must be finite and non-negative");
            }
        }
        if (data.critChance > 1) {
            throw new RangeError("critChance must be between 0 and 1");
        }
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.scope = data.scope;
        this.manaCost = data.manaCost;
        this.spCost = data.spCost;
        this.damageMulti = data.damageMulti;
        this.damageAttribute = data.damageAttribute;
        this.critChance = data.critChance;
        this.critDamage = data.critDamage;
        Object.freeze(this);
    }
}
