import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { FormField } from '../../components';

const SORT_OPTIONS = [
  { label: 'Ngày diễn ra tăng dần', value: 'asc' },
  { label: 'Ngày diễn ra giảm dần', value: 'desc' },
];

/** UI bộ lọc sự kiện (không nhầm với `filters/eventFilter.js` — query API) */
const EventFilterPanel = ({
  id,
  selectedCategory,
  selectedStatus,
  location,
  startDate,
  endDate,
  minPrice,
  maxPrice,
  sortDirection,
  categoryOptions,
  statusOptions,
  onCategoryChange,
  onStatusChange,
  onLocationChange,
  onStartDateChange,
  onEndDateChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortDirectionChange,
  onResetFilters,
  className = 'surface-card p-3 p-md-4 mb-4 g-3',
}) => {
  return (
    <Row id={id} className={className}>
      {statusOptions && (
        <Col md={6} lg={4}>
          <FormField
            labelClassName="fw-bold"
            label="Trạng thái"
            name="selectedStatus"
            value={selectedStatus}
            onChange={onStatusChange}
            options={statusOptions}
          />
        </Col>
      )}

      <Col md={6} lg={4}>
        <FormField
          labelClassName="fw-bold"
          label="Lĩnh vực"
          name="selectedCategory"
          value={selectedCategory}
          onChange={onCategoryChange}
          options={categoryOptions}
        />
      </Col>

      <Col md={6} lg={4}>
        <FormField
          labelClassName="fw-bold"
          label="Địa điểm"
          name="location"
          value={location}
          onChange={onLocationChange}
          placeholder="Nhập địa điểm..."
        />
      </Col>

      <Col md={6} lg={3}>
        <FormField
          labelClassName="fw-bold"
          label="Từ ngày"
          name="startDate"
          type="date"
          value={startDate}
          onChange={onStartDateChange}
          max={endDate || undefined}
        />
      </Col>

      <Col md={6} lg={3}>
        <FormField
          labelClassName="fw-bold"
          label="Đến ngày"
          name="endDate"
          type="date"
          value={endDate}
          onChange={onEndDateChange}
          min={startDate || undefined}
        />
      </Col>

      <Col md={6} lg={2}>
        <FormField
          labelClassName="fw-bold"
          label="Giá từ"
          name="minPrice"
          type="number"
          min="0"
          value={minPrice}
          onChange={onMinPriceChange}
          placeholder="0"
        />
      </Col>

      <Col md={6} lg={2}>
        <FormField
          labelClassName="fw-bold"
          label="Giá đến"
          name="maxPrice"
          type="number"
          min="0"
          value={maxPrice}
          onChange={onMaxPriceChange}
          placeholder="Không giới hạn"
        />
      </Col>

      <Col md={6} lg={2}>
        <FormField
          labelClassName="fw-bold"
          label="Sắp xếp"
          name="sortDirection"
          value={sortDirection}
          onChange={onSortDirectionChange}
          options={SORT_OPTIONS}
        />
      </Col>

      <Col xs={12} className="d-flex justify-content-end">
        <Button variant="outline-secondary" onClick={onResetFilters}>
          Xóa bộ lọc
        </Button>
      </Col>
    </Row>
  );
};

export default EventFilterPanel;
