import React from 'react';

const AuthBrandPanel = ({ title, titleEmphasis, description }) => (
  <aside className="auth-luxury__brand" aria-hidden="false">
    <div className="auth-luxury__brand-bg" />
    <div className="auth-luxury__brand-orb" aria-hidden="true" />
    <div className="auth-luxury__brand-content">
      <p className="auth-luxury__brand-eyebrow">Event Booking</p>
      <h1 className="auth-luxury__brand-title">
        {title}
        {titleEmphasis && <em> {titleEmphasis}</em>}
      </h1>
      <p className="auth-luxury__brand-desc">{description}</p>
      <ul className="auth-luxury__brand-features">
        <li>Đặt vé nhanh, giao diện cao cấp</li>
        <li>Hàng trăm sự kiện đa lĩnh vực</li>
        <li>Bảo mật & hỗ trợ 24/7</li>
      </ul>
    </div>
  </aside>
);

export default AuthBrandPanel;
