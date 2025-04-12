import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

const VerificationSuccess: React.FC = () => {
    const navigate = useNavigate();

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