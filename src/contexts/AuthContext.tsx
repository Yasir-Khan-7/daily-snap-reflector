import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth event:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You've successfully signed in.",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You've been signed out successfully.",
          });
        } else if (event === 'USER_UPDATED') {
          toast({
            title: "Account updated",
            description: "Your account information has been updated.",
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password recovery",
            description: "Complete the form to reset your password.",
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Try to sign in first in case user already exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // If sign in succeeded, it means user already exists - navigate to dashboard
      if (!signInError) {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in with an existing account.",
        });
        navigate('/dashboard');
        return;
      }

      // Get the base URL for the app - support both hash and browser router
      const baseUrl = window.location.origin;
      // Use hash router style for redirects (#/ format)
      const redirectTo = `${baseUrl}/#/verify-email`;
      
      console.log('Using redirect URL for verification:', redirectTo);

      // Regular signup with email verification
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo
        }
      });

      if (error) {
        throw error;
      }

      // If email confirmation is required, don't try to sign in automatically
      if (data?.user && !data.user.email_confirmed_at) {
        toast({
          title: "Verification required",
          description: "Please check your email to verify your account.",
        });
        
        // We don't navigate - the Auth component will show verification alert
        return;
      }

      // If email confirmation was not required (depends on Supabase settings)
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      // Handle duplicate email error
      if (error.message?.includes('email already registered')) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Please sign in instead.",
        });
        navigate('/auth?tab=signin');
        return;
      }

      // Handle other signup errors
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during sign up.",
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting to sign in with email:', email);
      
      // Check if Supabase is accessible first
      try {
        const { data: pingData, error: pingError } = await supabase.from('_pings').select('*').limit(1);
        if (pingError) {
          console.error('Supabase connection test failed:', pingError);
        } else {
          console.log('Supabase connection test succeeded');
        }
      } catch (pingErr) {
        console.error('Supabase ping test error:', pingErr);
      }

      // Attempt the sign-in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error("Sign-in error:", error.message);
        
        // Handle email verification error
        if (error.message.includes('Email not confirmed')) {
          // Don't try to force sign in
          toast({
            title: "Email verification required",
            description: "Please check your inbox and click the verification link before signing in.",
          });
          return;
        }
        
        // Handle other errors
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password."
        });
        return;
      }

      // Check if we got valid data back
      if (!data || !data.session) {
        console.error("No session returned from sign in");
        toast({
          title: "Login failed",
          description: "No session data returned. Please try again."
        });
        return;
      }

      console.log('Sign in successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Sign-in exception:", error);
      
      // Provide a more helpful message for network errors
      let errorMessage = error.message || "An unexpected error occurred.";
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        errorMessage = "Network error: Please check your internet connection or try again later.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out.",
      });
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      setLoading(true);
      
      // Request a new verification email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error("Error resending verification email:", error.message);
        toast({
          title: "Error",
          description: error.message || "Failed to resend verification email. Please try again."
        });
        return;
      }

      toast({
        title: "Verification email sent",
        description: "A new verification email has been sent to your inbox."
      });
    } catch (error: any) {
      console.error("Error in resendVerificationEmail:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signUp, signIn, signOut, resendVerificationEmail, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
