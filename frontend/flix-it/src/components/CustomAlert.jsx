import React from 'react';

const CustomAlert = ({ message, type, onClose }) => {
  return (
    <div className={`custom-alert custom-alert-${type}`}>
      <span className="closebtn" onClick={onClose}>&times;</span>
      <strong>{message}</strong>
    </div>
  );
};

export default CustomAlert;
