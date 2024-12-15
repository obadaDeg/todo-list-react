import './App.css';
import TodoInput from './components/TodoInput/TodoInput';
import TodoList from './components/TodoList/TodoList';
import { TaskProvider } from './store/TaskContext';

function App() {
  return (
    <TaskProvider>
      <main className="content">
        <TodoInput />
        <TodoList />
      </main>
    </TaskProvider>
  );
}

export default App;


import { createContext, useState, useEffect } from 'react';
import { db, ref, set, update, remove, onValue } from '../firebase/firebase-config';
import PropTypes from 'prop-types';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksRef = ref(db, 'tasks');
    const unsubscribe = onValue(
      tasksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const tasksArray = Object.entries(data).map(([id, task]) => ({ id, ...task }));
          setTasks(tasksArray);
        } else {
          setTasks([]);
        }
      },
      (error) => {
        console.error('Error fetching tasks from Firebase:', error);
      }
    );

    return () => unsubscribe(); 
  }, []);

  const addTask = async (title) => {
    try {
      const id = Date.now().toString();
      const newTask = { title, isDone: false };
      await set(ref(db, `tasks/${id}`), newTask);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const renameTask = async (taskId, newTitle) => {
    try {
      await update(ref(db, `tasks/${taskId}`), { title: newTitle });
    } catch (error) {
      console.error('Error renaming task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await remove(ref(db, `tasks/${taskId}`));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const deleteDoneTasks = async () => {
    try {
      const doneTasks = tasks.filter((task) => task.isDone);
      await Promise.all(doneTasks.map((task) => remove(ref(db, `tasks/${task.id}`))));
    } catch (error) {
      console.error('Error deleting done tasks:', error);
    }
  };

  const deleteAllTasks = async () => {
    try {
      await remove(ref(db, 'tasks'));
    } catch (error) {
      console.error('Error deleting all tasks:', error);
    }
  };

  const toggleTaskDone = async (taskId) => {
    try {
      const task = tasks.find((task) => task.id === taskId);
      if (task) {
        await update(ref(db, `tasks/${taskId}`), { isDone: !task.isDone });
      }
    } catch (error) {
      console.error('Error toggling task state:', error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        renameTask,
        deleteTask,
        deleteDoneTasks,
        deleteAllTasks,
        toggleTaskDone,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};


import { useState, useContext } from "react";
import Header from "../Header/Header";
import styles from "./TodoInput.module.css";
import { TaskContext } from "../../store/TaskContext";
import { validateInput } from "../../utils/validation";

export default function TodoInput() {
  const { addTask } = useContext(TaskContext);
  const [task, setTask] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setTask(e.target.value);
    setError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const validationError = validateInput(task);
    if (validationError) {
      setError(validationError);
      return;
    }
    addTask(task);
    setTask("");
  };

  return (
    <section>
      <Header title="TodoInput" />
      <form className={styles.inputContainer} onSubmit={handleFormSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="task-input" className={styles.inputGroupIcon}>
            <i className="fa-solid fa-book"></i>
          </label>
          <input
            type="text"
            className={styles.todoInputField}
            id="task-input"
            placeholder="New Todo"
            value={task}
            onChange={handleInputChange}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="todo-input__submit shared-hover">
          Add new task
        </button>
      </form>
    </section>
  );
}


import { useContext, useState, useEffect } from 'react';
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
          <p>No tasks.</p>
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


import { useState, useEffect, useRef } from "react";
import styles from "./Modal.module.css";
import PropTypes from "prop-types";
import { validateInput } from "../../utils/validation";

export default function Modal({ type, onSave, onClose, taskTitle }) {
  const inputRef = useRef(null);
  const modalContentRef = useRef(null);
  const [inputValue, setInputValue] = useState(taskTitle || "");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setInputValue(taskTitle);
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