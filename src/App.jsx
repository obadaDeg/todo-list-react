// App.jsx
import React, { useState } from "react";
import Input from "./components/Input/Input.jsx";
import TodoList from "./components/TodoList/TodoList.jsx";
import TasksContext from "./store/TodoContext.jsx";

const App = () => {
  const [tasks, setTasks] = useState([]);

  const addTask = (title) => {
    setTasks([...tasks, { id: Date.now(), title, done: false }]);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const deleteAllTasks = () => {
    setTasks([]);
  };

  return (
    <TasksContext.Provider value={{ tasks }}>
      <main>
        <Input onAddTask={addTask} />
        <TodoList
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onDeleteAll={deleteAllTasks}
        />
      </main>
    </TasksContext.Provider>
  );
};

export default App;
