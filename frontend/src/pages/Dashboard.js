import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, DollarSign, Star, Users, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user, isWorker } = useAuth();

  if (isWorker) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Worker Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">₹{user?.totalEarnings || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.completedJobs || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.rating?.average?.toFixed(1) || '0.0'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-lg font-bold text-gray-900">
                    {user?.isVerified ? 'Verified' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Services</h2>
            <div className="flex flex-wrap gap-2">
              {user?.services?.map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 capitalize"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <Calendar className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Availability</h3>
              <p className="text-gray-600 mb-4">Set your working hours and available days</p>
              <button className="btn-primary w-full">Update Schedule</button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <Users className="h-12 w-12 text-secondary-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Bookings</h3>
              <p className="text-gray-600 mb-4">Check pending and upcoming bookings</p>
              <button className="btn-outline w-full">View All</button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <Star className="h-12 w-12 text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Settings</h3>
              <p className="text-gray-600 mb-4">Update your profile and services</p>
              <button className="btn-secondary w-full">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User Dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saved Workers</p>
                <p className="text-2xl font-bold text-gray-900">{user?.savedWorkers?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">₹0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <Users className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Workers</h3>
            <p className="text-gray-600 mb-4">Search and book skilled workers in your area</p>
            <button className="btn-primary w-full">Search Now</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Calendar className="h-12 w-12 text-secondary-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Bookings</h3>
            <p className="text-gray-600 mb-4">View and manage your service bookings</p>
            <button className="btn-outline w-full">View Bookings</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Star className="h-12 w-12 text-yellow-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Favorites</h3>
            <p className="text-gray-600 mb-4">Quick access to your saved workers</p>
            <button className="btn-secondary w-full">View Favorites</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400">Book your first service to see activity here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;