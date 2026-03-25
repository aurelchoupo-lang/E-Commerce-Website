import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getItemById, updateItem, getCategories, getDefaultCategories, isLoggedIn, getCurrentUserEmail, deleteItem } from '../services/api';
import { isValidUrl, sanitizeInput } from '../utils/helpers';
import Modal from '../components/Modal';
import { useLanguage } from '../context/LanguageContext';

function EditItem() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'Good',
    image_url: '',
    location: '',
    quantity: 1
  });
  const [errors, setErrors] = useState({});
  const [imageType, setImageType] = useState('url'); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setInitialLoading(true);
      const [item, cats] = await Promise.all([
        getItemById(id),
        getCategories().catch(() => getDefaultCategories())
      ]);
      
      if (item.seller_email !== getCurrentUserEmail()) {
        alert(t('common.error_ownership') || 'You can only edit your own listings');
        navigate('/');
        return;
      }
      
      setFormData({
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        condition: item.condition,
        image_url: item.image_url || '',
        location: item.location,
        quantity: item.quantity || 1
      });

      if (item.image_url) {
        if (item.image_url.startsWith('data:')) {
          setImageType('file');
          setImagePreview(item.image_url);
        } else {
          setImageType('url');
        }
      }

      setCategories(cats);
    } catch (error) {
      console.error('Error loading item:', error);
      alert(t('common.error_loading') || 'Failed to load item');
      navigate('/');
    } finally {
      setInitialLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = t('item.form.errors.title');
    if (!formData.description.trim()) newErrors.description = t('item.form.errors.desc');
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = t('item.form.errors.price');
    }
    if (!formData.location.trim()) newErrors.location = t('item.form.errors.location');

    if (imageType === 'url' && formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = t('item.form.errors.image_url');
    }

    if (imageType === 'file' && !selectedFile && !formData.image_url) {
      newErrors.image_url = t('item.form.errors.image_file');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const sanitizedData = {
        ...formData,
        title: sanitizeInput(formData.title),
        description: sanitizeInput(formData.description),
        location: sanitizeInput(formData.location)
      };
      await updateItem(id, sanitizedData);
      navigate('/my-listings');
    } catch (error) {
      console.error('Error updating item:', error);
      alert(t('item.form.errors.failed') || 'Failed to update listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteItem(id);
      navigate('/my-listings');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(t('common.error_delete') || 'Failed to delete item');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageTypeChange = (type) => {
    setImageType(type);
    setSelectedFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image_url: '' }));
    if (errors.image_url) {
      setErrors(prev => ({ ...prev, image_url: '' }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image_url: t('item.form.errors.image_file') }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image_url: 'Image size must be less than 5MB' }));
        return;
      }

      setSelectedFile(file);
      setErrors(prev => ({ ...prev, image_url: '' }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData(prev => ({ ...prev, image_url: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-600"></i>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            <i className="fas fa-edit mr-3"></i>{t('item.form.edit_title')}
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  {t('item.form.title')} <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  {t('item.description')} <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className={`textarea-field ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  {t('item.form.price')} <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                />
                {errors.price && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.price}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    {t('item.category')} <span className="text-red-600 dark:text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select-field"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    {t('item.condition')} <span className="text-red-600 dark:text-red-400">*</span>
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="select-field"
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  {t('item.location')} <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`input-field ${errors.location ? 'border-red-500' : ''}`}
                />
                {errors.location && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.location}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  {t('item.form.quantity')} <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="input-field"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-3">
                  {t('item.form.image')}
                </label>

                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="imageType"
                      value="url"
                      checked={imageType === 'url'}
                      onChange={() => handleImageTypeChange('url')}
                      className="mr-2"
                    />
                    <span className="text-sm">{t('item.form.image_url')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="imageType"
                      value="file"
                      checked={imageType === 'file'}
                      onChange={() => handleImageTypeChange('file')}
                      className="mr-2"
                    />
                    <span className="text-sm">{t('item.form.upload')}</span>
                  </label>
                </div>

                {imageType === 'url' && (
                  <div>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className={`input-field ${errors.image_url ? 'border-red-500' : ''}`}
                    />
                  </div>
                )}

                {imageType === 'file' && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className={`input-field ${errors.image_url ? 'border-red-500' : ''}`}
                    />
                  </div>
                )}

                {errors.image_url && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.image_url}</p>
                )}

                {(imagePreview || (imageType === 'url' && formData.image_url)) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('item.form.preview')}</p>
                    <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-900">
                      <img
                        src={imagePreview || formData.image_url}
                        alt="Item preview"
                        className="max-w-full max-h-48 object-contain rounded"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEwMCAxNDBIMTUwVjE0MEgxNTBMMTAwIDEwMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTEwMCAxMDBMMTAwIDYwSDE1MFY2MEgxNTBMMTAwIDEwMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTEwMCAxMDBMMTQwIDEwMEgxNDBMMTAwIDE0MEwxMDAgMTAwWiIgZmlsbD0iIzlDQTREQSIvPgo8cGF0aCBkPSJNMTAwIDEwMEw2MCAxMDBINjBMMTAwIDYwTDEwMCAxMDBaIiBmaWxsPSIjOUNBNEE0Ii8+Cjwvc3ZnPgo=';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>{t('common.loading')}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>{t('item.form.submit_edit')}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="btn-danger flex-1"
                >
                  <i className="fas fa-trash mr-2"></i>{t('common.delete')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/my-listings')}
                  className="btn-secondary"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t('item.delete')}
      >
        <p className="text-gray-700 dark:text-gray-200 mb-6">
          {t('admin.users.delete_confirm')}
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

export default EditItem;