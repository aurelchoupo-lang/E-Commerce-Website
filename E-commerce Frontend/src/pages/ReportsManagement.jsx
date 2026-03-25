import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserObj, getReports, updateReportStatus, deleteItemAdmin } from '../services/api';
import Modal from '../components/Modal';
import { useLanguage } from '../context/LanguageContext';

function ReportsManagement() {
  const { t } = useLanguage();
  const user = getCurrentUserObj();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadReports();
  }, [user, navigate]);

  useEffect(() => {
    filterReports();
  }, [reports, statusFilter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const allReports = await getReports();
      setReports(allReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    setFilteredReports(filtered);
  };

  const handleReportAction = async () => {
    if (!selectedReport) return;
    try {
      if (actionType === 'remove') {
        await deleteItemAdmin(selectedReport.product);
        await updateReportStatus(selectedReport.id, 'resolved', `Item removed: ${adminNote}`);
      } else if (actionType === 'dismiss') {
        await updateReportStatus(selectedReport.id, 'dismissed', adminNote);
      } else if (actionType === 'investigate') {
        await updateReportStatus(selectedReport.id, 'investigating', adminNote);
      }
      await loadReports();
      setShowActionModal(false);
      setSelectedReport(null);
      setAdminNote('');
    } catch (error) {
      console.error('Error handling report:', error);
      alert(t('common.error') || 'Failed to process report action');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:text-yellow-300';
      case 'investigating': return 'bg-blue-100 text-blue-800 dark:text-blue-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:text-green-300';
      case 'dismissed': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100';
    }
  };

  const getReasonBadgeColor = (reason) => {
    switch (reason.toLowerCase()) {
      case 'fraud': return 'bg-red-100 text-red-800 dark:text-red-300';
      case 'inappropriate': return 'bg-orange-100 text-orange-800';
      case 'spam': return 'bg-purple-100 text-purple-800';
      case 'counterfeit': return 'bg-pink-100 text-pink-800';
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
                <i className="fas fa-flag mr-3 text-primary-600"></i>{t('admin.reports.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">{t('admin.reports.subtitle')}</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="btn-secondary"
            >
              <i className="fas fa-arrow-left mr-2"></i>{t('common.back')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-yellow-600">{reports.filter(r => r.status === 'pending').length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('common.pending')}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reports.filter(r => r.status === 'investigating').length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('common.investigating')}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{reports.filter(r => r.status === 'resolved').length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('common.resolved')}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">{reports.filter(r => r.status === 'dismissed').length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('common.dismissed')}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t('admin.reports.filter_status')}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-full md:w-64"
            >
              <option value="all">{t('admin.users.all_roles')}</option>
              <option value="pending">{t('common.pending')}</option>
              <option value="investigating">{t('common.investigating')}</option>
              <option value="resolved">{t('common.resolved')}</option>
              <option value="dismissed">{t('common.dismissed')}</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {t('admin.reports.title')} ({filteredReports.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(report.status)}`}>
                        {t(`common.${report.status}`)}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReasonBadgeColor(report.reason)}`}>
                        {t(`admin.reports.reasons.${report.reason.toLowerCase()}`) || report.reason}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                       {t('item.form.title')}: {report.product_title || 'Unknown Item'}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-3">{report.description}</p>

                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <p><strong>{t('item.seller')}:</strong> {report.reporter_email}</p>
                      <p><strong>ID:</strong> {report.product}</p>
                      {report.adminNote && (
                        <p><strong>{t('common.note')}:</strong> {report.adminNote}</p>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setActionType('investigate');
                            setShowActionModal(true);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                        >
                          <i className="fas fa-search"></i> {t('common.edit')}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setActionType('remove');
                            setShowActionModal(true);
                          }}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                        >
                          <i className="fas fa-trash"></i> {t('common.delete')}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setActionType('dismiss');
                            setShowActionModal(true);
                          }}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 flex items-center gap-1"
                        >
                          <i className="fas fa-times-circle"></i> {t('common.cancel')}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="px-6 py-12 text-center">
              <i className="fas fa-flag text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t('home.no_items')}</h3>
              <p className="text-gray-500 dark:text-gray-400">{t('home.no_items_sub')}</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={t('admin.reports.title')}
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
              {actionType === 'remove' && t('item.delete')}
              {actionType === 'dismiss' && t('common.cancel')}
              {actionType === 'investigate' && t('common.edit')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {selectedReport?.description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              {t('common.note')}
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="..."
              rows={3}
              className="textarea-field"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleReportAction}
              className={`flex-1 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 ${
                actionType === 'remove' ? 'bg-red-600 hover:bg-red-700' :
                actionType === 'dismiss' ? 'bg-gray-600 hover:bg-gray-700' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <i className={`fas ${
                actionType === 'remove' ? 'fa-trash' :
                actionType === 'dismiss' ? 'fa-times-circle' :
                'fa-search'
              }`}></i>
              {t('common.save')}
            </button>
            <button
              onClick={() => setShowActionModal(false)}
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

export default ReportsManagement;
