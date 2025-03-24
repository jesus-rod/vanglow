'use client';

import { useEffect, useState } from 'react';
import { Organization, OrgStatus } from '@prisma/client';
import { getRequest } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface OrganizationFormProps {
  initialValues?: Organization;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  parentId: z.string().nullable(),
});

type FormData = z.infer<typeof formSchema>;

export function OrganizationForm({ initialValues, onSubmit, loading }: OrganizationFormProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || '',
      slug: initialValues?.slug || '',
      status: initialValues?.status || 'ACTIVE',
      parentId: initialValues?.parentId || null,
    },
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const data = await getRequest<Organization[]>('/administrations/organizations');
      // Filter out the current organization and its children to prevent circular references
      const availableOrgs = data.filter((org) => org.id !== initialValues?.id);
      setOrganizations(availableOrgs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleSubmit = (values: FormData) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter organization name" {...field} />
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
                <Input placeholder="Enter organization slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Organization</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent organization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Organization'}
        </Button>
      </form>
    </Form>
  );
}
