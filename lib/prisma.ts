import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test database connection
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch((e) => {
    console.error('Failed to connect to database:', e)
  })

export default prisma

