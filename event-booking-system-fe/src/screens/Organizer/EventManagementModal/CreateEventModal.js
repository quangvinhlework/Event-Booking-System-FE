import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useCategory } from '../../../hooks/useCategory';
import { dateToTimestamp } from '../../../utils/dateConvert';
import {
  FilePickerWithList,
  FormField,
  LoadingOverlay,
} from '../../../components';

const initialState = {
  name: '',
  description: '',
  startTime: '',
  endTime: '',
  location: '',
  totalTickets: '',
  ticketPrice: '',
  category: '',
  images: [],
  videos: [],
};

const CreateEventModal = ({ show, onHide, onCreate, createLoading }) => {
  const [newEvent, setNewEvent] = useState(initialState);
  const { categories } = useCategory();

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.name,
  }));

  useEffect(() => {
    if (!show) {
      setNewEvent(initialState);
    }

    if (categories.length > 0) {
      setNewEvent((prev) => ({
        ...prev,
        category: categories[0].name,
      }));
    }
  }, [show, categories]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: [...prev[name], ...Array.from(files)],
    }));
  };

  const removeFile = (fieldName, indexToRemove) => {
    setNewEvent((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const preparedData = {
      ...newEvent,
      totalTickets: newEvent.totalTickets ? Number(newEvent.totalTickets) : '',
      ticketPrice: newEvent.ticketPrice ? Number(newEvent.ticketPrice) : '',
      startTime: newEvent.startTime ? dateToTimestamp(newEvent.startTime) : '',
      endTime: newEvent.endTime ? dateToTimestamp(newEvent.endTime) : '',
    };

    await onCreate?.(preparedData);
    if (createLoading === false) {
      onHide();
    }
  };

  return (
    <>
      <LoadingOverlay loading={createLoading} text="Đang tạo sự kiện..." />

      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
        className="organizer-modal-root"
        dialogClassName="organizer-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm sự kiện mới</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={12}>
                <FormField
                  controlId="eventName"
                  label="Tên sự kiện"
                  name="name"
                  value={newEvent.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sự kiện"
                  required
                />
              </Col>

              <Col md={12}>
                <FormField
                  controlId="eventDescription"
                  label="Mô tả"
                  as="textarea"
                  rows={3}
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả ngắn về sự kiện"
                  required
                />
              </Col>

              <Col md={6}>
                <FormField
                  controlId="startTime"
                  label="Bắt đầu"
                  type="datetime-local"
                  name="startTime"
                  value={newEvent.startTime}
                  onChange={handleInputChange}
                  required
                />
              </Col>

              <Col md={6}>
                <FormField
                  controlId="endTime"
                  label="Kết thúc"
                  type="datetime-local"
                  name="endTime"
                  value={newEvent.endTime}
                  onChange={handleInputChange}
                  required
                />
              </Col>

              <Col md={6}>
                <FormField
                  controlId="location"
                  label="Địa điểm"
                  name="location"
                  value={newEvent.location}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Hồ Chí Minh"
                  required
                />
              </Col>

              <Col md={6}>
                <FormField
                  controlId="category"
                  label="Danh mục"
                  name="category"
                  value={newEvent.category}
                  onChange={handleInputChange}
                  options={categoryOptions}
                />
              </Col>

              <Col md={6}>
                <FormField
                  controlId="totalTickets"
                  label="Số vé"
                  type="number"
                  min="0"
                  name="totalTickets"
                  value={newEvent.totalTickets}
                  onChange={handleInputChange}
                  placeholder="Nhập số vé"
                  required
                />
              </Col>

              <Col md={6}>
                <FormField
                  controlId="ticketPrice"
                  label="Giá vé"
                  type="number"
                  min="0"
                  name="ticketPrice"
                  value={newEvent.ticketPrice}
                  onChange={handleInputChange}
                  placeholder="Nhập giá vé"
                  required
                />
              </Col>

              <Col md={6}>
                <FilePickerWithList
                  label="Ảnh (tùy chọn)"
                  name="images"
                  files={newEvent.images}
                  accept="image/*"
                  onChange={handleFileChange}
                  onRemove={removeFile}
                />
              </Col>

              <Col md={6}>
                <FilePickerWithList
                  label="Video (tùy chọn)"
                  name="videos"
                  files={newEvent.videos}
                  accept="video/*"
                  onChange={handleFileChange}
                  onRemove={removeFile}
                />
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Tạo sự kiện
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CreateEventModal;
