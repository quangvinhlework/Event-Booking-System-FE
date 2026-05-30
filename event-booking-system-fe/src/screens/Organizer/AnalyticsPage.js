import React, { useEffect } from 'react';
import { LoadingState } from '../../components';
import ColumnChart from '../../components/chart/ColumnChart';
import { useEventStatistic } from '../../hooks/event/useEventStatistic';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';
import OrganizerLayout, { OrganizerStatCard } from './layouts/OrganizerLayout';

const currentYear = new Date().getFullYear();

const mapStatisticToEvent = (statistic) => ({
  id: statistic.eventId,
  name: statistic.event?.name || `Sự kiện #${statistic.eventId}`,
  ticketsSold: Number(statistic.totalTicketsSold) || 0,
  revenue: Number(statistic.totalRevenue) || 0,
  views: Number(statistic.totalViews) || 0,
});

const Analytics = () => {
  const {
    eventStatistics,
    loading,
    error,
    fetchEventStatistics,
    fetchEventStatisticsByYear,
  } = useEventStatistic();

  useEffect(() => {
    fetchEventStatistics();
    fetchEventStatisticsByYear(currentYear);
  }, []);

  const allEvents = eventStatistics.map(mapStatisticToEvent);
  const yearEvents = [...allEvents].sort((a, b) => b.revenue - a.revenue);
  const topByRevenue = yearEvents.slice(0, 5);

  const totalRevenue = allEvents.reduce((t, e) => t + e.revenue, 0);
  const totalTickets = allEvents.reduce((t, e) => t + e.ticketsSold, 0);
  const avgRevenuePerEvent = allEvents.length > 0 ? totalRevenue / allEvents.length : 0;

  return (
    <OrganizerLayout
      eyebrow="Báo cáo"
      title="Phân tích"
      subtitle={`Tổng hợp hiệu suất năm ${currentYear} — doanh thu, vé bán và lượt xem theo sự kiện.`}
    >


      {loading ? (
        <div className="organizer-loading">
          <LoadingState text="Đang tải dữ liệu phân tích..." />
        </div>
      ) : (
        <>
          <div className="organizer-stat-grid">
            <OrganizerStatCard
              label="Doanh thu tổng"
              value={formatCurrency(totalRevenue)}
              variant="gold"
            />
            <OrganizerStatCard label="Vé đã bán" value={formatNumber(totalTickets)} />
            <OrganizerStatCard
              label="TB doanh thu / sự kiện"
              value={formatCurrency(avgRevenuePerEvent)}
              hint="Trung bình trên tất cả sự kiện"
            />
            <OrganizerStatCard label="Sự kiện có dữ liệu" value={formatNumber(allEvents.length)} />
          </div>

          <div className="organizer-charts-row">
            <section className="organizer-panel">
              <h2 className="organizer-panel__title">Doanh thu theo sự kiện</h2>
              <p className="organizer-panel__desc">Top sự kiện theo doanh thu trong năm {currentYear}.</p>
              <div className="organizer-chart-box">
                <ColumnChart
                  data={topByRevenue}
                  labelKey="name"
                  valueKey="revenue"
                  formatValue={formatCurrency}
                  color="#c9a962"
                />
              </div>
            </section>

            <section className="organizer-panel">
              <h2 className="organizer-panel__title">Vé bán theo sự kiện</h2>
              <p className="organizer-panel__desc">Số lượng vé đã bán tương ứng từng sự kiện.</p>
              <div className="organizer-chart-box">
                <ColumnChart
                  data={topByRevenue}
                  labelKey="name"
                  valueKey="ticketsSold"
                  formatValue={formatNumber}
                  color="#1f9d7a"
                />
              </div>
            </section>
          </div>

          <section className="organizer-panel">
            <h2 className="organizer-panel__title">Bảng xếp hạng doanh thu</h2>
            <div className="organizer-table-wrap">
              <table className="organizer-table">
                <thead>
                  <tr>
                    <th>Hạng</th>
                    <th>Sự kiện</th>
                    <th>Vé bán</th>
                    <th>Doanh thu</th>
                    <th>Lượt xem</th>
                  </tr>
                </thead>
                <tbody>
                  {yearEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="organizer-table__empty">
                        Chưa có dữ liệu phân tích.
                      </td>
                    </tr>
                  ) : (
                    yearEvents.map((event, index) => (
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
          </section>
        </>
      )}
    </OrganizerLayout>
  );
};

export default Analytics;
