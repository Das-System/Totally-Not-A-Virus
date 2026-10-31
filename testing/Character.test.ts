import { expect, test } from "@jest/globals";
import {
    Character,
    Player,
    Warrior,
    Mage,
    NPC,
    MeleeEnemy,
    RangedEnemy
} from "../src/backend/entities/Character.ts";

test("Spielklassen, Gegner und spätere Spezialisierungen nutzen die Hierarchie", () => {
    class TestSpecialization extends Mage {}

    for (const PLAYER of [new Warrior(), new Mage(), new TestSpecialization()]) {
        expect(PLAYER instanceof Player).toBeTruthy();
        expect(PLAYER instanceof Character).toBeTruthy();
    }
    const ENEMY = new NPC("enemy.test.name");
    expect(ENEMY instanceof Character).toBeTruthy();
    expect(ENEMY instanceof Player).toBe(false);
    expect(ENEMY.getName()).toBe("enemy.test.name");
});

test("Alle fünf Attribute und ihre Textschlüssel sind pro Charakter unabhängig", () => {
    const FIRST = new Mage();
    const SECOND = new Mage();
    expect(Object.keys(FIRST.getAttributes()).length).toBe(5);
    FIRST.setAttribute("intelligence", 5);
    expect(SECOND.getAttributes().intelligence.value).toBe(0);
    const SNAPSHOT = FIRST.getAttributes();
    SNAPSHOT.intelligence.value = 99;
    expect(FIRST.getAttributes().intelligence.value).toBe(5);
    expect(FIRST.getAttributes().strength.description).toBe("attribute.strength.description");
    expect(FIRST.getName()).toBe("character.mage.name");
});

test("Ressourcen beachten ihre Grenzen und HP bestimmen den Todeszustand", () => {
    const PLAYER = new Warrior();
    PLAYER.setMaxHealth(20);
    PLAYER.setHealth(30);
    expect(PLAYER.getHealth()).toBe(20);
    PLAYER.setMaxHealth(10);
    expect(PLAYER.getHealth()).toBe(10);
    PLAYER.setHealth(-1);
    expect(PLAYER.getHealth()).toBe(0);
    expect(PLAYER.isAlive()).toBe(false);
    PLAYER.setHealth(1);
    expect(PLAYER.isAlive()).toBe(true);
    PLAYER.setMana(-1);
    PLAYER.setSp(99);
    expect(PLAYER.getMana()).toBe(0);
    expect(PLAYER.getSP()).toBe(PLAYER.getMaxSP());
    PLAYER.setMaxSp(0);
    PLAYER.setMaxMana(0);
    expect(PLAYER.getSP()).toBe(0);
    expect(PLAYER.getMana()).toBe(0);
    expect(() => PLAYER.setHealth(NaN)).toThrow(RangeError);
    expect(() => PLAYER.setMana(Infinity)).toThrow(RangeError);
    expect(() => PLAYER.setMaxHealth(0)).toThrow(RangeError);
    expect(() => PLAYER.setMaxSp(-1)).toThrow(RangeError);
    expect(() => PLAYER.setLevel(1.5)).toThrow(RangeError);
});

test("Gesamterfahrung berücksichtigt Grenzen und mehrere Levelaufstiege", () => {
    const PLAYER = new Warrior();
    PLAYER.addExperience(99);
    expect(PLAYER.getLevel()).toBe(1);
    PLAYER.addExperience(1);
    expect(PLAYER.getLevel()).toBe(2);
    PLAYER.addExperience(200);
    expect(PLAYER.getExperience()).toBe(300);
    expect(PLAYER.getLevel()).toBe(4);
    PLAYER.addExperience(1000);
    expect(PLAYER.getLevel()).toBe(4);
    PLAYER.setExperience(0);
    expect(PLAYER.getLevel()).toBe(1);
    expect(() => PLAYER.addExperience(-1)).toThrow(RangeError);
    expect(() => PLAYER.setExperience(NaN)).toThrow(RangeError);
    expect(() => PLAYER.addExperience(0.5)).toThrow(RangeError);
    PLAYER.setExperience(Number.MAX_SAFE_INTEGER);
    expect(() => PLAYER.addExperience(1)).toThrow(RangeError);
    expect(PLAYER.getExperience()).toBe(Number.MAX_SAFE_INTEGER);
});

