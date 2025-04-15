import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signIn } = useAuth();

  useEffect(() => {
    const processVerification = async () => {
      try {
        console.log('Processing verification with URL:', window.location.href);
        console.log('Hash parameters:', location.hash);
        console.log('Search parameters:', location.search);
        console.log('All search params:', Object.fromEntries([...searchParams]));
        
        // Extract parameters from URL
        // Token hash can be in different formats depending on how Supabase implemented it
        const token_hash = searchParams.get('token_hash') || searchParams.get('confirmation_token');
        const type = searchParams.get('type');
        const email = searchParams.get('email');

        console.log('Extracted parameters:', { token_hash, type, email });

        if (!token_hash) {
          setError('Verification failed: Missing token parameter');
          setLoading(false);
          return;
        }

        // If type and email are missing, try to parse from the token directly
        // This is necessary because some Supabase implementations handle this differently
        let verificationEmail = email;
        let verificationType = type || 'signup';

        // Call the Supabase verification API
        const { error, data } = await supabase.auth.verifyOtp({
          token_hash,
          type: verificationType as 'signup' | 'email_change',
          email: verificationEmail
        });

        console.log('Verification response:', { error, data });

        if (error) {
          console.error('Verification error:', error);
          
          // Try an alternative verification method if the first one fails
          // Sometimes Supabase requires just confirming with the token hash
          if (!email || !type) {
            try {
              // Try to directly extract the auth info from the URL
              // Recent versions of Supabase use this method
              const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
              
              if (sessionError) {
                throw sessionError;
              }
              
              // If we got a valid session, consider it a success
              if (sessionData && sessionData.session) {
                console.log('Successfully retrieved session after verification');
                setSuccess(true);
                setLoading(false);
                
                // Redirect after a short delay
                setTimeout(() => {
                  navigate('/auth?tab=signin');
                }, 3000);
                return;
              }
            } catch (altError) {
              console.error('Alternative verification failed:', altError);
            }
          }
          
          setError(`Verification failed: ${error.message}`);
          setLoading(false);
          return;
        }

        // Success!
        setSuccess(true);
        setLoading(false);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/auth?tab=signin');
        }, 3000);
      } catch (err: any) {
        console.error('Unexpected error during verification:', err);
        setError(`An unexpected error occurred: ${err.message}`);
        setLoading(false);
      }
    };

    processVerification();
  }, [searchParams, location.hash, location.search, navigate, signIn]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Email Verification</h1>
        
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-600">Processing your verification...</p>
            <p className="text-xs text-gray-400 mt-4">This may take a moment, please don't close this page.</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-green-700 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">Your email has been successfully verified.</p>
            <p className="text-sm text-gray-500 mb-6">You will be redirected to the sign-in page shortly...</p>
            <Button 
              onClick={() => navigate('/auth?tab=signin')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Sign In Now
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/auth?tab=signup')}
                variant="outline"
                className="block w-full"
              >
                Try Signing Up Again
              </Button>
              <Button 
                onClick={() => navigate('/auth?tab=signin')}
                className="block w-full bg-purple-600 hover:bg-purple-700"
              >
                Go to Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification; 