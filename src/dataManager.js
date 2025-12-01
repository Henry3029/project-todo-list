// src/dataManager.js

import { Todo } from './todo.js'; 
import * as DOMManager from './domManager.js'; 

const STORAGE_KEY = 'todoProjectsData';

let projects = {
    'Default': [],
};

let currentProject = 'Default'; 

// --- INITIALIZATION & PERSISTENCE (NO CHANGE) ---

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function loadFromStorage() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (storedData) {
        projects = JSON.parse(storedData);
    } else {
        projects = { 'Default': [] };
    }
    
    if (!projects['Default']) {
        projects['Default'] = [];
    }
}

// --- PROJECT MANAGEMENT LOGIC (NO CHANGE) ---

function getProjectNames() {
    return Object.keys(projects);
}

function addProject(projectName) {
    if (!projectName || projects.hasOwnProperty(projectName)) {
        console.error("Project name is invalid or already exists.");
        return;
    }
    
    projects[projectName] = [];
    saveToStorage();
    DOMManager.renderProjects();
    switchProject(projectName);
}

function switchProject(projectName) {
    if (projects[projectName]) {
        currentProject = projectName;
        DOMManager.renderTodos(projects[projectName], projectName);
        DOMManager.setActiveProject(projectName);
    }
}

// --- DATA MANIPULATION FUNCTIONS ---

/**
 * UPDATED FUNCTION: Now accepts date and priority from the form.
 */
function addTodoToProject(title, dueDate, priority) { 
    // Set a default description
    const description = "Click Edit to add a description.";

    // Use the provided values, defaulting to 'N/A' if the date field was left empty
    const finalDueDate = dueDate || 'N/A';
    
    // The Todo function now uses the new parameters
    const newTodo = Todo(title, description, finalDueDate, priority, currentProject);
    
    if (!projects[currentProject]) {
        projects[currentProject] = [];
    }
    
    projects[currentProject].push(newTodo);
    saveToStorage(); 
    DOMManager.renderTodos(projects[currentProject], currentProject);
}


function updateTodoDetails(todoId, newDetails) {
    const projectTodos = projects[currentProject];
    const todoIndex = projectTodos.findIndex(t => t.id === todoId);
    
    if (todoIndex !== -1) {
        projects[currentProject][todoIndex] = {
            ...projects[currentProject][todoIndex], 
            ...newDetails, 
        };
        
        saveToStorage(); 
        DOMManager.renderTodos(projects[currentProject], currentProject);
    } else {
        console.error(`Todo with ID ${todoId} not found in project ${currentProject}.`);
    }
}

function deleteTodo(todoId) { 
    projects[currentProject] = projects[currentProject].filter(todo => todo.id !== todoId);
    saveToStorage(); 
    DOMManager.renderTodos(projects[currentProject], currentProject);
}

function toggleTodoCompleted(todoId) { 
    const projectTodos = projects[currentProject];
    const todo = projectTodos.find(t => t.id === todoId);
    
    if (todo) {
        todo.completed = !todo.completed;
        saveToStorage(); 
        DOMManager.renderTodos(projectTodos, currentProject);
    }
}

function getTodoById(todoId) {
    return projects[currentProject].find(t => t.id === todoId);
}

export { 
    projects, 
    currentProject, 
    loadFromStorage, 
    saveToStorage,
    getProjectNames, 
    addProject,
    switchProject,   
    updateTodoDetails, 
    addTodoToProject, // The updated function
    deleteTodo, 
    toggleTodoCompleted,
    getTodoById 
};

