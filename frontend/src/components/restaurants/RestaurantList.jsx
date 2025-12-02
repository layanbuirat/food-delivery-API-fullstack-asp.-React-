import React, { useState, useEffect } from 'react';
import RestaurantCard from './RestaurantCard';
import { restaurantService } from '../../services/restaurantService';
import { FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterAndSortRestaurants();
  }, [searchTerm, cuisineFilter, ratingFilter, sortBy, restaurants]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getAll();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (err) {
      setError('Failed to load restaurants. Please try again.');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRestaurants = () => {
    let filtered = [...restaurants];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisineType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Cuisine filter
    if (cuisineFilter !== 'all') {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisineType === cuisineFilter
      );
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(restaurant =>
        restaurant.rating >= minRating
      );
    }

    // Sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming we have a createdAt field
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredRestaurants(filtered);
  };

  const getCuisineTypes = () => {
    const cuisines = restaurants
      .map(r => r.cuisineType)
      .filter((value, index, self) => value && self.indexOf(value) === index);
    return ['all', ...cuisines];
  };

  if (loading) return <LoadingSpinner message="Loading restaurants..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchRestaurants} />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Restaurants</h1>
        <p className="text-gray-600">
          Find your favorite food from top-rated restaurants
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Cuisine Filter */}
          <select
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Cuisines</option>
            {getCuisineTypes().slice(1).map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {filteredRestaurants.length} of {restaurants.length} restaurants
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}
            >
              <FiList size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Grid/List */}
      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-12">
          <FiSearch size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No restaurants found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-6'
        }>
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;