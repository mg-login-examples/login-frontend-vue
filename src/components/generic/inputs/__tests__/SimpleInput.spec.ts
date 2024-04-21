import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SimpleInput from '@/components/generic/inputs/SimpleInput.vue'
import type { Component } from 'vue'

const selectors = {
  input: "[data-cc='simple-input--input']",
  showPasswordButton: "[data-cc='simple-input--show-password-button']",
  inputIcon: "[data-cc='simple-input--input-icon']"
}

describe('components > generic > inputs > SimpleInput', () => {
  it('provides 2 way input binding', async () => {
    // mount input component
    const wrapper = mount(SimpleInput as Component, {
      global: {
        stubs: { FontAwesomeIcon: true }
      },
      props: {
        modelValue: '',
        'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e })
      }
    })
    // set input value
    await wrapper.find(selectors.input).setValue('test')
    // assert 2-way binding as expected
    expect(wrapper.props('modelValue')).toBe('test')
  })

  it('allows setting input type', () => {
    // declare test values
    const placeholder = 'some placeholder'
    const type = 'number'
    // mount input component
    const wrapper = mount(SimpleInput as Component, {
      global: {
        stubs: { FontAwesomeIcon: true }
      },
      props: {
        modelValue: '',
        'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e }),
        placeholder: placeholder,
        type: type
      }
    })
    // assert input has expected type and placeholder
    expect(wrapper.find(selectors.input).attributes('placeholder')).toBe(placeholder)
    expect(wrapper.find(selectors.input).attributes('type')).toBe(type)
  })

  it('provides show password button when input type is password', async () => {
    // mount input component
    const wrapper = mount(SimpleInput as Component, {
      global: {
        stubs: { FontAwesomeIcon: true }
      },
      props: {
        modelValue: '',
        'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e }),
        type: 'text'
      }
    })
    // assert default type is text
    expect(wrapper.find(selectors.input).attributes('type')).toBe('text')
    // assert show password button is not visible
    expect(wrapper.find(selectors.showPasswordButton).exists()).toBe(false)
    // set input type to password
    await wrapper.setProps({ type: 'password' })
    // assert show password button is visible
    expect(wrapper.find(selectors.showPasswordButton).isVisible()).toBe(true)
    await wrapper.find(selectors.showPasswordButton).trigger('click')
  })

  it('show password button allows toggles password text display', async () => {
    // mount input component
    const wrapper = mount(SimpleInput as Component, {
      global: {
        stubs: { FontAwesomeIcon: true }
      },
      props: {
        modelValue: '',
        'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e }),
        type: 'password'
      }
    })
    // assert password text is not visible
    expect(wrapper.find(selectors.input).attributes('type')).toBe('password')
    // click on toggle show password
    await wrapper.find(selectors.showPasswordButton).trigger('click')
    // assert password text is visible
    expect(wrapper.find(selectors.input).attributes('type')).toBe('text')
    // click on toggle show password
    await wrapper.find(selectors.showPasswordButton).trigger('click')
    // assert password text is not visible
    expect(wrapper.find(selectors.input).attributes('type')).toBe('password')
  })

  it('allows setting input icon', () => {
    // declare input icon
    const inputIcon = 'icon1'
    // mount input component
    const wrapper = mount(SimpleInput as Component, {
      global: {
        stubs: { FontAwesomeIcon: true }
      },
      props: {
        modelValue: '',
        'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e }),
        inputIcon: inputIcon
      }
    })
    // assert icon is visible and as expected
    expect(wrapper.find(selectors.inputIcon).isVisible()).toBe(true)
    expect(wrapper.find(selectors.inputIcon).attributes('icon')).toBe(inputIcon)
    // assert input left padding is set
    expect(wrapper.find(selectors.input).classes()).to.include('pl-8')
  })

  it('does not display input icon and removes initial input spacing if no input icon is set', () => {
    // mount input component
    const wrapper = mount(SimpleInput as Component, {
      global: {
        stubs: { FontAwesomeIcon: true }
      },
      props: {
        modelValue: '',
        'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e })
      }
    })
    // assert icon is visible and as expected
    expect(wrapper.find(selectors.inputIcon).exists()).toBe(false)
    // assert input left padding is not set
    expect(wrapper.find(selectors.input).classes()).not.to.include('pl-8')
  })
})
