"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uint256 = exports.Uint128 = exports.Uint96 = exports.Uint64 = exports.Uint32 = exports.Uint16 = exports.Uint8 = exports.FixedUint = exports.Uint = exports.UintUtils = void 0;
var UintUtils = /** @class */ (function () {
    function UintUtils() {
    }
    UintUtils.fixBufferByteLength = function (buffer, correctByteLength) {
        if (buffer.byteLength === correctByteLength) {
            return buffer;
        }
        var newBuffer = Buffer.alloc(correctByteLength);
        newBuffer.set(buffer, correctByteLength - buffer.byteLength);
        return newBuffer;
    };
    UintUtils.fixUintByteLength = function (CLS, uint, correctByteLength) {
        return new CLS(this.fixBufferByteLength(uint.getRaw(), correctByteLength));
    };
    return UintUtils;
}());
exports.UintUtils = UintUtils;
var Uint = /** @class */ (function () {
    function Uint(input) {
        this.buffer = input instanceof Uint ? input.getRaw() : input;
    }
    Uint.create = function (input) {
        return new this(input);
    };
    Uint.alloc = function (length, fill) {
        return new this(Buffer.alloc(length, fill));
    };
    Uint.empty = function () {
        return this.alloc(this.byteLength || 0);
    };
    Uint.from = function (input, arg2, arg3) {
        var uint;
        var buffer;
        if (typeof input === "number") {
            uint = this.alloc(arg2 || Math.ceil(input.toString(16).length / 2));
            uint.iadd(input);
            return uint;
        }
        else if (typeof input === "string" && arg2 === undefined) {
            buffer = Buffer.from(input, "hex");
        }
        else {
            buffer = Buffer.from(input, arg2, arg3);
        }
        return new this(buffer);
    };
    /** @deprecated Use {@link Uint.from}(string) instead */
    Uint.fromHex = function (hex) {
        return this.from(hex, "hex");
    };
    Uint.concat = function (list, totalLength) {
        return new this(Buffer.concat(list.map(function (item) {
            return item instanceof Uint ? (item.getRaw()) : item;
        }), totalLength));
    };
    Uint.prototype.clone = function () {
        return this.constructor.from(this.buffer);
    };
    Uint.prototype.toHex = function () {
        return this.buffer.toString("hex");
    };
    Uint.prototype.toString = function (encoding) {
        return this.buffer.toString(encoding);
    };
    /** Supports only a number up to (2^48)-1 */
    Uint.prototype.toInt = function () {
        if (this.buffer.byteLength > 6) {
            return this.buffer.readUintBE(this.buffer.byteLength - 6, 6);
        }
        return this.buffer.readUintBE(0, this.buffer.byteLength);
    };
    Uint.prototype.getRaw = function () {
        return this.buffer;
    };
    Uint.prototype.getAB = function () {
        return this.buffer.buffer.slice(this.buffer.byteOffset, this.buffer.byteOffset + this.buffer.byteLength);
    };
    Uint.prototype.getLen = function (enc) {
        return enc === "uint" ? Uint.from(this.buffer.byteLength) : this.buffer.byteLength;
    };
    Uint.prototype.set = function (list, offset) {
        this.buffer.set((list instanceof Uint ? list.getRaw() : list), offset);
    };
    Uint.prototype.appendData = function (data) {
        return Uint.concat([this.buffer, data]);
    };
    Uint.prototype.nci_slice = function (CLS, start, end) {
        return new CLS(this.buffer.subarray(start, end));
    };
    Uint.prototype.nci_split = function (CLS, afterBytes) {
        var list = [];
        for (var i = 0; i < this.buffer.byteLength; i += afterBytes) {
            list.push(this.nci_slice(CLS, i, i + afterBytes));
        }
        return list;
    };
    Uint.prototype.slice = function (start, end) { return this.nci_slice(Uint, start, end); };
    Uint.prototype.subarray = function (start, end) { return this.slice(start, end); };
    Uint.prototype.split = function (afterBytes) { return this.nci_split(Uint, afterBytes); };
    Uint.prototype.iadd = function (value) {
        if (typeof value === "object") {
            return this.addUint(value);
        }
        return this.addNumber(value);
    };
    Uint.prototype.add = function (value) {
        var clone = this.clone();
        clone.iadd(value);
        return clone;
    };
    Uint.prototype.isub = function (value) {
        if (typeof value === "object") {
            return this.subUint(value);
        }
        return this.addNumber(value * -1);
    };
    Uint.prototype.sub = function (value) {
        var clone = this.clone();
        clone.isub(value);
        return clone;
    };
    Uint.prototype.idiv = function (value, returnRest) {
        if (returnRest === void 0) { returnRest = false; }
        if (typeof value === "object") {
            return this.divUint(value, returnRest);
        }
        return this.divNumber(value, returnRest);
    };
    Uint.prototype.div = function (value) {
        var clone = this.clone();
        clone.idiv(value);
        return clone;
    };
    Uint.prototype.mod = function (value) {
        var clone = this.clone();
        return clone.idiv(value, true);
    };
    Uint.prototype.gt = function (value) {
        return this.compare(value) === 1;
    };
    Uint.prototype.gte = function (value) {
        return this.compare(value) !== -1;
    };
    Uint.prototype.lt = function (value) {
        return this.compare(value) === -1;
    };
    Uint.prototype.lte = function (value) {
        return this.compare(value) !== 1;
    };
    Uint.prototype.eq = function (value) {
        return this.compare(value) === 0;
    };
    Uint.prototype.eqn = function (value) {
        return this.compare(value) !== 0;
    };
    Uint.prototype.addUint = function (value) {
        if (this.buffer.byteLength !== value.buffer.byteLength) {
            value = UintUtils.fixUintByteLength(this.constructor, value, this.buffer.byteLength);
        }
        var carry = 0;
        for (var i = this.buffer.byteLength - 1; i >= 0; i--) {
            var sum = this.buffer[i] + value.buffer[i] + carry;
            this.buffer[i] = sum % 256;
            carry = Math.floor(sum / 256);
        }
    };
    Uint.prototype.addNumber = function (value) {
        for (var i = this.buffer.byteLength - 1; i >= 0; i--) {
            var sum = this.buffer[i] + value;
            if (sum >= 0) {
                this.buffer[i] = sum % 256;
            }
            else {
                this.buffer[i] = (sum % 256) + 256;
            }
            value = Math.floor(sum / 256);
        }
    };
    Uint.prototype.subUint = function (value) {
        if (this.buffer.byteLength !== value.buffer.byteLength) { // @ts-ignore
            value = UintUtils.fixUintByteLength(this.constructor, value, this.buffer.byteLength);
        }
        var carry = 0;
        for (var i = this.buffer.byteLength - 1; i >= 0; i--) {
            var sum = this.buffer[i] - value.buffer[i] + carry;
            if (sum >= 0) {
                this.buffer[i] = sum % 256;
            }
            else {
                this.buffer[i] = (sum % 256) + 256;
            }
            carry = Math.floor(sum / 256);
        }
    };
    Uint.prototype.divUint = function (value, returnRest) {
        return this.divNumber(value.toInt(), returnRest);
    };
    Uint.prototype.divNumber = function (value, returnRest) {
        var carry = 0;
        for (var i = 0; i < this.buffer.byteLength; i++) {
            var dividend = this.buffer[i] + carry;
            this.buffer[i] = Math.floor(dividend / value);
            carry = (dividend % value) * 256;
        }
        if (returnRest)
            return (carry / 256);
    };
    Uint.prototype.compare = function (value) {
        if (typeof value === "number") {
            value = Uint.from(value, this.buffer.byteLength);
        }
        else if (this.buffer.byteLength !== value.buffer.byteLength) {
            value = UintUtils.fixUintByteLength(Uint, value, this.buffer.byteLength);
        }
        return this.buffer.compare(value.buffer);
    };
    Object.defineProperty(Uint.prototype, Symbol.toStringTag, {
        get: function () {
            return this.constructor.name;
        },
        enumerable: false,
        configurable: true
    });
    Uint.prototype[Symbol.toPrimitive] = function (hint) {
        switch (hint) {
            case "string": return this.toHex();
            case "number": return this.toInt();
            default: return this.toHex();
        }
    };
    Uint.prototype[Symbol.for('nodejs.util.inspect.custom')] = function () {
        var output = "<" + this.constructor.name + " ";
        for (var i = 0; i < this.buffer.byteLength; i++) {
            output += this.buffer[i].toString(16).padStart(2, '0') + ' ';
        }
        return output.trim() + ">";
    };
    return Uint;
}());
exports.Uint = Uint;
var FixedUint = /** @class */ (function (_super) {
    __extends(FixedUint, _super);
    function FixedUint(buffer) {
        return _super.call(this, buffer) || this;
    }
    FixedUint.create = function (input) {
        return new this(UintUtils.fixBufferByteLength((input instanceof Uint ? input.getRaw() : input), this.byteLength));
    };
    FixedUint.alloc = function (fill) {
        return new this(Buffer.alloc(this.byteLength, fill));
    };
    FixedUint.empty = function () {
        return this.alloc();
    };
    FixedUint.from = function (input, arg2, arg3) {
        var uint;
        var buffer;
        if (typeof input === "number") {
            uint = this.alloc();
            uint.iadd(input);
            return uint;
        }
        else if (typeof input === "string" && arg2 === undefined) {
            buffer = Buffer.from(input, "hex");
        }
        else {
            buffer = Buffer.from(input, arg2, arg3);
        }
        return new this(UintUtils.fixBufferByteLength(buffer, this.byteLength));
    };
    return FixedUint;
}(Uint));
exports.FixedUint = FixedUint;
var Uint8 = /** @class */ (function (_super) {
    __extends(Uint8, _super);
    function Uint8() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Uint8.byteLength = 1;
    return Uint8;
}(FixedUint));
exports.Uint8 = Uint8;
var Uint16 = /** @class */ (function (_super) {
    __extends(Uint16, _super);
    function Uint16() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Uint16.byteLength = 2;
    return Uint16;
}(FixedUint));
exports.Uint16 = Uint16;
var Uint32 = /** @class */ (function (_super) {
    __extends(Uint32, _super);
    function Uint32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Uint32.byteLength = 4;
    return Uint32;
}(FixedUint));
exports.Uint32 = Uint32;
var Uint64 = /** @class */ (function (_super) {
    __extends(Uint64, _super);
    function Uint64() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Uint64.prototype.addNumber = function (value) {
        for (var i = this.buffer.byteLength - 4; i >= 0; i -= 4) {
            var sum = this.buffer.readUint32BE(i) + value;
            if (sum >= 0) {
                this.buffer.writeUint32BE(sum % 4294967296, i);
            }
            else {
                this.buffer.writeUint32BE((sum % 4294967296) + 4294967296, i);
            }
            value = Math.floor(sum / 4294967296);
        }
    };
    Uint64.prototype.divNumber = function (value, returnRest) {
        var carry = 0;
        for (var i = 0; i < this.buffer.byteLength; i += 4) {
            var dividend = this.buffer.readUint32BE(i) + carry;
            this.buffer.writeUint32BE(Math.floor(dividend / value), i);
            carry = (dividend % value) * 4294967296;
        }
        if (returnRest)
            return (carry / 4294967296);
    };
    Uint64.prototype.toShortUint = function () {
        for (var i = 0; i < this.buffer.byteLength; i++) {
            if (this.buffer[i] !== 0) {
                return this.slice(i);
            }
        }
        return Uint.from(0);
    };
    /** Supports only a number up to (2^64)-1 */
    Uint64.prototype.toBigInt = function () {
        return this.buffer.readBigUint64BE();
    };
    Uint64.byteLength = 8;
    return Uint64;
}(FixedUint));
exports.Uint64 = Uint64;
// @ts-ignore
var Uint96 = /** @class */ (function (_super) {
    __extends(Uint96, _super);
    function Uint96() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Uint96.prototype.toBigInt = function () {
        throw new Error("Method not implemented.");
    };
    Uint96.byteLength = 12;
    return Uint96;
}(Uint64));
exports.Uint96 = Uint96;
// @ts-ignore
var Uint128 = /** @class */ (function (_super) {
    __extends(Uint128, _super);
    function Uint128() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Uint128.prototype.toBigInt = function () {
        throw new Error("Method not implemented.");
    };
    Uint128.byteLength = 16;
    return Uint128;
}(Uint64));
exports.Uint128 = Uint128;
// @ts-ignore
var Uint256 = /** @class */ (function (_super) {
    __extends(Uint256, _super);
    function Uint256() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Uint256.prototype.toBigInt = function () {
        throw new Error("Method not implemented.");
    };
    Uint256.byteLength = 32;
    return Uint256;
}(Uint64));
exports.Uint256 = Uint256;
