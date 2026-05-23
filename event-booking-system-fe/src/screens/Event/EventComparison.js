import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventHeaderCard from '../../components/event/EventHeaderCard';
import { handleApi } from '../../api/apiHandler';
import { axiosClientJson } from '../../api/axiosClient';

// ---COMPONENT CHÍNH ---
const EventComparison = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        // 1. Đọc danh sách từ localStorage
        const compareList = JSON.parse(localStorage.getItem('compareList')) || [];

        // 2. Kiểm tra điều kiện số lượng (từ 2 đến 3)
        if (compareList.length < 2 || compareList.length > 3) {
            setError('Vui lòng chọn từ 2 đến 3 sự kiện để tiến hành so sánh.');
            setLoading(false);
            return;
        }

        // 3. Kiểm tra điều kiện phải cùng lĩnh vực
        const firstCategoryId = compareList[0]?.category_id;
        const isSameCategory = compareList.every(item => item.category_id === firstCategoryId);

        if (!isSameCategory) {
            setError('Chỉ cho phép so sánh các sự kiện thuộc cùng một lĩnh vực.');
            setLoading(false);
            return;
        }

        // Gộp chuỗi ID để gửi lên server
        const idsParam = compareList.map(item => item.id).join(',');

        // 4. Định nghĩa hàm gọi API thông qua Axios Client & handleApi wrapper
        const fetchComparisonData = async () => {
            setLoading(true);

            // Khởi chạy qua handleApi, tự động bóc tách và trả về cấu trúc chuẩn hóa
            const result = await handleApi(() =>
                axiosClientJson.get(`/events/compare?ids=${idsParam}`)
            );

            if (result.success) {
                // result.data chính là response.data.data từ Backend của bạn
                const data = result.data || [];
                setEvents(data);
                if (data.length > 0) {
                    setCategoryName(data[0].category?.name || 'Sự kiện');
                }
            } else {
                // result.message chứa lỗi từ server hoặc lỗi kết nối mạng
                setError(result.message);
            }
            setLoading(false);
        };

        fetchComparisonData();
    }, []);

    // Tìm mức giá thấp nhất phục vụ nhãn "Giá tốt nhất"
    const minPrice = events.length > 0 ? Math.min(...events.map(e => Number(e.ticket_price || 0))) : 0;

    // Định dạng hiển thị tiền tệ VNĐ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
    };

    // Định dạng ngày giờ hiển thị theo thiết kế image_94fea8.png
    const formatDateTime = (startStr, endStr) => {

        const parseVNDate = (dateStr) => {
            if (!dateStr) return null;

            // Tách ngày và giờ
            const [datePart, timePart] = dateStr.split(' ');

            // dd/MM/yy
            const [day, month, year] = datePart.split('/');

            // HH:mm:ss
            const [hour, minute, second] = timePart.split(':');

            // Convert thành Date object
            return new Date(
                2000 + Number(year), // yy -> 20yy
                Number(month) - 1,   // month bắt đầu từ 0
                Number(day),
                Number(hour),
                Number(minute),
                Number(second)
            );
        };

        if (!startStr) return 'Chưa cập nhật';

        const start = parseVNDate(startStr);

        const dateStr = start.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const startTimeStr = start.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        let endTimeStr = '';

        if (endStr) {
            const end = parseVNDate(endStr);

            endTimeStr = end.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        return {
            date: dateStr,
            time: `${startTimeStr} — ${endTimeStr || 'Chưa định'}`
        };
    };

    const handleGoBack = () => window.history.back();
    const handleClearCompare = () => {
        localStorage.removeItem('compareList');
        window.location.reload();
    };

    if (loading) return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"></div><p className="mt-2">Đang tải dữ liệu đối chiếu...</p></div>;
    if (error) return <div className="container my-5"><div className="alert alert-danger shadow-sm text-center">{error}</div><button className="btn btn-primary d-block mx-auto" onClick={handleGoBack}>Quay lại</button></div>;

    return (
        <div className="container py-4" style={{ backgroundColor: '#faf9f6', borderRadius: '16px' }}>

            {/* TIÊU ĐỀ TRANG */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark m-0">So sánh sự kiện</h4>
                    <p className="text-muted small m-0 mt-1">
                        Lĩnh vực: <strong className="text-primary">{categoryName}</strong> - {events.length} sự kiện đang so sánh
                    </p>
                </div>
                <button className="btn btn-outline-dark btn-sm rounded-pill px-3" onClick={handleGoBack}>
                    ← Quay lại
                </button>
            </div>

            {/* BẢNG SO SÁNH NGANG */}
            <div className="table-responsive shadow-sm bg-white rounded-3 overflow-hidden">
                <table className="table table-bordered align-middle text-center m-0" style={{ tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th scope="col" className="text-start p-3 bg-light text-muted fw-semibold" style={{ width: '180px', borderBottomWidth: '2px' }}>Tiêu chí</th>
                            {events.map(event => (
                                <th key={event.id} scope="col" className="p-3 align-top" style={{ borderBottomWidth: '2px' }}>
                                    <EventHeaderCard event={event} isBestPrice={Number(event.ticket_price) === minPrice} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>

                        {/* Lĩnh vực */}
                        <tr>
                            <td className="text-start p-3 fw-semibold text-muted bg-light-subtle">🏷 Lĩnh vực</td>
                            {events.map(event => (
                                <td key={event.id} className="p-3 text-start">
                                    <span className="badge px-3 py-2 text-primary rounded-pill" style={{ backgroundColor: '#f0f2ff' }}>
                                        {event.category?.name}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        {/* Ngày diễn ra */}
                        <tr>
                            <td className="text-start p-3 fw-semibold text-muted bg-light-subtle">📅 Ngày diễn ra</td>
                            {events.map(event => {
                                const dt = formatDateTime(event.start_time, event.end_time);
                                return (
                                    <td key={event.id} className="p-3 text-start">
                                        <div className="fw-bold text-dark">{dt.date}</div>
                                        <div className="text-muted small">{dt.time}</div>
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Địa điểm */}
                        <tr>
                            <td className="text-start p-3 fw-semibold text-muted bg-light-subtle">📍 Địa điểm</td>
                            {events.map(event => {
                                const parts = event.location?.split(',') || [];
                                const mainLoc = parts[0];
                                const subLoc = parts.slice(1).join(',').trim();
                                return (
                                    <td key={event.id} className="p-3 text-start">
                                        <div className="fw-bold text-dark text-truncate">{mainLoc}</div>
                                        {subLoc && <div className="text-muted small text-truncate">{subLoc}</div>}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Giá vé */}
                        <tr>
                            <td className="text-start p-3 fw-semibold text-muted bg-light-subtle">💰 Giá vé</td>
                            {events.map(event => {
                                const isBest = Number(event.ticket_price) === minPrice;
                                return (
                                    <td key={event.id} className={`p-3 text-start fw-bold fs-5 ${isBest ? 'text-success' : 'text-dark'}`}>
                                        {formatCurrency(event.ticket_price)}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Vé còn lại */}
                        <tr>
                            <td className="text-start p-3 fw-semibold text-muted bg-light-subtle">🎟 Vé còn lại</td>
                            {events.map(event => {
                                const available = event.available_tickets || 0;
                                const total = event.total_tickets || 1;
                                const percent = (available / total) * 100;
                                const isUrgent = percent <= 20;

                                return (
                                    <td key={event.id} className="p-3 text-start">
                                        <div className="small fw-semibold text-primary mb-1">
                                            {available.toLocaleString()} / {total.toLocaleString()} vé
                                        </div>
                                        <div className="progress" style={{ height: '6px' }}>
                                            <div
                                                className={`progress-bar ${isUrgent ? 'bg-danger' : 'bg-success'}`}
                                                role="progressbar"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                        <span className="small mt-1 d-block" style={{ fontSize: '11px', color: isUrgent ? '#dc3545' : '#198754' }}>
                                            {isUrgent ? '⚠️ Sắp hết vé' : '✓ Còn nhiều chỗ'}
                                        </span>
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Lượt xem */}
                        <tr>
                            <td className="text-start p-3 fw-semibold text-muted bg-light-subtle">👁 Lượt xem</td>
                            {events.map(event => (
                                <td key={event.id} className="p-3 text-start">
                                    <span className="fw-bold text-dark">{(event.statistics?.total_views || 0).toLocaleString()}</span>
                                    <div className="text-muted small">lượt xem</div>
                                </td>
                            ))}
                        </tr>

                        {/* Đã bán */}
                        <tr>
                            <td className="text-start p-3 fw-semibold text-muted bg-light-subtle">📊 Đã bán</td>
                            {events.map(event => (
                                <td key={event.id} className="p-3 text-start">
                                    <span className="fw-bold text-dark">{(event.statistics?.total_tickets_sold || 0).toLocaleString()}</span>
                                    <div className="text-muted small">vé đã bán</div>
                                </td>
                            ))}
                        </tr>

                        {/* Có hình ảnh */}
                        <tr>
                            <td className="text-start p-3 fw-semibold text-muted bg-light-subtle">🖼 Có hình ảnh</td>
                            {events.map(event => (
                                <td key={event.id} className="p-3 text-start text-success fw-medium">
                                    {event.representative_image ? '✓ Có' : '✕ Không'}
                                </td>
                            ))}
                        </tr>

                        {/* Có video */}
                        <tr>
                            <td className="text-start p-3 fw-semibold text-muted bg-light-subtle">▶ Có video</td>
                            {events.map(event => (
                                <td key={event.id} className="p-3 text-start fw-medium">
                                    {event.video_url ? (
                                        <span className="text-success">✓ Có</span>
                                    ) : (
                                        <span className="text-muted">⊝ Không</span>
                                    )}
                                </td>
                            ))}
                        </tr>

                        {/* Hành động đặt mua */}
                        <tr>
                            <td className="bg-light-subtle"></td>
                            {events.map(event => (
                                <td key={event.id} className="p-3">
                                    <button className="btn btn-outline-dark w-100 py-2 fw-bold shadow-sm" style={{ borderRadius: '8px' }}>
                                        Mua vé ngay
                                    </button>
                                </td>
                            ))}
                        </tr>

                    </tbody>
                </table>
            </div>

            {/* FOOTER ĐIỀU HƯỚNG */}
            <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mt-4">
                <span className="text-muted small">Muốn thêm sự kiện khác vào so sánh?</span>
                <button className="btn btn-white border btn-sm text-dark px-3 py-2 bg-white" onClick={handleGoBack} style={{ borderRadius: '8px', fontWeight: '500' }}>
                    + Thêm sự kiện ↗
                </button>
                <button className="btn btn-light border btn-sm text-secondary px-3 py-2" onClick={handleClearCompare} style={{ borderRadius: '8px' }}>
                    Xóa & so sánh lại
                </button>
            </div>

            {/* Scoped CSS Custom */}
            <style>{`
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .bg-light-subtle {
          background-color: #fdfbf7 !important;
        }
      `}</style>

        </div>
    );
}

export default EventComparison;