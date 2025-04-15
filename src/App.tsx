import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Notes = lazy(() => import("./pages/Notes"));
const Pomodoro = lazy(() => import("./pages/Pomodoro"));
const AIAssistantPage = lazy(() => import("./pages/AIAssistantPage"));
const HabitTracker = lazy(() => import("./pages/HabitTracker"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <HashRouter>
          <AuthProvider>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><span className="loader" aria-label="Loading..." /></div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/pomodoro" element={<Pomodoro />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
                  <Route path="/habits" element={<HabitTracker />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
