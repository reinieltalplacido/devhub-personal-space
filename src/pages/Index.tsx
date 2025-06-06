import React from 'react';
import WelcomeScreen from '../components/WelcomeScreen';

interface IndexProps {
  userName: string | null;
  onUserSetup: (name: string) => void;
}

const Index: React.FC<IndexProps> = ({ userName, onUserSetup }) => {
  // This component now only renders the WelcomeScreen if no user is set.
  // All state management and routing is handled in App.tsx.

  if (!userName) {
    return <WelcomeScreen onUserSetup={onUserSetup} />;
  }

  // If user is set, Index component renders nothing,
  // allowing the routes defined in App.tsx to take over.
  return null;
};

export default Index;
