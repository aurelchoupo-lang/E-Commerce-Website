import { useState, useEffect } from 'react';
import { getCurrentUserObj, logout, updateUserProfile, changePassword, deleteAccount } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { isValidEmail, sanitizeInput } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

function Settings() {
  const { language, t, changeLanguage } = useLanguage();
  const { theme, changeTheme } = useTheme();
  const user = getCurrentUserObj();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    theme: theme,
    language: language,
    notifications: JSON.parse(localStorage.getItem('notifications') || 'true'),
    emailUpdates: JSON.parse(localStorage.getItem('emailUpdates') || 'true')
  });

  const [deleteForm, setDeleteForm] = useState({ password: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setPreferences(prev => ({ ...prev, language, theme }));
  }, [language, theme]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      showMessage('error', t('auth.error_all') || 'Name and email are required');
      return;
    }

    if (!isValidEmail(profileForm.email)) {
      showMessage('error', t('auth.invalid_email') || 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({
        name: sanitizeInput(profileForm.name.trim()),
        email: sanitizeInput(profileForm.email.trim())
      });
      showMessage('success', t('common.save_success') || 'Profile updated successfully!');
      setProfileForm({
        name: sanitizeInput(profileForm.name.trim()),
        email: sanitizeInput(profileForm.email.trim())
      });
    } catch (error) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showMessage('error', t('auth.error_all') || 'All password fields are required');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage('error', t('auth.password_min') || 'New password must be at least 6 characters long');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', t('auth.password_mismatch') || 'New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      showMessage('success', t('common.save_success') || 'Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = () => {
    localStorage.setItem('notifications', JSON.stringify(preferences.notifications));
    localStorage.setItem('emailUpdates', JSON.stringify(preferences.emailUpdates));
    changeLanguage(preferences.language);
    changeTheme(preferences.theme);
    showMessage('success', t('common.save_success') || 'Preferences updated successfully!');
  };

  const handleDeleteAccount = async () => {
    if (!deleteForm.password) {
      showMessage('error', t('auth.password') + ' ' + t('common.error'));
      return;
    }

    setLoading(true);
    try {
      await deleteAccount({ password: deleteForm.password });
      showMessage('success', t('common.save_success'));
      navigate('/');
    } catch (error) {
      showMessage('error', error.message);
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: t('settings.tabs.profile'), icon: 'fa-user' },
    { id: 'security', label: t('settings.tabs.security'), icon: 'fa-shield-alt' },
    { id: 'preferences', label: t('settings.tabs.preferences'), icon: 'fa-sliders-h' },
    { id: 'account', label: t('settings.tabs.account'), icon: 'fa-user-cog' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">
              <i className="fas fa-cog mr-3"></i>{t('settings.title')}
            </h1>
            <p className="text-primary-100">{t('settings.subtitle')}</p>
          </div>

          {message.text && (
            <div className={`mx-6 mt-4 p-4 rounded-md ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-gray-800 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200'
                : 'bg-red-50 dark:bg-gray-800 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200'
            }`}>
              <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
              {message.text}
            </div>
          )}

          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-gray-800 dark:bg-primary-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900'
                  }`}
                >
                  <i className={`fas ${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    <i className="fas fa-user mr-2 text-primary-600"></i>{t('settings.tabs.profile')}
                  </h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        {t('auth.username')} *
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="input-field"
                        placeholder="..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        {t('auth.email')} *
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="input-field"
                        placeholder="..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        {t('admin.users.table_role')}
                      </label>
                      <input
                        type="text"
                        value={user.role}
                        className="input-field bg-gray-50 dark:bg-gray-700"
                        disabled
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>{t('common.loading')}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>{t('common.save')}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    <i className="fas fa-shield-alt mr-2 text-primary-600"></i>{t('settings.tabs.security')}
                  </h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        {t('auth.password')} *
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="input-field"
                        placeholder="..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        {t('auth.new_password') || t('auth.password') + ' (New)'} *
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="input-field"
                        placeholder="..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        {t('auth.confirm_password')} *
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="input-field"
                        placeholder="..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>{t('common.loading')}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-key mr-2"></i>{t('common.save')}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    <i className="fas fa-sliders-h mr-2 text-primary-600"></i>{t('settings.preferences.title')}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        {t('settings.preferences.theme')}
                      </label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => {
                          const newTheme = e.target.value;
                          setPreferences({...preferences, theme: newTheme});
                          changeTheme(newTheme);
                        }}
                        className="input-field"
                      >
                        <option value="light">{t('settings.preferences.light') || 'Light'}</option>
                        <option value="dark">{t('settings.preferences.dark') || 'Dark'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        {t('settings.preferences.language')}
                      </label>
                      <select
                        value={preferences.language}
                        onChange={(e) => {
                          const newLang = e.target.value;
                          setPreferences({...preferences, language: newLang});
                          changeLanguage(newLang);
                        }}
                        className="input-field"
                      >
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.notifications}
                          onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-200">{t('settings.preferences.notifications')}</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.emailUpdates}
                          onChange={(e) => setPreferences({...preferences, emailUpdates: e.target.checked})}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-200">{t('settings.preferences.email_updates')}</span>
                      </label>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handlePreferencesUpdate}
                        className="btn-primary"
                      >
                        <i className="fas fa-save mr-2"></i>{t('settings.preferences.save')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    <i className="fas fa-user-cog mr-2 text-primary-600"></i>{t('settings.tabs.account')}
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-gray-800 dark:bg-blue-900/20 p-4 rounded-md">
                      <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                        <i className="fas fa-info-circle mr-2"></i>{t('settings.account_info')}
                      </h3>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>{t('admin.users.table_role')}:</strong> {t(`nav.role_${user.role}`) || user.role}</p>
                        <p><strong>{t('settings.tabs.member_since')}:</strong> {user.accountCreated ? new Date(user.accountCreated).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full btn-secondary"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>{t('nav.logout')}
                    </button>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
                        <i className="fas fa-exclamation-triangle mr-2"></i>{t('item.delete')}
                      </h3>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full btn-danger"
                      >
                        <i className="fas fa-trash mr-2"></i>{t('item.delete')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('item.delete')}
      >
        <div className="space-y-4">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-red-600 dark:text-red-400 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('item.delete')}</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
               {t('auth.password')} *
            </label>
            <input
              type="password"
              value={deleteForm.password}
              onChange={(e) => setDeleteForm({ password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="..."
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="flex-1 btn-danger"
            >
              {t('common.delete')}
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 btn-secondary"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;
