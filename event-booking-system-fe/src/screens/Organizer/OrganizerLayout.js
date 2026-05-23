import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './OrganizerPage.css';

const NAV_ITEMS = [
  {
    to: '/organizer/dashboard',
    label: 'Tổng quan',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: '/organizer/events',
    label: 'Sự kiện',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    to: '/organizer/tickets',
    label: 'Vé',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v2a3 3 0 0 0 0 6v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-2a3 3 0 0 0 0-6V9z" />
        <path d="M9 9h.01M15 9h.01" />
      </svg>
    ),
  },
  {
    to: '/organizer/analytics',
    label: 'Phân tích',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-6 4 3 5-8" />
      </svg>
    ),
  },
];

export const OrganizerStatCard = ({ label, value, hint, variant = 'default' }) => (
  <div className={`organizer-stat-card organizer-stat-card--${variant}`}>
    <span className="organizer-stat-card__label">{label}</span>
    <strong className="organizer-stat-card__value">{value}</strong>
    {hint && <p className="organizer-stat-card__hint">{hint}</p>}
  </div>
);

const OrganizerLayout = ({ eyebrow = 'Organizer', title, subtitle, actions, children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="organizer-shell lux-page">
      <aside className="organizer-sidebar">
        <div className="organizer-sidebar__brand">
          <span className="organizer-sidebar__eyebrow">Event Booking</span>
          <strong>Bảng điều khiển</strong>
        </div>

        <nav className="organizer-sidebar__nav" aria-label="Menu tổ chức viên">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `organizer-sidebar__link${isActive ? ' is-active' : ''}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="organizer-sidebar__footer">
          <button type="button" className="organizer-sidebar__ghost" onClick={() => navigate('/')}>
            ← Về trang chủ
          </button>
          <div className="organizer-sidebar__user">
            <span>{user?.fullName || 'Tổ chức viên'}</span>
            <button type="button" onClick={logout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <div className="organizer-main">
        <header className="organizer-page-header">
          <div>
            <p className="organizer-page-header__eyebrow">{eyebrow}</p>
            <h1 className="organizer-page-header__title">{title}</h1>
            {subtitle && <p className="organizer-page-header__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="organizer-page-header__actions">{actions}</div>}
        </header>
        <div className="organizer-page-content">{children}</div>
      </div>
    </div>
  );
};

export default OrganizerLayout;
