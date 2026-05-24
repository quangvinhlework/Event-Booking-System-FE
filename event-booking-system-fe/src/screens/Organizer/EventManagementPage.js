import React, { useEffect, useMemo, useState } from 'react';
import { useOrganizerEvent } from '../../hooks/event/useOrganizerEvent';
import { formatTimestamp } from '../../utils/dateConvert';
import CreateEventModal from './EventManagementModal/CreateEventModal';
import UpdateEventModal from './EventManagementModal/UpdateEventModal';
import { useEventMotations } from '../../hooks/event/useEventMotations';
import { eventFilters } from '../../filters/eventFilter';
import { LoadingState } from '../../components';
import OrganizerLayout from './layouts/OrganizerLayout';

const EventManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [page, setPage] = useState(1);

  const queryFilters = useMemo(
    () => eventFilters.combine(eventFilters.byPage(page)),
    [page]
  );

  const {
    events,
    fetchEvents,
    event,
    getEventById,
    hasMore,
    loading: eventsLoading,
  } = useOrganizerEvent(queryFilters, {
    autoFetch: true,
    append: page > 1,
  });
  const { createEvent, updateEvent, deleteEvent, loading: mutationLoading } = useEventMotations();

  useEffect(() => {
    fetchEvents({ page });
  }, [showModal, fetchEvents, page]);

  const handleLoadMore = () => setPage((p) => p + 1);

  const handleCreateEvent = async (eventData) => {
    try {
      await createEvent(eventData);
      setShowModal(false);
      setPage(1);
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const handleUpdateEvent = async (eventData, id) => {
    try {
      await updateEvent(eventData, id);
      setShowModifyModal(false);
      fetchEvents();
    } catch (err) {
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      try {
        await deleteEvent(id);
        fetchEvents();
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleClickUpdateButton = async (id) => {
    await getEventById(id);
    setShowModifyModal(true);
  };

  const getStatusClass = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('active') || s.includes('open') || s.includes('onsale')) return 'organizer-status--success';
    if (s.includes('pending')) return 'organizer-status--warning';
    return 'organizer-status--muted';
  };

  return (
    <OrganizerLayout
      eyebrow="Quản lý"
      title="Sự kiện"
      subtitle="Tạo, chỉnh sửa và theo dõi trạng thái các sự kiện của bạn."
      actions={
        <button type="button" className="organizer-btn-primary" onClick={() => setShowModal(true)}>
          + Thêm sự kiện
        </button>
      }
    >
      {eventsLoading && events.length === 0 ? (
        <LoadingState text="Đang tải danh sách sự kiện..." />
      ) : (
      <div className="organizer-table-wrap">
        <table className="organizer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sự kiện</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="organizer-table__empty">
                  Chưa có sự kiện. Bấm &quot;Thêm sự kiện&quot; để tạo mới.
                </td>
              </tr>
            ) : (
              events.map((eventItem) => (
                <tr key={eventItem.id}>
                  <td className="text-muted">#{eventItem.id}</td>
                  <td className="fw-semibold">{eventItem.name}</td>
                  <td>{formatTimestamp(eventItem.startTime)}</td>
                  <td>{formatTimestamp(eventItem.endTime)}</td>
                  <td>
                    <span className={`organizer-status ${getStatusClass(eventItem.status)}`}>
                      {eventItem.status}
                    </span>
                  </td>
                  <td>
                    <div className="organizer-row-actions">
                      <button
                        type="button"
                        className="organizer-btn-sm organizer-btn-sm--gold"
                        onClick={() => handleClickUpdateButton(eventItem.id)}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="organizer-btn-sm organizer-btn-sm--danger"
                        onClick={() => handleDeleteEvent(eventItem.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      )}

      {events.length > 0 && hasMore && (
        <div className="organizer-load-more">
          <button
            type="button"
            className="organizer-btn-outline"
            onClick={handleLoadMore}
            disabled={eventsLoading}
          >
            {eventsLoading ? 'Đang tải...' : 'Tải thêm sự kiện'}
          </button>
        </div>
      )}

      <CreateEventModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onCreate={handleCreateEvent}
        createLoading={mutationLoading}
      />
      <UpdateEventModal
        show={showModifyModal}
        onHide={() => setShowModifyModal(false)}
        eventData={event}
        onUpdate={handleUpdateEvent}
        updateLoading={mutationLoading}
      />
    </OrganizerLayout>
  );
};

export default EventManagement;
