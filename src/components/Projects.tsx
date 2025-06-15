import React, { useState, useEffect } from 'react';
// Removed unused Navbar import
// import Navbar from './Navbar';
import { Dispatch, SetStateAction } from 'react';
import {
  Home, ChevronRight, Bell, Star, MoreVertical, Plus, Search, Filter, Edit, Trash2, Eye, Code
} from 'lucide-react'; // Changed to lucide-react
import { Link } from 'react-router-dom'; // Import Link for navigation

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'done';
  tags: string[];
  deadline?: string;
  notes?: string;
}

interface ProjectsProps {
  userName: string;
  sidebarExpanded: boolean;
  setSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}

const Projects: React.FC<ProjectsProps> = ({
  userName,
  sidebarExpanded,
  setSidebarExpanded,
}) => {
  // State to hold the projects, initialized from local storage
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for edit modal visibility
  const [editingProject, setEditingProject] = useState<Project | null>(null); // State to hold project being edited
  const [showViewModal, setShowViewModal] = useState(false); // State for view modal visibility
  const [viewingProject, setViewingProject] = useState<Project | null>(null); // State to hold project being viewed
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    status: 'planning',
    tags: [],
    deadline: '',
    notes: '',
  });

  // Effect to save projects to local storage whenever the projects state changes
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = () => {
    if (newProject.name) {
      setProjects([...projects, { ...newProject, id: Date.now().toString() } as Project]);
      setShowAddModal(false);
      setNewProject({
        name: '',
        description: '',
        status: 'planning',
        tags: [],
        deadline: '',
        notes: '',
      });
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  // Function to handle clicking the edit button
  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  // Function to handle saving the edited project
  const handleSaveEdit = () => {
    if (editingProject) {
      setProjects(projects.map(project => 
        project.id === editingProject.id ? editingProject : project
      ));
      setShowEditModal(false);
      setEditingProject(null);
    }
  };

  // Function to handle clicking the view button
  const handleViewClick = (project: Project) => {
    setViewingProject(project);
    setShowViewModal(true);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.notes?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    // The content should be wrapped in a single element, typically a div or fragment,
    // to be rendered inside MainLayout.
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
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
                <Code className="w-4 h-4 text-indigo-500" />
                Projects
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              {/* View mode toggle or other project-specific controls can go here */}
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

      {/* Projects Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="relative flex-1 maxw-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects, descriptions, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-500 shadow-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Projects List */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects yet. Get started by creating your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <div className="flex space-x-2">
                      <button 
                         onClick={() => handleViewClick(project)}
                         className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => handleEditClick(project)}
                         className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  {project.notes && (
                     <p className="text-gray-600 text-sm mb-4">Notes: {project.notes}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-sm ${
                      project.status === 'done' ? 'bg-green-100 text-green-800' :
                      project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                    {project.deadline && (
                       <span className="text-sm text-gray-600">Deadline: {project.deadline}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-indigo-600" />
              Add New Project
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g., Website Redesign, Mobile App MVP"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Brief description of the project"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors h-24 resize-y"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value as Project['status'] })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., frontend, backend, UI/UX"
                  value={newProject.tags ? newProject.tags.join(', ') : ''}
                  onChange={(e) => setNewProject({ ...newProject, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline (Optional)</label>
                <input
                  type="date"
                  value={newProject.deadline || ''}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  placeholder="Any additional notes or details"
                  value={newProject.notes || ''}
                  onChange={(e) => setNewProject({ ...newProject, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors h-24 resize-y"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Edit className="w-6 h-6 text-indigo-600" />
              Edit Project
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors h-24 resize-y"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editingProject.status}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as Project['status'] })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editingProject.tags ? editingProject.tags.join(', ') : ''}
                  onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline (Optional)</label>
                <input
                  type="date"
                  value={editingProject.deadline || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, deadline: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={editingProject.notes || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors h-24 resize-y"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProject(null);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Project Modal */}
      {showViewModal && viewingProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-indigo-600" />
              Project Details
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-500">Project Name</p>
                <p className="text-lg font-semibold text-gray-900">{viewingProject.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p>{viewingProject.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  viewingProject.status === 'done' ? 'bg-green-100 text-green-800' :
                  viewingProject.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {viewingProject.status.charAt(0).toUpperCase() + viewingProject.status.slice(1)}
                </span>
              </div>
              {viewingProject.tags && viewingProject.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {viewingProject.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {viewingProject.deadline && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Deadline</p>
                  <p>{viewingProject.deadline}</p>
                </div>
              )}
              {viewingProject.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p>{viewingProject.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-8">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewingProject(null);
                }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
