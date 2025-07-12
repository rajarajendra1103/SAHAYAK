import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-inter">
              SAHAYAK
            </span>
          </Link>

          {/* Profile Section */}
          <div className="flex items-center space-x-3">
            {/* Current Date/Time - Click to go to Calendar */}
            <Link
              to="/calendar"
              className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all duration-200 border border-blue-200"
            >
              <div className="text-center">
                <div className="text-sm font-bold text-blue-700">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs text-blue-600">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </Link>
            
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src="https://images.pexels.com/photos/3771539/pexels-photo-3771539.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors w-full text-left">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;