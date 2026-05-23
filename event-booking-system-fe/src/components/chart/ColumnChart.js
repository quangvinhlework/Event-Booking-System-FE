import React from 'react';
import './ColumnChart.css';

const ColumnChart = ({
  data,
  labelKey,
  valueKey,
  formatValue = (value) => value,
  color = '#284b8f',
}) => {
  const maxValue = Math.max(...data.map((item) => Number(item[valueKey]) || 0), 0);

  if (data.length === 0) {
    return (
      <div className="column-chart__empty py-4">
        Chưa có dữ liệu.
      </div>
    );
  }

  return (
    <div className="column-chart">
      <div className="column-chart__scroll">
        <div className="column-chart__bars">
          {data.map((item) => {
            const value = Number(item[valueKey]) || 0;
            const percent = maxValue ? Math.round((value / maxValue) * 100) : 0;
            const label = item[labelKey];

            return (
              <div
                key={item.id || label}
                className="column-chart__item"
                title={label}
              >
                <div className="column-chart__value">{formatValue(value)}</div>
                <div className="column-chart__bar-track">
                  <div
                    className="column-chart__bar"
                    style={{
                      height: `${Math.max(percent, 4)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <div className="column-chart__label">{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColumnChart;
