import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserObj, getUsers, updateUserRole, deleteUser } from '../services/api';
import Modal from '../components/Modal';
import { useLanguage } from '../context/LanguageContext';

function UserManagement() {
  const { t } = useLanguage();
  const user = getCurrentUserObj();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await getUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(u =>
        (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.profile?.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (newRole) => {
    if (!selectedUser) return;

    try {
      await updateUserRole(selectedUser.id, newRole);
      setUsers(users.map(u =>
        u.id === selectedUser.id ? { ...u, profile: { ...u.profile, role: newRole } } : u
      ));
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(t('common.error') || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(t('common.error') || 'Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:text-red-300';
      case 'seller': return 'bg-green-100 text-green-800 dark:text-green-300';
      case 'buyer': return 'bg-blue-100 text-blue-800 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100';
    }
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
                <i className="fas fa-users mr-3 text-primary-600"></i>{t('admin.users.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">{t('admin.users.subtitle')}</p>
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
                {t('admin.users.search')}
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
                {t('admin.users.filter_role')}
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">{t('admin.users.all_roles')}</option>
                <option value="admin">{t('nav.role_admin')}</option>
                <option value="seller">{t('nav.role_seller')}</option>
                <option value="buyer">{t('nav.role_buyer')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {t('admin.users.title')} ({filteredUsers.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.users.table_user')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.users.table_role')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.users.table_joined')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {filteredUsers.map((userData) => (
                  <tr key={userData.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <i className="fas fa-user text-primary-600"></i>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {userData.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(userData.profile?.role)}`}>
                        {t(`nav.role_${userData.profile?.role}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {userData.date_joined ? new Date(userData.date_joined).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(userData);
                            setShowRoleModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                          disabled={userData.id === user.id}
                        >
                          <i className="fas fa-edit"></i> {t('admin.users.table_role')}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(userData);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-900"
                          disabled={userData.id === user.id}
                        >
                          <i className="fas fa-trash"></i> {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <i className="fas fa-users text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t('home.no_items')}</h3>
              <p className="text-gray-500 dark:text-gray-400">{t('home.no_items_sub')}</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title={t('admin.users.modal_role_title')}
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            {t('admin.users.modal_role_title')} <strong>{selectedUser?.name}</strong> ({selectedUser?.email})
          </p>

          <div className="space-y-2">
            <button
              onClick={() => handleRoleChange('buyer')}
              className="w-full text-left p-3 border rounded-lg hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-blue-900/30 dark:bg-blue-900/20 hover:border-blue-300 dark:border-blue-800"
            >
              <div className="font-medium text-blue-800 dark:text-blue-300">{t('auth.register.buyer')}</div>
            </button>

            <button
              onClick={() => handleRoleChange('seller')}
              className="w-full text-left p-3 border rounded-lg hover:bg-green-50 dark:bg-gray-800 dark:bg-green-900/20 hover:border-green-300 dark:border-green-800"
            >
              <div className="font-medium text-green-800 dark:text-green-300">{t('auth.register.seller')}</div>
            </button>

            <button
              onClick={() => handleRoleChange('admin')}
              className="w-full text-left p-3 border rounded-lg hover:bg-red-50 dark:bg-gray-800 dark:bg-red-900/20 hover:border-red-300 dark:border-red-800"
            >
              <div className="font-medium text-red-800 dark:text-red-300">{t('nav.role_admin')}</div>
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t('admin.users.modal_delete_title')}
      >
        <div className="space-y-4">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-red-600 dark:text-red-400 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('admin.users.modal_delete_title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('admin.users.delete_confirm')}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleDeleteUser}
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

export default UserManagement;