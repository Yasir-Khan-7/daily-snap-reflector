import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth: React.FC = () => {
  const { user, signUp, signIn, loading, verificationSent } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('signin');
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set active tab based on URL parameter
    const tab = searchParams.get('tab');
    if (tab === 'signin' || tab === 'signup') {
      setActiveTab(tab);
    }

    // Check for verification status
    const status = searchParams.get('verification');
    if (status) {
      setVerificationStatus(status);
    }
  }, [searchParams]);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email, password);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(email, password);
  };

  // Function to handle manual tab navigation
  const goToSignIn = () => {
    setActiveTab('signin');
    navigate('/auth?tab=signin');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Daily Snap</h1>
          <p className="text-gray-600">Capture your thoughts before they fade away</p>
        </div>

        {verificationSent ? (
          <Card className="border-purple-200 shadow-md">
            <CardHeader className="bg-purple-50 rounded-t-lg">
              <CardTitle className="flex items-center justify-center">
                <Mail className="mr-2 h-6 w-6 text-purple-500" />
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-center">
                We've sent a verification email to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center pt-6">
              <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Please check your inbox (and spam folder) for the verification email.
                </AlertDescription>
              </Alert>

              <div className="bg-purple-50 rounded-lg p-6 flex flex-col items-center">
                <CheckCircle className="h-12 w-12 text-purple-500 mb-3" />
                <p className="text-sm text-gray-700">
                  After clicking the verification link, you'll be able to sign in to your account.
                </p>
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-3">
                  Redirecting to login in a moment...
                </p>
                <Button
                  variant="default"
                  onClick={goToSignIn}
                  className="w-full gap-2"
                >
                  Go to Login Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card className="border-blue-100 shadow-sm">
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Sign in to access your notes</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    {verificationStatus === 'success' && (
                      <Alert className="bg-green-50 border-green-200 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <AlertDescription>
                          Your email has been verified successfully. You can now sign in.
                        </AlertDescription>
                      </Alert>
                    )}
                    {verificationStatus === 'pending' && (
                      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <AlertDescription>
                          Please check your email and verify your account before signing in.
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-purple-100 shadow-sm">
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Get started with Daily Snap</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        After signup, you'll need to verify your email before logging in.
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <Label htmlFor="new-email">Email</Label>
                      <Input
                        id="new-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Auth;
