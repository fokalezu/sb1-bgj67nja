import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, LogIn, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('name, is_admin')
            .eq('user_id', user.id)
            .single();
          
          if (!error && data) {
            setUserName(data.name);
            setIsAdmin(data.is_admin || false);
          } else {
            // If no profile exists yet, just use the email as fallback
            setUserName(user.email?.split('@')[0] || 'Utilizator');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Use email as fallback
          setUserName(user.email?.split('@')[0] || 'Utilizator');
        }
      } else {
        setUserName(null);
        setIsAdmin(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="text-purple-600 font-bold text-xl flex items-center gap-2"
              >
                <Home className="h-6 w-6" />
                <span>Dating CMS</span>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive('/dashboard') 
                    ? 'border-purple-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Dashboard
              </Link>
              {user && (
                <Link
                  to="/profile"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive('/profile')
                      ? 'border-purple-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Profil
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive('/admin')
                      ? 'border-purple-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            {!user ? (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Conectare
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-900">
                  <User className="h-4 w-4 inline mr-2" />
                  {userName}
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Deconectare
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/dashboard"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/dashboard')
                ? 'bg-purple-50 border-purple-500 text-purple-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          {user && (
            <Link
              to="/profile"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/profile')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Profil
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/admin')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Shield className="h-5 w-5 inline mr-2" />
              Admin
            </Link>
          )}
          {user ? (
            <>
              <div className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500">
                <User className="h-5 w-5 inline mr-2" />
                {userName}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="h-5 w-5 inline mr-2" />
                Deconectare
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/login')
                  ? 'bg-purple-50 border-purple-500 text-purple-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="h-5 w-5 inline mr-2" />
              Conectare
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;