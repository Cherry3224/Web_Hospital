// R.F Hospital Dashboard System
class HospitalDashboard {
  constructor() {
    this.currentPage = 'dashboard';
    this.currentLanguage = 'vi-vn';
    this.isDarkTheme = false;
    this.sidebarCollapsed = false;
    
    this.translations = {
      'vi-vn': {
        dashboard: 'Trang chủ',
        schedule: 'Lịch Làm Việc',
        patients: 'Bệnh Nhân',
        medicalRecords: 'Bệnh Án',
        medicines: 'Thuốc',
        diagnostics: 'Chuẩn đoán / Xét nghiệm',
        articles: 'Bài Viết',
        statistics: 'Thống Kê',
        accounts: 'Tài Khoản',
        loading: 'Đang tải...',
        notifications: 'Thông báo'
      },
      'en-us': {
        dashboard: 'Dashboard',
        schedule: 'Schedule',
        patients: 'Patients',
        medicalRecords: 'Medical Records',
        medicines: 'Medicines',
        diagnostics: 'Diagnostics / Lab Tests',
        articles: 'Articles',
        statistics: 'Statistics',
        accounts: 'Accounts',
        loading: 'Loading...',
        notifications: 'Notifications'
      },
      'zh-cn': {
        dashboard: '仪表板',
        schedule: '工作日程',
        patients: '病人',
        medicalRecords: '病历',
        medicines: '药物',
        diagnostics: '诊断 / 检验',
        articles: '文章',
        statistics: '统计',
        accounts: '账户',
        loading: '加载中...',
        notifications: '通知'
      }
    };
    
    this.pageContent = {
      schedule: this.createSchedulePage(),
      patients: this.createPatientsPage(),
      'medical-records': this.createMedicalRecordsPage(),
      medicines: this.createMedicinesPage(),
      diagnostics: this.createDiagnosticsPage(),
      articles: this.createArticlesPage(),
      statistics: this.createStatisticsPage(),
      accounts: this.createAccountsPage()
    };
    
    this.initializeApp();
  }

  initializeApp() {
    this.bindEvents();
    this.initializeChart();
    this.loadUserPreferences();
    this.showPage('dashboard');
  }

  bindEvents() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    sidebarToggle?.addEventListener('click', () => this.toggleSidebar());
    mobileMenuBtn?.addEventListener('click', () => this.toggleMobileSidebar());
    
