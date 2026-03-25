import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { isLoggedIn } from '../services/api';
import { formatPrice, truncateText, getConditionBadge, formatRelativeTime, getCategoryPlaceholderImage } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

function ItemCard({ item }) {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    setImageFailed(true);
    e.target.src = getCategoryPlaceholderImage(item.category);
  };

  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!isLoggedIn()) {
      e.preventDefault();
      navigate('/register');
    }
  };

  return (
    <Link to={`/item/${item.id}`} onClick={handleClick} className="block">
      <div className="card hover:scale-105 transition-transform duration-300 animate-fadeIn">
        {/* Image */}
        <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-200 dark:bg-gray-700" style={{ height: '200px' }}>
          {!imageLoaded && !imageFailed && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-300 z-10">
              <i className="fas fa-spinner fa-spin text-gray-500 dark:text-gray-400"></i>
            </div>
          )}
          <img
            src={item.image_url || getCategoryPlaceholderImage(item.category)}
            alt={item.title}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <span className={`badge ${getConditionBadge(item.condition)}`}>
              {item.condition}
            </span>
            {item.co2_footprint && (
              <span className="badge bg-green-100 text-green-800 dark:text-green-300 border-green-200">
                <i className="fas fa-leaf mr-1"></i>
                {item.co2_footprint}kg CO₂
              </span>
            )}
            {item.is_local && (
              <span className="badge bg-blue-100 text-blue-800 dark:text-blue-300 border-blue-200">
                <i className="fas fa-map-marker-alt mr-1"></i>
                {t('home.filters.local')}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 hover:text-primary-600 transition-colors">
            {truncateText(item.title, 50)}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
            {truncateText(item.description, 100)}
          </p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(item.price)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <i className="fas fa-map-marker-alt mr-1"></i>
              {item.location}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t pt-3">
            <span>
              <i className="fas fa-tag mr-1"></i>
              {item.category}
            </span>
            <span>
              <i className="fas fa-clock mr-1"></i>
              {formatRelativeTime(item.created_at)}
            </span>
          </div>

          <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            <i className="fas fa-user mr-1"></i>
            {item.seller_name}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="inline-flex items-center gap-2 w-full justify-center py-2 px-4 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
              <i className="fas fa-eye"></i> {t('common.view_details')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ItemCard;
