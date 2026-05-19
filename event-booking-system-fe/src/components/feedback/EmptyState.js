import React from 'react';

const EmptyState = ({
  title,
  description,
  action,
  className = 'text-center py-5',
}) => {
  return (
    <div className={className}>
      {title && <h5 className="mb-2">{title}</h5>}
      {description && <p className="text-muted mb-3">{description}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
