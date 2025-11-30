// src/domManager.js

// Using date-fns for formatting (requires npm install date-fns)
// import { format } from 'date-fns'; 

import * as DataManager from './dataManager.js';

// --- ELEMENT HOOKS ---
const taskListElement = document.getElementById("taskList");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");

// Set default project to load/add tasks to
let currentProject = 'Default'; 


// --- DYNAMIC RENDERING ---

function renderTodos(todosArray, projectName) {
    // Clear the UI and set the current project context
    taskListElement.innerHTML = ''; 
    currentProject = projectName;
    
    // RENDER: Loop through the array of Todo objects
    todosArray.forEach((task) => {
        const li = document.createElement("li");
        li.classList.add(task.priority); // Apply priority class for styling

        // Title and Date (The compact view)
        li.innerHTML = `
            <span>${task.title}</span>
            <span class="due-date">Due: ${task.dueDate}</span>
        `;
        
        // Checkbox Logic
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            // CALL toggleTaskCompleted
            DataManager.toggleTodoCompleted(task.id, currentProject);
            li.classList.toggle("completed"); 
        });
        li.prepend(checkbox);

        // Delete Button Logic
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            // CALL deleteTask
            DataManager.deleteTodo(task.id, currentProject); 
        });
        li.appendChild(deleteBtn);

        // Append the final list item
        taskListElement.appendChild(li);
    });
}


// --- INITIAL EVENT LISTENERS (Form Submission) ---

function initEventListeners() {
    // WHEN user submits the "add task" form:
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop page refresh
        
        const text = taskInput.value.trim();
        if (text === '') {
            return; // Stop if text is empty
        }

        // CALL addTask (now addTodoToProject)
        DataManager.addTodoToProject(text, currentProject);
        
        taskInput.value = ''; // Clear input field
    });
    
    // Other listeners (Project selection, Edit button clicks, etc.) will go here
}

export { renderTodos, initEventListeners };