#!/bin/sh
docker_down_all_frontend_containers() { docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.vueapp_static.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -f compose-files/compose.full_app_proxy.yml -f compose-files/compose.cypress.yml -p frontend down; }
build_backend_stack_docker_images() { docker-compose -f docker-compose.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend build; }
run_db_migrations() { docker-compose -f docker-compose.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend run fastapi alembic upgrade head; }
create_admin_users() { docker-compose -f docker-compose.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend run fastapi python main.py add_admin_user $1 $2; }

case=${1:-default}
if [ $case = "launch-frontend-local" ]
then
   docker_down_all_frontend_containers
   export VITE_LOG_ENV_VARS=true
   docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -p frontend up --build
elif [ $case = "launch-tdd" ]
then
   docker_down_all_frontend_containers
   docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -p frontend build
   export VITE_LOG_ENV_VARS=false
   docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -p frontend run vueapp_dev npm run test:unit
elif [ $case = "run-unit-tests" ]
then
   docker_down_all_frontend_containers
   docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -p frontend build
   export VITE_LOG_ENV_VARS=false
   docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -p frontend run vueapp_dev npm run test:unit:run
elif [ $case = "run-e2e-tests" ]
then
   docker_down_all_frontend_containers
   # create backend log file (used as docker volume) to prevent docker from creating a directory
   touch backend/app.log
   # Define test admin users
   BACKEND_ADMIN_USER_EMAIL="test_admin@fakemail.com"
   BACKEND_ADMIN_USER_PASSWORD="secretpwd"
   # build backend stack images, run db migrations and create test admin users
   build_backend_stack_docker_images && run_db_migrations && create_admin_users $BACKEND_ADMIN_USER_EMAIL $BACKEND_ADMIN_USER_PASSWORD
   # Set env vars before building images
   # set vite build env vars
   export VITE_APP_BACKEND_URL=http://backend.full_app_proxy.com
   export VITE_APP_BACKEND_WEBSOCKET_URL=ws://backend.full_app_proxy.com/ws/main
   # set full app proxy env vars for nginx config for e2e test
   export NGINX_FILENAME=nginx-e2e-test.conf
   # build frontend and cypress containers
   docker-compose -f docker-compose.yml -f compose-files/compose.cypress.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -f compose-files/compose.full_app_proxy.yml -p frontend build
   # set env vars for tests execution
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
   docker-compose -f docker-compose.yml -f compose-files/compose.cypress.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -f compose-files/compose.full_app_proxy.yml -p frontend run vueapp_test_e2e npm run test:e2e:dev:run:docker
elif [ $case = "launch-frontend-cloud-dev" ]
then
   # stop vue service only
   docker_down_all_frontend_containers
   export PRIMARY_DOMAIN="login-example.duckdns.org"
   export VITE_MODE="cloud_development"
   docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_static.yml -p frontend up --build -d
elif [ $case = "launch-frontend-prod" ]
then
   docker_down_all_frontend_containers
   docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_static.yml -p frontend up --build -d
elif [ $case = "launch-fullstack-local" ]
then
   docker_down_all_frontend_containers
   # Ensure app.log file is created otherwise docker creates app.log directory by default as it is mounted
   touch backend/app.log
   # Define test admin users
   BACKEND_ADMIN_USER_EMAIL="admin@admin.admin"
   BACKEND_ADMIN_USER_PASSWORD="admin"
   # build backend stack images, run db migrations and create test admin users
   build_backend_stack_docker_images && run_db_migrations && create_admin_users $BACKEND_ADMIN_USER_EMAIL $BACKEND_ADMIN_USER_PASSWORD
   # launch app
   docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend up --build
elif [ $case = "launch-fullstack-local-with-proxy" ]
then
   docker_down_all_frontend_containers
   # Ensure app.log file is created otherwise docker creates app.log directory by default as it is mounted
   touch backend/app.log
   # Define test admin users
   BACKEND_ADMIN_USER_EMAIL="admin@admin.admin"
   BACKEND_ADMIN_USER_PASSWORD="admin"
   # build backend stack images, run db migrations and create test admin users
   build_backend_stack_docker_images && run_db_migrations && create_admin_users $BACKEND_ADMIN_USER_EMAIL $BACKEND_ADMIN_USER_PASSWORD
   # # delete containers to prevent duplicate network errors
   # docker_down_all_frontend_containers
   # set env vars
   # set auth cookie type for e2e docker tests
   export USER_AUTH_COOKIE_TYPE=same_site_not_secure
   export VITE_APP_BACKEND_URL=http://backend.login.com:8030
   export VITE_APP_BACKEND_WEBSOCKET_URL=ws://backend.login.com:8030/ws/main
   # launch app
   docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -f compose-files/compose.full_app_proxy.yml -p frontend up --build
elif [ $case = "launch-databases" ]
then
   docker_down_all_frontend_containers
   docker-compose -f docker-compose.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend up --build
elif [ $case = "down" ]
then
   docker_down_all_frontend_containers
   # Stop all backend project's containers
   # docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.vueapp_static.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -f compose-files/compose.cypress.yml -p frontend down
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
    - launch-fullstack-local-with-proxy
    - launch-databases
    - down
    "
fi