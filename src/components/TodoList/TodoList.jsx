import { useContext, useState, useEffect } from "react";
import styles from "./TodoList.module.css";
import Header from "../Header/Header";
import Task from "../Task/Task";
import Modal from "../Modal/Modal";
import InputSkeleton from "../InputSkeleton/InputSkeleton";
import { TaskContext } from "../../store/TaskContext";

export default function TodoList() {
  const {
    tasks,
    toggleTaskDone,
    renameTask,
    deleteTask,
    deleteDoneTasks,
    deleteAllTasks,
  } = useContext(TaskContext);

  const [filter, setFilter] = useState("All");
  const [isDeleteDoneModalOpen, setIsDeleteDoneModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [errorModal, setErrorModal] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Done") return task.isDone;
    if (filter === "Todo") return !task.isDone;
    return true;
  });

  const openDeleteDoneModal = () => setIsDeleteDoneModalOpen(true);
  const closeDeleteDoneModal = () => setIsDeleteDoneModalOpen(false);

  const openDeleteAllModal = () => setIsDeleteAllModalOpen(true);
  const closeDeleteAllModal = () => setIsDeleteAllModalOpen(false);

  return (
    <section className="todo-list">
      <Header title="Todo List" />
      <div className={styles.listActionBtns}>
        <button
          onClick={() => setFilter("All")}
          className={`${styles.filterBtn} sharedFilterBtn shared-hover ${
            filter === "All" ? styles.active : ""
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("Done")}
          className={`${styles.filterBtn} sharedFilterBtn shared-hover ${
            filter === "Done" ? styles.active : ""
          }`}
        >
          Done
        </button>
        <button
        //commit here
          onClick={() => setFilter("Todo")}
          className={`${styles.filterBtn} sharedFilterBtn shared-hover ${
            filter === "Todo" ? styles.active : ""
          }`}
        >
          Todo
        </button>
      </div>
      <div className={styles.todoListContainer}>
        {loading ? (
          <InputSkeleton />
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onToggle={() => toggleTaskDone(task.id)}
              onRename={renameTask}
              onDelete={deleteTask}
            />
          ))
        ) : (
          <p>No tasks.</p>
        )}
      </div>
      <div className={styles.listActionBtns}>
        <button
          className={`${styles.deleteBtn} sharedDeleteBtn ${
            tasks.filter((task) => task.isDone).length === 0 ? "disabled" : ""
          }`}
          onClick={openDeleteDoneModal}
        >
          Delete Done Tasks
        </button>
        <button
          className={`${styles.deleteBtn} sharedDeleteBtn ${
            tasks.length === 0 ? "disabled" : ""
          }`}
          onClick={openDeleteAllModal}
        >
          Delete All Tasks
        </button>
      </div>

      {isDeleteDoneModalOpen && (
        <Modal
          id="delete-done-tasks-modal"
          title="Delete Done Tasks"
          onSave={() => {
            deleteDoneTasks();
            closeDeleteDoneModal();
          }}
          onClose={closeDeleteDoneModal}
        >
          <p>Are you sure you want to delete all completed tasks?</p>
        </Modal>
      )}

      {isDeleteAllModalOpen && (
        <Modal
          id="delete-all-tasks-modal"
          title="Delete All Tasks"
          onSave={() => {
            deleteAllTasks();
            closeDeleteAllModal();
          }}
          onClose={closeDeleteAllModal}
        >
          <p>Are you sure you want to delete all tasks?</p>
        </Modal>
      )}

      {errorModal && (
        <Modal id="error-modal" title="Error" onClose={closeErrorModal}>
          <p>{errorModal}</p>
          <button onClick={closeErrorModal}>OK</button>
        </Modal>
      )}
    </section>
  );
}
