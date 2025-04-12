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
const PRODUCTION_URL = 'https://yasir-khan-7.github.io/daily-snap-reflector/#';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for email confirmation success in URL
    const handleEmailConfirmation = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (type === 'signup' && accessToken) {
        try {
          // Set the session with the tokens from URL
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) throw error;

          toast({
            title: "Email verified successfully",
            description: "You can now sign in with your credentials.",
          });

          // Clear the hash and redirect to signin
          window.history.replaceState(null, '', window.location.pathname);
          navigate('/auth?tab=signin&verification=success');
        } catch (error) {
          console.error('Error handling email confirmation:', error);
        }
      }
    };

    handleEmailConfirmation();
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
        } else if (event === 'USER_UPDATED') {
          // Handle when user verifies their email
          if (currentSession?.user.email_confirmed_at) {
            toast({
              title: "Email verified",
              description: "Your email has been verified. You can now sign in.",
            });
            navigate('/auth?tab=signin&verification=success');
          }
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

      // Always use the production URL for email redirects
      // This ensures users on both development and production get redirected to the production site
      const redirectTo = `${PRODUCTION_URL}/auth?tab=signin&verification=pending`;

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

      if (data?.user?.identities?.length === 0) {
        toast({
          title: "Account already exists",
          description: "This email is already registered. Please sign in instead.",
        });
        setActiveTab('signin');
        return;
      }

      setVerificationSent(true);

      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account before signing in.",
      });

      // After showing verification message, navigate to signin tab after a short delay
      setTimeout(() => {
        setVerificationSent(false);
        setActiveTab('signin');
      }, 3000);

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

  // Helper method to set active tab in Auth page
  const setActiveTab = (tab: string) => {
    navigate(`/auth?tab=${tab}`);
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
