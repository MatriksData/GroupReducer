const GroupReducer = require('../GroupReducer');

describe('', () => {
    it('', () => {
        let reducer = new GroupReducer(
            (p, v) => p.concat(v),
            (v) => v % 2 === 0 ? 'even' : 'odd',
            () => []
        );
        for (let i = 1; i <= 10; i += 1) {
            reducer.add(i);
        }
        const groups = reducer.groups();
        expect(groups).toBeDefined();
        expect(Object.keys(groups).length).toBe(2);
        expect(groups.odd.length).toBe(5);
        expect(groups.even.length).toBe(5);
    })
})