    // Article interactions
    this.bindArticleEvents();
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        this.navigateToPage(page);
      });
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle?.addEventListener('click', () => this.toggleTheme());
    
    // Language selector
    const languageSelect = document.getElementById('languageSelect');
    languageSelect?.addEventListener('change', (e) => {
      this.changeLanguage(e.target.value);
    });
    
    // Notification panel
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotifications = document.querySelector('.close-notifications');
    
    notificationBtn?.addEventListener('click', () => {
      notificationPanel?.classList.toggle('active');
    });
    
    closeNotifications?.addEventListener('click', () => {
      notificationPanel?.classList.remove('active');
    });
    
    // Global search
    const globalSearch = document.getElementById('globalSearch');
    globalSearch?.addEventListener('input', (e) => {
      this.performGlobalSearch(e.target.value);
    });
    
    // Close mobile sidebar when clicking outside
    document.addEventListener('click', (e) => {
      const sidebar = document.getElementById('sidebar');
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      
      if (window.innerWidth <= 768) {
        if (!sidebar?.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
          sidebar?.classList.remove('mobile-open');
        }
      }
    });
    
    // Window resize handler
    window.addEventListener('resize', () => {
      this.handleWindowResize();
    });
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('collapsed');
    this.sidebarCollapsed = sidebar?.classList.contains('collapsed') || false;
    localStorage.setItem('sidebarCollapsed', this.sidebarCollapsed);
  }

  toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('mobile-open');
  }

  navigateToPage(page) {
    if (page === this.currentPage) return;
    
    this.showLoading();
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    activeLink?.classList.add('active');
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
      pageTitle.textContent = this.getPageTitle(page);
    }
    
    // Show page content
    setTimeout(() => {
      this.showPage(page);
      this.hideLoading();
    }, 300);
    
    this.currentPage = page;
    
    // Close mobile sidebar
    if (window.innerWidth <= 768) {
      const sidebar = document.getElementById('sidebar');
      sidebar?.classList.remove('mobile-open');
    }
  }

  showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
      targetPage.classList.add('active');
      
      // Load page content if not dashboard
      if (page !== 'dashboard' && this.pageContent[page]) {
        targetPage.innerHTML = this.pageContent[page];
        
        // Initialize page-specific functionality
        this.initializePageFunctionality(page);
      }
    }
  }

  getPageTitle(page) {
    const translations = this.translations[this.currentLanguage];
    return translations[page] || page;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
      themeIcon.className = this.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    localStorage.setItem('darkTheme', this.isDarkTheme);
  }

  changeLanguage(language) {
    this.currentLanguage = language;
    this.updateLanguageTexts();
    localStorage.setItem('selectedLanguage', language);
  }

  updateLanguageTexts() {
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
      pageTitle.textContent = this.getPageTitle(this.currentPage);
    }
    
    // Update navigation texts if needed
    // This would be expanded for full multilingual support
  }

  performGlobalSearch(query) {
    if (query.length < 2) return;
    
    // Simulate search functionality
    console.log('Searching for:', query);
    
    // In a real application, this would make API calls to search
    // across patients, medical records, medicines, etc.
  }

  showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay?.classList.add('active');
  }

  hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay?.classList.remove('active');
  }

  handleWindowResize() {
    const sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth > 768) {
      sidebar?.classList.remove('mobile-open');
    }
  }

  loadUserPreferences() {
    // Load sidebar state
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState === 'true') {
      const sidebar = document.getElementById('sidebar');
      sidebar?.classList.add('collapsed');
      this.sidebarCollapsed = true;
    }
    
    // Load theme
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
      this.isDarkTheme = true;
      document.body.classList.add('dark-theme');
      const themeIcon = document.querySelector('#themeToggle i');
      if (themeIcon) {
        themeIcon.className = 'fas fa-sun';
      }
    }
    
    // Load language
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
      const languageSelect = document.getElementById('languageSelect');
      if (languageSelect) {
        languageSelect.value = savedLanguage;
      }
    }
  }

  initializeChart() {
    const ctx = document.getElementById('quickStatsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Bệnh nhân mới', 'Tái khám', 'Khẩn cấp', 'Đã xuất viện'],
        datasets: [{
          data: [12, 19, 3, 5],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444'
          ],
          borderWidth: 0
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
  }

  // Page content generators
  createSchedulePage() {
    return `
      <div class="schedule-container">
        <div class="schedule-header">
          <h2>Lịch Làm Việc</h2>
          <div class="schedule-actions">
            <button class="btn-primary">
              <i class="fas fa-plus"></i> Thêm lịch hẹn
            </button>
            <button class="btn-secondary">
              <i class="fas fa-download"></i> Xuất lịch
            </button>
          </div>
        </div>
        
        <div class="calendar-grid">
          <div class="calendar-header">
            <button class="nav-btn" id="prevWeek">
              <i class="fas fa-chevron-left"></i>
            </button>
            <h3>Tuần 15/01 - 21/01/2024</h3>
            <button class="nav-btn" id="nextWeek">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <div class="schedule-grid">
            <div class="time-column">
              <div class="time-slot">08:00</div>
              <div class="time-slot">09:00</div>
              <div class="time-slot">10:00</div>
              <div class="time-slot">11:00</div>
              <div class="time-slot">14:00</div>
              <div class="time-slot">15:00</div>
              <div class="time-slot">16:00</div>
              <div class="time-slot">17:00</div>
            </div>
            
            <div class="day-column">
              <div class="day-header">Thứ 2</div>
              <div class="appointment-slot">
                <div class="appointment">
                  <h4>Khám tim mạch</h4>
                  <p>Nguyễn Văn A</p>
                </div>
              </div>
              <div class="appointment-slot"></div>
              <div class="appointment-slot">
                <div class="appointment urgent">
                  <h4>Cấp cứu</h4>
                  <p>Trần Thị B</p>
                </div>
              </div>
              <div class="appointment-slot"></div>
              <div class="appointment-slot"></div>
              <div class="appointment-slot"></div>
              <div class="appointment-slot"></div>
              <div class="appointment-slot"></div>
            </div>
            
            <!-- More day columns would be generated here -->
          </div>
        </div>
      </div>
    `;
  }

  createPatientsPage() {
    return `
      <div class="patients-container">
        <div class="patients-header">
          <h2>Quản Lý Bệnh Nhân</h2>
          <div class="patients-actions">
            <button class="btn-primary">
              <i class="fas fa-user-plus"></i> Thêm bệnh nhân
            </button>
            <button class="btn-secondary">
              <i class="fas fa-file-import"></i> Nhập danh sách
            </button>
          </div>
        </div>
        
        <div class="patients-filters">
          <div class="filter-group">
            <input type="text" placeholder="Tìm kiếm bệnh nhân..." class="search-input">
            <select class="filter-select">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang điều trị</option>
              <option value="discharged">Đã xuất viện</option>
              <option value="emergency">Cấp cứu</option>
            </select>
            <select class="filter-select">
              <option value="">Tất cả khoa</option>
              <option value="cardiology">Tim mạch</option>
              <option value="neurology">Thần kinh</option>
              <option value="orthopedics">Chấn thương chỉnh hình</option>
            </select>
          </div>
        </div>
        
        <div class="patients-table">
          <table>
            <thead>
              <tr>
                <th>Mã BN</th>
                <th>Họ tên</th>
                <th>Tuổi</th>
                <th>Giới tính</th>
                <th>Khoa</th>
                <th>Trạng thái</th>
                <th>Ngày nhập viện</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BN001</td>
                <td>Nguyễn Văn A</td>
                <td>45</td>
                <td>Nam</td>
                <td>Tim mạch</td>
                <td><span class="status active">Đang điều trị</span></td>
                <td>15/01/2024</td>
                <td>
                  <button class="action-btn view"><i class="fas fa-eye"></i></button>
                  <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                  <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
              <tr>
                <td>BN002</td>
                <td>Trần Thị B</td>
                <td>32</td>
                <td>Nữ</td>
                <td>Sản khoa</td>
                <td><span class="status emergency">Cấp cứu</span></td>
                <td>16/01/2024</td>
                <td>
                  <button class="action-btn view"><i class="fas fa-eye"></i></button>
                  <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                  <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination">
          <button class="page-btn">‹</button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn">›</button>
        </div>
      </div>
    `;
  }

  createMedicalRecordsPage() {
    return `
      <div class="medical-records-container">
        <div class="records-header">
          <h2>Quản Lý Bệnh Án</h2>
          <div class="records-actions">
            <button class="btn-primary">
              <i class="fas fa-file-medical"></i> Tạo bệnh án
            </button>
            <button class="btn-secondary">
              <i class="fas fa-download"></i> Xuất báo cáo
            </button>
          </div>
        </div>
        
        <div class="records-grid">
          <div class="record-card">
            <div class="record-header">
              <h3>Nguyễn Văn A - BN001</h3>
              <span class="record-status active">Đang điều trị</span>
            </div>
            <div class="record-details">
              <p><strong>Chẩn đoán:</strong> Suy tim độ II</p>
              <p><strong>Bác sĩ điều trị:</strong> BS. Trần Văn B</p>
              <p><strong>Ngày tạo:</strong> 15/01/2024</p>
              <p><strong>Lần cập nhật cuối:</strong> 16/01/2024</p>
            </div>
            <div class="record-actions">
              <button class="btn-sm view">Xem chi tiết</button>
              <button class="btn-sm edit">Chỉnh sửa</button>
            </div>
          </div>
          
          <div class="record-card">
            <div class="record-header">
              <h3>Trần Thị C - BN002</h3>
              <span class="record-status completed">Hoàn thành</span>
            </div>
            <div class="record-details">
              <p><strong>Chẩn đoán:</strong> Viêm phổi</p>
              <p><strong>Bác sĩ điều trị:</strong> BS. Lê Thị D</p>
              <p><strong>Ngày tạo:</strong> 10/01/2024</p>
              <p><strong>Ngày xuất viện:</strong> 14/01/2024</p>
            </div>
            <div class="record-actions">
              <button class="btn-sm view">Xem chi tiết</button>
              <button class="btn-sm print">In bệnh án</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createMedicinesPage() {
    return `
      <div class="medicines-container">
        <div class="medicines-header">
          <h2>Quản Lý Thuốc</h2>
          <div class="medicines-actions">
            <button class="btn-primary">
              <i class="fas fa-plus"></i> Thêm thuốc
            </button>
            <button class="btn-secondary">
              <i class="fas fa-warehouse"></i> Kiểm kê kho
            </button>
          </div>
        </div>
        
        <div class="medicine-stats">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-pills"></i>
            </div>
            <div class="stat-info">
              <h3>1,247</h3>
              <p>Tổng số thuốc</p>
            </div>
          </div>
          <div class="stat-card warning">
            <div class="stat-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="stat-info">
              <h3>23</h3>
              <p>Thuốc sắp hết</p>
            </div>
          </div>
          <div class="stat-card danger">
            <div class="stat-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
              <h3>5</h3>
              <p>Thuốc hết hạn</p>
            </div>
          </div>
        </div>
        
        <div class="medicines-table">
          <table>
            <thead>
              <tr>
                <th>Mã thuốc</th>
                <th>Tên thuốc</th>
                <th>Loại</th>
                <th>Số lượng</th>
                <th>Đơn vị</th>
                <th>Giá</th>
                <th>Hạn sử dụng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>T001</td>
                <td>Paracetamol</td>
                <td>Giảm đau</td>
                <td>500</td>
                <td>Viên</td>
                <td>2,000đ</td>
                <td>12/2025</td>
                <td><span class="status active">Còn hàng</span></td>
                <td>
                  <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                  <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
              <tr>
                <td>T002</td>
                <td>Amoxicillin</td>
                <td>Kháng sinh</td>
                <td>15</td>
                <td>Hộp</td>
                <td>45,000đ</td>
                <td>06/2024</td>
                <td><span class="status warning">Sắp hết</span></td>
                <td>
                  <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                  <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  createDiagnosticsPage() {
    return `
      <div class="diagnostics-container">
        <div class="diagnostics-header">
          <h2>Chuẩn Đoán Hình Ảnh & Xét Nghiệm</h2>
          <div class="diagnostics-actions">
            <button class="btn-primary">
              <i class="fas fa-plus"></i> Tạo yêu cầu
            </button>
            <button class="btn-secondary">
              <i class="fas fa-calendar"></i> Lịch hẹn
            </button>
          </div>
        </div>
        
        <div class="diagnostics-tabs">
          <button class="tab-btn active" data-tab="imaging">Chẩn đoán hình ảnh</button>
          <button class="tab-btn" data-tab="lab">Xét nghiệm</button>
          <button class="tab-btn" data-tab="results">Kết quả</button>
        </div>
        
        <div class="tab-content active" id="imaging-tab">
          <div class="imaging-grid">
            <div class="imaging-card">
              <div class="imaging-icon">
                <i class="fas fa-x-ray"></i>
              </div>
              <h3>X-Quang</h3>
              <p>15 yêu cầu hôm nay</p>
              <button class="btn-sm">Xem chi tiết</button>
            </div>
            
            <div class="imaging-card">
              <div class="imaging-icon">
                <i class="fas fa-brain"></i>
              </div>
              <h3>CT Scan</h3>
              <p>8 yêu cầu hôm nay</p>
              <button class="btn-sm">Xem chi tiết</button>
            </div>
            
            <div class="imaging-card">
              <div class="imaging-icon">
                <i class="fas fa-heartbeat"></i>
              </div>
              <h3>Siêu âm</h3>
              <p>23 yêu cầu hôm nay</p>
              <button class="btn-sm">Xem chi tiết</button>
            </div>
            
            <div class="imaging-card">
              <div class="imaging-icon">
                <i class="fas fa-magnet"></i>
              </div>
              <h3>MRI</h3>
              <p>5 yêu cầu hôm nay</p>
              <button class="btn-sm">Xem chi tiết</button>
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="lab-tab">
          <div class="lab-tests-table">
            <table>
              <thead>
                <tr>
                  <th>Mã XN</th>
                  <th>Bệnh nhân</th>
                  <th>Loại xét nghiệm</th>
                  <th>Bác sĩ yêu cầu</th>
                  <th>Ngày yêu cầu</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>XN001</td>
                  <td>Nguyễn Văn A</td>
                  <td>Xét nghiệm máu</td>
                  <td>BS. Trần B</td>
                  <td>16/01/2024</td>
                  <td><span class="status pending">Chờ kết quả</span></td>
                  <td>
                    <button class="action-btn view"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  createArticlesPage() {
    return `
      <div class="articles-container">
        <div class="articles-header">
          <h2>Quản Lý Bài Viết</h2>
          <div class="articles-actions">
            <button class="btn-primary">
              <i class="fas fa-plus"></i> Viết bài mới
            </button>
            <button class="btn-secondary">
              <i class="fas fa-upload"></i> Nhập bài viết
            </button>
          </div>
        </div>
        
        <div class="articles-grid">
          <div class="article-card">
            <div class="article-image">
              <i class="fas fa-newspaper"></i>
            </div>
            <div class="article-content">
              <h3>Hướng dẫn chăm sóc bệnh nhân tim mạch</h3>
              <p>Bài viết hướng dẫn chi tiết về cách chăm sóc bệnh nhân mắc các bệnh lý tim mạch...</p>
              <div class="article-meta">
                <span class="author">BS. Nguyễn Văn A</span>
                <span class="date">15/01/2024</span>
              </div>
            </div>
            <div class="article-actions">
              <button class="btn-sm view">Xem</button>
              <button class="btn-sm edit">Sửa</button>
              <button class="btn-sm delete">Xóa</button>
            </div>
          </div>
          
          <div class="article-card">
            <div class="article-image">
              <i class="fas fa-stethoscope"></i>
            </div>
            <div class="article-content">
              <h3>Quy trình khám bệnh hiện đại</h3>
              <p>Cập nhật quy trình khám bệnh mới nhất theo tiêu chuẩn quốc tế...</p>
              <div class="article-meta">
                <span class="author">BS. Trần Thị B</span>
                <span class="date">14/01/2024</span>
              </div>
            </div>
            <div class="article-actions">
              <button class="btn-sm view">Xem</button>
              <button class="btn-sm edit">Sửa</button>
              <button class="btn-sm delete">Xóa</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createStatisticsPage() {
    return `
      <div class="statistics-container">
        <div class="statistics-header">
          <h2>Thống Kê & Báo Cáo</h2>
          <div class="statistics-actions">
            <select class="date-filter">
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm này</option>
            </select>
            <button class="btn-primary">
              <i class="fas fa-download"></i> Xuất báo cáo
            </button>
          </div>
        </div>
        
        <div class="statistics-overview">
          <div class="stat-card">
            <h3>Tổng doanh thu</h3>
            <div class="stat-value">2,450,000đ</div>
            <div class="stat-change positive">+12%</div>
          </div>
          <div class="stat-card">
            <h3>Số lượt khám</h3>
            <div class="stat-value">156</div>
            <div class="stat-change positive">+8%</div>
          </div>
          <div class="stat-card">
            <h3>Bệnh nhân mới</h3>
            <div class="stat-value">23</div>
            <div class="stat-change negative">-5%</div>
          </div>
          <div class="stat-card">
            <h3>Tỷ lệ hài lòng</h3>
            <div class="stat-value">94%</div>
            <div class="stat-change positive">+2%</div>
          </div>
        </div>
        
        <div class="charts-grid">
          <div class="chart-card">
            <h3>Thống kê bệnh nhân theo tháng</h3>
            <canvas id="patientsChart"></canvas>
          </div>
          <div class="chart-card">
            <h3>Doanh thu theo khoa</h3>
            <canvas id="revenueChart"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  createAccountsPage() {
    return `
      <div class="accounts-container">
        <div class="accounts-header">
          <h2>Quản Lý Tài Khoản</h2>
          <div class="accounts-actions">
            <button class="btn-primary">
              <i class="fas fa-user-plus"></i> Thêm tài khoản
            </button>
            <button class="btn-secondary">
              <i class="fas fa-cog"></i> Cài đặt hệ thống
            </button>
          </div>
        </div>
        
        <div class="accounts-grid">
          <div class="account-card">
            <div class="account-avatar">
              <i class="fas fa-user-md"></i>
            </div>
            <div class="account-info">
              <h3>BS. Nguyễn Văn A</h3>
              <p>Bác sĩ trưởng - Tim mạch</p>
              <span class="account-status active">Hoạt động</span>
            </div>
            <div class="account-actions">
              <button class="btn-sm edit">Chỉnh sửa</button>
              <button class="btn-sm disable">Vô hiệu hóa</button>
            </div>
          </div>
          
          <div class="account-card">
            <div class="account-avatar">
              <i class="fas fa-user-nurse"></i>
            </div>
            <div class="account-info">
              <h3>Y tá Trần Thị B</h3>
              <p>Điều dưỡng trưởng</p>
              <span class="account-status active">Hoạt động</span>
            </div>
            <div class="account-actions">
              <button class="btn-sm edit">Chỉnh sửa</button>
              <button class="btn-sm disable">Vô hiệu hóa</button>
            </div>
          </div>
          
          <div class="account-card">
            <div class="account-avatar">
              <i class="fas fa-user-cog"></i>
            </div>
            <div class="account-info">
              <h3>Admin Lê Văn C</h3>
              <p>Quản trị viên</p>
              <span class="account-status active">Hoạt động</span>
            </div>
            <div class="account-actions">
              <button class="btn-sm edit">Chỉnh sửa</button>
              <button class="btn-sm disable">Vô hiệu hóa</button>
            </div>
          </div>
        </div>
        
        <div class="account-settings">
          <h3>Cài đặt hệ thống</h3>
          <div class="settings-form">
            <div class="form-group">
              <label>Tên bệnh viện</label>
              <input type="text" value="R.F Hospital" class="form-input">
            </div>
            <div class="form-group">
              <label>Địa chỉ</label>
              <input type="text" value="123 Đường ABC, Quận 1, TP.HCM" class="form-input">
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input type="text" value="028 1234 5678" class="form-input">
            </div>
            <button class="btn-primary">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    `;
  }

  initializePageFunctionality(page) {
    switch (page) {
      case 'statistics':
        this.initializeStatisticsCharts();
        break;
      case 'diagnostics':
        this.initializeDiagnosticsTabs();
        break;
      case 'dashboard':
        this.bindArticleEvents();
        break;
      // Add more page-specific initializations as needed
    }
  }

  bindArticleEvents() {
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.toggleLike(e.target.closest('.like-btn'));
      });
    });

    // Comment buttons
    document.querySelectorAll('.comment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.focusCommentInput(e.target.closest('.article-post'));
      });
    });

    // Post comment buttons
    document.querySelectorAll('.post-comment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.postComment(e.target.closest('.add-comment'));
      });
    });

    // Comment input auto-resize
    document.querySelectorAll('.comment-input').forEach(textarea => {
      textarea.addEventListener('input', (e) => {
        this.autoResizeTextarea(e.target);
      });
      
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          this.postComment(e.target.closest('.add-comment'));
        }
      });
    });

    // New article button
    const newArticleBtn = document.getElementById('newArticleBtn');
    newArticleBtn?.addEventListener('click', () => {
      this.showNewArticleModal();
    });
  }

  toggleLike(btn) {
    const isLiked = btn.classList.contains('liked');
    const icon = btn.querySelector('i');
    const text = btn.querySelector('span') || btn.childNodes[2];
    
    if (isLiked) {
      btn.classList.remove('liked');
      icon.className = 'far fa-heart';
      if (text) text.textContent = ' Thích';
    } else {
      btn.classList.add('liked');
      icon.className = 'fas fa-heart';
      if (text) text.textContent = ' Đã thích';
      
      // Update like count in stats
      const postStats = btn.closest('.article-post').querySelector('.post-stats .stat-item i.fa-heart').parentNode;
      const currentCount = parseInt(postStats.textContent.match(/\d+/)[0]);
      postStats.innerHTML = `<i class="fas fa-heart"></i> ${isLiked ? currentCount - 1 : currentCount + 1} lượt thích`;
    }
  }

  focusCommentInput(articlePost) {
    const commentInput = articlePost.querySelector('.comment-input');
    if (commentInput) {
      commentInput.focus();
      commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  postComment(addCommentElement) {
    const textarea = addCommentElement.querySelector('.comment-input');
    const commentText = textarea.value.trim();
    
    if (!commentText) {
      this.showNotification('Vui lòng nhập nội dung bình luận', 'warning');
      return;
    }

    // Create new comment element
    const newComment = this.createCommentElement(commentText);
    
    // Insert before add-comment element
    const commentsSection = addCommentElement.parentNode;
    commentsSection.insertBefore(newComment, addCommentElement);
    
    // Clear textarea
    textarea.value = '';
    this.autoResizeTextarea(textarea);
    
    // Update comment count
    const articlePost = addCommentElement.closest('.article-post');
    const commentStat = articlePost.querySelector('.post-stats .stat-item i.fa-comment').parentNode;
    const currentCount = parseInt(commentStat.textContent.match(/\d+/)[0]);
    commentStat.innerHTML = `<i class="fas fa-comment"></i> ${currentCount + 1} bình luận`;
    
    // Show success notification
    this.showNotification('Bình luận đã được đăng', 'success');
    
    // Animate new comment
    newComment.style.opacity = '0';
    newComment.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      newComment.style.transition = 'all 0.3s ease';
      newComment.style.opacity = '1';
      newComment.style.transform = 'translateY(0)';
    }, 10);
  }

  createCommentElement(commentText) {
    const comment = document.createElement('div');
    comment.className = 'comment';
    
    const currentUser = this.getCurrentUser();
    const timestamp = this.formatTimestamp(new Date());
    
    comment.innerHTML = `
      <div class="comment-avatar">
        <i class="${currentUser.icon}"></i>
      </div>
      <div class="comment-content">
        <div class="comment-header">
          <strong>${currentUser.name}</strong>
          <span class="comment-time">${timestamp}</span>
        </div>
        <p>${this.escapeHtml(commentText)}</p>
      </div>
    `;
    
    return comment;
  }

  getCurrentUser() {
    // In a real app, this would come from authentication
    return {
      name: 'BS. Nguyễn Văn A',
      icon: 'fas fa-user-md'
    };
  }

  formatTimestamp(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return `${Math.floor(diff / 86400000)} ngày trước`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(48, textarea.scrollHeight) + 'px';
  }

  showNewArticleModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('newArticleModal');
    if (!modal) {
      modal = this.createNewArticleModal();
      document.body.appendChild(modal);
    }
    
    modal.classList.add('active');
  }

  createNewArticleModal() {
    const modal = document.createElement('div');
    modal.id = 'newArticleModal';
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Đăng Bài Viết Mới</h3>
          <button class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form id="newArticleForm">
          <div class="form-group">
            <label for="articleTitle">Tiêu đề bài viết</label>
            <input type="text" id="articleTitle" class="form-input" placeholder="Nhập tiêu đề bài viết..." required>
          </div>
          
          <div class="form-group">
            <label for="articleContent">Nội dung</label>
            <textarea id="articleContent" class="form-input" rows="8" placeholder="Nhập nội dung bài viết..." required></textarea>
          </div>
          
          <div class="form-group">
            <label for="articleImage">Hình ảnh (tùy chọn)</label>
            <input type="file" id="articleImage" class="form-input" accept="image/*">
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn-secondary modal-cancel">Hủy</button>
            <button type="submit" class="btn-primary">Đăng bài</button>
          </div>
        </form>
      </div>
    `;
    
    // Bind modal events
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    modal.querySelector('.modal-cancel').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
    
    modal.querySelector('#newArticleForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleNewArticleSubmit(modal);
    });
    
    return modal;
  }

  handleNewArticleSubmit(modal) {
    const title = modal.querySelector('#articleTitle').value.trim();
    const content = modal.querySelector('#articleContent').value.trim();
    const imageFile = modal.querySelector('#articleImage').files[0];
    
    if (!title || !content) {
      this.showNotification('Vui lòng điền đầy đủ thông tin', 'warning');
      return;
    }
    
    // Create new article post
    const newPost = this.createNewArticlePost(title, content, imageFile);
    
    // Add to articles feed
    const articlesFeed = document.querySelector('.articles-feed');
    if (articlesFeed) {
      articlesFeed.insertBefore(newPost, articlesFeed.firstChild);
    }
    
    // Close modal and reset form
    modal.classList.remove('active');
    modal.querySelector('#newArticleForm').reset();
    
    // Show success notification
    this.showNotification('Bài viết đã được đăng thành công', 'success');
    
    // Animate new post
    newPost.style.opacity = '0';
    newPost.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      newPost.style.transition = 'all 0.5s ease';
      newPost.style.opacity = '1';
      newPost.style.transform = 'translateY(0)';
    }, 10);
    
    // Rebind events for new post
    this.bindArticleEvents();
  }

  createNewArticlePost(title, content, imageFile) {
    const post = document.createElement('div');
    post.className = 'article-post';
    
    const currentUser = this.getCurrentUser();
    const timestamp = this.formatTimestamp(new Date());
    
    let imageHtml = '';
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      imageHtml = `
        <div class="post-image">
          <img src="${imageUrl}" alt="${title}" style="width: 100%; border-radius: 0.5rem;">
        </div>
      `;
    }
    
    post.innerHTML = `
      <div class="post-header">
        <div class="author-info">
          <div class="author-avatar">
            <i class="${currentUser.icon}"></i>
          </div>
          <div class="author-details">
            <h4>${currentUser.name}</h4>
            <span class="post-time">${timestamp}</span>
          </div>
        </div>
        <div class="post-actions">
          <button class="action-btn">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>
      
      <div class="post-content">
        <h3>${this.escapeHtml(title)}</h3>
        <p>${this.escapeHtml(content)}</p>
        ${imageHtml}
      </div>
      
      <div class="post-stats">
        <span class="stat-item">
          <i class="fas fa-heart"></i> 0 lượt thích
        </span>
        <span class="stat-item">
          <i class="fas fa-comment"></i> 0 bình luận
        </span>
      </div>
      
      <div class="post-actions-bar">
        <button class="action-btn like-btn">
          <i class="far fa-heart"></i> Thích
        </button>
        <button class="action-btn comment-btn">
          <i class="fas fa-comment"></i> Bình luận
        </button>
        <button class="action-btn share-btn">
          <i class="fas fa-share"></i> Chia sẻ
        </button>
      </div>
      
      <div class="comments-section">
        <div class="add-comment">
          <div class="user-avatar">
            <i class="${currentUser.icon}"></i>
          </div>
          <div class="comment-input-container">
            <textarea placeholder="Viết bình luận..." class="comment-input"></textarea>
            <div class="comment-actions">
              <button class="btn-sm post-comment-btn">Đăng</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return post;
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `toast-notification toast-${type}`;
    notification.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="toast-close">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
    
    // Close button functionality
    notification.querySelector('.toast-close').addEventListener('click', () => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    });
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
  }

  getNotificationIcon(type) {
    switch (type) {
      case 'success': return 'check-circle';
      case 'warning': return 'exclamation-triangle';
      case 'error': return 'exclamation-circle';
      default: return 'info-circle';
    }
  }

  initializeStatisticsCharts() {
    // Initialize charts for statistics page
    setTimeout(() => {
      const patientsCtx = document.getElementById('patientsChart');
      const revenueCtx = document.getElementById('revenueChart');
      
      if (patientsCtx) {
        new Chart(patientsCtx, {
          type: 'line',
          data: {
            labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
            datasets: [{
              label: 'Bệnh nhân',
              data: [65, 59, 80, 81, 56, 55],
              borderColor: '#3b82f6',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
      
      if (revenueCtx) {
        new Chart(revenueCtx, {
          type: 'bar',
          data: {
            labels: ['Tim mạch', 'Thần kinh', 'Chấn thương', 'Nhi khoa'],
            datasets: [{
              label: 'Doanh thu (triệu đồng)',
              data: [12, 19, 3, 5],
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }, 100);
  }

  initializeDiagnosticsTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        const targetContent = document.getElementById(`${tabName}-tab`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }
}

// Logout function
function logout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    // Clear local storage
    localStorage.removeItem('userSession');
    
    // Redirect to login page
    window.location.href = 'Login.html';
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HospitalDashboard();
});

// Additional CSS styles for dynamic content
const additionalStyles = `
<style>
/* Additional styles for dynamic content */

