import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Header />
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;