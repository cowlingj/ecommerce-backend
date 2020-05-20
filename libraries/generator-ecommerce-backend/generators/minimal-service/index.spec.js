"use strict";
const path = require("path");
const helpers = require("yeoman-test");
const dircompare = require('dir-compare');

describe("generator-ecommerce-backend-service:minimal-service", () => {
  beforeAll(() => {
    return 
  });

  it("creates files", async () => {

    const answers = {
      "app.path": "directory",
      'app.id': 'test-chart-name',
      'app.displayName': "Display Name"
    }

    const dir = await helpers.run(path.join(__dirname))
      .withPrompts(answers);

    const res = dircompare.compareSync(
      path.resolve(__dirname, 'test-data'),
      path.resolve(dir),
      { compareContent: true }
    );

    expect(res.same, `Error directories are different, differences:
${
  JSON.stringify(res.diffSet.filter((diff) => diff.state !== 'equal' || diff.reason), null, 2)
}`).toBe(true)
  });
});
