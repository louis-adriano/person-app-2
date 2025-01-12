'use client'

import { useState } from 'react'
import { addUser } from '@/app/actions/actions'
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas'
import { UserForm } from './user-form'
import MutableDialog, { ActionState } from '@/components/mutable-dialog'

export function UserDialog() {
  const [error, setError] = useState<string | null>(null);

  const handleAddUser = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      const newUser = await addUser(data)
      return {
        success: true,
        message: `User ${newUser.name} added successfully`,
        data: newUser
      }
    } catch (error) {
      console.error('Error in handleAddUser:', error)
      let errorMessage = 'Failed to add user. Please check the console for more details.';
      if (error instanceof Error) {
        errorMessage += ` Error: ${error.message}`;
      }
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  return (
    <>
      <MutableDialog<UserFormData>
        formSchema={userFormSchema}
        FormComponent={UserForm}
        action={handleAddUser}
        triggerButtonLabel="Add User"
        addDialogTitle="Add New User"
        dialogDescription="Fill out the form below to add a new user."
        submitButtonLabel="Add User"
      />
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
    </>
  )
}

