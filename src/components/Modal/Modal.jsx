import ReactDOM from "react-dom";
import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Modal.module.css";

export default function Modal({ title, children, onClose, onSave }) {
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.focus();
    }
  }, []);

  const modalContent = (
    <div className={styles.modal} onClick={onClose}>
      <div
        ref={modalContentRef}
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1"
      >
        {title && <h2>{title}</h2>}
        <div>{children}</div>
        {onSave && (
          <div className={styles.modalActions}>
            <button className={styles.saveBtn} onClick={onSave}>
              Save
            </button>
            <button className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal"),
  );
}

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};
