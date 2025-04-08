import { describe, test, expect } from "bun:test";
import { Uint, UintMap } from "../src/index.js";

describe("Uint Map", () => {

    test("basic_map", async () => {

        const map = new UintMap<string>();

        const u1 = Uint.from(1);
        const u2 = Uint.from(2);
        const u3 = Uint.from(3);

        map.set(u1, "one");
        map.set(u2, "two");
        map.set(u3, "three");

        expect(map.get(u1)).toBe("one");
        expect(map.get(u2)).toBe("two");
        expect(map.get(u3)).toBe("three");

        expect(map.has(u1)).toBe(true);
        expect(map.has(u2)).toBe(true);
        expect(map.has(u3)).toBe(true);

        expect(map.size).toBe(3);

        expect(map.delete(u1)).toBe(true);
        expect(map.has(u1)).toBe(false);
        expect(map.size).toBe(2);
        expect(map.get(u1)).toBeUndefined();

        const u1_2 = Uint.from(1);
        const u2_2 = Uint.from(2);
        const u3_2 = Uint.from(3);

        expect(map.get(u1)).toBe(map.get(u1_2) as any);
        expect(map.get(u2)).toBe(map.get(u2_2) as any);
        expect(map.get(u3)).toBe(map.get(u3_2) as any);

        

    });


});