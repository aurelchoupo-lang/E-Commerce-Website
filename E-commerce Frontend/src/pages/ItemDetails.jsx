import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getItemById, deleteItem, getCurrentUserEmail, getCurrentUserObj, addToWishlist, getWishlist, removeFromWishlist, getSellerRating } from '../services/api';
import { formatPrice, formatDate, getConditionBadge, getCategoryPlaceholderImage, calculateEcoImpact, sanitizeInput, isValidEmail } from '../utils/helpers';
import Modal from '../components/Modal';
import RatingDisplay from '../components/RatingDisplay';
import { useLanguage } from '../context/LanguageContext';

function ItemDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [wishlistEntries, setWishlistEntries] = useState([]);
  const [sellerRating, setSellerRating] = useState(null);
  const [ecoImpact, setEcoImpact] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const data = await getItemById(id);
      setItem(data);
      const user = getCurrentUserObj();
      if (user && user.role === 'buyer') {
        const list = await getWishlist();
        setWishlistEntries(list);
      }
      const rating = await getSellerRating(data.seller_email);
      setSellerRating(rating);
      const impact = calculateEcoImpact(data.category, data.price);
      setEcoImpact(impact);
    } catch (error) {
      console.error('Error loading item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteItem(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(t('common.error'));
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
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

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <i className="fas fa-exclamation-circle text-6xl text-red-600 dark:text-red-400 mb-4"></i>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('common.error')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t('common.error')}</p>
        <Link to="/" className="btn-primary">
          <i className="fas fa-home mr-2"></i>{t('nav.home')}
        </Link>
      </div>
    );
  }

  const isOwner = item.seller_email === getCurrentUserEmail();
  const userObj = getCurrentUserObj();
  const isBuyer = userObj && userObj.role === 'buyer';
  const wishlistEntry = isBuyer && wishlistEntries.find(e => e.product === parseInt(item.id));
  const inWishlist = !!wishlistEntry;

  const toggleWishlist = async () => {
    if (!userObj) return;
    try {
      if (inWishlist) {
        await removeFromWishlist(wishlistEntry.id);
        setWishlistEntries(wishlistEntries.filter(e => e.id !== wishlistEntry.id));
      } else {
        const newEntry = await addToWishlist(item.id);
        setWishlistEntries([...wishlistEntries, newEntry]);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  useEffect(() => {
    if (contactOpen && userObj) {
      setContactForm(prev => ({
        ...prev,
        name: userObj.name || '',
        email: userObj.email || ''
      }));
    }
  }, [contactOpen, userObj]);

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError(t('common.error'));
      return;
    }
    if (!isValidEmail(contactForm.email)) {
      setContactError(t('auth.invalid_email'));
      return;
    }
    const subject = `Interested in: ${item.title}`;
    const body = `Hi ${item.seller_name || 'Seller'},

I'm interested in your listing: "${item.title}"

${contactForm.message}

Best regards,
${contactForm.name}
${contactForm.email}

Item Details:
- Price: ${formatPrice(item.price)}
- Condition: ${item.condition}
- Location: ${item.location}
- Description: ${item.description}`;

    window.location.href = `mailto:${item.seller_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setContactOpen(false);
    setContactForm({ name: '', email: '', message: '' });
    setContactError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-primary-600 hover:underline">{t('nav.home')}</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-300">{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <img
                src={item.image_url || getCategoryPlaceholderImage(item.category)}
                alt={item.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = getCategoryPlaceholderImage(item.category);
                }}
              />
            </div>
          </div>

          <div>
            {sellerRating && (
              <div className="mb-6">
                <RatingDisplay seller={sellerRating} showEcoImpact={false} />
              </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">{sanitizeInput(item.title)}</h1>
              
              <div className="flex items-center space-x-3 mb-6">
                <span className={`badge ${getConditionBadge(item.condition)}`}>
                  {item.condition}
                </span>
                <span className="badge badge-info">{item.category}</span>
              </div>

              <div className="text-4xl font-bold text-primary-600 mb-6">
                {formatPrice(item.price)}
              </div>

              <div className="border-t border-b py-4 mb-6 space-y-3">
                <div className="flex items-center text-gray-700 dark:text-gray-200">
                  <i className="fas fa-map-marker-alt w-6"></i>
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-200">
                  <i className="fas fa-calendar w-6"></i>
                  <span>{t('item.posted_on')} {formatDate(item.created_at)}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-200">
                  <i className="fas fa-user w-6"></i>
                  <span>{t('item.seller')}: {item.seller_name}</span>
                </div>
                {item.quantity && (
                  <div className="flex items-center text-gray-700 dark:text-gray-200">
                    <i className="fas fa-boxes w-6"></i>
                    <span>{t('item.form.quantity')}: {item.quantity}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">{t('item.description')}</h2>
                <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{sanitizeInput(item.description)}</p>
              </div>

              {(ecoImpact || item.co2_footprint) && isBuyer && (
                <div className="mb-6 bg-green-50 dark:bg-gray-800 dark:bg-green-900/20 border border-green-200 rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <i className="fas fa-leaf text-green-600 dark:text-green-400"></i>{t('item.eco_impact')}
                  </h2>
                  <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
                      <p className="font-bold text-green-600 dark:text-green-400">{item.co2_footprint || ecoImpact.co2Saved} kg</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">CO₂</p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
                      <p className="font-bold text-green-600 dark:text-green-400">{item.reparability_score || '8.0'}/10</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">{t('item.reparability')}</p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
                      <p className="font-bold text-emerald-600">{item.origin || 'Local'}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">{t('item.origin')}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {isOwner ? (
                  <>
                    <Link
                      to={`/edit-item/${item.id}`}
                      className="btn-primary w-full text-center block"
                    >
                      <i className="fas fa-edit mr-2"></i>{t('item.edit')}
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="btn-danger w-full"
                    >
                      <i className="fas fa-trash mr-2"></i>{t('item.delete')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setContactOpen(true)}
                      className="btn-primary w-full"
                    >
                      <i className="fas fa-envelope mr-2"></i>{t('item.contact_seller')}
                    </button>
                    {isBuyer && (
                      <button
                        onClick={toggleWishlist}
                        className="btn-secondary w-full mt-2"
                      >
                        <i className={`fas fa-${inWishlist ? 'heart-broken' : 'heart'} mr-2`}></i>
                        {inWishlist ? t('item.remove_wishlist') : t('item.add_wishlist')}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
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
            onClick={() => setShowDeleteModal(false)}
            className="btn-secondary flex-1"
          >
            {t('common.cancel')}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        title={`${t('item.contact_seller')} - ${item.title}`}
      >
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t('auth.username')} *
            </label>
            <input
              type="text"
              name="name"
              value={contactForm.name}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              name="email"
              value={contactForm.email}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t('item.message') || 'Message'} *
            </label>
            <textarea
              name="message"
              value={contactForm.message}
              onChange={handleContactChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="..."
              required
            />
          </div>

          {contactError && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              <i className="fas fa-exclamation-circle mr-1"></i>
              {contactError}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              <i className="fas fa-paper-plane mr-2"></i>{t('footer.form.submit')}
            </button>
            <button
              type="button"
              onClick={() => setContactOpen(false)}
              className="btn-secondary flex-1"
            >
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ItemDetails;
