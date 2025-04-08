import { BasicUintConstructable, Uint } from "./uint.js";
import { AbstractIterator } from "./utils.js";

class BSetEntriesIterator<K extends Uint> extends AbstractIterator<[K, K], [string, string]> {
    constructor(protected CLS: BasicUintConstructable<K>, setEntries: IterableIterator<[string, string]>) {
        super(setEntries);
    }
    protected _next(value: [string, string]): [K, K] {
        const decodedKey = this.CLS.from(value[0], "utf8");
        return [decodedKey, decodedKey];
    }
}

class BSetIterator<K extends Uint> extends AbstractIterator<K, string> {
    constructor(protected CLS: BasicUintConstructable<K>, setEntries: IterableIterator<string>) {
        super(setEntries);
    }
    protected _next(value: string): K {
        return this.CLS.from(value, "utf8");
    }
}



export class BasicBinarySet<K extends Uint> {

    protected readonly store = new Set<string>();

    public constructor(
        protected readonly CLS: BasicUintConstructable<K>,
        values?: readonly K[]
    ) {
        if (values) {
            for (const value of values) {
                this.add(value);
            }
        }
    }

    get size() {
        return this.store.size;
    }

    public add(value: K) {
        this.store.add(value.toString("utf8"));
        return value;
    }

    public delete(value: K) {
        return this.store.delete(value.toString("utf8"));
    }

    public has(value: K) {
        return this.store.has(value.toString("utf8"));
    }

    public [Symbol.iterator]() {
        return this.values();
    }

    public entries() {
        return new BSetEntriesIterator(this.CLS, this.store.entries());   
    }

    public keys(){
        return this.values();
    }

    public values() {
        return new BSetIterator(this.CLS, this.store.values());
    }

    public forEach(callbackfn: (value: K) => void, thisArg?: any): void {
        for (const value of this.values()) {
            callbackfn.call(thisArg, value);
        };
    }
    /*
    public union<U>(other: ReadonlySetLike<U>): Set<K | U> {
        throw new Error("Method not implemented.");
    }
    public intersection<U>(other: ReadonlySetLike<U>): Set<K & U> {
        throw new Error("Method not implemented.");
    }
    public difference<U>(other: ReadonlySetLike<U>): Set<K> {
        throw new Error("Method not implemented.");
    }
    public symmetricDifference<U>(other: ReadonlySetLike<U>): Set<K | U> {
        throw new Error("Method not implemented.");
    }
    public isSubsetOf(other: ReadonlySetLike<unknown>): boolean {
        throw new Error("Method not implemented.");
    }
    public isSupersetOf(other: ReadonlySetLike<unknown>): boolean {
        throw new Error("Method not implemented.");
    }
    public isDisjointFrom(other: ReadonlySetLike<unknown>): boolean {
        throw new Error("Method not implemented.");
    }
    */
    public clear(): void {
        throw new Error("Method not implemented.");
    }

    protected getStringTag() {
        return this.constructor.name;
    }

    public get [Symbol.toStringTag]() {
        return this.getStringTag();
    }

}

export class UintSet extends BasicBinarySet<Uint> {
    constructor(values?: readonly Uint[]) {
        super(Uint, values);
    }
}

