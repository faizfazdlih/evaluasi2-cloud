import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { serviceService } from '../services/api';
import { FileText } from 'lucide-react';

export const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getAll();
        setServices(response.data);
        
        // Get unique categories
        const uniqueCategories = [...new Set(response.data.map(s => s.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const filteredServices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return services.filter((service) => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesTerm = !term
        || service.name?.toLowerCase().includes(term)
        || service.description?.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  }, [services, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Layanan Publik</h1>
          <p className="text-lg text-slate-600 max-w-2xl mb-8">
            Pilih layanan administrasi desa yang Anda butuhkan. Proses pengajuan mudah, cepat, dan transparan.
          </p>
          <div className="relative max-w-3xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 rounded-lg text-base transition-all shadow-sm"
              placeholder="Cari layanan spesifik (misal: Surat Keterangan Usaha)..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => handleCategoryFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-sky-600 text-white'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                selectedCategory === category
                  ? 'bg-sky-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
            </div>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const statusLabel = service.status === 'active'
                ? 'Aktif'
                : service.status === 'maintenance'
                  ? 'Pemeliharaan'
                  : 'Nonaktif';
              const statusStyle = service.status === 'active'
                ? 'bg-sky-100 text-sky-800'
                : service.status === 'maintenance'
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-slate-200 text-slate-600';
              const isActive = service.status === 'active';

              return (
                <div key={service.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-semibold tracking-wider uppercase text-sky-600">{service.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-slate-600 mb-6 flex-grow">{service.description}</p>
                  {isActive ? (
                    <Link to="/applications" className="w-full py-3 px-4 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 text-center">
                      Ajukan Sekarang
                    </Link>
                  ) : (
                    <button className="w-full py-3 px-4 bg-slate-100 text-slate-500 rounded-lg text-sm font-semibold cursor-not-allowed" disabled>
                      Sedang Dipelihara
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-600 text-lg">Tidak ada layanan dalam kategori ini</p>
          </div>
        )}
      </div>
    </div>
  );
};
