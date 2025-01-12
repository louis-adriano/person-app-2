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
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<T>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues)
      setError(null)
    }
  }, [open, form, defaultValues])

  async function handleSubmit(data: T) {
    if (!action) {
      throw new Error("No action function provided")
    }

    try {
      setIsSubmitting(true)
      setError(null)
      const result = await action(data)
      
      if (result.success) {
        setOpen(false)
        form.reset()
      } else {
        setError(result.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : submitButtonLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

