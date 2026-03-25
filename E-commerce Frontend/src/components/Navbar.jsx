import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isLoggedIn, logout, getCurrentUser, getCurrentUserObj } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

function Navbar() {
  const { t } = useLanguage();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('guest');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const updateLoginState = () => {
    setLoggedIn(isLoggedIn());
    setUsername(getCurrentUser());
    const obj = getCurrentUserObj();
    setUserRole(obj ? obj.role : 'guest');
  };

  useEffect(() => {
    updateLoginState();
    window.addEventListener('storage', updateLoginState);
    return () => window.removeEventListener('storage', updateLoginState);
  }, []);

  const handleLogout = () => {
    logout();
    updateLoginState();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <i className="fas fa-store text-primary-600 text-2xl"></i>
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('footer.about_title')}</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors">
              <i className="fas fa-home mr-2"></i>{t('nav.home')}
            </Link>
            {loggedIn ? (
              <>
                {(userRole === 'seller' || userRole === 'admin') && (
                  <Link to="/add-item" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors">
                    <i className="fas fa-plus-circle mr-2"></i>{t('nav.sell_item')}
                  </Link>
                )}
                {userRole === 'admin' && (
                  <Link to="/admin" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors">
                    <i className="fas fa-user-shield mr-2"></i>{t('nav.admin')}
                  </Link>
                )}
                <Link to="/settings" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors">
                  <i className="fas fa-cog mr-2"></i>{t('nav.settings')}
                </Link>
                <Link to="/my-listings" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors">
                  <i className="fas fa-list mr-2"></i>{t('nav.my_listings')}
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600 dark:text-gray-300">
                    <i className="fas fa-user mr-2"></i>{username}
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{t(`nav.role_${userRole}`) || userRole}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-danger"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>{t('nav.logout')}
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>{t('nav.login')}
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 dark:text-gray-200 text-2xl"
          >
            <i className={`fas fa-${mobileMenuOpen ? 'times' : 'bars'}`}></i>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors py-2"
              >
                <i className="fas fa-home mr-2"></i>{t('nav.home')}
              </Link>
              {loggedIn ? (
                  <>
                    {(userRole === 'seller' || userRole === 'admin') && (
                      <Link
                        to="/add-item"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors py-2"
                      >
                        <i className="fas fa-plus-circle mr-2"></i>{t('nav.sell_item')}
                      </Link>
                    )}
                    {userRole === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors py-2"
                    >
                      <i className="fas fa-user-shield mr-2"></i>{t('nav.admin')}
                    </Link>
                  )}
                  <Link
                    to="/my-listings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors py-2"
                  >
                    <i className="fas fa-list mr-2"></i>{t('nav.my_listings')}
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors py-2"
                  >
                    <i className="fas fa-cog mr-2"></i>{t('nav.settings')}
                  </Link>
                  <div className="border-t pt-3">
                    <p className="text-gray-600 dark:text-gray-300 py-2">
                      <i className="fas fa-user mr-2"></i>{username}
                    </p>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full btn-danger"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>{t('nav.logout')}
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-primary text-center block"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>{t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
