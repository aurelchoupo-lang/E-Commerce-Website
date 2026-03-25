import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { sanitizeInput, debounce } from '../utils/helpers';

function SearchBar({ onSearch }) {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => {
    // Sanitize the query from URL to prevent XSS
    const urlQuery = searchParams.get('q') || '';
    return sanitizeInput(urlQuery);
  });
  const debouncedSearchRef = useRef(null);

  // Create debounced search function once
  useEffect(() => {
    debouncedSearchRef.current = debounce((value) => {
      onSearch(value);
    }, 500);
  }, [onSearch]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(value);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={t('home.search_placeholder')}
        className="input-field pr-10 w-full"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
