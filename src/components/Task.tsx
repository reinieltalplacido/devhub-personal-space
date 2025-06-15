import React, { useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import {
  Home, ChevronRight, Bell, Star, MoreVertical, Plus, Trash2, Edit, CheckCircle, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  title?: string;
  dueDate?: string;
  notes?: string;
}

interface TasksProps {
  userName: string;
  sidebarExpanded: boolean;
  setSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}

const Tasks: React.FC<TasksProps> = ({
  userName,
  sidebarExpanded,
  setSidebarExpanded,
}) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      description: '', // Start with empty description
      status: 'todo',
      title: '',
      dueDate: '',
      notes: '',
    };
    setSelectedTaskDetails(newTask);
    setShowDetailsModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string, taskStatus: Task['status']) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('taskStatus', taskStatus);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');

    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTaskDetails(task);
    setShowDetailsModal(true);
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedTaskDetails(prevState => prevState ? { ...prevState, [name]: value } : null);
  };

  const handleSaveDetails = () => {
    if (selectedTaskDetails) {
      setTasks(prevTasks => {
        const existingTaskIndex = prevTasks.findIndex(task => task.id === selectedTaskDetails.id);
        if (existingTaskIndex > -1) {
          // Update existing task
          return prevTasks.map(task => 
            task.id === selectedTaskDetails.id ? selectedTaskDetails : task
          );
        } else {
          // Add new task
          return [...prevTasks, selectedTaskDetails];
        }
      });
      setShowDetailsModal(false);
      setSelectedTaskDetails(null);
    }
  };

  const tasksTodo = tasks.filter(task => task.status === 'todo');
  const tasksInProgress = tasks.filter(task => task.status === 'in-progress');
  const tasksDone = tasks.filter(task => task.status === 'done');

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">

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
                  <CheckCircle className="w-4 h-4 text-indigo-500" />
                  Tasks
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
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

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-end mb-6">
              <button
                onClick={handleAddTask}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Task
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div 
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'todo')}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">To Do ({tasksTodo.length})</h2>
                <div className="space-y-4">
                  {tasksTodo.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, task.status)}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-grab flex justify-between items-center hover:shadow-md transition-shadow"
                    >
                      <div>
                         <p className="font-semibold text-gray-900">{task.title || 'No Title'}</p>
                         <p className="text-sm text-gray-600">{task.description}</p>
                         {task.dueDate && <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>}
                      </div>
                       <div className="flex items-center space-x-2">
                          <button onClick={() => handleTaskClick(task)} className="text-gray-500 hover:text-blue-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDeleteTask(task.id)} className="text-gray-500 hover:text-red-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                              <Trash2 className="w-4 h-4" />
                           </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'in-progress')}
              >
                <h2 className="text-xl font-semibold text-indigo-800 mb-4">In Progress ({tasksInProgress.length})</h2>
                <div className="space-y-4">
                   {tasksInProgress.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, task.status)}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-grab flex justify-between items-center hover:shadow-md transition-shadow"
                    >
                       <div>
                         <p className="font-semibold text-gray-900">{task.title || 'No Title'}</p>
                         <p className="text-sm text-gray-600">{task.description}</p>
                         {task.dueDate && <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>}
                      </div>
                       <div className="flex items-center space-x-2">
                          <button onClick={() => handleTaskClick(task)} className="text-gray-500 hover:text-blue-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDeleteTask(task.id)} className="text-gray-500 hover:text-red-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                              <Trash2 className="w-4 h-4" />
                           </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'done')}
              >
                <h2 className="text-xl font-semibold text-green-800 mb-4">Done ({tasksDone.length})</h2>
                 <div className="space-y-4">
                   {tasksDone.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, task.status)}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-grab flex justify-between items-center hover:shadow-md transition-shadow"
                    >
                       <div>
                         <p className="font-semibold text-gray-900">{task.title || 'No Title'}</p>
                         <p className="text-sm text-gray-600">{task.description}</p>
                         {task.dueDate && <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>}
                      </div>
                       <div className="flex items-center space-x-2">
                           <button onClick={() => handleTaskClick(task)} className="text-gray-500 hover:text-blue-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDeleteTask(task.id)} className="text-gray-500 hover:text-red-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                              <Trash2 className="w-4 h-4" />
                           </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {showDetailsModal && selectedTaskDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Edit className="w-6 h-6 text-indigo-600" />
              Task Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={selectedTaskDetails.title || ''}
                  onChange={handleDetailChange}
                  placeholder="Task title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={selectedTaskDetails.description}
                  onChange={handleDetailChange}
                  placeholder="Detailed description of the task"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors h-24 resize-y"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={selectedTaskDetails.status}
                  onChange={handleDetailChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date (Optional)</label>
                <input
                  type="date"
                  name="dueDate"
                  value={selectedTaskDetails.dueDate || ''}
                  onChange={handleDetailChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={selectedTaskDetails.notes || ''}
                  onChange={handleDetailChange}
                  placeholder="Any additional notes for this task"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors h-24 resize-y"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedTaskDetails(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDetails}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

