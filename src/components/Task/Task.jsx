import { useState, useRef, useContext } from "react";
import styles from "./Task.module.css";
import Modal from "../Modal/Modal";
import { TaskContext } from "../../store/TaskContext";
import PropTypes from "prop-types";

export default function Task({ task }) {
  const { toggleTaskDone, renameTask, deleteTask } = useContext(TaskContext);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const renameModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  const openRenameModal = () => {
    setIsRenameModalOpen(true);
    if (renameModalRef.current) {
      renameModalRef.current.style.display = "block";
    }
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
            type="renameModal"
            taskTitle={task.title}
            onSave={(newTitle) => {
              renameTask(task.id, newTitle);
              closeRenameModal();
            }}
            onClose={closeRenameModal}
          />
        )}
      </div>

      <div ref={deleteModalRef}>
        {isDeleteModalOpen && (
          <Modal
            type="deleteModal"
            onSave={() => {
              deleteTask(task.id);
              closeDeleteModal();
            }}
            onClose={closeDeleteModal}
          />
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