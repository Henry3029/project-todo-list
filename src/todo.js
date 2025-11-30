// src/todo.js (The Todo Factory Module)

const Todo = (title, description, dueDate, priority, project = 'Default') => {
    return {
        // Required Properties
        title,
        description,
        dueDate,
        priority,

        // Optional Properties (initialized empty/default)
        notes: '',
        checklist: [], // Array of strings/objects for sub-tasks
        completed: false,
        project,
        id: Date.now() // Unique ID for tracking/deleting
    };
};

export { Todo };