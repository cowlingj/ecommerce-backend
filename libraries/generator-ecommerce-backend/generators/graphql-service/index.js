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
        default: "14.3.0",
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
        message: "Docker User:"
      },
      {
        type: "input",
        name: "workflows.gitUser",
        message: "Git Username:"
      },
      {
        type: "input",
        name: "workflows.gitEmail",
        message: "Git email:"
      },
      {
        type: "input",
        name: "workflows.githubActor",
        message: "Github actor:"
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
    this._autoDocs();
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
      }
    ].forEach(({ src, dest }) => {
      this.fs.copy(src, dest);
    });

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
    ["package.json", "package-lock.json", "Dockerfile", ".nvmrc"].forEach(
      filename => {
        this.fs.delete(
          this.destinationPath(this.answers.app.path, "app", `${filename}.ejs`)
        );

        this.fs.copyTpl(
          this.templatePath("path", "app", `${filename}.ejs`),
          this.destinationPath(this.answers.app.path, "app", filename),
          this.answers
        );
      }
    );

    [
      {
        src: this.templatePath("path", ".yo-rc.json.ejs"),
        dest: this.destinationPath(this.answers.app.path, ".yo-rc.json")
      },
      {
        src: this.templatePath("path", "README.md.ejs"),
        dest: this.destinationPath(this.answers.app.path, "README.md")
      },
      {
        src: this.templatePath("path", "chart", "chart-name", `Chart.yaml.ejs`),
        dest: this.destinationPath(
          this.answers.app.path,
          "chart",
          this.answers.app.id,
          "Chart.yaml"
        )
      },
      {
        src: this.templatePath(
          "path",
          "chart",
          "chart-name",
          `values.yaml.ejs`
        ),
        dest: this.destinationPath(
          this.answers.app.path,
          "chart",
          this.answers.app.id,
          "values.yaml"
        )
      },
      {
        src: this.templatePath(
          "path",
          "chart",
          "chart-name",
          "templates",
          `_helpers.tpl.ejs`
        ),
        dest: this.destinationPath(
          this.answers.app.path,
          "chart",
          this.answers.app.id,
          "templates",
          "_helpers.tpl"
        )
      },
      {
        src: this.templatePath(
          "path",
          "chart",
          "chart-name",
          "templates",
          `standalone.yaml.ejs`
        ),
        dest: this.destinationPath(
          this.answers.app.path,
          "chart",
          this.answers.app.id,
          "templates",
          "standalone.yaml"
        )
      },
      {
        src: this.templatePath("workflows", `docker.yaml.ejs`),
        dest: this.destinationPath(
          ".github",
          "workflows",
          `${this.answers.app.id}-docker.yaml`
        )
      },
      {
        src: this.templatePath("workflows", `tests.yaml.ejs`),
        dest: this.destinationPath(
          ".github",
          "workflows",
          `${this.answers.app.id}-tests.yaml`
        )
      },
      {
        src: this.templatePath("workflows", `docs.yaml.ejs`),
        dest: this.destinationPath(
          ".github",
          "workflows",
          `${this.answers.app.id}-docs.yaml`
        )
      }
    ].forEach(({ src, dest }) => {
      this.fs.copyTpl(src, dest, this.answers);
    });
  }

  _autoDocs() {
    const config = this.config.getAll();
    Object.keys(config).forEach(key => {
      this.config.delete(key);
    });

    this.config.set({
      "docs.paths.helm": this.destinationPath(
        this.answers.app.path,
        "chart",
        this.answers.app.id
      ),
      "docs.paths.app": this.destinationPath(this.answers.app.path, "app"),
      "docs.paths.out": this.destinationPath(this.answers.app.path, "docs")
    });
    this.composeWith(require.resolve("../docs/"), {
      config: true
    });
    this.config.set(config);
  }
};
