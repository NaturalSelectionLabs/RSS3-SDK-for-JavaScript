export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testRegex: '(/test/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.ts'],
    globals: {
        'ts-jest': {
            compiler: 'ttypescript',
        },
    },
    setupFiles: ['./jest.setup.ts'],
    coverageProvider: 'v8',
};
