'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from 'zod'

export interface ActionState<T> {
  success: boolean
  message: string | null
  data?: T
}

interface GenericDialogProps<T extends FieldValues> {
  formSchema: ZodType<T>
  FormComponent: React.ComponentType<{ form: UseFormReturn<T> }>
  action?: (data: T) => Promise<ActionState<T>>
  triggerButtonLabel?: string
  addDialogTitle?: string
  editDialogTitle?: string
  dialogDescription?: string
  submitButtonLabel?: string
  defaultValues?: DefaultValues<T>
}

export default function MutableDialog<T extends FieldValues>({
  formSchema,
  FormComponent,
  action,
  defaultValues,
  triggerButtonLabel = defaultValues ? 'Edit' : 'Add',
  addDialogTitle = 'Add',
  editDialogTitle = 'Edit',
  dialogDescription = defaultValues ? 'Make changes to your item here. Click save when you\'re done.' : 'Fill out the form below to add a new item.',
  submitButtonLabel = defaultValues ? 'Save' : 'Add',
}: GenericDialogProps<T>) {
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const form = useForm<T>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues)
      setFeedback(null)
    }
  }, [open, form, defaultValues])

  async function handleSubmit(data: T) {
    if (!action) {
      throw new Error("No action function provided")
    }

    try {
      const result = await action(data)
      if (result.success) {
        setFeedback({ message: result.message || "Operation completed successfully", type: 'success' })
        setOpen(false)
        form.reset() // Reset the form after successful submission
      } else {
        setFeedback({ message: result.message || "Operation failed", type: 'error' })
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setFeedback({ message: "An unexpected error occurred. Please check the console for more details.", type: 'error' })
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">{triggerButtonLabel}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{defaultValues ? editDialogTitle : addDialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormComponent form={form} />
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {submitButtonLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {feedback && (
        <div className={`mt-4 p-4 rounded ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback.message}
        </div>
      )}
    </>
  )
}

