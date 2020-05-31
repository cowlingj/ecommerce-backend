# json-products

> This documentation is generated automatically do not edit by hand

chart version: 0.0.1
app version: 0.0.1
compatable Kubernetes versions: 

## Installing the Chart

The chart can be installed into a kubernetes cluster using the `helm install` command,
but the following peer dependencies must be met first:

  > There are no peer dependencies for this chart

## Values

The chart can be configured with the following values:

| Name | Default | Description |
| - | - | - |
| group | "backend" | |
| image.pullPolicy | "IfNotPresent" | |
| image.repository | "cowlingj/json-products.backend" | |
| image.tag | "latest" | |
| replicas | 1 | |
| secrets.products.data.products.products | [] | |
| secrets.products.exists | false | |
| secrets.products.name | "json-products-secret" | |
| service.ports.main.port | 80 | |
| service.type | "ClusterIP" | |
