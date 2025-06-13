import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, ChevronRight, Bell, Star, MoreVertical, Save, Trash2,
  Bold, Italic, Underline, List, Link as LinkIcon, Code, Quote, 
  Heading, Plus, Search, Calendar, Tag, Eye, EyeOff, Maximize2,
  Minimize2, Clock, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isFavorite: boolean;
}

interface NotesProps {
  userName?: string;
  sidebarExpanded?: boolean;
  setSidebarExpanded?: (expanded: boolean) => void;
}

const Notes: React.FC<NotesProps> = ({ 
  userName = "Reiniel Talplacido", 
  sidebarExpanded = true, 
  setSidebarExpanded = () => {} 
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load notes from local storage on component mount
  useEffect(() => {
    const storedNotes = localStorage.getItem('devhub_notes');
    if (storedNotes) {
      const parsedNotes: Note[] = JSON.parse(storedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        setActiveNoteId(parsedNotes[0].id);
      }
    } else {
      // Create a default note if no notes are found in local storage
      createNewNote();
    }
  }, []);

  // Save notes to local storage whenever notes state changes
  useEffect(() => {
    localStorage.setItem('devhub_notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(note => note.id === activeNoteId);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeNote) return;
    
    setNotes(prev => prev.map(note => 
      note.id === activeNoteId 
        ? { ...note, content: e.target.value, updatedAt: new Date() }
        : note
    ));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeNote) return;
    
    setNotes(prev => prev.map(note => 
      note.id === activeNoteId 
        ? { ...note, title: e.target.value, updatedAt: new Date() }
        : note
    ));
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      isFavorite: false
    };
    
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (activeNoteId === noteId) {
      const remainingNotes = notes.filter(note => note.id !== noteId);
      setActiveNoteId(remainingNotes[0]?.id || null);
    }
  };

  const toggleFavorite = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, isFavorite: !note.isFavorite }
        : note
    ));
  };

  const addTag = () => {
    if (!activeNote || !newTag.trim()) return;
    
    setNotes(prev => prev.map(note => 
      note.id === activeNoteId 
        ? { ...note, tags: [...note.tags, newTag.trim()] }
        : note
    ));
    
    setNewTag('');
    setShowTagInput(false);
  };

  const removeTag = (tagToRemove: string) => {
    if (!activeNote) return;
    
    setNotes(prev => prev.map(note => 
      note.id === activeNoteId 
        ? { ...note, tags: note.tags.filter(tag => tag !== tagToRemove) }
        : note
    ));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const applyFormatting = (format: string) => {
    if (!textareaRef.current || !activeNote) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = activeNote.content.substring(start, end);
    
    let prefix = '';
    let suffix = '';
    let newCursorPos = start;

    switch (format) {
      case 'bold':
        prefix = '**';
        suffix = '**';
        newCursorPos = start + prefix.length + selectedText.length;
        break;
      case 'italic':
        prefix = '*';
        suffix = '*';
        newCursorPos = start + prefix.length + selectedText.length;
        break;
      case 'underline':
        prefix = '__';
        suffix = '__';
        newCursorPos = start + prefix.length + selectedText.length;
        break;
      case 'code':
        prefix = '`';
        suffix = '`';
        newCursorPos = start + prefix.length + selectedText.length;
        break;
      case 'quote':
        prefix = '> ';
        newCursorPos = start + prefix.length + selectedText.length;
        break;
      case 'heading':
        prefix = '### ';
        newCursorPos = start + prefix.length + selectedText.length;
        break;
      case 'list':
        prefix = '- ';
        newCursorPos = start + prefix.length + selectedText.length;
        break;
      case 'link':
        prefix = '[' + selectedText + '](';
        suffix = ')';
        newCursorPos = start + prefix.length;
        break;
    }
    
    const newContent = activeNote.content.substring(0, start) + prefix + selectedText + suffix + activeNote.content.substring(end);
    
    setNotes(prev => prev.map(note => 
      note.id === activeNoteId 
        ? { ...note, content: newContent, updatedAt: new Date() }
        : note
    ));

    // Restore cursor position after state update
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [activeNote?.content]);

  if (!activeNote && notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Notes Yet</h2>
          <p className="text-gray-500 mb-6">Create your first note to get started</p>
          <button
            onClick={createNewNote}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create First Note
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`${isFullscreen ? 'hidden' : 'w-80'} bg-white border-r border-gray-200 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
            <button
              onClick={createNewNote}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-auto">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeNoteId === note.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate flex-1 mr-2">
                  {note.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(note.id);
                  }}
                  className={`p-1 rounded ${note.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                >
                  <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {note.content.substring(0, 100)}...
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(note.updatedAt)}
                </span>
                {note.tags.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {note.tags.length}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Workspace</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="text-sm font-semibold text-gray-900">Notes</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                title={isPreviewMode ? "Edit mode" : "Preview mode"}
              >
                {isPreviewMode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Editor */}
        {activeNote && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              {/* Title and Actions */}
              <div className="flex justify-between items-start mb-6">
                <input
                  type="text"
                  className="text-3xl font-bold text-gray-900 focus:outline-none flex-1 bg-transparent border-b-2 border-transparent focus:border-blue-500 pb-2"
                  value={activeNote.title}
                  onChange={handleTitleChange}
                  placeholder="Note title..."
                />
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleFavorite(activeNote.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      activeNote.isFavorite 
                        ? 'text-yellow-500 bg-yellow-50' 
                        : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${activeNote.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {activeNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {showTagInput ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addTag();
                          if (e.key === 'Escape') {
                            setShowTagInput(false);
                            setNewTag('');
                          }
                        }}
                        placeholder="Add tag..."
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={addTag}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowTagInput(true)}
                      className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      + Add tag
                    </button>
                  )}
                </div>
              </div>

              {/* Formatting Toolbar */}
              {!isPreviewMode && (
                <div className="border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50">
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      onClick={() => applyFormatting('bold')}
                      className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-gray-900 transition-colors"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => applyFormatting('italic')}
                      className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-gray-900 transition-colors"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => applyFormatting('underline')}
                      className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-gray-900 transition-colors"
                      title="Underline"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="border-l border-gray-300 h-6 mx-2"></div>
                    <button
                      onClick={() => applyFormatting('heading')}
                      className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-gray-900 transition-colors"
                      title="Heading"
                    >
                      <Heading className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => applyFormatting('list')}
                      className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-gray-900 transition-colors"
                      title="List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <div className="border-l border-gray-300 h-6 mx-2"></div>
                    <button
                      onClick={() => applyFormatting('link')}
                      className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-gray-900 transition-colors"
                      title="Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => applyFormatting('code')}
                      className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-gray-900 transition-colors"
                      title="Code"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => applyFormatting('quote')}
                      className="p-2 hover:bg-white rounded-md text-gray-600 hover:text-gray-900 transition-colors"
                      title="Quote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Content Area */}
              <div className="bg-white rounded-lg border border-gray-200 min-h-96">
                {isPreviewMode ? (
                  <div className="p-6 prose max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activeNote.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    className="w-full p-6 text-gray-800 focus:outline-none resize-none border-none rounded-lg min-h-96 leading-relaxed"
                    value={activeNote.content}
                    onChange={handleContentChange}
                    placeholder="Start writing your note..."
                  />
                )}
              </div>

              {/* Footer Info */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Created: {formatDate(activeNote.createdAt)}</span>
                  <span>Updated: {formatDate(activeNote.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{activeNote.content.length} characters</span>
                  <span>•</span>
                  <span>{activeNote.content.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;