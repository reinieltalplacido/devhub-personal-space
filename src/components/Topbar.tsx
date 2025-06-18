import React from 'react';
import { Search, Bell, Star, MoreVertical } from 'lucide-react';

interface TopbarProps {
  onSearch: (value: string) => void;
}

const Topbar: React.FC<TopbarProps> = ({ onSearch }) => {
  return (
    <div className="w-full flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
      {/* Search */}
      <div className="flex items-center w-1/3 min-w-[250px]">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search workspace..."
            className="w-full bg-gray-50 text-gray-900 pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm rounded-xl"
            onChange={e => onSearch(e.target.value)}
          />
        </div>
      </div>
      {/* Icons */}
      <div className="flex items-center space-x-6">
        <button onClick={() => alert('Notifications clicked')} className="hover:text-blue-600 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button onClick={() => alert('Favorites clicked')} className="hover:text-blue-600 transition-colors">
          <Star className="w-5 h-5" />
        </button>
        <button onClick={() => alert('More options clicked')} className="hover:text-blue-600 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Topbar; 