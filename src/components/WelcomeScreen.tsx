
import React, { useState } from 'react';
import { Code, ArrowRight, Database } from 'lucide-react';

interface WelcomeScreenProps {
  onUserSetup: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onUserSetup }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsSubmitting(true);
      // Simulate a brief delay for smooth transition
      setTimeout(() => {
        onUserSetup(name.trim());
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to DevHub</h1>
          <p className="text-gray-600">Your personal productivity & development tracker</p>
        </div>

        {/* Setup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                What's your full name?
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Data Storage Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <Database className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">Data Storage</h3>
                <p className="text-sm text-blue-700">
                  DevHub uses your browser's local storage to save your data. Your information stays private and secure on your device.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">What you'll get:</p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <span>📊 Progress Tracking</span>
            <span>✅ Task Management</span>
            <span>⏱️ Time Tracking</span>
            <span>📚 Learning Goals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
