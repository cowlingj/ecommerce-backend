# generator-ecommerce-backend-service

## Installation [TODO]

First, install [Yeoman](http://yeoman.io) and generator-ecommerce-backend-service using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-ecommerce-backend-service
```

Then generate your new project:

```bash
yo ecommerce-backend-service
```

## Sub Generators

### docs

The docs generator generates a docs directory containing helm and app markdown documentation using the following files:
- app/package.json
- app/.env.sample
- app/.nvmrc
- chart/chart-name/Chart.yaml
- chart/chart-name/values.yaml

Doc comments can be provided in `app/.env.sample` and `chart/chart-name/values.yaml` files to add descriptions for configuration.
The format for a doc commant should be `## key: value`, no support exists for multiline comments.

> For helm values the key is the flattened value key
> e.g.
> ```yaml
> parent:
>   child:
>     - key: value
> ```
> is `parent.child.0.key`

### minimal-service

The minimum-service generator produces the expected layout for a service, with as little files as possible.
Created structure:
```
root/
|- app/
|  |- .gitkeep
|- chart/
   |- <CHART NAME>/
      |- Chart.yaml
```

## graphql-service