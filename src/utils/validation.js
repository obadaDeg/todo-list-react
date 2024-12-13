export const validateInput = (value) => {
    if (!value) return "Task cannot be empty";
    if (/^\d/.test(value)) return "Task cannot start with a number";
    if (value.length < 5) return "Task must be at least 5 characters long";
    return "";
  };