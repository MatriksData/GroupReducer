const {Writable} = require('stream');

Function.prototype.method = function(name, func) {
    this.prototype[name] = func;
    return this;
}

function GroupReducer(reduce_fn, group_fn, init_fn) {
    this.container = new Map();
    this.reduce_fn = reduce_fn;
    this.init_fn = init_fn;
    this.group_fn = group_fn;
}

GroupReducer.method('push', function (v) {
    const k = this.group_fn(v);
    let p = this.container.has(k) ? this.container.get(k) : this.init_fn(v);
    this.container.set(k, this.reduce_fn(p, v));
});

GroupReducer.method('add', function(v) {
    this.push(v);
});

GroupReducer.method('values', function() {
    return this.container.values();
});

GroupReducer.method('valuesAsArray', function() {
    let vals = [];
    for (let v of this.container.values()) {
        vals.push(v);
    }
    return vals;
});

GroupReducer.method('groups', function() {
    let g = {}
    for (k of this.container.keys()) {
        g[k] = this.container.get(k);
    }
    return g;
});

GroupReducer.method('stream', function() {
    let that = this;
    return new Writable({
        objectMode: true,

        write(value, encoding, cb) {
            that.push(value);
            cb();
        }
    });
});

Array.method('groupReduce', function(reduce_fn, group_fn, init_fn) {
    let reducer = new GroupReducer(reduce_fn, group_fn, init_fn);
    this.forEach(v => reducer.push(v));
    return reducer.groups();
});

module.exports = GroupReducer;
