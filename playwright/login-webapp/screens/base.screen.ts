import { Page } from '@playwright/test'
import { InteractiveWebElement } from '../../test-factory-utils/interactive-web-element'

export class BaseView {
  readonly page: Page
  readonly userName: string | undefined

  static pageLoadingName = 'Page loading label'
  static pageLoadingSelector = "[data-test='app--connecting']"
  pageLoading: InteractiveWebElement

  constructor(page: Page, userName?: string) {
    this.page = page
    this.userName = userName

    this.pageLoading = new InteractiveWebElement(
      BaseView.pageLoadingName,
      BaseView.pageLoadingSelector,
      page,
      userName
    )
  }
}
