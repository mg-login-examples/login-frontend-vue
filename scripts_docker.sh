#!/bin/sh
case=${1:-default}
if [ $case = "launch-frontend-local" ]
then
   # Stop all frontend project's containers and build and start vueapp container
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -f compose.vueapp_static.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -f compose.vuecypress.yml -p frontend down
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -p frontend up --build
elif [ $case = "launch-tdd" ]
then
   # Stop all frontend project's containers, build vueapp container and run unit tests with watch
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -f compose.vueapp_static.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -f compose.vuecypress.yml -p frontend down
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -p frontend build
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -p frontend run vueapp_dev npm run test:unit
elif [ $case = "run-unit-tests" ]
then
   # Stop all frontend project's containers, build vueapp container and run unit tests
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -f compose.vueapp_static.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -f compose.vuecypress.yml -p frontend down
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -p frontend build
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -p frontend run vueapp_dev npm run test:unit:run
elif [ $case = "run-e2e-tests" ]
then
   touch backend/app.log
   # Stop all frontend project's containers, build all frontend project's containers including backend and run e2e tests
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -f compose.vueapp_static.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -f compose.vuecypress.yml  -f compose.full_app_proxy.yml -p frontend down
   # Set env vars before building images
   # set vite build env vars
   export VITE_APP_BACKEND_URL=http://backend.full_app_proxy.com
   export VITE_APP_BACKEND_WEBSOCKET_URL=ws://backend.full_app_proxy.com/ws/main
   # set full app proxy env vars for nginx config for e2e test
   export NGINX_FILENAME=nginx-e2e-test.conf
   # build images
   docker-compose -f docker-compose.yml -f compose.vuecypress.yml -f compose.vueapp_compiled.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -f compose.full_app_proxy.yml -p frontend build
   # run db migrations
   docker-compose -f docker-compose.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -p frontend run fastapi alembic upgrade head
   # create admin users
   export BACKEND_ADMIN_USER_EMAIL="test_admin@fakemail.com"
   export BACKEND_ADMIN_USER_PASSWORD="secretpwd"
   docker-compose -f docker-compose.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -p frontend run fastapi python main.py add_admin_user $BACKEND_ADMIN_USER_EMAIL $BACKEND_ADMIN_USER_PASSWORD
   # set env vars
   # set auth cookie type for e2e docker tests
   export USER_AUTH_COOKIE_TYPE=same_site_not_secure
   # set cypress env vars
   export CYPRESS_BASE_URL=http://frontend.full_app_proxy.com
   export CYPRESS_VIDEO=false
   # export CYPRESS_TAGS=@notes-feature
   export CYPRESS_VERIFY_TIMEOUT=100000 # Enable when running script locally and system is slow
   export CYPRESS_apiUrl=http://backend.full_app_proxy.com/api
   export CYPRESS_adminApiUrl=http://backend.full_app_proxy.com/api/admin
   export CYPRESS_adminApiLoginUsername=$BACKEND_ADMIN_USER_EMAIL
   export CYPRESS_adminApiLoginPassword=$BACKEND_ADMIN_USER_PASSWORD
   # export CYPRESS_TAGS=@tag1,@tag2
   # run e2e tests
   docker-compose -f docker-compose.yml -f compose.vuecypress.yml -f compose.vueapp_compiled.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -f compose.full_app_proxy.yml -p frontend run vueapp_test_e2e npm run test:e2e:dev:run:docker
elif [ $case = "launch-frontend-cloud-dev" ]
then
   touch backend/app.log
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -f compose.vueapp_static.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.vuecypress.yml -p frontend down
   export PRIMARY_DOMAIN="login-example.duckdns.org"
   export VITE_MODE="cloud_development"
   docker-compose -f docker-compose.yml -f compose.vueapp_static.yml -p frontend up --build -d
elif [ $case = "launch-frontend-prod" ]
then
   # Stop all frontend project's containers, build vueapp container and run unit tests
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -f compose.vueapp_static.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -f compose.vuecypress.yml -p frontend down
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -p frontend build
   docker-compose -f docker-compose.yml -f compose.vueapp_static.yml -p frontend up --build -d
elif [ $case = "launch-fullstack-local" ]
then
   # Ensure app.log file is created otherwise docker creates app.log directory by default as it is mounted
   touch backend/app.log
   # Stop all frontend project's containers, build and run all frontend project's containers including backend
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -f compose.vueapp_static.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -f compose.vuecypress.yml -f compose.full_app_proxy.yml -p frontend down
   # run db migrations
   docker-compose -f docker-compose.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -p frontend run fastapi alembic upgrade head
   # create admin users
   export BACKEND_ADMIN_USER_EMAIL="admin@admin.admin"
   export BACKEND_ADMIN_USER_PASSWORD="admin"
   docker-compose -f docker-compose.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -p frontend run fastapi python main.py add_admin_user $BACKEND_ADMIN_USER_EMAIL $BACKEND_ADMIN_USER_PASSWORD
   # set env vars
   # set auth cookie type for e2e docker tests
   export USER_AUTH_COOKIE_TYPE=same_site_not_secure
   export VITE_APP_BACKEND_URL=http://backend.login.com:8030
   export VITE_APP_BACKEND_WEBSOCKET_URL=ws://backend.login.com:8030/ws/main
   # launch app
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -f compose.full_app_proxy.yml -p frontend up --build
elif [ $case = "launch-databases" ]
then
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -f compose.vueapp_static.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -f compose.vuecypress.yml -p frontend down
   docker-compose -f docker-compose.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -p frontend up --build
elif [ $case = "down" ]
then
   # Stop all backend project's containers
   docker-compose -f docker-compose.yml -f compose.vueapp_compiled.yml -f compose.vueapp_static.yml -f compose.fastapi.yml -f compose.mysql.yml -f compose.mongo.yml -f compose.redis.yml -f compose.vuecypress.yml -p frontend down
else
   echo "no option passed"
   echo "available options are:
    - launch-frontend-local
    - launch-tdd
    - run-unit-tests
    - run-e2e-tests
    - launch-frontend-cloud-dev
    - launch-frontend-prod
    - launch-fullstack-local
    - launch-databases
    - down
    "
fi