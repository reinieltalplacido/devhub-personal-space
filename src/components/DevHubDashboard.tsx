import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, Search, User, Plus,
  ChevronDown, HelpCircle, Settings,
  MoreVertical, Filter, ArrowUpRight, Activity, Home,
  ChevronRight, Star, Archive, Trash,
  Sun, Moon, Sparkles, Code, CheckSquare, FileText, Wrench,
  Calendar, Clock, TrendingUp, Target, BookOpen, Zap
} from 'lucide-react';

interface DevHubDashboardProps {
  userName?: string;
}

const DevHubDashboard: React.FC<DevHubDashboardProps> = ({
  userName = "Developer",
}) => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      try {
        const storedProjects = localStorage.getItem('projects');
        setProjects(storedProjects ? JSON.parse(storedProjects) : []);

        const storedTasks = localStorage.getItem('tasks');
        setTasks(storedTasks ? JSON.parse(storedTasks) : []);

        const storedNotes = localStorage.getItem('devhub_notes');
        setNotes(storedNotes ? JSON.parse(storedNotes) : []);

        const storedTools = localStorage.getItem('devhub_tools');
        setTools(storedTools ? JSON.parse(storedTools) : []);
      } catch (error) {
        console.error("Failed to load data from localStorage:", error);
      }
    };

    loadData();

    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const firstName = userName.split(' ')[0];

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

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 18) {
      return <Sun className="inline-block ml-2 w-6 h-6 text-yellow-500" />;
    } else {
      return <Moon className="inline-block ml-2 w-6 h-6 text-indigo-500" />;
    }
  };

  const todayTasks = tasks.filter(task => task.status === 'todo').slice(0, 3);
  const activeProjects = projects.filter(project => project.status === 'active');

  const quickStats = [
    {
      label: 'Active Projects',
      value: projects.filter(p => p.status === 'active').length.toString(),
      subtext: 'In Progress',
      trend: '--',
      icon: <Code className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200',
      route: '/projects'
    },
    {
      label: 'Pending Tasks',
      value: tasks.filter(t => t.status === 'todo').length.toString(),
      subtext: 'To Complete',
      trend: '--',
      icon: <CheckSquare className="w-5 h-5 text-green-500" />,
      color: 'bg-green-50 border-green-200',
      route: '/tasks'
    },
    {
      label: 'Notes',
      value: notes.length.toString(),
      subtext: 'Total',
      trend: '--',
      icon: <FileText className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-50 border-purple-200',
      route: '/notes'
    },
    {
      label: 'Tools',
      value: tools.length.toString(),
      subtext: 'Available',
      trend: '--',
      icon: <Wrench className="w-5 h-5 text-orange-500" />,
      color: 'bg-orange-50 border-orange-200',
      route: '/tools'
    },
  ];

  const upcomingDeadlines = [
    ...tasks.filter(task => task.dueDate && task.status !== 'done').map(task => ({
      title: task.title || task.description,
      date: task.dueDate,
      type: 'task',
      priority: task.priority || 'medium'
    })),
    ...projects.filter(project => project.deadline && project.status !== 'completed').map(project => ({
      title: project.name || project.description,
      date: project.deadline,
      type: 'project',
      priority: 'medium'
    }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);

  const recentActivity: any[] = [];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-500">Workspace</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                Dashboard
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search workspace..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 hover:bg-white/50 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/50 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
              <Star className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/50 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              {getGreeting()}, {firstName}!
              {getGreetingIcon()}
            </h1>
            <p className="text-gray-600">Ready to build something amazing today?</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-500" />
              Quick Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`${stat.color} p-6 rounded-xl border hover:shadow-lg transition-all duration-200 cursor-pointer group`}
                  onClick={() => navigate(stat.route)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    {stat.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-2">{stat.label}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">{stat.subtext}</div>
                    <div className="text-xs text-gray-600 font-medium">{stat.trend}</div>
                  </div>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-gray-500" />
                  Today's Focus
                </h2>
                {todayTasks.length > 0 && (
                  <button 
                    onClick={() => navigate('/tasks')}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    View all tasks
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              {todayTasks.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">All caught up! No tasks for today.</p>
                  <button 
                    onClick={() => navigate('/tasks')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Create New Task
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayTasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-4 h-4 border-2 border-gray-300 rounded group-hover:border-indigo-500 transition-colors"></div>
                            <h3 className="font-semibold text-gray-900">{task.title || 'No Title'}</h3>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {task.dueDate || 'No due date'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => navigate('/tasks')}
                          className="opacity-0 group-hover:opacity-100 text-indigo-600 hover:text-indigo-700 transition-all"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-500" />
                Upcoming Deadlines
              </h2>
              <div className="space-y-4">
                {upcomingDeadlines.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No upcoming deadlines. Enjoy the calm!</p>
                  </div>
                ) : (
                  upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{deadline.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          deadline.priority === 'high' ? 'bg-red-100 text-red-700' :
                          deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {deadline.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="capitalize">{deadline.type}</span>
                        <span>{deadline.date || 'N/A'}</span>
                      </div>
                      <button
                        onClick={() => navigate(deadline.type === 'task' ? '/tasks' : '/projects')}
                        className="mt-2 opacity-0 group-hover:opacity-100 text-indigo-600 hover:text-indigo-700 transition-all flex items-center gap-1"
                      >
                        View {deadline.type}
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-500" />
                Recent Activity
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                {recentActivity.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <p>No recent activity.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'task' ? 'bg-green-500' : activity.type === 'project' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">
                            <span className="font-medium">{activity.action}</span>{' '}
                            <span className="text-indigo-600">{activity.item}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-gray-500" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/projects')}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group text-left"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">New Project</h3>
                  <p className="text-sm text-gray-600">Start a fresh project</p>
                </button>

                <button
                  onClick={() => navigate('/tasks')}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group text-left"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <CheckSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Add Task</h3>
                  <p className="text-sm text-gray-600">Create a new task</p>
                </button>

                <button
                  onClick={() => navigate('/notes')}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group text-left"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quick Note</h3>
                  <p className="text-sm text-gray-600">Jot down an idea</p>
                </button>

                <button
                  onClick={() => navigate('/tools')}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group text-left"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                    <Wrench className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Browse Tools</h3>
                  <p className="text-sm text-gray-600">Find useful tools</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DevHubDashboard;