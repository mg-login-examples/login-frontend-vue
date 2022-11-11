import { Given } from "@badeball/cypress-cucumber-preprocessor";

import CommonHelpers from "../dataHelpers/common.helpers";

// Sets external value
Given("I wait for {string} seconds", (waitTimeInSeconds: string) => {
  CommonHelpers.waitForSeconds(waitTimeInSeconds);
});
