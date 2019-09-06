#!/usr/bin/env bash

set -u

clean() {
  helm delete --purge integration-test
}
trap clean EXIT

clean

docker build -t integration.test.local:test ./main
docker build -t cms.frontend.local:test ../main

helm dependency update ./chart || exit 1
helm install --name integration-test ./chart || exit 1

# let initialisation finish
kubectl wait --timeout 120s --for=condition=Ready --all pods || exit 1

# run tests
kubectl run integration-test \
  --stdin \
  --tty \
  --rm \
  --generator=run-pod/v1 \
  --restart=Never \
  --image=integration.test.local:test
 