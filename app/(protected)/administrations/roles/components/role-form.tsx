'use client';

import { useEffect, useState } from 'react';
import { Role, Organization } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { getRequest } from '@/lib/apiClient';
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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

interface RoleFormProps {
  initialValues?: Role | null;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
}

const formSchema = z.object({
  name: z.string().min(3, 'Role name must be at least 3 characters'),
  description: z.string().max(500, 'Description cannot be longer than 500 characters').optional(),
  organizationId: z.string().optional().nullable(),
  isDefault: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function RoleForm({ initialValues, onSubmit, loading }: RoleFormProps) {
  const { data: session } = useSession();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      organizationId: initialValues?.organizationId || null,
      isDefault: initialValues?.isDefault || false,
    },
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const data = await getRequest<Organization[]>('/administrations/organizations');
      setOrganizations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter role name" {...field} />
              </FormControl>
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
                <Textarea placeholder="Enter role description" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || undefined}
                disabled={loadingOrgs}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Leave empty to create a global role</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Default Role</FormLabel>
                <FormDescription>
                  Default roles are automatically assigned to new members
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Separator />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : initialValues ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
