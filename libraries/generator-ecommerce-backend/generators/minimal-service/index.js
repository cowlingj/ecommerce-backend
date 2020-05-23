"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const idValidator = require("../../utils/id-validator").idValidator;

module.exports = class extends Generator {
  async prompting() {
    this.log(
      yosay(
        `Welcome to ${chalk.red(
          "generator-ecommerce-backend-service"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "app.path",
        message: "What directory would you like to install the service into",
        default: this.destinationRoot(),
        filter: dir => (path.isAbsolute(dir) ? dir : this.destinationPath(dir))
      },
      {
        type: "input",
        name: "app.id",
        message: "id of the application",
        validate: id => idValidator(id)
      },
      {
        type: "input",
        name: "app.displayName",
        message: "Name of the Helm Chart",
        default: this.destinationRoot(),
        filter: dir => (path.isAbsolute(dir) ? dir : this.destinationPath(dir))
      }
    ];

    this.answers = await this.prompt(prompts);
  }

  async writing() {
    this.fs.copy(
      this.templatePath("app/.gitkeep"),
      this.destinationPath("app/.gitkeep")
    );
    this.fs.copyTpl(
      this.templatePath("README.md.ejs"),
      this.destinationPath("README.md"),
      this.answers
    );
    this.fs.copyTpl(
      this.templatePath("chart/chart-name/Chart.yaml.ejs"),
      this.destinationPath(`chart/${this.answers.app.id}/Chart.yaml`),
      this.answers
    );
  }
};
