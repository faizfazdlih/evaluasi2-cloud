import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .navbar-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .nav-link {
          position: relative;
          font-size: 0.875rem;
          font-weight: 500;
          color: #4b5563;
          letter-spacing: 0.01em;
          text-decoration: none;
          padding-bottom: 2px;
          transition: color 0.2s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #1d4ed8;
          transition: width 0.25s ease;
        }

        .nav-link:hover {
          color: #1d4ed8;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #dc2626;
          background: #fff;
          border: 1.5px solid #fca5a5;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          letter-spacing: 0.01em;
        }

        .btn-logout:hover {
          background: #fef2f2;
          border-color: #dc2626;
        }

        .btn-login {
          padding: 7px 18px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1d4ed8;
          background: #fff;
          border: 1.5px solid #bfdbfe;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
          letter-spacing: 0.01em;
        }

        .btn-login:hover {
          background: #eff6ff;
          border-color: #1d4ed8;
        }

        .btn-register {
          padding: 7px 18px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #fff;
          background: #1d4ed8;
          border: 1.5px solid #1d4ed8;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
          letter-spacing: 0.01em;
        }

        .btn-register:hover {
          background: #1e40af;
          border-color: #1e40af;
        }

        .user-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 5px 8px;
          border-radius: 999px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .user-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 700;
          flex-shrink: 0;
          text-transform: uppercase;
        }

        .user-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1e293b;
        }

        .mobile-link {
          display: block;
          padding: 11px 20px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          border-radius: 8px;
          margin: 2px 0;
          transition: background 0.15s, color 0.15s;
        }

        .mobile-link:hover {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .mobile-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 8px 0;
        }

        .mobile-user-section {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          margin-bottom: 4px;
        }

        .mobile-user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }

        .mobile-user-role {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 1px;
          text-transform: capitalize;
        }

        .mobile-btn-logout {
          width: calc(100% - 40px);
          margin: 0 20px 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #dc2626;
          background: #fff;
          border: 1.5px solid #fca5a5;
          cursor: pointer;
          transition: background 0.2s;
        }

        .mobile-btn-logout:hover {
          background: #fef2f2;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: #1d4ed8;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-text {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .logo-text span {
          color: #1d4ed8;
        }

        .hamburger-btn {
          padding: 8px;
          border-radius: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #374151;
          display: flex;
          align-items: center;
          transition: background 0.15s;
        }

        .hamburger-btn:hover {
          background: #f1f5f9;
        }

        .mobile-menu {
          border-top: 1px solid #f1f5f9;
          padding: 8px 0 12px;
          animation: slideDown 0.18s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dot-separator {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #cbd5e1;
          flex-shrink: 0;
        }
      `}</style>

      <nav className="navbar-root sticky top-0 z-50 bg-white border-b border-slate-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between" style={{ height: '64px', alignItems: 'center' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div className="logo-icon">
                <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>!</span>
              </div>
              <span className="logo-text">
                TERAS WARGA<span>WLE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center" style={{ gap: '32px' }}>
              <Link to="/" className="nav-link">Beranda</Link>
              <Link to="/services" className="nav-link">Layanan</Link>

              {isAuthenticated ? (
                <>
                  {!['admin', 'staff'].includes(user?.role) && (
                    <Link to="/applications" className="nav-link">Permohonan Saya</Link>
                  )}
                  {['admin', 'staff'].includes(user?.role) && (
                    <Link to="/admin" className="nav-link">Admin Panel</Link>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="user-badge">
                      <div className="user-avatar">
                        {user?.username?.charAt(0) || 'U'}
                      </div>
                      <span className="user-name">{user?.username}</span>
                    </div>
                    <button onClick={handleLogout} className="btn-logout">
                      <LogOut style={{ width: '13px', height: '13px' }} />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Link to="/login" className="btn-login">Login</Link>
                  <Link to="/register" className="btn-register">Daftar</Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="hamburger-btn">
                {isOpen
                  ? <X style={{ width: '20px', height: '20px' }} />
                  : <Menu style={{ width: '20px', height: '20px' }} />
                }
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="mobile-menu md:hidden">
              <Link to="/" className="mobile-link" onClick={() => setIsOpen(false)}>Beranda</Link>
              <Link to="/services" className="mobile-link" onClick={() => setIsOpen(false)}>Layanan</Link>

              {isAuthenticated ? (
                <>
                  {!['admin', 'staff'].includes(user?.role) && (
                    <Link to="/applications" className="mobile-link" onClick={() => setIsOpen(false)}>
                      Permohonan Saya
                    </Link>
                  )}
                  {['admin', 'staff'].includes(user?.role) && (
                    <Link to="/admin" className="mobile-link" onClick={() => setIsOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <div className="mobile-divider" />
                  <div className="mobile-user-section">
                    <div className="user-avatar" style={{ width: '34px', height: '34px', fontSize: '0.8rem' }}>
                      {user?.username?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="mobile-user-name">{user?.username}</div>
                      <div className="mobile-user-role">{user?.role || 'pengguna'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="mobile-btn-logout"
                  >
                    <LogOut style={{ width: '14px', height: '14px' }} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="mobile-divider" />
                  <div style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px',
                        textAlign: 'center',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#1d4ed8',
                        border: '1.5px solid #bfdbfe',
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px',
                        textAlign: 'center',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#fff',
                        background: '#1d4ed8',
                        border: '1.5px solid #1d4ed8',
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      Daftar
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};