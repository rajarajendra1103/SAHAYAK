import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PenTool, BookOpen, Settings } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/media-search', icon: Search, label: 'Media Search' },
    { path: '/digital-board', icon: PenTool, label: 'Digital Board' },
    { path: '/saved-content', icon: BookOpen, label: 'Saved Content' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 py-3 z-40 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const isMainAction = item.path === '/digital-board';

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              } ${isMainAction ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg' : ''}`}
            >
              <Icon className={`w-5 h-5 ${isMainAction && !isActive ? 'text-white' : ''}`} />
              <span className={`text-xs font-medium ${isMainAction && !isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;