'use server'

import { revalidatePath } from 'next/cache'
import { User, userSchema } from './schemas'
import prisma from '@/lib/prisma'

export async function searchUsers(query: string): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        name: { contains: query },
      },
    });
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
  console.log('Attempting to add user:', data);
  try {
    const validatedUser = userSchema.parse(data);
    console.log('Validated user data:', validatedUser);

    const newUser = await prisma.user.create({
      data: validatedUser,
    });

    console.log('User added successfully:', newUser);
    revalidatePath('/');
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

