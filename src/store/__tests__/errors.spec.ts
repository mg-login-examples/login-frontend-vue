vi.mock('@/utils/errorUtils/extractErrorMessage')
vi.mock('@/utils/errorUtils/logError')
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useErrorsStore } from '@/store/errors'
import extractErrorMessage from '@/utils/errorUtils/extractErrorMessage'
import logError from '@/utils/errorUtils/logError'

const mockedExtractErrorMessage = extractErrorMessage as Mock
const mockedLogError = logError as Mock

describe('store > errors.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('sets snackbar state to true', () => {
    const errorStore = useErrorsStore()
    expect(errorStore.isOpenSnackbar).toBe(false)
    errorStore.openSnackbar()
    expect(errorStore.isOpenSnackbar).toBe(true)
  })

  it('sets snackbar state to false', () => {
    const errorStore = useErrorsStore()
    errorStore.isOpenSnackbar = true
    errorStore.closeSnackbar()
    expect(errorStore.isOpenSnackbar).toBe(false)
  })

  it('handles an error', () => {
    const errorStore = useErrorsStore()
    mockedExtractErrorMessage.mockImplementation((val: Error) => val.message)
    const errorMessage = 'some error'
    const error = Error(errorMessage)
    errorStore.handleError(error)
    expect(errorStore.errorMessage).toBe(errorMessage)
    expect(errorStore.isOpenSnackbar).toBe(true)
    expect(errorStore.errorHistory).toContain(error)
    expect(mockedLogError).toHaveBeenCalled()
  })
})
