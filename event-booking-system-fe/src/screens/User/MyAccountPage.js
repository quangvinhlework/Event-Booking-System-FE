import React, { useEffect, useMemo, useState } from 'react';

import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';

import { EmptyState, FormField, LoadingOverlay, LoadingState } from '../../components';

import { TICKET_STATUS, getTicketStatusDisplay } from '../../constants/statuses/ticketStatus';

import { EMPTY_TICKET_FILTERS } from '../../filters/ticketFilter';

import { useMyTickets } from '../../hooks/ticket/useMyTickets';

import { useAuth } from '../../hooks/useAuth';

import { formatTimestamp } from '../../utils/dateConvert';

import './MyAccountPage.css';



const TABS = {

  PROFILE: 'profile',

  TICKETS: 'tickets',

};



const TAB_ITEMS = [

  { id: TABS.PROFILE, label: 'Thông tin tài khoản' },

  { id: TABS.TICKETS, label: 'Vé của tôi' },

];



const ROLE_LABELS = {

  USER: 'Người dùng',

  ORGANIZER: 'Tổ chức viên',

  ADMIN: 'Quản trị viên',

};



const getRoleLabel = (roleName) => ROLE_LABELS[roleName] || roleName || 'Thành viên';



const getInitials = (name) => {

  if (!name?.trim()) return '?';

  return name

    .trim()

    .split(/\s+/)

    .slice(0, 2)

    .map((part) => part[0])

    .join('')

    .toUpperCase();

};



