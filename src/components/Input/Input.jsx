import React, { useState } from 'react';
import styles from './TodoInput.module.css';

const TodoInput = ({ onAddTask }) => {
  const [task, setTask] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setError('Task cannot be empty!');
      return;
    }
    onAddTask(task.trim());
    setTask('');
    setError('');
  };

  return (
    <section className={styles.todoInput}>
      <Header title="Todo Input" />
      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="task-input" className={styles.inputGroupIcon}>
            <i className="fa-solid fa-book"></i>
          </label>
          <input
            type="text"
            id="task-input"
            className={styles.todoInputField}
            placeholder="New Todo"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitButton}>
          Add New Task
        </button>
      </form>
    </section>
  );
};

export default TodoInput;
