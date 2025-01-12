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
  console.log('Adding user:', data); // Add this line for debugging
  const validatedUser = userSchema.parse(data);
  try {
    const newUser = await prisma.user.create({
      data: validatedUser,
    });
    console.log('User added successfully:', newUser); // Add this line for debugging
    revalidatePath('/');
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error); // Add this line for debugging
    throw error; // Re-throw the error to be caught by the caller
  }
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

