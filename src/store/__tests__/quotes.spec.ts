vi.mock('@/store/errors')
vi.mock('@/api/backendApi')
vi.mock('@/store/user')
import casual from 'casual'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { fakeQuote, fakeQuotes, fakeUserQuotes } from '@/__mocks__/data/quotes'
import { fakeUser } from '@/__mocks__/data/users'
import backendApi from '@/api/backendApi'
import { useErrorsStore } from '@/store/errors'
import { useQuotesStore } from '@/store/quotes'
import { useUserStore } from '@/store/user'

const mockErrorsStore = { handleError: vi.fn() }
;(useErrorsStore as unknown as Mock).mockReturnValue(mockErrorsStore)
const mockBackendApiGetQuotes = backendApi.quotes.getQuotes as Mock
const mockBackendApiGetUserQuotes = backendApi.quotes.getUserQuotes as Mock
const mockBackendApiCreateQuote = backendApi.quotes.createQuote as Mock

const mockUserStore = { user: fakeUser }
;(useUserStore as unknown as Mock).mockReturnValue(mockUserStore)

describe('store > quotes.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockBackendApiGetQuotes.mockClear()
    mockBackendApiGetUserQuotes.mockClear()
    mockErrorsStore.handleError.mockClear()
  })

  it('returns a user quote by id', () => {
    const quotesStore = useQuotesStore()
    quotesStore.userQuotes = fakeUserQuotes
    const expectedQuote = fakeUserQuotes[1]
    expect(quotesStore.userQuoteById(expectedQuote.id)).toEqual(expectedQuote)
    const nonExistentQuoteId = 3394
    expect(quotesStore.userQuoteById(nonExistentQuoteId)).toEqual(undefined)
  })

  it('gets quotes', async () => {
    mockBackendApiGetQuotes.mockReturnValue(fakeQuotes)
    const quotesStore = useQuotesStore()
    expect(quotesStore.quotes).toStrictEqual([])
    await quotesStore.getQuotes()
    expect(mockBackendApiGetQuotes).toHaveBeenCalled()
    expect(quotesStore.quotes).toStrictEqual(fakeQuotes)
  })

  it('gets user quotes', async () => {
    mockBackendApiGetUserQuotes.mockReturnValue(fakeUserQuotes)
    const quotesStore = useQuotesStore()
    expect(quotesStore.userQuotes).toStrictEqual([])
    await quotesStore.getUserQuotes()
    expect(mockBackendApiGetUserQuotes).toHaveBeenCalledWith(fakeUser.id)
    expect(quotesStore.userQuotes).toStrictEqual(fakeUserQuotes)
  })

  it('creates a user quote', async () => {
    mockBackendApiCreateQuote.mockReturnValue(fakeQuote)
    const quotesStore = useQuotesStore()
    quotesStore.userQuotes = [...fakeQuotes]
    await quotesStore.createUserQuote(fakeQuote.text)
    expect(quotesStore.userQuotes.length).toBe(fakeQuotes.length + 1)
    expect(quotesStore.userQuotes[quotesStore.userQuotes.length - 1]).toEqual(fakeQuote)
  })

  it('edits a user quote', async () => {
    const quotesStore = useQuotesStore()
    quotesStore.userQuotes = [...fakeQuotes]
    const quoteEdit = quotesStore.userQuotes[1]
    const originalQuoteText = quoteEdit.text
    quoteEdit.text = casual.text
    await quotesStore.editUserQuote(quoteEdit)
    expect(quotesStore.userQuotes.length).toBe(fakeQuotes.length)
    expect(quotesStore.userQuotes.find((quote) => quote.id === quoteEdit.id)?.text).toBe(
      quoteEdit.text
    )
    expect(quotesStore.userQuotes.find((quote) => quote.id === quoteEdit.id)?.text).not.toBe(
      originalQuoteText
    )
  })

  it('deletes a user quote', async () => {
    const quotesStore = useQuotesStore()
    quotesStore.userQuotes = [...fakeQuotes]
    const quoteDelete = quotesStore.userQuotes[1]
    await quotesStore.deleteUserQuote(quoteDelete.id)
    expect(quotesStore.userQuotes.length).toBe(fakeQuotes.length - 1)
    expect(quotesStore.userQuotes.find((quote) => quote.id === quoteDelete.id)).toBe(undefined)
  })
})
