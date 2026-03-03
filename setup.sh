#!/bin/bash
docker compose down
docker compose build
docker compose run api go mod tidy
docker compose run web npm install
docker compose up -d
