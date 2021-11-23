import object from '../../src/utils/object';

test('id.getItem', () => {
    const obj = {
        a: [1],
        b: [],
        c: [''],
        d: [null],
        e: [[]],
        f: 1,
        g: {
            h: 1,
            i: '',
        },
        j: {},
    };
    object.removeEmpty(obj);
    expect(obj).toEqual({
        a: [1],
        f: 1,
        g: {
            h: 1,
        },
    });
});
