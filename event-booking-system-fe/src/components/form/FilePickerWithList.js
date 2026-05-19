import React from 'react';
import { Button } from 'react-bootstrap';
import FormField from './FormField';

const FilePickerWithList = ({
  label,
  name,
  files = [],
  accept,
  multiple = true,
  onChange,
  onRemove,
  removeLabel = 'Remove',
}) => {
  return (
    <FormField
      label={label}
      type="file"
      name={name}
      accept={accept}
      multiple={multiple}
      onChange={onChange}
    >
      {files.length > 0 && (
        <div className="mt-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="d-flex align-items-center justify-content-between border rounded px-2 py-1 mb-1 gap-2"
            >
              <span
                className="text-truncate"
                style={{
                  maxWidth: '250px',
                  minWidth: 0,
                }}
                title={file.name}
              >
                {file.name}
              </span>

              <Button
                type="button"
                size="sm"
                variant="outline-danger"
                aria-label={removeLabel}
                style={{
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
                onClick={() => onRemove?.(name, index)}
              >
                x
              </Button>
            </div>
          ))}
        </div>
      )}
    </FormField>
  );
};

export default FilePickerWithList;
