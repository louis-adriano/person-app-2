'use client'

import { useState } from 'react'
import { addUser } from '@/app/actions/actions'
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas'
import { UserForm } from './user-form'
import MutableDialog, { ActionState } from '@/components/mutable-dialog'
import { Alert, AlertDescription } from "@/components/ui/alert"

export function UserDialog() {
  const [error, setError] = useState<string | null>(null)

  const handleAddUser = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      setError(null)
      const newUser = await addUser(data)
      return {
        success: true,
        message: `User ${newUser.name} added successfully`,
        data: newUser
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      console.error('Error in handleAddUser:', errorMessage)
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  return (
    <div className="space-y-4">
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
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

