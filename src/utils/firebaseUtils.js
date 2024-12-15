import { ref, set, update, remove, onValue } from "../firebase/firebase-config";

export const fetchTasks = (db, callback) => {
  const tasksRef = ref(db, "tasks");
  const unsubscribe = onValue(
    tasksRef,
    (snapshot) => {
      const data = snapshot.val();
      const tasksArray = data
        ? Object.entries(data).map(([id, task]) => ({ id, ...task }))
        : [];
      callback(tasksArray);
    },
    (error) => {
      return {
        status: "error",
        message: error.message || "Could not fetch tasks",
      };
    },
  );
  return unsubscribe;
};

export const addTaskToFirebase = async (db, title) => {
  const id = Date.now().toString();
  const newTask = { title, isDone: false };
  return set(ref(db, `tasks/${id}`), newTask);
};

export const renameTaskInFirebase = async (db, taskId, newTitle) => {
  return update(ref(db, `tasks/${taskId}`), { title: newTitle });
};

export const deleteTaskFromFirebase = async (db, taskId) => {
  return remove(ref(db, `tasks/${taskId}`));
};

export const deleteAllTasksFromFirebase = async (db) => {
  return remove(ref(db, "tasks"));
};

export const toggleTaskDoneInFirebase = async (db, taskId, isDone) => {
  return update(ref(db, `tasks/${taskId}`), { isDone: !isDone });
};
