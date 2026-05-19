import React from 'react';
import { Form } from 'react-bootstrap';

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  as,
  rows,
  options,
  placeholder,
  required = false,
  disabled = false,
  controlId,
  min,
  max,
  accept,
  multiple,
  children,
  className,
  labelClassName,
}) => {
  const id = controlId || name;

  return (
    <Form.Group controlId={id} className={className}>
      {label && <Form.Label className={labelClassName}>{label}</Form.Label>}

      {options ? (
        <Form.Select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control
          type={type}
          as={as}
          rows={rows}
          name={name}
          value={type === 'file' ? undefined : value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          accept={accept}
          multiple={multiple}
        />
      )}

      {children}
    </Form.Group>
  );
};

export default FormField;
