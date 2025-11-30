// src/dataManager.js

import { Todo } from './todo.js'; // To create new tasks
import * as DOMManager from './domManager.js'; // To trigger UI updates

const STORAGE_KEY = 'todoProjectsData';

let projects = {
    'Default': [],
};

// --- INITIALIZATION & PERSISTENCE ---

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function loadFromStorage() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        projects = JSON.parse(storedData);
    }
    // Ensure 'Default' project always exists, even if storage was empty
    if (!projects['Default']) {
        projects['Default'] = [];
    }
}


// --- DATA MANIPULATION FUNCTIONS ---

function addTodoToProject(text, projectName) {
    const newTodo = Todo(text, "No description yet", "N/A", "medium", projectName);
    
    // Ensure the target project exists
    if (!projects[projectName]) {
        projects[projectName] = [];
    }
    
    projects[projectName].push(newTodo);
    saveToStorage();
    DOMManager.renderTodos(projects[projectName], projectName);
}

function deleteTodo(todoId, projectName) {
    // Filter out the todo item that matches the ID
    projects[projectName] = projects[projectName].filter(todo => todo.id !== todoId);
    saveToStorage();
    DOMManager.renderTodos(projects[projectName], projectName);
}

function toggleTodoCompleted(todoId, projectName) {
    const projectTodos = projects[projectName];
    const todo = projectTodos.find(t => t.id === todoId);
    
    if (todo) {
        todo.completed = !todo.completed;
        saveToStorage();
        DOMManager.renderTodos(projectTodos, projectName);
    }
}

// ... more functions (createNewProject, updateTodoDetails, etc.) ...

export { 
    projects, 
    loadFromStorage, 
    addTodoToProject, 
    deleteTodo, 
    toggleTodoCompleted 
};