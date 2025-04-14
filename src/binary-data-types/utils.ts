import type { Uint } from "./uint.js";

export type WithString = {[Symbol.toPrimitive](hint: "string"): string} | WithImplicitCoercion<string>;
export type WithArrayBuffer = WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>;

export type ByteArray = readonly number[] | Uint8Array;

export type NumberLike = Uint | number;
export type BinLike = Uint | Buffer;

export type New<T> = new(input: BinLike) => T;

export class UintUtils {

    static fixBufferByteLength(buffer: Buffer, correctByteLength: number) {
        if (buffer.byteLength === correctByteLength) {
            return buffer;
        }
        const newBuffer = Buffer.alloc(correctByteLength);
        newBuffer.set(buffer, correctByteLength - buffer.byteLength);
        return newBuffer;
    }

    static fixUintByteLength<T>(CLS: New<T>, uint: Uint, correctByteLength: number) {
        return new CLS(this.fixBufferByteLength(uint.getRaw(), correctByteLength));
    }

}

export abstract class AbstractIterator<T, M> implements IterableIterator<T> {

    constructor(protected entries: IterableIterator<M>) {}

    public [Symbol.iterator]() { return this; }

    public next(): IteratorResult<T> {
        const result = this.entries.next();
        if (result.done) {
            return { done: true, value: undefined as M };
        }
        return { done: false, value: this._next(result.value) };
    }
    protected abstract _next(value: M): T;

    public all(): T[] {
        const result: T[] = [];
        for (const value of this) {
            result.push(value);
        }
        return result;
    }
}
