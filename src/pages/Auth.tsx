import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, RefreshCw, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const Auth: React.FC = () => {
  const { user, signUp, signIn, loading, resendVerificationEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('signin');
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set active tab based on URL parameter
    const tab = searchParams.get('tab');
    if (tab === 'signin' || tab === 'signup') {
      setActiveTab(tab);
    }

    // Check for error parameters that might indicate verification issues
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error && errorDescription) {
      // If there's an error related to verification
      if (errorDescription.includes('email') && errorDescription.includes('verification')) {
        setShowVerificationAlert(true);
        
        // Extract email from the error description if possible
        const emailMatch = errorDescription.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
        if (emailMatch && emailMatch[0]) {
          setEmail(emailMatch[0]);
        }
      } else {
        // For other errors, display the error message
        setErrorMessage(errorDescription);
      }
    }

    // Test connection to Supabase
    const testSupabaseConnection = async () => {
      try {
        // Simple query to check if Supabase is accessible
        // Just use a basic health check by trying to access the service
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Supabase connection test failed:', error);
          setNetworkError(true);
        } else {
          console.log('Supabase connection test succeeded');
          setNetworkError(false);
        }
      } catch (err) {
        console.error('Supabase connection test threw an error:', err);
        setNetworkError(true);
      }
    };

    testSupabaseConnection();
  }, [searchParams]);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setNetworkError(false);
    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error("Login error in Auth component:", error);
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.code === 'NETWORK_ERROR') {
        setNetworkError(true);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setNetworkError(false);
    try {
      await signUp(email, password);
      setShowVerificationAlert(true);
    } catch (error: any) {
      console.error("Signup error in Auth component:", error);
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.code === 'NETWORK_ERROR') {
        setNetworkError(true);
      }
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    await resendVerificationEmail(email);
    setResendingEmail(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Daily Snap</h1>
          <p className="text-gray-600">Capture your thoughts before they fade away</p>
        </div>

        {networkError && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-700">Network Error</AlertTitle>
            <AlertDescription className="text-red-600">
              <p className="mb-3">
                Unable to connect to the authentication service. Please check your internet connection and try again.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="mt-2 bg-white border-red-200 text-red-600 hover:bg-red-50"
              >
                <RefreshCw className="mr-1 h-3 w-3" /> Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && !networkError && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-700">Authentication Error</AlertTitle>
            <AlertDescription className="text-red-600">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {showVerificationAlert && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-700">Verification Required</AlertTitle>
            <AlertDescription className="text-blue-600">
              Please check {email} for a verification link.
              <div className="mt-2 flex items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2 bg-white/50 border-blue-200 text-blue-700 hover:bg-blue-100 text-xs"
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                >
                  {resendingEmail ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Resend Email
                    </>
                  )}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

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
                  <div className="px-1 text-xs text-gray-500">
                    <p>Email verification is required to activate your account. Please use a valid email address.</p>
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
      </div>
    </div>
  );
};

export default Auth;
