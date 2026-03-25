import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserObj, getUsers, getItems, getReports } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

function AdminDashboard() {
  const { t } = useLanguage();
  const user = getCurrentUserObj();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    pendingReports: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const itemsData = await getItems(1, 1000);
      const items = itemsData.data || [];
      const totalItems = items.length;

      const users = await getUsers();
      const totalUsers = Array.isArray(users) ? users.length : (users.count || 0);

      const reportsData = await getReports();
      const pendingReportsCount = Array.isArray(reportsData) 
        ? reportsData.filter(r => r.status === 'pending').length 
        : 0;

      const totalRevenueValue = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

      setStats({
        totalUsers,
        totalItems,
        pendingReports: pendingReportsCount,
        totalRevenue: totalRevenueValue.toFixed(2)
      });

      setRecentActivity([
        { id: 1, type: 'user_registered', message: t('admin.dashboard.recent_activity.user_reg') || 'New user registered', time: '2m' },
        { id: 2, type: 'item_reported', message: t('admin.dashboard.recent_activity.item_rep') || 'Item reported', time: '15m' },
        { id: 3, type: 'item_created', message: t('admin.dashboard.recent_activity.item_list') || 'New item listed', time: '1h' }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      {loading ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary-600"></i>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
        </div>
      ) : (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            <i className="fas fa-tachometer-alt mr-3 text-primary-600"></i>{t('admin.dashboard.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{t('admin.dashboard.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <i className="fas fa-users text-blue-600 dark:text-blue-400 text-2xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{stats.totalUsers}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{t('admin.dashboard.total_users')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <i className="fas fa-box text-green-600 dark:text-green-400 text-2xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{stats.totalItems}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{t('admin.dashboard.active_listings')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <i className="fas fa-flag text-red-600 dark:text-red-400 text-2xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{stats.pendingReports}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{t('admin.dashboard.pending_reports')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <i className="fas fa-dollar-sign text-yellow-600 text-2xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">${stats.totalRevenue}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{t('admin.dashboard.revenue')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            <i className="fas fa-bolt mr-2 text-primary-600"></i>{t('admin.dashboard.quick_actions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center p-4 bg-blue-50 dark:bg-gray-800 dark:bg-blue-900/20 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <i className="fas fa-users text-blue-600 dark:text-blue-400 text-2xl mr-3"></i>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100">{t('admin.dashboard.manage_users')}</h3>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/reports')}
              className="flex items-center p-4 bg-red-50 dark:bg-gray-800 dark:bg-red-900/20 hover:bg-red-100 rounded-lg transition-colors"
            >
              <i className="fas fa-flag text-red-600 dark:text-red-400 text-2xl mr-3"></i>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100">{t('admin.dashboard.review_reports')}</h3>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/items')}
              className="flex items-center p-4 bg-green-50 dark:bg-gray-800 dark:bg-green-900/20 hover:bg-green-100 rounded-lg transition-colors"
            >
              <i className="fas fa-box text-green-600 dark:text-green-400 text-2xl mr-3"></i>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-100">{t('admin.dashboard.manage_items')}</h3>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            <i className="fas fa-history mr-2 text-primary-600"></i>{t('admin.dashboard.recent_activity.title')}
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className={`p-2 rounded-full mr-3 ${
                  activity.type === 'user_registered' ? 'bg-blue-100 text-blue-600 dark:text-blue-400' :
                  activity.type === 'item_reported' ? 'bg-red-100 text-red-600 dark:text-red-400' :
                  activity.type === 'item_created' ? 'bg-green-100 text-green-600 dark:text-green-400' :
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  <i className={`fas ${
                    activity.type === 'user_registered' ? 'fa-user-plus' :
                    activity.type === 'item_reported' ? 'fa-flag' :
                    activity.type === 'item_created' ? 'fa-plus-circle' :
                    'fa-shopping-cart'
                  }`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-100 text-sm">{activity.message}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
}

export default AdminDashboard;