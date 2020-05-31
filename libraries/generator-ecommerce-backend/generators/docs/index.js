"use strict";
const yaml = require("yaml");
const dotenv = require("dotenv");
const flat = require("flat");
const table = require("markdown-table");
const semver = require("semver");
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);

    this.option("config", {
      description:
        "use yo-rc.json config and only ask questions that aren't there.",
      type: Boolean,
      alias: "c",
      default: false
    });

    this.option("save", {
      description: "save answers to .yo-rc.json",
      type: Boolean,
      alias: "s",
      default: true
    });
  }

  _createTable(defaults, description) {
    const retval = [["Name", "Default", "Description"]];

    const defaultKeys = Object.keys(defaults);
    const descriptionKeys = Object.keys(description);
    const uniqueKeys = defaultKeys.concat(
      descriptionKeys.filter(key => defaultKeys.indexOf(key) < 0)
    );

    uniqueKeys.sort().forEach(key => {
      retval.push([key, JSON.stringify(defaults[key]), description[key]]);
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
    const defaults = this.options.config ? this.config.getAll() : {};

    let answers = Object.assign(
      {},
      flat(
        await this.prompt([
          {
            type: "input",
            name: "docs.paths.helm",
            message: "path to Helm Chart Directory:",
            default: this.config.get("docs.paths.helm"),
            when: () => defaults["docs.paths.helm"] === undefined
          },
          {
            type: "input",
            name: "docs.paths.app",
            message: "path to Node application:",
            defualt: this.config.get("docs.paths.app"),
            when: () => defaults["docs.paths.app"] === undefined
          },
          {
            type: "input",
            name: "docs.paths.out",
            message: "path to output directory:",
            defualt:
              this.config.get("docs.paths.out") || this.destinationPath(),
            when: () => defaults["docs.paths.out"] === undefined
          }
        ])
      ),
      defaults
    );

    if (this.options.save) {
      this.config.set(answers);
    }

    answers = flat.unflatten(answers);

    const dirs = answers.docs.paths;

    const rawData = {
      helm: {
        chart: this.fs.read(this.destinationPath(dirs.helm, "Chart.yaml")),
        values: this.fs.read(this.destinationPath(dirs.helm, "values.yaml"))
      },
      app: {
        env: this.fs.read(this.destinationPath(dirs.app, ".env.sample")),
        package: this.fs.read(this.destinationPath(dirs.app, "package.json")),
        nodeVersion: this.fs.read(this.destinationPath(dirs.app, ".nvmrc"))
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
        package: JSON.parse(rawData.app.package) || {},
        nodeVersion: semver.clean(rawData.app.nodeVersion)
      }
    };

    this.fs.copyTpl(
      this.templatePath("helm.md.ejs"),
      this.destinationPath(dirs.out, "helm.md"),
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
      this.destinationPath(dirs.out, "app.md"),
      {
        name: "",
        version: "",
        scripts: {},
        description: "",
        ...parsed.app.package,
        envTable: table(this._createTable(parsed.app.env, comments.app.env), {
          alignDelimiters: false
        }),
        nodeVersion: parsed.app.nodeVersion || ""
      }
    );
  }
};
