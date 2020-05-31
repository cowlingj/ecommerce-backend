"use strict";
const path = require("path");
const helpers = require("yeoman-test");
const fs = require("fs");

describe("generator-ecommerce-backend-service:docs", () => {
  it("creates correct docs with dependencies and scripts", async () => {
    const answers = {
      "docs.paths.helm": "chart",
      "docs.paths.app": "app",
      "docs.paths.out": "docs"
    };

    const dir = await helpers
      .run(path.join(__dirname))
      .withPrompts(answers)
      .inTmpDir(dir => {
        fs.mkdirSync(path.resolve(dir, answers["docs.paths.helm"]));
        fs.mkdirSync(path.resolve(dir, answers["docs.paths.app"]));

        [
          {
            src: path.resolve(
              __dirname,
              "test-data",
              "chart-with-dependencies"
            ),
            dest: path.resolve(dir, answers["docs.paths.helm"])
          },
          {
            src: path.resolve(__dirname, "test-data", "app-with-scripts"),
            dest: path.resolve(dir, answers["docs.paths.app"])
          }
        ].forEach(paths => {
          fs.readdirSync(paths.src).forEach(filename => {
            fs.copyFileSync(
              path.resolve(paths.src, filename),
              path.resolve(paths.dest, filename)
            );
          });
        });
      });

    expect(
      fs.readFileSync(path.resolve(dir, answers["docs.paths.out"], "helm.md"), {
        encoding: "utf-8"
      })
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
      fs.readFileSync(path.resolve(dir, answers["docs.paths.out"], "app.md"), {
        encoding: "utf-8"
      })
    ).toEqual(
      fs.readFileSync(
        path.resolve(__dirname, "test-expected-output", "app-with-scripts.md"),
        { encoding: "utf-8" }
      )
    );
  });

  it("creates correct docs without dependencies or scripts", async () => {
    const answers = {
      "docs.paths.helm": "chart",
      "docs.paths.app": "app",
      "docs.paths.out": "docs"
    };
    const dir = await helpers
      .run(path.join(__dirname))
      .withPrompts(answers)
      .inTmpDir(dir => {
        fs.mkdirSync(path.resolve(dir, answers["docs.paths.helm"]));
        fs.mkdirSync(path.resolve(dir, answers["docs.paths.app"]));

        [
          {
            src: path.resolve(
              __dirname,
              "test-data",
              "chart-without-dependencies"
            ),
            dest: path.resolve(dir, answers["docs.paths.helm"])
          },
          {
            src: path.resolve(__dirname, "test-data", "app-without-scripts"),
            dest: path.resolve(dir, answers["docs.paths.app"])
          }
        ].forEach(paths => {
          fs.readdirSync(paths.src).forEach(filename => {
            fs.copyFileSync(
              path.resolve(paths.src, filename),
              path.resolve(paths.dest, filename)
            );
          });
        });
      });

    expect(
      fs.readFileSync(path.resolve(dir, answers["docs.paths.out"], "helm.md"), {
        encoding: "utf-8"
      })
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
      fs.readFileSync(path.resolve(dir, answers["docs.paths.out"], "app.md"), {
        encoding: "utf-8"
      })
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

  it("ignores config if it can't be loaded", async () => {
    const answers = {
      "docs.paths.helm": "chart",
      "docs.paths.app": "app",
      "docs.paths.out": "docs"
    };

    const dirPromise = helpers
      .run(path.join(__dirname))
      .withPrompts(answers)
      .withOptions({ config: true })
      .inTmpDir(dir => {
        fs.mkdirSync(path.resolve(dir, answers["docs.paths.helm"]));
        fs.mkdirSync(path.resolve(dir, answers["docs.paths.app"]));

        [
          {
            src: path.resolve(
              __dirname,
              "test-data",
              "chart-without-dependencies"
            ),
            dest: path.resolve(dir, answers["docs.paths.helm"])
          },
          {
            src: path.resolve(__dirname, "test-data", "app-without-scripts"),
            dest: path.resolve(dir, answers["docs.paths.app"])
          }
        ].forEach(paths => {
          fs.readdirSync(paths.src).forEach(filename => {
            fs.copyFileSync(
              path.resolve(paths.src, filename),
              path.resolve(paths.dest, filename)
            );
          });
        });
      });

    expect(dirPromise).resolves.not.toThrow();
  });

  it("reads config from the project directory", async () => {
    const config = {
      "docs.paths.helm": "chart",
      "docs.paths.app": "app",
      "docs.paths.out": "docs"
    };
    const dir = await helpers
      .run(path.join(__dirname))
      .withOptions({ config: true })
      .withLocalConfig(config)
      .inTmpDir(dir => {
        fs.mkdirSync(path.resolve(dir, config["docs.paths.helm"]));
        fs.mkdirSync(path.resolve(dir, config["docs.paths.app"]));

        [
          {
            src: path.resolve(
              __dirname,
              "test-data",
              "chart-without-dependencies"
            ),
            dest: path.resolve(dir, config["docs.paths.helm"])
          },
          {
            src: path.resolve(__dirname, "test-data", "app-without-scripts"),
            dest: path.resolve(dir, config["docs.paths.app"])
          }
        ].forEach(paths => {
          fs.readdirSync(paths.src).forEach(filename => {
            fs.copyFileSync(
              path.resolve(paths.src, filename),
              path.resolve(paths.dest, filename)
            );
          });
        });
      });

    expect(
      fs.readFileSync(path.resolve(dir, config["docs.paths.out"], "helm.md"), {
        encoding: "utf-8"
      })
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
  });

  it("saves config", async () => {
    const answers = {
      "docs.paths.helm": "chart",
      "docs.paths.app": "app",
      "docs.paths.out": "docs"
    };

    const dir = await helpers
      .run(path.join(__dirname))
      .withPrompts(answers)
      .inTmpDir(dir => {
        fs.mkdirSync(path.resolve(dir, answers["docs.paths.helm"]));
        fs.mkdirSync(path.resolve(dir, answers["docs.paths.app"]));

        [
          {
            src: path.resolve(
              __dirname,
              "test-data",
              "chart-without-dependencies"
            ),
            dest: path.resolve(dir, answers["docs.paths.helm"])
          },
          {
            src: path.resolve(__dirname, "test-data", "app-without-scripts"),
            dest: path.resolve(dir, answers["docs.paths.app"])
          }
        ].forEach(paths => {
          fs.readdirSync(paths.src).forEach(filename => {
            fs.copyFileSync(
              path.resolve(paths.src, filename),
              path.resolve(paths.dest, filename)
            );
          });
        });
      });

    expect(
      JSON.parse(
        fs.readFileSync(path.resolve(dir, ".yo-rc.json"), { encoding: "utf-8" })
      )
    ).toMatchObject(
      JSON.parse(
        fs.readFileSync(
          path.resolve(__dirname, "test-expected-output", ".yo-rc.json"),
          { encoding: "utf-8" }
        )
      )
    );
  });

  it("does not save config when no-config is true", async () => {
    const answers = {
      "docs.paths.helm": "chart",
      "docs.paths.app": "app",
      "docs.paths.out": "docs"
    };

    const dir = await helpers
      .run(path.join(__dirname))
      .withPrompts(answers)
      .withOptions({ save: false })
      .inTmpDir(dir => {
        fs.mkdirSync(path.resolve(dir, answers["docs.paths.helm"]));
        fs.mkdirSync(path.resolve(dir, answers["docs.paths.app"]));

        [
          {
            src: path.resolve(
              __dirname,
              "test-data",
              "chart-without-dependencies"
            ),
            dest: path.resolve(dir, answers["docs.paths.helm"])
          },
          {
            src: path.resolve(__dirname, "test-data", "app-without-scripts"),
            dest: path.resolve(dir, answers["docs.paths.app"])
          }
        ].forEach(paths => {
          fs.readdirSync(paths.src).forEach(filename => {
            fs.copyFileSync(
              path.resolve(paths.src, filename),
              path.resolve(paths.dest, filename)
            );
          });
        });
      });

    expect(
      fs.existsSync(path.resolve(dir, ".yo-rc.json"), { encoding: "utf-8" })
    ).toBe(false);
  });
});
