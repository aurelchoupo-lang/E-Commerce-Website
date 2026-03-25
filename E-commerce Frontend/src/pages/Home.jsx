import { useState, useEffect } from 'react';
import { getItems, getCategories, getDefaultCategories } from '../services/api';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { filterItemsBySearch, filterItemsByPrice, sortItems } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

function Home() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [onlyLocal, setOnlyLocal] = useState(false);
  const [onlyDurable, setOnlyDurable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery, sortBy, priceRange, onlyLocal, onlyDurable]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const filters = {};
      if (selectedCategory !== 'all') {
        const cat = categories.find(c => c.name === selectedCategory);
        if (cat) filters.category = cat.slug;
      }
      if (searchQuery) filters.search = searchQuery;
      if (onlyLocal) filters.is_local = true;
      if (onlyDurable) filters.is_durable = true;
      
      // Handle ordering
      let ordering = '-created_at';
      if (sortBy === 'oldest') ordering = 'created_at';
      else if (sortBy === 'price-low') ordering = 'price';
      else if (sortBy === 'price-high') ordering = '-price';
      else if (sortBy === 'title') ordering = 'title';
      filters.ordering = ordering;

      const [itemsData, categoriesData] = await Promise.all([
        getItems(1, 100, filters),
        categories.length > 0 ? Promise.resolve(categories) : getCategories().catch(() => getDefaultCategories())
      ]);
      
      setFilteredItems(itemsData.data || []);
      if (categories.length === 0) setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError(t('common.error_loading') || 'Failed to load items. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filters are now applied on the backend

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('newest');
    setPriceRange({ min: '', max: '' });
    setOnlyLocal(false);
    setOnlyDurable(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-600"></i>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <i className="fas fa-exclamation-circle text-4xl text-red-600 dark:text-red-400"></i>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{error}</p>
        <button onClick={loadData} className="btn-primary mt-4">
          <i className="fas fa-redo mr-2"></i>{t('common.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <i className="fas fa-store mr-3"></i>
            {t('home.welcome')}
          </h1>
          <p className="text-xl text-center mb-8">
            {t('home.subtitle')}
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="mb-6 space-y-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 transition-colors"
          >
            <i className={`fas fa-chevron-${showFilters ? 'up' : 'down'}`}></i>
            <span>{showFilters ? t('home.filters.hide') : t('home.filters.show')}</span>
          </button>

          {showFilters && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    <i className="fas fa-dollar-sign mr-2"></i>{t('home.filters.min_price')}
                  </label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    <i className="fas fa-dollar-sign mr-2"></i>{t('home.filters.max_price')}
                  </label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    placeholder="9999.99"
                    min="0"
                    step="0.01"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={onlyLocal}
                    onChange={(e) => setOnlyLocal(e.target.checked)}
                    className="w-5 h-5 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700 dark:text-gray-200 group-hover:text-primary-600 transition-colors">
                    <i className="fas fa-map-marker-alt mr-2"></i>{t('home.filters.local')}
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={onlyDurable}
                    onChange={(e) => setOnlyDurable(e.target.checked)}
                    className="w-5 h-5 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-700 dark:text-gray-200 group-hover:text-primary-600 transition-colors">
                    <i className="fas fa-leaf mr-2"></i>{t('home.filters.durable')}
                  </span>
                </label>
              </div>

              <button
                onClick={resetFilters}
                className="btn-secondary w-full"
              >
                <i className="fas fa-redo mr-2"></i>{t('home.filters.reset')}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-gray-600 dark:text-gray-300">
            <i className="fas fa-box mr-2"></i>
            <span className="font-medium">{filteredItems.length}</span> {t('home.items_found')}
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-gray-600 dark:text-gray-300">
              <i className="fas fa-sort mr-2"></i>{t('home.sort_by')}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-field"
            >
              <option value="newest">{t('home.newest')}</option>
              <option value="oldest">{t('home.oldest')}</option>
              <option value="price-low">{t('home.price_low')}</option>
              <option value="price-high">{t('home.price_high')}</option>
              <option value="title">{t('home.title_az')}</option>
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('home.no_items')}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('home.no_items_sub')}</p>
            <button
              onClick={resetFilters}
              className="btn-secondary mt-4"
            >
              <i className="fas fa-redo mr-2"></i>{t('home.filters.reset')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
