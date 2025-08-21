import React from 'react';
import '../css/loading-spinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Загрузка...' }) => {
  return (
    <div className={`loading-container size-${size}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
