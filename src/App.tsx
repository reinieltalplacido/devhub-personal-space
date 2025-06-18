import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import DevHubDashboard from "./components/DevHubDashboard";
import Projects from "./components/Projects";
import React, { useState, useEffect } from 'react';
import WelcomeScreen from "./components/WelcomeScreen";
import Navbar from "./components/Navbar";
import Tasks from "./components/Task";
import Notes from "./components/Notes";
import Tools from "./components/Tools";
import Topbar from "./components/Topbar";
import Landing from "./pages/Landing";
import { Analytics } from '@vercel/analytics/react';

const queryClient = new QueryClient();

// Layout component for authenticated users
// Accepts children to render the specific page content
const MainLayout: React.FC<{ userName: string; sidebarExpanded: boolean; setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>; children: React.ReactNode }> = ({
  userName,
  sidebarExpanded,
  setSidebarExpanded,
  children, // Accept children
}) => {
  // Add search handler (can be expanded later)
  // const handleSearch = (value: string) => {
  //   // For now, just log the search value
  //   console.log("Search:", value);
  // };
  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar
        userName={userName}
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Removed Topbar from here */}
        {/* Main Content Area - Render children here */}
        {children}
      </div>
    </div>
  );
};

const App = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  // Remove window.location.assign

  // Use useNavigate for client-side navigation
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('devhub_user_name');
    if (storedName) {
      setUserName(storedName);
    }
    setIsLoading(false);
  }, []);

  // Handler for WelcomeScreen user setup
  const handleUserSetup = (name: string) => {
    localStorage.setItem('devhub_user_name', name);
    setUserName(name);
    navigate('/dashboard');
  };

  // Handler for Landing page Get Started
  const handleGetStarted = () => {
    navigate('/welcome');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Temporary Debugging Setup - Unconditional Routing
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing as root route */}
            <Route path="/" element={<Landing onGetStarted={handleGetStarted} />} />
            {/* Welcome Screen - Unconditional */}
            <Route path="/welcome" element={<WelcomeScreen onUserSetup={handleUserSetup} />} />
            {/* Dashboard - Unconditional MainLayout wrapping DevHubDashboard */}
            <Route
              path="/dashboard"
              element={
                <MainLayout userName={userName || "Test User"} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}>
                  <DevHubDashboard userName={userName || "Test User"} />
                </MainLayout>
              }
            />
            {/* Projects - Unconditional MainLayout wrapping Projects */}
             <Route
              path="/projects"
              element={
                <MainLayout userName={userName || "Test User"} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}>
                  <Projects userName={userName || "Test User"} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
                </MainLayout>
              }
            />
            {/* Tasks - Unconditional MainLayout wrapping Tasks */}
             <Route
              path="/tasks"
              element={
                <MainLayout userName={userName || "Test User"} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}>
                  <Tasks userName={userName || "Test User"} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
                </MainLayout>
              }
            />
            {/* Removed Subject Details Route */}
            {/* <Route
              path="/learning/:subjectId"
              element={
                <MainLayout userName={userName || "Test User"} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}>
                  <SubjectDetails userName={userName || "Test User"} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
                </MainLayout>
              }
            /> */}
            {/* Notes - Unconditional MainLayout wrapping Notes */}
             <Route
              path="/notes"
              element={
                <MainLayout userName={userName || "Test User"} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}>
                  <Notes userName={userName || "Test User"} />
                </MainLayout>
              }
            />
            {/* Tools - Unconditional MainLayout wrapping Tools */}
             <Route
              path="/tools"
              element={
                <MainLayout userName={userName || "Test User"} sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}>
                  <Tools userName={userName || "Test User"} />
                </MainLayout>
              }
            />
            {/* Basic Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      <Analytics />
    </QueryClientProvider>
  );
};

export default App;
