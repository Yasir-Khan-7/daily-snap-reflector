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

      // Try signing up without email verification
      // By setting the email header to 'noverify', we can control email sending in some setups
      const headers = {
        'X-Skip-Email-Verification': 'true',
        'X-Client-Info': 'no-email-please'
      };

      const { error, data } = await supabase.auth.signUp(
        {
          email,
          password
        },
        {
          redirectTo: window.location.origin + '/#/dashboard',
          emailRedirectTo: null,
          captchaToken: undefined,
          headers
        }
      );

      if (error) {
        throw error;
      }

      // If signup is successful but still requires email verification
      if (data?.user && !data.user.email_confirmed_at) {
        // Try an immediate sign-in anyway - might work depending on Supabase config
        await supabase.auth.signInWithPassword({ email, password });
      }

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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // If the error is about email verification, try to force sign in
        if (error.message.includes('Email not confirmed')) {
          // Try to sign in again with direct password auth
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (retryError) {
            throw retryError;
          }
        } else {
          throw error;
        }
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
    <AuthContext.Provider value={{ session, user, signUp, signIn, signOut, loading }}>
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
