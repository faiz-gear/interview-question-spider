#!/bin/sh

# deploy the migrations
pnpm migrate:deploy

# start the server
pnpm start:prod