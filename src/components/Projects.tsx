import React, { useState, useEffect } from 'react';
// Removed unused Navbar import
// import Navbar from './Navbar';
import { Dispatch, SetStateAction } from 'react';
import { Home, ChevronRight, Bell, Star, MoreVertical, Plus, Search, Filter, Edit, Trash2, Eye } from '@geist-ui/icons'; // Add icon imports
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
    <>
      {/* Main Content Area */}
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
                <span className="text-sm font-semibold text-gray-900">Projects</span>
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

        {/* Projects Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with Actions */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value as Project['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Planned Deadline</label>
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newProject.notes}
                  onChange={(e) => setNewProject({ ...newProject, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingProject.status}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as Project['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Planned Deadline</label>
                <input
                  type="date"
                  value={editingProject.deadline}
                  onChange={(e) => setEditingProject({ ...editingProject, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editingProject.notes}
                  onChange={(e) => setEditingProject({ ...editingProject, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProject(null); // Clear editing project on cancel
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Project Modal */}
      {showViewModal && viewingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-500">Project Name:</p>
                <p className="text-lg font-semibold">{viewingProject.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description:</p>
                <p>{viewingProject.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status:</p>
                <p>{viewingProject.status.charAt(0).toUpperCase() + viewingProject.status.slice(1)}</p>
              </div>
              {viewingProject.deadline && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Planned Deadline:</p>
                  <p>{viewingProject.deadline}</p>
                </div>
              )}
              {viewingProject.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes:</p>
                  <p>{viewingProject.notes}</p>
                </div>
              )}
               {viewingProject.tags && viewingProject.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Tags:</p>
                   <div className="flex flex-wrap gap-2 mt-1">
                     {viewingProject.tags.map((tag, index) => (
                       <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                         {tag}
                       </span>
                     ))}
                   </div>
                </div>
               )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewingProject(null); // Clear viewing project on close
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
