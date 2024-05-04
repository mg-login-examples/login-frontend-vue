#!/bin/sh
docker_down_all_containers() { docker-compose -f docker-compose.yml -p frontend down --rmi all -v --remove-orphans; }
build_backend_stack_docker_images() { docker-compose -f docker-compose.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend build; }
run_db_migrations() { docker-compose -f docker-compose.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend run fastapi poetry run alembic upgrade head; }
create_admin_users() { docker-compose -f docker-compose.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend run fastapi poetry run python main.py add_admin_user $1 $2; }

setup_backend() {
  docker_down_all_containers
  # Ensure app.log file is created otherwise docker creates app.log directory by default as it is mounted
  touch backend/app.log
  touch backend/app-tests.log
  # build backend stack images, run db migrations and create test admin users
  build_backend_stack_docker_images && run_db_migrations && create_admin_users $1 $2
}

frontend_options="<option> one of: launch, build-prod, unit-tests, tdd, lint-check, type-check, custom <your_custom_command>"


case=${1:-default}
if [ $case = "launch-app-local" ]
then
  # Define test admin users
  BACKEND_ADMIN_USER_EMAIL="admin@admin.admin"
  BACKEND_ADMIN_USER_PASSWORD="admin"
  setup_backend $BACKEND_ADMIN_USER_EMAIL $BACKEND_ADMIN_USER_PASSWORD
  # Launch fullstack app and db
  export LOG_ENV_VARS_ON_APP_START=True
  FINAL_COMMAND=${2:-'up --build'}
  docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p backend $FINAL_COMMAND
elif [ $case = "launch-app-local-with-proxy" ]
then
  # Define test admin users
  BACKEND_ADMIN_USER_EMAIL="admin@admin.admin"
  BACKEND_ADMIN_USER_PASSWORD="admin"
  setup_backend $BACKEND_ADMIN_USER_EMAIL $BACKEND_ADMIN_USER_PASSWORD
  # set env vars
  # set auth cookie type for e2e docker tests
  export USER_AUTH_COOKIE_TYPE=same_site_not_secure
  export LOG_ENV_VARS_ON_APP_START=True
  export VITE_APP_BACKEND_URL=http://localhost:8028
  export VITE_APP_BACKEND_WEBSOCKET_URL=ws://localhost:8028/ws/main
  # launch app
  FINAL_COMMAND=${2:-'up --build'}
  docker-compose -f docker-compose.yml -f compose-files/compose.full_app_proxy.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p backend $FINAL_COMMAND
elif [ $case = "frontend" ]
then
  docker_down_all_containers
  docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -p frontend build
  test_case=${2:-launch}
  if [ $test_case = "launch" ]
  then
    FINAL_COMMAND="up"
  elif [ $test_case = "build-prod" ]
  then
    FINAL_COMMAND="up"
  elif [ $test_case = "unit-tests" ]
  then
    export VITE_LOG_ENV_VARS=false
    FINAL_COMMAND="run vueapp_dev pnpm run test-unit"
  elif [ $test_case = "tdd" ]
  then
    export VITE_LOG_ENV_VARS=false
    FINAL_COMMAND="run vueapp_dev pnpm run tdd"
  elif [ $test_case = "lint-check" ]
  then
    docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -p frontend build
    FINAL_COMMAND="run vueapp_dev pnpm run lint"
  elif [ $test_case = "type-check" ]
  then
    FINAL_COMMAND="run vueapp_dev pnpm run type-check"
  elif [ $test_case = "custom" ]
  then
    FINAL_COMMAND=${3}
  else
    echo "Unknown option passed for frontend <option>
    $frontend_options
    "
    exit 1
  fi
  docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_compiled.yml -p frontend $FINAL_COMMAND
elif [ $case = "launch-frontend-prod" ]
then
  docker_down_all_containers
  docker-compose -f docker-compose.yml -f compose-files/compose.vueapp_static.yml -p frontend up --build -d
