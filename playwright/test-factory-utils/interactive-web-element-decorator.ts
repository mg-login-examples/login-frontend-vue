import { InteractiveWebElement } from './interactive-web-element'

export function interactiveWebElement(label: string, selector: string) {
  return function (target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return new InteractiveWebElement(label, selector, this.page, this.userName)
      }
    })

    Object.defineProperty(target.constructor, `${propertyKey}Label`, {
      value: label,
      writable: false,
      configurable: false
    })

    Object.defineProperty(target.constructor, `${propertyKey}Selector`, {
      value: selector,
      writable: false,
      configurable: false
    })
  }
}
