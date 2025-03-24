'use client';

import { useEffect, useState } from 'react';
import { usePermission } from '@/lib/auth/permissions';
import { DataGrid } from '@/core/components/datagrid';
import { Permission, Resource, Action } from '@prisma/client';
import { PermissionForm } from './components/permission-form';
import { ResourceForm } from './components/resource-form';
import { ActionForm } from './components/action-form';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, Plus, Pencil, Trash, Shield, Database, Zap } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

interface PermissionWithRelations extends Permission {
  resource: Resource;
  actions: {
    action: Action;
  }[];
  user?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  role?: {
    id: string;
    name: string;
    organizationId: string | null;
  } | null;
  organization?: {
    id: string;
    name: string;
  } | null;
}

interface ResourceWithCount extends Resource {
  _count?: {
    permissions: number;
  };
}

interface ActionWithCount extends Action {
  _count?: {
    permissions: number;
  };
}

export default function PermissionsPage() {
  const [activeTab, setActiveTab] = useState('permissions');
  const [permissions, setPermissions] = useState<PermissionWithRelations[]>([]);
  const [resources, setResources] = useState<ResourceWithCount[]>([]);
  const [actions, setActions] = useState<ActionWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Permission hooks
  const canCreate = usePermission('permission', 'create');
  const canEdit = usePermission('permission', 'edit');
  const canDelete = usePermission('permission', 'delete');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'permissions':
          const perms = await getRequest<PermissionWithRelations[]>('/administrations/permissions');
          setPermissions(perms);
          break;
        case 'resources':
          const resources = await getRequest<ResourceWithCount[]>('/administrations/resources');
          setResources(resources);
          break;
        case 'actions':
          const actions = await getRequest<ActionWithCount[]>('/administrations/actions');
          setActions(actions);
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setFormLoading(true);
    try {
      await deleteRequest(`/administrations/${activeTab}/${itemToDelete.id}`);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setFormLoading(true);
    try {
      if (selectedItem) {
        await putRequest(`/administrations/${activeTab}/${selectedItem.id}`, values);
      } else {
        await postRequest(`/administrations/${activeTab}`, values);
      }
      setDrawerVisible(false);
      setSelectedItem(null);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const resourceColumns: ColumnDef<ResourceWithCount>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: '_count.permissions',
      header: 'Permissions',
      cell: ({ row }) => <Badge variant="outline">{row.original._count?.permissions || 0}</Badge>,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
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
                  setSelectedItem(row.original);
                  setDrawerVisible(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {canDelete && row.original._count?.permissions === 0 && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setItemToDelete(row.original);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const actionColumns: ColumnDef<ActionWithCount>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: '_count.permissions',
      header: 'Permissions',
      cell: ({ row }) => <Badge variant="outline">{row.original._count?.permissions || 0}</Badge>,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
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
                  setSelectedItem(row.original);
                  setDrawerVisible(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {canDelete && row.original._count?.permissions === 0 && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setItemToDelete(row.original);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const permissionColumns: ColumnDef<PermissionWithRelations>[] = [
    {
      accessorKey: 'resource.name',
      header: 'Resource',
    },
    {
      accessorKey: 'target',
      header: 'Target',
      cell: ({ row }) => {
        const target = row.original.target;
        const targetData = row.original[target.toLowerCase() as keyof PermissionWithRelations] as
          | { firstName: string | null; lastName: string | null }
          | { name: string }
          | null;
        return targetData
          ? 'firstName' in targetData
            ? `${targetData.firstName} ${targetData.lastName}`
            : targetData.name
          : '-';
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.actions.map((action) => (
            <Badge key={action.action.id} variant="outline">
              {action.action.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
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
                  setSelectedItem(row.original);
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
                  setItemToDelete(row.original);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Permissions Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="permissions" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center">
                <Database className="mr-2 h-4 w-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                Actions
              </TabsTrigger>
            </TabsList>

            <div className="flex justify-end">
              {canCreate && (
                <Button
                  onClick={() => {
                    setSelectedItem(null);
                    setDrawerVisible(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create {activeTab.slice(0, -1)}
                </Button>
              )}
            </div>

            <TabsContent value="permissions" className="m-0">
              <DataGrid columns={permissionColumns} data={permissions} loading={loading} />
            </TabsContent>

            <TabsContent value="resources" className="m-0">
              <DataGrid columns={resourceColumns} data={resources} loading={loading} />
            </TabsContent>

            <TabsContent value="actions" className="m-0">
              <DataGrid columns={actionColumns} data={actions} loading={loading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Sheet open={drawerVisible} onOpenChange={setDrawerVisible}>
        <SheetContent className="sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {selectedItem ? `Edit ${activeTab.slice(0, -1)}` : `Create ${activeTab.slice(0, -1)}`}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-8">
            {activeTab === 'permissions' && (
              <PermissionForm
                initialValues={selectedItem}
                onSubmit={handleSubmit}
                loading={formLoading}
              />
            )}
            {activeTab === 'resources' && (
              <ResourceForm
                initialValues={selectedItem}
                onSubmit={handleSubmit}
                loading={formLoading}
              />
            )}
            {activeTab === 'actions' && (
              <ActionForm
                initialValues={selectedItem}
                onSubmit={handleSubmit}
                loading={formLoading}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this{' '}
              {activeTab.slice(0, -1)}.
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
