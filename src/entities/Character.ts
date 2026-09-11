abstract class Character {
    private name: string;
    private health: number;
    private maxHealth: number;
    private mana: number;
    private maxMana: number;
    private sp: number;
    private maxSp: number;
    private initiative: number;
    private attributes: Attributes[];
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
    public getAttributes(): Attributes[] {
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
    public setAttributes(attributes: Attributes[]): void {
        this.attributes = attributes;
    }
    public setLevel(level: number): void {
        this.level = level;
    }
    public setEquipmentSlots(slots: Slots[]): void {
        this.equipmentSlots = slots;
    }
}