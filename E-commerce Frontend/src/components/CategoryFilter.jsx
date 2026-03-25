import { useLanguage } from '../context/LanguageContext';

function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  const { t } = useLanguage();
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
        <i className="fas fa-filter mr-2"></i>{t('home.filters.title')}
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 transform shadow-sm ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/30 scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 hover:text-primary-600'
          }`}
        >
          <i className="fas fa-th mr-2"></i>{t('common.all') || t('admin.users.all_roles') || 'All'}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.name)}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 transform shadow-sm ${
              selectedCategory === category.name
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/30 scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 hover:text-primary-600'
            }`}
          >
            <i className={`fas ${category.icon} mr-2`}></i>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
