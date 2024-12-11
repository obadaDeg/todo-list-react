import { createContext } from "react";

const TasksContext = createContext({
  tasks: [],
  addTask: () => {},
  toggleTask: () => {},
  deleteTask: () => {},
  deleteAllTasks: () => {},
});

export default TasksContext;
