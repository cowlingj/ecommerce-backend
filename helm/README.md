# Helm

Contains a local repository and a set of helper charts

All charts in backend should be packaged to `/repo` (`helm package path/to/chart --destination repo`)
The repo is served at `https://raw.githubusercontent.com/cowlingj/ecommerce-backend/master/helm/repo`
It's also possible to create a local repo `helm serve --repo-path repo`