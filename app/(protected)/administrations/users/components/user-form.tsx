'use client';

import { useEffect, useState } from 'react';
import { User, UserStatus } from '@prisma/client';
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
import { PasswordInput } from '@/components/ui/password-input';
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

interface Role {
  id: string;
  name: string;
}

type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified' | 'avatar'> & {
  roleIds?: string[];
};

interface UserFormProps {
  initialValues?: UserFormData;
  onSubmit: (values: UserFormData) => Promise<void>;
  loading?: boolean;
}

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required').optional().or(z.literal('')),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  roleIds: z.array(z.string()).default([]),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
});

type FormValues = z.infer<typeof formSchema>;

export function UserForm({ initialValues, onSubmit, loading }: UserFormProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialValues?.email || '',
      password: '',
      firstName: initialValues?.firstName || '',
      lastName: initialValues?.lastName || '',
      phone: initialValues?.phone || '',
      roleIds: initialValues?.roleIds || [],
      status: initialValues?.status || UserStatus.ACTIVE,
    },
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRequest<Role[]>('/administrations/roles');
        setRoles(data);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = (values: FormValues) => {
    const userData: UserFormData = {
      email: values.email,
      password: values.password || '',
      firstName: values.firstName || null,
      lastName: values.lastName || null,
      phone: values.phone || null,
      status: values.status,
    };

    if (values.roleIds.length > 0) {
      userData.roleIds = values.roleIds;
    }

    return onSubmit(userData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{initialValues ? 'New Password' : 'Password'}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={initialValues ? 'Leave blank to keep current' : 'Enter password'}
                  {...field}
                />
              </FormControl>
              {initialValues && (
                <p className="text-sm text-muted-foreground">
                  Leave blank to keep current password
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roleIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roles</FormLabel>
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
                        ? roles
                            .filter((role) => field.value.includes(role.id))
                            .map((role) => role.name)
                            .join(', ')
                        : 'Select roles'}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search roles..." />
                    <CommandEmpty>No roles found.</CommandEmpty>
                    <CommandGroup>
                      {roles.map((role) => (
                        <CommandItem
                          key={role.id}
                          onSelect={() => {
                            const newValue = field.value.includes(role.id)
                              ? field.value.filter((id) => id !== role.id)
                              : [...field.value, role.id];
                            field.onChange(newValue);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value.includes(role.id) ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {role.name}
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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Saving...' : initialValues ? 'Update User' : 'Create User'}
        </Button>
      </form>
    </Form>
  );
}
