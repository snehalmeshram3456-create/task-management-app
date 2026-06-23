// ==================== LANDING PAGE ====================

document.addEventListener('DOMContentLoaded', () => {
    setupLandingPageListeners();
    checkAuthStatus();
});

function setupLandingPageListeners() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.navbar-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Close mobile menu on link click
    document.querySelectorAll('.navbar-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.style.display = 'none';
        });
    });
}

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('token');
    
    if (isLoggedIn) {
        // If user is already logged in, redirect to dashboard
        // Only do this if they're on the landing page
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            // Don't force redirect, let them stay on landing page but they can go to dashboard
        }
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
