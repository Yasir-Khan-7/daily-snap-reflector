import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const VerificationSuccess: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Show toast when component mounts
        toast({
            title: "Email verified successfully",
            description: "Your email has been verified. You can now sign in with your credentials.",
        });

        // Auto-redirect after a delay
        const redirectTimer = setTimeout(() => {
            navigate('/auth?tab=signin&verification=success');
        }, 3000);

        return () => clearTimeout(redirectTimer);
    }, [navigate]);

    const handleGoToSignIn = () => {
        navigate('/auth?tab=signin&verification=success');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
            <div className="w-full max-w-md">
                <Card className="border-green-200 shadow-md">
                    <CardHeader className="bg-green-50 rounded-t-lg text-center">
                        <div className="flex justify-center mb-4">
                            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center border-4 border-green-100">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-green-800">Email Verified!</CardTitle>
                        <CardDescription className="text-green-700">
                            Your account has been successfully verified
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6 text-center">
                        <p className="text-gray-700">
                            Your email has been successfully verified. You can now sign in to your Daily Snap account and start using the application.
                        </p>

                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Redirecting to login page in a moment...</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full animate-[progress_3s_ease-in-out_forwards]"></div>
                            </div>
                        </div>

                        <Button
                            onClick={handleGoToSignIn}
                            className="w-full gap-2 bg-green-600 hover:bg-green-700"
                        >
                            Go to Login Now
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VerificationSuccess; 