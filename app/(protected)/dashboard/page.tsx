'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePermission } from '@/lib/auth/permissions';
import Link from 'next/link';
import { getRequest } from '@/lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Users, UserCheck } from 'lucide-react';

interface DashboardStats {
  totalOrganizations: number;
  totalUsers: number;
  activeUsers: number;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrganizations: 0,
    totalUsers: 0,
    activeUsers: 0,
  });

  // Permission hooks
  const canViewStats = usePermission('dashboard', 'view');

  const fetchDashboardData = async () => {
    if (canViewStats) {
      try {
        const data = await getRequest<DashboardStats>('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [canViewStats]);

  return (
    <div className="flex items-center justify-center p-4 h-full">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Welcome to Vanglow</CardTitle>
          <p className="text-lg text-muted-foreground">
            A modern and scalable system for your business
          </p>
        </CardHeader>
        <CardContent>
          {session ? (
            <div className="space-y-8">
              <div className="flex justify-center">
                <Link href="/administrations">
                  <Button size="lg">
                    Go to Administrations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {canViewStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeUsers}</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <Link href="/auth/signin">
                <Button size="lg">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
