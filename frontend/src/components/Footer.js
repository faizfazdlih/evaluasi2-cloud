import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Pelayanan Publik</h3>
            <p className="text-gray-400">
              Sistem pelayanan publik desa/kelurahan untuk kemudahan administrasi masyarakat.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/services" className="hover:text-white">Surat Keterangan</Link></li>
              <li><Link to="/services" className="hover:text-white">Administrasi</Link></li>
              <li><Link to="/services" className="hover:text-white">Pencatatan Sipil</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Hubungi Kami</h4>
            <p className="text-gray-400">
              Kantor Desa/Kelurahan<br />
              Telepon: (123) 456-7890<br />
              Email: pelayanan@desa.id
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">
            &copy; 2024 Sistem Pelayanan Publik. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};
