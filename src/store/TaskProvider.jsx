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

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchTasks(db, setTasks);
    return () => unsubscribe();
  }, []);

  const addTask = async (title) => {
    try {
      await addTaskToFirebase(db, title);
      return { status: "success", message: "Task added successfully" };
    } catch (error) {
      return {
        status: "error",
        message: error.message || "Could not add task",
      };
    }
  };

  const renameTask = async (taskId, newTitle) => {
    try {
      await renameTaskInFirebase(db, taskId, newTitle);
      return { status: "success", message: "Task renamed successfully" };
    } catch (error) {
      return {
        status: "error",
        message: error.message || "Could not rename task",
      };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteTaskFromFirebase(db, taskId);
      return { status: "success", message: "Task deleted successfully" };
    } catch (error) {
      return {
        status: "error",
        message: error.message || "Could not delete task",
      };
    }
  };

  const deleteDoneTasks = async () => {
    try {
      const doneTasks = tasks.filter((task) => task.isDone);
      await Promise.all(
        doneTasks.map((task) => deleteTaskFromFirebase(db, task.id)),
      );
      return { status: "success", message: "Done tasks deleted successfully" };
    } catch (error) {
      return {
        status: "error",
        message: error.message || "Could not delete done tasks",
      };
    }
  };

  const deleteAllTasks = async () => {
    try {
      await deleteAllTasksFromFirebase(db);
      return { status: "success", message: "All tasks deleted successfully" };
    } catch (error) {
      return {
        status: "error",
        message: error.message || "Could not delete all tasks",
      };
    }
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
