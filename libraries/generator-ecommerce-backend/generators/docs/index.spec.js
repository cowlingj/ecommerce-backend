"use strict";
const path = require("path");
const helpers = require("yeoman-test");
const fs = require("fs");

describe("generator-ecommerce-backend-service:docs", () => {
  it("creates correct docs with dependencies and scripts", async () => {
    const answers = {
      "paths.helm": path.resolve(
        __dirname,
        "test-data",
        "chart-with-dependencies"
      ),
      "paths.app": path.resolve(__dirname, "test-data", "app-with-scripts")
    };
    const dir = await helpers.run(path.join(__dirname)).withPrompts(answers);
    expect(
      fs.readFileSync(path.resolve(dir, "helm.md"), { encoding: "utf-8" })
    ).toEqual(
      fs.readFileSync(
        path.resolve(
          __dirname,
          "test-expected-output",
          "helm-with-dependencies.md"
        ),
        { encoding: "utf-8" }
      )
    );

    expect(
      fs.readFileSync(path.resolve(dir, "app.md"), { encoding: "utf-8" })
    ).toEqual(
      fs.readFileSync(
        path.resolve(__dirname, "test-expected-output", "app-with-scripts.md"),
        { encoding: "utf-8" }
      )
    );
  });

  it("creates correct docs without dependencies or scripts", async () => {
    const answers = {
      "paths.helm": path.resolve(
        __dirname,
        "test-data",
        "chart-without-dependencies"
      ),
      "paths.app": path.resolve(__dirname, "test-data", "app-without-scripts")
    };
    const dir = await helpers.run(path.join(__dirname)).withPrompts(answers);
    expect(
      fs.readFileSync(path.resolve(dir, "helm.md"), { encoding: "utf-8" })
    ).toEqual(
      fs.readFileSync(
        path.resolve(
          __dirname,
          "test-expected-output",
          "helm-without-dependencies.md"
        ),
        { encoding: "utf-8" }
      )
    );

    expect(
      fs.readFileSync(path.resolve(dir, "app.md"), { encoding: "utf-8" })
    ).toEqual(
      fs.readFileSync(
        path.resolve(
          __dirname,
          "test-expected-output",
          "app-without-scripts.md"
        ),
        { encoding: "utf-8" }
      )
    );
  });
});
