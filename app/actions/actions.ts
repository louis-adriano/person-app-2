'use server'

import { revalidatePath } from 'next/cache'
import { User, userSchema } from './schemas'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
  try {
    // First validate the input data
    const validationResult = userSchema.safeParse(data)
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error)
      throw new Error(`Validation failed: ${validationResult.error.message}`)
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (existingUser) {
      throw new Error('A user with this email already exists')
    }

    // Create the user
    const newUser = await prisma.user.create({
      data: validationResult.data,
    })

    console.log('User created successfully:', newUser)
    revalidatePath('/')
    return newUser
  } catch (error) {
    console.error('Error in addUser:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('A user with this email already exists')
      }
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to add user')
  }
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      throw new Error(`User with id ${id} not found`)
    }

    const updatedData = { ...existingUser, ...data }
    const validationResult = userSchema.safeParse(updatedData)
    
    if (!validationResult.success) {
      throw new Error(`Validation failed: ${validationResult.error.message}`)
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: validationResult.data,
    })

    revalidatePath('/')
    return updatedUser
  } catch (error) {
    console.error('Error in updateUser:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to update user')
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id },
    })
    revalidatePath('/')
  } catch (error) {
    console.error('Error in deleteUser:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to delete user')
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error('Error in getUserById:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch user')
  }
}

export async function searchUsers(query: string): Promise<User[]> {
  try {
    return await prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    })
  } catch (error) {
    console.error('Error in searchUsers:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to search users')
  }
}

