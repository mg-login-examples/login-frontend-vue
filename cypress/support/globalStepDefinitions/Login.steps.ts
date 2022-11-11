import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";
import CyDataSetterHelpers from "../dataHelpers/cy-data-setter.helpers";
import AllQuotesPage from "../pageObjects/all-quotes.page";

import LoginPage from "../pageObjects/login.page";
import TopbarPage from "../pageObjects/topbar.page";

Given("I go to login page", () => {
  LoginPage.goToLoginPage();
});

Given(
  "I am logged in as a user with email {string} and password {string}",
  (email: string, password: string) => {
    CyDataSetterHelpers.createUserIfNoUserExists(email, password);
    LoginPage.goToLoginPage();
    LoginPage.enterUserEmail(email);
    LoginPage.enterUserPassword(password);
    LoginPage.clickOnLoginButton();
    TopbarPage.assertLogoutButtonIsVisible();
    AllQuotesPage.assertIsOpen();
  }
);

Given("I am not logged in", () => {
  TopbarPage.assertLoginButtonIsVisible();
  TopbarPage.assertLogoutButtonIsNotVisible();
});

When("I enter the login user email {string}", (email: string) => {
  LoginPage.enterUserEmail(email);
});

When("I enter the login user password {string}", (password: string) => {
  LoginPage.enterUserPassword(password);
});

When("I click on remember me", () => {
  LoginPage.clickOnRememberMeCheckbox();
});

When("I click on login button", () => {
  LoginPage.clickOnLoginButton();
});

When("I click on toggle show login password", () => {
  LoginPage.clickOnShowPassword();
});

Then("login button is displayed on topbar", () => {
  TopbarPage.assertLoginButtonIsVisible();
});

Then("login button is not displayed on topbar", () => {
  TopbarPage.assertLoginButtonIsNotVisible();
});

Then("I am redirected to login page", () => {
  LoginPage.assertIsOpen();
});

Then("the login password text is hidden", () => {
  LoginPage.assertPasswordInputIsOfTypePassword();
});

Then("the login password text is visible", () => {
  LoginPage.assertPasswordInputIsOfTypeText();
});
