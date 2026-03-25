import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getItems, getCurrentUserEmail, isLoggedIn, deleteItem, getCurrentUserObj, getWishlist } from '../services/api';
import ItemCard from '../components/ItemCard';
import Modal from '../components/Modal';
import { useLanguage } from '../context/LanguageContext';

function MyListings() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    const user = getCurrentUserObj();
    if (user && user.role === 'buyer') {
      loadWishlist();
    } else {
      loadMyItems();
    }
  }, []);

  const loadMyItems = async () => {
    try {
      setLoading(true);
      const userEmail = getCurrentUserEmail();
      const data = await getItems(1, 100, { seller_email: userEmail });
      setItems(data.data || []);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const wishlistEntries = await getWishlist();
      const wishlistItems = wishlistEntries.map(entry => ({
        ...entry.product_details,
        wishlistEntryId: entry.id // Store this for deletion
      }));
      setItems(wishlistItems);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (itemId) => {
    setSelectedItemId(itemId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItemId) return;
    try {
      setDeleting(true);
      await deleteItem(selectedItemId);
      setItems(items.filter(item => item.id !== selectedItemId));
      setDeleteModalOpen(false);
      setSelectedItemId(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(t('common.error'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-600"></i>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
      </div>
    );
  }

  const isBuyer = getCurrentUserObj()?.role === 'buyer';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            <i className="fas fa-list mr-3"></i>
            {isBuyer ? t('nav.wishlist') : t('nav.my_listings')}
          </h1>
          {!isBuyer && (
            <Link to="/add-item" className="btn-primary">
              <i className="fas fa-plus-circle mr-2"></i>{t('footer.sell_item')}
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {isBuyer ? t('common.error') : t('common.error')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {isBuyer
                ? t('nav.wishlist')
                : t('footer.about_text')}
            </p>
            {!isBuyer && (
              <Link to="/add-item" className="btn-primary">
                <i className="fas fa-plus-circle mr-2"></i>{t('footer.sell_item')}
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600 dark:text-gray-300">
              <i className="fas fa-box mr-2"></i>
              {items.length} {t('admin.dashboard.active_listings')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="relative">
                  <ItemCard item={item} />
                  {!isBuyer && (
                    <div className="absolute top-2 left-2 right-2 flex gap-2 opacity-0 hover:opacity-100 transition-opacity">
                      <Link
                        to={`/edit-item/${item.id}`}
                        className="flex-1 btn-primary text-sm font-medium"
                      >
                        <i className="fas fa-edit mr-1"></i>{t('item.edit')}
                      </Link>
                      <button
                        onClick={() => openDeleteModal(item.id)}
                        className="flex-1 btn-danger font-medium"
                      >
                        <i className="fas fa-trash mr-1"></i>{t('item.delete')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t('item.delete')}
      >
        <p className="text-gray-700 dark:text-gray-200 mb-6">
          {t('common.confirm_delete')}
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-danger flex-1"
          >
            {deleting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>{t('common.loading')}
              </>
            ) : (
              <>
                <i className="fas fa-trash mr-2"></i>{t('common.delete')}
              </>
            )}
          </button>
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="btn-secondary flex-1"
          >
            {t('common.cancel')}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default MyListings;