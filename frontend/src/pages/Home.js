import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Users, Calendar, Shield, Star, Phone } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const services = [
    { name: 'Plumber', icon: '🔧', description: 'Fix pipes, faucets, and water systems' },
    { name: 'Electrician', icon: '⚡', description: 'Electrical repairs and installations' },
    { name: 'Maid', icon: '🧽', description: 'House cleaning and maintenance' },
    { name: 'Gardener', icon: '🌱', description: 'Garden care and landscaping' },
    { name: 'Carpenter', icon: '🔨', description: 'Wood work and furniture repair' },
    { name: 'Painter', icon: '🎨', description: 'Wall painting and home decoration' },
    { name: 'Cook', icon: '👨‍🍳', description: 'Meal preparation and cooking services' },
    { name: 'Driver', icon: '🚗', description: 'Transportation and delivery services' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Easy Search',
      description: 'Find skilled workers in your area quickly and easily'
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Book services based on mutual availability'
    },
    {
      icon: Shield,
      title: 'Verified Workers',
      description: 'All workers are background checked and verified'
    },
    {
      icon: Star,
      title: 'Rated & Reviewed',
      description: 'See ratings and reviews from other customers'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Connect with Local
              <span className="block text-yellow-300">Daily Wage Workers</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Find reliable, skilled workers for your daily needs. 
              From plumbing to cleaning, we connect you with verified professionals in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-yellow-400 text-blue-900 font-semibold px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors duration-200 text-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/search"
                    className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200 text-lg"
                  >
                    Find Workers
                  </Link>
                </>
              ) : (
                <Link
                  to="/search"
                  className="bg-yellow-400 text-blue-900 font-semibold px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors duration-200 text-lg"
                >
                  Find Workers Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Services Available
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find skilled workers for all your daily needs
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 hover:bg-primary-50"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DailyWageConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to find and hire local workers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* For Workers Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-secondary-600 to-secondary-800 rounded-2xl p-8 md:p-12 text-center">
            <Users className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Are you a skilled worker?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join our platform to get direct access to customers, set your own schedule, 
              and build a reputation in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-secondary-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
              >
                Join as Worker
              </Link>
              <a
                href="tel:+91-8000000000"
                className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-secondary-600 transition-colors duration-200 text-lg flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get your work done
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search & Select</h3>
              <p className="text-gray-600">
                Browse available workers in your area and check their profiles, ratings, and availability.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Book & Schedule</h3>
              <p className="text-gray-600">
                Send a booking request with your requirements and preferred time slot.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Work Done</h3>
              <p className="text-gray-600">
                The worker arrives at your scheduled time and completes the work professionally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;