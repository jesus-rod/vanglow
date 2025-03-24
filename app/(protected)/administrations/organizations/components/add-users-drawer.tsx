'use client';

import { useState, useEffect } from 'react';
import { Organization, User } from '@prisma/client';
import { getRequest, postRequest } from '@/lib/apiClient';
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

interface AddUsersDrawerProps {
  organization: Organization | null;
  open: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  userIds: z.array(z.string()).min(1, 'Please select at least one user'),
});

type FormData = z.infer<typeof formSchema>;

export function AddUsersDrawer({ organization, open, onClose }: AddUsersDrawerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const data = await getRequest<User[]>('/administrations/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (values: FormData) => {
    if (!organization) return;
    setLoading(true);
    try {
      await postRequest(`/administrations/organizations/${organization.id}/users`, {
        userIds: values.userIds,
      });
      onClose();
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Users</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {field.value.length > 0
                        ? `${field.value.length} users selected`
                        : 'Select users'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search users..." />
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => {
                              const newValue = field.value.includes(user.id)
                                ? field.value.filter((id) => id !== user.id)
                                : [...field.value, user.id];
                              field.onChange(newValue);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                field.value.includes(user.id) ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {user.firstName} {user.lastName} ({user.email})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Adding Users...' : 'Add Users'}
        </Button>
      </form>
    </Form>
  );
}
