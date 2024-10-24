import { Uint, type BasicUintConstructable } from "./uint.js";
import type { ByteArray, WithString, BinLike, New, WithArrayBuffer } from "./utils.js";
import { UintUtils } from "./utils.js";

export interface FixedUintConstructable<T extends FixedUint> extends BasicUintConstructable<T> {
    readonly byteLength: number;
    alloc(fill?: string | Uint8Array | number): T;
}

export class FixedUint extends Uint {

    static readonly byteLength: number;

    constructor(buffer: BinLike) {
        super(buffer);
    }

    public static create<T>(this: New<T>, input: BinLike): T;
    public static create(input: BinLike) {
        return new this(UintUtils.fixBufferByteLength((input instanceof Uint ? input.getRaw() : input), this.byteLength));
    }

    public static alloc<T>(this: New<T>, fill?: string | Uint8Array | number): T;
    public static alloc(fill?: string | Uint8Array | number) {
        return new this(Buffer.alloc(this.byteLength, fill));
    }

    public static empty<T>(this: New<T>): T;
    public static empty(this: FixedUintConstructable<Uint>) {
        return this.alloc();
    }

    public static from<T>(this: New<T>, arrayBuffer: WithArrayBuffer, byteOffset?: number, length?: number): T;
    public static from<T>(this: New<T>, data: WithImplicitCoercion<ByteArray | string>): T;
    public static from<T>(this: New<T>, str: WithString, encoding?: BufferEncoding): T;
    public static from<T>(this: New<T>, number: number): T;
    public static from(this: FixedUintConstructable<FixedUint>, input: any, arg2?: any, arg3?: any) {
        let uint: FixedUint;
        let buffer: Buffer;
        if (typeof input === "number") {
            uint = this.alloc();
            uint.iadd(input);
            return uint;
        } else if (typeof input === "string" && arg2 === undefined) {
            buffer = Buffer.from(input, "hex");
        } else {
            buffer = Buffer.from(input, arg2, arg3);
        }
        return new this(UintUtils.fixBufferByteLength(buffer, this.byteLength));
    }

}


export class Uint8 extends FixedUint {
    static readonly byteLength = 1;
}

export class Uint16 extends FixedUint {
    static readonly byteLength = 2;
}

export class Uint32 extends FixedUint {
    static readonly byteLength = 4;
}


export abstract class AbstractBigUint extends FixedUint {
    
    protected addNumber(value: number) {
        for (let i = this.buffer.byteLength - 4; i >= 0; i -= 4) {
            const sum = this.buffer.readUint32BE(i) + value;
            if (sum >= 0) {
                this.buffer.writeUint32BE(sum % 4294967296, i);
            } else {
                this.buffer.writeUint32BE((sum % 4294967296) + 4294967296, i);
            }
            value = Math.floor(sum / 4294967296);
        }
    }

    protected divNumber(value: number, returnRest: boolean) {
        let carry = 0;
        for (let i = 0; i < this.buffer.byteLength; i += 4) {
            const dividend = this.buffer.readUint32BE(i) + carry;
            this.buffer.writeUint32BE(Math.floor(dividend / value), i);
            carry = (dividend % value) * 4294967296;
        }
        if (returnRest) return (carry / 4294967296);
    }

    public toShortUint() {
        for (let i = 0; i < this.buffer.byteLength; i++) {
            if (this.buffer[i] !== 0) {
                return this.slice(i);
            }
        }
        return Uint.from(0);
    }

    public toBigInt() {
        return BigInt("0x" + this.toHex());
    }

}

// @ts-ignore
export class Uint64 extends AbstractBigUint {
    static readonly byteLength = 8;

    public toBigInt() {
        return this.buffer.readBigUint64BE();
    }
}

// @ts-ignore
export class Uint96 extends AbstractBigUint {
    static readonly byteLength = 12;
}

// @ts-ignore
export class Uint128 extends AbstractBigUint {
    static readonly byteLength = 16;
}

// @ts-ignore
export class Uint256 extends AbstractBigUint {
    static readonly byteLength = 32;
}
