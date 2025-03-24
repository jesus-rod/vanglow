'use client';

import { useEffect, useState } from 'react';
import { Permission, Resource, Action, PermissionTarget } from '@prisma/client';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

interface Role {
  id: string;
  name: string;
  organizationId: string | null;
}

interface Organization {
  id: string;
  name: string;
}

interface PermissionWithActions extends Permission {
  actions?: {
    action: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

interface PermissionFormProps {
  initialValues?: PermissionWithActions | null;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
}

const formSchema = z.object({
  resourceId: z.string().min(1, 'Resource is required'),
  target: z.enum(['USER', 'ROLE', 'ORGANIZATION']),
  userId: z.string().optional(),
  roleId: z.string().optional(),
  organizationId: z.string().optional(),
  actionIds: z.array(z.string()).min(1, 'At least one action is required'),
});

type FormData = z.infer<typeof formSchema>;

export function PermissionForm({ initialValues, onSubmit, loading }: PermissionFormProps) {
  const [targetType, setTargetType] = useState<PermissionTarget | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState<{
    resources: Resource[];
    actions: Action[];
    users: User[];
    roles: Role[];
    organizations: Organization[];
  }>({
    resources: [],
    actions: [],
    users: [],
    roles: [],
    organizations: [],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resourceId: initialValues?.resourceId || '',
      target: initialValues?.target || 'USER',
      userId: initialValues?.userId || undefined,
      roleId: initialValues?.roleId || undefined,
      organizationId: initialValues?.organizationId || undefined,
      actionIds: initialValues?.actions?.map((pa) => pa.action.id) || [],
    },
  });

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    setLoadingData(true);
    try {
      const [resources, actions, users, roles, organizations] = await Promise.all([
        getRequest<Resource[]>('/administrations/resources'),
        getRequest<Action[]>('/administrations/actions'),
        getRequest<User[]>('/administrations/users'),
        getRequest<Role[]>('/administrations/roles'),
        getRequest<Organization[]>('/administrations/organizations'),
      ]);

      setFormData({
        resources,
        actions,
        users,
        roles,
        organizations,
      });
    } catch (error) {
      console.error('Error fetching form data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (values: FormData) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="resourceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resource" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {formData.resources.map((resource) => (
                    <SelectItem key={resource.id} value={resource.id}>
                      {resource.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setTargetType(value as PermissionTarget);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ROLE">Role</SelectItem>
                  <SelectItem value="ORGANIZATION">Organization</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {targetType === 'USER' && (
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formData.users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {targetType === 'ROLE' && (
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formData.roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                        {role.organizationId ? ' (Organization Role)' : ' (Global Role)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {targetType === 'ORGANIZATION' && (
          <FormField
            control={form.control}
            name="organizationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {formData.organizations.map((org) => (
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
        )}

        <FormField
          control={form.control}
          name="actionIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actions</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value.length && 'text-muted-foreground'
                      )}
                    >
                      {field.value.length > 0
                        ? formData.actions
                            .filter((action) => field.value.includes(action.id))
                            .map((action) => action.name)
                            .join(', ')
                        : 'Select actions'}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search actions..." />
                    <CommandEmpty>No actions found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                      {formData.actions.map((action) => (
                        <CommandItem
                          key={action.id}
                          onSelect={() => {
                            const newValue = field.value.includes(action.id)
                              ? field.value.filter((id) => id !== action.id)
                              : [...field.value, action.id];
                            field.onChange(newValue);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value.includes(action.id) ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {action.name} ({action.slug})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => form.reset()} disabled={loading}>
            Reset
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : initialValues ? 'Update' : 'Create'} Permission
          </Button>
        </div>
      </form>
    </Form>
  );
}
