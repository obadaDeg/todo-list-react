import { useState, useContext } from "react";
import Header from "../Header/Header";
import styles from "./TodoInput.module.css";
import { TaskContext } from "../../store/TaskContext";
import { validateInput } from "../../utils/validation";

export default function TodoInput() {
  const { addTask } = useContext(TaskContext);
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleInputChange = (e) => {
    setTask(e.target.value);
    setError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInput(task);
    if (validationError) {
      setError(validationError);
      return;
    }

    setPending(true);
    // setTimeout(async () => {
      const res = await addTask(task);
    // }, 2000);

    if (res.error) {
      // should display a modal here
    }

    setPending(false);
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
        <button
          type="submit"
          className="todo-input__submit shared-hover"
          disabled={pending}
        >
          {!pending ? "Add new task" : "Adding task..."}
        </button>
      </form>
    </section>
  );
}
