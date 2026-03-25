import React from 'react';
import { calculateTrustScore, generateRatingAriaLabel } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

function RatingDisplay({ 
  seller = {}, 
  showFullProfile = false,
  showEcoImpact = false,
  ecoImpact = {}
}) {
  const { t } = useLanguage();
  // Extract seller data with defaults
  const rating = seller.rating || 0;
  const reviewCount = seller.reviewCount || 0;
  const listingCount = seller.listingCount || 1;
  const accountAge = seller.accountAge || Date.now();
  
  const trustScore = calculateTrustScore(listingCount, rating, reviewCount, accountAge);
  const trustLevel = 
    trustScore >= 80 ? t('common.resolved') || 'Excellent' :
    trustScore >= 60 ? t('common.pending') || 'Good' :
    trustScore >= 40 ? t('common.investigating') || 'Fair' :
    t('admin.users.modal_role_title') || 'New'; // Fallbacks are rough here, let's fix translations instead

  const trustColor = 
    trustScore >= 80 ? 'text-green-600 dark:text-green-400' :
    trustScore >= 60 ? 'text-blue-600 dark:text-blue-400' :
    trustScore >= 40 ? 'text-yellow-600' :
    'text-gray-600 dark:text-gray-300';

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <i key={i} className="fas fa-star text-yellow-400"></i>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <i key={i} className="fas fa-star-half-alt text-yellow-400"></i>
        );
      } else {
        stars.push(
          <i key={i} className="fas fa-star text-gray-300"></i>
        );
      }
    }
    return stars;
  };

  return (
    <div className={`${showFullProfile ? 'space-y-6' : 'space-y-4'}`}>
      {/* Trust/Seller Info Section */}
      <div className="bg-gradient-to-r from-blue-50 dark:from-gray-800 to-indigo-50 dark:to-gray-900 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <i className="fas fa-shield-alt text-blue-600 dark:text-blue-400"></i>{t('item.seller')}
            </h3>
          </div>
          <div className={`text-sm font-bold px-3 py-1 rounded-full ${trustColor} bg-white dark:bg-gray-800 border`}>
            {trustLevel}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3" aria-label={generateRatingAriaLabel(rating, reviewCount)}>
          <div className="flex gap-1">
            {renderStars(rating)}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-200">
            {rating.toFixed(1)} ({reviewCount} reviews)
          </span>
        </div>

        {/* Trust Score Visual */}
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{t('item.eco_impact')}</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{trustScore}/100</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-50 dark:from-gray-8000 to-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${trustScore}%` }}
            ></div>
          </div>
        </div>

        {/* Seller Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
            <p className="font-bold text-blue-600 dark:text-blue-400">{listingCount}</p>
            <p className="text-gray-600 dark:text-gray-300">{t('admin.dashboard.active_listings')}</p>
          </div>
          <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
            <p className="font-bold text-blue-600 dark:text-blue-400">
              {Math.floor((Date.now() - accountAge) / (1000 * 60 * 60 * 24))}d
            </p>
            <p className="text-gray-600 dark:text-gray-300">Member</p>
          </div>
          <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
            <p className="font-bold text-blue-600 dark:text-blue-400">{reviewCount}</p>
            <p className="text-gray-600 dark:text-gray-300">Reviews</p>
          </div>
        </div>
      </div>

      {/* Environmental Impact */}
      {showEcoImpact && Object.keys(ecoImpact).length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <i className="fas fa-leaf text-green-600 dark:text-green-400"></i>Environmental Impact
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
              <span className="flex items-center gap-2">
                <i className="fas fa-cloud text-blue-500"></i>CO₂ Saved
              </span>
              <span className="font-bold text-green-600 dark:text-green-400">{ecoImpact.co2Saved} kg</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
              <span className="flex items-center gap-2">
                <i className="fas fa-recycle text-green-600 dark:text-green-400"></i>Waste Diverted
              </span>
              <span className="font-bold text-green-600 dark:text-green-400">{ecoImpact.wasteDiverted} kg</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
              <span className="flex items-center gap-2">
                <i className="fas fa-tree text-emerald-600"></i>Tree Equivalent
              </span>
              <span className="font-bold text-emerald-600">{ecoImpact.treesEquivalent}</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 bg-white dark:bg-gray-800 p-2 rounded">
            By buying secondhand, you're helping the planet! This purchase diverts waste from landfills and reduces manufacturing emissions.
          </p>
        </div>
      )}

      {/* Review CTA */}
      {showFullProfile && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            <span className="font-semibold">Verified Seller.</span> 
            {' '}Check out {reviewCount > 0 ? 'recent reviews' : 'this seller\'s profile'} to learn more about their trading history.
          </p>
        </div>
      )}
    </div>
  );
}

export default RatingDisplay;
