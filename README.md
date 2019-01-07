# Group Reducer

[![Build Status](https://travis-ci.org/MatriksData/GroupReducer.svg?branch=master)](https://travis-ci.org/MatriksData/GroupReducer)

Very similar to `Array.reduce()` function with grouping functionality.  It works with arrays, streams and discrete pushes.  Please check the `specs` directory out for sample usage scenarios.

## Installation

For Node.js, simply use `npm`:

```sh
npm install groupreducer
```

For browser applications, import via CDN:

```html
    <script src="<https://unpkg.com/groupreducer@0.6.0'></script>>
```
or use `dist/GroupReducer.js` file directly.

## Usage

Consider the following simple example.  It groups a 10 element array into odds and evens.  

* Each group starts with an empty array: `() => []`.
* During the iteration, at every element
  * The library applies the grouping function: `(v) => v % 2 === 0 ? 'even' : 'odd'`
  * If the group exists, the library gathers its previous value, otherwise generates initial volue
  * Then the reduce function will be applied: `(p, v) => p.concat(v)`.

```javascript
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const groups = arr.groupReduce(
    (p, v) => p.concat(v),                   // reduce function
    (v) => v % 2 === 0 ? 'even' : 'odd',     // grouping function
    () => []                                 // group initialization function
);
console.log(groups);
// { odd: [ 1, 3, 5, 7, 9 ], even: [ 2, 4, 6, 8, 10 ] }
```

If you read your data from a readable/transform stream, you do not need to collect the data in an array.   `GroupReducer.stream()` function retuns a writable stream.  So just pipe them as follows.

**Nate:** Streaming funcionaliny is only supported for Node, streaming for brovsers will be implemented at the next version.

```javascript
let reducer = new GroupReducer(
    (p, v) => p.concat(v),
    (v) => v % 2 === 0 ? 'even' : 'odd',
    () => []
);
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let ins = new Readable({
    objectMode: true,

    read() {
        this.push(arr.length > 0 ? arr.shift() : null);
    }
});
ins .pipe(reducer.stream())
    .on('finish', () => {
        const groups = reducer.groups();
        console.log(groups);
        // { odd: [ 1, 3, 5, 7, 9 ], even: [ 2, 4, 6, 8, 10 ] }
    });
```

What's more, you can arbitrarily push data by creating a GroupReducer instance and calling its `push()` method.

```javascript
let reducer = new GroupReducer(
    (p, v) => p.concat(v),
    (v) => v % 2 === 0 ? 'even' : 'odd',
    () => []
);
for (let i = 1; i <= 10; i += 1) {
    reducer.add(i);
}
const groups = reducer.groups();
```

## API

### Constructor

```javascript
new GroupReducer(reduce_fn, group_fn, init_fn)
```

As the names implies, all parameters are functions with the following signatures:

* **`reduce_fn(prev, current)`**: Takes the previous group value and the current value, returns the reduced group value.
* **`group_fn(current)`**: Takes the current value and returns the group key.
* **`init_fn([current])`**: Optionally takes the current value, returns the group's initial value.

### .push(value)

Sends the value to the main grouped reducer process.

### .add(value)

Equivalent to `.push(value)`

### .values()

Returns values iterator.

### .valuesAsArray()

Returns the values collected in an array.

### .groups()

Returns group key/value pairs in an object,

### .stream()

Returns a Writable stream in object mode.  It simply pushes each written object to the reducer.

### Array.groupReduce(reduce_fn, group_fn, init_fn)

Implicitly creates a GroupReducer with these parameters, iterates on the array, pushes each element to the reducer, then returns the group/value pairs object.
