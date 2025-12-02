import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiUsers,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiBarChart2,
  FiSettings,
  FiBell
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have a dedicated dashboard endpoint
      const [users, restaurants, orders] = await Promise.all([
        adminService.getUsers(),
        adminService.getRestaurants(),
        adminService.getOrders()
      ]);

      setStats({
        totalUsers: users.length,
        totalRestaurants: restaurants.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        pendingOrders: orders.filter(order => order.status === 'Pending').length,
        activeUsers: users.filter(u => u.lastLogin).length // Simplified
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FiUsers className="text-blue-600" size={24} />,
      color: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'Total Restaurants',
      value: stats.totalRestaurants,
      icon: <FiShoppingBag className="text-green-600" size={24} />,
      color: 'bg-green-50',
      change: '+5%'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <FiPackage className="text-purple-600" size={24} />,
      color: 'bg-purple-50',
      change: '+23%'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: <FiDollarSign className="text-yellow-600" size={24} />,
      color: 'bg-yellow-50',
      change: '+18%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <FiBell size={20} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Recent Orders */}
            <div className="card mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700">
                  View All
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer?.username || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/admin/users"
                  className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <FiUsers className="text-blue-600 mb-3" size={32} />
                  <span className="font-medium text-gray-900">Manage Users</span>
                </Link>
                <Link
                  to="/admin/restaurants"
                  className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <FiShoppingBag className="text-green-600 mb-3" size={32} />
                  <span className="font-medium text-gray-900">Manage Restaurants</span>
                </Link>
                <Link
                  to="/admin/orders"
                  className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                >
                  <FiPackage className="text-purple-600 mb-3" size={32} />
                  <span className="font-medium text-gray-900">Manage Orders</span>
                </Link>
                <Link
                  to="/admin/analytics"
                  className="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors"
                >
                  <FiBarChart2 className="text-yellow-600 mb-3" size={32} />
                  <span className="font-medium text-gray-900">Analytics</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* System Status */}
            <div className="card mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Server Uptime</span>
                    <span className="text-sm font-medium">99.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">API Response</span>
                    <span className="text-sm font-medium">98ms avg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="text-sm font-medium">Healthy</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Activities</h3>
                <FiBell className="text-gray-600" />
              </div>
              <div className="space-y-4">
                {[
                  { text: 'New user registered', time: '2 min ago', type: 'user' },
                  { text: 'Order #1234 placed', time: '5 min ago', type: 'order' },
                  { text: 'Restaurant "Pizza Palace" added', time: '1 hour ago', type: 'restaurant' },
                  { text: 'System backup completed', time: '2 hours ago', type: 'system' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'order' ? 'bg-green-500' :
                      activity.type === 'restaurant' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;