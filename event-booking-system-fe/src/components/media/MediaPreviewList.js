import React from 'react';
import { Button, Image } from 'react-bootstrap';

const MediaPreviewList = ({
  items = [],
  type = 'image',
  onRemove,
  removeLabel = 'Remove media',
  emptyText,
}) => {
  if (!items.length) {
    return emptyText ? <p className="text-muted mb-0">{emptyText}</p> : null;
  }

  return (
    <div className={type === 'video' ? 'd-flex flex-column gap-2' : 'd-flex flex-wrap gap-2'}>
      {items.map((url, index) => (
        <div key={`${url}-${index}`} className="position-relative">
          {type === 'video' ? (
            <video
              src={url}
              width="100%"
              height="200"
              controls
              style={{
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Image
              src={url}
              width={120}
              height={120}
              rounded
              style={{
                objectFit: 'cover',
              }}
            />
          )}

          <Button
            type="button"
            variant="danger"
            size="sm"
            className="position-absolute top-0 end-0"
            aria-label={removeLabel}
            onClick={() => onRemove?.(index)}
          >
            x
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MediaPreviewList;
