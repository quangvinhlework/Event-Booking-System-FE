import React, { useEffect, useState } from 'react';
import { Container, Button, Table, Badge } from 'react-bootstrap';
import { useOrganizerEvent } from '../../hooks/event/useOrganizerEvent';
import { formatTimestamp } from '../../utils/dateConvert';
import CreateEventModal from './EventManagementModal/CreateEventModal';
import { useCreateEvent } from '../../hooks/event/useCreateEvent';
import UpdateEventModal from './EventManagementModal/UpdateEventModal';
import { useUpdateEvent } from '../../hooks/event/useUpdateEvent';

const EventManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const { events, fetchEvents, event, getEventById } = useOrganizerEvent();
  const { createEvent, loading: createLoading } = useCreateEvent();
  const { updateEvent, loading: updateLoading } = useUpdateEvent();

  useEffect(() => {
    fetchEvents();
  }, [showModal, fetchEvents]);

  const handleCreateEvent = async (eventData) => {
    try {
      await createEvent(eventData);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEvent = async (eventData, id) => {
    try {
      await updateEvent(eventData, id);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleClickUpdateButton = async (id) => {
    await getEventById(id);
    setShowModifyModal(true);
  };

  const getStatusVariant = (status) => {
    const normalizedStatus = String(status || '').toLowerCase();
    if (normalizedStatus.includes('active') || normalizedStatus.includes('open')) {
      return 'success';
    }
    if (normalizedStatus.includes('pending')) {
      return 'warning';
    }
    return 'secondary';
  };

  return (
    <Container className="app-page">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 section-heading">
        <div>
          <div className="section-eyebrow">Quản lý</div>
          <h1 className="section-title">Sự kiện</h1>
          <p className="section-subtitle">
            Tạo, cập nhật và theo dõi trạng thái các sự kiện của bạn.
          </p>
        </div>

        <div className="d-flex align-items-start">
          <Button onClick={() => setShowModal(true)}>
            Thêm sự kiện
          </Button>
        </div>
      </div>

      <div className="table-panel">
        <Table responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sự kiện</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {events.map((eventItem) => (
              <tr key={eventItem.id}>
                <td>{eventItem.id}</td>
                <td className="fw-semibold">{eventItem.name}</td>
                <td>{formatTimestamp(eventItem.startTime)}</td>
                <td>{formatTimestamp(eventItem.endTime)}</td>
                <td>
                  <Badge bg={getStatusVariant(eventItem.status)}>
                    {eventItem.status}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleClickUpdateButton(eventItem.id)}
                  >
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm">
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <CreateEventModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onCreate={handleCreateEvent}
        createLoading={createLoading}
      />
      <UpdateEventModal
        show={showModifyModal}
        onHide={() => setShowModifyModal(false)}
        eventData={event}
        onUpdate={handleUpdateEvent}
        updateLoading={updateLoading}
      />
    </Container>
  );
};

export default EventManagement;
