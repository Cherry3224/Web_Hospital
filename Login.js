
class LoginSystem {
  constructor() {
    this.currentLanguage = 'vi-vn';
    this.loginAttempts = 0; // Số lần đăng nhập thất bại
    this.maxAttempts = 5; // Tối đa 5 lần thử
    this.lockoutTime = 300000; // Khóa tài khoản 5 phút
    this.validationTimeouts = new Map(); // Timeout cho validation
    this.passwordStrength = 0; // Độ mạnh mật khẩu
    
    // Cache các DOM element để tăng hiệu suất
    this.domCache = new Map();
    
    // Bộ từ điển đa ngôn ngữ
    this.translations = {
      'vi-vn': {
        title: 'Đăng nhập',
        subtitle: 'Nhập Email và Mật Khẩu',
        passwordPlaceholder: 'Mật khẩu',
        forgotPassword: 'Quên mật khẩu?',
        signIn: 'Đăng nhập',
        emailError: 'Vui lòng nhập email hợp lệ',
        emailMustBeGmail: 'Email phải kết thúc bằng @gmail.com',
        emailNoDiacritics: 'Email không được chứa dấu tiếng Việt',
        passwordError: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
        passwordWeak: 'Mật khẩu yếu',
        passwordMedium: 'Mật khẩu trung bình',
        passwordStrong: 'Mật khẩu mạnh',
        validationError: 'Vui lòng sửa các lỗi bên trên',
        loginSuccess: 'Đăng nhập thành công! Đang chuyển hướng...',
        loginFailed: 'Đăng nhập thất bại. Vui lòng thử lại.',
        accountLocked: 'Tài khoản tạm khóa do quá nhiều lần đăng nhập sai. Thử lại sau 5 phút.',
        demoRedirect: 'Demo: Sẽ chuyển hướng đến trang chính',
        languageChanged: 'Ngôn ngữ đã được thay đổi',
        togglePassword: 'Hiện/ẩn mật khẩu',
        toggleDarkMode: 'Chuyển đổi chế độ tối',
        formAutoSaved: 'Đã tự động lưu thông tin',
        connectionError: 'Lỗi kết nối. Đang thử lại...',
        help: 'Trợ giúp',
        privacy: 'Quyền riêng tư',
        terms: 'Điều khoản'
      },
      'zh-cn': {
        title: '登录',
        subtitle: '输入邮箱和密码',
        passwordPlaceholder: '密码',
        forgotPassword: '忘记密码？',
        signIn: '登录',
        emailError: '请输入有效的邮箱地址',
        emailMustBeGmail: '邮箱必须以@gmail.com结尾',
        emailNoDiacritics: '邮箱不能包含特殊字符',
        passwordError: '密码至少需要8个字符，包含大小写字母和数字',
        passwordWeak: '密码较弱',
        passwordMedium: '密码中等',
        passwordStrong: '密码强度高',
        validationError: '请修正上述错误',
        loginSuccess: '登录成功！正在跳转...',
        loginFailed: '登录失败，请重试。',
        accountLocked: '由于多次登录失败，账户已临时锁定。请5分钟后重试。',
        demoRedirect: '演示：将跳转到主页',
        languageChanged: '语言已更改',
        togglePassword: '显示/隐藏密码',
        toggleDarkMode: '切换深色模式',
        formAutoSaved: '表单已自动保存',
        connectionError: '连接错误，正在重试...',
        help: '帮助',
        privacy: '隐私',
        terms: '条款'
      },
      'en-gb': {
        title: 'Sign in',
        subtitle: 'Enter Email and Password',
        passwordPlaceholder: 'Password',
        forgotPassword: 'Forgot password?',
        signIn: 'Sign in',
        emailError: 'Please enter a valid email address',
        emailMustBeGmail: 'Email must end with @gmail.com',
        emailNoDiacritics: 'Email cannot contain special characters',
        passwordError: 'Password must be at least 8 characters with uppercase, lowercase and numbers',
        passwordWeak: 'Weak password',
        passwordMedium: 'Medium password',
        passwordStrong: 'Strong password',
        validationError: 'Please fix the errors above',
        loginSuccess: 'Login successful! Redirecting...',
        loginFailed: 'Login failed. Please try again.',
        accountLocked: 'Account temporarily locked due to too many failed attempts. Try again in 5 minutes.',
        demoRedirect: 'Demo: This would redirect to dashboard',
        languageChanged: 'Language changed',
        togglePassword: 'Show/hide password',
        toggleDarkMode: 'Toggle dark mode',
        formAutoSaved: 'Form auto-saved',
        connectionError: 'Connection error. Retrying...',
        help: 'Help',
        privacy: 'Privacy',
        terms: 'Terms'
      },
      'en-us': {
        title: 'Sign in',
        subtitle: 'Enter Email and Password',
        passwordPlaceholder: 'Password',
        forgotPassword: 'Forgot password?',
        signIn: 'Sign in',
        emailError: 'Please enter a valid email address',
        emailMustBeGmail: 'Email must end with @gmail.com',
        emailNoDiacritics: 'Email cannot contain special characters',
        passwordError: 'Password must be at least 8 characters with uppercase, lowercase and numbers',
        passwordWeak: 'Weak password',
        passwordMedium: 'Medium password',
        passwordStrong: 'Strong password',
        validationError: 'Please fix the errors above',
        loginSuccess: 'Login successful! Redirecting...',
        loginFailed: 'Login failed. Please try again.',
        accountLocked: 'Account temporarily locked due to too many failed attempts. Try again in 5 minutes.',
        demoRedirect: 'Demo: This would redirect to dashboard',
        languageChanged: 'Language changed',
        togglePassword: 'Show/hide password',
        toggleDarkMode: 'Toggle dark mode',
        formAutoSaved: 'Form auto-saved',
        connectionError: 'Connection error. Retrying...',
        help: 'Help',
        privacy: 'Privacy',
        terms: 'Terms'
      },
      'de-de': {
        title: 'Anmelden',
        subtitle: 'E-Mail und Passwort eingeben',
        passwordPlaceholder: 'Passwort',
        forgotPassword: 'Passwort vergessen?',
        signIn: 'Anmelden',
        emailError: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        emailMustBeGmail: 'E-Mail muss mit @gmail.com enden',
        emailNoDiacritics: 'E-Mail darf keine Sonderzeichen enthalten',
        passwordError: 'Das Passwort muss mindestens 8 Zeichen lang sein und Groß-, Kleinbuchstaben sowie Zahlen enthalten',
        passwordWeak: 'Schwaches Passwort',
        passwordMedium: 'Mittleres Passwort',
        passwordStrong: 'Starkes Passwort',
        validationError: 'Bitte beheben Sie die oben genannten Fehler',
        loginSuccess: 'Anmeldung erfolgreich! Weiterleitung...',
        loginFailed: 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
        accountLocked: 'Konto aufgrund zu vieler fehlgeschlagener Versuche vorübergehend gesperrt. Versuchen Sie es in 5 Minuten erneut.',
        demoRedirect: 'Demo: Dies würde zum Dashboard weiterleiten',
        languageChanged: 'Sprache geändert',
        togglePassword: 'Passwort anzeigen/verbergen',
        toggleDarkMode: 'Dunklen Modus umschalten',
        formAutoSaved: 'Formular automatisch gespeichert',
        connectionError: 'Verbindungsfehler. Wiederholung...',
        help: 'Hilfe',
        privacy: 'Datenschutz',
        terms: 'Bedingungen'
      }
    };
    
    // Khởi tạo các thành phần
    this.initializeElements();
    this.bindEvents();
    this.setupAnimations();
    this.checkSystemPreferences();
    this.setupAutoSave();
    this.checkAccountLockout();
  }

