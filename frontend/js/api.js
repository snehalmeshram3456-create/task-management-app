// API Configuration
const API_URL = "https://task-management-app-d629.onrender.com/api";

// Get token from localStorage
function getAuthToken() {
    return localStorage.getItem('token');
}

// Set token in localStorage
function setAuthToken(token) {
    localStorage.setItem('token', token);
}

// Remove token from localStorage
function removeAuthToken() {
    localStorage.removeItem('token');
}

// API Headers with authentication
function getHeaders(hasAuth = true) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (hasAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    return headers;
}

// Generic API call function
async function apiCall(endpoint, method = 'GET', data = null, hasAuth = true) {
    try {
        const options = {
            method,
            headers: getHeaders(hasAuth)
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw {
                status: response.status,
                message: result.message || 'An error occurred'
            };
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== AUTH ENDPOINTS ====================

// Register user
async function registerUser(fullName, email, password, passwordConfirm) {
    return apiCall('/auth/register', 'POST', {
        fullName,
        email,
        password,
        passwordConfirm
    }, false);
}

// Login user
async function loginUser(email, password) {
    return apiCall('/auth/login', 'POST', {
        email,
        password
    }, false);
}

// Get user profile
async function getUserProfile() {
    return apiCall('/auth/profile', 'GET');
}

// Logout user
async function logoutUser() {
    return apiCall('/auth/logout', 'POST');
}

// ==================== TASK ENDPOINTS ====================

// Get all tasks with filters
async function getTasks(filters = {}) {
    let endpoint = '/tasks';
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.category) params.append('category', filters.category);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.search) params.append('search', filters.search);
    
    if (params.toString()) {
        endpoint += '?' + params.toString();
    }
    
    return apiCall(endpoint, 'GET');
}

// Get single task
async function getTask(taskId) {
    return apiCall(`/tasks/${taskId}`, 'GET');
}

// Create task
async function createTask(taskData) {
    return apiCall('/tasks', 'POST', taskData);
}

// Update task
async function updateTask(taskId, taskData) {
    return apiCall(`/tasks/${taskId}`, 'PUT', taskData);
}

// Delete task
async function deleteTask(taskId) {
    return apiCall(`/tasks/${taskId}`, 'DELETE');
}

// Get dashboard statistics
async function getDashboardStats() {
    return apiCall('/tasks/stats/dashboard', 'GET');
}

// ==================== UTILITY FUNCTIONS ====================

// Check if user is authenticated
function isAuthenticated() {
    return getAuthToken() !== null;
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
    }
}

// Handle API errors
function handleApiError(error) {
    console.error('API Error:', error);
    
    if (error.status === 401) {
        removeAuthToken();
        window.location.href = '/login.html';
    }
    
    return error.message || 'An error occurred';
}
