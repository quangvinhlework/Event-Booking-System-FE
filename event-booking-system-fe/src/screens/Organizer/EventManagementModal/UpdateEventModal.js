import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useCategory } from '../../../hooks/useCategory';
import {
  FilePickerWithList,
  FormField,
  LoadingOverlay,
  MediaPreviewList,
} from '../../../components';
import ConfirmCard from '../../../components/confirmation/ConfirmCard';
import {
  EMPTY_EVENT_FORM,
  eventToFormState,
  formStateToUpdatePayload,
  getEditableFields,
} from '../../../utils/eventUpdateForm';
import { EVENT_STATUS } from '../../../constants/statuses/eventStatus';

const UpdateEventModal = ({
  show,
  onHide,
  onUpdate,
  onPublish,
  onEnd,
  updateLoading,
  eventData,
}) => {
  const [form, setForm] = useState(EMPTY_EVENT_FORM);
  const [showConfirmPublishCard, setShowConfirmPublishCard] = useState(false);
  const [showConfirmEndCard, setShowConfirmEndCard] = useState(false);
  const { categories } = useCategory();

  const editableFields = getEditableFields(eventData?.status);
  const isEditable = (field) => editableFields.includes(field);
  const readOnlyClass = (field) => (!isEditable(field) ? 'opacity-50' : '');

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.name,
  }));

  useEffect(() => {
    if (!show) {
      setForm(EMPTY_EVENT_FORM);
      return;
    }
    if (eventData) {
      setForm(eventToFormState(eventData));
    }
  }, [show, eventData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: [...prev[name], ...Array.from(files)],
    }));
  };

  const removeNewFile = (fieldName, indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, index) => index !== indexToRemove),
    }));
  };

  const removeExistingFile = (fieldName, indexToRemove) => {
    setForm((prev) => {
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
    const payload = formStateToUpdatePayload(form, eventData?.status);
    await onUpdate?.(payload, payload.id);
    if (updateLoading === false) {
      onHide();
    }
  };

  const handlePublishEvent = async () => {
    if (!eventData?.id) return;
    try {
      await onPublish?.(eventData.id);
      if (updateLoading === false) {
        setShowConfirmPublishCard(false);
        onHide();
      }
    } catch (err) {
      console.error('Error publishing event:', err);
    }
  };

  const handleEndEvent = async () => {
    if (!eventData?.id) return;
    try {
      await onEnd?.(eventData.id);
      if (updateLoading === false) {
        setShowConfirmEndCard(false);
        onHide();
      }
    } catch (err) {
      console.error('Error publishing event:', err);
    }
  };

  return (
    <>
      <LoadingOverlay loading={updateLoading} text="Đang cập nhật sự kiện..." />
      <ConfirmCard
        show={showConfirmPublishCard}
        title="Đăng sự kiện"
        message="Bạn có chắc chắn muốn đăng sự kiện này?"
        onConfirm={handlePublishEvent}
        onCancel={() => setShowConfirmPublishCard(false)}
      />
      <ConfirmCard
        show={showConfirmEndCard}
        title="Đăng sự kiện"
        message="Bạn có chắc chắn muốn đăng sự kiện này?"
        onConfirm={handleEndEvent}
        onCancel={() => setShowConfirmEndCard(false)}
      />
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
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditable('name')}
                  className={readOnlyClass('name')}
                />
              </Col>

              <Col md={12}>
                <FormField
                  label="Mô tả"
                  as="textarea"
                  rows={3}
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditable('description')}
                  className={readOnlyClass('description')}
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Thời gian bắt đầu"
                  type="datetime-local"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditable('startTime')}
                  className={readOnlyClass('startTime')}
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Thời gian kết thúc"
                  type="datetime-local"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditable('endTime')}
                  className={readOnlyClass('endTime')}
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Địa điểm"
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditable('location')}
                  className={readOnlyClass('location')}
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Danh mục"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  options={categoryOptions}
                  disabled={!isEditable('category')}
                  className={readOnlyClass('category')}
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Số lượng vé"
                  type="number"
                  min="0"
                  name="totalTickets"
                  value={form.totalTickets}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditable('totalTickets')}
                  className={readOnlyClass('totalTickets')}
                />
              </Col>

              <Col md={6}>
                <FormField
                  label="Giá vé"
                  type="number"
                  min="0"
                  name="ticketPrice"
                  value={form.ticketPrice}
                  onChange={handleInputChange}
                  required
                  disabled={!isEditable('ticketPrice')}
                  className={readOnlyClass('ticketPrice')}
                />
              </Col>

              <Col md={6}>
                <div>
                  <Form.Label>Ảnh hiện tại</Form.Label>
                  <div className="mb-3">
                    <MediaPreviewList
                      items={form.existingImageUrls}
                      type="image"
                      onRemove={(index) =>
                        removeExistingFile('existingImageUrls', index)
                      }
                      disabled={!isEditable('deletedMediaUrls')}
                      className={readOnlyClass('deletedMediaUrls')}
                    />
                  </div>
                  {isEditable('newImages') && (
                    <FilePickerWithList
                      label="Ảnh mới"
                      name="newImages"
                      files={form.newImages}
                      accept="image/*"
                      onChange={handleFileChange}
                      onRemove={removeNewFile}
                    />
                  )}
                </div>
              </Col>

              <Col md={6}>
                <div>
                  <Form.Label>Video hiện tại</Form.Label>
                  <div className="mb-3">
                    <MediaPreviewList
                      items={form.existingVideoUrls}
                      type="video"
                      onRemove={(index) =>
                        removeExistingFile('existingVideoUrls', index)
                      }
                      disabled={!isEditable('deletedMediaUrls')}
                      className={readOnlyClass('deletedMediaUrls')}
                    />
                  </div>
                  {isEditable('newVideos') && (
                    <FilePickerWithList
                      label="Video mới"
                      name="newVideos"
                      files={form.newVideos}
                      accept="video/*"
                      onChange={handleFileChange}
                      onRemove={removeNewFile}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            {EVENT_STATUS.DRAFT === eventData?.status && (
              <Button variant="success" onClick={() => setShowConfirmPublishCard(true)} disabled={updateLoading}>
                Đăng sự kiện
              </Button>
            )}
            {EVENT_STATUS.ONSALE === eventData?.status && (
              <Button variant="danger" onClick={() => setShowConfirmEndCard(true)} disabled={updateLoading}>
                Dừng sự kiện
              </Button>
            )}
            
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
