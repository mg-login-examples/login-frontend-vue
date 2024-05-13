export const throttle = (func: Function, delay: number) => {
  let lastCall = 0
  return function (this: any, ...args: any[]) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      func.apply(this, args)
      lastCall = now
    }
  }
}
