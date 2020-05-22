"use strict";
const path = require("path");
const helpers = require("yeoman-test");
const fs = require("fs");
const dircompare = require("dir-compare");

describe("generator-ecommerce-backend-service:minimal-service", () => {
  beforeAll(() => {
    return;
  });

  it("creates from minimal answers", async () => {
    const answers = {
      "app.path": "path/to/service",
      "app.id": "test-app-id",
      "app.displayName": "Display Name",
      "image.repository": "prefix/image-name",
      "image.base": "node:current",
      "image.registry": "https://registry/url",
      "workflows.dockerUser": "docker-username"
    };

    const dir = await helpers.run(path.join(__dirname)).withPrompts(answers);

    [
      {
        dest: path.resolve(__dirname, "test-data", "app-no-templates"),
        test: path.resolve(dir, answers["app.path"], "app"),
        exclude: "package.json,Dockerfile,.eslintrc.json,.env"
      },
      {
        dest: path.resolve(__dirname, "test-data", "chart-minimal"),
        test: path.resolve(dir, answers["app.path"], "chart", answers["app.id"])
      },
      {
        dest: path.resolve(__dirname, "test-data", "workflows"),
        test: path.resolve(dir, ".github", "workflows")
      }
    ].forEach(compareData => {
      const result = dircompare.compareSync(
        compareData.dest,
        compareData.test,
        {
          compareContent: true,
          excludeFilter: compareData.exclude
        }
      );

      expect(
        result.same,
        `Error directories are different, differences:\n${JSON.stringify(
          result.diffSet.filter(diff => diff.state !== "equal" || diff.reason),
          null,
          2
        )}`
      ).toBe(true);
    });

    [
      {
        dest: path.resolve(dir, answers["app.path"], "README.md"),
        test: path.resolve(__dirname, "test-data", "README.md")
      },
      {
        dest: path.resolve(dir, answers["app.path"], "app", "package.json"),
        test: path.resolve(
          __dirname,
          "test-data",
          "app-minimal",
          "not.package.json"
        )
      },
      {
        dest: path.resolve(dir, answers["app.path"], "app", ".env"),
        test: path.resolve(__dirname, "test-data", "app-minimal", ".env.sample")
      },
      {
        dest: path.resolve(dir, answers["app.path"], "app", "Dockerfile"),
        test: path.resolve(__dirname, "test-data", "app-minimal", "Dockerfile")
      },
      {
        dest: path.resolve(dir, answers["app.path"], "app", ".eslintrc.json"),
        test: path.resolve(
          __dirname,
          "test-data",
          "app-minimal",
          "not.eslintrc.json"
        )
      }
    ].forEach(data => {
      expect(fs.readFileSync(data.dest, { encoding: "utf-8" })).toEqual(
        fs.readFileSync(data.test, { encoding: "utf-8" })
      );
    });
  });

  it("creates from full answers", async () => {
    const answers = {
      "app.path": "path/to/service",
      "app.scope": "@test",
      "app.id": "test-app-id",
      "app.displayName": "Display Name",
      "app.description": `A very interesting description`,
      "app.keywords": ["test", "app"],
      "app.author.name": "author-name",
      "app.author.email": "author@email.com",
      "app.repository": "app-repo",
      "app.license": "MIT",
      "image.repository": "prefix/image-name",
      "image.base": "node:current",
      "image.registry": "https://registry/url",
      "workflows.dockerUser": "docker-username"
    };

    const dir = await helpers.run(path.join(__dirname)).withPrompts(answers);

    [
      {
        dest: path.resolve(__dirname, "test-data", "app-no-templates"),
        test: path.resolve(dir, answers["app.path"], "app"),
        exclude: "package.json,Dockerfile,.eslintrc.json,.env"
      },
      {
        dest: path.resolve(__dirname, "test-data", "chart-full"),
        test: path.resolve(dir, answers["app.path"], "chart", answers["app.id"])
      },
      {
        dest: path.resolve(__dirname, "test-data", "workflows"),
        test: path.resolve(dir, ".github", "workflows")
      }
    ].forEach(compareData => {
      const result = dircompare.compareSync(
        compareData.dest,
        compareData.test,
        {
          compareContent: true,
          excludeFilter: compareData.exclude
        }
      );

      expect(
        result.same,
        `Error directories are different, differences:\n${JSON.stringify(
          result.diffSet.filter(diff => diff.state !== "equal" || diff.reason),
          null,
          2
        )}`
      ).toBe(true);
    });

    [
      {
        dest: path.resolve(dir, answers["app.path"], "README.md"),
        test: path.resolve(__dirname, "test-data", "README.md")
      },
      {
        dest: path.resolve(dir, answers["app.path"], "LICENSE.txt"),
        test: path.resolve(__dirname, "test-data", "LICENSE.txt")
      },
      {
        dest: path.resolve(dir, answers["app.path"], "app", "package.json"),
        test: path.resolve(
          __dirname,
          "test-data",
          "app-full",
          "not.package.json"
        )
      },
      {
        dest: path.resolve(dir, answers["app.path"], "app", ".env"),
        test: path.resolve(__dirname, "test-data", "app-full", ".env.sample")
      },
      {
        dest: path.resolve(dir, answers["app.path"], "app", "Dockerfile"),
        test: path.resolve(__dirname, "test-data", "app-full", "Dockerfile")
      },
      {
        dest: path.resolve(dir, answers["app.path"], "app", ".eslintrc.json"),
        test: path.resolve(
          __dirname,
          "test-data",
          "app-full",
          "not.eslintrc.json"
        )
      }
    ].forEach(data => {
      expect(fs.readFileSync(data.dest, { encoding: "utf-8" })).toEqual(
        fs.readFileSync(data.test, { encoding: "utf-8" })
      );
    });
  });
});
