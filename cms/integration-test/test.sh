#!/usr/bin/env bash

set -u

clean() {
  helm delete --purge integration-test
}
trap clean EXIT

clean

docker build -t cms.frontend.local:test ../cms &
docker build -t store.frontend.local:test ../store &
docker build -t mongodb.backend.local:test ./mongodb &
docker build -t integration.test.local:test ./runner &

wait

# helm is the test fixture and contains infrastructure under test
helm dependency update ./deploy
helm install --name integration-test ./deploy || exit 1

# let initialisation finish
kubectl wait --timeout 60s --for=condition=Ready --all pods || exit 1

echo 'READY'

sleep 300

# run tests
kubectl run integration-test \
  --attach \
  --rm \
  --generator=run-pod/v1 \
  --restart=Never \
  --image=integration.test.local:test
 