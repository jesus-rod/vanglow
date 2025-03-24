'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/lib/auth/permissions';
import { DataGrid } from '@/core/components/datagrid';
import { UserForm } from './components/user-form';
import { User, UserStatus } from '@prisma/client';
import { getRequest, postRequest, putRequest, deleteRequest } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, Pencil, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

interface UserWithoutPassword extends Omit<User, 'password'> {
  userRoles?: {
    role: {
      id: string;
      name: string;
    };
  }[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithoutPassword[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithoutPassword | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithoutPassword | null>(null);

  // Permission hooks
  const canCreate = usePermission('user', 'create');
  const canEdit = usePermission('user', 'edit');
  const canDelete = usePermission('user', 'delete');

  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getRequest<UserWithoutPassword[]>('/administrations/users');
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteRequest(`/administrations/users/${userToDelete.id}`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (values: any) => {
    setFormLoading(true);
    try {
      const endpoint = selectedUser
        ? `/administrations/users/${selectedUser.id}`
        : '/administrations/users';

      if (selectedUser) {
        await putRequest(endpoint, values);
      } else {
        await postRequest(endpoint, values);
      }

      setDrawerVisible(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const columns: ColumnDef<UserWithoutPassword>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as UserStatus;
        return <Badge variant={status === 'ACTIVE' ? 'default' : 'destructive'}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user);
                    setDrawerVisible(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    setUserToDelete(user);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Users</CardTitle>
          {canCreate && (
            <Button
              onClick={() => {
                setSelectedUser(null);
                setDrawerVisible(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <DataGrid<UserWithoutPassword>
            columns={columns}
            data={users}
            loading={loading}
            onRowDoubleClick={
              canEdit
                ? (record) => {
                    setSelectedUser(record);
                    setDrawerVisible(true);
                  }
                : undefined
            }
          />
        </CardContent>
      </Card>

      <Sheet open={drawerVisible} onOpenChange={setDrawerVisible}>
        <SheetContent className="sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{selectedUser ? 'Edit User' : 'Create User'}</SheetTitle>
          </SheetHeader>
          <div className="mt-8">
            <UserForm
              initialValues={
                selectedUser
                  ? {
                      ...selectedUser,
                      userRoles: selectedUser.userRoles,
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
              loading={formLoading}
            />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={formLoading}
            >
              {formLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
