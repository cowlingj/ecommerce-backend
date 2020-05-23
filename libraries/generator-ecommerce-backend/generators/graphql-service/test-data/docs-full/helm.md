# test-app-id

> This documentation is generated automatically do not edit by hand

chart version: 0.0.1
app version: 0.0.1
compatable Kubernetes versions: 

A very interesting description

## Installing the Chart

The chart can be installed into a kubernetes cluster using the `helm install` command,
but the following peer dependencies must be met first:

  > There are no peer dependencies for this chart

## Values

The chart can be configured with the following values:

| Name | Default | Description |
| - | - | - |
| affinity | {} | |
| env | "production" | the NODE_ENV to run the service with |
| fullnameOverride | "" | replaces the name entirely |
| image.pullPolicy | "IfNotPresent" | the imagePullPolicy for this container  |
| image.repository | "prefix/image-name" | docker image repository |
| image.tag | "0.0.1" | docker image tag |
| imagePullSecrets | [] | imagePullSecrets for the pod |
| livenessProbe | null | |
| nameOverride | "" | replaces the pod name (appended to Chart.Name) and adds the app.kubernetes.io/name label |
| nodeSelector | {} | |
| readinessProbe | null | |
| replicaCount | 1 | |
| resources | {} | |
| service.fullnameOverride | "" | replaces the service name entirely |
| service.nameOverride | "" | replaces the service name (appended to Chart.Name) and adds the app.kubernetes.io/name label |
| service.ports.main | 80 | |
| service.type | "ClusterIP" | |
| startupProbe | null | |
| tolerations | [] | |
