import { useState, useEffect } from "react";
import { db } from "../firebase/firebase-config";
import PropTypes from "prop-types";
import {
  addTaskToFirebase,
  deleteAllTasksFromFirebase,
  deleteTaskFromFirebase,
  fetchTasks,
  renameTaskInFirebase,
  toggleTaskDoneInFirebase,
} from "../utils/firebaseUtils";
import { TaskContext } from "./TaskContext";
import { handleResponse } from "../utils/responseHandler";

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchTasks(db, setTasks);
    return () => unsubscribe();
  }, []);

  const addTask = async (title) => {
    return handleResponse(
      addTaskToFirebase(db, title),
      "Task added successfully",
      "Could not add task",
    );
  };

  const renameTask = async (taskId, newTitle) => {
    return handleResponse(
      renameTaskInFirebase(db, taskId, newTitle),
      "Task renamed successfully",
      "Could not rename task",
    );
  };

  const deleteTask = async (taskId) => {
    return handleResponse(
      deleteTaskFromFirebase(db, taskId),
      "Task deleted successfully",
      "Could not delete task",
    );
  };
  
  const deleteDoneTasks = async () => {
    const doneTasks = tasks.filter((task) => task.isDone);
    return handleResponse(
      async () => {
        await Promise.all(doneTasks.map((task) => deleteTaskFromFirebase(db, task.id)));
      },
      "Done tasks deleted successfully",
      "Could not delete done tasks"
    );
  };
  

  const deleteAllTasks = async () => {
    return handleResponse(
      deleteAllTasksFromFirebase(db),
      "All tasks deleted successfully",
      "Could not delete all tasks",
    );
  };

  const toggleTaskDone = async (taskId) => {
    try {
      const task = tasks.find((task) => task.id === taskId);
      if (task) {
        await toggleTaskDoneInFirebase(db, taskId, task.isDone);
      }
      return { status: "success", message: "Task done toggled successfully" };
    } catch (error) {
      return {
        status: "error",
        message: error.message || "Could not toggle task done",
      };
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

TaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
