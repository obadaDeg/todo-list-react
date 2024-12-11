import styles from "./TodoList.module.css";
import Header from "../Header/Header";

const TodoList = ({ tasks, onToggleTask, onDeleteTask, onDeleteAll }) => {
  return (
    <section className={styles.todoList}>
      <Header title="Todo List" />
      <div className={styles.listActions}>
        <button onClick={() => onDeleteAll()} className={styles.deleteAll}>
          Delete All Tasks
        </button>
      </div>
      <div className={styles.taskContainer}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.task}>
            <span className={task.done ? styles.taskDone : ""}>
              {task.title}
            </span>
            <button onClick={() => onToggleTask(task.id)}>Toggle</button>
            <button onClick={() => onDeleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TodoList;
