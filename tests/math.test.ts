import { describe, test, expect } from "bun:test";
import { Uint64 } from "../src/uint/fixed-uint";

describe("math", () => {

    test("basic_math", () => {

        let int = Math.floor(Math.random() * 1_000_000);
        const uint = Uint64.from(int);

        int = Math.floor(int / 123456);
        uint.idiv(123456);

        int = int * 654321;
        uint.imul(654321);

        int = int + 987654321;
        uint.iadd(987654321);

        int = int - 123456789;
        uint.isub(123456789);

        expect(uint.toInt()).toBe(int);
    });

});
