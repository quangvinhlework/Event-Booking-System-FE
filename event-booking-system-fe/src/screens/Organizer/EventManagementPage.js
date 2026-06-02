import React, { useMemo, useState } from 'react';
import { Badge, Form, InputGroup } from 'react-bootstrap';
import { useOrganizerEvent } from '../../hooks/event/useOrganizerEvent';
import { formatTimestamp } from '../../utils/dateConvert';
import CreateEventModal from './EventManagementModal/CreateEventModal';
import UpdateEventModal from './EventManagementModal/UpdateEventModal';
import { useEventMutations } from '../../hooks/event/useEventMutations';
import { eventFilters } from '../../filters/eventFilter';
import { LoadingOverlay } from '../../components';
import OrganizerLayout from './layouts/OrganizerLayout';
import { useCategory } from '../../hooks/useCategory';
import { useEventStatus } from '../../hooks/event/useEventStatus';
import EventFilterPanel from '../Event/EventFilterPanel';
import ConfirmCard from '../../components/confirmation/ConfirmCard';
import { showSuccessToast } from '../../utils/toast';

const getStartOfDayTimestamp = (date) => {
  if (!date) return '';
  return new Date(`${date}T00:00:00`).getTime();
};

const getEndOfDayTimestamp = (date) => {
  if (!date) return '';
  return new Date(`${date}T23:59:59.999`).getTime();
};

const EventManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [confirmConfig, setConfirmConfig] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: () => { },
    onCancel: () => { },
  });

  const closeConfirm = () => setConfirmConfig((prev) => ({ ...prev, show: false }));

  const [searchTerm, setSearchTerm] = useState('');
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const queryFilters = useMemo(
    () =>
      eventFilters.combine(
        eventFilters.byName(searchTerm),
        eventFilters.byCategory(selectedCategory),
        eventFilters.byStatus(selectedStatus),
        eventFilters.byLocation(location),
        eventFilters.byDateRange(
          getStartOfDayTimestamp(startDate),
          getEndOfDayTimestamp(endDate)
        ),
        eventFilters.byPriceRange(minPrice, maxPrice),
        eventFilters.bySort('startTime', sortDirection),
        eventFilters.byPage(page)
      ),
    [
      searchTerm,
      selectedCategory,
      selectedStatus,
      location,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      sortDirection,
      page,
    ]
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
  const { createEvent, updateEvent, deleteEvent, publishEvent, endEvent, loading: mutationLoading } =
    useEventMutations();
  const { categories } = useCategory();
  const { eventStatus } = useEventStatus();

  const translateStatus = (name) => {
    const s = String(name || '').toUpperCase();
    const map = {
      'DRAFT': 'Bản nháp',
      'ONSALE': 'Đang bán',
      'CANCELLED': 'Đã hủy',
      'ENDED': 'Kết thúc',
      'COMPLETED': 'Hoàn thành',
      'REJECTED': 'Từ chối'
    };
    return map[s] || name;
  };

  const statusOptions = useMemo(
    () => [
      { label: 'Tất cả trạng thái', value: '' },
      ...eventStatus.map((status) => ({
        label: translateStatus(status.name),
        value: status.name,
      })),
    ],
    [eventStatus]
  );

  const categoryOptions = useMemo(
    () => [
      { label: 'Tất cả', value: '' },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ],
    [categories]
  );

  const hasActiveFilters = Boolean(
    searchTerm ||
    selectedCategory ||
    selectedStatus ||
    location ||
    startDate ||
    endDate ||
    minPrice ||
    maxPrice
  );

  const activeFilterCount = [
    selectedCategory,
    selectedStatus,
    location,
    startDate,
    endDate,
    minPrice,
    maxPrice,
  ].filter(Boolean).length;

  const resetPage = () => setPage(1);

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocalSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setMinPrice('');
    setMaxPrice('');
    setSortDirection('asc');
    setPage(1);
  };

  const handleCategoryChip = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleLoadMore = () => setPage((p) => p + 1);

  const handleCreateEvent = async (eventData) => {
    try {
      await createEvent(eventData);
      showSuccessToast('Tạo sự kiện thành công');
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
      showSuccessToast('Cập nhật sự kiện thành công');
      setShowModifyModal(false);
      fetchEvents();
    } catch (err) {
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteEvent = (id) => {
    setConfirmConfig({
      show: true,
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa sự kiện này?',
      onConfirm: async () => {
        closeConfirm();
        try {
          await deleteEvent(id);
          showSuccessToast('Xóa sự kiện thành công');
          fetchEvents();
        } catch (err) {
          console.error('Error deleting event:', err);
        }
      },
      onCancel: closeConfirm,
    });
  };

  const handleClickPublishButton = async (eventId) => {
    try {
      await publishEvent(eventId);
      fetchEvents();
    } catch (err) {
      console.error('Error publishing event:', err);
    }
  };

  const handleClickEndButton = async (eventId) => {
    try {
      await endEvent(eventId);
      fetchEvents();
    } catch (err) {
      console.error('Error ending event:', err);
    }
  };

  const handleClickUpdateButton = async (id) => {
    const loadedEvent = await getEventById(id);
    if (loadedEvent) {
      setShowModifyModal(true);
    }
  };

  const getStatusClass = (statusName) => {
    const name = String(statusName || '').toUpperCase();
    if (['ONSALE', 'COMPLETED', 'ACTIVE', 'OPEN'].includes(name)) return 'organizer-status--success';
    if (['DRAFT', 'PENDING'].includes(name)) return 'organizer-status--warning';
    if (['CANCELLED', 'REJECTED'].includes(name)) return 'organizer-status--danger';
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
      <div className="organizer-filters">
        <div className="row g-3 align-items-end">
          <div className="col-lg-6">
            <Form.Label>Tìm kiếm</Form.Label>
            <InputGroup>
              <InputGroup.Text>⌕</InputGroup.Text>
              <Form.Control
                value={localSearchTerm}
                placeholder="Tên sự kiện..."
                onChange={(e) => {
                  setLocalSearchTerm(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchTerm(localSearchTerm);
                    resetPage();
                  }
                }}
              />
            </InputGroup>
          </div>
          <div className="col-md-6 col-lg-3">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                resetPage();
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
      </div>

      <div className="organizer-toolbar">
        <button
          type="button"
          className={`organizer-btn-outline${showFilters ? ' is-active' : ''}`}
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
        >
          Bộ lọc nâng cao
          {activeFilterCount > 0 && (
            <Badge bg="warning" text="dark" className="ms-2">
              {activeFilterCount}
            </Badge>
          )}
        </button>
        {hasActiveFilters && (
          <button type="button" className="organizer-btn-sm" onClick={handleResetFilters}>
            Xóa lọc
          </button>
        )}
      </div>

      {categories.length > 0 && (
        <div className="organizer-category-chips mb-3" role="tablist" aria-label="Lọc theo lĩnh vực">
          {categoryOptions.map((option) => (
            <button
              key={option.value || 'all'}
              type="button"
              role="tab"
              aria-selected={selectedCategory === option.value}
              className={`organizer-category-chip${selectedCategory === option.value ? ' is-active' : ''
                }`}
              onClick={() => handleCategoryChip(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {showFilters && (
        <EventFilterPanel
          id="organizer-event-filters"
          className="organizer-filters organizer-filters--advanced g-3"
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          location={location}
          startDate={startDate}
          endDate={endDate}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sortDirection={sortDirection}
          categoryOptions={categoryOptions.map((o) =>
            o.value === '' ? { ...o, label: 'Tất cả lĩnh vực' } : o
          )}
          statusOptions={statusOptions}
          onApplyFilters={(filters) => {
            setSelectedCategory(filters.selectedCategory);
            setSelectedStatus(filters.selectedStatus);
            setLocation(filters.location);
            setStartDate(filters.startDate);
            setEndDate(filters.endDate);
            setMinPrice(filters.minPrice);
            setMaxPrice(filters.maxPrice);
            setSortDirection(filters.sortDirection);
            resetPage();
          }}
          onResetFilters={handleResetFilters}
        />
      )}

      <LoadingOverlay loading={eventsLoading} text="Đang tải danh sách sự kiện..." />

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
            {!eventsLoading && events.length === 0 ? (
              <tr>
                <td colSpan={6} className="organizer-table__empty">
                  {hasActiveFilters
                    ? 'Không tìm thấy sự kiện phù hợp với bộ lọc.'
                    : 'Chưa có sự kiện. Bấm "Thêm sự kiện" để tạo mới.'}
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
                      {translateStatus(eventItem.status)}
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
        categories={categories}
      />
      <UpdateEventModal
        show={showModifyModal}
        onHide={() => setShowModifyModal(false)}
        eventData={event}
        onUpdate={handleUpdateEvent}
        updateLoading={mutationLoading}
        onPublish={handleClickPublishButton}
        onEnd={handleClickEndButton}
        categories={categories}
      />
      <ConfirmCard
        show={confirmConfig.show}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={confirmConfig.onCancel}
      />
    </OrganizerLayout>
  );
};

export default EventManagement;
