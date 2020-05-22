"use strict";
const path = require("path");
const fs = require("fs");
const yaml = require("yaml");
const dotenv = require("dotenv");
const flat = require("flat");
const table = require("markdown-table");
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  _createTable(defaults, description) {
    const retval = [["Name", "Default", "Description"]];

    const defaultKeys = Object.keys(defaults);
    const descriptionKeys = Object.keys(description);
    const uniqueKeys = defaultKeys.concat(
      descriptionKeys.filter(key => defaultKeys.indexOf(key) < 0)
    );

    uniqueKeys.sort().forEach(key => {
      retval.push([key, defaults[key], description[key]]);
    });

    return retval;
  }

  _getComments(data) {
    const hashCommentRegex = /^\s*##\s*([^:]+):\s*(.*)$/;

    return data.split("\n").reduce((acc, cur) => {
      const match = cur.match(hashCommentRegex);

      if (match != null) {
        return {
          ...acc,
          [match[1]]: match[2]
        };
      }

      return acc;
    }, {});
  }

  async generate() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "paths.helm",
        message: "path to Helm Chart:"
      },
      {
        type: "input",
        name: "paths.app",
        message: "path to Node application:"
      }
    ]);

    const dirs = answers.paths;

    const rawData = {
      helm: {
        chart: fs.readFileSync(path.resolve(dirs.helm, "Chart.yaml"), {
          encoding: "utf-8"
        }),
        values: fs.readFileSync(path.resolve(dirs.helm, "values.yaml"), {
          encoding: "utf-8"
        })
      },
      app: {
        env: fs.readFileSync(path.resolve(dirs.app, ".env.sample"), {
          encoding: "utf-8"
        }),
        package: fs.readFileSync(path.resolve(dirs.app, "package.json"), {
          encoding: "utf-8"
        }),
        nodeVersion: fs.readFileSync(path.resolve(dirs.app, ".nvmrc"), {
          encoding: "utf-8"
        })
      }
    };

    const comments = {
      helm: {
        values: this._getComments(rawData.helm.values) || {}
      },
      app: {
        env: this._getComments(rawData.app.env) || {}
      }
    };

    const parsed = {
      helm: {
        chart: yaml.parse(rawData.helm.chart) || {},
        values: flat(yaml.parse(rawData.helm.values) || {})
      },
      app: {
        env: flat(dotenv.parse(rawData.app.env) || {}),
        package: JSON.parse(rawData.app.package) || {}
      }
    };
    this.fs.copyTpl(
      this.templatePath("helm.md.ejs"),
      this.destinationPath("helm.md"),
      {
        name: "",
        version: "",
        appVersion: "",
        kubeVersion: "",
        dependencies: [],
        description: "",
        ...parsed.helm.chart,
        valuesTable: table(
          this._createTable(parsed.helm.values, comments.helm.values),
          { alignDelimiters: false }
        )
      }
    );

    this.fs.copyTpl(
      this.templatePath("app.md.ejs"),
      this.destinationPath("app.md"),
      {
        name: "",
        version: "",
        scripts: {},
        description: "",
        ...parsed.app.package,
        envTable: table(this._createTable(parsed.app.env, comments.app.env), {
          alignDelimiters: false
        }),
        nodeVersion: rawData.app.nodeVersion || ""
      }
    );
  }
};
