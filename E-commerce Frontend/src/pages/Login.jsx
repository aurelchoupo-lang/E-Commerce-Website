import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUserAsync } from '../services/api';
import { isValidEmail } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

function Login() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError(t('auth.login.error_email'));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t('auth.login.error_valid_email'));
      return;
    }
    if (!password.trim()) {
      setError(t('auth.login.error_password'));
      return;
    }

    try {
      await authenticateUserAsync({ email: email.trim(), password: password.trim() });
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err) {
      setError(err.message || t('auth.login.failed'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <i className="fas fa-user-circle text-6xl text-primary-600 mb-4"></i>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('auth.login.title')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t('auth.login.subtitle')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-gray-800 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}
            <p className="text-sm text-center mb-4">
              {t('auth.login.no_account')} <a href="/register" className="text-primary-600 hover:underline">{t('auth.login.register')}</a>
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                <i className="fas fa-envelope mr-2"></i>{t('auth.login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.login.placeholder_email')}
                className="input-field"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                <i className="fas fa-lock mr-2"></i>{t('auth.login.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.login.placeholder_password')}
                className="input-field"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              <i className="fas fa-sign-in-alt mr-2"></i>{t('auth.login.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
