import { createContext } from "react";

export const TaskContext = createContext({
  tasks: [],
  addTask: () => {},
  renameTask: () => {},
  deleteTask: () => {},
  deleteDoneTasks: () => {},
  deleteAllTasks: () => {},
  toggleTaskDone: () => {},
});
