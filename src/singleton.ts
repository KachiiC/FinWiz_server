import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import Prisma from './models/index'
import { jest, beforeEach } from '@jest/globals'

jest.mock('./models/index', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = Prisma as unknown as DeepMockProxy<PrismaClient>
