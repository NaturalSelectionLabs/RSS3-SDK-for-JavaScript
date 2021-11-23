import check from '../../src/utils/check';
import config from '../../src/config';
import { Buffer } from 'buffer';

test('check.valueLength', () => {
    expect(
        check.valueLength({
            test1: 'r',
            test2: 'r'.repeat(config.maxValueLength),
        }),
    ).toBe(true);
    expect(
        check.valueLength({
            test1: 'r',
            test2: 'r'.repeat(config.maxValueLength + 1),
        }),
    ).toBe(false);
});

test('check.removeCustomProperties', () => {
    const obj = {
        test1: 'r',
        test2: {
            _test3: 'r',
        },
        _test4: 'r',
    };
    expect(check.removeCustomProperties(obj)).toEqual({
        test1: 'r',
        test2: {},
    });
});

test('check.fileSize', () => {
    const testObj = {
        t: 'r',
        signature: '0'.repeat(132),
    };
    const testObjLength = Buffer.byteLength(JSON.stringify(testObj));
    expect(
        check.fileSize(
            Object.assign(testObj, {
                t: 'r'.repeat(config.fileSizeLimit - testObjLength + 1),
            }),
        ),
    ).toBe(true);
    expect(
        check.fileSize(
            Object.assign(testObj, {
                t: 'r'.repeat(config.fileSizeLimit - testObjLength + 2),
            }),
        ),
    ).toBe(false);
});

test('check.fileSizeWithNew', () => {
    const testObj = {
        list: ['1'],
        t: 'r',
        signature: '0'.repeat(132),
    };
    const testObjLength = Buffer.byteLength(JSON.stringify(testObj));
    expect(
        check.fileSizeWithNew(
            Object.assign(testObj, {
                list: ['1'],
                t: 'r'.repeat(config.fileSizeLimit - testObjLength - 4 + 1),
            }),
            '2',
        ),
    ).toBe(true);
    expect(
        check.fileSizeWithNew(
            Object.assign(testObj, {
                list: ['1'],
                t: 'r'.repeat(config.fileSizeLimit - testObjLength - 4 + 2),
            }),
            '2',
        ),
    ).toBe(false);
});
