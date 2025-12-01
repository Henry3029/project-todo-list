// src/index.js

import * as DataManager from './dataManager.js';
import * as DOMManager from './domManager.js';

// ON page load:
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load data from storage
    DataManager.loadFromStorage();
    
    // 2. Set up event listeners (which now includes renderProjects)
    DOMManager.initEventListeners();
    
    // 3. Render the initial view (the Default project)
    // We get the array for 'Default' from the data manager
    DOMManager.renderTodos(DataManager.projects[DataManager.currentProject], DataManager.currentProject);
});