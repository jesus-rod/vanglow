'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/lib/auth/permissions';
import { DataGrid } from '@/core/components/datagrid';
import { Organization, OrgStatus } from '@prisma/client';
import { OrganizationForm } from './components/organization-form';
import { AddUsersDrawer } from './components/add-users-drawer';
import { getRequest, deleteRequest, postRequest, putRequest } from '@/lib/apiClient';
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
import { MoreHorizontal, Plus, Pencil, Trash, Users } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

interface OrganizationWithCount extends Organization {
  _count?: {
    users: number;
  };
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [addUsersDrawerOpen, setAddUsersDrawerOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationWithCount | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<OrganizationWithCount | null>(null);

  // Permission hooks
  const canCreate = usePermission('organization', 'create');
  const canEdit = usePermission('organization', 'edit');
  const canDelete = usePermission('organization', 'delete');
  const canAddUsers = usePermission('organization', 'update');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const data = await getRequest<OrganizationWithCount[]>('/administrations/organizations');
      const rootOrgs = data.filter((org) => !org.parentId);
      setOrganizations(rootOrgs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!orgToDelete) return;
    setFormLoading(true);
    try {
      await deleteRequest(`/administrations/organizations/${orgToDelete.id}`);
      setDeleteDialogOpen(false);
      setOrgToDelete(null);
      fetchOrganizations();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setFormLoading(true);
    try {
      if (selectedOrg) {
        await putRequest(`/administrations/organizations/${selectedOrg.id}`, values);
      } else {
        await postRequest('/administrations/organizations', values);
      }

      setDrawerVisible(false);
      setSelectedOrg(null);
      fetchOrganizations();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const columns: ColumnDef<OrganizationWithCount>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status === 'ACTIVE' ? 'default' : 'secondary'}>{status}</Badge>;
      },
    },
    {
      accessorKey: '_count.users',
      header: 'Users',
      cell: ({ row }) => {
        return <Badge variant="outline">{row.original._count?.users || 0}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const org = row.original;

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
                    setSelectedOrg(org);
                    setDrawerVisible(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {canAddUsers && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedOrg(org);
                    setAddUsersDrawerOpen(true);
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Add Users
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    setOrgToDelete(org);
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
          <CardTitle>Organizations</CardTitle>
          {canCreate && (
            <Button
              onClick={() => {
                setSelectedOrg(null);
                setDrawerVisible(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <DataGrid<OrganizationWithCount>
            columns={columns}
            data={organizations}
            loading={loading}
            onRowDoubleClick={
              canEdit
                ? (record) => {
                    setSelectedOrg(record);
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
            <SheetTitle>{selectedOrg ? 'Edit Organization' : 'Create Organization'}</SheetTitle>
          </SheetHeader>
          <div className="mt-8">
            <OrganizationForm
              initialValues={selectedOrg}
              onSubmit={handleSubmit}
              loading={formLoading}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={addUsersDrawerOpen} onOpenChange={setAddUsersDrawerOpen}>
        <SheetContent className="sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Add Users to Organization</SheetTitle>
          </SheetHeader>
          <div className="mt-8">
            <AddUsersDrawer
              organization={selectedOrg}
              open={addUsersDrawerOpen}
              onClose={() => {
                setAddUsersDrawerOpen(false);
                setSelectedOrg(null);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the organization and remove
              all associated data.
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
