// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksList = document.getElementById('tasks-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');
const modalClose = document.getElementById('modal-close');

// Task Management
let tasks = [];
let currentFilter = 'all';
let taskIdCounter = 1;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTaskManager();
    initializeContactForm();
    updateTaskStats();
    renderTasks();
});

// Navigation Functions
function initializeNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
            switchSection(targetSection);
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function switchSection(targetSection) {
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `${targetSection}-section`) {
            section.classList.add('active');
        }
    });
}

// Task Manager Functions
function initializeTaskManager() {
    // Add task event listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Filter event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentFilter = button.dataset.filter;
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            renderTasks();
        });
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    
    if (!taskText) {
        showNotification('Please enter a task!', 'error');
        return;
    }
    
    const newTask = {
        id: taskIdCounter++,
        text: taskText,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(newTask);
    taskInput.value = '';
    prioritySelect.value = 'medium';
    
    updateTaskStats();
    renderTasks();
    showNotification('Task added successfully!', 'success');
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        updateTaskStats();
        renderTasks();
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        updateTaskStats();
        renderTasks();
        showNotification('Task deleted successfully!', 'success');
    }
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim()) {
            task.text = newText.trim();
            renderTasks();
            showNotification('Task updated successfully!', 'success');
        }
    }
}

function updateTaskStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('pending-tasks').textContent = pendingTasks;
}

function renderTasks() {
    let filteredTasks = tasks;
    
    // Apply filter
    switch (currentFilter) {
        case 'completed':
            filteredTasks = tasks.filter(t => t.completed);
            break;
        case 'pending':
            filteredTasks = tasks.filter(t => !t.completed);
            break;
        default:
            filteredTasks = tasks;
    }
    
    // Clear tasks list
    tasksList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        const emptyState = createEmptyState();
        tasksList.appendChild(emptyState);
        return;
    }
    
    // Render tasks
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.setAttribute('data-task-id', task.id);
    
    const createdDate = new Date(task.createdAt).toLocaleDateString();
    const createdTime = new Date(task.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
               onchange="toggleTask(${task.id})">
        <div class="task-content">
            <div class="task-text">${escapeHtml(task.text)}</div>
            <div class="task-meta">
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                <span class="task-date">
                    <i class="fas fa-calendar"></i> ${createdDate}
                </span>
                <span class="task-time">
                    <i class="fas fa-clock"></i> ${createdTime}
                </span>
            </div>
        </div>
        <div class="task-actions">
            <button class="task-btn edit-btn" onclick="editTask(${task.id})" title="Edit Task">
                <i class="fas fa-edit"></i>
            </button>
            <button class="task-btn delete-btn" onclick="deleteTask(${task.id})" title="Delete Task">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return taskItem;
}

function createEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    
    let message = '';
    switch (currentFilter) {
        case 'completed':
            message = `
                <i class="fas fa-check-circle"></i>
                <h3>No completed tasks!</h3>
                <p>Complete some tasks to see them here</p>
            `;
            break;
        case 'pending':
            message = `
                <i class="fas fa-hourglass-half"></i>
                <h3>No pending tasks!</h3>
                <p>All caught up! Great job!</p>
            `;
            break;
        default:
            message = `
                <i class="fas fa-clipboard-check"></i>
                <h3>No tasks yet!</h3>
                <p>Add your first task to get started</p>
            `;
    }
    
    emptyState.innerHTML = message;
    return emptyState;
}

// Contact Form Functions
function initializeContactForm() {
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    // Add real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Modal close
    modalClose.addEventListener('click', closeModal);
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal();
        }
    });
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    let isValid = true;
    let message = '';
    
    // Clear previous error
    formGroup.classList.remove('error');
    errorMessage.textContent = '';
    
    // Validation rules
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        message = 'This field is required';
    } else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    } else if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(field.value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }
    } else if (field.name === 'firstName' || field.name === 'lastName') {
        if (field.value && field.value.length < 2) {
            isValid = false;
            message = 'Name must be at least 2 characters long';
        }
    }
    
    if (!isValid) {
        formGroup.classList.add('error');
        errorMessage.textContent = message;
    }
    
    return isValid;
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    errorMessage.textContent = '';
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    let isFormValid = true;
    
    // Validate all fields
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        showModal('Message sent successfully!', 'Your message has been sent. We\'ll get back to you soon!');
    }, 2000);
}

function showModal(title, message) {
    document.getElementById('modal-message').textContent = message;
    successModal.classList.add('show');
}

function closeModal() {
    successModal.classList.remove('show');
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #e53e3e, #c53030)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #4299e1, #3182ce)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + 1 for Tasks
    if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        switchSection('todo');
        navButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-section="todo"]').classList.add('active');
    }
    
    // Ctrl/Cmd + 2 for Contact
    if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        switchSection('contact');
        navButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-section="contact"]').classList.add('active');
    }
    
    // Escape to close modal
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        closeModal();
    }
});

// Auto-save tasks to localStorage (optional enhancement)
function saveTasksToStorage() {
    try {
        localStorage.setItem('taskmaster_tasks', JSON.stringify(tasks));
        localStorage.setItem('taskmaster_counter', taskIdCounter.toString());
    } catch (error) {
        console.log('Storage not available');
    }
}

function loadTasksFromStorage() {
    try {
        const savedTasks = localStorage.getItem('taskmaster_tasks');
        const savedCounter = localStorage.getItem('taskmaster_counter');
        
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
        
        if (savedCounter) {
            taskIdCounter = parseInt(savedCounter);
        }
    } catch (error) {
        console.log('Storage not available');
    }
}

// Initialize storage on load
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    updateTaskStats();
    renderTasks();
});

// Save tasks whenever they change
function addTask() {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    
    if (!taskText) {
        showNotification('Please enter a task!', 'error');
        return;
    }
    
    const newTask = {
        id: taskIdCounter++,
        text: taskText,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(newTask);
    taskInput.value = '';
    prioritySelect.value = 'medium';
    
    saveTasksToStorage();
    updateTaskStats();
    renderTasks();
    showNotification('Task added successfully!', 'success');
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        updateTaskStats();
        renderTasks();
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasksToStorage();
        updateTaskStats();
        renderTasks();
        showNotification('Task deleted successfully!', 'success');
    }
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim()) {
            task.text = newText.trim();
            saveTasksToStorage();
            renderTasks();
            showNotification('Task updated successfully!', 'success');
        }
    }
}

// Add some sample tasks for demo (optional)
function addSampleTasks() {
    if (tasks.length === 0) {
        const sampleTasks = [
            { text: 'Complete project documentation', priority: 'high' },
            { text: 'Review code changes', priority: 'medium' },
            { text: 'Update dependencies', priority: 'low' },
            { text: 'Prepare presentation slides', priority: 'high' }
        ];
        
        sampleTasks.forEach(taskData => {
            tasks.push({
                id: taskIdCounter++,
                text: taskData.text,
                priority: taskData.priority,
                completed: false,
                createdAt: new Date().toISOString()
            });
        });
        
        saveTasksToStorage();
        updateTaskStats();
        renderTasks();
    }
}

// Uncomment to add sample tasks on first load
// addSampleTasks();