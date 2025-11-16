import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/contexts/authContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);

  const isAdmin = currentUser?.role.includes('Admin');
  const isFoster = currentUser?.role.includes('Foster') && !currentUser?.role.includes('Super Foster');
  const isSuperFoster = currentUser?.role.includes('Super Foster');
  const isInterviewer = currentUser?.role.includes('Interviewer');
  const isAdopter = currentUser?.role.includes('Adopter') && !isAdmin && !isFoster && !isSuperFoster && !isInterviewer;
  
  // Determine if user is internal staff
  const isInternalStaff = isAdmin || isFoster || isSuperFoster || isInterviewer;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to={isInternalStaff ? "/dashboard" : "/"} className="flex items-center">
              <img 
                src="https://lf-code-agent.coze.cn/obj/x-ai-cn/298572746754/attachment/logo_20251115040913.png" 
                alt="Save Fur Pets" 
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Conditional rendering based on user type */}
          {isInternalStaff ? (
            // Internal Staff Navigation
            <nav className="hidden md:flex items-center space-x-8">
              {/* Common Internal Navigation */}
              <Link 
                to="/dashboard" 
                className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
              >
                Dashboard
              </Link>
              
              {/* Role-specific Navigation */}
              {isInterviewer || isAdmin ? (
                <>
                  <Link 
                    to="/applications/manage" 
                    className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
                  >
                    Manage Applications
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="#" 
                      className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
                    >
                      Assign Interviewers
                    </Link>
                  )}
                </>
              ) : null}
              
              {(isFoster || isSuperFoster || isAdmin) && (
                <Link 
                  to="/animals/manage" 
                  className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
                >
                  Manage Animals
                </Link>
              )}
              
                {isAdmin && (
                 <Link 
                   to="/users/manage" 
                   className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
                 >
                   Manage Users
                 </Link>
               )}
                {isAdmin && (
                  <Link 
                    to="/interviewers/assign" 
                    className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
                  >
                    Assign Interviewers
                  </Link>
                )}
              
              {/* User profile and logout */}
              <div className="relative group">
                <button className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors">
                  <i className="fa-solid fa-user-circle mr-2"></i>
                  {currentUser.name}
                  <i className="fa-solid fa-chevron-down ml-2 text-xs"></i>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-2 z-50 hidden group-hover:block">
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Edit Profile
                  </Link>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <i className="fa-solid fa-sign-out-alt mr-1"></i> Logout
                  </button>
                </div>
              </div>
              
              {/* Theme toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <i className="fa-solid fa-moon"></i>
                ) : (
                  <i className="fa-solid fa-sun"></i>
                )}
              </button>
            </nav>
          ) : (
            // Public Navigation
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/adoptables" 
                className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
              >
                Adoptables
              </Link>
              <Link 
                to="/adopted" 
                className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
              >
                Success Stories
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors"
              >
                About Us
              </Link>
              
              {/* Login or user profile */}
              {currentUser?.isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium transition-colors">
                    <i className="fa-solid fa-user-circle mr-2"></i>
                    {currentUser.name}
                    <i className="fa-solid fa-chevron-down ml-2 text-xs"></i>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-2 z-50 hidden group-hover:block">
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Edit Profile
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <i className="fa-solid fa-sign-out-alt mr-1"></i> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="bg-[#4C51A4] hover:bg-[#383C80] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <i className="fa-solid fa-user mr-2"></i>Login
                </Link>
              )}
              
              {/* Theme toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <i className="fa-solid fa-moon"></i>
                ) : (
                  <i className="fa-solid fa-sun"></i>
                )}
              </button>
            </nav>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <i className="fa-solid fa-moon"></i>
              ) : (
                <i className="fa-solid fa-sun"></i>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Open menu"
            >
              {isMenuOpen ? (
                <i className="fa-solid fa-xmark"></i>
              ) : (
                <i className="fa-solid fa-bars"></i>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 slide-up">
            <nav className="flex flex-col space-y-3">
              {isInternalStaff ? (
                // Internal Staff Mobile Navigation
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fa-solid fa-tachometer-alt mr-2"></i>Dashboard
                  </Link>
                  
                  {isInterviewer || isAdmin ? (
                    <>
                      <Link 
                        to="/applications/manage" 
                        className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="fa-solid fa-file-alt mr-2"></i>Manage Applications
                      </Link>
                      {isAdmin && (
                        <Link 
                          to="#" 
                          className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <i className="fa-solid fa-users-slash mr-2"></i>Assign Interviewers
                        </Link>
                      )}
                    </>
                  ) : null}
                  
                  {(isFoster || isSuperFoster || isAdmin) && (
                  <Link 
                    to="/animals/manage" 
                    className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fa-solid fa-pets mr-2"></i>Manage Animals
                  </Link>
                  )}
                  
                {isAdmin && (
                 <Link 
                   to="/users/manage" 
                   className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   <i className="fa-solid fa-users-cog mr-2"></i>Manage Users
                 </Link>
               )}
               {isAdmin && (
                 <Link 
                   to="/interviewers/assign" 
                   className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   <i className="fa-solid fa-user-tie mr-2"></i>Assign Interviewers
                 </Link>
               )}
              {isAdmin && (
                <Link 
                  to="/interviewers/assign" 
                  className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fa-solid fa-user-tie mr-2"></i>Assign Interviewers
                </Link>
              )}
                  
                  <Link 
                    to="/profile" 
                    className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fa-solid fa-user-edit mr-2"></i>Edit Profile
                  </Link>
                  
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    <i className="fa-solid fa-sign-out-alt mr-2"></i>Logout
                  </button>
                </>
              ) : (
                // Public Mobile Navigation
                <>
                  <Link 
                    to="/" 
                    className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fa-solid fa-home mr-2"></i>Home
                  </Link>
                  <Link 
                    to="/adoptables" 
                    className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fa-solid fa-paw mr-2"></i>Adoptables
                  </Link>
                  <Link 
                    to="/adopted" 
                    className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fa-solid fa-heart mr-2"></i>Success Stories
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fa-solid fa-info-circle mr-2"></i>About Us
                  </Link>
                  
                  {currentUser?.isAuthenticated ? (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="fa-solid fa-tachometer-alt mr-2"></i>Dashboard
                      </Link>
                      
                      <Link 
                        to="/profile" 
                        className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-light font-medium py-2 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <i className="fa-solid fa-user-edit mr-2"></i>Edit Profile
                      </Link>
                      
                      <button 
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                      >
                        <i className="fa-solid fa-sign-out-alt mr-2"></i>Logout
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/login"
                      className="bg-[#4C51A4] hover:bg-[#383C80] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className="fa-solid fa-user mr-2"></i>Login
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}