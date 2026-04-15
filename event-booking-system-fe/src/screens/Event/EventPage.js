import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

const EventPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('kw') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cateId') || 'all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const eventsPerPage = 6; // Số events mỗi trang

  const loadEvents = async () => {
    try {
      setLoading(true);

      // Giả lập URL với params
      // let url = `${endpoints['events']}?page=${page}`;
      // const cateId = searchParams.get("cateId");
      // if (cateId) {
      //   url = `${url}&cateId=${cateId}`;
      // }
      // const kw = searchParams.get("kw");
      // if (kw) {
      //   url = `${url}&kw=${kw}`;
      // }
      // let res = await Apis.get(url);

      // Giả lập với mock data
      await new Promise(resolve => setTimeout(resolve, 500));

      const kw = searchTerm;
      const cateId = selectedCategory;

      const filtered = mockEvents.filter((event) => {
        const matchSearch = event.title.toLowerCase().includes(kw.toLowerCase());
        const matchCategory = cateId === 'all' || event.category === cateId;
        return matchSearch && matchCategory;
      });

      const start = 0;
      const end = page * eventsPerPage;
      const newEvents = filtered.slice(start, end);

      if (page === 1) {
        setEvents(newEvents);
      } else {
        setEvents([...events, ...newEvents.slice(events.length)]);
      }

      setHasMore(end < filtered.length);
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [searchTerm, selectedCategory, page]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('kw', searchTerm);
    if (selectedCategory !== 'all') params.set('cateId', selectedCategory);
    navigate(`?${params.toString()}`, { replace: true });
  }, [searchTerm, selectedCategory, navigate]);

  const mockEvents = [
    {
      id: 1,
      title: 'Hòa nhạc - The Weeknd Live Tour',
      category: 'music',
      description: 'Buổi hòa nhạc của The Weeknd tại SVĐ Quốc tế Phú Thọ',
      date: '2026-05-15',
      time: '19:00',
      location: 'SVĐ Quốc tế Phú Thọ, TP.HCM',
      price: 499000,
      image: 'https://via.placeholder.com/300x200?text=The+Weeknd',
      availableTickets: 150,
      totalTickets: 500,
    },
    {
      id: 2,
      title: 'Giải bóng đá ASEAN Cup 2026',
      category: 'sports',
      description: 'Trận chung kết giải bóng đá ASEAN Cup giữa Việt Nam và Thái Lan',
      date: '2026-06-20',
      time: '20:00',
      location: 'Sân vận động Mỹ Đình, Hà Nội',
      price: 299000,
      image: 'https://via.placeholder.com/300x200?text=ASEAN+Cup',
      availableTickets: 500,
      totalTickets: 1000,
    },
    {
      id: 3,
      title: 'Hội thảo: Lập trình Web 2026',
      category: 'workshop',
      description: 'Hội thảo về các xu hướng mới trong lập trình web - React, Vue, Angular',
      date: '2026-05-25',
      time: '09:00',
      location: 'Trung tâm Hội chợ - Triển lãm Giảng Võ, Hà Nội',
      price: 99000,
      image: 'https://via.placeholder.com/300x200?text=Web+Workshop',
      availableTickets: 200,
      totalTickets: 300,
    },
    {
      id: 4,
      title: 'Lễ hội âm nhạc Indie Fest 2026',
      category: 'music',
      description: 'Lễ hội âm nhạc Indie lớn nhất Việt Nam với 20+ ban nhạc',
      date: '2026-07-10',
      time: '15:00',
      location: 'Công viên Tao Đàn, TP.HCM',
      price: 299000,
      image: 'https://via.placeholder.com/300x200?text=Indie+Fest',
      availableTickets: 1000,
      totalTickets: 2000,
    },
    {
      id: 5,
      title: 'Giải Marathon Hà Nội 2026',
      category: 'sports',
      description: 'Cuộc chạy marathon quy mô lớn lần thứ 5 tại Hà Nội',
      date: '2026-06-05',
      time: '06:00',
      location: 'Hồ Hoàn Kiếm, Hà Nội',
      price: 49000,
      image: 'https://via.placeholder.com/300x200?text=Marathon',
      availableTickets: 3000,
      totalTickets: 5000,
    },
    {
      id: 6,
      title: 'Triển lãm Nghệ thuật Hiện đại Việt Nam',
      category: 'exhibition',
      description: 'Triển lãm các tác phẩm nghệ thuật hiện đại từ các nghệ sĩ Việt Nam',
      date: '2026-08-01',
      time: '09:00',
      location: 'Bảo tàng Mỹ thuật Việt Nam, Hà Nội',
      price: 149000,
      image: 'https://via.placeholder.com/300x200?text=Art+Exhibition',
      availableTickets: 500,
      totalTickets: 800,
    },
    {
      id: 7,
      title: 'Triển lãm Nghệ thuật Hiện đại Việt Nam',
      category: 'exhibition',
      description: 'Triển lãm các tác phẩm nghệ thuật hiện đại từ các nghệ sĩ Việt Nam',
      date: '2026-08-01',
      time: '09:00',
      location: 'Bảo tàng Mỹ thuật Việt Nam, Hà Nội',
      price: 149000,
      image: 'https://via.placeholder.com/300x200?text=Art+Exhibition',
      availableTickets: 500,
      totalTickets: 800,
    },
    {
      id: 8,
      title: 'Triển lãm Nghệ thuật Hiện đại Việt Nam',
      category: 'exhibition',
      description: 'Triển lãm các tác phẩm nghệ thuật hiện đại từ các nghệ sĩ Việt Nam',
      date: '2026-08-01',
      time: '09:00',
      location: 'Bảo tàng Mỹ thuật Việt Nam, Hà Nội',
      price: 149000,
      image: 'https://via.placeholder.com/300x200?text=Art+Exhibition',
      availableTickets: 500,
      totalTickets: 800,
    },
    {
      id: 9,
      title: 'Triển lãm Nghệ thuật Hiện đại Việt Nam',
      category: 'exhibition',
      description: 'Triển lãm các tác phẩm nghệ thuật hiện đại từ các nghệ sĩ Việt Nam',
      date: '2026-08-01',
      time: '09:00',
      location: 'Bảo tàng Mỹ thuật Việt Nam, Hà Nội',
      price: 149000,
      image: 'https://via.placeholder.com/300x200?text=Art+Exhibition',
      availableTickets: 500,
      totalTickets: 800,
    }
  ];

  const filteredEvents = mockEvents.filter((event) => {
    const matchSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const categoryMap = {
    all: 'Tất cả',
    music: 'Âm nhạc',
    sports: 'Thể thao',
    workshop: 'Hội thảo',
    exhibition: 'Triển lãm',
  };

  const getCategoryColor = (category) => {
    const colors = {
      music: 'danger',
      sports: 'success',
      workshop: 'info',
      exhibition: 'warning',
    };
    return colors[category] || 'secondary';
  };

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="display-5 fw-bold mb-2">Sự kiện sắp diễn ra</h1>
          <p className="text-muted">Khám phá và đặt vé cho những sự kiện của bạn</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Tìm kiếm sự kiện</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Danh mục</Form.Label>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {Object.entries(categoryMap).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-5">
        {events.length > 0 ? (
          events.map((event) => (
            <Col key={event.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm hover-shadow" style={{ cursor: 'pointer' }}>
                <Card.Img
                  variant="top"
                  src={event.image}
                  alt={event.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="mb-2">
                    <Badge bg={getCategoryColor(event.category)}>
                      {categoryMap[event.category]}
                    </Badge>
                  </div>
                  <Card.Title className="fw-bold text-truncate">{event.title}</Card.Title>
                  <Card.Text className="text-muted small">{event.description}</Card.Text>

                  <div className="mb-3 text-muted small">
                    <div className="mb-2">
                      <i className="bi bi-calendar3"></i> {event.date} lúc {event.time}
                    </div>
                    <div className="mb-2">
                      <i className="bi bi-geo-alt"></i> {event.location}
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">
                      Vé còn lại: <strong>{event.availableTickets}</strong> / {event.totalTickets}
                    </small>
                    <div
                      className="progress"
                      style={{ height: '6px' }}
                    >
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${(event.availableTickets / event.totalTickets) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <h5 className="mb-0 text-danger fw-bold">
                      {event.price.toLocaleString('vi-VN')} đ
                    </h5>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleViewDetails(event.id)}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <div className="text-center py-5">
              <p className="text-muted">Không tìm thấy sự kiện phù hợp</p>
            </div>
          </Col>
        )}
      </Row>

      {hasMore && (
        <Row className="mb-5">
          <Col className="text-center">
            <Button
              variant="outline-primary"
              onClick={() => setPage(page + 1)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang tải...
                </>
              ) : (
                'Tải thêm sự kiện'
              )}
            </Button>
          </Col>
        </Row>
      )}

      {/* Thống kê
      <Row className="mt-5 py-4 bg-light rounded">
        <Col md={4} className="text-center border-end">
          <h4 className="text-primary fw-bold">{filteredEvents.length}</h4>
          <p className="text-muted">Sự kiện</p>
        </Col>
        <Col md={4} className="text-center border-end">
          <h4 className="text-success fw-bold">
            {filteredEvents.reduce((sum, e) => sum + e.availableTickets, 0).toLocaleString('vi-VN')}
          </h4>
          <p className="text-muted">Vé còn lại</p>
        </Col>
        <Col md={4} className="text-center">
          <h4 className="text-warning fw-bold">Đã sắp xếp</h4>
          <p className="text-muted">Theo ngày diễn ra</p>
        </Col>
      </Row> */}
    </Container>
  );
};

export default EventPage;
