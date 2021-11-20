export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testRegex: '(/test/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.ts'],
};
