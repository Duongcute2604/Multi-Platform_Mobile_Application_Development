/**
 * Cấu hình Jest cho backend.
 *
 * Không có file này thì Jest dùng babel-jest mặc định, không hiểu TypeScript:
 * mọi file `*.spec.ts` đều fail với "SyntaxError: Unexpected token" trước khi
 * chạy được dòng assert nào. ts-jest + `paths` là bắt buộc vì backend dùng
 * alias `@cook/shared` và `@shared/*`.
 */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  // Chỉ test trong src/: `dist/` chứa bản build của chính các file test đó,
  // chạy lại chúng là thừa (và trước đây làm báo động sai).
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../packages/shared/src/$1',
    '^@cookbook/shared$': '<rootDir>/../packages/shared/src/index',
    '^@cookbook/shared/(.*)$': '<rootDir>/../packages/shared/src/$1',
    '^@cook/shared$': '<rootDir>/../packages/shared/src/index',
    '^@cook/shared/(.*)$': '<rootDir>/../packages/shared/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['<rootDir>/dist/', 'node_modules', '.module.ts$'],
};