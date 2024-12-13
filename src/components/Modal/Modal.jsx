import { useState, useEffect, useRef } from "react";
import styles from "./Modal.module.css";

export default function Modal({ type, onSave, onClose, taskTitle }) {
  const inputRef = useRef(null);
  const modalContentRef = useRef(null);
  const [inputValue, setInputValue] = useState(taskTitle || "");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setInputValue(taskTitle || "");
    setError("");
    setIsEditing(false);

    if (type === "renameModal" && inputRef.current) {
      inputRef.current.focus();
    }

    if (modalContentRef.current) {
      modalContentRef.current.style.opacity = 1;
      modalContentRef.current.style.transition = "opacity 0.3s";
    }

    const handleClickOutside = (event) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [taskTitle, type, onClose]);

  const validateInput = (value) => {
    if (!value) return "Task cannot be empty";
    if (/^\d/.test(value)) return "Task cannot start with a number";
    if (value.length < 5) return "Task must be at least 5 characters long";
    return "";
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setError(validateInput(newValue));
    if (newValue !== taskTitle) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    const validationError = validateInput(inputValue);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(inputValue);
  };

  return (
    <>
      {type === "renameModal" && (
        <div className={styles.modal}>
          <div ref={modalContentRef} className={styles.modalContent}>
            <h2>Rename Task</h2>
            <input
              ref={inputRef}
              type="text"
              id="rename-input"
              className={styles.renameInput}
              value={inputValue}
              onChange={handleInputChange}
            />
            {error && <p className="error">{error}</p>}
            <div className={styles.modalActions}>
              {!isEditing ? (
                <button id="ok-btn" className={styles.okBtn} onClick={onClose}>
                  OK
                </button>
              ) : (
                <>
                  <button
                    id="save-btn"
                    className={`${styles.saveBtn} ${error ? "disabled" : ""}`}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    id="cancelBtn"
                    className={styles.cancelBtn}
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {type === "deleteModal" && (
        <div className={styles.modal}>
          <div ref={modalContentRef} className={styles.modalContent}>
            <h2>Delete Task</h2>
            <p>Are you sure you want to delete this task?</p>
            <div className={styles.modalActions}>
              <button
                id="confirmBtn"
                className={styles.confirmBtn}
                onClick={onSave}
              >
                Confirm
              </button>
              <button
                id="cancel-delete-btn"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {type === "deleteAllModal" && (
        <div className={styles.modal}>
          <div ref={modalContentRef} className={styles.modalContent}>
            <h2>Delete all Tasks</h2>
            <p>Are you sure you want to delete all the tasks?</p>
            <div className={styles.modalActions}>
              <button
                id="confirm-all-btn"
                className={styles.confirmBtn}
                onClick={onSave}
              >
                Confirm
              </button>
              <button
                id="cancel-delete-all-btn"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {type === "deleteDoneModal" && (
        <div className={styles.modal}>
          <div ref={modalContentRef} className={styles.modalContent}>
            <h2>Delete Done Tasks</h2>
            <p>Are you sure you want to delete all the done tasks?</p>
            <div className={styles.modalActions}>
              <button
                id="confirm-done-btn"
                className={styles.confirmBtn}
                onClick={onSave}
              >
                Confirm
              </button>
              <button
                id="cancel-delete-done-btn"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
