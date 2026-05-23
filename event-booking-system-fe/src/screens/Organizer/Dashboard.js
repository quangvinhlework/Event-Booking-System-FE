import React, { useEffect, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import ColumnChart from '../../components/chart/ColumnChart';
import { useEventStatistic } from '../../hooks/event/useEventStatistic';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';
import OrganizerLayout, { OrganizerStatCard } from './OrganizerLayout';

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
const currentYear = currentDate.getFullYear();

const mapStatisticToEvent = (statistic) => ({
  id: statistic.eventId,
  name: statistic.event?.name || `Sự kiện #${statistic.eventId}`,
  ticketsSold: Number(statistic.totalTicketsSold) || 0,
  revenue: Number(statistic.totalRevenue) || 0,
  views: Number(statistic.totalViews) || 0,
});

const Dashboard = () => {
  const [periodType, setPeriodType] = useState('month');
  const [month, setMonth] = useState(currentMonth);
  const [quarter, setQuarter] = useState(currentQuarter);
  const [year, setYear] = useState(currentYear);

  const {
    eventStatistics,
    loading: overviewLoading,
    error: overviewError,
    fetchEventStatistics,
  } = useEventStatistic();

  const {
    eventStatistics: performanceStatistics,
    loading: performanceLoading,
    error: performanceError,
    fetchEventStatisticsByMonth,
    fetchEventStatisticsByQuarter,
    fetchEventStatisticsByYear,
  } = useEventStatistic();

  useEffect(() => {
    fetchEventStatistics();
  }, []);

  useEffect(() => {
    if (periodType === 'month') {
      fetchEventStatisticsByMonth(month, year);
    }
    if (periodType === 'quarter') {
      fetchEventStatisticsByQuarter(quarter, year);
    }
    if (periodType === 'year') {
      fetchEventStatisticsByYear(year);
    }
  }, [periodType, month, quarter, year]);

  const overviewEvents = eventStatistics.map(mapStatisticToEvent);
  const performanceEvents = performanceStatistics
    .map(mapStatisticToEvent)
    .sort((a, b) => b.revenue - a.revenue);

  const totalEvents = overviewEvents.length;
  const totalTicketsSold = overviewEvents.reduce((t, e) => t + e.ticketsSold, 0);
  const totalRevenue = overviewEvents.reduce((t, e) => t + e.revenue, 0);
  const totalViews = overviewEvents.reduce((t, e) => t + e.views, 0);
  const periodTicketsSold = performanceEvents.reduce((t, e) => t + e.ticketsSold, 0);
  const periodRevenue = performanceEvents.reduce((t, e) => t + e.revenue, 0);

  return (
    <OrganizerLayout
      eyebrow="Tổng quan"
      title="Bảng điều khiển"
      subtitle="Theo dõi vé đã bán, doanh thu và lượt xem theo từng sự kiện — lọc theo tháng, quý hoặc năm."
    >
      {overviewError && <div className="organizer-alert organizer-alert--danger">{overviewError}</div>}

      {overviewLoading ? (
        <div className="organizer-loading">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <div className="organizer-stat-grid">
            <OrganizerStatCard label="Tổng sự kiện" value={formatNumber(totalEvents)} />
            <OrganizerStatCard label="Vé đã bán" value={formatNumber(totalTicketsSold)} variant="gold" />
            <OrganizerStatCard label="Doanh thu" value={formatCurrency(totalRevenue)} variant="gold" />
            <OrganizerStatCard label="Lượt xem" value={formatNumber(totalViews)} hint="Tổng lượt truy cập trang sự kiện" />
          </div>

          <section className="organizer-panel">
            <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
              <div>
                <h2 className="organizer-panel__title">Hiệu quả theo kỳ</h2>
                <p className="organizer-panel__desc mb-0">
                  Chọn khoảng thời gian để xem chi tiết từng sự kiện.
                </p>
              </div>

              <div className="organizer-toolbar">
                <Form.Select
                  style={{ width: 150 }}
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value)}
                  aria-label="Loại kỳ"
                >
                  <option value="month">Theo tháng</option>
                  <option value="quarter">Theo quý</option>
                  <option value="year">Theo năm</option>
                </Form.Select>

                {periodType === 'month' && (
                  <Form.Select
                    style={{ width: 120 }}
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    aria-label="Tháng"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((item) => (
                      <option key={item} value={item}>
                        Tháng {item}
                      </option>
                    ))}
                  </Form.Select>
                )}

                {periodType === 'quarter' && (
                  <Form.Select
                    style={{ width: 110 }}
                    value={quarter}
                    onChange={(e) => setQuarter(Number(e.target.value))}
                    aria-label="Quý"
                  >
                    <option value={1}>Quý 1</option>
                    <option value={2}>Quý 2</option>
                    <option value={3}>Quý 3</option>
                    <option value={4}>Quý 4</option>
                  </Form.Select>
                )}

                <Form.Control
                  type="number"
                  min="2000"
                  max="2100"
                  style={{ width: 110 }}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  aria-label="Năm"
                />
              </div>
            </div>

            {performanceError && (
              <div className="organizer-alert organizer-alert--danger">{performanceError}</div>
            )}

            {performanceLoading ? (
              <div className="organizer-loading py-4">
                <Spinner animation="border" size="sm" />
              </div>
            ) : (
              <>
                <div className="organizer-period-summary">
                  <div>
                    <span>Vé bán trong kỳ</span>
                    <strong>{formatNumber(periodTicketsSold)}</strong>
                  </div>
                  <div>
                    <span>Doanh thu trong kỳ</span>
                    <strong>{formatCurrency(periodRevenue)}</strong>
                  </div>
                </div>

                <div className="organizer-table-wrap mb-4">
                  <table className="organizer-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Sự kiện</th>
                        <th>Vé đã bán</th>
                        <th>Doanh thu</th>
                        <th>Lượt xem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceEvents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="organizer-table__empty">
                            Chưa có dữ liệu trong khoảng thời gian này.
                          </td>
                        </tr>
                      ) : (
                        performanceEvents.map((event, index) => (
                          <tr key={event.id}>
                            <td>{index + 1}</td>
                            <td className="fw-semibold">{event.name}</td>
                            <td>{formatNumber(event.ticketsSold)}</td>
                            <td>{formatCurrency(event.revenue)}</td>
                            <td>{formatNumber(event.views)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="organizer-charts-row">
                  <div className="organizer-chart-box">
                    <h3 className="organizer-panel__title" style={{ fontSize: '1.1rem' }}>
                      Biểu đồ doanh thu
                    </h3>
                    <ColumnChart
                      data={performanceEvents}
                      labelKey="name"
                      valueKey="revenue"
                      formatValue={formatCurrency}
                      color="#c9a962"
                    />
                  </div>
                  <div className="organizer-chart-box">
                    <h3 className="organizer-panel__title" style={{ fontSize: '1.1rem' }}>
                      Biểu đồ bán vé
                    </h3>
                    <ColumnChart
                      data={performanceEvents}
                      labelKey="name"
                      valueKey="ticketsSold"
                      formatValue={formatNumber}
                      color="#1f9d7a"
                    />
                  </div>
                </div>
              </>
            )}
          </section>
        </>
      )}
    </OrganizerLayout>
  );
};

export default Dashboard;
