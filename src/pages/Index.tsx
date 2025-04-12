
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Daily Snap</span>
            <span className="block text-purple-600 mt-2">Capture moments that matter</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-lg text-gray-500 sm:max-w-3xl">
            Your modern note-taking solution. Organize your thoughts, tasks, links, and images — all in one beautiful place.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            {user ? (
              <Button asChild size="lg" className="px-8 py-6 text-base">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="px-8 py-6 text-base">
                  <Link to="/auth">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8 py-6 text-base">
                  <Link to="/auth?tab=signin">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Capture Everything",
                description: "From quick thoughts to complex tasks, save everything you need in one place."
              },
              {
                title: "Stay Organized",
                description: "Easily categorize and find your notes with powerful search and tagging."
              },
              {
                title: "Access Anywhere",
                description: "Your notes are securely stored in the cloud and available on all your devices."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
