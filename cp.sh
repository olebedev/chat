#!/usr/bin/env bash

rm -rf ./node_modules/swarm-api
cp -r ../swarm/packages/api ./node_modules/swarm-api
rm -rf ./node_modules/swarm-client
cp -r ../swarm/packages/client ./node_modules/swarm-client
rm -rf ./node_modules/swarm-clock
cp -r ../swarm/packages/clock ./node_modules/swarm-clock
rm -rf ./node_modules/swarm-db
cp -r ../swarm/packages/db ./node_modules/swarm-db
rm -rf ./node_modules/swarm-rdt
cp -r ../swarm/packages/rdt ./node_modules/swarm-rdt
rm -rf ./node_modules/swarm-react
cp -r ../swarm/packages/react ./node_modules/swarm-react
rm -rf ./node_modules/regular-grammar
cp -r ../swarm/packages/regular-grammar ./node_modules/regular-grammar
rm -rf ./node_modules/swarm-ron
cp -r ../swarm/packages/ron ./node_modules/swarm-ron
rm -rf ./node_modules/swarm-ron-grammar
cp -r ../swarm/packages/ron-grammar ./node_modules/swarm-ron-grammar
rm -rf ./node_modules/swarm-ron-uuid
cp -r ../swarm/packages/ron-uuid ./node_modules/swarm-ron-uuid
