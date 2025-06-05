
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  const handleGetStarted = () => {
    // For now, we'll just update the state to show the welcome screen
    // Later this will redirect to actual auth page
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Dev<span className="text-blue-600">Hub</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          Your personal development workspace. Organize projects, track progress, and accelerate your coding journey.
        </p>
        <Button 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
          onClick={handleGetStarted}
        >
          Get Started <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Landing;
