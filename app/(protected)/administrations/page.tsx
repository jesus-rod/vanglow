'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Building2, Shield, KeyRound, History } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { usePermission } from '@/lib/auth/permissions';

export default function AdministrationsPage() {
  const { data: session } = useSession();
  const canViewUsers = usePermission('user', 'view');
  const canViewOrganizations = usePermission('organization', 'view');
  const canViewRoles = usePermission('role', 'view');
  const canViewPermissions = usePermission('permission', 'view');
  const canViewSecurityLogs = usePermission('security-log', 'view');

  if (!session?.user) {
    redirect('/auth/login');
  }

  const isAdmin = session.user.userRoles?.some((ur) => ur.role.name === 'ADMIN');

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {canViewUsers && (
          <Link href="/administrations/users" className="block">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Users</CardTitle>
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback className="text-primary">
                    <Users className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage user accounts, roles, and permissions across the system.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        )}

        {canViewOrganizations && (
          <Link href="/administrations/organizations" className="block">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Organizations</CardTitle>
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback className="text-primary">
                    <Building2 className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create and manage organizations and their hierarchies.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        )}

        {canViewRoles && (
          <Link href="/administrations/roles" className="block">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Roles</CardTitle>
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback className="text-primary">
                    <KeyRound className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Define and manage roles and their associated permissions.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        )}

        {canViewPermissions && (
          <Link href="/administrations/permissions" className="block">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Permissions</CardTitle>
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback className="text-primary">
                    <Shield className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Configure detailed permissions for resources and actions.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        )}

        {canViewSecurityLogs && (
          <Link href="/administrations/security-logs" className="block">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Security Logs</CardTitle>
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback className="text-primary">
                    <History className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View and analyze security-related activities and events.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
