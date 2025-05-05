
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  // Don't show navbar on login/register pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-college-purple">CollegeBuzz</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Button>
                </Link>
                
                <div className="flex items-center space-x-2 ml-4">
                  <div className="bg-college-light rounded-full p-1">
                    <User size={20} className="text-college-purple" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut size={18} />
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
