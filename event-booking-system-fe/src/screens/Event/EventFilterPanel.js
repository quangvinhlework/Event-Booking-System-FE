import React, { useState, useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { FormField } from '../../components';

const SORT_OPTIONS = [
  { label: 'Ngày diễn ra tăng dần', value: 'asc' },
  { label: 'Ngày diễn ra giảm dần', value: 'desc' },
];

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
  onApplyFilters,
  onResetFilters,
  className = 'surface-card p-3 p-md-4 mb-4 g-3',
}) => {
  const [localCategory, setLocalCategory] = useState(selectedCategory || '');
  const [localStatus, setLocalStatus] = useState(selectedStatus || '');
  const [localLocation, setLocalLocation] = useState(location || '');
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');
  const [localMinPrice, setLocalMinPrice] = useState(minPrice || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice || '');
  const [localSortDirection, setLocalSortDirection] = useState(sortDirection || 'asc');

  useEffect(() => { setLocalCategory(selectedCategory || ''); }, [selectedCategory]);
  useEffect(() => { setLocalStatus(selectedStatus || ''); }, [selectedStatus]);
  useEffect(() => { setLocalLocation(location || ''); }, [location]);
  useEffect(() => { setLocalStartDate(startDate || ''); }, [startDate]);
  useEffect(() => { setLocalEndDate(endDate || ''); }, [endDate]);
  useEffect(() => { setLocalMinPrice(minPrice || ''); }, [minPrice]);
  useEffect(() => { setLocalMaxPrice(maxPrice || ''); }, [maxPrice]);
  useEffect(() => { setLocalSortDirection(sortDirection || 'asc'); }, [sortDirection]);

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({
        selectedCategory: localCategory,
        selectedStatus: localStatus,
        location: localLocation,
        startDate: localStartDate,
        endDate: localEndDate,
        minPrice: localMinPrice,
        maxPrice: localMaxPrice,
        sortDirection: localSortDirection,
      });
    }
  };

  return (
    <Row id={id} className={className}>
      {statusOptions && (
        <Col md={6} lg={4}>
          <FormField
            labelClassName="fw-bold"
            label="Trạng thái"
            name="selectedStatus"
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value)}
            options={statusOptions}
          />
        </Col>
      )}

      <Col md={6} lg={4}>
        <FormField
          labelClassName="fw-bold"
          label="Lĩnh vực"
          name="selectedCategory"
          value={localCategory}
          onChange={(e) => setLocalCategory(e.target.value)}
          options={categoryOptions}
        />
      </Col>

      <Col md={6} lg={4}>
        <FormField
          labelClassName="fw-bold"
          label="Địa điểm"
          name="location"
          value={localLocation}
          onChange={(e) => setLocalLocation(e.target.value)}
          placeholder="Nhập địa điểm..."
        />
      </Col>

      <Col md={6} lg={3}>
        <FormField
          labelClassName="fw-bold"
          label="Từ ngày"
          name="startDate"
          type="date"
          value={localStartDate}
          onChange={(e) => setLocalStartDate(e.target.value)}
          max={localEndDate || undefined}
        />
      </Col>

      <Col md={6} lg={3}>
        <FormField
          labelClassName="fw-bold"
          label="Đến ngày"
          name="endDate"
          type="date"
          value={localEndDate}
          onChange={(e) => setLocalEndDate(e.target.value)}
          min={localStartDate || undefined}
        />
      </Col>

      <Col md={6} lg={2}>
        <FormField
          labelClassName="fw-bold"
          label="Giá từ"
          name="minPrice"
          type="number"
          min="0"
          value={localMinPrice}
          onChange={(e) => setLocalMinPrice(e.target.value)}
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
          value={localMaxPrice}
          onChange={(e) => setLocalMaxPrice(e.target.value)}
          placeholder="Không giới hạn"
        />
      </Col>

      <Col md={6} lg={2}>
        <FormField
          labelClassName="fw-bold"
          label="Sắp xếp"
          name="sortDirection"
          value={localSortDirection}
          onChange={(e) => setLocalSortDirection(e.target.value)}
          options={SORT_OPTIONS}
        />
      </Col>

      <Col xs={12} className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="outline-secondary" onClick={onResetFilters}>
          Xóa bộ lọc
        </Button>
        <Button variant="primary" onClick={handleApply}>
          Áp dụng
        </Button>
      </Col>
    </Row>
  );
};

export default EventFilterPanel;
