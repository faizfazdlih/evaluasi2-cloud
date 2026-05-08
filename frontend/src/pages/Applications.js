import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService, serviceService, FILE_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Upload,
  MessageSquare,
  Paperclip
} from 'lucide-react';

const initialForm = {
  application_type: 'surat',
  service_id: '',
  title: '',
  description: '',
  contact_number: ''
};

const statusMeta = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Menunggu' },
  in_process: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Sedang Diproses' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Selesai' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', label: 'Ditolak' }
};

export const Applications = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('surat');
  const [formData, setFormData] = useState(initialForm);
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [appsResponse, servicesResponse] = await Promise.all([
          applicationService.getMyApplications(),
          serviceService.getAll()
        ]);
        setApplications(appsResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const suratServices = useMemo(() => services.filter((service) => service.status === 'active'), [services]);

  const resetForm = () => {
    setFormData(initialForm);
    setAttachment(null);
  };
  const historyItems = useMemo(
    () => [...applications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4),
    [applications]
  );

  useEffect(() => {
    setFormData((prev) => ({ ...prev, application_type: activeTab }));
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append('application_type', activeTab);
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('contact_number', formData.contact_number);

      if (activeTab === 'surat') {
        payload.append('service_id', formData.service_id);
      }

      if (attachment) {
        payload.append('attachment', attachment);
      }

      await applicationService.create(payload);
      const response = await applicationService.getMyApplications();
      setApplications(response.data);
      resetForm();
      setActiveTab('surat');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Gagal mengirim data'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus permohonan ini?')) {
      try {
        await applicationService.delete(id);
        setApplications(applications.filter((app) => app.id !== id));
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || 'Gagal menghapus permohonan'));
      }
    }
  };

  const getStatusBadge = (status) => statusMeta[status] || statusMeta.pending;

  const timeline = ['pending', 'in_process', 'completed'];

  const getAttachmentUrl = (attachmentPath) => {
    if (!attachmentPath) return '';
    if (/^https?:\/\//i.test(attachmentPath)) return attachmentPath;
    return `${FILE_BASE_URL}/${attachmentPath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
        <div className="inline-block animate-spin">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Portal Aplikasi Warga</h1>
          <p className="text-slate-600 text-lg">Ajukan permohonan surat administrasi atau sampaikan pengaduan kepada pemerintah desa dengan mudah.</p>
          <div className="mt-6 flex gap-2 border-b border-slate-200">
            {[
              { key: 'surat', label: 'Permohonan Surat', icon: FileText },
              { key: 'pengaduan', label: 'Pengaduan Masyarakat', icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                    setFormData({ ...initialForm, application_type: tab.key, service_id: '' });
                    setAttachment(null);
                  }}
                  className={`px-5 py-3 rounded-t-lg font-semibold text-sm border-b-2 flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'text-sky-700 border-sky-600 bg-slate-100'
                      : 'text-slate-500 border-transparent hover:text-sky-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Formulir Permohonan</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'surat' ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Surat / Judul Permohonan</label>
                    <select
                      value={formData.service_id}
                      onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    >
                      <option value="">Pilih jenis surat</option>
                      {suratServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
                    <p className="text-sm">Gunakan formulir ini untuk menyampaikan pengaduan layanan publik atau keluhan fasilitas di lingkungan Anda.</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{activeTab === 'surat' ? 'Judul Permohonan' : 'Judul Laporan'}</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder={activeTab === 'surat' ? 'Misal: Surat Keterangan Domisili' : 'Misal: Lampu jalan rusak'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Keterangan / Tujuan Pembuatan</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder={activeTab === 'surat'
                      ? 'Jelaskan secara singkat keperluan pembuatan surat ini...'
                      : 'Jelaskan kronologi, lokasi, dan detail pengaduan...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.contact_number}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="0812xxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Unggah Dokumen Pendukung (KTP/KK)</label>
                  <label className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-500 mb-3" />
                    <p className="text-sm text-slate-600">Tarik dan lepas file di sini, atau <span className="text-sky-600 font-semibold">Pilih File</span></p>
                    <p className="text-xs text-slate-400 mt-1">Format: JPG, PNG, PDF (Maks 5MB)</p>
                    <input
                      type="file"
                      onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                      accept=".pdf,.jpg,.jpeg,.png,image/*,application/pdf"
                      className="hidden"
                    />
                  </label>
                  {attachment && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm">
                      <Paperclip className="w-4 h-4 text-sky-600" />
                      {attachment.name}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-lg font-semibold bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-400"
                  >
                    {saving ? 'Mengirim...' : 'Kirim Permohonan'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Riwayat Saya</h3>
                <button type="button" className="text-sm font-semibold text-sky-600 hover:underline">Lihat Semua</button>
              </div>
              <div className="space-y-4">
                {historyItems.length === 0 ? (
                  <div className="text-center text-slate-500 text-sm py-8">Belum ada permohonan.</div>
                ) : (
                  historyItems.map((app, index) => {
                    const status = getStatusBadge(app.status);
                    return (
                      <div key={app.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors">
                        <div className="flex justify-between items-start mb-2 gap-3">
                          <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{app.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Diajukan: {new Date(app.created_at).toLocaleDateString('id-ID')}</p>
                        {index === 0 && (
                          <div className="relative pl-4 border-l-2 border-slate-200 space-y-4">
                            {timeline.map((step) => {
                              const stepOrder = timeline.indexOf(step);
                              const currentOrder = timeline.indexOf(app.status);
                              const active = currentOrder >= stepOrder;
                              return (
                                <div key={step} className="relative">
                                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${active ? 'bg-sky-600' : 'bg-slate-300'} ring-4 ring-slate-50`}></div>
                                  <p className={`text-xs ${active ? 'text-slate-700' : 'text-slate-400'}`}>{statusMeta[step].label}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          {app.attachment_path ? (
                            <a
                              href={getAttachmentUrl(app.attachment_path)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-sky-600 hover:underline"
                            >
                              Lihat Lampiran
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">Tidak ada lampiran</span>
                          )}
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="text-xs text-rose-600 hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
