import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUserAsync } from '../services/api';
import { isValidEmail } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

function Register() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError(t('auth.register.error_all'));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t('auth.register.error_email'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('auth.register.error_match'));
      return;
    }

    setError('');
    registerUserAsync({ name: name.trim(), email: email.trim(), password: password.trim(), role })
      .then(() => {
        window.dispatchEvent(new Event('storage'));
        navigate('/');
      })
      .catch((err) => setError(err.message || t('auth.register.failed')));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('auth.register.title')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t('auth.register.subtitle')}</p>
          <p className="text-sm mt-2">
            {t('auth.register.has_account')} <a href="/login" className="text-primary-600 hover:underline">{t('auth.register.login')}</a>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-gray-800 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">{t('auth.register.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('auth.register.placeholder_name')}
                className="input-field"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">{t('auth.register.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.register.placeholder_email')}
                className="input-field"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">{t('auth.register.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.register.placeholder_password')}
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">{t('auth.register.confirm_password')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.register.placeholder_confirm')}
                className="input-field"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">{t('auth.register.account_type')}</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="role" value="buyer" checked={role === 'buyer'} onChange={() => setRole('buyer')} />
                  <span className="text-gray-700 dark:text-gray-200">{t('auth.register.buyer')}</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="role" value="seller" checked={role === 'seller'} onChange={() => setRole('seller')} />
                  <span className="text-gray-700 dark:text-gray-200">{t('auth.register.seller')}</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">{t('auth.register.submit')}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
