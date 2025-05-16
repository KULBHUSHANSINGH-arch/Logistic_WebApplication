import React from 'react';
import PropTypes from 'prop-types';
import '../styles/confirmPopup.css'

const ConfirmationPopup = ({ onClose, onConfirm, title, message }) => {


  return (
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirmation-popup-buttons">
          <button onClick={(()=>onConfirm(true))} className="confirm-button">Yes</button>
          <button onClick={onClose} className="cancel-button">No</button>
        </div>
      </div>
    </div>
  );
};

ConfirmationPopup.propTypes = {

  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string
};

ConfirmationPopup.defaultProps = {
  title: 'Confirm',
  message: 'Are you sure you want to proceed?'
};

export default ConfirmationPopup;
