# prismic-events

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
| image.repository | "cowlingj/prismic-events.backend" | |
| image.tag | "0.0.1" | |
| imagePullSecrets | [] | |
| livenessProbe | null | |
| nameOverride | "" | |
| nodeSelector | {} | |
| prismic.accessToken | null | |
| prismic.queries.event | "event" | |
| prismic.queries.events | "allEvents" | |
| prismic.uri.graphql | "https://my-repo.prismic.io/graphql" | |
| prismic.uri.refs | "https://my-repo.prismic.io/api/v2" | |
| readinessProbe | null | |
| replicaCount | 1 | |
| resources | {} | |
| service.fullnameOverride | "" | |
| service.nameOverride | "" | |
| service.ports.main | 80 | |
| service.type | "ClusterIP" | |
| startupProbe | null | |
| tolerations | [] | |