/* Schedule Page Styles */
.schedule-container {
  max-width: 100%;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.schedule-actions {
  display: flex;
  gap: 1rem;
}

.calendar-grid {
  background: var(--bg-primary);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.nav-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.schedule-grid {
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr);
  gap: 1px;
  background: var(--border-color);
}

.time-column, .day-column {
  background: var(--bg-primary);
}

.time-slot, .day-header {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  background: var(--bg-secondary);
}

.appointment-slot {
  min-height: 60px;
  padding: 0.5rem;
}

.appointment {
  background: var(--primary-color);
  color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.appointment.urgent {
  background: var(--danger-color);
}

/* Patients Page Styles */
.patients-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.patients-actions {
  display: flex;
  gap: 1rem;
}

.patients-filters {
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-input, .filter-select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.patients-table {
  background: var(--bg-primary);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.patients-table table {
  width: 100%;
  border-collapse: collapse;
}

.patients-table th,
.patients-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.patients-table th {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status.active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.status.emergency {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  margin: 0 0.125rem;
  border-radius: 0.375rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.action-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 0.375rem;
  cursor: pointer;
}

.page-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Button Styles */
.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
}

/* Medical Records Styles */
.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.record-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.record-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.record-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.record-status.active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.record-status.completed {
  background: rgba(59, 130, 246, 0.1);
  color: var(--info-color);
}

.record-details p {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.record-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* Medicine Stats */
.medicine-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.medicine-stats .stat-card {
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.medicine-stats .stat-card.warning {
  border-left: 4px solid var(--warning-color);
}

.medicine-stats .stat-card.danger {
  border-left: 4px solid var(--danger-color);
}

/* Diagnostics Styles */
.diagnostics-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  font-weight: 500;
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.imaging-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.imaging-card {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  text-align: center;
}

.imaging-icon {
  width: 4rem;
  height: 4rem;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
}

/* Articles Styles */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.article-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.article-image {
  height: 200px;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
}

.article-content {
  padding: 1.5rem;
}

.article-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.article-content p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.article-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 0.75rem;
}

/* Statistics Styles */
.statistics-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.statistics-overview .stat-card {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0.5rem 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.chart-card h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.chart-card canvas {
  max-height: 300px;
}

/* Accounts Styles */
.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.account-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.account-avatar {
  width: 3rem;
  height: 3rem;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.account-info {
  flex: 1;
}

.account-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.account-info p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.account-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.account-settings {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.account-settings h3 {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .schedule-header,
  .patients-header,
  .records-header,
  .medicines-header,
  .diagnostics-header,
  .articles-header,
  .statistics-header,
  .accounts-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
  }
  
  .search-input,
  .filter-select {
    width: 100%;
  }
  
  .schedule-grid {
    grid-template-columns: 80px repeat(3, 1fr);
    overflow-x: auto;
  }
  
  .records-grid,
  .articles-grid,
  .accounts-grid {
    grid-template-columns: 1fr;
  }
  
  .imaging-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .imaging-grid {
    grid-template-columns: 1fr;
  }
  
  .medicine-stats,
  .statistics-overview {
    grid-template-columns: 1fr;
  }
  
  .account-card {
    flex-direction: column;
    text-align: center;
  }
  
  .account-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);
