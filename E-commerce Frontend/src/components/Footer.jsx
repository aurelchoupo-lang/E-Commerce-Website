import React, { useState } from 'react';
import Modal from './Modal';
import { isValidEmail } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

function Footer() {
  const { t } = useLanguage();
  const [contactOpen, setContactOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError(t('common.error') || 'All fields are required');
      return;
    }
    if (!isValidEmail(form.email)) {
      setError(t('auth.invalid_email') || 'Please enter a valid email');
      return;
    }
    alert(t('common.save_success') || 'Thank you for reaching out! I will get back to you soon.');
    setContactOpen(false);
    setForm({ name: '', email: '', message: '' });
    setError('');
  };

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <i className="fas fa-store mr-2"></i>Marketplace
            </h3>
            <p className="text-gray-300">
              {t('footer.about_text')}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.quick_links')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fas fa-shopping-bag mr-2"></i>{t('footer.buy_item')}
                </a>
              </li>
              <li>
                <a href="/add-item" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fas fa-plus-circle mr-2"></i>{t('footer.sell_item')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.connect')}</h3>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
            <p className="text-gray-300 mt-4">
              <i className="fas fa-envelope mr-2"></i>
              support@marketplace.com
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Marketplace. {t('footer.rights')} <br/>
            <button
              onClick={() => setContactOpen(true)}
              className="text-sm font-semibold text-blue-400 hover:text-blue-200 transition-colors animate-pulse focus:outline-none"
            >
              Developed By Cypher Sentry
            </button>
          </p>
        </div>
      </div>

      <Modal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Contact Cypher Sentry"
      >
        <div className="bg-gradient-to-br from-blue-50 dark:from-gray-800 to-indigo-50 dark:to-gray-900 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
                <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                <i className="fas fa-user w-4 text-blue-600 dark:text-blue-400 mr-2"></i>{t('auth.username')}
              </label>
              <input
                type="text"
                name="name"
                placeholder="..."
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                <i className="fas fa-envelope w-4 text-blue-600 dark:text-blue-400 mr-2"></i>{t('auth.email')}
              </label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                <i className="fas fa-comment w-4 text-blue-600 dark:text-blue-400 mr-2"></i>Message
              </label>
              <textarea
                name="message"
                placeholder="..."
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition bg-white dark:bg-gray-800 resize-none"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-50 dark:from-gray-8000 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md"
              >
                <i className="fas fa-paper-plane"></i>
                {t('common.save')}
              </button>
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </footer>
  );
}

export default Footer;
