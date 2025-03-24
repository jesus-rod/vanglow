'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useNotification } from '@/contexts/NotificationContext';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email.toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        showNotification({
          type: 'error',
          message: 'Login Failed',
          description: 'Invalid email or password',
        });
        return;
      }

      showNotification({
        type: 'default',
        message: 'Success',
        description: 'Login successful',
      });
      router.push('/');
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred during login',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} type="email" />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your password" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center">
          <Link href="/auth/register" className="text-sm text-primary hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
