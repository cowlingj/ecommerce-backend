"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const license = require("license");
const idValidator = require("../../utils/id-validator").validator;
const semver = require("semver");

module.exports = class extends Generator {
  async prompting() {
    this.log(
      yosay(
        `Welcome to the shining ${chalk.red(
          "generator-ecommerce-backend-service"
        )} generator!`
      )
    );

    this.log(`Configuring the ${chalk.yellow("application")}`);
    const appAnswers = await this.prompt([
      {
        type: "input",
        name: "app.path",
        message: "Application Path:"
      },
      {
        type: "input",
        name: "app.scope",
        message: "application scope (leave blank for unscopped):",
        default: "",
        validate: scope => scope === "" || idValidator(scope, "scope")
      },
      {
        type: "input",
        name: "app.id",
        message: "ID:",
        validate: id => idValidator(id)
      },
      {
        type: "input",
        name: "app.displayName",
        message: "Display Name:"
      },
      {
        type: "input",
        name: "app.description",
        message: "Description:"
      },
      {
        type: "input",
        name: "app.keywords",
        message: "Keywords (space separated):",
        default: [],
        filter: keywords => {
          return keywords.trim().split(/\s+/);
        }
      },
      {
        type: "input",
        name: "app.nodeVersion",
        message: "Node Version:",
        default: "14",
        filter: version => semver.clean(version),
        validate: version => semver.clean(version) !== null
      },
      {
        type: "input",
        name: "app.author.name",
        message: "Author Name:"
      },
      {
        type: "input",
        name: "app.author.email",
        message: "Author Email:"
      },
      {
        type: "input",
        name: "app.repository",
        message: "Git Repository:"
      },
      {
        type: "input",
        name: "app.license",
        message: "License ISC:",
        default: "MIT",
        validate: isc => {
          if (
            isc.toLowerCase() === "none" ||
            license.findLicense(isc).length > 0
          ) {
            return true;
          }
          return `license "${isc}" not found`;
        }
      }
    ]);

    this.log(`Configuring the ${chalk.cyan("docker image")}`);
    const imageAnswers = await this.prompt([
      {
        type: "input",
        name: "image.repository",
        message: "Image Repository:"
      },
      {
        type: "input",
        name: "image.base",
        message: "Base Image:"
      },
      {
        type: "input",
        name: "image.registry",
        message: "Image Registry:"
      }
    ]);

    this.log(`Configuring ${chalk.magenta("GitHub workflow")}`);
    const githubWorkflow = await this.prompt([
      {
        type: "input",
        name: "workflows.dockerUser",
        message: "Docker User for workflow:"
      }
    ]);

    this.answers = {
      ...appAnswers,
      ...imageAnswers,
      ...githubWorkflow
    };
  }

  writing() {
    this._copying();
    this._templating();
  }

  _copying() {
    [
      {
        src: this.templatePath("path", "app"),
        dest: this.destinationPath(this.answers.app.path, "app")
      },
      {
        src: this.templatePath("path", "app", ".*"),
        dest: this.destinationPath(this.answers.app.path, "app")
      },
      {
        src: this.templatePath("path", "app", ".env.sample"),
        dest: this.destinationPath(this.answers.app.path, "app", ".env")
      },
      {
        src: this.templatePath("path", ".yo-rc.json"),
        dest: this.destinationPath(this.answers.app.path, ".yo-rc.json")
      },
    ].forEach(({src, dest}) =>{
      this.fs.copy(src, dest);
    })

    if (
      this.answers.app.license &&
      this.answers.app.license.toLowerCase() != "none"
    ) {
      this.fs.write(
        this.destinationPath(this.answers.app.path, "LICENSE.txt"),
        license.getLicense(this.answers.app.license, {
          year: new Date().getFullYear(),
          author: this.answers.app.author.name,
          email: this.answers.app.author.email,
          project: this.answers.app.displayName
            ? this.answers.app.displayName
            : this.answers.app.id
        })
      );
    }

    // eslint in this project will pick up the file .eslintrc.json
    // so we must rename the file in the template directory
    // hence the need to rename it back here
    this.fs.move(
      this.destinationPath(this.answers.app.path, "app", "not.eslintrc.json"),
      this.destinationPath(this.answers.app.path, "app", ".eslintrc.json")
    );
  }

  _templating() {
    ["package.json", "package-lock.json", "Dockerfile", ".nvmrc"].forEach(filename => {
      this.fs.delete(
        this.destinationPath(this.answers.app.path, "app", `${filename}.ejs`)
      );

      this.fs.copyTpl(
        this.templatePath("path", "app", `${filename}.ejs`),
        this.destinationPath(this.answers.app.path, "app", filename),
        this.answers
      );
    });

    this.fs.copyTpl(
      this.templatePath("path", "README.md.ejs"),
      this.destinationPath(this.answers.app.path, "README.md"),
      this.answers
    );

    [
      "Chart.yaml",
      "values.yaml",
      "templates/_helpers.tpl",
      "templates/standalone.yaml"
    ].forEach(filename => {
      this.fs.copyTpl(
        this.templatePath("path", "chart", "chart-name", `${filename}.ejs`),
        this.destinationPath(
          this.answers.app.path,
          "chart",
          this.answers.app.id,
          filename
        ),
        this.answers
      );
    });

    ["docker.yaml", "tests.yaml"].forEach(filename => {
      this.fs.copyTpl(
        this.templatePath("workflows", `${filename}.ejs`),
        this.destinationPath(
          ".github",
          "workflows",
          `${this.answers.app.id}-${filename}`
        ),
        this.answers
      );
    });
  }
};
