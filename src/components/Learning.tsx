import React, { useState, useEffect, useRef } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Home, ChevronRight, Bell, Star, MoreVertical, Plus, Trash2, Edit, X } from '@geist-ui/icons';
import { Link } from 'react-router-dom';

// Define the interface for an entry within a subject
interface Entry {
  id: string;
  name: string;
  date?: string; // Example field
  status?: string; // Example field
  // Add other fields as needed (e.g., type, notes)
}

interface Subject {
  id: string;
  name: string;
  notes?: string;
  entries: Entry[]; // Add an array of entries to the Subject interface
}

interface LearningProps {
  userName: string;
  sidebarExpanded: boolean;
  setSidebarExpanded: Dispatch<SetStateAction<boolean>>; // Include if sidebar state is managed here
}

// Define the default notes structure
const defaultNotesStructure = `Objectives\n- \nMaterials\n- \nActivities\n- `;

const Learning: React.FC<LearningProps> = ({
  userName,
  sidebarExpanded,
  setSidebarExpanded,
}) => {
  // State to hold the subjects, initialized from local storage
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const savedSubjects = localStorage.getItem('learningSubjects');
    return savedSubjects ? JSON.parse(savedSubjects) : [];
  });
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [newEntryName, setNewEntryName] = useState(''); // State for new entry input

  // Ref for the side panel to detect clicks outside
  const sidePanelRef = useRef<HTMLDivElement>(null);

  // Ref for the notes textarea to auto-adjust height
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Effect to save subjects to local storage whenever the subjects state changes
  useEffect(() => {
    localStorage.setItem('learningSubjects', JSON.stringify(subjects));
  }, [subjects]);

  // Effect to handle clicks outside the side panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidePanelRef.current && !sidePanelRef.current.contains(event.target as Node)) {
        handleCloseSidePanel();
      }
    };

    if (showSidePanel) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSidePanel, sidePanelRef]); // Depend on showSidePanel and sidePanelRef

  // Effect to auto-adjust notes textarea height
  useEffect(() => {
    if (notesTextareaRef.current) {
      // Reset height to auto to calculate the correct scrollHeight
      notesTextareaRef.current.style.height = 'auto';
      // Set height to scrollHeight
      notesTextareaRef.current.style.height = `${notesTextareaRef.current.scrollHeight}px`;
    }
  }, [selectedSubject?.notes]); // Depend on notes content

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      const newSubject: Subject = {
        id: Date.now().toString(),
        name: newSubjectName.trim(),
        notes: defaultNotesStructure, // Initialize with default structure
        entries: [], // Initialize entries array for a new subject
      };
      setSubjects([...subjects, newSubject]);
      setNewSubjectName('');
    }
  };

  // Function to handle deleting a subject
  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter(subject => subject.id !== subjectId));
    // Close the side panel if the deleted subject is currently open
    if (selectedSubject?.id === subjectId) {
        handleCloseSidePanel();
    }
  };

  // Function to handle clicking the edit button (opens the edit modal - for subject name)
  const handleEditClick = (subject: Subject) => {
    setEditingSubject(subject);
    setShowEditModal(true);
  };

  // Function to handle changes in the subject edit modal
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEditingSubject(prevState => prevState ? { ...prevState, name: value } : null);
  };

  // Function to handle saving the edited subject name from the edit modal
  const handleSaveEdit = () => {
    if (editingSubject) {
      setSubjects(subjects.map(subject => 
        subject.id === editingSubject.id ? editingSubject : subject
      ));
      setShowEditModal(false);
      // Update selected subject in side panel if it's the one being edited
      if (selectedSubject?.id === editingSubject.id) {
          setSelectedSubject(editingSubject);
      }
      setEditingSubject(null);
    }
  };

  // Function to handle clicking a subject card to open the side panel
  const handleSubjectClick = (subject: Subject) => {
    console.log('Subject card clicked:', subject.name); // Log at the start
    setSelectedSubject(subject);
    setShowSidePanel(true);
    console.log('showSidePanel after click:', true); // Log after state update
    console.log('selectedSubject after click:', subject); // Log after state update
  };

  // Function to handle closing the side panel
  const handleCloseSidePanel = () => {
    setShowSidePanel(false);
    setSelectedSubject(null); // Clear selected subject
  };

   // Function to handle changes in the side panel (for subject name and notes)
  const handleSidePanelSubjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setSelectedSubject(prevState => {
          if (!prevState) return null;
          const updatedSubject = { ...prevState, [name]: value };
          // Update the main subjects list immediately as changes are made in the side panel
          setSubjects(prevSubjects => prevSubjects.map(subject => 
              subject.id === updatedSubject.id ? updatedSubject : subject
          ));
          return updatedSubject; // Return the updated subject to keep the side panel state in sync
      });
  };

  // Function to handle adding a new entry to the selected subject
  const handleAddEntry = () => {
      if (newEntryName.trim() && selectedSubject) {
          const newEntry: Entry = {
              id: Date.now().toString(),
              name: newEntryName.trim(),
              // Initialize other entry fields here if needed
          };
          const updatedSubject = { 
              ...selectedSubject, 
              entries: [...selectedSubject.entries, newEntry] 
          };
          setSubjects(subjects.map(subject => 
              subject.id === selectedSubject.id ? updatedSubject : subject
          ));
          setSelectedSubject(updatedSubject); // Update the selected subject state as well
          setNewEntryName(''); // Clear the new entry input
      }
  };

  // Function to handle deleting an entry from the selected subject
  const handleDeleteEntry = (entryId: string) => {
      if (selectedSubject) {
          const updatedSubject = {
              ...selectedSubject,
              entries: selectedSubject.entries.filter(entry => entry.id !== entryId)
          };
          setSubjects(subjects.map(subject => 
              subject.id === selectedSubject.id ? updatedSubject : subject
          ));
          setSelectedSubject(updatedSubject); // Update the selected subject state as well
      }
  };

  return (
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
                <span className="text-sm font-semibold text-gray-900">Learning</span>
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

        {/* Learning Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
           <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Learning Subjects</h1>

             {/* Add New Subject */}
            <div className="flex mb-6">
              <input
                type="text"
                placeholder="Add a new subject..."
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSubject();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddSubject}
                className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" /> Add Subject
              </button>
            </div>

             {/* Subjects List */}
             <div className="space-y-3">
               {subjects.length === 0 ? (
                  <p className="text-gray-500">No subjects added yet. Add your first subject above!</p>
               ) : (
                  subjects.map(subject => (
                     <div 
                        key={subject.id}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleSubjectClick(subject)}
                     >
                       <span className="text-gray-900 font-semibold">{subject.name}</span>
                       <div className="flex items-center space-x-2">
                          <button onClick={(e) => { e.stopPropagation(); handleEditClick(subject); }} className="text-gray-500 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); handleDeleteSubject(subject.id); }} className="text-gray-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                           </button>
                       </div>
                     </div>
                  ))
               )}
             </div>

           </div>
        </main>
      </div>

      {/* Edit Subject Name Modal - Still used for quick name edits if needed, or can be removed */}
      {showEditModal && editingSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Subject Name</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingSubject.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSubject(null);
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

      {/* Side Panel for Subject Details */}
      <div
        ref={sidePanelRef}
        className={`fixed top-0 right-0 w-96 bg-white h-full w-1/3 shadow-xl transform transition-transform duration-300 ease-in-out ${showSidePanel ? 'translate-x-0' : 'translate-x-full'} z-50 flex flex-col`}
      >
        {selectedSubject && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Side Panel Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 truncate">{selectedSubject.name}</h2>
              <button onClick={handleCloseSidePanel} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side Panel Content - Details & Entries */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Subject Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                  <input
                    type="text"
                    name="name"
                    value={selectedSubject.name}
                    onChange={handleSidePanelSubjectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    ref={notesTextareaRef}
                    value={selectedSubject.notes || defaultNotesStructure}
                    onChange={handleSidePanelSubjectChange}
                    className="w-full text-gray-800 focus:outline-none bg-transparent resize-none"
                    style={{ overflow: 'hidden' }}
                  ></textarea>
                </div>
              </div>

              {/* Entries Section */}
              <div>
                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Entries</h3>

                 {/* Entries List */}
                 <div className="space-y-2">
                     {selectedSubject.entries?.length === 0 ? (
                          <p className="text-gray-500 text-sm">No entries added yet.</p>
                     ) : (
                          selectedSubject.entries?.map(entry => (
                              <div key={entry.id} className="flex items-center group">
                                  <span className="text-gray-800 text-sm before:content-['-'] before:mr-2">{entry.name}</span>
                                   <button onClick={() => handleDeleteEntry(entry.id)} className="ml-auto text-gray-400 hover:text-red-600 transition-opacity opacity-0 group-hover:opacity-100">
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          ))
                     )}

                    {/* Inline Add New Entry */}
                    <div className="flex items-center space-x-2 group">
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600 cursor-pointer" onClick={handleAddEntry} /> {/* Add button */}
                         <input
                            type="text"
                            placeholder="Add a new entry..."
                            value={newEntryName}
                            onChange={(e) => setNewEntryName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddEntry();
                              }
                            }}
                            className="flex-1 text-sm text-gray-800 border-b border-gray-200 focus:outline-none focus:border-blue-500 bg-transparent"
                         />
                    </div>
                 </div>
              </div>

            </div>

            {/* Side Panel Footer (Optional) */}
            {/* <div className="p-6 border-t border-gray-200"></div> */}

          </div>
        )}
      </div>

      {/* Backdrop for side panel */}
      {showSidePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={handleCloseSidePanel}></div>
      )}
    </>
  );
};

export default Learning; 