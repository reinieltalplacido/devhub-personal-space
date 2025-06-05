import React, { useState, useEffect } from 'react';
import { 
  Bell, Search, User, Code, Clock, Target, TrendingUp, Calendar, 
  CheckCircle, AlertCircle, Zap, ChevronDown, HelpCircle, Settings,
  Plus, MoreVertical, Filter, ArrowUpRight, Activity, Home, 
  BookOpen, Hash, ChevronRight, Star, Archive, Trash
} from 'lucide-react';

interface DevHubDashboardProps {
  userName: string;
}

const DevHubDashboard: React.FC<DevHubDashboardProps> = ({ userName }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Get first name for greeting
  const firstName = userName.split(' ')[0];

  const workspaceItems = [
    { name: 'Dashboard', icon: Home, hasChildren: false },
    { name: 'Projects', icon: Code, hasChildren: true, children: ['Web App', 'Mobile App', 'API Service'] },
    { name: 'Tasks', icon: CheckCircle, hasChildren: true, children: ['To Do', 'In Progress', 'Done'] },
    { name: 'Learning', icon: BookOpen, hasChildren: true, children: ['React', 'TypeScript', 'Node.js'] },
    { name: 'Timer', icon: Clock, hasChildren: false },
    { name: 'Calendar', icon: Calendar, hasChildren: false },
    { name: 'Notes', icon: Target, hasChildren: true, children: ['Daily Notes', 'Meeting Notes', 'Ideas'] },
  ];

  const quickStats = [
    { label: 'Coding Hours', value: '4.2h', subtext: 'Today', trend: '+12%' },
    { label: 'Tasks Done', value: '8', subtext: 'This week', trend: '+3' },
    { label: 'Streak Days', value: '12', subtext: 'Current', trend: '+1' },
    { label: 'Projects', value: '4', subtext: 'Active', trend: '→' },
  ];

  const todayTasks = [
    { id: 1, title: 'Fix authentication bug', status: 'In Progress', priority: 'High', time: '2h' },
    { id: 2, title: 'Review PR #234', status: 'To Do', priority: 'Medium', time: '30m' },
    { id: 3, title: 'Update documentation', status: 'Done', priority: 'Low', time: '1h' },
    { id: 4, title: 'Team standup meeting', status: 'Done', priority: 'Medium', time: '30m' },
  ];

  const recentActivity = [
    { action: 'Created', item: 'New React component', time: '2 minutes ago', type: 'code' },
    { action: 'Completed', item: 'Database migration task', time: '1 hour ago', type: 'task' },
    { action: 'Updated', item: 'Project timeline', time: '2 hours ago', type: 'project' },
    { action: 'Added', item: 'Meeting notes for Sprint Planning', time: '3 hours ago', type: 'note' },
  ];

  const learningProgress = [
    { topic: 'React Advanced Patterns', progress: 75, total: 12, completed: 9 },
    { topic: 'TypeScript Deep Dive', progress: 45, total: 20, completed: 9 },
    { topic: 'System Design', progress: 30, total: 15, completed: 4 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
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
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === item.name 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ${!sidebarExpanded ? 'justify-center' : 'justify-start'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarExpanded && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.hasChildren && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    </>
                  )}
                </button>
              </div>
            ))}
          </nav>

          {/* Quick Actions */}
          {sidebarExpanded && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3 px-3">Quick Add</div>
              <div className="space-y-1">
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Task</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Note</span>
                </button>
              </div>
            </div>
          )}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Workspace</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="text-sm font-semibold text-gray-900">{activeTab}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
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
          {activeTab === 'Dashboard' && (
            <div className="max-w-7xl mx-auto p-8">
              {/* Page Title */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning, {firstName}! ☀️</h1>
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
                      <div className="text-xs text-gray-500">{stat.subtext} • <span className="text-green-600 font-medium">{stat.trend}</span></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Tasks */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">✅ Today's Tasks</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
                </div>
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
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">🕒 Recent Activity</h2>
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
                </div>

                {/* Learning Progress */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">📚 Learning Progress</h2>
                  <div className="space-y-4">
                    {learningProgress.map((course, index) => (
                      <div key={index} className="bg-white p-5 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-semibold text-gray-900">{course.topic}</div>
                          <div className="text-sm text-gray-600 font-medium">{course.completed}/{course.total}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                            style={{width: `${course.progress}%`}}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 font-medium">{course.progress}% complete</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly Goals */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">🎯 Weekly Goals</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-3">💻</div>
                    <div className="text-sm font-semibold text-gray-900 mb-2">Code 40 hours</div>
                    <div className="text-xs text-gray-600 mb-3">32/40 hours completed</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{width: '80%'}}></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-3">📖</div>
                    <div className="text-sm font-semibold text-gray-900 mb-2">Complete 2 courses</div>
                    <div className="text-xs text-gray-600 mb-3">1/2 courses completed</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{width: '50%'}}></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-3">🚀</div>
                    <div className="text-sm font-semibold text-gray-900 mb-2">Deploy 1 project</div>
                    <div className="text-xs text-gray-600 mb-3">0/1 projects deployed</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{width: '25%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs */}
          {activeTab !== 'Dashboard' && (
            <div className="max-w-5xl mx-auto p-8">
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🚧</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{activeTab}</h2>
                <p className="text-gray-600 text-lg">This section is coming soon!</p>
                <p className="text-gray-500 text-sm mt-2">We're working hard to bring you more amazing features.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DevHubDashboard;
