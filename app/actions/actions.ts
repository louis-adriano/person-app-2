'use server'

import { revalidatePath } from 'next/cache'
import { User, userSchema } from './schemas'
import prisma from '@/lib/prisma'

// ... other functions remain unchanged

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

// ... other functions remain unchanged

