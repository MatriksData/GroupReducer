const GroupReducer = require('../GroupReducer');
const {Readable} = require('stream');

const ITER = 100;
const colors = [, 'red', 'yellow', 'blue'];
// Generates a random integer between 1 and upper_bound
const rand_int = (upper_bound) => Math.ceil(Math.random() * upper_bound);
// Returns an object consist of a random color and a random value
const color_value = () => ({color: colors[rand_int(3)], value: rand_int(10)});

// Reducer functions
const reduce = (p, v) => {
    p.cnt += 1;
    p.sum += v.value;
    return p;
}
const group = (v) => v.color;
const init = () => ({cnt: 0, sum:0});

describe('Sum and counts of colored values by', () => {
    it('pushes', () => {
        let reducer = new GroupReducer(reduce, group, init);
        for (let i=0; i<ITER; i+=1) {
            reducer.push(color_value());
        }
        const groups = reducer.groups();
        expect(groups.red).toBeDefined();
        expect(groups.yellow).toBeDefined();
        expect(groups.blue).toBeDefined();
        expect(groups.red.cnt + groups.yellow.cnt + groups.blue.cnt).toBe(ITER);
    });

    it('array reduce', () => {
        let arr = [];
        for (let i=0; i<ITER; i+=1) {
            arr.push(color_value());
        }
        const groups = arr.groupReduce(reduce, group, init);
        expect(groups.red.cnt + groups.yellow.cnt + groups.blue.cnt).toBe(ITER);
    });

    it('stream', (done) => {
        let reducer = new GroupReducer(reduce, group, init);
        let i = 1;
        let ins = new Readable({
            objectMode: true,
            read() {
                this.push(i <= ITER ? color_value() : null);
                i += 1;
            }
        });
        ins .pipe(reducer.stream())
            .on('finish', () => {
                const groups = reducer.groups();
                expect(groups.red.cnt + groups.yellow.cnt + groups.blue.cnt).toBe(ITER);
                done();
            });

    });
});
