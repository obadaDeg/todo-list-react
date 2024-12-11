import styles from "./TodoList.module.css";
import Header from "../Header/Header";

const TodoList = () => {
  const tasks = [];

  return (
    <section className={styles.todoList}>
      <Header title="Todo List" />
      <div className={styles.taskContainer}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.task}>
            <span className={task.done ? styles.taskDone : ""}>
              {task.title}
            </span>
            <button>Toggle</button>
            <button>Delete</button>
          </div>
        ))}
      </div>
      <div className={styles.listActions}>
        <button className={styles.deleteTasks}>Delete All Tasks</button>
        <button className={styles.deleteTasks}>Delete Done Tasks</button>
      </div>
    </section>
  );
};

export default TodoList;
