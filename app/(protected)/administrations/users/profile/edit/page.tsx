'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
import { User, Mail, Phone, Camera, Save, Lock } from 'lucide-react';
import { putRequest } from '@/lib/apiClient';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  email: z.string().email(),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ProfileEditPage() {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
      email: session?.user?.email || '',
      phone: session?.user?.phone || '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleProfileSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      const updatedUser = await putRequest('/administrations/profile', {
        ...values,
        avatar: avatarUrl,
      });

      await updateSession({
        ...session,
        user: {
          ...session?.user,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          avatar: updatedUser.avatar,
          phone: updatedUser.phone,
        },
      });

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: PasswordFormValues) => {
    setLoading(true);
    try {
      await putRequest('/administrations/profile/password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="max-w-[1000px] mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Side - Avatar and Basic Info */}
            <div className="md:col-span-4 flex flex-col items-center justify-start space-y-4">
              <div className="relative group">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={avatarUrl || session.user.avatar || ''} />
                  <AvatarFallback>
                    {session.user.firstName?.[0]}
                    {session.user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-background shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-lg">
                  {session.user.firstName} {session.user.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
            </div>

            {/* Right Side - Tabs */}
            <div className="md:col-span-8">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profile Settings</TabsTrigger>
                  <TabsTrigger value="password">Change Password</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" placeholder="First Name" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-9" placeholder="Last Name" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-9" {...field} disabled />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-9" placeholder="Phone Number" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="password">
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-9"
                                  type="password"
                                  placeholder="Current Password"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-9"
                                  type="password"
                                  placeholder="New Password"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-9"
                                  type="password"
                                  placeholder="Confirm Password"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={loading}>
                        <Lock className="mr-2 h-4 w-4" />
                        Update Password
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
