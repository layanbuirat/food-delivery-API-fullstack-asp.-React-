import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RestaurantCard = ({ restaurant, viewMode = 'grid' }) => {
  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    if (rating >= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to={`/restaurants/${restaurant.id}`}>
          <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="flex">
              {/* Restaurant Image */}
              <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden">
                <img
                  src={restaurant.imageUrl || `https://source.unsplash.com/featured/300x300/?restaurant,food,${restaurant.cuisineType}`}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Restaurant Info */}
              <div className="ml-6 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center ${getRatingColor(restaurant.rating)}`}>
                        <FiStar className="mr-1" />
                        {formatRating(restaurant.rating)}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-gray-600">{restaurant.cuisineType}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    Open
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {restaurant.description || 'Delicious food served with love.'}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiMapPin className="mr-1" />
                    <span>2.5 km away</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    <span>30-40 min</span>
                  </div>
                  <div className="text-gray-900 font-semibold">
                    $ • $$
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid View (default)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/restaurants/${restaurant.id}`}>
        <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          {/* Restaurant Image */}
          <div className="relative h-48 rounded-lg overflow-hidden mb-4">
            <img
              src={restaurant.imageUrl || `https://source.unsplash.com/featured/400x300/?restaurant,food,${restaurant.cuisineType}`}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold shadow-sm">
                {restaurant.cuisineType}
              </span>
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-black/60 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                <FiStar className="inline mr-1" />
                {formatRating(restaurant.rating)}
              </span>
            </div>
          </div>

          {/* Restaurant Info */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {restaurant.name}
              </h3>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                Open
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {restaurant.description || 'Delicious food served with love.'}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <FiMapPin className="mr-1" />
                <span>2.5 km</span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-1" />
                <span>30-40 min</span>
              </div>
              <span className="font-semibold">$ • $$</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="mt-4 w-full btn-primary">
            View Menu
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;