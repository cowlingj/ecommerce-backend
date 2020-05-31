# keystone-events

> This documentation is generated automatically do not edit by hand

chart version: 0.0.1
app version: 1.0
compatable Kubernetes versions: 

A Helm chart for Kubernetes

## Installing the Chart

The chart can be installed into a kubernetes cluster using the `helm install` command,
but the following peer dependencies must be met first:

  > There are no peer dependencies for this chart

## Values

The chart can be configured with the following values:

| Name | Default | Description |
| - | - | - |
| affinity | {} | |
| env | "production" | |
| fullnameOverride | "" | |
| image.pullPolicy | "IfNotPresent" | |
| image.repository | "cowlingj/keystone-events.backend" | |
| image.tag | "latest" | |
| imagePullSecrets | [] | |
| keystone.uri | "http://keystone.localhost" | |
| livenessProbe | null | |
| nameOverride | "" | |
| nodeSelector | {} | |
| readinessProbe | null | |
| replicaCount | 1 | |
| resources | {} | |
| service.fullnameOverride | "" | |
| service.nameOverride | "" | |
| service.ports.main | 80 | |
| service.type | "ClusterIP" | |
| startupProbe | null | |
| tolerations | [] | |
