// ==================== PASSWORD TOGGLE ====================

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = event.target.closest('.toggle-password').querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function togglePasswordConfirm() {
    const passwordInput = document.getElementById('passwordConfirm');
    const icon = event.target.closest('.toggle-password').querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ==================== FORM HANDLERS ====================

// Check if we're on login or register page
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    
    // Validation
    if (!email || !password) {
        showError('Please fill in all fields', errorDiv);
        return;
    }
    
    try {
        showSpinner();
        const result = await loginUser(email, password);
        
        if (result.success) {
            // Save token
            setAuthToken(result.token);
            
            // Save user info
            localStorage.setItem('user', JSON.stringify(result.user));
            
            // Show success toast
            showToast('Login successful!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 1000);
        }
    } catch (error) {
        showError(handleApiError(error), errorDiv);
    } finally {
        hideSpinner();
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const errorDiv = document.getElementById('errorMessage');
    
    // Validation
    if (!fullName || !email || !password || !passwordConfirm) {
        showError('Please fill in all fields', errorDiv);
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters', errorDiv);
        return;
    }
    
    if (password !== passwordConfirm) {
        showError('Passwords do not match', errorDiv);
        return;
    }
    
    try {
        showSpinner();
        const result = await registerUser(fullName, email, password, passwordConfirm);
        
        if (result.success) {
            // Save token
            setAuthToken(result.token);
            
            // Save user info
            localStorage.setItem('user', JSON.stringify(result.user));
            
            // Show success toast
            showToast('Account created successfully!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        }
    } catch (error) {
        showError(handleApiError(error), errorDiv);
    } finally {
        hideSpinner();
    }
}

// ==================== ERROR HANDLING ====================

function showError(message, errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
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
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
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
