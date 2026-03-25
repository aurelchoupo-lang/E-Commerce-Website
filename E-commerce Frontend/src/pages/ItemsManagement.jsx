import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserObj, getAllItems, deleteItemAdmin } from '../services/api';
import Modal from '../components/Modal';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/helpers';

function ItemsManagement() {
  const { t } = useLanguage();
  const user = getCurrentUserObj();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadItems();
  }, [user, navigate]);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, categoryFilter]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const allItems = await getAllItems();
      setItems(allItems);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(i =>
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.seller_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(i => i.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      await deleteItemAdmin(selectedItem.id);
      setItems(items.filter(i => i.id !== selectedItem.id));
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(t('common.error') || 'Failed to delete item');
    }
  };

  const getCategories = () => {
    const cats = [...new Set(items.map(i => i.category))];
    return cats.sort();
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-600"></i>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                <i className="fas fa-box mr-3 text-primary-600"></i>{t('admin.items.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">{t('admin.items.subtitle')}</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="btn-secondary"
            >
              <i className="fas fa-arrow-left mr-2"></i>{t('common.back')}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {t('admin.items.search')}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('common.search')}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                {t('admin.items.filter_category')}
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">{t('home.filters.all') || 'All Categories'}</option>
                {getCategories().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {t('admin.items.title')} ({filteredItems.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.items.table_item')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.items.table_price')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.items.table_seller')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.items.table_listed')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-lg object-cover" src={item.image_url || item.image} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-semibold">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.seller_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/item/${item.id}`)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-900"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="px-6 py-12 text-center">
              <i className="fas fa-box-open text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t('home.no_items')}</h3>
              <p className="text-gray-500 dark:text-gray-400">{t('home.no_items_sub')}</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('admin.items.modal_delete_title')}
      >
        <div className="space-y-4">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-red-600 dark:text-red-400 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('admin.items.modal_delete_title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('admin.items.delete_confirm')}
            </p>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-left">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{selectedItem?.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{selectedItem?.seller_email}</p>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleDeleteItem}
              className="flex-1 btn-danger"
            >
              <i className="fas fa-trash mr-2"></i>{t('common.delete')}
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

export default ItemsManagement;
