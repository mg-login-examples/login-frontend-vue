// Directive to add a clickOutside event listener
// When added to an element with a callback function, the function is executed when any outside click is detected
// Useful to close menus when clicked outside
export const clickOutside = {
  mounted: async (el: HTMLElement, binding: any) => {
    // define clickOutsideEvent function that detects if click is outside element and executes callback bound to current element (element with current directive)
    (el as any).clickOutsideEvent = function (event: Event) {
      // if click event is outside current element
      if (!(el == event.target || el.contains(event.target as Node))) {
        // execute callback (event listener) function bound to clickOutside event for current element
        binding.value();
      }
    };
    // Bind clickOutsideEvent function to document body click to listen to all html body clicks
    document.body.addEventListener("click", (el as any).clickOutsideEvent);
  },
  unmounted: (el: HTMLElement) => {
    // Stop listening to all html body clicks when element is unmounted
    document.body.removeEventListener("click", (el as any).clickOutsideEvent);
  },
};
