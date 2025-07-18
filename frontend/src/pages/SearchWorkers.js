import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { workersApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  User, 
  Phone,
  Heart,
  ChevronDown,
  X
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const SearchWorkers = () => {
  const { user, isAuthenticated, isUser } = useAuth();
  const [filters, setFilters] = useState({
    service: '',
    city: '',
    sortBy: 'rating',
    minRating: '',
    maxRate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const serviceOptions = [
    { value: '', label: 'All Services' },
    { value: 'plumber', label: 'Plumber', icon: '🔧' },
    { value: 'electrician', label: 'Electrician', icon: '⚡' },
    { value: 'maid', label: 'Maid', icon: '🧽' },
    { value: 'gardener', label: 'Gardener', icon: '🌱' },
    { value: 'carpenter', label: 'Carpenter', icon: '🔨' },
    { value: 'painter', label: 'Painter', icon: '🎨' },
    { value: 'cook', label: 'Cook', icon: '👨‍🍳' },
    { value: 'driver', label: 'Driver', icon: '🚗' },
    { value: 'cleaner', label: 'Cleaner', icon: '🧹' },
    { value: 'mechanic', label: 'Mechanic', icon: '🔧' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'rate_low', label: 'Price: Low to High' },
    { value: 'rate_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest Members' }
  ];

  // Fetch workers with filters
  const { data: workersData, isLoading, error, refetch } = useQuery(
    ['workers', filters],
    () => workersApi.getWorkers({
      ...filters,
      search: searchQuery
    }),
    {
      keepPreviousData: true,
      staleTime: 30000 // 30 seconds
    }
  );

  const workers = workersData?.data?.workers || [];
  const totalWorkers = workersData?.data?.total || 0;

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      service: '',
      city: '',
      sortBy: 'rating',
      minRating: '',
      maxRate: ''
    });
    setSearchQuery('');
  };

  // Handle search
  const handleSearch = () => {
    refetch();
  };

  // Save/unsave worker (for authenticated users)
  const handleSaveWorker = async (workerId) => {
    if (!isAuthenticated || !isUser) {
      toast.error('Please login as a customer to save workers');
      return;
    }

    try {
      // This would call the save worker API
      toast.success('Worker saved to favorites!');
    } catch (error) {
      toast.error('Failed to save worker');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Workers</h1>
              <p className="mt-2 text-gray-600">
                {totalWorkers} skilled workers available in your area
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="mt-4 md:mt-0 flex-1 max-w-md md:ml-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, service, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input-field pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <select
                    value={filters.service}
                    onChange={(e) => handleFilterChange('service', e.target.value)}
                    className="input-field"
                  >
                    {serviceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.icon && `${option.icon} `}{option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter city name"
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="input-field"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="5">5 Stars Only</option>
                  </select>
                </div>

                {/* Max Hourly Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Hourly Rate (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 500"
                    value={filters.maxRate}
                    onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                    className="input-field"
                  />
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full btn-outline text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Workers List */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading workers..." />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">Failed to load workers. Please try again.</p>
                <button
                  onClick={refetch}
                  className="mt-4 btn-primary"
                >
                  Retry
                </button>
              </div>
            ) : workers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No workers found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search in a different area
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {workers.map((worker) => (
                  <WorkerCard
                    key={worker._id}
                    worker={worker}
                    onSave={handleSaveWorker}
                    isAuthenticated={isAuthenticated}
                    isUser={isUser}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Worker Card Component
const WorkerCard = ({ worker, onSave, isAuthenticated, isUser }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(worker._id);
    setIsSaved(!isSaved);
  };

  const getServiceIcon = (service) => {
    const icons = {
      plumber: '🔧',
      electrician: '⚡',
      maid: '🧽',
      gardener: '🌱',
      carpenter: '🔨',
      painter: '🎨',
      cook: '👨‍🍳',
      driver: '🚗',
      cleaner: '🧹',
      mechanic: '🔧'
    };
    return icons[service] || '👷';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow duration-200">
      {/* Worker Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full p-3">
              <User className="h-8 w-8 text-gray-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">
                  {worker.rating?.average?.toFixed(1) || '0.0'} ({worker.rating?.count || 0} reviews)
                </span>
              </div>
            </div>
          </div>
          
          {isAuthenticated && isUser && (
            <button
              onClick={handleSave}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isSaved 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Services */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-1">
            {worker.services?.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize"
              >
                <span className="mr-1">{getServiceIcon(service)}</span>
                {service}
              </span>
            ))}
            {worker.services?.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{worker.services.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{worker.experience} years experience</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>₹{worker.hourlyRate}/hour</span>
          </div>
          
          {worker.address?.city && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{worker.address.city}</span>
            </div>
          )}
          
          {worker.isVerified && (
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Verified Worker</span>
            </div>
          )}
        </div>

        {/* Description */}
        {worker.description && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {worker.description}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
        <Link
          to={`/worker/${worker._id}`}
          className="flex-1 btn-outline text-center"
        >
          View Profile
        </Link>
        
        {isAuthenticated && isUser ? (
          <Link
            to={`/book/${worker._id}`}
            className="flex-1 btn-primary text-center"
          >
            Book Now
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex-1 btn-primary text-center"
          >
            Login to Book
          </Link>
        )}
      </div>
    </div>
  );
};

export default SearchWorkers;