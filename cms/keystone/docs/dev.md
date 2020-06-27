# Development

The `./dev/` folder contains docker-compose configuration for deploying containers to support the CMS.

- MongoDB is needed by keystone and is therefore deployed.

- Keycloak and Keycloak Gatekeeper are deployed to enable testing authentication and authorization to the CMS.

> Keycloak realm configurations here should be kept representative of production to aid the development process.
> However the exact realm configurations used here should NOT BE USED IN PRODUCTION!
> They are deliberately committed to the repository to make development and testing easier
> by having a keycloak instance that resembles the production environment,
> as a result these configurations should be considered public information.

- docker-host acts as a proxy to the host the containers are running on.

> Running the CMS on the host means it can be run in development mode, simplifying development and testing.
> However, the hostname/IP address differs between MacOS and Linux (and sometimes even from deployment to deployment on the same machine),
> so this container abstracts away all the logic necessary to reliably access the host.

## Credentials

> These credentials should NOT BE USED IN PRODUCTION!
> They are deliberately committed to the repository to make development and testing easier
> by having a keycloak instance that resembles the production environment,
> as a result these credentials should be considered public information.

- Keycloak admin/root username and password can be found in `.env` as `KEYCLAOK_USERNAME` and `KEYCLOAK_PASSWORD` resectfully.
- Keystone admin username/email is "keystone-admin@nodomain", and password is "admin"

## Password Generation

Passwords can be generated for users using the keycloak-passwords.py script.
Pass '{ "password": "PASSWORD" }' in via stdin to the program.
The output is the "secretData" and "credentialData" required for keycloak.

Passwords can also be generated using the keycloak admin console.

> paswords generated via script are just as secure as those generated using the admin console.

## Exporting Keycloak Realms

Exporting keycloak configuration is useful when planning to make changes to production since the admin console can be used to make changes.
However, exporting from the admin console is not suitable because not all data is exported correctly including passwords and client secrets.
executing the following command inside the keycloak container will export all realms to `/tmp/realms.json` inside the container.

```sh
/opt/jboss/keycloak/bin/standalone.sh \
  -Djboss.socket.binding.port-offset=10000 \
  -Dkeycloak.migration.action=export \
  -Dkeycloak.migration.provider=singleFile \
  -Dkeycloak.migration.usersExportStrategy=REALM_FILE \
  -Dkeycloak.migration.file=/tmp/realms.json
```

> By exporting realms created from scratch (recommended),
> or by changing all confidential data,
> production ready realm configurations can be created. 

## Keycloak Gatekeeper vs Louketo Proxy

Louketo Proxy is a reimplementation of Keycloak Gatekeeper using golang.
Both are interchangable but Keycloak Gatekeeper will be depricated soon.
Currently, the documentation describes keycloak-gatekeeper so that is the proxy used here.

## Keycloak Gatekeeper Configuration

Documentation for Keycloak Gatekeeper can be found in the [Keycloak docs](https://www.keycloak.org/docs/latest/securing_apps/#_keycloak_generic_adapter),
however, the list of configuration options described isn't complete.
More options can be found by running keycloak-gatekeeper with the help argument (`docker run keycloak/keycloak-gatekeeper help`),
or by looking at the [source code](https://github.com/louketo/louketo-proxy/blob/master/doc.go).
