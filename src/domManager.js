// src/domManager.js

import * as DataManager from './dataManager.js';

// --- ELEMENT HOOKS ---
const taskListElement = document.getElementById("taskList");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
// NEW HOOKS for the expanded task form
const taskDueDateInput = document.getElementById("task-due-date");
const taskPriorityInput = document.getElementById("task-priority");

const projectNavElement = document.getElementById("project-nav"); 
const currentProjectTitle = document.getElementById("current-project-title");
const newProjectForm = document.getElementById("new-project-form");
const newProjectInput = document.getElementById("new-project-input");

// Helper array for priority options
const PRIORITY_OPTIONS = ['low', 'medium', 'high'];


// --- EDITING FORM LOGIC ---

function handleEditSubmit(e, todoId) {
    e.preventDefault();
    
    const newTitle = document.getElementById(`edit-title-${todoId}`).value;
    const newDescription = document.getElementById(`edit-description-${todoId}`).value;
    const newDueDate = document.getElementById(`edit-dueDate-${todoId}`).value;
    const newPriority = document.getElementById(`edit-priority-${todoId}`).value;
    
    if (!newTitle.trim()) {
        console.error("Title cannot be empty.");
        return;
    }

    const newDetails = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        // If date field is empty, set it back to 'N/A'
        dueDate: newDueDate || 'N/A', 
        priority: newPriority,
    };

    DataManager.updateTodoDetails(todoId, newDetails);
}


function renderEditForm(task) {
    const li = document.getElementById(`task-item-${task.id}`);
    if (!li) return;
    
    li.innerHTML = '';
    
    const form = document.createElement('form');
    form.classList.add('p-3', 'w-full', 'space-y-3', 'bg-white', 'rounded-lg');
    
    form.addEventListener('submit', (e) => handleEditSubmit(e, task.id));
    
    const priorityOptionsHtml = PRIORITY_OPTIONS.map(p => `
        <option value="${p}" ${task.priority === p ? 'selected' : ''}>
            ${p.charAt(0).toUpperCase() + p.slice(1)} Priority
        </option>
    `).join('');

    // Pre-fill the date field correctly, handling 'N/A'
    const initialDueDate = task.dueDate === 'N/A' ? '' : task.dueDate;

    form.innerHTML = `
        <!-- Title Input -->
        <input id="edit-title-${task.id}" type="text" value="${task.title}" 
               placeholder="Task Title" class="w-full p-2 text-lg font-bold border rounded-md">
        
        <!-- Description Textarea -->
        <textarea id="edit-description-${task.id}" placeholder="Task Description" 
                  rows="3" class="w-full p-2 border rounded-md">${task.description}</textarea>
        
        <!-- Details Row (Date & Priority) -->
        <div class="flex flex-col md:flex-row gap-4">
            <!-- Due Date Input -->
            <div class="flex-1">
                <label for="edit-dueDate-${task.id}" class="block text-sm font-medium text-gray-700">Due Date</label>
                <input id="edit-dueDate-${task.id}" type="date" value="${initialDueDate}" 
                       class="w-full p-2 border rounded-md">
            </div>

            <!-- Priority Dropdown -->
            <div class="flex-1">
                <label for="edit-priority-${task.id}" class="block text-sm font-medium text-gray-700">Priority</label>
                <select id="edit-priority-${task.id}" class="w-full p-2 border rounded-md">
                    ${priorityOptionsHtml}
                </select>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 pt-2">
            <button type="button" id="cancel-edit-${task.id}" 
                    class="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition">
                Cancel
            </button>
            <button type="submit" 
                    class="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition">
                Save Changes
            </button>
        </div>
    `;

    li.appendChild(form);
    
    document.getElementById(`cancel-edit-${task.id}`).addEventListener('click', () => {
        DataManager.switchProject(DataManager.currentProject); 
    });
}


// --- MAIN RENDERING FUNCTIONS (NO CHANGE) ---
// ... (omitting renderProjects and setActiveProject for brevity) ...

function renderProjects() {
    projectNavElement.innerHTML = ''; 
    const projectNames = DataManager.getProjectNames();

    projectNames.forEach(name => {
        const button = document.createElement('button');
        button.classList.add('project-item', 'p-2', 'rounded-lg', 'hover:bg-gray-200', 'transition', 'duration-150', 'md:w-full', 'md:text-left');
        button.id = `project-${name}`; 
        button.textContent = name;
        button.addEventListener('click', () => { DataManager.switchProject(name); });
        projectNavElement.appendChild(button);
    });

    setActiveProject(DataManager.currentProject);
}


function setActiveProject(projectName) {
    currentProjectTitle.textContent = projectName;
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => item.classList.remove('active'));
    const activeItem = document.getElementById(`project-${projectName}`);
    if (activeItem) { activeItem.classList.add('active'); }
}


function renderTodos(todosArray, projectName) {
    currentProjectTitle.textContent = projectName; 
    taskListElement.innerHTML = ''; 
    
    todosArray.forEach((task) => {
        const li = document.createElement("li");
        
        li.id = `task-item-${task.id}`; 
        li.classList.add(task.priority, 'flex', 'items-center', 'justify-between', 'p-3', 'shadow-sm', 'mb-2', 'rounded-lg'); 

        if (task.completed) { li.classList.add("completed"); }

        li.innerHTML = `
            <div class="flex-grow flex flex-col md:flex-row md:items-center min-w-0">
                <span class="font-bold truncate text-base">${task.title}</span>
                <div class="flex items-center text-xs md:text-sm text-gray-500 md:ml-4 mt-1 md:mt-0">
                    <span class="mr-2 hidden md:inline">|</span>
                    <span class="mr-2">Due: ${task.dueDate}</span>
                    <span class="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">${task.priority}</span>
                </div>
            </div>
            
            <div class="flex gap-2 ml-2">
                <button class="edit-btn bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm shrink-0">Edit</button>
                <button class="delete-btn bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm shrink-0">Delete</button>
            </div>
        `;
        
        // Checkbox Logic
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.classList.add('mr-3', 'shrink-0');
        checkbox.addEventListener("change", () => {
            DataManager.toggleTodoCompleted(task.id);
            li.classList.toggle("completed"); 
        });
        li.prepend(checkbox);

        // Delete Button Logic
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener("click", () => {
            DataManager.deleteTodo(task.id); 
        });
        
        // Edit Button Logic
        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener("click", () => {
            renderEditForm(task);
        });

        taskListElement.appendChild(li);
    });
}


// --- INITIAL EVENT LISTENERS (Form Submission) ---

function initEventListeners() {
    renderProjects();

    // NEW TASK LISTENER: Captures Date and Priority
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const title = taskInput.value.trim();
        const dueDate = taskDueDateInput.value;
        const priority = taskPriorityInput.value;
        
        if (title === '') { 
            // Simple validation for title
            taskInput.focus();
            return; 
        }

        // Pass all three values to the data manager
        DataManager.addTodoToProject(title, dueDate, priority);
        
        // Reset form inputs after submission
        taskInput.value = ''; 
        taskDueDateInput.value = ''; // Clear date input
        taskPriorityInput.value = 'medium'; // Reset priority dropdown
    });
    
    newProjectForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const projectName = newProjectInput.value.trim();
        if (projectName === '') { return; }
        DataManager.addProject(projectName);
        newProjectInput.value = ''; 
    });
}

export { renderTodos, initEventListeners, renderProjects, setActiveProject, renderEditForm };

