// vi.mock("@/api/modules/base");
import { describe, it, expect, vi } from 'vitest'

import http from '@/api/modules/base'
import emailVerificationsApi from '@/api/modules/email-verifications-api'
import { mockAxiosVerifyEmail, mockAxiosResendEmail } from './api-mock-implementations'

describe('api > modules > emailVerifications.ts', () => {
  it('verifies email verification code', async () => {
    http.post = vi.fn().mockImplementation(mockAxiosVerifyEmail)
    const verificationCode = 323132
    await expect(emailVerificationsApi.verifyEmail(verificationCode)).resolves.toEqual(undefined)
    expect(http.post).toHaveBeenCalledWith(
      `/api/email-verifications/verify-email/${verificationCode}/`
    )
  })

  it('resends email with verification code', async () => {
    http.post = vi.fn().mockImplementation(mockAxiosResendEmail)
    await expect(emailVerificationsApi.resendEmail()).resolves.toEqual(undefined)
    expect(http.post).toHaveBeenCalledWith(`/api/email-verifications/resend-email/`)
  })
})
