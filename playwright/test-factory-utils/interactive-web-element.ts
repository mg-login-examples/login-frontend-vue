import { test, Page, expect } from "@playwright/test";
import { getUserStepTitle } from "./user-step";

export class InteractiveWebElement {
  selector: string;
  name: string;

  page: Page;
  private userStepTitle: Function;

  constructor(name: string, selector: string, page: Page, username?: string) {
    this.name = name;
    this.selector = selector;

    this.page = page;
    this.userStepTitle = getUserStepTitle(username);
  }

  async click() {
    const stepTitle = this.userStepTitle(`click on ${this.name}`);
    await test.step(stepTitle, async () => {
      await this.page.click(this.selector);
    });
  }
  async dblclick() {
    const stepTitle = this.userStepTitle(`double click on ${this.name}`);
    await test.step(stepTitle, async () => {
      await this.page.dblclick(this.selector);
    });
  }
  async hover() {
    const stepTitle = this.userStepTitle(`hover on ${this.name}`);
    await test.step(stepTitle, async () => {
      await this.page.hover(this.selector);
    });
  }
  async fill(text: string) {
    const stepTitle = this.userStepTitle(
      `enter text '${text}' in ${this.name}`
    );
    await test.step(stepTitle, async () => {
      await this.page.fill(this.selector, text);
    });
  }
  async type(text: string) {
    const stepTitle = this.userStepTitle(
      `enter text '${text}' in ${this.name}`
    );
    await test.step(stepTitle, async () => {
      await this.page.type(this.selector, text);
    });
  }
  async expectToExist() {
    const stepTitle = this.userStepTitle(`expect ${this.name} to exist`);
    await test.step(stepTitle, async () => {
      await expect(
        this.page.locator(this.selector).count(),
        this.userStepTitle(
          `${this.name} should exist! Selector = ${this.selector}`
        )
      ).toBeGreaterThan(0);
    });
  }
  async checkIfExists(waitDurationInSec: number) {
    const stepTitle = this.userStepTitle(
      `check if ${this.name} exists within ${waitDurationInSec} sec`
    );
    return await test.step(stepTitle, async () => {
      try {
        await this.page.waitForSelector(this.selector, {
          timeout: waitDurationInSec * 1000,
          state: "attached",
        });
        return true;
      } catch (error) {
        this.throwErrorIfUnexpected(error);
        return false;
      }
    });
  }
  async expectSoonToExist(waitDurationInSec: number = 10) {
    const stepTitle = this.userStepTitle(
      `expect ${this.name} to exist within ${waitDurationInSec} sec`
    );
    await test.step(stepTitle, async () => {
      expect(
        await this.checkIfExists(waitDurationInSec),
        this.userStepTitle(
          `${this.name} should exist within ${waitDurationInSec} seconds! Selector = ${this.selector}`
        )
      ).toBe(true);
    });
  }
  async expectToNotExist() {
    const stepTitle = this.userStepTitle(`expect ${this.name} to not exist`);
    await test.step(stepTitle, async () => {
      await expect(
        this.page.locator(this.selector).count(),
        this.userStepTitle(
          `${this.name} should not exist! Selector = ${this.selector}`
        )
      ).toBe(0);
    });
  }
  async checkIfDoesNotExist(waitDurationInSec: number) {
    const stepTitle = this.userStepTitle(
      `check if ${this.name} does not exist within ${waitDurationInSec} sec`
    );
    return await test.step(stepTitle, async () => {
      try {
        await this.page.waitForSelector(this.selector, {
          timeout: waitDurationInSec * 1000,
          state: "detached",
        });
        return true;
      } catch (error) {
        this.throwErrorIfUnexpected(error);
        return false;
      }
    });
  }
  async expectSoonToNotExist(waitDurationInSec: number = 10) {
    const stepTitle = this.userStepTitle(
      `expect ${this.name} to not exist within ${waitDurationInSec} sec`
    );
    await test.step(stepTitle, async () => {
      expect(
        await this.checkIfDoesNotExist(waitDurationInSec),
        this.userStepTitle(
          `${this.name} should not exist within ${waitDurationInSec} seconds! Selector = ${this.selector}`
        )
      ).toBe(true);
    });
  }
  async expectToBeVisible() {
    const stepTitle = this.userStepTitle(`expect ${this.name} to be visible`);
    await test.step(stepTitle, async () => {
      await expect(
        this.page.locator(this.selector),
        this.userStepTitle(
          `${this.name} should be visible! Selector = ${this.selector}`
        )
      ).toBeVisible();
    });
  }
  async checkIfVisible(waitDurationInSec: number) {
    const stepTitle = this.userStepTitle(
      `check if ${this.name} is visible within ${waitDurationInSec} sec`
    );
    return await test.step(stepTitle, async () => {
      try {
        await this.page.waitForSelector(this.selector, {
          timeout: waitDurationInSec * 1000,
          state: "visible",
        });
        return true;
      } catch (error) {
        this.throwErrorIfUnexpected(error);
        return false;
      }
    });
  }
  async expectSoonToBeVisible(waitDurationInSec: number = 10) {
    const stepTitle = this.userStepTitle(
      `expect ${this.name} to be visible within ${waitDurationInSec} sec`
    );
    await test.step(stepTitle, async () => {
      expect(
        await this.checkIfVisible(waitDurationInSec),
        this.userStepTitle(
          `${this.name} should be visible within ${waitDurationInSec} seconds! Selector = ${this.selector}`
        )
      ).toBe(true);
    });
  }
  async expectToBeHidden() {
    const stepTitle = this.userStepTitle(`expect ${this.name} to be hidden`);
    await test.step(stepTitle, async () => {
      await expect(
        this.page.locator(this.selector),
        this.userStepTitle(
          `${this.name} should be hidden! Selector = ${this.selector}`
        )
      ).toBeHidden();
    });
  }
  async checkIfHidden(waitDurationInSec: number) {
    const stepTitle = this.userStepTitle(
      `check if ${this.name} is hidden within ${waitDurationInSec} sec`
    );
    return await test.step(stepTitle, async () => {
      try {
        await this.page.waitForSelector(this.selector, {
          timeout: waitDurationInSec * 1000,
          state: "hidden",
        });
        return true;
      } catch (error) {
        this.throwErrorIfUnexpected(error);
        return false;
      }
    });
  }
  async expectSoonToBeHidden(waitDurationInSec: number = 10) {
    const stepTitle = this.userStepTitle(
      `expect ${this.name} to be hidden within ${waitDurationInSec} sec`
    );
    await test.step(stepTitle, async () => {
      expect(
        await this.checkIfHidden(waitDurationInSec),
        this.userStepTitle(
          `${this.name} should be hidden within ${waitDurationInSec} seconds! Selector = ${this.selector}`
        )
      ).toBe(true);
    });
  }
  async expectToHaveText(text: string) {
    const stepTitle = this.userStepTitle(
      `expect ${this.name} to have text '${text}'`
    );
    await test.step(stepTitle, async () => {
      await expect(
        this.page.locator(this.selector),
        this.userStepTitle(
          `${this.name} should have text '${text}'! Selector = ${this.selector}`
        )
      ).toHaveText(text);
    });
  }
  async expectToContainText(text: string) {
    const stepTitle = this.userStepTitle(
      `expect ${this.name} to contain text '${text}'`
    );
    await test.step(stepTitle, async () => {
      await expect(
        this.page.locator(this.selector),
        this.userStepTitle(
          `${this.name} should contain text '${text}'! Selector = ${this.selector}`
        )
      ).toContainText(text);
    });
  }
  async expectToHaveValue(value: string) {
    const stepTitle = this.userStepTitle(
      `expect ${this.name} to have value ${value}`
    );
    await test.step(stepTitle, async () => {
      await expect(
        this.page.locator(this.selector),
        this.userStepTitle(
          `${this.name} should have value attribute equal to '${value}'! Selector = ${this.selector}`
        )
      ).toHaveValue(value);
    });
  }
  async expectToBeEnabled() {
    const stepTitle = this.userStepTitle(`expect ${this.name} to be enabled`);
    await test.step(stepTitle, async () => {
      await expect(
        this.page.locator(this.selector),
        this.userStepTitle(
          `${this.name} should be enabled! Selector = ${this.selector}`
        )
      ).toBeEnabled();
    });
  }
  async expectToBeDisabled() {
    const stepTitle = this.userStepTitle(`expect ${this.name} to be disabled`);
    await test.step(stepTitle, async () => {
      await expect(
        this.page.locator(this.selector),
        this.userStepTitle(
          `${this.name} should be disabled! Selector = ${this.selector}`
        )
      ).toBeEnabled();
    });
  }
  async expectToBeFocused() {
    const stepTitle = this.userStepTitle(`expect ${this.name} to be focused`);
    await test.step(stepTitle, async () => {
      await expect(
        this.page.locator(this.selector),
        this.userStepTitle(
          `${this.name} should be focused! Selector = ${this.selector}`
        )
      ).toBeFocused();
    });
  }
  async expectToBeChecked() {
    const stepTitle = this.userStepTitle(`expect ${this.name} to be checked`);
    await test.step(stepTitle, async () => {
      await expect(
        this.page.locator(this.selector),
        this.userStepTitle(
          `${this.name} should be checked! Selector = ${this.selector}`
        )
      ).toBeChecked();
    });
  }
  throwErrorIfUnexpected(error: any) {
    if ((error.message as string).includes("Target closed")) {
      throw error;
    }
  }
}
