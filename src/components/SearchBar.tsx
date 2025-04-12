
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
      <Search className="text-gray-500 mr-2" size={20} />
      <input
        type="text"
        placeholder="Search your thoughts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className="w-full outline-none text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
