#!/bin/bash
mate-terminal --tab --title="data-bases" -e "bash -c 'docker compose -f ./docker-compose-dev-standalone.yml up'" & sleep 60;
mate-terminal --tab --title="auth-server" -e "bash -c 'cd auth-server; rm -rf dist; rm -rf build; rm -rf node_modules; npm i; npm run start'"&
mate-terminal --tab --title="mangor-api" -e "bash -c 'cd mangor-api; rm -rf dist; rm -rf build; rm -rf node_modules; npm i; npm run start'" &
mate-terminal --tab --title="photogallery" -e "bash -c 'cd photogallery; rm -rf dist; rm -rf build; rm -rf node_modules; npm i; npm run start'" &
mate-terminal --tab --title="shared_store" -e "bash -c 'cd shared_store; rm -rf dist; rm -rf build; rm -rf node_modules; npm i; npm run start::dev'" ;
mate-terminal --tab --title="authentication" -e "bash -c 'cd authentication; rm -rf dist; rm -rf build; rm -rf node_modules; npm i; npm run start'" ;
mate-terminal --tab --title="web" -e "bash -c 'cd web; rm -rf dist; rm -rf build; rm -rf node_modules; npm i; npm run start'"
