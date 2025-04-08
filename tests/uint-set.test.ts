import { describe, test, expect } from "bun:test";
import { Uint, UintSet } from "../src/index.js";

describe("Uint Set", () => {

    test("basic_set", async () => {

        const set = new UintSet();

        const u1 = Uint.from(1);
        const u2 = Uint.from(2);
        const u3 = Uint.from(3);

        set.add(u1);
        set.add(u2);
        set.add(u3);

        expect(set.size).toBe(3);
        expect(set.has(u1)).toBe(true);
        expect(set.has(u2)).toBe(true);
        expect(set.has(u3)).toBe(true);

        expect(set.has(Uint.from(4))).toBe(false);

        expect(set.has(Uint.from(1))).toBe(true);
        expect(set.has(Uint.from(2))).toBe(true);
        expect(set.has(Uint.from(3))).toBe(true);

        set.delete(u1);
        expect(set.has(u1)).toBe(false);
        expect(set.size).toBe(2);
        expect(set.has(u2)).toBe(true);        

    });


});