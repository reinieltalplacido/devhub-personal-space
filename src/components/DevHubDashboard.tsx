import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
// Removed unused Navbar import
// import Navbar from './Navbar';
import { 
  Bell, Search, User,
  ChevronDown, HelpCircle, Settings,
  MoreVertical, Filter, ArrowUpRight, Activity, Home,
  ChevronRight, Star, Archive, Trash,
  Sun, Moon
} from 'lucide-react';
// Add imports from geist-ui/icons if needed, assuming they are used here as well
import { Bell as BellGeist, Star as StarGeist, MoreVertical as MoreVerticalGeist, Home as HomeGeist, ChevronRight as ChevronRightGeist } from '@geist-ui/icons';

interface DevHubDashboardProps {
  userName: string;
  sidebarExpanded: boolean;
  setSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}

const DevHubDashboard: React.FC<DevHubDashboardProps> = ({
  userName,
  sidebarExpanded,
  setSidebarExpanded
}) => {
  // Get first name for greeting
  const firstName = userName.split(' ')[0];

  // Function to get the time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  // Function to get the time-based icon
  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 18) { // Sun for morning and afternoon
      return <Sun className="inline-block ml-2 w-6 h-6 text-yellow-500" />;
    } else { // Moon for evening and night
      return <Moon className="inline-block ml-2 w-6 h-6 text-indigo-500" />;
    }
  };

  const quickStats = [
    { label: 'Coding Hours', value: '0h', subtext: 'Today', trend: '--' },
    { label: 'Tasks Done', value: '0', subtext: 'This week', trend: '--' },
    { label: 'Streak Days', value: '0', subtext: 'Current', trend: '--' },
    { label: 'Projects', value: '0', subtext: 'Active', trend: '--' },
  ];

  const todayTasks: any[] = [];

  const recentActivity: any[] = [];

  const learningProgress: any[] = [];

  // activeTab and setActiveTab are now handled by react-router-dom and Navbar internally
  const activeTab = 'dashboard';

  return (
    // The content should be wrapped in a single element, typically a div or fragment,
    // to be rendered inside MainLayout.
    <>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {/* Using lucide-react icons based on existing imports */}
                <Home className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Workspace</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                {/* Display current tab based on route or component purpose */}
                <span className="text-sm font-semibold text-gray-900">Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Using lucide-react icons based on existing imports */}
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
                <Star className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Content is now always specific to this component, no need for activeTab check here */}
          <div className="max-w-7xl mx-auto p-8">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{getGreeting()}, {firstName}!{getGreetingIcon()}</h1>
              <p className="text-gray-600">Here's your development workspace overview</p>
            </div>

            {/* Quick Stats */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">📊 Quick Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-500">{stat.subtext} • <span className="text-gray-500 font-medium">{stat.trend}</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">✅ Today's Tasks</h2>
                {todayTasks.length > 0 && (
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
                )}
              </div>
              {todayTasks.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                  <p className="mb-4">No tasks for today. Ready to add some?</p>
                  <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                    + Add New Task
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="col-span-6">Task</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Priority</div>
                      <div className="col-span-2">Time</div>
                    </div>
                  </div>
                  {todayTasks.map((task) => (
                    <div key={task.id} className="px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6 flex items-center space-x-3">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" checked={task.status === 'Done'} readOnly />
                          <span className={`text-sm font-medium ${task.status === 'Done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            task.status === 'Done' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="col-span-2 text-sm text-gray-600 font-medium">
                          {task.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">🕒 Recent Activity</h2>
                {recentActivity.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                    <p className="mb-4">No recent activity. Get to work and see updates here!</p>
                    <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                      Start a Task or Project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-900 font-medium">
                              <span className="font-semibold">{activity.action}</span> {activity.item}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Learning Progress */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">📚 Learning Progress</h2>
                 {learningProgress.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                    <p className="mb-4">No learning goals set yet. Ready to start learning?</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {learningProgress.map((course, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-900 font-medium">
                              <span className="font-semibold">{course.action}</span> {course.item}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{course.progress} • {course.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Goals */}
             <div className="mb-8">
               <h2 className="text-xl font-semibold text-gray-900 mb-6">🎯 Weekly Goals</h2>
                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                    <p className="mb-4">No weekly goals set yet. Define your focus for the week!</p>
                    <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                      + Add Weekly Goal
                    </button>
                  </div>
             </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default DevHubDashboard;
