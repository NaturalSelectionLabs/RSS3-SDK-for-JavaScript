import object from '../../src/utils/object';
import { utils } from '../../src/index';

test('utils.object', () => {
    expect(utils.object).toBe(object);
});

test('id.removeEmpty', () => {
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

test('check.removeCustomProperties', () => {
    const obj = {
        test1: 'r',
        test2: {
            _test3: 'r',
        },
        _test4: 'r',
    };
    expect(object.removeCustomProperties(obj)).toEqual({
        test1: 'r',
        test2: {},
    });
});
