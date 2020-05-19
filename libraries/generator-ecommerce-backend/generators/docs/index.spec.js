"use strict";
const path = require("path");
const helpers = require("yeoman-test");
const fs = require("fs");

describe("generator-ecommerce-backend-service:docs", () => {
  it("creates correct docs with dependencies and scripts", async () => {
    Object.assign(process.env, {
      INPUT_HELM_DIR: path.resolve(
        __dirname,
        "test-data",
        "chart-with-dependencies"
      ),
      INPUT_APP_DIR: path.resolve(__dirname, "test-data", "app-with-scripts")
    });
    await helpers.run(path.join(__dirname)).then(dir => {
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
          path.resolve(
            __dirname,
            "test-expected-output",
            "app-with-scripts.md"
          ),
          { encoding: "utf-8" }
        )
      );
    });
  });

  it("creates correct docs without dependencies or scripts", async () => {
    Object.assign(process.env, {
      INPUT_HELM_DIR: path.resolve(
        __dirname,
        "test-data",
        "chart-without-dependencies"
      ),
      INPUT_APP_DIR: path.resolve(__dirname, "test-data", "app-without-scripts")
    });
    await helpers.run(path.join(__dirname)).then(dir => {
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
});
