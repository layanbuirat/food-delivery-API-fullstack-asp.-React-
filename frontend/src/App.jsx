import React, { useState, useEffect } from 'react';
import { checkApiHealth, authService, restaurantService } from './services/api';

function App() {
  const [apiConnected, setApiConnected] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // التحقق من اتصال API عند التحميل
  useEffect(() => {
    checkConnection();
    loadRestaurants();
    loadUser();
  }, []);

  const checkConnection = async () => {
    const health = await checkApiHealth();
    setApiConnected(!!health);
    setLoading(false);
  };

  const loadRestaurants = async () => {
    try {
      const data = await restaurantService.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    }
  };

  const loadUser = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  };

  const handleLogin = async () => {
    try {
      // بيانات تجريبية للتسجيل أولاً
      await authService.register({
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
        role: 'Customer'
      });

      // ثم تسجيل الدخول
      const result = await authService.login({
        email: 'test@test.com',
        password: 'password123'
      });
      
      setUser(result.user);
      alert('Login successful!');
    } catch (error) {
      alert('Login failed: ' + error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    alert('Logged out');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className={`h-4 w-4 rounded-full ${apiConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xl font-bold text-gray-800">FoodDelivery</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {apiConnected ? (
                <span className="text-green-600 text-sm">API Connected ✓</span>
              ) : (
                <span className="text-red-600 text-sm">API Disconnected ✗</span>
              )}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Hello, {user.username}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Login/Register
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* API Status */}
        <div className={`p-4 rounded-lg mb-8 ${apiConnected ? 'bg-green-100' : 'bg-red-100'}`}>
          <h2 className={`text-lg font-semibold ${apiConnected ? 'text-green-800' : 'text-red-800'}`}>
            {apiConnected ? '✅ Backend API is Connected!' : '❌ Backend API is Not Connected'}
          </h2>
          <p className={`mt-2 ${apiConnected ? 'text-green-700' : 'text-red-700'}`}>
            {apiConnected 
              ? `Your React app is successfully connected to the ASP.NET API at http://localhost:5212`
              : 'Make sure your backend is running (dotnet run in backend folder)'
            }
          </p>
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-blue-50 p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold text-blue-800 mb-2">👤 User Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-700"><strong>Username:</strong> {user.username}</p>
                <p className="text-blue-700"><strong>Email:</strong> {user.email}</p>
                <p className="text-blue-700"><strong>Role:</strong> {user.role}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-700"><strong>ID:</strong> {user.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Restaurants Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🍽️ Restaurants from Backend</h2>
            <button 
              onClick={loadRestaurants}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Refresh
            </button>
          </div>

          {restaurants.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No restaurants found in the database</p>
              <button 
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Login to See Data
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-2">{restaurant.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {restaurant.cuisineType}
                    </span>
                    <span className="text-yellow-600 font-bold">⭐ {restaurant.rating || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Testing Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Registration */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-4">🔐 Test Authentication</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm text-blue-800">
                  <strong>POST /api/auth/register</strong><br />
                  Register a new user
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-sm text-green-800">
                  <strong>POST /api/auth/login</strong><br />
                  Login with credentials
                </p>
              </div>
            </div>
          </div>

          {/* Test Restaurants */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-4">🍽️ Test Restaurants API</h3>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded">
                <p className="text-sm text-purple-800">
                  <strong>GET /api/restaurants</strong><br />
                  Get all restaurants
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>GET /api/restaurants/{'{id}'}</strong><br />
                  Get restaurant by ID
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Food Delivery System</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div>
                <p className="text-gray-400">Frontend</p>
                <p className="text-gray-300">React + Tailwind CSS</p>
                <p className="text-gray-400 text-sm">Port: 3000</p>
              </div>
              <div>
                <p className="text-gray-400">Backend</p>
                <p className="text-gray-300">ASP.NET Core API</p>
                <p className="text-gray-400 text-sm">Port: 5212</p>
              </div>
              <div>
                <p className="text-gray-400">Database</p>
                <p className="text-gray-300">SQL Server / SQLite</p>
                <p className="text-gray-400 text-sm">Connected: {apiConnected ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;