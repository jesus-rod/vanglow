'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/lib/auth/permissions';
import { DataGrid } from '@/core/components/datagrid';
import { Role, Organization } from '@prisma/client';
import { RoleForm } from './components/role-form';
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
import { MoreHorizontal, Plus, Pencil, Trash, Building2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

interface RoleWithRelations extends Role {
  organization?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count?: {
    userRoles: number;
  };
}

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleWithRelations | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleWithRelations | null>(null);

  // Permission hooks
  const canCreate = usePermission('role', 'create');
  const canEdit = usePermission('role', 'edit');
  const canDelete = usePermission('role', 'delete');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await getRequest<RoleWithRelations[]>('/administrations/roles');
      setRoles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;
    setFormLoading(true);
    try {
      await deleteRequest(`/administrations/roles/${roleToDelete.id}`);
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
      fetchRoles();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setFormLoading(true);
    try {
      const endpoint = selectedRole
        ? `/administrations/roles/${selectedRole.id}`
        : '/administrations/roles';

      if (selectedRole) {
        await putRequest(endpoint, values);
      } else {
        await postRequest(endpoint, values);
      }

      setDrawerVisible(false);
      setSelectedRole(null);
      fetchRoles();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const columns: ColumnDef<RoleWithRelations>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'organization',
      header: 'Organization',
      cell: ({ row }) => {
        const org = row.original.organization;
        return org ? (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span>{org.name}</span>
          </div>
        ) : (
          <Badge variant="secondary">Global</Badge>
        );
      },
    },
    {
      accessorKey: 'isDefault',
      header: 'Default',
      cell: ({ row }) => {
        return row.original.isDefault ? <Badge>Default</Badge> : null;
      },
    },
    {
      accessorKey: '_count.userRoles',
      header: 'Users',
      cell: ({ row }) => {
        return <Badge variant="outline">{row.original._count?.userRoles || 0}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const role = row.original;

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
                    setSelectedRole(role);
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
                    setRoleToDelete(role);
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
          <CardTitle>Roles</CardTitle>
          {canCreate && (
            <Button
              onClick={() => {
                setSelectedRole(null);
                setDrawerVisible(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <DataGrid<RoleWithRelations>
            columns={columns}
            data={roles}
            loading={loading}
            onRowDoubleClick={
              canEdit
                ? (record) => {
                    setSelectedRole(record);
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
            <SheetTitle>{selectedRole ? 'Edit Role' : 'Create Role'}</SheetTitle>
          </SheetHeader>
          <div className="mt-8">
            <RoleForm initialValues={selectedRole} onSubmit={handleSubmit} loading={formLoading} />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role and remove it from
              all users.
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
