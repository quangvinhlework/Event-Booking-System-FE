import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useCategory } from '../../../hooks/useCategory';
import {
  dateToTimestamp,
  timestampToDateForUpdateModal,
} from '../../../utils/dateConvert';
import {
  FilePickerWithList,
  FormField,
  LoadingOverlay,
  MediaPreviewList,
} from '../../../components';

const initialState = {
  id: null,
  name: '',
  description: '',
  startTime: '',
  endTime: '',
  location: '',
  totalTickets: '',
  ticketPrice: '',
  category: '',
  existingImageUrls: [],
  existingVideoUrls: [],
  newImages: [],
  newVideos: [],
  deletedMediaUrls: [],
};

const UpdateEventModal = ({
  show,
  onHide,
  onUpdate,
  updateLoading,
  eventData,
}) => {
  const [modifyEvent, setModifyEvent] = useState(initialState);
  const { categories } = useCategory();

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.name,
  }));

  const mapEventToField = (event) => {
    const images =
      event.eventMedias
        ?.filter((media) => media.mediaType === 'IMAGE')
        .map((media) => media.mediaUrl) || [];

    const videos =
      event.eventMedias
        ?.filter((media) => media.mediaType === 'VIDEO')
        .map((media) => media.mediaUrl) || [];

    return {
      id: event.id,
      name: event.name || '',
      description: event.description || '',
      startTime: timestampToDateForUpdateModal(event.startTime),
      endTime: timestampToDateForUpdateModal(event.endTime),
      location: event.location || '',
      totalTickets: event.totalTickets || '',
      ticketPrice: event.ticketPrice || '',
      category: event.category || '',
      existingImageUrls: images,
      existingVideoUrls: videos,
      newImages: [],
      newVideos: [],
      deletedMediaUrls: [],
    };
  };

  useEffect(() => {
    if (!show) {
      setModifyEvent(initialState);
      return;
    }

    if (eventData) {
      setModifyEvent(mapEventToField(eventData));
    }
  }, [show, eventData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setModifyEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;

    setModifyEvent((prev) => ({
      ...prev,
      [name]: [...prev[name], ...Array.from(files)],
    }));
  };

  const removeNewFile = (fieldName, indexToRemove) => {
    setModifyEvent((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, index) => index !== indexToRemove),
    }));
  };

  const removeExistingFile = (fieldName, indexToRemove) => {
    setModifyEvent((prev) => {
      const deletedUrl = prev[fieldName][indexToRemove];

      return {
        ...prev,
        [fieldName]: prev[fieldName].filter((_, index) => index !== indexToRemove),
        deletedMediaUrls: [...prev.deletedMediaUrls, deletedUrl],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const preparedData = {
      ...modifyEvent,
      totalTickets: modifyEvent.totalTickets ? Number(modifyEvent.totalTickets) : 0,
      ticketPrice: modifyEvent.ticketPrice ? Number(modifyEvent.ticketPrice) : 0,
      startTime: modifyEvent.startTime
        ? dateToTimestamp(modifyEvent.startTime)
        : null,
      endTime: modifyEvent.endTime
        ? dateToTimestamp(modifyEvent.endTime)
        : null,
    };

    await onUpdate?.(preparedData, preparedData.id);
    if (updateLoading === false) {
      onHide();
    }
  };

  return (
    <>
      <LoadingOverlay loading={updateLoading} text="Đang cập nhật sự kiện..." />

      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
        className="organizer-modal-root"
        dialogClassName="organizer-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa sự kiện</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={12}>
                <FormField
                  label="Tên sự kiện"
                  name="name"
                  value={modifyEvent.name}
                  onChange={handleInputChange}
                  required
                />
              </Col>

              <Col md={12}>
                <FormField
                  label="Mô tả"
                  as="textarea"
                  rows={3}
                  name="description"
                  value={modifyEvent.description}
                  onChange={handleInputChange}
                  required
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Thời gian bắt đầu"
                  type="datetime-local"
                  name="startTime"
                  value={modifyEvent.startTime}
                  onChange={handleInputChange}
                  required
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Thời gian kết thúc"
                  type="datetime-local"
                  name="endTime"
                  value={modifyEvent.endTime}
                  onChange={handleInputChange}
                  required
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Địa điểm"
                  name="location"
                  value={modifyEvent.location}
                  onChange={handleInputChange}
                  required
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Danh mục"
                  name="category"
                  value={modifyEvent.category}
                  onChange={handleInputChange}
                  options={categoryOptions}
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Số lượng vé"
                  type="number"
                  min="0"
                  name="totalTickets"
                  value={modifyEvent.totalTickets}
                  onChange={handleInputChange}
                  required
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Giá vé"
                  type="number"
                  min="0"
                  name="ticketPrice"
                  value={modifyEvent.ticketPrice}
                  onChange={handleInputChange}
                  required
                />
              </Col>

              <Col md={6}>
                <div>
                  <Form.Label>Ảnh hiện tại</Form.Label>
                  <div className="mb-3">
                    <MediaPreviewList
                      items={modifyEvent.existingImageUrls}
                      type="image"
                      onRemove={(index) =>
                        removeExistingFile('existingImageUrls', index)
                      }
                    />
                  </div>

                  <FilePickerWithList
                    label="Ảnh mới"
                    name="newImages"
                    files={modifyEvent.newImages}
                    accept="image/*"
                    onChange={handleFileChange}
                    onRemove={removeNewFile}
                  />
                </div>
              </Col>

              <Col md={6}>
                <div>
                  <Form.Label>Video hiện tại</Form.Label>
                  <div className="mb-3">
                    <MediaPreviewList
                      items={modifyEvent.existingVideoUrls}
                      type="video"
                      onRemove={(index) =>
                        removeExistingFile('existingVideoUrls', index)
                      }
                    />
                  </div>

                  <FilePickerWithList
                    label="Video mới"
                    name="newVideos"
                    files={modifyEvent.newVideos}
                    accept="video/*"
                    onChange={handleFileChange}
                    onRemove={removeNewFile}
                  />
                </div>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={updateLoading}>
              Cập nhật sự kiện
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateEventModal;
