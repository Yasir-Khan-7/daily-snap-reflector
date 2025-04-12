import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  verificationSent: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The production URL for the application - always use this for email confirmations
const PRODUCTION_URL = 'https://yasir-khan-7.github.io/daily-snap-reflector';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for email confirmation or errors in URL
    const handleUrlParameters = () => {
      // Check for error parameters that may indicate expired links, etc.
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      const error = searchParams.get('error') || hashParams.get('error');
      const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

      // Handle expired tokens or other errors
      if (error) {
        console.log("Auth error detected:", error, errorDescription);
        toast({
          variant: "destructive",
          title: "Verification Error",
          description: errorDescription || "Your verification link has expired or is invalid. Please try again.",
        });

        // Clear URL parameters and redirect to signin
        window.history.replaceState(null, '', '/#/auth?tab=signin');
        return;
      }

      // Check for access token in hash (successful verification)
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (accessToken && type === 'signup') {
        // Instead of setting the session and redirecting, display success message
        // and direct user to login page
        toast({
          title: "Email verified successfully",
          description: "Your email has been verified. You can now sign in with your credentials.",
        });

        // Clear URL parameters and redirect to signin
        window.history.replaceState(null, '', '/#/auth?tab=signin&verification=success');
      }
    };

    handleUrlParameters();
  }, [location, navigate]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
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

      // Sign up without email verification
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Skip email verification
          emailRedirectTo: undefined,
          data: {
            email_confirmed: true
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data?.user?.identities?.length === 0) {
        toast({
          title: "Account already exists",
          description: "This email is already registered. Please sign in instead.",
        });
        navigate('/auth?tab=signin');
        return;
      }

      // Sign in immediately after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw signInError;
      }

      toast({
        title: "Account created successfully",
        description: "Welcome to Daily Snap!",
      });

      navigate('/dashboard');

    } catch (error: any) {
      toast({
        variant: "destructive",
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password.",
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

  return (
    <AuthContext.Provider value={{ session, user, signUp, signIn, signOut, loading, verificationSent }}>
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
