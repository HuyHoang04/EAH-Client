/**
 * Cron Job Manager Component
 * Create, view, and manage scheduled workflows
 */

'use client';

import { useState, useEffect } from 'react';
import { nodeRunnerService, CronJob, parseCronExpression, validateCronExpression } from '@/services/nodeRunnerService';
import { Play, Pause, Trash2, Calendar, Clock } from 'lucide-react';

interface CronJobManagerProps {
  flowId?: string;
}

export default function CronJobManager({ flowId }: CronJobManagerProps) {
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    cronExpression: '0 8 * * *', // Default: Daily at 8 AM
  });
  const [formError, setFormError] = useState('');
  
  // Simple time picker state
  const [useSimpleMode, setUseSimpleMode] = useState(true);
  const [hour, setHour] = useState('8');
  const [minute, setMinute] = useState('0');
  const [frequency, setFrequency] = useState<'daily' | 'hourly' | 'weekdays'>('daily');

  useEffect(() => {
    loadCronJobs();
    loadStats();
  }, [flowId]);

  const loadCronJobs = async () => {
    try {
      const jobs = flowId
        ? await nodeRunnerService.getCronJobsByFlowId(flowId)
        : await nodeRunnerService.getAllCronJobs();
      setCronJobs(jobs);
    } catch (error) {
      console.error('Failed to load cron jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const cronStats = await nodeRunnerService.getCronStats();
      setStats(cronStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Generate cron from simple inputs
  const generateCronExpression = () => {
    const m = minute;
    const h = hour;
    
    switch (frequency) {
      case 'hourly':
        return `${m} * * * *`; // Every hour at specified minute
      case 'daily':
        return `${m} ${h} * * *`; // Every day at specified time
      case 'weekdays':
        return `${m} ${h} * * 1-5`; // Monday-Friday at specified time
      default:
        return `${m} ${h} * * *`;
    }
  };

  // Update cron expression when simple mode values change
  useEffect(() => {
    if (useSimpleMode) {
      const cron = generateCronExpression();
      setFormData(prev => ({ ...prev, cronExpression: cron }));
    }
  }, [hour, minute, frequency, useSimpleMode]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!flowId) {
      setFormError('Flow ID is required');
      return;
    }

    if (!formData.name.trim()) {
      setFormError('Job name is required');
      return;
    }

    if (!validateCronExpression(formData.cronExpression)) {
      setFormError('Invalid cron expression');
      return;
    }

    try {
      await nodeRunnerService.createCronJob({
        flowId,
        name: formData.name,
        cronExpression: formData.cronExpression,
      });

      setShowCreateDialog(false);
      setFormData({ name: '', cronExpression: '0 8 * * *' });
      await loadCronJobs();
      await loadStats();
    } catch (error: any) {
      setFormError(error.message || 'Failed to create cron job');
    }
  };

  const handleDelete = async (job: CronJob) => {
    if (!confirm(`Delete cron job "${job.name}"?`)) return;

    try {
      await nodeRunnerService.deleteCronJob(job.flowId, job.name);
      await loadCronJobs();
      await loadStats();
    } catch (error) {
      console.error('Failed to delete cron job:', error);
    }
  };

  const handleToggle = async (job: CronJob) => {
    try {
      await nodeRunnerService.toggleCronJob(job.flowId, job.name, !job.isActive);
      await loadCronJobs();
      await loadStats();
    } catch (error) {
      console.error('Failed to toggle cron job:', error);
    }
  };

  const commonExpressions = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Daily at 8 AM', value: '0 8 * * *' },
    { label: 'Daily at 6 PM', value: '0 18 * * *' },
    { label: 'Weekdays at 9 AM', value: '0 9 * * 1-5' },
    { label: 'Weekly on Monday', value: '0 0 * * 1' },
  ];

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Jobs</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Paused</p>
          <p className="text-2xl font-bold text-black">{stats.inactive}</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-black font-semibold">Scheduled Jobs</h3>
        {flowId && (
          <button
            onClick={() => setShowCreateDialog(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Schedule Workflow
          </button>
        )}
      </div>

      {/* Job List */}
      <div className="space-y-2">
        {cronJobs.length === 0 ? (
          <div className="text-center py-12 bg-white border rounded-lg">
            <p className="text-black">No scheduled jobs</p>
            {flowId && (
              <button
                onClick={() => setShowCreateDialog(true)}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Create your first schedule
              </button>
            )}
          </div>
        ) : (
          cronJobs.map((job) => (
            <div
              key={`${job.flowId}-${job.name}`}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-gray-800">{job.name}</h4>
                    <span className={`
                      px-2 py-1 text-xs rounded-full flex items-center gap-1
                      ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {job.isActive ? (
                        <><Play className="w-3 h-3" /> Active</>
                      ) : (
                        <><Pause className="w-3 h-3" /> Paused</>
                      )}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Schedule: <span className="font-mono">{job.cronExpression}</span>
                      <span className="text-black ml-2">({parseCronExpression(job.cronExpression)})</span>
                    </p>
                    {job.nextRunAt && (
                      <p className="flex items-center gap-1"><Clock className="w-4 h-4" /> Next run: {new Date(job.nextRunAt).toLocaleString()}</p>
                    )}
                    {job.lastRunAt && (
                      <p className="flex items-center gap-1"><Clock className="w-4 h-4" /> Last run: {new Date(job.lastRunAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(job)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 flex items-center gap-1"
                    title={job.isActive ? 'Pause' : 'Resume'}
                  >
                    {job.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(job)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 flex items-center gap-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Lên Lịch Chạy</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {formError}
                </div>
              )}

              {/* Job Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên lịch
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="VD: Gửi email hàng ngày"
                />
              </div>

              {/* Simple Mode Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useSimple"
                  checked={useSimpleMode}
                  onChange={(e) => setUseSimpleMode(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="useSimple" className="text-sm text-gray-700">
                  Chế độ đơn giản (chọn giờ)
                </label>
              </div>

              {useSimpleMode ? (
                /* Simple Time Picker Mode */
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tần suất
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFrequency('hourly')}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          frequency === 'hourly' 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Mỗi giờ
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrequency('daily')}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          frequency === 'daily' 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Hàng ngày
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrequency('weekdays')}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          frequency === 'weekdays' 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Thứ 2-6
                      </button>
                    </div>
                  </div>

                  {frequency !== 'hourly' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giờ
                        </label>
                        <select
                          value={hour}
                          onChange={(e) => setHour(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                              {i.toString().padStart(2, '0')}:00
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phút
                        </label>
                        <select
                          value={minute}
                          onChange={(e) => setMinute(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                        >
                          {['00', '15', '30', '45'].map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {frequency === 'hourly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phút (trong giờ)
                      </label>
                      <select
                        value={minute}
                        onChange={(e) => setMinute(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={i}>
                            Phút thứ {i}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Tóm tắt:</strong>{' '}
                      {frequency === 'hourly' && `Chạy mỗi giờ vào phút thứ ${minute}`}
                      {frequency === 'daily' && `Chạy hàng ngày lúc ${hour}:${minute}`}
                      {frequency === 'weekdays' && `Chạy thứ 2-6 lúc ${hour}:${minute}`}
                    </p>
                    <p className="text-xs text-blue-600 mt-1 font-mono">
                      {formData.cronExpression}
                    </p>
                  </div>
                </>
              ) : (
                /* Advanced Cron Mode */
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cron Expression (Nâng cao)
                    </label>
                    <input
                      type="text"
                      value={formData.cronExpression}
                      onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-gray-900"
                      placeholder="0 8 * * *"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {parseCronExpression(formData.cronExpression)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mẫu có sẵn
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {commonExpressions.map((expr) => (
                        <button
                          key={expr.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, cronExpression: expr.value })}
                          className="px-3 py-2 text-sm border rounded hover:bg-gray-50 text-left text-gray-700"
                        >
                          {expr.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tạo lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
