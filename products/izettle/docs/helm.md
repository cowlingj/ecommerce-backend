# izettle-products

> This documentation is generated automatically do not edit by hand

chart version: 0.0.2
app version: 0.0.4
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
| image.repository | "cowlingj/izettle-products.backend" | |
| image.tag | "latest" | |
| imagePullSecrets | [] | |
| izettleEndpoints.auth | "https://oauth.izettle.com" | |
| izettleEndpoints.products | "https://products.izettle.com" | |
| name | "izettle-products" | |
| secrets.credentials.data.credentials.client_id | null | |
| secrets.credentials.data.credentials.client_secret | null | |
| secrets.credentials.data.credentials.password | null | |
| secrets.credentials.data.credentials.username | null | |
| secrets.credentials.exists | false | |
| secrets.credentials.nameOverride | null | |
| service.nameOverride | "products" | |
| service.ports.main.port | 80 | |
| service.type | "ClusterIP" | |
