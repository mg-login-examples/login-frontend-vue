import { describe, it, expect, vi } from 'vitest'
import * as Vue from 'vue'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import UserQuotes from '@/views/UserQuotes.vue'
import QuoteCreateEdit from '@/components/Quotes/QuoteCreateEdit.vue'
import QuoteDelete from '@/components/Quotes/QuoteDelete.vue'
import QuoteTile from '@/components/Quotes/QuoteTile.vue'
import { useQuotesStore } from '@/store/quotes'
import { fakeQuotes } from '@/__mocks__/data/quotes'

const selectors = {
  createQuoteButton: "[data-test='user-quote--open-create-quote-modal-button']"
}

describe('views > UserQuotes.vue', () => {
  it('renders a list of user quotes from quotes store', async () => {
    // mount component
    const wrapper = mount(UserQuotes, {
      global: {
        stubs: ['QuoteTile', 'QuoteCreateEdit', 'QuoteDelete', 'FontAwesomeIcon'],
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      }
    })
    const quotesStore = useQuotesStore()
    // assert no quote tiles rendered
    expect(quotesStore.userQuotes.length).toBe(0)
    expect(wrapper.findAllComponents(QuoteTile).length).toBe(0)
    // set userQuotes in quotes store
    quotesStore.userQuotes = fakeQuotes
    await Vue.nextTick()
    // assert each user quote from quotes store rendered as a quoteTile
    const quoteTileComponents = wrapper.findAllComponents(QuoteTile)
    expect(quoteTileComponents.length).toBe(fakeQuotes.length)
    for (const quoteTileComponent of quoteTileComponents) {
      expect(quoteTileComponent.props('quote')).toBeTruthy()
    }
  })

  it('on init, calls quotes store action to fetch all user quotes', async () => {
    // init store
    const testPinia = createTestingPinia({ createSpy: vi.fn })
    const quotesStore = useQuotesStore()
    quotesStore.getUserQuotes = vi.fn()
    // assert get user quotes action not called before component is mounted
    expect(quotesStore.getUserQuotes).not.toBeCalled()
    // mount component
    mount(UserQuotes, {
      global: {
        stubs: ['QuoteTile', 'QuoteCreateEdit', 'FontAwesomeIcon'],
        plugins: [testPinia]
      }
    })
    // assert get user quotes action called
    expect(quotesStore.getUserQuotes).toBeCalled()
  })

  it('opens create quote modal when clicking on create quote button', async () => {
    // mount component
    const wrapper = mount(UserQuotes, {
      global: {
        stubs: ['QuoteTile', 'QuoteDelete', 'FontAwesomeIcon'],
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      },
      attachTo: document.body
    })
    // assert create quote modal not visible
    expect(wrapper.findComponent(QuoteCreateEdit).exists()).toBe(false)
    // click on create quote button
    wrapper.find(selectors.createQuoteButton).trigger('click')
    await Vue.nextTick()
    // assert create quote modal is visible
    expect(wrapper.findComponent(QuoteCreateEdit).exists()).toBe(true)
  })

  it(`calls create quote action and closes modal when save quote event is emitted by CreateQuote component`, async () => {
    // mount component
    const wrapper = mount(UserQuotes, {
      global: {
        stubs: ['QuoteTile', 'QuoteDelete', 'FontAwesomeIcon'],
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      },
      attachTo: document.body
    })
    // click on create quote button
    wrapper.find(selectors.createQuoteButton).trigger('click')
    await Vue.nextTick()
    // assert create quote modal is visible
    expect(wrapper.findComponent(QuoteCreateEdit).exists()).toBe(true)
    // emit create quote event
    const quoteText = 'some quote text'
    wrapper.findComponent(QuoteCreateEdit).vm.$emit('createQuote', quoteText)
    await Vue.nextTick()
    // assert create quote action is called
    const quotesStore = useQuotesStore()
    expect(quotesStore.createUserQuote).toBeCalledWith(quoteText)
    // assert create quote modal is closed
    await Vue.nextTick()
    expect(wrapper.findComponent(QuoteCreateEdit).exists()).toBe(false)
  })

  it('closes modal when CreateQuote component emits cancel event', async () => {
    // mount component
    const wrapper = mount(UserQuotes, {
      global: {
        stubs: ['QuoteTile', 'QuoteDelete', 'FontAwesomeIcon'],
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      },
      attachTo: document.body
    })
    // click on create quote button
    wrapper.find(selectors.createQuoteButton).trigger('click')
    await Vue.nextTick()
    // assert create quote modal is visible
    expect(wrapper.findComponent(QuoteCreateEdit).exists()).toBe(true)
    // emit cancel create quote event
    wrapper.findComponent(QuoteCreateEdit).vm.$emit('cancel')
    await Vue.nextTick()
    // assert save quote action is called
    const quotesStore = useQuotesStore()
    expect(quotesStore.createUserQuote).not.toBeCalled()
    // assert create quote modal is closed
    expect(wrapper.findComponent(QuoteCreateEdit).exists()).toBe(false)
  })

  it(`
  opens delete quote modal when QuoteTile component emits delete quote event,
  calls delete quote action and closes modal when QuoteDelete component emits delete quote event
  `, async () => {
    // mount component
    const wrapper = mount(UserQuotes, {
      global: {
        stubs: ['QuoteTile', 'QuoteCreateEdit', 'FontAwesomeIcon'],
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      }
    })
    // add user quotes to quote store
    const quotesStore = useQuotesStore()
    quotesStore.userQuotes = fakeQuotes
    await Vue.nextTick()
    // assert quote tiles rendered
    const quoteTileComponents = wrapper.findAllComponents(QuoteTile)
    expect(quoteTileComponents.length).toBe(fakeQuotes.length)
    // assert delete quote modal is not visible
    expect(wrapper.findComponent(QuoteDelete).exists()).toBe(false)
    // set quote to delete
    const deleteQuoteIndex = 1
    const quoteToDelete = quotesStore.userQuotes[deleteQuoteIndex]
    // emit delete quote quote event from a quote tile component
    quoteTileComponents[deleteQuoteIndex].vm.$emit('deleteQuote', quoteToDelete.id)
    await Vue.nextTick()
    // assert delete quote modal is visible
    expect(wrapper.findComponent(QuoteDelete).isVisible()).toBe(true)
    expect((wrapper.vm as any).quoteToDelete).toEqual(quoteToDelete)
    // emit delete quote event from delete quote modal component
    wrapper.findComponent(QuoteDelete).vm.$emit('deleteQuote', quoteToDelete.id)
    await Vue.nextTick()
    // assert delete quote action is called with expected quoteId
    expect(quotesStore.deleteUserQuote).toBeCalledWith(quoteToDelete.id)
    await Vue.nextTick()
    // assert delete quote modal is closed
    expect(wrapper.findComponent(QuoteDelete).exists()).toBe(false)
  })

  it(`
  opens delete quote modal when QuoteTile component emits delete quote event,
  does not call create quote action and closes modal when QuoteDelete component emits cancel quote event
  `, async () => {
    // mount component
    const wrapper = mount(UserQuotes, {
      global: {
        stubs: ['QuoteTile', 'QuoteCreateEdit', 'FontAwesomeIcon'],
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      }
    })
    // add user quotes to quote store
    const quotesStore = useQuotesStore()
    quotesStore.userQuotes = fakeQuotes
    await Vue.nextTick()
    // assert quote tiles rendered
    const quoteTileComponents = wrapper.findAllComponents(QuoteTile)
    expect(quoteTileComponents.length).toBe(fakeQuotes.length)
    // assert delete quote modal is not visible
    expect(wrapper.findComponent(QuoteDelete).exists()).toBe(false)
    // set quote to delete
    const deleteQuoteIndex = 1
    const quoteToDelete = quotesStore.userQuotes[deleteQuoteIndex]
    // emit delete quote quote event from a quote tile component
    quoteTileComponents[deleteQuoteIndex].vm.$emit('deleteQuote', quoteToDelete.id)
    await Vue.nextTick()
    // assert delete quote modal is visible
    expect(wrapper.findComponent(QuoteDelete).isVisible()).toBe(true)
    expect((wrapper.vm as any).quoteToDelete).toEqual(quoteToDelete)
    // emit delete quote event from delete quote modal component
    wrapper.findComponent(QuoteDelete).vm.$emit('cancelDeleteQuote')
    await Vue.nextTick()
    // assert delete quote action is not called
    expect(quotesStore.deleteUserQuote).not.toBeCalled()
    await Vue.nextTick()
    // assert delete quote modal is closed
    expect(wrapper.findComponent(QuoteDelete).exists()).toBe(false)
  })
})
