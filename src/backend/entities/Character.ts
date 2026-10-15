import { Attributes } from "./Attributes.ts";
import { ATTRIBUTES } from "./gameData.ts";
import { AttributesData, Items, Slots, Skills, Buffs, AttributeName } from "./interfaces.ts"

abstract class Character {
    private name: string;
    private health: number;
    private maxHealth: number;
    private mana: number;
    private maxMana: number;
    private sp: number;
    private maxSp: number;
    private initiative: number;
    private attributes: Record<AttributeName, AttributesData>;
    private level: number;
    private inventory: Items[];
    private equipmentSlots: Slots[];
    private skills: Skills[];
    private buffs: Buffs[];

    // Getter
    public getName(): string {
        return this.name;
    }
    public getHealth(): number {
        return this.health;
    }
    public getMaxHealth(): number {
        return this.maxHealth;
    }
    public getMana(): number {
        return this.mana;
    }
    public getMaxMana(): number {
        return this.maxMana;
    }
    public getSP(): number{
        return this.sp;
    }
    public getMaxSP(): number{
        return this.maxSp;
    }
    public getInitiative(): number {
        return this.initiative
    }
    public getAttributes(): Record<AttributeName, AttributesData> {
        return this.attributes;
    }
    public getLevel(): number{
        return this.level;
    }
    public getInventory(): Items[]{
        return this.inventory
    }
    public getEquipmentSlots(): Slots[]{
        return this.equipmentSlots;
    }
    public getSkills(): Skills[]{
        return this.skills;
    }
    public getBuffs(): Buffs[]{
        return this.buffs;
    }

    // Setter

    public setName(name: string): void {
        this.name = name;
    }
    public setHealth(health: number): void {
        this.health = health;
    }
    public setMaxHealth(maxHealth: number): void {
        this.maxHealth = maxHealth;
    }
    public setMana(mana: number): void {
        this.mana = mana;
    }
    public setMaxMana(maxMana: number): void {
        this.maxMana = maxMana;
    }
    public setSp(sp: number): void {
        this.sp = sp;
    }
    public setMaxSp(maxSp: number): void {
        this.maxSp = maxSp;
    }
    public setInitiative(initiative: number): void {
        this.initiative = initiative
    }
    // public setAttributes(attributes: Attributes[]): void {
    //     this.attributes = attributes;
    // }
    public setLevel(level: number): void {
        this.level = level;
    }
    public setEquipmentSlots(slots: Slots[]): void {
        this.equipmentSlots = slots;
    }

    // Methods

    constructor() {
        this.name = "Paul";
        this.health = 1;
        this.maxHealth = 1;
        this.mana = 1;
        this.maxMana = 1;
        this.sp = 1;
        this.maxSp = 1;
        this.initiative = 1;
        this.attributes = {
            strength: new Attributes(ATTRIBUTES.strength.description, ATTRIBUTES.strength.value),
            intelligence: new Att
        };
        this.level = 1;
        this.inventory = [];
        this.equipmentSlots = [];
        this.skills = [];
        this.buffs = [];
    }

    private doDMG():number {
        // ToDo: Implement stuff
        return 0;
    }

    public getDMG(): number {
        // ToDo: Implement stuff
        return 0;
    }
}

class Player extends Character {
    private experience: number;
    private LEVELTHREASHHOLD: number[];

    // Getter

    public getExperience(): number{
        return this.experience
    }
    public getLEVELTHRESHHOLD(): number[]{
        return this.LEVELTHREASHHOLD
    }

    // Setter

    public setExperience(experience: number): void {
        this.experience += experience;
        if (this.experience >= this.LEVELTHREASHHOLD[this.getLevel()+1]) {
            this.levelUp()
        }
    }

    // Methods

    constructor() {
        super();
        this.experience = 0;
        // ToDo: Implement stuff here
        this.LEVELTHREASHHOLD = [
            100,200,300
        ];
    }

    private levelUp(): void {

    }


}
