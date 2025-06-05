
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Users, Zap } from 'lucide-react';
import ThreeScene from '../components/ThreeScene';

const Landing = () => {
  const scrollToAuth = () => {
    const authSection = document.getElementById('auth-section');
    authSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ThreeScene />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-fade-in">
            Dev<span className="text-purple-400">Hub</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in">
            Your personal development workspace. Organize projects, track progress, and accelerate your coding journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
              onClick={scrollToAuth}
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why Choose DevHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
              <Code className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Project Management</h3>
              <p className="text-gray-300">
                Organize your coding projects, track progress, and manage tasks efficiently.
              </p>
            </div>
            <div className="text-center p-8 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
              <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Fast & Intuitive</h3>
              <p className="text-gray-300">
                Built for speed with a clean, intuitive interface that gets out of your way.
              </p>
            </div>
            <div className="text-center p-8 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
              <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Personal Workspace</h3>
              <p className="text-gray-300">
                Your private space to learn, grow, and showcase your development journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="auth-section" className="py-20 px-6 bg-gradient-to-r from-purple-900 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to Transform Your Development Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of developers who are already using DevHub to accelerate their growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Continue with Google <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 text-lg"
            >
              Sign Up with Email
            </Button>
          </div>
          <p className="text-gray-400 mt-6 text-sm">
            Free to start. No credit card required.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
