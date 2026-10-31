import { expect, test } from "@jest/globals";
import { Mage } from "../src/backend/entities/Character.ts";
import { EquipmentSlot } from "../src/backend/entities/EquipmentSlot.ts";
import { Item } from "../src/backend/entities/Item.ts";
import { Skill } from "../src/backend/entities/Skill.ts";
import type { Items, Skills, Slots } from "../src/backend/entities/interfaces.ts";

/** Create neutral test data without final skill balancing. */
function createSkillData(scope: Skills["scope"] = "class"): Skills {
    return {
        id: "test-skill",
        name: "skill.test.name",
        description: "skill.test.description",
        scope,
        manaCost: 2,
        spCost: 1,
        damageMulti: 1,
        damageAttribute: "intelligence",
        critChance: 0.1,
        critDamage: 1.5
    };
}

/** Create a test item with explicitly named attribute modifiers. */
function createItemData(): Items {
    return {
        id: "test-staff",
        name: "item.test.name",
        description: "item.test.description",
        slotType: "hand",
        attribute: { intelligence: 3, strength: -1 },
        skill: [createSkillData()]
    };
}

/** Create an equipment slot for compatibility checks. */
function createSlotData(item: Items | null): Slots {
    return {
        id: "main-hand",
        type: "hand",
        name: "slot.hand.name",
        description: "slot.hand.description",
        item
    };
}

test("Skills unterscheiden ihre Herkunft und referenzieren Attribute über Namen", () => {
    for (const SCOPE of ["class", "player", "enemy"] as const) {
        const SKILL = new Skill(createSkillData(SCOPE));
        expect(SKILL.scope).toBe(SCOPE);
        expect(SKILL.damageAttribute).toBe("intelligence");
        expect(SKILL.manaCost).toBe(2);
        expect(SKILL.spCost).toBe(1);
        expect(Reflect.set(SKILL, "manaCost", 999)).toBe(false);
    }
    expect(() => new Skill({ ...createSkillData(), manaCost: -1 })).toThrow(RangeError);
    expect(() => new Skill({ ...createSkillData(), spCost: Infinity })).toThrow(RangeError);
    expect(() => new Skill({ ...createSkillData(), critChance: 1.1 })).toThrow(RangeError);
});

test("Itemdefinitionen isolieren Boni und Skills von den Eingabedaten", () => {
    const MODIFIERS = { intelligence: 3, strength: -1 };
    const SKILLS = [createSkillData()];
    const ITEM = new Item({ ...createItemData(), attribute: MODIFIERS, skill: SKILLS });
    MODIFIERS.intelligence = 99;
    SKILLS.length = 0;
    expect(ITEM.attribute.intelligence).toBe(3);
    expect(ITEM.attribute.strength).toBe(-1);
    expect(ITEM.skill.length).toBe(1);
    expect(Reflect.set(ITEM.attribute, "intelligence", 999)).toBe(false);
    expect(() => new Item({ ...createItemData(), attribute: { luck: NaN } })).toThrow(RangeError);
});

test("Ausrüstung akzeptiert passende Items und weist inkompatible Items zurück", () => {
    const ITEM = new Item(createItemData());
    expect(new EquipmentSlot(createSlotData(null)).item).toBe(null);
    const SLOT = new EquipmentSlot(createSlotData(ITEM));
    expect(SLOT.item?.id).toBe(ITEM.id);
    expect(() => new EquipmentSlot({ ...createSlotData(ITEM), type: "head" })).toThrow(RangeError);
    const UNEQUIPPABLE = new Item({ ...createItemData(), slotType: null });
    expect(() => new EquipmentSlot(createSlotData(UNEQUIPPABLE))).toThrow(RangeError);
});

test("Charakter-Setter prüfen auch reine Datenobjekte und erhalten bei Fehlern den Zustand", () => {
    const PLAYER = new Mage();
    PLAYER.setInventory([createItemData()]);
    PLAYER.setSkills([
        createSkillData("player"),
        { ...createSkillData("class"), id: "class-skill" }
    ]);
    PLAYER.setEquipmentSlots([createSlotData({ ...createItemData(), id: "equipped-staff" })]);
    expect(PLAYER.getSkills()[0].scope).toBe("player");
    expect(PLAYER.getSkills()[1].scope).toBe("class");
    expect(PLAYER.getInventory()[0].attribute.intelligence).toBe(3);
    expect(() => PLAYER.setSkills([{ ...createSkillData(), manaCost: -1 }])).toThrow(RangeError);
    expect(PLAYER.getSkills().length).toBe(2);
    expect(() =>
        PLAYER.setEquipmentSlots([{ ...createSlotData(createItemData()), type: "head" }])
    ).toThrow(RangeError);
    expect(PLAYER.getEquipmentSlots()[0].type).toBe("hand");
});

