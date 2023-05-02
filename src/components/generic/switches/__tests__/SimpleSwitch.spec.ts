import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

import SimpleSwitch from "@/components/generic/switches/SimpleSwitch.vue";

const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const selectors = {
  switchContainer: "[data-cc='switch--container']",
  switchButton: "[data-cc='switch--button']",
  switchOnIcon: "[data-cc='switch-on--icon']",
  switchOffIcon: "[data-cc='switch-off--icon']",
};

describe("components > generic > switches > SimpleSwitch", () => {
  it("toggles v-model bound boolean value when switch button is clicked", async () => {
    // mount switch
    const wrapper = mount(SimpleSwitch, {
      global: {
        stubs: { FontAwesomeIcon: true },
      },
      props: {
        modelValue: false, // set switch off initially
        // replicate vue behavior of adding v-model as attribute
        "onUpdate:modelValue": (e: boolean) =>
          wrapper.setProps({ modelValue: e }),
      },
    });
    // turn on switch
    await wrapper.find(selectors.switchContainer).trigger("click");
    // expect model value change
    expect(wrapper.props("modelValue")).toBe(true);
    // turn on switch
    await wrapper.find(selectors.switchContainer).trigger("click");
    // expect model value change
    expect(wrapper.props("modelValue")).toBe(false);
  });

  it("sets default switch container background if none is provided", async () => {
    // mount switch
    const wrapper = mount(SimpleSwitch, {
      global: {
        stubs: { FontAwesomeIcon: true },
      },
      props: {
        modelValue: false,
        "onUpdate:modelValue": (e: boolean) =>
          wrapper.setProps({ modelValue: e }),
      },
    });
    // expect default classes when switch off
    expect(
      wrapper.find(selectors.switchContainer).classes()
    ).to.include.members(["bg-gray-300", "dark:bg-gray-700"]);
    // turn on switch
    await wrapper.find(selectors.switchContainer).trigger("click");
    expect(wrapper.props("modelValue")).toBe(true);
    // expect default classes when switch on
    expect(wrapper.find(selectors.switchContainer).classes()).to.include(
      "bg-green-400"
    );
  });

  it("sets switch container background class if provided as prop", async () => {
    // declare custom classes for switch container on & off states
    const bgOffClasses = "class1 class2";
    const bgOnClasses = "class3 class4";
    // mount switch
    const wrapper = mount(SimpleSwitch, {
      global: {
        stubs: { FontAwesomeIcon: true },
      },
      props: {
        modelValue: false,
        "onUpdate:modelValue": (e: boolean) =>
          wrapper.setProps({ modelValue: e }),
        switchOffBackground: bgOffClasses,
        switchOnBackground: bgOnClasses,
      },
    });
    // assert switch off has expected custom classes
    expect(
      wrapper.find(selectors.switchContainer).classes()
    ).to.include.members(bgOffClasses.split(" "));
    // assert when switch off, custom classes for switch on are not set
    expect(
      wrapper.find(selectors.switchContainer).classes()
    ).not.to.include.members(bgOnClasses.split(" "));
    // assert default classes are not set
    expect(
      wrapper.find(selectors.switchContainer).classes()
    ).not.to.include.members(["bg-gray-300", "dark:bg-gray-700"]);

    // turn on switch
    await wrapper.find(selectors.switchContainer).trigger("click");
    expect(wrapper.props("modelValue")).toBe(true);
    // assert switch on has expected custom classes
    expect(
      wrapper.find(selectors.switchContainer).classes()
    ).to.include.members(bgOnClasses.split(" "));
    // assert when switch on, custom classes for switch off are not set
    expect(
      wrapper.find(selectors.switchContainer).classes()
    ).not.to.include.members(bgOffClasses.split(" "));
    // assert default classes are not set
    expect(wrapper.find(selectors.switchContainer).classes()).not.to.include(
      "bg-green-400"
    );
  });

  it("sets default switch button background if none is provided", async () => {
    // mount switch
    const wrapper = mount(SimpleSwitch, {
      global: {
        stubs: { FontAwesomeIcon: true },
      },
      props: {
        modelValue: false,
        "onUpdate:modelValue": (e: boolean) =>
          wrapper.setProps({ modelValue: e }),
      },
    });
    // assert switch button default classes are set
    expect(wrapper.find(selectors.switchButton).classes()).to.include.members([
      "bg-white",
      "dark:bg-black",
    ]);
  });

  it("sets switch button background class if provided as prop", async () => {
    // declare custom classes for switch button on & off states
    const bgOffClasses = "class1 class2";
    const bgOnClasses = "class3 class4";
    // mount switch
    const wrapper = mount(SimpleSwitch, {
      global: {
        stubs: { FontAwesomeIcon: true },
      },
      props: {
        modelValue: false,
        "onUpdate:modelValue": (e: boolean) =>
          wrapper.setProps({ modelValue: e }),
        switchOffButtonBackground: bgOffClasses,
        switchOnButtonBackground: bgOnClasses,
      },
    });
    // assert switch off has expected custom classes
    expect(wrapper.find(selectors.switchButton).classes()).to.include.members(
      bgOffClasses.split(" ")
    );
    // assert when switch off, custom classes for switch on are not set
    expect(
      wrapper.find(selectors.switchButton).classes()
    ).not.to.include.members(bgOnClasses.split(" "));
    // assert default classes are not set
    expect(
      wrapper.find(selectors.switchButton).classes()
    ).not.to.include.members(["bg-white", "dark:bg-black"]);

    // turn on switch
    await wrapper.find(selectors.switchContainer).trigger("click");
    expect(wrapper.props("modelValue")).toBe(true);
    // assert switch on has expected custom classes
    expect(wrapper.find(selectors.switchButton).classes()).to.include.members(
      bgOnClasses.split(" ")
    );
    // assert when switch on, custom classes for switch off are not set
    expect(
      wrapper.find(selectors.switchButton).classes()
    ).not.to.include.members(bgOffClasses.split(" "));
    // assert default classes are not set
    expect(
      wrapper.find(selectors.switchButton).classes()
    ).not.to.include.members(["bg-white", "dark:bg-black"]);
  });

  it("sets switch-on icon if switchIcon or switchOnIcon is provided", async () => {
    const switchIcon = "icon1";
    const switchOnIcon = "icon2";
    // mount switch
    const wrapper = mount(SimpleSwitch, {
      global: {
        stubs: { FontAwesomeIcon: true },
      },
      props: {
        modelValue: true,
        "onUpdate:modelValue": (e: boolean) =>
          wrapper.setProps({ modelValue: e }),
        switchIcon: switchIcon,
      },
    });
    // assert switch-on icon is visible
    expect(wrapper.find(selectors.switchOnIcon).isVisible()).toBe(true);
    // assert switch-on icon has expected value
    expect(wrapper.find(selectors.switchOnIcon).attributes("icon")).toBe(
      switchIcon
    );

    // set switchOnIcon
    await wrapper.setProps({ switchOnIcon: switchOnIcon });
    // assert switch-on icon has expected value
    expect(wrapper.find(selectors.switchOnIcon).attributes("icon")).toBe(
      switchOnIcon
    );
  });

  it("sets switch-off icon if switchIcon or switchOffIcon is provided", async () => {
    const switchIcon = "icon1";
    const switchOffIcon = "icon2";
    // mount switch
    const wrapper = mount(SimpleSwitch, {
      global: {
        stubs: { FontAwesomeIcon: true },
      },
      props: {
        modelValue: false,
        "onUpdate:modelValue": (e: boolean) =>
          wrapper.setProps({ modelValue: e }),
        switchIcon: switchIcon,
      },
    });
    // assert switch-off icon is visible
    expect(wrapper.find(selectors.switchOffIcon).isVisible()).toBe(true);
    // assert switch-off icon has expected value
    expect(wrapper.find(selectors.switchOffIcon).attributes("icon")).toBe(
      switchIcon
    );

    // set switchOnIcon
    await wrapper.setProps({ switchOffIcon: switchOffIcon });
    // assert switch-on icon has expected value
    expect(wrapper.find(selectors.switchOffIcon).attributes("icon")).toBe(
      switchOffIcon
    );
  });

  it("does not add switch icons if none are provided", async () => {
    // mount switch
    const wrapper = mount(SimpleSwitch, {
      global: {
        stubs: { FontAwesomeIcon: true },
      },
      props: {
        modelValue: false,
        "onUpdate:modelValue": (e: boolean) =>
          wrapper.setProps({ modelValue: e }),
      },
    });
    // assert switch icons not visible
    expect(wrapper.find(selectors.switchOffIcon).exists()).toBe(false);
    expect(wrapper.find(selectors.switchOnIcon).exists()).toBe(false);
    // turn on switch
    await wrapper.find(selectors.switchContainer).trigger("click");
    expect(wrapper.props("modelValue")).toBe(true);
    // assert switch icons not visible
    expect(wrapper.find(selectors.switchOffIcon).exists()).toBe(false);
    expect(wrapper.find(selectors.switchOnIcon).exists()).toBe(false);
  });
});
