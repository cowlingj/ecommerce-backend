# keystone-cms

> This documentation is generated automatically do not edit by hand

chart version: 0.2.0
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
| basePath | "" | BASE_PATH environment variable |
| cookieSecret | null | COOKIE_SECRET environment variable |
| env | "production" | NODE_ENV environment variable |
| features.events | true | whether events are enabled in the CMS  |
| features.products | true | whether products are enabled in the CMS |
| features.resources | true | whether resources are enabled in the CMS |
| fullnameOverride | "" | |
| image | | configure the images used within the deployment |
| image.init.pullPolicy | "IfNotPresent" | |
| image.init.repository | "gcr.io/gke-test-253221/init.cms.admin" | |
| image.init.tag | "0.0.1" | |
| image.main.pullPolicy | "IfNotPresent" | |
| image.main.repository | "gcr.io/gke-test-253221/cms.admin" | |
| image.main.tag | "0.0.3" | |
| imagePullSecrets | [] | |
| mongodb.admin.database | "admin" | database for the admin user to use |
| mongodb.admin.username | "root" | username for the admin database user |
| mongodb.cms.database | "cms" | database for the CMS user to use |
| mongodb.cms.username | "cms" | username for the CMS database user |
| mongodb.host | "mongo" | hostname for mongodb instance |
| mongodb.port | 27017 | port for mongodb instance |
| nameOverride | "" | |
| nodeSelector | {} | |
| replicaCount | 1 | |
| resources.init | {} | |
| resources.main | {} | |
| secrets | | kubernetes secrets to create or use |
| secrets.*.data | | yaml data to be  stored in the created secret (when exists: false used to cause secret to be created) |
| secrets.*.exists | | whether the secret already exists or does it need to be created by this chart |
| secrets.*.fullnameOverride | | the name of the secret |
| secrets.*.nameOverride | | the name of the secret if no fullnameOverride exists (appended to release name) |
| secrets.mongodbAdmin | | password used to create the CMS database and user if they do not exist (this secret cannot be created with exists: false) |
| secrets.mongodbAdmin.fullnameOverride | "" | |
| secrets.mongodbAdmin.nameOverride | "mongodb-admin-secret" | |
| secrets.mongodbCms | | password for mongodb to access the database as the cms |
| secrets.mongodbCms.data.password | null | |
| secrets.mongodbCms.exists | false | |
| secrets.mongodbCms.fullnameOverride | "" | |
| secrets.mongodbCms.nameOverride | "mongodb-cms-secret" | |
| secrets.strings | | kubernetes secret to store default string resources |
| secrets.strings.data.*.key | | key/id of the resource the resource |
| secrets.strings.data.*.value | | string value for the resource |
| secrets.strings.data.strings | [] | |
| secrets.strings.exists | false | |
| secrets.strings.fullnameOverride | "" | |
| secrets.strings.nameOverride | "strings-secret" | |
| secrets.users | | kubernetes secret used to store default users |
| secrets.users.data.users.*.isAdmin | | whether or not the user is an administrator |
| secrets.users.data.users.*.password | | password to log into the CMS with |
| secrets.users.data.users.*.username | | username to log into the CMS with |
| secrets.users.data.users.0.isAdmin | true | |
| secrets.users.data.users.0.password | "password" | |
| secrets.users.data.users.0.username | "admin" | |
| secrets.users.exists | false | |
| secrets.users.fullnameOverride | "" | |
| secrets.users.nameOverride | "users-secret" | |
| service.fullnameOverride | "" | |
| service.nameOverride | "" | |
| service.port | 80 | |
| service.type | "ClusterIP" | |
| tolerations | [] | |
