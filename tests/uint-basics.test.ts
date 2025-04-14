import { describe, test, expect } from "bun:test";
import { Uint, Uint256 } from "../src/index.js";


describe("Uint Basics", () => {

    test("isUint", async () => {

        const uint = Uint.from(123456789);
        expect(Uint.isUint(uint)).toBe(true);
        expect(Uint.isUint(uint.getRaw())).toBe(false);

        const uint256 = Uint256.from(123456789);
        expect(Uint.isUint(uint256)).toBe(true);
        expect(Uint256.isUint(uint256)).toBe(true);
        expect(Uint256.isUint(uint)).toBe(false);

    });


});
