'use client'

import { UseFormReturn } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UserFormData } from '../actions/schemas'

interface FormComponentProps {
  form: UseFormReturn<UserFormData>
}

export function UserForm({ form }: FormComponentProps) {
  return (
    <Form {...form}>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                Enter full name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="john@example.com" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Enter email address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="04xxxxxxxx" 
                  {...field}
                  maxLength={10}
                  pattern="^04\d{8}$"
                />
              </FormControl>
              <FormDescription>
                Enter Australian mobile number (e.g., 0412345678)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}

