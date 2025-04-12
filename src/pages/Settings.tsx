import React, { useState } from 'react';
import { Layout } from '@/components/ui/layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, Save, KeyRound, BellRing, PaletteIcon, UserRound, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Settings: React.FC = () => {
    const { user, signOut } = useAuth();
    const [saving, setSaving] = useState(false);

    const handleSaveSettings = () => {
        setSaving(true);

        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            toast({
                title: "Settings saved",
                description: "Your preferences have been updated successfully",
            });
        }, 1500);
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
                </div>

                <Tabs defaultValue="account" className="space-y-6">
                    <TabsList className="grid grid-cols-4 max-w-md">
                        <TabsTrigger value="account" className="flex items-center gap-2">
                            <UserRound className="h-4 w-4" />
                            <span className="hidden sm:inline">Account</span>
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="flex items-center gap-2">
                            <PaletteIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Appearance</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <BellRing className="h-4 w-4" />
                            <span className="hidden sm:inline">Notifications</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Security</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="account" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your account details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Your name" defaultValue={user?.user_metadata?.name || ''} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="Your email" defaultValue={user?.email || ''} disabled />
                                    <p className="text-sm text-muted-foreground">Your email is used for account login and cannot be changed</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Input id="timezone" placeholder="Your timezone" defaultValue="UTC" />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">Cancel</Button>
                                <Button onClick={handleSaveSettings} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {saving ? 'Saving...' : 'Save changes'}
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Delete Account</CardTitle>
                                <CardDescription>Permanently delete your account and all data</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Alert className="border-red-200 bg-red-50 text-red-800">
                                    <AlertTitle className="text-red-800">Warning</AlertTitle>
                                    <AlertDescription>
                                        This action cannot be undone. All your data will be permanently deleted.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive">Delete Account</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Theme Settings</CardTitle>
                                <CardDescription>Customize the look and feel of the application</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="dark-mode">Dark Mode</Label>
                                    <Switch id="dark-mode" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="system-theme">Use System Theme</Label>
                                    <Switch id="system-theme" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="reduced-motion">Reduce Motion</Label>
                                    <Switch id="reduced-motion" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSaveSettings} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {saving ? 'Saving...' : 'Save preferences'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Control how and when you receive notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="email-notifications">Email Notifications</Label>
                                    <Switch id="email-notifications" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="push-notifications">Push Notifications</Label>
                                    <Switch id="push-notifications" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="reminder-notifications">Task Reminders</Label>
                                    <Switch id="reminder-notifications" defaultChecked />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSaveSettings} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {saving ? 'Saving...' : 'Save preferences'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your account password</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input id="current-password" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">Cancel</Button>
                                <Button onClick={handleSaveSettings} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {saving ? 'Updating...' : 'Update password'}
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Two-Factor Authentication</CardTitle>
                                <CardDescription>Add an extra layer of security to your account</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Enable 2FA</Label>
                                        <p className="text-sm text-muted-foreground">Protect your account with two-factor authentication</p>
                                    </div>
                                    <Switch id="2fa" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="gap-2">
                                    <KeyRound className="h-4 w-4" />
                                    Setup 2FA
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sign Out</CardTitle>
                                <CardDescription>Sign out from your account on this device</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    This will sign you out from your current session on this device only.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" onClick={signOut}>Sign Out</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

export default Settings; 