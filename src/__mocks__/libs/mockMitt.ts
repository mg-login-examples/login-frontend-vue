import { vi } from 'vitest'

export const MockMitt = {
  on: vi.fn,
  off: vi.fn,
  emit: vi.fn,
  all: []
}