test("Leere Ausrüstungsslots und kopierte Sammlungen sind möglich", () => {
    const PLAYER = new Mage();
    const SLOTS = [
        {
            id: "main-hand",
            type: "hand",
            name: "slot.hand.name",
            description: "slot.hand.description",
            item: null
        }
    ];
    PLAYER.setEquipmentSlots(SLOTS);
    SLOTS.pop();
    expect(PLAYER.getEquipmentSlots().length).toBe(1);
    expect(PLAYER.getEquipmentSlots()[0].item).toBe(null);
    PLAYER.getEquipmentSlots().pop();
    expect(PLAYER.getEquipmentSlots().length).toBe(1);
    expect(PLAYER.getInventory()).toEqual([]);
    expect(PLAYER.getSkills()).toEqual([]);
    expect(PLAYER.getBuffs()).toEqual([]);
});

test("Direkte Leveländerungen halten Level und Erfahrung konsistent", () => {
    const PLAYER = new Mage();
    PLAYER.setExperience(150);
    PLAYER.setLevel(3);
    expect(PLAYER.getLevel()).toBe(3);
    expect(PLAYER.getExperience()).toBe(200);
    expect(PLAYER.getExperienceToNextLevel()).toBe(100);
    PLAYER.setLevel(1);
    expect(PLAYER.getExperience()).toBe(0);
    expect(() => PLAYER.setLevel(PLAYER.getMaxLevel() + 1)).toThrow(RangeError);
    expect(() => PLAYER.setLevel(1.5)).toThrow(RangeError);
    expect(PLAYER.getLevel()).toBe(1);
    expect(PLAYER.getExperience()).toBe(0);
});

test("LevelUp ergänzt die fehlenden XP und endet am konfigurierten Maximum", () => {
    const PLAYER = new Warrior();
    PLAYER.setExperience(75);
    expect(PLAYER.getExperienceToNextLevel()).toBe(25);
    expect(PLAYER.levelUp()).toBe(true);
    expect(PLAYER.getLevel()).toBe(2);
    expect(PLAYER.getExperience()).toBe(100);
    PLAYER.setLevel(PLAYER.getMaxLevel());
    PLAYER.addExperience(50);
    const EXPERIENCE = PLAYER.getExperience();
    expect(PLAYER.getExperienceToNextLevel()).toBe(null);
    expect(PLAYER.levelUp()).toBe(false);
    expect(PLAYER.getExperience()).toBe(EXPERIENCE);
});

test("Nah- und Fernkampfgegner behalten ihre eigene Typkennung", () => {
    const MELEE = new MeleeEnemy();
    const RANGED = new RangedEnemy();
    expect(MELEE instanceof NPC).toBeTruthy();
    expect(RANGED instanceof NPC).toBeTruthy();
    expect(MELEE.enemyType).toBe("melee");
    expect(RANGED.enemyType).toBe("ranged");
    expect(MELEE.getName()).toBe("enemy.melee.name");
    expect(RANGED.getName()).toBe("enemy.ranged.name");
});

test("Schaden und Heilung liefern die tatsächliche Änderung und beachten den Tod", () => {
    const PLAYER = new Warrior();
    PLAYER.setMaxHealth(20);
    PLAYER.setHealth(20);
    expect(PLAYER.takeDamage(7)).toBe(7);
    expect(PLAYER.heal(99)).toBe(7);
    expect(PLAYER.heal(1)).toBe(0);
    expect(PLAYER.takeDamage(99)).toBe(20);
    expect(PLAYER.isAlive()).toBe(false);
    expect(PLAYER.heal(20)).toBe(0);
    expect(PLAYER.takeDamage(1)).toBe(0);
    expect(() => PLAYER.takeDamage(-1)).toThrow(RangeError);
    expect(() => PLAYER.heal(NaN)).toThrow(RangeError);
    expect(() => PLAYER.takeDamage(Infinity)).toThrow(RangeError);
});

test("Heilung vermeidet Überläufe bei sehr großen endlichen Werten", () => {
    const PLAYER = new Mage();
    PLAYER.setMaxHealth(Number.MAX_VALUE);
    PLAYER.setHealth(Number.MAX_VALUE / 2);
    PLAYER.heal(Number.MAX_VALUE);
    expect(PLAYER.getHealth()).toBe(Number.MAX_VALUE);
});
