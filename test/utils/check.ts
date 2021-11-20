import check from '../../src/utils/check';
import config from '../../src/config';

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
    };
    check.removeCustomProperties(obj);
    expect(obj).toMatchObject({
        test1: 'r',
        test2: {},
    });
});

test('check.fileSize', () => {
    expect(
        check.fileSize({
            t: 'r'.repeat(config.fileSizeLimit - 8),
        }),
    ).toBe(true);
    expect(
        check.fileSize({
            t: 'r'.repeat(config.fileSizeLimit - 8 + 1),
        }),
    ).toBe(false);
    expect(
        check.fileSize({
            t: '我'.repeat((config.fileSizeLimit - 8) / 3),
        }),
    ).toBe(true);
    expect(
        check.fileSize({
            t: '我'.repeat((config.fileSizeLimit - 8) / 3 + 1),
        }),
    ).toBe(false);
});
