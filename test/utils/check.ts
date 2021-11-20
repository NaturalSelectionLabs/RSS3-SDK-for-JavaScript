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
