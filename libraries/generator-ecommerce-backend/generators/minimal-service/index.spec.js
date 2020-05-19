"use strict";
const path = require("path");
const helpers = require("yeoman-test");
const fs = require('fs')

describe("generator-ecommerce-backend-service:minimal-service", () => {
  beforeAll(() => {
    return 
  });

  it("creates files", async () => {
    const chartName = 'test-chart-name';
    const dir = await helpers.run(path.join(__dirname))
      .withPrompts({ dir: "directory", 'chart.name': chartName });

    expect(
      fs.existsSync(path.resolve(dir, 'app', '.gitkeep'))
    ).toBe(
      true
    )

    expect(
      fs.readFileSync(
        path.resolve(dir, 'chart', chartName, 'Chart.yaml'),
        { encoding: 'utf-8' }
      )
    ).toEqual(
      fs.readFileSync(
        path.resolve(__dirname, 'test-data', 'Chart.yaml'),
        { encoding: 'utf-8' }
      )
    )
  });
});
