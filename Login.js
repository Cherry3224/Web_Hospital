// R.F Hospital Login System - Enhanced Version
class LoginSystem {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.setupAnimations();
    this.checkSystemPreferences();
  }

  initializeElements() {
    this.elements = {
      form: document.getElementById('loginForm'),
      email: document.getElementById('email'),
      password: document.getElementById('password'),
      togglePw: document.getElementById('togglePw'),
      eyeIcon: document.getElementById('eyeIcon'),
      remember: document.getElementById('remember'),
      submitBtn: document.querySelector('.btn'),
      languageSelect: document.querySelector('.lang select'),
      darkModeToggle: null
    };
    
    this.createDarkModeToggle();
  }

  createDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'dark-mode-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `;
    
    document.querySelector('.brand').after(toggle);
    this.elements.darkModeToggle = toggle;
  }

  bindEvents() {
    // Password toggle
    this.elements.togglePw.addEventListener('click', () => this.togglePassword());
    
    // Form submission
    this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    this.elements.email.addEventListener('input', () => this.validateEmail());
    this.elements.password.addEventListener('input', () => this.validatePassword());
    
    // Dark mode toggle
    this.elements.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
    
    // Language change
    this.elements.languageSelect.addEventListener('change', (e) => this.changeLanguage(e));
    
    // Auto-save remember me preference
    this.elements.remember.addEventListener('change', () => this.saveRememberPreference());
    
    // Load saved preferences
    this.loadSavedPreferences();
  }

  togglePassword() {
    const password = this.elements.password;
    const eyeIcon = this.elements.eyeIcon;
    const isVisible = password.type === 'password';
    
    password.type = isVisible ? 'text' : 'password';
    
    // Smooth icon transition
    eyeIcon.style.transform = 'scale(0.8)';
    setTimeout(() => {
      eyeIcon.innerHTML = isVisible 
        ? '<path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a20.66 0 014.33-5.94M9.9 4.24A10.94 0 0112 4c7 0 11 8 11 8a20.49 0 01-3.64 5.37"/><path d="M1 1l22 22"/>'
        : '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>';
      eyeIcon.style.transform = 'scale(1)';
    }, 100);
  }

  validateEmail() {
    const email = this.elements.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email.value);
    
    this.updateInputValidation(email, isValid, 'Please enter a valid email address');
    return isValid;
  }

  validatePassword() {
    const password = this.elements.password;
    const isValid = password.value.length >= 6;
    
    this.updateInputValidation(password, isValid, 'Password must be at least 6 characters');
    return isValid;
  }

  updateInputValidation(input, isValid, message) {
    const container = input.closest('.input');
    
    // Remove existing validation states
    container.classList.remove('valid', 'invalid');
    
    // Remove existing error message
    const existingError = container.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    if (input.value.length > 0) {
      if (isValid) {
        container.classList.add('valid');
      } else {
        container.classList.add('invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        container.appendChild(errorDiv);
      }
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateEmail() || !this.validatePassword()) {
      this.showNotification('Please fix the errors above', 'error');
      return;
    }
    
    // Show loading state
    this.setLoadingState(true);
    
    try {
      // Simulate API call
      await this.simulateLogin();
      
      // Success
      this.showNotification('Login successful! Redirecting...', 'success');
      
      // Save preferences if remember me is checked
      if (this.elements.remember.checked) {
        this.saveUserPreferences();
      }
      
      // Redirect after delay (in real app, this would be to dashboard)
      setTimeout(() => {
        this.showNotification('Demo: This would redirect to dashboard', 'info');
        this.setLoadingState(false);
      }, 2000);
      
    } catch (error) {
      this.showNotification('Login failed. Please try again.', 'error');
      this.setLoadingState(false);
    }
  }

  async simulateLogin() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Network error');
    }
  }

  setLoadingState(isLoading) {
    const btn = this.elements.submitBtn;
    
    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Signing in...';
    } else {
      btn.disabled = false;
      btn.innerHTML = 'Sign in';
    }
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Close notification">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    });
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Save preference
    localStorage.setItem('darkMode', isDark);
    
    // Update toggle icon
    const toggle = this.elements.darkModeToggle;
    toggle.innerHTML = isDark 
      ? '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    
    // Animate toggle
    toggle.style.transform = 'rotate(180deg)';
    setTimeout(() => toggle.style.transform = 'rotate(0deg)', 300);
  }

  changeLanguage(e) {
    const language = e.target.value;
    // In real app, this would change the entire UI language
    this.showNotification(`Language changed to ${language}`, 'info');
  }

  saveRememberPreference() {
    localStorage.setItem('rememberMe', this.elements.remember.checked);
  }

  saveUserPreferences() {
    const preferences = {
      email: this.elements.email.value,
      rememberMe: this.elements.remember.checked,
      language: this.elements.languageSelect.value
    };
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }

  loadSavedPreferences() {
    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      document.body.classList.add('dark-mode');
      this.elements.darkModeToggle.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    }
    
    // Load remember me preference
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    this.elements.remember.checked = rememberMe;
    
    // Load user preferences if available
    const userPrefs = localStorage.getItem('userPreferences');
    if (userPrefs && rememberMe) {
      try {
        const prefs = JSON.parse(userPrefs);
        this.elements.email.value = prefs.email || '';
        this.elements.languageSelect.value = prefs.language || 'English (United Kingdom)';
      } catch (e) {
        console.warn('Failed to load user preferences:', e);
      }
    }
  }

  checkSystemPreferences() {
    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      if (localStorage.getItem('darkMode') === null) {
        document.body.classList.add('dark-mode');
        this.elements.darkModeToggle.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      }
    }
  }

  setupAnimations() {
    // Add entrance animations
    const elements = document.querySelectorAll('.brand, .panel, .site-footer');
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LoginSystem();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K to focus email
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('email').focus();
  }
  
  // Ctrl/Cmd + L to focus password
  if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
    e.preventDefault();
    document.getElementById('password').focus();
  }
  
  // Enter to submit form (when focused on inputs)
  if (e.key === 'Enter' && (e.target.type === 'email' || e.target.type === 'password')) {
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
  }
});
