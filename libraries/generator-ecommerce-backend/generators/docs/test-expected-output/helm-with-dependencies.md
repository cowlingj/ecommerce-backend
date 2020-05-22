# chart name

> This documentation is generated automatically do not edit by hand

chart version: vchart-0.0.0
app version: app-0.0.0
compatable Kubernetes versions: kube-0.0.0

chart description

## Installing the Chart

The chart can be installed into a kubernetes cluster using the `helm install` command,
but the following peer dependencies must be met first:

  - dependency1:depVersion1 (depRepo1)
  - dependency2:depVersion2 (depRepo2)

## Values

The chart can be configured with the following values:

| Name | Default | Description |
| - | - | - |
| list | | a list of values |
| list.0 | "item1" | |
| list.1 | "item2" | |
| listOuter.listInner.0 | 1 | the number 1 |
| listOuter.listInner.1 | 2 | |
| objList.0.prop1 | "value11" | |
| objList.0.prop2 | "value12" | |
| objList.1.prop1 | "value21" | |
| objList.1.prop2 | "value22" | |
| objlist.0 | | first item in objList description |
| outer | | outer description |
| outer.middle | | middle description  |
| outer.middle.inner | "inner value" | inner description |
