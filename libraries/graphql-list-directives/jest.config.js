module.exports = {
  "rootDir": ".",
  "roots": ["<rootDir>/src"],
  "transform": {
    "^.+\\.(ts)|(gql)|(graphql)$": "babel-jest",
  },
  "testRegex": "(?:\\.|\\/)spec\\.ts$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "collectCoverage": true,
  "collectCoverageFrom": [
    "src/**/*.ts",
  ]
}
