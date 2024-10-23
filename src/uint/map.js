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
exports.UintMap = exports.BasicBinaryMap = exports.AbstractBinaryMap = void 0;
var index_js_1 = require("./index.js");
var BMapIteratorLike = /** @class */ (function () {
    function BMapIteratorLike(mapEntries) {
        this.mapEntries = mapEntries;
    }
    BMapIteratorLike.prototype[Symbol.iterator] = function () { return this; };
    BMapIteratorLike.prototype.next = function () {
        var result = this.mapEntries.next();
        if (result.done) {
            return { done: true, value: undefined };
        }
        return { done: false, value: this._next(result.value) };
    };
    BMapIteratorLike.prototype.all = function () {
        var result = [];
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var value = _a[_i];
            result.push(value);
        }
        return result;
    };
    return BMapIteratorLike;
}());
var BMapEntriesIterator = /** @class */ (function (_super) {
    __extends(BMapEntriesIterator, _super);
    function BMapEntriesIterator(CLS, mapEntries) {
        var _this = _super.call(this, mapEntries) || this;
        _this.CLS = CLS;
        return _this;
    }
    BMapEntriesIterator.prototype._next = function (value) {
        return [this.CLS.from(value[0]), value[1]];
    };
    return BMapEntriesIterator;
}(BMapIteratorLike));
var BMapKeysIterator = /** @class */ (function (_super) {
    __extends(BMapKeysIterator, _super);
    function BMapKeysIterator(CLS, mapEntries) {
        var _this = _super.call(this, mapEntries) || this;
        _this.CLS = CLS;
        return _this;
    }
    BMapKeysIterator.prototype._next = function (value) {
        return this.CLS.from(value);
    };
    return BMapKeysIterator;
}(BMapIteratorLike));
var BMapValuesIterator = /** @class */ (function (_super) {
    __extends(BMapValuesIterator, _super);
    function BMapValuesIterator(mapEntries) {
        return _super.call(this, mapEntries) || this;
    }
    BMapValuesIterator.prototype._next = function (value) {
        return value;
    };
    return BMapValuesIterator;
}(BMapIteratorLike));
var AbstractBinaryMap = /** @class */ (function () {
    function AbstractBinaryMap(CLS, entries) {
        this.CLS = CLS;
        this.store = {};
        if (entries) {
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var _a = entries_1[_i], key = _a[0], value = _a[1];
                this.set(key, value);
            }
        }
    }
    Object.defineProperty(AbstractBinaryMap.prototype, "size", {
        get: function () {
            return Object.keys(this.store).length;
        },
        enumerable: false,
        configurable: true
    });
    AbstractBinaryMap.prototype.get = function (key) {
        return this.store[key.toHex()];
    };
    AbstractBinaryMap.prototype.set = function (key, value) {
        return this.store[key.toHex()] = value;
    };
    AbstractBinaryMap.prototype.delete = function (key) {
        return delete this.store[key.toHex()];
    };
    AbstractBinaryMap.prototype.has = function (key) {
        return key.toHex() in this.store;
    };
    AbstractBinaryMap.prototype.entries = function () {
        return new BMapEntriesIterator(this.CLS, Object.entries(this.store).values());
    };
    AbstractBinaryMap.prototype.keys = function () {
        return new BMapKeysIterator(this.CLS, Object.keys(this.store).values());
    };
    AbstractBinaryMap.prototype.values = function () {
        return new BMapValuesIterator(Object.values(this.store).values());
    };
    AbstractBinaryMap.prototype.forEach = function (callbackfn, thisArg) {
        for (var _i = 0, _a = this.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            callbackfn.call(thisArg, value, key);
        }
        ;
    };
    AbstractBinaryMap.prototype.clear = function () {
        for (var _i = 0, _a = this.keys(); _i < _a.length; _i++) {
            var key = _a[_i];
            this.delete(key);
        }
    };
    AbstractBinaryMap.prototype.getStringTag = function () {
        return this.constructor.name;
    };
    return AbstractBinaryMap;
}());
exports.AbstractBinaryMap = AbstractBinaryMap;
var BasicBinaryMap = /** @class */ (function (_super) {
    __extends(BasicBinaryMap, _super);
    function BasicBinaryMap(CLS, entries) {
        var _this = _super.call(this, CLS, entries) || this;
        _this.CLS = CLS;
        return _this;
    }
    Object.defineProperty(BasicBinaryMap.prototype, "size", {
        get: function () { return _super.prototype.size; },
        enumerable: false,
        configurable: true
    });
    BasicBinaryMap.prototype.get = function (key) { return _super.prototype.get.call(this, key); };
    BasicBinaryMap.prototype.set = function (key, value) { return _super.prototype.set.call(this, key, value); };
    BasicBinaryMap.prototype.delete = function (key) { return _super.prototype.delete.call(this, key); };
    BasicBinaryMap.prototype.has = function (key) { return _super.prototype.has.call(this, key); };
    BasicBinaryMap.prototype[Symbol.iterator] = function () { return this.entries(); };
    BasicBinaryMap.prototype.entries = function () { return _super.prototype.entries.call(this); };
    BasicBinaryMap.prototype.keys = function () { return _super.prototype.keys.call(this); };
    BasicBinaryMap.prototype.values = function () { return _super.prototype.values.call(this); };
    BasicBinaryMap.prototype.forEach = function (callbackfn, thisArg) {
        _super.prototype.forEach.call(this, callbackfn, thisArg);
    };
    BasicBinaryMap.prototype.clear = function () { _super.prototype.clear.call(this); };
    Object.defineProperty(BasicBinaryMap.prototype, Symbol.toStringTag, {
        get: function () { return this.getStringTag(); },
        enumerable: false,
        configurable: true
    });
    return BasicBinaryMap;
}(AbstractBinaryMap));
exports.BasicBinaryMap = BasicBinaryMap;
var UintMap = /** @class */ (function (_super) {
    __extends(UintMap, _super);
    function UintMap(entries) {
        return _super.call(this, index_js_1.Uint, entries) || this;
    }
    return UintMap;
}(BasicBinaryMap));
exports.UintMap = UintMap;
