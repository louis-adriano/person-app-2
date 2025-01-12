'use client'

import { useState } from 'react'
import { addUser } from '@/app/actions/actions'
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas'
import { UserForm } from './user-form'
import MutableDialog, { ActionState } from '@/components/mutable-dialog'

export function UserDialog() {
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleAddUser = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      const newUser = await addUser(data)
      setFeedback({ message: `User ${newUser.name} added successfully`, type: 'success' })
      return {
        success: true,
        message: `User ${newUser.name} added successfully`,
        data: newUser
      }
    } catch (error) {
      console.error('Error in handleAddUser:', error)
      setFeedback({ message: 'Failed to add user. Please check the console for more details.', type: 'error' })
      return {
        success: false,
        message: 'Failed to add user'
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
      {feedback && (
        <div className={`mt-4 p-4 rounded ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback.message}
        </div>
      )}
    </>
  )
}

