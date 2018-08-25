const GroupReducer = require('../GroupReducer');

describe('Array reducer', () => {
    it('groups array elements', () => {
        let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const groups = arr.groupReduce(
            (p, v) => p.concat(v),
            (v) => v % 2 === 0 ? 'even' : 'odd',
            () => []
        );
        expect(groups).toBeDefined();
        expect(Object.keys(groups).length).toBe(2);
        expect(groups.odd.length).toBe(5);
        expect(groups.even.length).toBe(5);
        expect(groups.even).toEqual([2,4,6,8,10]);
        expect(groups.odd).toEqual([1,3,5,7,9]);
    })
});
