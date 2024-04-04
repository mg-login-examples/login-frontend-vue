import { describe, it, expect } from 'vitest'

import { EnvironmentVars } from '@/utils/envUtils'

describe('Utils > envUtils > index.ts', () => {
  it('checks development environment', () => {
    import.meta.env.DEV = false
    expect(EnvironmentVars.isDevelopmentEnvironment).toBe(false)
    import.meta.env.DEV = true
    expect(EnvironmentVars.isDevelopmentEnvironment).toBe(true)
  })
})
