import React from 'react';

const AuthBrandPanel = ({ title, titleEmphasis, description }) => (
  <aside className="auth-layout__brand" aria-hidden="false">
    <div className="auth-layout__brand-bg" />
    <div className="auth-layout__brand-orb" aria-hidden="true" />
    <div className="auth-layout__brand-content">
      <p className="auth-layout__brand-eyebrow">Event Booking</p>
      <h1 className="auth-layout__brand-title">
        {title}
        {titleEmphasis && <em> {titleEmphasis}</em>}
      </h1>
      <p className="auth-layout__brand-desc">{description}</p>
      <ul className="auth-layout__brand-features">
        <li>Đặt vé nhanh, giao diện cao cấp</li>
        <li>Hàng trăm sự kiện đa lĩnh vực</li>
        <li>Bảo mật & hỗ trợ 24/7</li>
      </ul>
    </div>
  </aside>
);

export default AuthBrandPanel;
