'use client';

import { useEffect } from 'react';
import { Resource } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface ResourceFormProps {
  initialValues?: Resource | null;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
}

const formSchema = z.object({
  name: z.string().min(3, 'Resource name must be at least 3 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ResourceForm({ initialValues, onSubmit, loading }: ResourceFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || '',
      slug: initialValues?.slug || '',
      description: initialValues?.description || '',
    },
  });

  const handleSubmit = async (values: FormData) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter resource name (e.g., User, Role)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="Enter slug (e.g., user, role)" {...field} />
              </FormControl>
              <FormDescription>
                Used as a unique identifier for the resource. Only lowercase letters, numbers, and
                hyphens are allowed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter resource description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => form.reset()} disabled={loading}>
            Reset
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : initialValues ? 'Update' : 'Create'} Resource
          </Button>
        </div>
      </form>
    </Form>
  );
}
