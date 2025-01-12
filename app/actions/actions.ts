'use server'

import { revalidatePath } from 'next/cache'
import { User, userSchema } from './schemas'
import prisma from '@/lib/prisma'

export async function searchUsers(query: string): Promise<User[]> {
  console.log('Searching users with query:', query)
  return prisma.user.findMany({
    where: {
      name: {
        startsWith: query,
        mode: 'insensitive',
      },
    },
  })
}

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
  const validatedUser = userSchema.parse(data)
  const newUser = await prisma.user.create({
    data: validatedUser,
  })
  return newUser
}

export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({
    where: { id },
  })
  console.log(`User with id ${id} has been deleted.`)
  revalidatePath('/')
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
  const existingUser = await prisma.user.findUnique({ where: { id } })
  if (!existingUser) {
    throw new Error(`User with id ${id} not found`)
  }

  const updatedUser = { ...existingUser, ...data }
  const validatedUser = userSchema.parse(updatedUser)

  const result = await prisma.user.update({
    where: { id },
    data: validatedUser,
  })

  console.log(`User with id ${id} has been updated.`)
  revalidatePath('/')

  return result
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } })
}

