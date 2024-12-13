import React, { useContext, useState, useEffect } from 'react';
import styles from './TodoList.module.css';
import Header from '../Header/Header';
import Task from '../Task/Task';
import Modal from '../Modal/Modal';
import InputSkeleton from '../InputSkeleton/InputSkeleton';
import { TaskContext } from '../../store/TaskContext';

export default function TodoList() {
  const {
    tasks,
    toggleTaskDone,
    renameTask,
    deleteTask,
    deleteDoneTasks,
    deleteAllTasks,
  } = useContext(TaskContext);

  const [filter, setFilter] = useState('All');
  const [isDeleteDoneModalOpen, setIsDeleteDoneModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Done') return task.isDone;
    if (filter === 'Todo') return !task.isDone;
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
          onClick={() => setFilter('All')}
          className={`${styles.filterBtn} sharedFilterBtn shared-hover`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('Done')}
          className={`${styles.filterBtn} sharedFilterBtn shared-hover`}
        >
          Done
        </button>
        <button
          onClick={() => setFilter('Todo')}
          className={`${styles.filterBtn} sharedFilterBtn shared-hover`}
        >
          Todo
        </button>
      </div>
      <div className={styles.todoListContainer}>
        {Loading ? (
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
          <p>No tasks match the filter!</p>
        )}
      </div>
      <div className={styles.listActionBtns}>
        <button
          className={`${styles.deleteBtn} sharedDeleteBtn ${tasks.filter((task) => task.isDone).length === 0 ? 'disabled': ''}`}
          onClick={openDeleteDoneModal}
        >
          Delete Done Tasks
        </button>
        <button
          className={`${styles.deleteBtn} sharedDeleteBtn ${tasks.length === 0 ? 'disabled': ''}`}
          onClick={openDeleteAllModal}
        >
          Delete All Tasks
        </button>
      </div>

      {isDeleteDoneModalOpen && (
        <Modal
          type="deleteDoneModal"
          onSave={() => {
            deleteDoneTasks();
            closeDeleteDoneModal();
          }}
          onClose={closeDeleteDoneModal}
        />
      )}

      {isDeleteAllModalOpen && (
        <Modal
          type="deleteAllModal"
          onSave={() => {
            deleteAllTasks();
            closeDeleteAllModal();
          }}
          onClose={closeDeleteAllModal}
        />
      )}
    </section>
  );
}