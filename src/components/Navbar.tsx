import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Code, Search, User,
  ChevronDown, Plus, MoreVertical, Home,
  CheckCircle, BookOpen, Clock, Target, ChevronRight, Calendar, Sparkles, FileText
} from 'lucide-react';

interface NavbarProps {
  userName: string;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  userName,
  sidebarExpanded,
  setSidebarExpanded,
}) => {

  const location = useLocation();

  const workspaceItems = [
    { name: 'Dashboard', icon: Home, route: '/dashboard' },
    { name: 'Projects', icon: Code, route: '/projects' },
    { name: 'Tasks', icon: CheckCircle, route: '/tasks' },
    { name: 'Notes', icon: FileText, route: '/notes' },
    { name: 'Tools', icon: Sparkles, route: '/tools' },
  ];

  return (
    <div className={`${sidebarExpanded ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        {sidebarExpanded ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">DevHub</span>
            </div>
            <button
              onClick={() => setSidebarExpanded(false)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronDown className="w-4 h-4 text-gray-500 rotate-90" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSidebarExpanded(true)}
            className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto hover:bg-gray-800 transition-colors"
          >
            <Code className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Search */}
      {sidebarExpanded && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-50 text-gray-900 pl-9 pr-3 py-2.5 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 px-3">
        <nav className="space-y-1">
          {workspaceItems.map((item) => (
            <div key={item.name}>
              <Link
                to={item.route}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.route
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                } ${!sidebarExpanded ? 'justify-center' : 'justify-start'}`}
              >
                <item.icon className="w-5 h-5" />
                {sidebarExpanded && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                  </>
                )}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* User Section */}
      {sidebarExpanded && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm text-white font-semibold">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{userName}</div>
              <div className="text-xs text-gray-500">Personal workspace</div>
            </div>
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar; 