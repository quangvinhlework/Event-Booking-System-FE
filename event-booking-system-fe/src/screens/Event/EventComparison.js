import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import EventHeaderCard from '../../components/event/EventHeaderCard';
import { handleApi } from '../../api/apiHandler';
import { axiosClient } from '../../api/axiosClient';
import { EmptyState, LoadingState } from '../../components';
import { showErrorToast } from '../../utils/toast';

// ---COMPONENT CHÍNH ---
const EventComparison = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        // 1. Đọc danh sách từ localStorage
        const compareList = JSON.parse(localStorage.getItem('compareList')) || [];

        // 2. Kiểm tra điều kiện số lượng (từ 2 đến 3)
        if (compareList.length < 2 || compareList.length > 3) {
            showErrorToast('Vui lòng chọn từ 2 đến 3 sự kiện để tiến hành so sánh.');
            window.history.back();
            return;
        }

        // 3. Kiểm tra điều kiện phải cùng lĩnh vực
        const firstCategoryId = compareList[0]?.category_id;
        const isSameCategory = compareList.every(item => item.category_id === firstCategoryId);

        if (!isSameCategory) {
            showErrorToast('Chỉ cho phép so sánh các sự kiện thuộc cùng một lĩnh vực.');
            window.history.back();
            return;
        }

        // Gộp chuỗi ID để gửi lên server
        const idsParam = compareList.map(item => item.id).join(',');

        // 4. Định nghĩa hàm gọi API thông qua Axios Client & handleApi wrapper
        const fetchComparisonData = async () => {
            setLoading(true);

            // Khởi chạy qua handleApi, tự động bóc tách và trả về cấu trúc chuẩn hóa
            const result = await handleApi(() =>
                axiosClient.get(`/events/compare?ids=${idsParam}`)
            );

            if (result.success) {
                // result.data chính là response.data.data từ Backend của bạn
                const data = result.data || [];
                setEvents(data);
                if (data.length > 0) {
                    setCategoryName(data[0].category?.name || 'Sự kiện');
                }
            } else {
                // handleApi already showed the error toast
                window.history.back();
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

    // Định dạng ngày giờ hiển thị
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

    if (loading) {
        return (
            <div className="page-shell event-comparison-loading d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 72px)' }}>
                <LoadingState text="Đang tải dữ liệu đối chiếu..." />
            </div>
        );
    }


    return (
        <div className="page-shell event-comparison py-5">
            <div className="container">

                {/* TIÊU ĐỀ TRANG */}
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <p className="page-eyebrow mb-1">
                            Lĩnh vực: {categoryName}
                        </p>
                        <h1 className="page-title-lg m-0">So sánh sự kiện</h1>
                        <p className="text-muted small m-0 mt-1">
                            Đang đối chiếu {events.length} sự kiện thuộc cùng lĩnh vực
                        </p>
                    </div>
                    <button type="button" className="btn-back rounded-pill px-3" onClick={handleGoBack}>
                        ← Quay lại
                    </button>
                </div>

                {/* BẢNG SO SÁNH NGANG */}
                <div className="table-responsive comparison-table-panel shadow mb-5">
                    <table className="table comparison-table align-middle text-center" style={{ tableLayout: 'fixed' }}>
                        <thead>
                            <tr>
                                <th scope="col" className="table-criteria-cell">Tiêu chí</th>
                                {events.map(event => (
                                    <th key={event.id} scope="col" className="p-3 align-top">
                                        <EventHeaderCard event={event} isBestPrice={Number(event.ticket_price) === minPrice} />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>

                            {/* Lĩnh vực */}
                            <tr>
                                <td className="table-criteria-cell">🏷 Lĩnh vực</td>
                                {events.map(event => (
                                    <td key={event.id} className="p-3 text-start">
                                        <span className="badge-tag">
                                            {event.category?.name}
                                        </span>
                                    </td>
                                ))}
                            </tr>

                            {/* Ngày diễn ra */}
                            <tr>
                                <td className="table-criteria-cell">📅 Ngày diễn ra</td>
                                {events.map(event => {
                                    const dt = formatDateTime(event.start_time, event.end_time);
                                    return (
                                        <td key={event.id} className="p-3 text-start">
                                            <div className="fw-bold">{dt.date}</div>
                                            <div className="text-muted small">{dt.time}</div>
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Địa điểm */}
                            <tr>
                                <td className="table-criteria-cell">📍 Địa điểm</td>
                                {events.map(event => {
                                    const parts = event.location?.split(',') || [];
                                    const mainLoc = parts[0];
                                    const subLoc = parts.slice(1).join(',').trim();
                                    return (
                                        <td key={event.id} className="p-3 text-start">
                                            <div className="fw-bold text-truncate">{mainLoc}</div>
                                            {subLoc && <div className="text-muted small text-truncate">{subLoc}</div>}
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Giá vé */}
                            <tr>
                                <td className="table-criteria-cell">💰 Giá vé</td>
                                {events.map(event => {
                                    const isBest = Number(event.ticket_price) === minPrice;
                                    return (
                                        <td key={event.id} className="p-3 text-start fw-bold fs-5">
                                            <span style={{ color: isBest ? '#6ee7b7' : 'var(--theme-accent-light)' }}>
                                                {formatCurrency(event.ticket_price)}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Vé còn lại */}
                            <tr>
                                <td className="table-criteria-cell">🎟 Vé còn lại</td>
                                {events.map(event => {
                                    const available = event.available_tickets || 0;
                                    const total = event.total_tickets || 1;
                                    const percent = (available / total) * 100;
                                    const isUrgent = percent <= 20;

                                    return (
                                        <td key={event.id} className="p-3 text-start">
                                            <div className="small fw-semibold mb-1" style={{ color: 'var(--theme-accent-light)' }}>
                                                {available.toLocaleString()} / {total.toLocaleString()} vé
                                            </div>
                                            <div className="progress" style={{ height: '6px', backgroundColor: 'var(--theme-border)' }}>
                                                <div
                                                    className={`progress-bar ${isUrgent ? 'bg-danger' : 'bg-success'}`}
                                                    role="progressbar"
                                                    style={{ 
                                                        width: `${percent}%`,
                                                        background: isUrgent 
                                                            ? 'linear-gradient(90deg, #ef4444, #f87171)' 
                                                            : 'linear-gradient(90deg, #10b981, #34d399)'
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="small mt-1 d-block" style={{ fontSize: '11px', color: isUrgent ? '#f87171' : '#34d399', fontWeight: '600' }}>
                                                {isUrgent ? '⚠️ Sắp hết vé' : '✓ Còn nhiều chỗ'}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Lượt xem */}
                            <tr>
                                <td className="table-criteria-cell">👁 Lượt xem</td>
                                {events.map(event => (
                                    <td key={event.id} className="p-3 text-start">
                                        <span className="fw-bold">{(event.statistics?.total_views || 0).toLocaleString()}</span>
                                        <div className="text-muted small">lượt xem</div>
                                    </td>
                                ))}
                            </tr>

                            {/* Đã bán */}
                            <tr>
                                <td className="table-criteria-cell">📊 Đã bán</td>
                                {events.map(event => (
                                    <td key={event.id} className="p-3 text-start">
                                        <span className="fw-bold">{(event.statistics?.total_tickets_sold || 0).toLocaleString()}</span>
                                        <div className="text-muted small">vé đã bán</div>
                                    </td>
                                ))}
                            </tr>

                            {/* Có hình ảnh */}
                            <tr>
                                <td className="table-criteria-cell">🖼 Có hình ảnh</td>
                                {events.map(event => (
                                    <td key={event.id} className="p-3 text-start fw-medium">
                                        {event.representative_image ? (
                                            <span style={{ color: '#6ee7b7' }}>✓ Có</span>
                                        ) : (
                                            <span style={{ color: 'var(--theme-muted)' }}>✕ Không</span>
                                        )}
                                    </td>
                                ))}
                            </tr>

                            {/* Có video */}
                            <tr>
                                <td className="table-criteria-cell">▶ Có video</td>
                                {events.map(event => (
                                    <td key={event.id} className="p-3 text-start fw-medium">
                                        {event.video_url ? (
                                            <span style={{ color: '#6ee7b7' }}>✓ Có</span>
                                        ) : (
                                            <span style={{ color: 'var(--theme-muted)' }}>⊝ Không</span>
                                        )}
                                    </td>
                                ))}
                            </tr>

                            {/* Hành động đặt mua */}
                            <tr>
                                <td className="table-criteria-cell"></td>
                                {events.map(event => (
                                    <td key={event.id} className="p-3">
                                        <button 
                                            className="btn-primary-accent w-100 py-2 fw-bold text-uppercase" 
                                            style={{ borderRadius: '8px', fontSize: '0.8rem', letterSpacing: '0.05em' }}
                                            onClick={() => window.location.href = `/event/${event.id}`}
                                        >
                                            Đặt vé ngay
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
                    <button 
                        className="btn-ghost btn-sm rounded-3 py-2 px-3" 
                        onClick={handleGoBack} 
                        style={{ fontSize: '0.85rem', fontWeight: '600' }}
                    >
                        + Thêm sự kiện ↗
                    </button>
                    <button 
                        className="btn btn-outline-danger btn-sm rounded-3 py-2 px-3" 
                        onClick={handleClearCompare} 
                        style={{ fontSize: '0.85rem', fontWeight: '600', borderColor: 'rgba(220, 53, 69, 0.4)', color: '#f87171' }}
                    >
                        Xóa & so sánh lại
                    </button>
                </div>

                {/* Scoped CSS Custom */}
                <style>{`
                    .event-comparison-page {
                        background: var(--theme-ink);
                        color: var(--theme-text);
                        min-height: calc(100vh - 72px);
                    }
                    .comparison-table-panel {
                        background: var(--theme-surface);
                        border: 1px solid var(--theme-border);
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    }
                    .comparison-table {
                        color: var(--theme-text) !important;
                        border-color: var(--theme-border) !important;
                        margin-bottom: 0;
                    }
                    .comparison-table th, 
                    .comparison-table td {
                        border-color: var(--theme-border) !important;
                        background-color: transparent !important;
                        color: var(--theme-text) !important;
                        padding: 1.25rem 1rem !important;
                    }
                    .comparison-table thead th {
                        border-bottom: 2px solid var(--theme-border) !important;
                        background-color: var(--theme-surface-elevated) !important;
                    }
                    .comparison-table .table-criteria-cell {
                        background-color: var(--theme-ink-soft) !important;
                        color: var(--theme-muted) !important;
                        font-weight: 600;
                        text-align: left;
                        border-right: 1px solid var(--theme-border) !important;
                        width: 180px;
                    }
                    .text-truncate-2 {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;  
                        overflow: hidden;
                    }
                `}</style>

            </div>
        </div>
    );
}

export default EventComparison;