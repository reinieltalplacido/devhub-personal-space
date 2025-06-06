import React, { useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Home, ChevronRight, Bell, Star, MoreVertical, Plus, Trash2, Edit } from '@geist-ui/icons'; // Import Trash2 and Edit icons
import { Link } from 'react-router-dom'; // Import Link for navigation

interface Task {
  id: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  title?: string; // Added title field
  dueDate?: string; // Added dueDate field
  notes?: string; // Added notes field
}

interface TasksProps {
  userName: string;
  sidebarExpanded: boolean;
  setSidebarExpanded: Dispatch<SetStateAction<boolean>>; // Include if sidebar state is managed here
}

const Tasks: React.FC<TasksProps> = ({
  userName, // Assuming userName might be used in the header/layout
  sidebarExpanded, // Assuming sidebar state might affect layout
  setSidebarExpanded, // Assuming sidebar state might be toggled from here
}) => {
  // State to hold the tasks, initialized from local storage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false); // State for details modal visibility
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null); // State to hold task being viewed/edited

  // Effect to save tasks to local storage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTaskDescription.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        description: newTaskDescription.trim(),
        status: 'todo', // Default status is 'todo'
        title: '', // Initialize new fields
        dueDate: '',
        notes: '',
      };
      setTasks([...tasks, newTask]);
      setNewTaskDescription('');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string, taskStatus: Task['status']) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('taskStatus', taskStatus);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');

    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // Function to handle clicking a task to view/edit details
  const handleTaskClick = (task: Task) => {
    setSelectedTaskDetails(task);
    setShowDetailsModal(true);
  };

  // Function to handle changes in the details modal
  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedTaskDetails(prevState => prevState ? { ...prevState, [name]: value } : null);
  };

  // Function to save changes from the details modal
  const handleSaveDetails = () => {
    if (selectedTaskDetails) {
      setTasks(tasks.map(task => 
        task.id === selectedTaskDetails.id ? selectedTaskDetails : task
      ));
      setShowDetailsModal(false);
      setSelectedTaskDetails(null); // Clear selected task
    }
  };

  const tasksTodo = tasks.filter(task => task.status === 'todo');
  const tasksInProgress = tasks.filter(task => task.status === 'in-progress');
  const tasksDone = tasks.filter(task => task.status === 'done');

  return (
    // The content should be wrapped in a single element, typically a div or fragment,
    // to be rendered inside MainLayout (if you are using one).
    <>
      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-gray-500" />
                {/* Link to Dashboard/Workspace */}
                <Link to="/" className="text-sm text-gray-500 hover:underline">Workspace</Link>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                {/* Display current page/section */}
                <span className="text-sm font-semibold text-gray-900">Tasks</span>
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

        {/* Tasks Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Task Board</h1>

            {/* Add New Task */}
            <div className="flex mb-6">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTask();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddTask}
                className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" /> Add Task
              </button>
            </div>

            {/* Task Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* To Do Column */}
              <div 
                className="bg-gray-100 rounded-lg p-4 shadow-inner"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'todo')}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">To Do ({tasksTodo.length})</h2>
                <div className="space-y-3">
                  {tasksTodo.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, task.status)}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-grab flex justify-between items-center"
                    >
                      <div>
                         <p className="font-semibold text-gray-900">{task.title || 'No Title'}</p>
                         <p className="text-sm text-gray-600">{task.description}</p>
                         {task.dueDate && <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>}
                      </div>
                       <div className="flex items-center space-x-2">
                          <button onClick={() => handleTaskClick(task)} className="text-gray-500 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDeleteTask(task.id)} className="text-gray-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                           </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* In Progress Column */}
              <div 
                className="bg-blue-100 rounded-lg p-4 shadow-inner"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'in-progress')}
              >
                <h2 className="text-xl font-semibold text-blue-800 mb-4">In Progress ({tasksInProgress.length})</h2>
                <div className="space-y-3">
                   {tasksInProgress.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, task.status)}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-grab flex justify-between items-center"
                    >
                       <div>
                         <p className="font-semibold text-gray-900">{task.title || 'No Title'}</p>
                         <p className="text-sm text-gray-600">{task.description}</p>
                         {task.dueDate && <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>}
                      </div>
                       <div className="flex items-center space-x-2">
                          <button onClick={() => handleTaskClick(task)} className="text-gray-500 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDeleteTask(task.id)} className="text-gray-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                           </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Done Column */}
              <div 
                className="bg-green-100 rounded-lg p-4 shadow-inner"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'done')}
              >
                <h2 className="text-xl font-semibold text-green-800 mb-4">Done ({tasksDone.length})</h2>
                 <div className="space-y-3">
                   {tasksDone.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, task.status)}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-grab flex justify-between items-center"
                    >
                       <div>
                         <p className="font-semibold text-gray-900">{task.title || 'No Title'}</p>
                         <p className="text-sm text-gray-600">{task.description}</p>
                         {task.dueDate && <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>}
                      </div>
                       <div className="flex items-center space-x-2">
                           <button onClick={() => handleTaskClick(task)} className="text-gray-500 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDeleteTask(task.id)} className="text-gray-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                           </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

            </div> {/* End Task Columns */}

          </div> {/* End max-w-7xl mx-auto */}
        </main>
      </div> {/* End Main Content Area Wrapper */}

      {/* Task Details Modal */}
      {showDetailsModal && selectedTaskDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={selectedTaskDetails.title || ''}
                  onChange={handleDetailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={selectedTaskDetails.description}
                  onChange={handleDetailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={selectedTaskDetails.status}
                  onChange={handleDetailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={selectedTaskDetails.dueDate || ''}
                  onChange={handleDetailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={selectedTaskDetails.notes || ''}
                  onChange={handleDetailChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedTaskDetails(null); // Clear selected task
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDetails}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tasks;