const MyAccountPage = () => {

  const navigate = useNavigate();

  const { user, loading, updateMyInfo, logout } = useAuth();

  const [activeTab, setActiveTab] = useState(TABS.PROFILE);

  const { tickets, loading: ticketsLoading, error: ticketsError } = useMyTickets(
    EMPTY_TICKET_FILTERS,
    { autoFetch: activeTab === TABS.TICKETS }
  );

  const [fullName, setFullName] = useState('');

  const [avatarFile, setAvatarFile] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState('');

  const [saving, setSaving] = useState(false);

  const [notice, setNotice] = useState('');

  const [error, setError] = useState('');



  useEffect(() => {

    if (!user) return;

    setFullName(user.fullName || '');

    if (!avatarFile) {

      setAvatarPreview(user.avatarUrl || '');

    }

  }, [user, avatarFile]);



  const displayAvatar = avatarPreview || user?.avatarUrl || '';

  const isUserRole = user?.roleName === 'USER';



  const ticketSummary = useMemo(() => {

    const upcoming = tickets.filter((t) => t.status === TICKET_STATUS.PAID).length;

    return {

      total: tickets.length,

      upcoming,

      checkedIn: tickets.filter((t) => t.status === TICKET_STATUS.CHECKED_IN).length,

    };

  }, [tickets]);



  const handleAvatarChange = (event) => {

    const file = event.target.files?.[0];

    if (!file) return;



    if (!file.type.startsWith('image/')) {

      setError('Vui lòng chọn file ảnh (JPG, PNG, GIF).');

      return;

    }



    if (file.size > 5 * 1024 * 1024) {

      setError('Ảnh đại diện không được vượt quá 5MB.');

      return;

    }



    setError('');

    setAvatarFile(file);

    const reader = new FileReader();

    reader.onloadend = () => setAvatarPreview(reader.result);

    reader.readAsDataURL(file);

  };



  const handleSaveProfile = async (event) => {

    event.preventDefault();

    setError('');

    setNotice('');



    if (!fullName.trim()) {

      setError('Họ và tên không được để trống.');

      return;

    }



    setSaving(true);

    try {

      const payload = { fullName: fullName.trim() };

      if (avatarFile) {

        payload.avatar = avatarFile;

      }

      await updateMyInfo(payload);

      setAvatarFile(null);

      setNotice('Cập nhật thông tin tài khoản thành công.');

    } catch (err) {

      setError(err.message || 'Không thể cập nhật thông tin tài khoản.');

    } finally {

      setSaving(false);

    }

  };



  if (loading && !user) {

    return (

      <main className="page-shell my-account-page">

        <Container className="py-5">

          <LoadingState text="Đang tải tài khoản..." />

        </Container>

      </main>

    );

  }



  if (!user) {

    return (

      <main className="page-shell my-account-page">

        <Container className="py-5">

          <EmptyState

            title="Chưa có thông tin tài khoản"

            description="Vui lòng đăng nhập lại để xem trang này."

          />

        </Container>

      </main>

    );

  }



  return (

    <main className="page-shell app-page my-account-page">

      <LoadingOverlay loading={saving} text="Đang lưu thông tin..." />



      <Container>

        <div className="section-heading">

          <p className="section-eyebrow page-eyebrow">Tài khoản</p>

          <h1 className="section-title page-title-lg h2">Tài khoản của tôi</h1>

          <p className="section-subtitle">

            Quản lý thông tin cá nhân và theo dõi vé đã đặt trên nền tảng.

          </p>

        </div>



        {notice && (

          <div className="my-account-alert my-account-alert--success">

            <span>{notice}</span>

            <button type="button" onClick={() => setNotice('')} aria-label="Đóng thông báo">

              ×

            </button>

          </div>

        )}



        {error && (

          <div className="my-account-alert my-account-alert--danger">

            <span>{error}</span>

            <button type="button" onClick={() => setError('')} aria-label="Đóng lỗi">

              ×

            </button>

          </div>

        )}



        <div className="my-account-stats">

          <div className="my-account-stat">

            <span>Tổng vé</span>

            <strong>{ticketSummary.total}</strong>

          </div>

          <div className="my-account-stat">

            <span>Chưa check-in</span>

            <strong>{ticketSummary.upcoming}</strong>

          </div>

          <div className="my-account-stat">

            <span>Đã check-in</span>

            <strong>{ticketSummary.checkedIn}</strong>

          </div>

        </div>



        <Row className="g-4">

          <Col lg={8}>

            <nav className="my-account-tabs" aria-label="Mục tài khoản">

              {TAB_ITEMS.map((tab) => (

                <button

                  key={tab.id}

                  type="button"

                  className={`my-account-tab${activeTab === tab.id ? ' is-active' : ''}`}

                  aria-current={activeTab === tab.id ? 'page' : undefined}

                  onClick={() => setActiveTab(tab.id)}

                >

                  {tab.label}

                </button>

              ))}

            </nav>



            {activeTab === TABS.PROFILE && (

              <div className="my-account-panel">

                <Form className="my-account-form" onSubmit={handleSaveProfile}>

                  <div className="my-account-profile">

                    <div className="my-account-avatar-wrap">

                      <div className="my-account-avatar">

                        {displayAvatar ? (

                          <img src={displayAvatar} alt="" />

                        ) : (

                          <span className="my-account-avatar-placeholder">

                            {getInitials(fullName || user.fullName)}

                          </span>

                        )}

                      </div>

                      <FormField

                        controlId="avatar"

                        label="Ảnh đại diện"

                        type="file"

                        name="avatar"

                        accept="image/*"

                        onChange={handleAvatarChange}

                      />

                      <div className="my-account-badges mt-2">

                        <span className="my-account-role">{getRoleLabel(user.roleName)}</span>

                        <span

                          className={`my-account-status${

                            user.active ? ' my-account-status--active' : ''

                          }`}

                        >

                          {user.active ? 'Đang hoạt động' : 'Đã khóa'}

                        </span>

                      </div>

                    </div>



                    <div>

                      <Row className="g-3">

                        <Col md={6}>

                          <FormField

                            controlId="fullName"

                            label="Họ và tên"

                            name="fullName"

                            value={fullName}

                            onChange={(e) => setFullName(e.target.value)}

                            required

                          />

                        </Col>

                        <Col md={6}>

                          <FormField

                            controlId="email"

                            label="Email"

                            type="email"

                            name="email"

                            value={user.email || ''}

                            disabled

                          />

                        </Col>

                        <Col md={6}>

                          <FormField

                            controlId="roleName"

                            label="Vai trò"

                            name="roleName"

                            value={getRoleLabel(user.roleName)}

                            disabled

                          />

                        </Col>

                        <Col md={6}>

                          <FormField

                            controlId="roleId"

                            label="Mã vai trò"

                            name="roleId"

                            value={user.roleId != null ? String(user.roleId) : '—'}

                            disabled

                          />

                        </Col>

                      </Row>



                      <div className="my-account-actions">

                        <button type="submit" className="btn-primary-accent" disabled={saving}>

                          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}

                        </button>

                      </div>

                    </div>

                  </div>

                </Form>

              </div>

            )}



            {activeTab === TABS.TICKETS && (

              <div className="my-account-panel">

                {ticketsLoading ? (

                  <LoadingState text="Đang tải vé của bạn..." />

                ) : ticketsError ? (

                  <EmptyState

                    title="Không tải được vé"

                    description={ticketsError}

                  />

                ) : tickets.length === 0 ? (

                  <EmptyState

                    title="Chưa có vé nào"

                    description="Khám phá sự kiện và đặt vé để xem tại đây."

                  />

                ) : (

                  <div className="my-account-ticket-list">

                    {tickets.map((ticket) => {

                      const status = getTicketStatusDisplay(ticket.status);

                      const checkInLabel = ticket.checkInTime

                        ? formatTimestamp(ticket.checkInTime)

                        : 'Chưa check-in';



                      return (

                        <article key={ticket.id} className="my-account-ticket">

                          <div>

                            <h3>Sự kiện #{ticket.eventId}</h3>

                            <p className="my-account-ticket-meta">

                              Mã vé {ticket.ticketCode} · Đơn hàng #{ticket.orderId}

                            </p>

                            <p className="my-account-ticket-meta">Check-in: {checkInLabel}</p>

                          </div>

                          <div>

                            <span className={`badge-tag ${status.badgeClassName}`}>{status.label}</span>

                          </div>

                          <div className="my-account-ticket-actions">

                            <button

                              type="button"

                              className="btn-ghost"

                              onClick={() => navigate(`/event/${ticket.eventId}`)}
                            >

                              Xem sự kiện

                            </button>

                          </div>

                        </article>

                      );

                    })}

                  </div>

                )}

              </div>

            )}

          </Col>



          <Col lg={4}>

            <aside className="my-account-sidebar-card my-account-sidebar-card--profile">

              <div className="my-account-sidebar-avatar">

                {displayAvatar ? (

                  <img src={displayAvatar} alt="" />

                ) : (

                  <span>{getInitials(user.fullName)}</span>

                )}

              </div>

              <h2>{user.fullName || 'Thành viên'}</h2>

              <p className="my-account-ticket-meta">{user.email}</p>

              <div className="my-account-badges my-account-badges--start mb-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>

                <span className="my-account-role">{getRoleLabel(user.roleName)}</span>

                <span

                  className={`my-account-status${

                    user.active ? ' my-account-status--active' : ''

                  }`}

                >

                  {user.active ? 'Hoạt động' : 'Đã khóa'}

                </span>

              </div>



              {isUserRole && (

                <Button

                  variant="outline-warning"

                  size="sm"

                  className="mb-2 w-100"

                  onClick={() => navigate('/become-organizer')}

                >

                  Trở thành tổ chức viên

                </Button>

              )}

              <Button variant="outline-danger" size="sm" className="w-100" onClick={logout}>

                Đăng xuất

              </Button>

            </aside>



            <aside className="my-account-sidebar-card">

              <h2>Gợi ý</h2>

              <ul>

                <li>Chỉnh họ tên hoặc ảnh đại diện rồi bấm Lưu thay đổi.</li>

                <li>Email và vai trò do hệ thống quản lý, không chỉnh trên form.</li>

                <li>Tab Vé của tôi hiển thị vé từ tài khoản đã đăng nhập.</li>

              </ul>

            </aside>

          </Col>

        </Row>

      </Container>

    </main>

  );

};



export default MyAccountPage;

