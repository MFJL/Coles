import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import StepTracker from "./pages/StepTracker";
import Confirmation from "./pages/Confirmation";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";

const queryClient = new QueryClient();

// Redirect to home if onboarding hasn't been completed (tracker & confirmation only)
const RequireOnboarding = ({ children }: { children: React.ReactNode }) => {
  const hasOnboarded =
    localStorage.getItem('stepGoal') !== null &&
    localStorage.getItem('selectedCharity') !== null;
  return hasOnboarded ? <>{children}</> : <Navigate to="/" replace />;
};

// Dashboard is accessible as long as there's any history, or after onboarding
const RequireHistory = ({ children }: { children: React.ReactNode }) => {
  const hasHistory = (JSON.parse(localStorage.getItem('impactHistory') || '[]') as unknown[]).length > 0;
  const hasOnboarded =
    localStorage.getItem('stepGoal') !== null &&
    localStorage.getItem('selectedCharity') !== null;
  return (hasHistory || hasOnboarded) ? <>{children}</> : <Navigate to="/" replace />;
};

// Welcome has its own full-screen header — suppress the global one there
const ConditionalHeader = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;
  return <Header />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ConditionalHeader />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/tracker" element={<RequireOnboarding><StepTracker /></RequireOnboarding>} />
          <Route path="/confirmation" element={<RequireOnboarding><Confirmation /></RequireOnboarding>} />
          <Route path="/dashboard" element={<RequireHistory><Dashboard /></RequireHistory>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
