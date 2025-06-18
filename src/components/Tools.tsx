import React, { useState, useEffect } from 'react';
import { Home, ChevronRight, Bell, Star, MoreVertical, Plus, Search, Trash2, ExternalLink, Grid, List, Filter, Sparkles, Globe, XCircle } from 'lucide-react';

interface Tool {
  id: string;
  title: string;
  url: string;
  color: string;
  description?: string;
  category?: string;
  favicon?: string;
}

interface ToolsProps {
  userName?: string;
  sidebarExpanded?: boolean;
  setSidebarExpanded?: (expanded: boolean) => void;
}

const generateRandomColor = () => {
  const colors = [
    'from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-green-500 to-green-600', 
    'from-red-500 to-red-600', 'from-yellow-500 to-yellow-600', 'from-indigo-500 to-indigo-600', 
    'from-pink-500 to-pink-600', 'from-teal-500 to-teal-600', 'from-orange-500 to-orange-600', 
    'from-cyan-500 to-cyan-600', 'from-emerald-500 to-emerald-600', 'from-violet-500 to-violet-600'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Tools: React.FC<ToolsProps> = ({
  userName = "Reiniel Talplacido",
  sidebarExpanded = true,
  setSidebarExpanded = () => {},
}) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [newToolUrl, setNewToolUrl] = useState('');
  const [newToolTitle, setNewToolTitle] = useState('');
  const [newToolDescription, setNewToolDescription] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('Development');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>(['Development', 'Design', 'Productivity', 'Analytics', 'Communication', 'Other']);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load tools and categories from local storage on component mount
  useEffect(() => {
    const storedTools = localStorage.getItem('devhub_tools');
    if (storedTools) {
      setTools(JSON.parse(storedTools));
    }
    const storedCategories = localStorage.getItem('devhub_categories');
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      setCustomCategories(parsedCategories);
      // Set newToolCategory to the first loaded category if available, otherwise 'Development'
      setNewToolCategory(parsedCategories.length > 0 ? parsedCategories[0] : 'Development');
    } else {
      // If no stored categories, ensure newToolCategory is initialized correctly
      setNewToolCategory(customCategories.length > 0 ? customCategories[0] : 'Development');
    }
  }, []);

  // Save tools to local storage whenever tools state changes
  useEffect(() => {
    localStorage.setItem('devhub_tools', JSON.stringify(tools));
  }, [tools]);

  // Save custom categories to local storage whenever customCategories state changes
  useEffect(() => {
    localStorage.setItem('devhub_categories', JSON.stringify(customCategories));
    // Ensure newToolCategory remains valid if customCategories change
    if (customCategories.length > 0 && !customCategories.includes(newToolCategory)) {
      setNewToolCategory(customCategories[0]);
    } else if (customCategories.length === 0 && newToolCategory !== 'Development') {
      setNewToolCategory('Development');
    }
  }, [customCategories, newToolCategory]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTool = () => {
    if (newToolUrl.trim() && newToolTitle.trim()) {
      const newTool: Tool = {
        id: Date.now().toString(),
        title: newToolTitle.trim(),
        url: newToolUrl.startsWith('http') ? newToolUrl.trim() : `https://${newToolUrl.trim()}`,
        color: generateRandomColor(),
        description: newToolDescription.trim() || 'No description provided',
        category: newToolCategory,
      };
      setTools(prev => [...prev, newTool]);
      setNewToolUrl('');
      setNewToolTitle('');
      setNewToolDescription('');
      // Reset to the first custom category or 'Development' if no custom categories exist
      setNewToolCategory(customCategories.length > 0 ? customCategories[0] : 'Development');
      setShowAddForm(false);
    }
  };

  const handleDeleteTool = (id: string) => {
    setTools(prev => prev.filter(tool => tool.id !== id));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !customCategories.includes(newCategoryName.trim())) {
      setCustomCategories(prev => [...prev, newCategoryName.trim()]);
      setNewCategoryName('');
      setShowAddCategoryInput(false);
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCustomCategories(prev => prev.filter(cat => cat !== categoryToDelete));
    setTools(prevTools => prevTools.map(tool => 
      tool.category === categoryToDelete ? { ...tool, category: 'Other' } : tool
    ));
    if (selectedCategory === categoryToDelete) {
      setSelectedCategory('All');
    }
    // If the deleted category was the currently selected new tool category, revert to default
    if (newToolCategory === categoryToDelete) {
      setNewToolCategory(customCategories.length > 0 ? customCategories[0] : 'Development');
    }
  };

  const allCategories = ['All', ...customCategories];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tool.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
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
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Tools
              </span>
            </div>
          </div>
          {/* Grid/List Toggle and Time */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono text-gray-700">{currentTime.toLocaleTimeString()}</div>
              <div className="text-xs text-gray-500">{currentTime.toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-auto">
        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tools, descriptions, or URLs..."
                className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Tool
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <span key={category} className="relative group">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                      : 'bg-white/70 text-gray-600 border border-gray-200/50 hover:bg-white hover:text-gray-800'
                  }`}
                >
                  {category}
                </button>
                {category !== 'All' && customCategories.includes(category) && (
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Delete category"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {!showAddCategoryInput && (
              <button
                onClick={() => setShowAddCategoryInput(true)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/70 text-gray-600 border border-gray-200/50 hover:bg-white hover:text-gray-800"
              >
                + Add Category
              </button>
            )}
            {showAddCategoryInput && (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder="New category name"
                  className="px-3 py-2 rounded-full text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddCategoryInput(false);
                    setNewCategoryName('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tools Display */}
        <div className="max-w-7xl mx-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200/50 hover:border-indigo-200"
                >
                  <button
                    onClick={() => handleDeleteTool(tool.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 hover:scale-110"
                    title="Delete Tool"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tool.color} flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg`}>
                    {tool.title.charAt(0).toUpperCase()}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {tool.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded-full">{tool.category}</span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {getDomainFromUrl(tool.url)}
                    </span>
                  </div>
                  
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    Open Tool
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200/50 hover:border-indigo-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center text-white text-lg font-bold shadow-md`}>
                        {tool.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">{tool.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded-full">{tool.category}</span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {getDomainFromUrl(tool.url)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        Open
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteTool(tool.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Delete Tool"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters, or add a new tool.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add Your First Tool
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Tool Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-indigo-600" />
              Add New Tool
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tool Name</label>
                <input
                  type="text"
                  placeholder="e.g., Figma, GitHub, Notion"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  value={newToolTitle}
                  onChange={(e) => setNewToolTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="text"
                  placeholder="e.g., figma.com, github.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  value={newToolUrl}
                  onChange={(e) => setNewToolUrl(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="Brief description of the tool"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  value={newToolDescription}
                  onChange={(e) => setNewToolDescription(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  value={newToolCategory}
                  onChange={(e) => setNewToolCategory(e.target.value)}
                >
                  {customCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTool}
                disabled={!newToolTitle.trim() || !newToolUrl.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Tool
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tools;