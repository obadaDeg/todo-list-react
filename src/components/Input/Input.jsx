import React, { useState } from "react";
import bookIcon from "../../assets/book-solid.svg";
import styles from "./Input.module.css";
import Header from "../Header/Header";
import BookIcon from "../../assets/BookIcon";

const Input = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className={styles.todoInput}>
      <Header title="Todo Input" />
      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="task-input" className={styles.inputGroupIcon}>
            <BookIcon />
          </label>
          <input
            type="text"
            id="task-input"
            className={styles.todoInputField}
            placeholder="New Todo"
          />
        </div>
        {<p className={styles.error}>Error</p>}
        <button type="submit" className={styles.submitButton}>
          Add New Task
        </button>
      </form>
    </section>
  );
};

export default Input;
