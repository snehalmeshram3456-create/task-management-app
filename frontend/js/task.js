// ==================== KANBAN BOARD ====================

let allTasks = [];

async function loadKanbanBoard() {
    try {
        showSpinner();
        const result = await getTasks();
        
        if (result.success) {
            allTasks = result.tasks;
            renderKanbanBoard();
        }
    } catch (error) {
        console.error('Error loading kanban board:', error);
        showToast('Error loading tasks', 'error');
    } finally {
        hideSpinner();
    }
}

function renderKanbanBoard() {
    const statuses = ['Pending', 'In Progress', 'Completed'];
    
    statuses.forEach(status => {
        const column = document.getElementById(status.toLowerCase().replace(' ', '') + 'Tasks');
        const tasks = allTasks.filter(task => task.status === status);
        const count = document.getElementById(
            status === 'In Progress' ? 'inProgressCount' :
            status === 'Pending' ? 'pendingCount' : 'completedCount'
        );
        
        if (column) {
            column.innerHTML = '';
            tasks.forEach(task => {
                column.appendChild(createTaskCard(task));
            });
            
            if (count) {
                count.textContent = tasks.length;
            }
            
            // Make column droppable
            column.addEventListener('dragover', handleDragOver);
            column.addEventListener('drop', (e) => handleDrop(e, status));
        }
    });
    
    // Add drag event listeners to all task cards
    document.querySelectorAll('.task-card').forEach(card => {
        card.draggable = true;
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card task-priority ${task.priority}`;
    card.draggable = true;
    card.dataset.taskId = task._id;
    
    const priorityColor = {
        'Low': 'badge-low',
        'Medium': 'badge-medium',
        'High': 'badge-high'
    };
    
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date';
    
    card.innerHTML = `
        <h4>${escapeHtml(task.title)}</h4>
        <p>${escapeHtml(task.description || 'No description')}</p>
        <div class="task-meta">
            <span class="task-badge ${priorityColor[task.priority]}">${task.priority}</span>
            <span class="task-badge">${task.category}</span>
        </div>
        <small>${dueDate}</small>
        <div class="task-actions">
            <button onclick="editTask('${task._id}')" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteTaskConfirm('${task._id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return card;
}

let draggedTaskId = null;

function handleDragStart(e) {
    draggedTaskId = this.dataset.taskId;
    this.classList.add('dragging');
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

async function handleDrop(e, newStatus) {
    e.preventDefault();
    
    if (!draggedTaskId) return;
    
    try {
        showSpinner();
        const result = await updateTask(draggedTaskId, { status: newStatus });
        
        if (result.success) {
            showToast('Task status updated', 'success');
            loadKanbanBoard();
        }
    } catch (error) {
        showToast('Error updating task', 'error');
    } finally {
        hideSpinner();
    }
}

// ==================== TASKS LIST VIEW ====================

async function loadTasksList() {
    try {
        showSpinner();
        
        const filters = {
            status: document.getElementById('statusFilter')?.value,
            priority: document.getElementById('priorityFilter')?.value,
            category: document.getElementById('categoryFilter')?.value,
            sort: document.getElementById('sortFilter')?.value || 'newest',
            search: document.getElementById('searchInput')?.value
        };
        
        // Remove empty filters
        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });
        
        const result = await getTasks(filters);
        
        if (result.success) {
            allTasks = result.tasks;
            renderTasksTable();
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        showToast('Error loading tasks', 'error');
    } finally {
        hideSpinner();
    }
}

function renderTasksTable() {
    const tbody = document.getElementById('tasksTableBody');
    
    if (!tbody) return;
    
    if (allTasks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    No tasks found
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = allTasks.map(task => `
        <tr>
            <td class="task-title-cell">${escapeHtml(task.title)}</td>
            <td>
                <span class="status-badge status-${task.status.toLowerCase().replace(' ', '-')}">
                    ${task.status}
                </span>
            </td>
            <td>
                <span class="task-badge badge-${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>
            </td>
            <td>${task.category}</td>
            <td>
                ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
            </td>
            <td>
                <button onclick="editTask('${task._id}')" class="action-btn" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteTaskConfirm('${task._id}')" class="action-btn" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ==================== ANALYTICS ====================

async function loadAnalytics() {
    try {
        showSpinner();
        const result = await getTasks();
        
        if (result.success) {
            const tasks = result.tasks;
            const completedTasks = tasks.filter(t => t.status === 'Completed');
            
            const completionRate = tasks.length > 0 
                ? Math.round((completedTasks.length / tasks.length) * 100)
                : 0;
            
            const avgTasksPerDay = tasks.length > 0
                ? (tasks.length / 7).toFixed(1)
                : 0;
            
            const onTimeCompletion = completedTasks.length > 0
                ? Math.round((completedTasks.filter(t => {
                    if (!t.dueDate) return false;
                    return new Date(t.completedAt) <= new Date(t.dueDate);
                }).length / completedTasks.length) * 100)
                : 0;
            
            document.getElementById('completionRate').textContent = completionRate + '%';
            document.getElementById('avgTasksPerDay').textContent = avgTasksPerDay;
            document.getElementById('onTimeCompletion').textContent = onTimeCompletion + '%';
            document.getElementById('timeSaved').textContent = (completedTasks.length * 0.5).toFixed(1) + 'h';
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
        showToast('Error loading analytics', 'error');
    } finally {
        hideSpinner();
    }
}

// ==================== TASK OPERATIONS ====================

function editTask(taskId) {
    openTaskModal(taskId);
}

async function deleteTaskConfirm(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            showSpinner();
            const result = await deleteTask(taskId);
            
            if (result.success) {
                showToast('Task deleted successfully', 'success');
                
                // Reload current view
                const activeNav = document.querySelector('.nav-item.active');
                const view = activeNav?.dataset.view || 'dashboard';
                handleNavigation(view);
            }
        } catch (error) {
            showToast('Error deleting task', 'error');
        } finally {
            hideSpinner();
        }
    }
}

// ==================== FILTER AND SEARCH ====================

const filterElements = ['statusFilter', 'priorityFilter', 'categoryFilter', 'sortFilter', 'searchInput'];

filterElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('change', () => {
            loadTasksList();
        });
        
        if (id === 'searchInput') {
            element.addEventListener('input', () => {
                // Debounce search
                clearTimeout(window.searchTimeout);
                window.searchTimeout = setTimeout(() => {
                    loadTasksList();
                }, 500);
            });
        }
    }
});

// ==================== UTILITY FUNCTIONS ====================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ==================== PAGE LOAD ====================

// Set default view
if (document.querySelector('.nav-item.active')) {
    const defaultView = document.querySelector('.nav-item.active').dataset.view;
    handleNavigation(defaultView);
}
