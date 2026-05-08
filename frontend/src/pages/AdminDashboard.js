import React, { useEffect, useMemo, useState } from 'react';
import { applicationService, serviceService, FILE_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ClipboardList,
  Save,
  RefreshCcw,
  Paperclip,
  Settings2,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  AlertTriangle
} from 'lucide-react';

const appStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_process', label: 'Sedang Diproses' },
  { value: 'completed', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak' }
];

const serviceStatusOptions = [
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Nonaktif' },
  { value: 'maintenance', label: 'Maintenance' }
];

const badgeByType = {
  surat: 'bg-sky-50 text-sky-700',
  pengaduan: 'bg-purple-50 text-purple-700'
};

const badgeByStatus = {
  pending: 'bg-amber-50 text-amber-700',
  in_process: 'bg-sky-50 text-sky-700',
  completed: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700'
};

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [serviceSavingId, setServiceSavingId] = useState(null);
  const [appDrafts, setAppDrafts] = useState({});
  const [serviceDrafts, setServiceDrafts] = useState({});
  const [expandedAppId, setExpandedAppId] = useState(null);

  const buildAppDrafts = (apps) => {
    const drafts = {};
    apps.forEach((app) => {
      drafts[app.id] = {
        status: app.status,
        notes: app.notes || ''
      };
    });
    return drafts;
  };

  const buildServiceDrafts = (serviceList) => {
    const draftMap = {};
    serviceList.forEach((service) => {
      draftMap[service.id] = {
        name: service.name,
        description: service.description,
        category: service.category,
        status: service.status
      };
    });
    return draftMap;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsResponse, servicesResponse] = await Promise.all([
          applicationService.getAll(),
          serviceService.getAll()
        ]);
        setApplications(appsResponse.data);
        setServices(servicesResponse.data);
        setAppDrafts(buildAppDrafts(appsResponse.data));
        setServiceDrafts(buildServiceDrafts(servicesResponse.data));
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const complaintCount = useMemo(() => applications.filter((app) => app.application_type === 'pengaduan').length, [applications]);
  const suratPendingCount = useMemo(
    () => applications.filter((app) => app.application_type === 'surat' && ['pending', 'in_process'].includes(app.status)).length,
    [applications]
  );
  const completionRate = useMemo(() => {
    if (applications.length === 0) return 0;
    const completed = applications.filter((app) => app.status === 'completed').length;
    return Math.round((completed / applications.length) * 100);
  }, [applications]);

  const getAttachmentUrl = (attachmentPath) => {
    if (!attachmentPath) return '';
    return `${FILE_BASE_URL}/${attachmentPath}`;
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [appsResponse, servicesResponse] = await Promise.all([
        applicationService.getAll(),
        serviceService.getAll()
      ]);
      setApplications(appsResponse.data);
      setServices(servicesResponse.data);
      setAppDrafts(buildAppDrafts(appsResponse.data));
      setServiceDrafts(buildServiceDrafts(servicesResponse.data));
    } finally {
      setLoading(false);
    }
  };

  const saveApplication = async (id) => {
    setSavingId(id);
    try {
      await applicationService.update(id, appDrafts[id]);
      await refreshData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menyimpan pengajuan');
    } finally {
      setSavingId(null);
    }
  };

  const saveService = async (id) => {
    setServiceSavingId(id);
    try {
      await serviceService.update(id, serviceDrafts[id]);
      await refreshData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menyimpan layanan');
    } finally {
      setServiceSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-10">
        <header className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold w-fit">
            <ShieldCheck className="w-4 h-4" />
            Dashboard Admin Desa
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Laporan Pelayanan</h1>
          <p className="text-slate-600">Pantau aktivitas dan permohonan warga hari ini.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Permohonan', value: applications.length, trend: '+12% Bulan Ini', icon: ClipboardList, tone: 'bg-sky-100 text-sky-800' },
            { label: 'Surat Tertunda', value: suratPendingCount, trend: 'Menunggu Proses', icon: Clock3, tone: 'bg-indigo-100 text-indigo-800' },
            { label: 'Aduan Aktif', value: complaintCount, trend: 'Perlu Perhatian', icon: AlertTriangle, tone: 'bg-rose-100 text-rose-800' },
            { label: 'Tingkat Penyelesaian', value: `${completionRate}%`, trend: '', icon: CheckCircle2, tone: 'bg-emerald-100 text-emerald-800' }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-full ${stat.tone} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {stat.trend && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                      {stat.trend}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Permohonan Terbaru</h2>
              <button
                type="button"
                onClick={refreshData}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sky-600 hover:bg-sky-50"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500">Tanggal</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500">Pemohon</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500">Layanan</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500">Status</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-500">Belum ada pengajuan masuk.</td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <React.Fragment key={app.id}>
                        <tr className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="py-4 px-6 text-sm text-slate-700">{new Date(app.created_at).toLocaleDateString('id-ID')}</td>
                          <td className="py-4 px-6 text-sm font-medium text-slate-900">{app.username}</td>
                          <td className="py-4 px-6 text-sm text-slate-600">{app.service_name || 'Pengaduan masyarakat'}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badgeByType[app.application_type] || 'bg-slate-100 text-slate-600'}`}>
                                {app.application_type === 'pengaduan' ? 'Pengaduan' : 'Surat'}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badgeByStatus[app.status] || 'bg-slate-100 text-slate-600'}`}>
                                {app.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setExpandedAppId((prev) => (prev === app.id ? null : app.id))}
                              className="inline-flex items-center justify-center p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                              title="Kelola"
                            >
                              <ClipboardList className="w-4 h-4" />
                            </button>
                            {app.attachment_path && (
                              <a
                                href={getAttachmentUrl(app.attachment_path)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                                title="Lihat Lampiran"
                              >
                                <Paperclip className="w-4 h-4" />
                              </a>
                            )}
                          </td>
                        </tr>
                        {expandedAppId === app.id && (
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <td colSpan="5" className="px-6 py-5">
                              <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-600 mb-2">Status</label>
                                  <select
                                    value={appDrafts[app.id]?.status || app.status}
                                    onChange={(e) => setAppDrafts((prev) => ({
                                      ...prev,
                                      [app.id]: { ...prev[app.id], status: e.target.value }
                                    }))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                  >
                                    {appStatusOptions.map((option) => (
                                      <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-semibold text-slate-600 mb-2">Tanggapan / Catatan</label>
                                  <textarea
                                    value={appDrafts[app.id]?.notes || ''}
                                    onChange={(e) => setAppDrafts((prev) => ({
                                      ...prev,
                                      [app.id]: { ...prev[app.id], notes: e.target.value }
                                    }))}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    placeholder="Tulis tanggapan atau catatan tindak lanjut"
                                  />
                                </div>
                              </div>
                              <div className="mt-4 flex items-center justify-between">
                                <div className="text-xs text-slate-500">ID: #{app.id}</div>
                                <button
                                  type="button"
                                  onClick={() => saveApplication(app.id)}
                                  disabled={savingId === app.id}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-slate-400"
                                >
                                  <Save className="w-4 h-4" />
                                  {savingId === app.id ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold">Manajemen Layanan</h2>
              <p className="text-xs text-slate-500 mt-1">Atur ketersediaan layanan publik secara real-time.</p>
            </div>
            <div className="divide-y divide-slate-200">
              {services.length === 0 ? (
                <div className="p-6 text-center text-slate-500">Belum ada layanan.</div>
              ) : (
                services.map((service) => (
                  <div key={service.id} className="p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{service.name}</p>
                      <p className="text-xs text-slate-500">Status: {serviceDrafts[service.id]?.status || service.status}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={serviceDrafts[service.id]?.status || service.status}
                        onChange={(e) => setServiceDrafts((prev) => ({
                          ...prev,
                          [service.id]: { ...prev[service.id], status: e.target.value, name: service.name, description: service.description, category: service.category }
                        }))}
                        className="text-xs border border-slate-300 rounded-lg px-2 py-1"
                      >
                        {serviceStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => saveService(service.id)}
                        disabled={serviceSavingId === service.id}
                        className="inline-flex items-center justify-center p-2 text-sky-600 hover:bg-sky-50 rounded-lg"
                        title="Update Status"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
              <button className="text-sky-600 text-sm font-semibold inline-flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Pengaturan Lanjutan
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
