# low-level
Low-Level-JS is a lightweight and efficient library designed for working with binary data, fixed-size integers, and memory-optimized data structures in JavaScript and TypeScript. It provides a robust set of utilities for handling low level operations, including Uint-based arithmetic, binary maps, and structured data manipulation.

## Usage

```ts
import { Uint8, Uint16, Uint32 } from 'low-level';

// Creating Uint instances
const uint8 = Uint8.from(255);
const uint16 = Uint16.from(65535);
const uint32 = Uint32.from(4294967295);

// Performing arithmetic operations
const sum = uint8.add(1); // Uint8 with value 0 (overflow)
const difference = uint16.sub(1); // Uint16 with value 65534

// Working with binary maps
import { UintMap } from 'low-level-js';

const map = new UintMap<string>();
map.set(uint8, "Value for Uint8");
map.set(uint16, "Value for Uint16");

console.log(map.get(uint8)); // Output: "Value for Uint8"
console.log(map.get(uint16)); // Output: "Value for Uint16"
```
