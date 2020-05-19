"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");

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
        name: "dir",
        message: "What directory would you like to install the service into",
        default: this.destinationRoot(),
        filter: (dir) => path.isAbsolute(dir) ? dir : this.destinationPath(dir)
      },
      {
        type: "input",
        name: "chart.name",
        message: "Name of the Helm Chart",
        default: this.destinationRoot(),
        filter: (dir) => path.isAbsolute(dir) ? dir : this.destinationPath(dir)
      }
    ];

    this.answers = await this.prompt(prompts)
  }

  async writing() {
    this.fs.copy(
      this.templatePath('app/.gitkeep'),
      this.destinationPath('app/.gitkeep')
    )
    this.fs.copyTpl(
      this.templatePath('chart/chart-name/Chart.yaml.ejs'),
      this.destinationPath(`chart/${this.answers.chart.name}/Chart.yaml`),
      {
        chart: this.answers.chart
      }
    )
  }
};
