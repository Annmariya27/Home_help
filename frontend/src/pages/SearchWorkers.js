import React from 'react';
import { Search } from 'lucide-react';

const SearchWorkers = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Search className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Workers</h1>
          <p className="text-gray-600">This page is under development. Full search functionality coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default SearchWorkers;