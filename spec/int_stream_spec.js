const GroupReducer = require('../GroupReducer');
const {Readable} = require('stream');

describe('Stream reducer', () => {
    it('consumes a readable stream', (done) => {
        let reducer = new GroupReducer(
            (p, v) => p.concat(v),
            (v) => v % 2 === 0 ? 'even' : 'odd',
            () => []
        );
        let i = 1;
        let ins = new Readable({
            objectMode: true,
            read() {
                this.push(i <= 10 ? i : null);
                i += 1;
            }
        });
        ins .pipe(reducer.stream())
            .on('finish', () => {
                const groups = reducer.groups();
                expect(groups).toBeDefined();
                expect(Object.keys(groups).length).toBe(2);
                expect(groups.odd.length).toBe(5);
                expect(groups.even.length).toBe(5);
                expect(groups.even).toEqual([2,4,6,8,10]);
                expect(groups.odd).toEqual([1,3,5,7,9]);
                done();
            });
    });
});
