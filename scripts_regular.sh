#!/bin/sh
frontend_options="<option> one of: launch, build-dev, build-prod, unit-tests, tdd, lint-check, type-check, e2e-tests-cypress, e2e-tests-cypress-ui, e2e-tests-playwright, e2e-tests-playwright-ui, e2e-tests-playwright-headed, custom <your_custom_command>"

case=${1:-default}
if [ $case = "frontend" ]
then
  cd frontend
  pnpm i
  test_case=${2:-launch}
  if [ $test_case = "launch" ]
  then
    FINAL_COMMAND="pnpm dev"
  elif [ $test_case = "build-dev" ]
  then
    FINAL_COMMAND="pnpm run build-dev"
  elif [ $test_case = "build-prod" ]
  then
    FINAL_COMMAND="pnpm run build-prod"
  elif [ $test_case = "unit-tests" ]
  then
    FINAL_COMMAND="pnpm run test-unit"
  elif [ $test_case = "tdd" ]
  then
    FINAL_COMMAND="pnpm run tdd"
  elif [ $test_case = "lint-check" ]
  then
    FINAL_COMMAND="pnpm run lint"
  elif [ $test_case = "type-check" ]
  then
    FINAL_COMMAND="pnpm run type-check"
  elif [ $test_case = "e2e-tests-cypress" ]
  then
    FINAL_COMMAND="pnpm run test-e2e-cypress"
  elif [ $test_case = "e2e-tests-cypress-ui" ]
  then
    FINAL_COMMAND="pnpm run test-e2e-cypress-ui"
  elif [ $test_case = "e2e-tests-playwright" ]
  then
    FINAL_COMMAND="pnpm run test-e2e-playwright"
  elif [ $test_case = "e2e-tests-playwright-ui" ]
  then
    FINAL_COMMAND="pnpm run test-e2e-playwright-ui"
  elif [ $test_case = "e2e-tests-playwright-headed" ]
  then
    FINAL_COMMAND="pnpm run test-e2e-playwright-headed"
  elif [ $test_case = "custom" ]
  then
    FINAL_COMMAND=${3}
  else
    echo "Unknown option passed for frontend <option>
    $frontend_options
    "
    exit 1
  fi
  $FINAL_COMMAND
else
  echo "unsupported command passed '$case'"
  echo "available commands are:
  - frontend <option>
    $frontend_options
  "
fi