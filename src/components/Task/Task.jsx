import { useState, useRef, useContext } from "react";
import styles from "./Task.module.css";
import Modal from "../Modal/Modal";
import { TaskContext } from "../../store/TaskContext";
import PropTypes from "prop-types";
import { validateInput } from "../../utils/validation";

export default function Task({ task }) {
  const { toggleTaskDone, renameTask, deleteTask } = useContext(TaskContext);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [error, setError] = useState("");

  const renameModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  const openRenameModal = () => {
    setTaskTitle(task.title);
    setIsRenameModalOpen(true);
    if (renameModalRef.current) {
      renameModalRef.current.style.display = "block";
    }
    setError("");
  };

  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
    if (renameModalRef.current) {
      renameModalRef.current.style.display = "none";
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    if (deleteModalRef.current) {
      deleteModalRef.current.style.display = "block";
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    if (deleteModalRef.current) {
      deleteModalRef.current.style.display = "none";
    }
  };

  const handleRenameSave = () => {
    const validationError = validateInput(taskTitle); 
    if (validationError) {
      setError(validationError);
      return;
    }

    renameTask(task.id, taskTitle); 
    closeRenameModal();
  };

  return (
    <div className={styles.task}>
      <div className={styles.taskFlex}>
        <div className="task-content">
          <span className={`task-text ${task.isDone ? styles.checked : ""}`}>
            {task.title}
          </span>
        </div>
        <div className={styles.taskOperations}>
          <input
            type="checkbox"
            className={styles.taskCheckbox}
            checked={task.isDone}
            onChange={() => toggleTaskDone(task.id)}
          />
          <button className={styles.taskModify} onClick={openRenameModal}>
            <i className="fa-solid fa-pen"></i>
          </button>
          <button className={styles.taskDelete} onClick={openDeleteModal}>
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>

      <div ref={renameModalRef}>
      {isRenameModalOpen && (
        <Modal
        title="Rename Task"
        onSave={handleRenameSave}
        onClose={closeRenameModal}
      >
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => {
            setTaskTitle(e.target.value);
            setError(""); 
          }}
          placeholder="Enter new task name"
          className={styles.renameInput}
        />
        {error && <p className="error">{error}</p>}
      </Modal>
      )}
      </div>

      <div ref={deleteModalRef}>
      {isDeleteModalOpen && (
        <Modal
          title="Delete Task"
          onSave={() => {
            deleteTask(task.id);
            closeDeleteModal();
          }}
          onClose={closeDeleteModal}
        >
          <p>Are you sure you want to delete this task?</p>
        </Modal>
      )}
      </div>
    </div>
  );
}


Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isDone: PropTypes.bool.isRequired,
  }).isRequired,
};