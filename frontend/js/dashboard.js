// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    initializeDashboard();
    setupEventListeners();
    loadUserProfile();
    loadDashboardStats();
});

// Initialize Dashboard
function initializeDashboard() {
    const body = document.body;
    
    // Check for saved theme preference
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon();
    }
    
    // Create dashboard layout
    if (!document.body.classList.contains('dashboard-layout')) {
        document.body.classList.add('dashboard-layout');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    // Close sidebar on nav item click (mobile)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation(item.dataset.view);
            sidebar.classList.remove('open');
        });
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Create task button
    const createTaskBtn = document.getElementById('createTaskBtn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', () => openTaskModal());
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Modal close
    const modal = document.getElementById('taskModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeTaskModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeTaskModal();
            }
        });
    }
    
    // Task form submit
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', handleTaskFormSubmit);
    }
}

// ==================== NAVIGATION ====================

function handleNavigation(view) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        kanban: 'Kanban Board',
        tasks: 'All Tasks',
        analytics: 'Analytics'
    };
    
    document.getElementById('pageTitle').textContent = titles[view] || 'Dashboard';
    
    // Hide all views
    document.querySelectorAll('.view-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Show selected view
    document.getElementById(`${view}View`).style.display = 'block';
    
    // Load view-specific data
    if (view === 'dashboard') {
        loadDashboardStats();
    } else if (view === 'kanban') {
        loadKanbanBoard();
    } else if (view === 'tasks') {
        loadTasksList();
    } else if (view === 'analytics') {
        loadAnalytics();
    }
}

// ==================== USER PROFILE ====================

async function loadUserProfile() {
    try {
        const result = await getUserProfile();
        
        if (result.success) {
            const user = result.user;
            document.getElementById('userName').textContent = user.fullName;
            document.getElementById('userEmail').textContent = user.email;
            
            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(user));
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

// ==================== LOGOUT ====================

async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            await logoutUser();
            
            // Clear storage
            removeAuthToken();
            localStorage.removeItem('user');
            localStorage.removeItem('currentTask');
            
            // Show toast and redirect
            showToast('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = './login.html';
            }, 1000);
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
}

// ==================== THEME TOGGLE ====================

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    body.classList.toggle('dark-mode');
    
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const icon = themeToggle.querySelector('i');
    
    if (isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ==================== NOTIFICATIONS ====================

function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// ==================== LOADING SPINNER ====================

function showSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.add('show');
    }
}

function hideSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.remove('show');
    }
}

// ==================== TASK MODAL ====================

function openTaskModal(taskId = null) {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const modalTitle = document.getElementById('modalTitle');
    
    form.reset();
    
    if (taskId) {
        modalTitle.textContent = 'Edit Task';
        localStorage.setItem('currentTask', taskId);
        loadTaskForEdit(taskId);
    } else {
        modalTitle.textContent = 'Create New Task';
        localStorage.removeItem('currentTask');
    }
    
    modal.classList.add('show');
}

function closeTaskModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('show');
    localStorage.removeItem('currentTask');
}

function loadTaskForEdit(taskId) {
    showSpinner();
    
    getTask(taskId)
        .then(result => {
            if (result.success) {
                const task = result.task;
                document.getElementById('taskTitle').value = task.title;
                document.getElementById('taskDescription').value = task.description || '';
                document.getElementById('taskPriority').value = task.priority;
                document.getElementById('taskStatus').value = task.status;
                document.getElementById('taskCategory').value = task.category;
                
                if (task.dueDate) {
                    document.getElementById('taskDueDate').value = task.dueDate.split('T')[0];
                }
            }
        })
        .catch(error => {
            showToast('Error loading task', 'error');
        })
        .finally(() => hideSpinner());
}

async function handleTaskFormSubmit(e) {
    e.preventDefault();
    
    const taskTitle = document.getElementById('taskTitle').value.trim();
    
    if (!taskTitle) {
        showToast('Please enter a task title', 'warning');
        return;
    }
    
    const taskData = {
        title: taskTitle,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value,
        dueDate: document.getElementById('taskDueDate').value,
        category: document.getElementById('taskCategory').value
    };
    
    try {
        showSpinner();
        const currentTaskId = localStorage.getItem('currentTask');
        let result;
        
        if (currentTaskId) {
            result = await updateTask(currentTaskId, taskData);
        } else {
            result = await createTask(taskData);
        }
        
        if (result.success) {
            showToast(
                currentTaskId ? 'Task updated successfully!' : 'Task created successfully!',
                'success'
            );
            closeTaskModal();
            
            // Reload the current view
            const activeNav = document.querySelector('.nav-item.active');
            const view = activeNav?.dataset.view || 'dashboard';
            handleNavigation(view);
        }
    } catch (error) {
        showToast(handleApiError(error), 'error');
    } finally {
        hideSpinner();
    }
}

// ==================== CHART INITIALIZATION ====================

let statusChart = null;
let completionChart = null;

function initializeCharts(stats) {
    const statusCtx = document.getElementById('statusChart');
    const completionCtx = document.getElementById('completionChart');
    
    if (!statusCtx || !completionCtx) return;
    
    // Destroy existing charts
    if (statusChart) statusChart.destroy();
    if (completionChart) completionChart.destroy();
    
    // Status Distribution Chart
    const statusData = {
        pending: 0,
        inProgress: 0,
        completed: 0
    };
    
    stats.tasksByPriority?.forEach(item => {
        // We'll use status counts instead
    });
    
    statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'In Progress', 'Completed'],
            datasets: [{
                data: [
                    stats.pendingTasks || 0,
                    stats.inProgressTasks || 0,
                    stats.completedTasks || 0
                ],
                backgroundColor: ['#3b82f6', '#f59e0b', '#22c55e'],
                borderColor: 'white',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Weekly Completion Chart
    const weeklyLabels = stats.weeklyCompletion?.map(item => item._id) || [];
    const weeklyData = stats.weeklyCompletion?.map(item => item.count) || [];
    
    completionChart = new Chart(completionCtx, {
        type: 'line',
        data: {
            labels: weeklyLabels.length ? weeklyLabels : ['No data'],
            datasets: [{
                label: 'Tasks Completed',
                data: weeklyData.length ? weeklyData : [0],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: 'white',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ==================== DASHBOARD STATS ====================

async function loadDashboardStats() {
    try {
        showSpinner();
        const result = await getDashboardStats();
        
        if (result.success) {
            const stats = result.stats;
            
            // Update stat cards
            document.getElementById('totalTasks').textContent = stats.totalTasks;
            document.getElementById('completedTasks').textContent = stats.completedTasks;
            document.getElementById('pendingTasks').textContent = stats.pendingTasks;
            document.getElementById('overdueTasks').textContent = stats.overdueTasks;
            
            // Initialize charts
            initializeCharts(stats);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showToast('Error loading dashboard data', 'error');
    } finally {
        hideSpinner();
    }
}
