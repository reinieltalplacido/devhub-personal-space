
import React, { useState, useEffect } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import DevHubDashboard from '../components/DevHubDashboard';
import Landing from './Landing';

const Index = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    // Check if user name exists in localStorage
    const storedName = localStorage.getItem('devhub_user_name');
    if (storedName) {
      setUserName(storedName);
      setShowLanding(false);
    }
    setIsLoading(false);
  }, []);

  const handleUserSetup = (name: string) => {
    localStorage.setItem('devhub_user_name', name);
    setUserName(name);
    setShowLanding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showLanding) {
    return <Landing />;
  }

  if (!userName) {
    return <WelcomeScreen onUserSetup={handleUserSetup} />;
  }

  return <DevHubDashboard userName={userName} />;
};

export default Index;