  // Lấy element từ cache để tăng hiệu suất
  getElement(selector, useCache = true) {
    if (useCache && this.domCache.has(selector)) {
      return this.domCache.get(selector);
    }
    const element = document.querySelector(selector);
    if (useCache) {
      this.domCache.set(selector, element);
    }
    return element;
  }

  // Khởi tạo các DOM element
  initializeElements() {
    this.elements = {
      form: this.getElement('#loginForm'),
      email: this.getElement('#email'),
      password: this.getElement('#password'),
      togglePw: this.getElement('#togglePw'),
      eyeIcon: this.getElement('#eyeIcon'),
      remember: this.getElement('#remember'),
      submitBtn: this.getElement('.btn'),
      languageSelect: this.getElement('.lang select'),
      darkModeToggle: null
    };
    
    this.createDarkModeToggle();
    this.createPasswordStrengthIndicator();
  }

  // Tạo nút chuyển đổi chế độ tối
  createDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'dark-mode-toggle';
    toggle.setAttribute('aria-label', 'Chuyển đổi chế độ tối');
    toggle.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `;
    
    document.querySelector('.brand').appendChild(toggle);
    this.elements.darkModeToggle = toggle;
  }

  // Tạo thanh chỉ báo độ mạnh mật khẩu
  createPasswordStrengthIndicator() {
    const passwordContainer = this.elements.password.closest('.input');
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.innerHTML = `
      <div class="strength-bar">
        <div class="strength-fill"></div>
      </div>
      <span class="strength-text"></span>
    `;
    passwordContainer.appendChild(strengthIndicator);
  }

  // Hàm debounce để giảm số lần gọi function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Gắn các sự kiện
  bindEvents() {
    // Chuyển đổi hiện/ẩn mật khẩu
    this.elements.togglePw.addEventListener('click', () => this.togglePassword());
    
    // Xử lý submit form với cơ chế thử lại
    this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Chuyển đổi chế độ tối
    this.elements.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
    
    // Thay đổi ngôn ngữ
    this.elements.languageSelect.addEventListener('change', (e) => this.changeLanguage(e));
    
    // Tự động lưu tùy chọn "Ghi nhớ tôi"
    this.elements.remember?.addEventListener('change', () => this.saveRememberPreference());
    
    // Validation real-time với debounce
    const debouncedEmailValidation = this.debounce(() => this.validateEmail(true), 500);
    const debouncedPasswordValidation = this.debounce(() => {
      this.validatePassword(true);
      this.updatePasswordStrength();
    }, 300);
    
    this.elements.email.addEventListener('input', debouncedEmailValidation);
    this.elements.password.addEventListener('input', debouncedPasswordValidation);
    
    // Tải các tùy chọn đã lưu
    this.loadSavedPreferences();
    
    // Tự động lưu form
    this.elements.email.addEventListener('input', this.debounce(() => this.autoSaveForm(), 1000));
  }

  // Chuyển đổi hiện/ẩn mật khẩu
  togglePassword() {
    const password = this.elements.password;
    const eyeIcon = this.elements.eyeIcon;
    const isVisible = password.type === 'password';
    
    password.type = isVisible ? 'text' : 'password';
    
    // Hiệu ứng chuyển đổi icon mượt mà
    eyeIcon.style.transform = 'scale(0.8)';
    setTimeout(() => {
      eyeIcon.innerHTML = isVisible 
        ? '<path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a20.66 0 014.33-5.94M9.9 4.24A10.94 0 0112 4c7 0 11 8 11 8a20.49 0 01-3.64 5.37"/><path d="M1 1l22 22"/>'
        : '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>';
      eyeIcon.style.transform = 'scale(1)';
    }, 100);
  }

  // Kiểm tra tính hợp lệ của email
  validateEmail(showError = false) {
    const email = this.elements.email;
    const emailValue = email.value.trim();
    
    // Kiểm tra email có kết thúc bằng @gmail.com không
    const hasGmailDomain = emailValue.endsWith('@gmail.com');
    
    // Kiểm tra email có chứa dấu tiếng Việt không
    const vietnameseDiacritics = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    const hasVietnameseDiacritics = vietnameseDiacritics.test(emailValue);
    
    // Kiểm tra định dạng email cơ bản
    const basicEmailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    const isBasicFormatValid = basicEmailRegex.test(emailValue);
    
    const isValid = hasGmailDomain && !hasVietnameseDiacritics && isBasicFormatValid && emailValue.length > 10;
    
    if (showError && !isValid) {
      let errorMessage = this.translations[this.currentLanguage].emailError;
      
      if (!hasGmailDomain) {
        errorMessage = this.translations[this.currentLanguage].emailMustBeGmail;
      } else if (hasVietnameseDiacritics) {
        errorMessage = this.translations[this.currentLanguage].emailNoDiacritics;
      }
      
      this.updateInputValidation(email, false, errorMessage);
    } else if (showError && isValid) {
      this.updateInputValidation(email, true, '');
    }
    
    return isValid;
  }

  // Kiểm tra tính hợp lệ của mật khẩu (nâng cao)
  validatePassword(showError = false) {
    const password = this.elements.password;
    const value = password.value;
    
    // Yêu cầu mật khẩu nâng cao
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumbers;
    
    if (showError && value.length > 0) {
      let errorMessage = '';
      if (!isValid) errorMessage = this.translations[this.currentLanguage].passwordError;
      
      this.updateInputValidation(password, isValid, errorMessage);
    }
    
    return isValid;
  }

  // Tính toán độ mạnh mật khẩu
  calculatePasswordStrength(password) {
    let strength = 0;
    const checks = [
      password.length >= 8,     // Độ dài tối thiểu
      /[a-z]/.test(password),   // Chữ thường
      /[A-Z]/.test(password),   // Chữ hoa
      /[0-9]/.test(password),   // Số
      /[^A-Za-z0-9]/.test(password), // Ký tự đặc biệt
      password.length >= 12     // Độ dài tốt
    ];
    
    strength = checks.filter(Boolean).length;
    return Math.min(strength, 5);
  }

  // Cập nhật hiển thị độ mạnh mật khẩu
  updatePasswordStrength() {
    const password = this.elements.password.value;
    const strength = this.calculatePasswordStrength(password);
    const strengthIndicator = this.getElement('.password-strength');
    
    if (!strengthIndicator || password.length === 0) return;
    
    const fill = strengthIndicator.querySelector('.strength-fill');
    const text = strengthIndicator.querySelector('.strength-text');
    
    const strengthLevels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'VeryStrong'];
    const strengthColors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#16a34a'];
    
    fill.style.width = `${(strength / 5) * 100}%`;
    fill.style.backgroundColor = strengthColors[strength - 1] || '#ef4444';
    
    const strengthKey = `password${strengthLevels[strength] || 'Weak'}`;
    text.textContent = this.translations[this.currentLanguage][strengthKey] || '';
    
    this.passwordStrength = strength;
  }

  // Cập nhật trạng thái validation của input
  updateInputValidation(input, isValid, message) {
    const container = input.closest('.input');
    
    // Xóa các trạng thái validation hiện tại
    container.classList.remove('valid', 'invalid');
    
    // Xóa thông báo lỗi hiện tại
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

  // Xóa tất cả trạng thái validation
  clearValidationStates() {
    const inputs = [this.elements.email, this.elements.password];
    inputs.forEach(input => {
      const container = input.closest('.input');
      container.classList.remove('valid', 'invalid');
      const existingError = container.querySelector('.error-message');
      if (existingError) existingError.remove();
    });
  }

  // Xử lý submit form với cơ chế thử lại
  async handleSubmit(e) {
    e.preventDefault();
    
    // Kiểm tra tài khoản có bị khóa không
    if (this.isAccountLocked()) {
      this.showNotification(this.translations[this.currentLanguage].accountLocked, 'error');
      return;
    }
    
    // Xóa các trạng thái validation trước đó
    this.clearValidationStates();
    
    // Kiểm tra tính hợp lệ và hiển thị lỗi nếu không hợp lệ
    const emailValid = this.validateEmail(true);
    const passwordValid = this.validatePassword(true);
    
    if (!emailValid || !passwordValid) {
      this.showNotification(this.translations[this.currentLanguage].validationError, 'error');
      return;
    }
    
    // Hiển thị trạng thái loading
    this.setLoadingState(true);
    
    try {
      // Mô phỏng API call với cơ chế thử lại
      await this.simulateLoginWithRetry();
      
      // Thành công - reset số lần thử
      this.loginAttempts = 0;
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutTime');
      
      this.showNotification(this.translations[this.currentLanguage].loginSuccess, 'success');
      
      // Lưu tùy chọn nếu "Ghi nhớ tôi" được chọn
      if (this.elements.remember?.checked) {
        this.saveUserPreferences();
      }
      
      // Xóa form tự động lưu
      localStorage.removeItem('autoSavedForm');
      
      // Chuyển hướng sau khi delay
      setTimeout(() => {
        this.showNotification(this.translations[this.currentLanguage].demoRedirect, 'info');
        this.setLoadingState(false);
        // Trong production: window.location.href = '/dashboard';
      }, 2000);
      
    } catch (error) {
      this.handleLoginFailure(error);
    }
  }

  // Mô phỏng đăng nhập với cơ chế thử lại
  async simulateLoginWithRetry(maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.simulateLogin();
        return; // Thành công
      } catch (error) {
        if (attempt === maxRetries) {
          throw error; // Lần thử cuối cùng thất bại
        }
        
        // Hiển thị thông báo thử lại
        this.showNotification(
          `${this.translations[this.currentLanguage].connectionError} (${attempt}/${maxRetries})`, 
          'warning'
        );
        
        // Chờ trước khi thử lại với exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  // Mô phỏng API đăng nhập
  async simulateLogin() {
    // Mô phỏng độ trễ mạng
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mô phỏng lỗi ngẫu nhiên (10% khả năng)
    if (Math.random() < 0.1) {
      throw new Error('Lỗi mạng');
    }
  }

  // Xử lý khi đăng nhập thất bại
  handleLoginFailure(error) {
    this.loginAttempts++;
    localStorage.setItem('loginAttempts', this.loginAttempts.toString());
    
    if (this.loginAttempts >= this.maxAttempts) {
      // Khóa tài khoản
      const lockoutEndTime = Date.now() + this.lockoutTime;
      localStorage.setItem('lockoutTime', lockoutEndTime.toString());
      this.showNotification(this.translations[this.currentLanguage].accountLocked, 'error');
    } else {
      const remainingAttempts = this.maxAttempts - this.loginAttempts;
      this.showNotification(
        `${this.translations[this.currentLanguage].loginFailed} (Còn ${remainingAttempts} lần thử)`, 
        'error'
      );
    }
    
    this.setLoadingState(false);
    this.logError('Đăng nhập thất bại', { error: error.message, attempts: this.loginAttempts });
  }

  // Kiểm tra tài khoản có bị khóa không
  isAccountLocked() {
    const lockoutTime = localStorage.getItem('lockoutTime');
    if (!lockoutTime) return false;
    
    const lockoutEndTime = parseInt(lockoutTime);
    if (Date.now() < lockoutEndTime) {
      return true;
    }
    
    // Hết thời gian khóa, reset
    localStorage.removeItem('lockoutTime');
    localStorage.removeItem('loginAttempts');
    this.loginAttempts = 0;
    return false;
  }

  // Kiểm tra trạng thái khóa tài khoản khi khởi tạo
  checkAccountLockout() {
    const attempts = localStorage.getItem('loginAttempts');
    this.loginAttempts = attempts ? parseInt(attempts) : 0;
  }

  // Thiết lập tự động lưu form
  setupAutoSave() {
    const savedForm = localStorage.getItem('autoSavedForm');
    if (savedForm) {
      try {
        const formData = JSON.parse(savedForm);
        if (formData.email) {
          this.elements.email.value = formData.email;
          this.showNotification(this.translations[this.currentLanguage].formAutoSaved, 'info');
        }
      } catch (e) {
        console.warn('Không thể tải form đã lưu:', e);
      }
    }
  }

  // Tự động lưu form
  autoSaveForm() {
    const formData = {
      email: this.elements.email.value,
      timestamp: Date.now()
    };
    localStorage.setItem('autoSavedForm', JSON.stringify(formData));
  }

  // Thiết lập trạng thái loading
  setLoadingState(isLoading) {
    const btn = this.elements.submitBtn;
    
    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> ${this.translations[this.currentLanguage].signIn}...`;
    } else {
      btn.disabled = false;
      btn.innerHTML = this.translations[this.currentLanguage].signIn;
    }
  }

  // Hiển thị thông báo
  showNotification(message, type = 'info') {
    // Xóa thông báo hiện tại
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Đóng thông báo">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Tự động xóa sau 5 giây
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Chức năng nút đóng
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    });
  }

  // Chuyển đổi chế độ tối
  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Lưu tùy chọn
    localStorage.setItem('darkMode', isDark);
    
    // Cập nhật icon toggle
    const toggle = this.elements.darkModeToggle;
    toggle.innerHTML = isDark 
      ? '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    
    // Hiệu ứng xoay toggle
    toggle.style.transform = 'rotate(180deg)';
    setTimeout(() => toggle.style.transform = 'rotate(0deg)', 300);
  }

  // Thay đổi ngôn ngữ
  changeLanguage(e) {
    const language = e.target.value;
    this.currentLanguage = language;
    this.updatePageTexts();
    this.saveLanguagePreference();
    this.showNotification(this.translations[language].languageChanged, 'info');
  }

  // Cập nhật text trên trang theo ngôn ngữ
  updatePageTexts() {
    const texts = this.translations[this.currentLanguage];
    
    // Cập nhật element có thuộc tính data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      if (texts[key]) {
        element.textContent = texts[key];
      }
    });
    
    // Cập nhật placeholder
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      if (texts[key]) {
        element.placeholder = texts[key];
      }
    });
    
    // Cập nhật aria-label
    document.querySelectorAll('[data-translate-aria]').forEach(element => {
      const key = element.getAttribute('data-translate-aria');
      if (texts[key]) {
        element.setAttribute('aria-label', texts[key]);
      }
    });
    
    // Cập nhật aria-label của nút chế độ tối
    if (this.elements.darkModeToggle) {
      this.elements.darkModeToggle.setAttribute('aria-label', texts.toggleDarkMode);
    }
  }

  // Lưu tùy chọn ngôn ngữ
  saveLanguagePreference() {
    localStorage.setItem('selectedLanguage', this.currentLanguage);
  }

  // Lưu tùy chọn "Ghi nhớ tôi"
  saveRememberPreference() {
    if (this.elements.remember) {
      localStorage.setItem('rememberMe', this.elements.remember.checked);
    }
  }

  // Lưu tùy chọn người dùng
  saveUserPreferences() {
    const preferences = {
      email: this.elements.email.value,
      rememberMe: this.elements.remember?.checked || false,
      language: this.elements.languageSelect.value
    };
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }

  // Tải các tùy chọn đã lưu
  loadSavedPreferences() {
    // Tải tùy chọn ngôn ngữ
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'vi-vn';
    this.currentLanguage = savedLanguage;
    this.elements.languageSelect.value = savedLanguage;
    this.updatePageTexts();
    
    // Tải tùy chọn chế độ tối
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      document.body.classList.add('dark-mode');
      this.elements.darkModeToggle.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    }
    
    // Tải tùy chọn "Ghi nhớ tôi"
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if (this.elements.remember) {
      this.elements.remember.checked = rememberMe;
    }
    
    // Tải tùy chọn người dùng nếu có
    const userPrefs = localStorage.getItem('userPreferences');
    if (userPrefs && rememberMe) {
      try {
        const prefs = JSON.parse(userPrefs);
        this.elements.email.value = prefs.email || '';
        this.elements.languageSelect.value = prefs.language || savedLanguage;
      } catch (e) {
        console.warn('Không thể tải tùy chọn người dùng:', e);
      }
    }
  }

  // Kiểm tra tùy chọn hệ thống
  checkSystemPreferences() {
    // Kiểm tra nếu người dùng thích chế độ tối
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      if (localStorage.getItem('darkMode') === null) {
        document.body.classList.add('dark-mode');
        this.elements.darkModeToggle.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      }
    }
  }

  // Thiết lập animation
  setupAnimations() {
    // Thêm animation vào trang
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

  // Ghi log lỗi (để debug)
  logError(message, details = {}) {
    console.error(`[LoginSystem] ${message}:`, details);
    // Trong production có thể gửi lên server để phân tích
  }
}

// Khởi tạo khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', () => {
  new LoginSystem();
});

// Thêm phím tắt
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K để focus vào email
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('email').focus();
  }
  
  // Ctrl/Cmd + L để focus vào mật khẩu
  if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
    e.preventDefault();
    document.getElementById('password').focus();
  }
  
  // Enter để submit form (khi focus vào input)
  if (e.key === 'Enter' && (e.target.type === 'email' || e.target.type === 'password')) {
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
  }
});