import { createContext, useState, useEffect } from 'react';
import { db, ref, set, update, remove, onValue } from '../firebase/firebase-config';
import PropTypes from 'prop-types';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksRef = ref(db, 'tasks');
    const unsubscribe = onValue(
      tasksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const tasksArray = Object.entries(data).map(([id, task]) => ({ id, ...task }));
          setTasks(tasksArray);
        } else {
          setTasks([]);
        }
      },
      (error) => {
        console.error('Error fetching tasks from Firebase:', error);
      }
    );

    return () => unsubscribe(); 
  }, []);

  const addTask = async (title) => {
    try {
      const id = Date.now().toString();
      const newTask = { title, isDone: false };
      await set(ref(db, `tasks/${id}`), newTask);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const renameTask = async (taskId, newTitle) => {
    try {
      await update(ref(db, `tasks/${taskId}`), { title: newTitle });
    } catch (error) {
      console.error('Error renaming task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await remove(ref(db, `tasks/${taskId}`));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const deleteDoneTasks = async () => {
    try {
      const doneTasks = tasks.filter((task) => task.isDone);
      await Promise.all(doneTasks.map((task) => remove(ref(db, `tasks/${task.id}`))));
    } catch (error) {
      console.error('Error deleting done tasks:', error);
    }
  };

  const deleteAllTasks = async () => {
    try {
      await remove(ref(db, 'tasks'));
    } catch (error) {
      console.error('Error deleting all tasks:', error);
    }
  };

  const toggleTaskDone = async (taskId) => {
    try {
      const task = tasks.find((task) => task.id === taskId);
      if (task) {
        await update(ref(db, `tasks/${taskId}`), { isDone: !task.isDone });
      }
    } catch (error) {
      console.error('Error toggling task state:', error);
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