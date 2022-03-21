#!/bin/sh

# start the container stack
# (assumes the caller has permission to do this)
docker-compose -f ./localDB/docker-compose.yml up -d

# wait for the service to be ready
while ! curl --fail --silent --head http://localhost:5050; do
  sleep 1
done

# open the browser window
open http://localhost:5050