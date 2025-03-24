'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getRequest } from '@/lib/apiClient';
import { usePermission } from '@/lib/auth/permissions';
import { format } from 'date-fns';

interface SecurityLog {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  status: string;
  type: string;
  message: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

interface SecurityLogsResponse {
  data: SecurityLog[];
  total: number;
}

export default function SecurityLogsPage() {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const canViewLogs = usePermission('security_log', 'view');

  useEffect(() => {
    if (canViewLogs) {
      fetchLogs();
    }
  }, [canViewLogs, currentPage, pageSize]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRequest<SecurityLogsResponse>(
        `/administrations/security-logs?page=${currentPage}&pageSize=${pageSize}`
      );
      console.log('Security logs response:', response);
      if (response && Array.isArray(response)) {
        setLogs(response);
        setTotal(response.length);
      } else if (response && 'data' in response) {
        setLogs(response.data);
        setTotal(response.total);
      } else {
        setError('Invalid response format from server');
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Failed to fetch security logs:', error);
      setError('Failed to fetch security logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (!canViewLogs) {
    return null;
  }

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8">
            Loading...
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-destructive">
            {error}
          </TableCell>
        </TableRow>
      );
    }

    if (!logs || logs.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8">
            No security logs found
          </TableCell>
        </TableRow>
      );
    }

    return logs.map((log) => (
      <TableRow key={log.id}>
        <TableCell className="font-medium">{format(new Date(log.createdAt), 'PPpp')}</TableCell>
        <TableCell>
          {log.user ? `${log.user.firstName} ${log.user.lastName}` : log.email || 'Unknown'}
        </TableCell>
        <TableCell>
          <Badge variant="outline">{log.type}</Badge>
        </TableCell>
        <TableCell>
          <Badge variant={getStatusBadgeVariant(log.status)}>{log.status}</Badge>
        </TableCell>
        <TableCell>{log.ipAddress}</TableCell>
        <TableCell className="max-w-md truncate">{log.message}</TableCell>
      </TableRow>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableContent()}</TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
