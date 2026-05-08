import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceService } from '../services/api';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getAll();
        setServices(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
              <BadgeCheck className="w-4 h-4" />
              Portal Layanan Resmi
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">Pelayanan Publik Desa Digital</h1>
            <p className="text-lg text-slate-600">
              Akses layanan administrasi desa lebih cepat, transparan, dan mudah. Kami hadir untuk melayani kebutuhan
              masyarakat dengan teknologi modern.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/applications" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700">
                Ajukan Layanan <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/services" className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:border-sky-500 hover:text-sky-700">
                Lihat Layanan
              </Link>
            </div>
          </div>
          <div className="md:col-span-6 lg:col-span-7 relative">
            <div className="absolute inset-0 bg-sky-100 rounded-[2.5rem] -rotate-2 scale-105 opacity-60"></div>
            <img
              alt="Ilustrasi Pelayanan Publik"
              className="relative z-10 w-full h-[360px] md:h-[480px] object-cover rounded-2xl border border-slate-200 shadow-md"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtksClWAjG80y2XgMY4L7im7DZ-MyvZHqP6KYZUX-WZDa8lVNy-5qrOipLBtNXC2p2m9CNCcKDV1p3qIMmHZto3ao-fKk6gRNmbcm7CSMAsYD56jv4-hGQHRqwUBnHAXDS5-nvFd7hmtsoAQ-Bi2Ee1gl7OpR2Jo7eXspw-QJBDZG3zqh0b030-Ny7zoxoauFSVjDB8VyWRsC1mA8H3flmcJBZzlBH-Jw04y-y9jv0juhXTIxa7m8BlGI7d6U4iAeecQ0y_LAUKfU"
            />
          </div>
        </section>

        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Permohonan Surat',
                description: 'Ajukan pembuatan surat pengantar, domisili, dan dokumen administrasi lainnya.'
              },
              {
                icon: MessageSquare,
                title: 'Pengaduan Publik',
                description: 'Sampaikan laporan infrastruktur, keamanan, atau masalah desa lainnya dengan mudah.'
              },
              {
                icon: Clock3,
                title: 'Lacak Status',
                description: 'Pantau perkembangan permohonan dan pengaduan Anda secara real-time.'
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="py-12 bg-white border border-slate-200 rounded-2xl px-6 md:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold mb-4">Proses Layanan Mudah</h2>
            <p className="text-slate-600">Tiga langkah sederhana untuk menyelesaikan keperluan administrasi desa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-[2px] bg-slate-200"></div>
            {[{
              title: 'Pilih Layanan',
              description: 'Temukan jenis layanan yang Anda butuhkan di katalog kami.'
            }, {
              title: 'Isi Formulir',
              description: 'Lengkapi data diri dan unggah dokumen pendukung.'
            }, {
              title: 'Pantau Proses',
              description: 'Terima notifikasi dan lacak status sampai selesai.'
            }].map((step, index) => (
              <div key={step.title} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-sky-600 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-md">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Layanan Populer</h2>
              <p className="text-slate-600">Layanan administrasi yang paling sering diakses warga.</p>
            </div>
            <Link to="/services" className="text-sky-600 font-semibold inline-flex items-center gap-2">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin">
                <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <FileText className="w-7 h-7 text-slate-500" />
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{service.category}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-xs text-slate-600">{service.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="py-12 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: CheckCircle2, value: '1,200+', label: 'Layanan Selesai' },
              { icon: ClipboardList, value: '45', label: 'Layanan Aktif' },
              { icon: ShieldCheck, value: '98%', label: 'Kepuasan Warga' }
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-6 rounded-xl hover:bg-slate-100 transition-colors">
                  <Icon className="w-9 h-9 text-sky-600 mx-auto mb-3" />
                  <h4 className="text-3xl font-bold mb-1">{stat.value}</h4>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