elif [ $case = "run-e2e-tests-cypress" ]
then
  BACKEND_ADMIN_USER_EMAIL="test_admin@fakemail.com"
  BACKEND_ADMIN_USER_PASSWORD="secretpwd"
  setup_backend $BACKEND_ADMIN_USER_EMAIL $BACKEND_ADMIN_USER_PASSWORD
  # remove existing containers, otherwise error "dependency failed to start: container backend-fastapi-run-xxx exited (0)"
  docker_down_all_containers
  # Set env vars
  export LOG_ENV_VARS_ON_APP_START=True
  # set vite build env vars
  export VITE_APP_BACKEND_URL=http://backend.full_app_proxy.com
  export VITE_APP_BACKEND_WEBSOCKET_URL=ws://backend.full_app_proxy.com/ws/main
  # set full app proxy env vars for nginx config for e2e test
  export NGINX_FILENAME=nginx-e2e-test.conf
  # build frontend and cypress containers
  docker-compose -f docker-compose.yml -f compose-files/compose.cypress.yml -f compose-files/compose.full_app_proxy.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend build
  # set env vars for tests execution
  # set auth cookie type for e2e docker tests
  export USER_AUTH_COOKIE_TYPE=same_site_not_secure
  # set cypress env vars
  export CYPRESS_BASE_URL=http://frontend.full_app_proxy.com
  export CYPRESS_VIDEO=true
  # export CYPRESS_TAGS=@notes-feature
  export CYPRESS_VERIFY_TIMEOUT=100000 # Enable when running script locally and system is slow
  export CYPRESS_apiUrl=http://backend.full_app_proxy.com/api
  export CYPRESS_adminApiUrl=http://backend.full_app_proxy.com/api/admin
  export CYPRESS_adminApiLoginUsername=$BACKEND_ADMIN_USER_EMAIL
  export CYPRESS_adminApiLoginPassword=$BACKEND_ADMIN_USER_PASSWORD
  # export CYPRESS_TAGS=@tag1,@tag2 # example with multiple tags
  # run e2e cypress tests
  docker-compose -f docker-compose.yml -f compose-files/compose.cypress.yml -f compose-files/compose.full_app_proxy.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend run vueapp_test_e2e_cypress pnpm run test-e2e-cypress
elif [ $case = "run-e2e-tests-playwright" ]
then
  BACKEND_ADMIN_USER_EMAIL="test_admin@fakemail.com"
  BACKEND_ADMIN_USER_PASSWORD="secretpwd"
  setup_backend $BACKEND_ADMIN_USER_EMAIL $BACKEND_ADMIN_USER_PASSWORD
  # remove existing containers, otherwise error "dependency failed to start: container backend-fastapi-run-xxx exited (0)"
  docker_down_all_containers
  # Set env vars
  export LOG_ENV_VARS_ON_APP_START=True
  # set vite build env vars
  export VITE_APP_BACKEND_URL=http://backend.full_app_proxy.com
  export VITE_APP_BACKEND_WEBSOCKET_URL=ws://backend.full_app_proxy.com/ws/main
  # set full app proxy env vars for nginx config for e2e test
  export NGINX_FILENAME=nginx-e2e-test.conf
  # build frontend and playwright containers
  docker-compose -f docker-compose.yml -f compose-files/compose.playwright.yml -f compose-files/compose.full_app_proxy.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend build
  # set env vars for tests execution
  # set auth cookie type for e2e docker tests
  export USER_AUTH_COOKIE_TYPE=same_site_not_secure
  # set playwright env vars
  export PLAYWRIGHT_BASE_URL=http://frontend.full_app_proxy.com
  export PLAYWRIGHT_apiUrl=http://backend.full_app_proxy.com/api
  export PLAYWRIGHT_adminApiUrl=http://backend.full_app_proxy.com/api/admin
  export PLAYWRIGHT_adminApiLoginUsername=$BACKEND_ADMIN_USER_EMAIL
  export PLAYWRIGHT_adminApiLoginPassword=$BACKEND_ADMIN_USER_PASSWORD
  # run e2e playwright tests
  docker-compose -f docker-compose.yml -f compose-files/compose.playwright.yml -f compose-files/compose.full_app_proxy.yml -f compose-files/compose.vueapp_compiled.yml -f compose-files/compose.fastapi.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend run vueapp_test_e2e_playwright pnpm run test-e2e-playwright
elif [ $case = "launch-frontend-cloud-dev" ]
then
   # stop vue service only
   docker_down_all_containers
   export PRIMARY_DOMAIN="login-example.duckdns.org"
   export VITE_MODE="cloud_development"
   docker-compose -f docker-compose.yml -f docker-compose.override.yml -f compose-files/compose.vueapp_static.yml -p frontend up --build -d
elif [ $case = "launch-databases" ]
then
   docker_down_all_containers
   docker-compose -f docker-compose.yml -f compose-files/compose.mysql.yml -f compose-files/compose.mongo.yml -f compose-files/compose.redis.yml -p frontend up --build
elif [ $case = "down" ]
then
   docker_down_all_containers
else
  echo "no option passed"
  echo "available options are:
    - launch-app-local
    - launch-app-local-with-proxy
    - frontend <option>
      $frontend_options
    - launch-frontend-prod
    - run-e2e-tests-cypress
    - run-e2e-tests-playwright
    - launch-frontend-cloud-dev
    - launch-databases
    - down
  "
fi