test("Ausrüsten, Tauschen und Ablegen verschieben Items ohne Verlust oder Duplikate", () => {
    const PLAYER = new Mage();
    const FIRST = createItemData();
    const SECOND = { ...createItemData(), id: "second-staff" };
    PLAYER.setInventory([FIRST, SECOND]);
    PLAYER.setEquipmentSlots([createSlotData(null)]);
    PLAYER.equipItem(FIRST.id, "main-hand");
    expect(PLAYER.getInventory().map((item) => item.id)).toEqual([SECOND.id]);
    expect(PLAYER.getEquipmentSlots()[0].item?.id).toBe(FIRST.id);
    PLAYER.equipItem(SECOND.id, "main-hand");
    expect(PLAYER.getInventory().map((item) => item.id)).toEqual([FIRST.id]);
    expect(PLAYER.getEquipmentSlots()[0].item?.id).toBe(SECOND.id);
    expect(PLAYER.unequipItem("main-hand")?.id).toBe(SECOND.id);
    expect(PLAYER.getEquipmentSlots()[0].item).toBe(null);
    expect(PLAYER.getInventory().length).toBe(2);
    expect(PLAYER.unequipItem("main-hand")).toBe(null);
    expect(PLAYER.getInventory().length).toBe(2);
});

test("Fehlgeschlagene Ausrüstung verändert Inventar und Plätze nicht", () => {
    const PLAYER = new Mage();
    PLAYER.setInventory([createItemData()]);
    PLAYER.setEquipmentSlots([{ ...createSlotData(null), type: "head" }]);
    expect(() => PLAYER.equipItem("test-staff", "main-hand")).toThrow(RangeError);
    expect(() => PLAYER.equipItem("missing", "main-hand")).toThrow(RangeError);
    expect(() => PLAYER.equipItem("test-staff", "missing")).toThrow(RangeError);
    expect(() => PLAYER.unequipItem("missing")).toThrow(RangeError);
    expect(PLAYER.getInventory().length).toBe(1);
    expect(PLAYER.getEquipmentSlots()[0].item).toBe(null);
});

test("Mehrdeutige Item- und Slot-IDs sowie doppelte Item-Zuordnung werden abgewiesen", () => {
    const PLAYER = new Mage();
    const ITEM = createItemData();
    expect(() => PLAYER.setInventory([ITEM, ITEM])).toThrow(RangeError);
    expect(() => PLAYER.setInventory([{ ...ITEM, id: "" }])).toThrow(RangeError);
    expect(() => PLAYER.setEquipmentSlots([createSlotData(null), createSlotData(null)])).toThrow(
        RangeError
    );
    PLAYER.setInventory([ITEM]);
    expect(() => PLAYER.setEquipmentSlots([createSlotData(ITEM)])).toThrow(RangeError);
    PLAYER.setEquipmentSlots([createSlotData(null)]);
    PLAYER.equipItem(ITEM.id, "main-hand");
    expect(() => PLAYER.setInventory([ITEM])).toThrow(RangeError);
    expect(() => PLAYER.setSkills([createSkillData(), createSkillData()])).toThrow(RangeError);
});

test("Skillprüfung berücksichtigt Ressourcen, Leben und unbekannte Skills ohne Verbrauch", () => {
    const PLAYER = new Mage();
    PLAYER.setSkills([createSkillData()]);
    PLAYER.setMaxMana(5);
    PLAYER.setMana(2);
    expect(PLAYER.canUseSkill("test-skill")).toBe(true);
    expect(PLAYER.getMana()).toBe(2);
    expect(PLAYER.getSP()).toBe(1);
    expect(PLAYER.canUseSkill("unknown")).toBe(false);
    PLAYER.setMana(1);
    expect(PLAYER.canUseSkill("test-skill")).toBe(false);
    PLAYER.setMana(2);
    PLAYER.setSp(0);
    expect(PLAYER.canUseSkill("test-skill")).toBe(false);
    PLAYER.setSp(1);
    PLAYER.takeDamage(PLAYER.getHealth());
    expect(PLAYER.canUseSkill("test-skill")).toBe(false);
});

test("Ausrüstung gewährt Skills nur solange sie angelegt ist", () => {
    const PLAYER = new Mage();
    PLAYER.setMaxMana(2);
    PLAYER.setMana(2);
    PLAYER.setInventory([createItemData()]);
    PLAYER.setEquipmentSlots([createSlotData(null)]);
    expect(PLAYER.canUseSkill("test-skill")).toBe(false);
    PLAYER.equipItem("test-staff", "main-hand");
    expect(PLAYER.canUseSkill("test-skill")).toBe(true);
    PLAYER.unequipItem("main-hand");
    expect(PLAYER.canUseSkill("test-skill")).toBe(false);
});
