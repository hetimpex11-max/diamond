// Diamond Manager Pro - Complete Application with Hardcoded Authentication
// Main Application Class with Role-Based Access Control and Manufacturing Workflow

// ===== HARDCODED ACCOUNTS =====
const HARDCODED_ACCOUNTS = {
    'shailesh.com': {
        id: 'user-shailesh-001',
        businessId: 'business-shailesh-001',
        email: 'shailesh.com',
        username: 'shailesh.com',
        passwordHash: '932850',
        firstName: 'Shailesh',
        lastName: 'Kumar',
        phone: '+91 98765 43210',
        role: 'Owner',
        permissions: ['all'],
        isActive: true,
        createdAt: new Date().toISOString()
    },
    'demo@diamondmanager.com': {
        id: 'demo-user-001',
        businessId: 'demo-business-001',
        email: 'demo@diamondmanager.com',
        username: 'demo@diamondmanager.com',
        passwordHash: 'demo123',
        firstName: 'Demo',
        lastName: 'User',
        phone: '+91 98765 43210',
        role: 'Owner',
        permissions: ['all'],
        isActive: true,
        createdAt: new Date().toISOString()
    }
};

const HARDCODED_BUSINESS_PROFILES = {
    'business-shailesh-001': {
        id: 'business-shailesh-001',
        companyName: 'Shailesh Jewelry Store',
        ownerName: 'Shailesh Kumar',
        businessType: 'Manufacturing',
        email: 'shailesh.com',
        phone: '+91 98765 43210',
        address: 'Shop No. 123, Diamond Market, Mumbai, India',
        gstin: '27ABCDE1234F1Z5',
        createdAt: new Date().toISOString()
    },
    'demo-business-001': {
        id: 'demo-business-001',
        companyName: 'Royal Diamond Jewellers',
        ownerName: 'Demo User',
        businessType: 'Manufacturing',
        email: 'demo@diamondmanager.com',
        phone: '+91 98765 43210',
        address: '456 Jewelry Street, Mumbai, India',
        gstin: '27ABCDE1234F1Z5',
        createdAt: new Date().toISOString()
    }
};

class DiamondManagerPro {
    constructor() {
        // Application state
        this.currentUser = null;
        this.businessProfile = null;
        this.currentSection = 'dashboard';
        this.isAuthenticated = false;
        
        // Data storage - using localStorage for GitHub Pages
        this.data = {
            businessProfiles: JSON.parse(localStorage.getItem('businessProfiles')) || {},
            users: JSON.parse(localStorage.getItem('users')) || {},
            diamonds: JSON.parse(localStorage.getItem('diamonds')) || {},
            manufacturingProcesses: JSON.parse(localStorage.getItem('manufacturingProcesses')) || this.getDefaultProcesses(),
            manufacturingSteps: JSON.parse(localStorage.getItem('manufacturingSteps')) || {},
            customers: JSON.parse(localStorage.getItem('customers')) || {},
            invoices: JSON.parse(localStorage.getItem('invoices')) || {},
            branches: JSON.parse(localStorage.getItem('branches')) || {},
            transfers: JSON.parse(localStorage.getItem('transfers')) || {},
            auditLogs: JSON.parse(localStorage.getItem('auditLogs')) || [],
            notifications: JSON.parse(localStorage.getItem('notifications')) || []
        };
        
        // Application settings
        this.settings = {
            autoSaveInterval: 30000, // 30 seconds
            sessionTimeout: 3600000, // 1 hour
            maxLoginAttempts: 5,
            passwordMinLength: 8
        };
        
        // UI state
        this.modals = {};
        this.charts = {};
        this.timers = {};
        
        // Initialize application
        this.init();
    }
    
    // Initialization
    init() {
        console.log('🚀 Initializing Diamond Manager Pro...');
        this.showLoadingScreen();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load application data
        this.loadApplicationData();
        
        // Check authentication
        this.checkAuthentication();
        
        // Setup auto-save
        this.setupAutoSave();
        
        // Initialize charts library
        this.initializeCharts();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
        
        console.log('✅ Diamond Manager Pro initialized successfully');
    }
    
    // Event Listeners Setup
    setupEventListeners() {
        // Authentication forms
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });
        
        // Add Diamond form
        document.getElementById('addDiamondForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddDiamond();
        });
        
        // Authentication links
        this.setupAuthEventListeners();
        
        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveAllData();
        });
        
        // Click outside modals to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Auto-generate serial numbers
        this.setupSerialNumberGeneration();
        
        console.log('📡 Event listeners set up');
    }
    
    // Setup authentication event listeners
    setupAuthEventListeners() {
        // Register form link
        const showRegisterLink = document.getElementById('showRegisterLink');
        if (showRegisterLink) {
            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
        }
        
        // Login form link
        const showLoginLink = document.getElementById('showLoginLink');
        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }
        
        // Demo link
        const showDemoLink = document.getElementById('showDemoLink');
        if (showDemoLink) {
            showDemoLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDemoLogin();
            });
        }
        
        console.log('🔑 Authentication event listeners set up');
    }
    
    // Authentication UI Functions
    showRegisterForm() {
        console.log('Showing registration form...');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    }
    
    showLoginForm() {
        console.log('Showing login form...');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm && registerForm) {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
    }
    
    showDemoLogin() {
        console.log('Setting up demo login...');
        
        const demoOptions = `
Choose demo account:

1. Shailesh Account
   Username: shailesh.com
   Password: 932850

2. Demo Account  
   Username: demo@diamondmanager.com
   Password: demo123

Which would you like to try? (Enter 1 or 2, or press Cancel for option 1)
        `;
        
        const choice = prompt(demoOptions);
        
        if (choice === '2') {
            document.getElementById('loginEmail').value = 'demo@diamondmanager.com';
            document.getElementById('loginPassword').value = 'demo123';
            this.showToast('Demo account credentials filled!', 'info');
        } else {
            // Default to Shailesh account (choice 1 or cancel)
            document.getElementById('loginEmail').value = 'shailesh.com';
            document.getElementById('loginPassword').value = '932850';
            this.showToast('Shailesh account credentials filled!', 'info');
        }
    }
    
    // Loading Screen
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    // Authentication System
    checkAuthentication() {
        const storedSession = localStorage.getItem('currentSession');
        const lastActivity = localStorage.getItem('lastActivity');
        
        if (storedSession && lastActivity) {
            const sessionData = JSON.parse(storedSession);
            const timeSinceActivity = Date.now() - parseInt(lastActivity);
            
            if (timeSinceActivity < this.settings.sessionTimeout) {
                this.currentUser = sessionData;
                this.isAuthenticated = true;
                
                // Check if it's a hardcoded account
                if (HARDCODED_BUSINESS_PROFILES[sessionData.businessId]) {
                    this.businessProfile = HARDCODED_BUSINESS_PROFILES[sessionData.businessId];
                    this.createDemoDataForUser(sessionData.businessId);
                } else {
                    this.loadBusinessProfile(sessionData.businessId);
                }
                
                this.showMainApplication();
                this.updateLastActivity();
                this.showToast(`Welcome back, ${sessionData.firstName}!`, 'success');
                return;
            }
        }
        
        // No valid session, show auth screen
        this.showAuthScreen();
    }
    
    handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        if (!email || !password) {
            this.showToast('Please fill in all fields', 'warning');
            return;
        }
        
        console.log('Attempting login with:', email);
        
        // Check hardcoded accounts first
        const hardcodedUser = HARDCODED_ACCOUNTS[email] || HARDCODED_ACCOUNTS[email.toLowerCase()];
        
        if (hardcodedUser && password === hardcodedUser.passwordHash) {
            console.log('Hardcoded account login successful');
            
            this.currentUser = hardcodedUser;
            this.isAuthenticated = true;
            
            // Load corresponding business profile
            this.businessProfile = HARDCODED_BUSINESS_PROFILES[hardcodedUser.businessId];
            
            // Store session
            if (rememberMe) {
                localStorage.setItem('currentSession', JSON.stringify(hardcodedUser));
                localStorage.setItem('lastActivity', Date.now().toString());
            }
            
            // Create demo data for the user
            this.createDemoDataForUser(hardcodedUser.businessId);
            
            this.showMainApplication();
            this.logAuditEvent('login', { userId: hardcodedUser.id, email: hardcodedUser.email });
            this.showToast(`Welcome back, ${hardcodedUser.firstName}!`, 'success');
            return;
        }
        
        // Check stored users (existing logic)
        const user = this.findUserByEmail(email);
        
        if (user && this.verifyPassword(password, user.passwordHash)) {
            this.currentUser = user;
            this.isAuthenticated = true;
            
            // Store session
            if (rememberMe) {
                localStorage.setItem('currentSession', JSON.stringify(user));
                localStorage.setItem('lastActivity', Date.now().toString());
            }
            
            this.loadBusinessProfile(user.businessId);
            this.showMainApplication();
            this.logAuditEvent('login', { userId: user.id, email: user.email });
            this.showToast(`Welcome back, ${user.firstName}!`, 'success');
        } else {
            this.showToast('Invalid email or password', 'error');
            this.logAuditEvent('failed_login', { email: email });
        }
    }
    
    handleRegistration() {
        const formData = {
            businessName: document.getElementById('businessName').value.trim(),
            ownerName: document.getElementById('ownerName').value.trim(),
            email: document.getElementById('ownerEmail').value.trim(),
            phone: document.getElementById('ownerPhone').value.trim(),
            businessType: document.getElementById('businessType').value,
            password: document.getElementById('registerPassword').value
        };
        
        // Validation
        if (!this.validateRegistrationData(formData)) {
            return;
        }
        
        // Create business profile
        const businessId = this.generateId();
        const businessProfile = this.createBusinessProfile(businessId, formData);
        
        // Create owner user
        const userId = this.generateId();
        const ownerUser = this.createOwnerUser(userId, businessId, formData);
        
        // Save data
        this.data.businessProfiles[businessId] = businessProfile;
        this.data.users[userId] = ownerUser;
        this.saveAllData();
        
        // Auto login
        this.currentUser = ownerUser;
        this.isAuthenticated = true;
        this.businessProfile = businessProfile;
        
        localStorage.setItem('currentSession', JSON.stringify(ownerUser));
        localStorage.setItem('lastActivity', Date.now().toString());
        
        this.showMainApplication();
        this.logAuditEvent('registration', { userId: userId, businessId: businessId });
        this.showToast('Business profile created successfully!', 'success');
    }
    
    // Create demo data for hardcoded users
    createDemoDataForUser(businessId) {
        // Only create demo data if it doesn't exist
        if (!this.data.diamonds[businessId + '_DM001']) {
            const demoData = [
                {
                    id: businessId + '_DM001',
                    businessId: businessId,
                    serialNumber: 'DM001',
                    itemType: 'Diamond',
                    caratWeight: 2.5,
                    colorGrade: 'D',
                    clarityGrade: 'VVS1',
                    cutGrade: 'Excellent',
                    costPrice: 250000,
                    estimatedSellingPrice: 350000,
                    currentStatus: 'In Manufacturing',
                    assignedWorker: null,
                    priority: 'High',
                    createdAt: new Date().toISOString()
                },
                {
                    id: businessId + '_RG001',
                    businessId: businessId,
                    serialNumber: 'RG001',
                    itemType: 'Ring',
                    caratWeight: 1.0,
                    colorGrade: 'F',
                    clarityGrade: 'VS1',
                    cutGrade: 'Very Good',
                    metalType: 'Gold',
                    metalPurity: '18K',
                    costPrice: 85000,
                    estimatedSellingPrice: 125000,
                    currentStatus: 'Quality Check',
                    assignedWorker: null,
                    priority: 'Normal',
                    createdAt: new Date().toISOString()
                },
                {
                    id: businessId + '_ER001',
                    businessId: businessId,
                    serialNumber: 'ER001',
                    itemType: 'Earrings',
                    caratWeight: 0.75,
                    colorGrade: 'G',
                    clarityGrade: 'VS2',
                    cutGrade: 'Good',
                    metalType: 'Gold',
                    metalPurity: '22K',
                    costPrice: 45000,
                    estimatedSellingPrice: 68000,
                    currentStatus: 'Completed',
                    assignedWorker: null,
                    priority: 'Normal',
                    createdAt: new Date().toISOString()
                }
            ];
            
            demoData.forEach(diamond => {
                this.data.diamonds[diamond.id] = diamond;
            });
            
            // Create demo customers
            this.data.customers[businessId + '_CUST001'] = {
                id: businessId + '_CUST001',
                businessId: businessId,
                name: 'Priya Sharma',
                phone: '+91 98765 11111',
                email: 'priya.sharma@email.com',
                totalPurchases: 125000,
                loyaltyPoints: 1250,
                vipStatus: 'VIP',
                createdAt: new Date().toISOString()
            };
            
            this.data.customers[businessId + '_CUST002'] = {
                id: businessId + '_CUST002',
                businessId: businessId,
                name: 'Rajesh Patel',
                phone: '+91 98765 22222',
                email: 'rajesh.patel@email.com',
                totalPurchases: 85000,
                loyaltyPoints: 850,
                vipStatus: 'Regular',
                createdAt: new Date().toISOString()
            };
            
            // Create demo invoices
            this.data.invoices[businessId + '_INV001'] = {
                id: businessId + '_INV001',
                businessId: businessId,
                invoiceNumber: 'INV-001',
                customerId: businessId + '_CUST001',
                customerName: 'Priya Sharma',
                date: new Date().toISOString().split('T')[0],
                total: 125000,
                status: 'Paid',
                paymentMethod: 'Card',
                createdAt: new Date().toISOString()
            };
            
            this.saveAllData();
            console.log('Demo data created for user:', businessId);
        }
    }
    
    // User Management
    findUserByEmail(email) {
        return Object.values(this.data.users).find(user => user.email === email);
    }
    
    verifyPassword(password, hash) {
        // Simple password verification for demo
        return this.hashPassword(password) === hash;
    }
    
    hashPassword(password) {
        // Simple hash for demo - in production use proper hashing
        return btoa(password + 'salt');
    }
    
    createBusinessProfile(businessId, formData) {
        return {
            id: businessId,
            companyName: formData.businessName,
            ownerName: formData.ownerName,
            businessType: formData.businessType,
            email: formData.email,
            phone: formData.phone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
    
    createOwnerUser(userId, businessId, formData) {
        return {
            id: userId,
            businessId: businessId,
            email: formData.email,
            passwordHash: this.hashPassword(formData.password),
            firstName: formData.ownerName.split(' ')[0],
            lastName: formData.ownerName.split(' ').slice(1).join(' ') || '',
            phone: formData.phone,
            role: 'Owner',
            permissions: ['all'],
            isActive: true,
            createdAt: new Date().toISOString()
        };
    }
    
    validateRegistrationData(data) {
        if (!data.businessName) {
            this.showToast('Business name is required', 'warning');
            return false;
        }
        
        if (!data.ownerName) {
            this.showToast('Owner name is required', 'warning');
            return false;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showToast('Please enter a valid email address', 'warning');
            return false;
        }
        
        if (this.findUserByEmail(data.email)) {
            this.showToast('Email already exists', 'warning');
            return false;
        }
        
        if (data.password.length < this.settings.passwordMinLength) {
            this.showToast(`Password must be at least ${this.settings.passwordMinLength} characters`, 'warning');
            return false;
        }
        
        if (!data.businessType) {
            this.showToast('Please select a business type', 'warning');
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // UI Management
    showAuthScreen() {
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }
    
    showMainApplication() {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        
        this.updateUserInterface();
        this.loadDashboardData();
        this.setupRoleBasedNavigation();
    }
    
    updateUserInterface() {
        if (!this.currentUser || !this.businessProfile) return;
        
        // Update header information
        document.getElementById('businessNameDisplay').textContent = this.businessProfile.companyName;
        document.getElementById('currentUserName').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('currentUserRole').textContent = this.currentUser.role;
        
        // Update user avatar
        const initials = `${this.currentUser.firstName[0]}${this.currentUser.lastName[0] || ''}`;
        document.getElementById('userAvatar').textContent = initials;
        document.getElementById('userAvatarLarge').textContent = initials;
        document.getElementById('userNameLarge').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('userRoleLarge').textContent = this.currentUser.role;
        document.getElementById('userEmailLarge').textContent = this.currentUser.email;
    }
    
    setupRoleBasedNavigation() {
        const ownerNav = document.getElementById('ownerNavigation');
        const workerNav = document.getElementById('workerNavigation');
        
        if (this.currentUser.role === 'Owner' || this.currentUser.role === 'Manager') {
            ownerNav.style.display = 'block';
            workerNav.style.display = 'none';
        } else if (this.currentUser.role === 'Worker') {
            ownerNav.style.display = 'none';
            workerNav.style.display = 'block';
            this.showSection('worker-dashboard');
        } else {
            ownerNav.style.display = 'block';
            workerNav.style.display = 'none';
        }
    }
    
    // Section Management
    showSection(sectionId) {
        // Check permissions
        if (!this.hasPermission(sectionId)) {
            this.showToast('You do not have permission to access this section', 'warning');
            return;
        }
        
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
        
        // Add active class to clicked nav link
        const activeLink = document.querySelector(`.nav-link[onclick="showSection('${sectionId}')"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Load section data
        this.loadSectionData(sectionId);
        
        // Log activity
        this.updateLastActivity();
        this.logAuditEvent('section_access', { section: sectionId });
    }
    
    hasPermission(section) {
        if (!this.currentUser) return false;
        
        // Owners have access to everything
        if (this.currentUser.role === 'Owner') return true;
        
        // Role-based permissions
        const rolePermissions = {
            'Manager': ['dashboard', 'manufacturing', 'inventory', 'customers', 'billing', 'pricing', 'reports'],
            'Worker': ['worker-dashboard', 'my-diamonds', 'quality-check', 'work-schedule', 'billing', 'pricing'],
            'Viewer': ['dashboard', 'inventory', 'customers', 'reports']
        };
        
        const allowedSections = rolePermissions[this.currentUser.role] || [];
        return allowedSections.includes(section);
    }
    
    loadSectionData(sectionId) {
        switch (sectionId) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'business-profile':
                this.loadBusinessProfileData();
                break;
            case 'manufacturing':
                this.loadManufacturingData();
                break;
            case 'inventory':
                this.loadInventoryData();
                break;
            case 'customers':
                this.loadCustomersData();
                break;
            case 'financial':
                this.loadFinancialData();
                break;
            case 'employees':
                this.loadEmployeesData();
                break;
            case 'reports':
                this.loadReportsData();
                break;
            case 'pricing':
                // No data to load, just show the section
                break;
            case 'billing':
                this.loadBillingData();
                break;
            case 'worker-dashboard':
                this.loadWorkerDashboardData();
                break;
            case 'my-diamonds':
                this.loadMyDiamondsData();
                break;
        }
    }
    
    // Dashboard Data Loading
    loadDashboardData() {
        if (this.currentUser.role === 'Owner' || this.currentUser.role === 'Manager') {
            this.updateBusinessOverview();
            this.updateManufacturingPipeline();
            this.updateQuickStats();
        }
    }
    
    updateBusinessOverview() {
        const businessDiamonds = this.getBusinessDiamonds();
        const businessCustomers = this.getBusinessCustomers();
        const businessInvoices = this.getBusinessInvoices();
        
        const totalValue = businessDiamonds.reduce((sum, diamond) => sum + (diamond.estimatedSellingPrice || 0), 0);
        const monthlyRevenue = this.calculateMonthlyRevenue(businessInvoices);
        
        document.getElementById('totalBusinessValue').textContent = `₹${totalValue.toLocaleString()}`;
        document.getElementById('monthlyRevenue').textContent = `₹${monthlyRevenue.toLocaleString()}`;
        document.getElementById('activeEmployees').textContent = this.getActiveEmployeeCount();
        document.getElementById('customerBase').textContent = businessCustomers.length;
    }
    
    updateManufacturingPipeline() {
        const diamonds = this.getBusinessDiamonds();
        
        const statusCounts = {
            'Raw': diamonds.filter(d => d.currentStatus === 'Raw').length,
            'In Manufacturing': diamonds.filter(d => d.currentStatus === 'In Manufacturing').length,
            'Quality Check': diamonds.filter(d => d.currentStatus === 'Quality Check').length,
            'Completed': diamonds.filter(d => d.currentStatus === 'Completed').length
        };
        
        document.getElementById('rawMaterials').textContent = statusCounts['Raw'];
        document.getElementById('inManufacturingCount').textContent = statusCounts['In Manufacturing'];
        document.getElementById('qualityControlCount').textContent = statusCounts['Quality Check'];
        document.getElementById('readyForDelivery').textContent = statusCounts['Completed'];
        
        // Update top bar stats
        document.getElementById('inManufacturing').textContent = statusCounts['In Manufacturing'];
        document.getElementById('qualityCheck').textContent = statusCounts['Quality Check'];
    }
    
    updateQuickStats() {
        const todayRevenue = this.calculateTodayRevenue();
        document.getElementById('todayRevenue').textContent = `₹${todayRevenue.toLocaleString()}`;
    }
    
    // Manufacturing Data Loading
    loadManufacturingData() {
        const diamonds = this.getBusinessDiamonds();
        this.updateManufacturingOverview(diamonds);
        this.updateManufacturingTable(diamonds);
    }
    
    updateManufacturingOverview(diamonds) {
        const statusCounts = {
            raw: diamonds.filter(d => d.currentStatus === 'Raw').length,
            manufacturing: diamonds.filter(d => d.currentStatus === 'In Manufacturing').length,
            qc: diamonds.filter(d => d.currentStatus === 'Quality Check').length,
            completed: diamonds.filter(d => d.currentStatus === 'Completed').length
        };
        
        document.getElementById('rawMaterialsCount').textContent = statusCounts.raw;
        document.getElementById('inManufacturingValue').textContent = statusCounts.manufacturing;
        document.getElementById('qualityControlValue').textContent = statusCounts.qc;
        document.getElementById('completedValue').textContent = statusCounts.completed;
    }
    
    updateManufacturingTable(diamonds) {
        const tableBody = document.getElementById('manufacturingTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = diamonds.map(diamond => `
            <tr onclick="app.viewDiamondDetails('${diamond.id}')" style="cursor: pointer;">
                <td>${diamond.serialNumber}</td>
                <td>${diamond.itemType}</td>
                <td>
                    <div class="specs-cell">
                        <div>${diamond.caratWeight}ct</div>
                        <div>${diamond.colorGrade} ${diamond.clarityGrade}</div>
                        <div>${diamond.cutGrade}</div>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${diamond.currentStatus.toLowerCase().replace(' ', '-')}">
                        ${diamond.currentStatus}
                    </span>
                </td>
                <td>${this.getWorkerName(diamond.assignedWorker) || 'Unassigned'}</td>
                <td>
                    <div class="progress-indicator">
                        <div class="progress-fill" style="width: ${this.calculateProgress(diamond)}%"></div>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-secondary" onclick="app.editDiamond('${diamond.id}'); event.stopPropagation();">Edit</button>
                        <button class="btn-secondary" onclick="app.updateProgress('${diamond.id}'); event.stopPropagation();">Update</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        if (diamonds.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        No manufacturing items found. <a href="#" onclick="showAddDiamondModal()" style="color: var(--accent-primary);">Add your first diamond</a>
                    </td>
                </tr>
            `;
        }
    }
    
    // Worker Dashboard
    loadWorkerDashboardData() {
        if (this.currentUser.role !== 'Worker') return;
        
        const assignedDiamonds = this.getWorkerAssignedDiamonds();
        const todayTasks = this.getWorkerTodayTasks();
        const completedToday = this.getWorkerCompletedToday();
        
        document.getElementById('workerTasksToday').textContent = todayTasks.length;
        document.getElementById('assignedDiamonds').textContent = assignedDiamonds.length;
        document.getElementById('completedToday').textContent = completedToday.length;
        document.getElementById('workingHours').textContent = this.calculateWorkingHours() + 'h';
        
        this.updateCurrentTasksGrid(todayTasks);
        this.updateMyDiamondsGrid(assignedDiamonds);
    }
    
    getWorkerAssignedDiamonds() {
        if (!this.currentUser) return [];
        
        return Object.values(this.data.diamonds).filter(diamond => 
            diamond.businessId === this.currentUser.businessId &&
            diamond.assignedWorker === this.currentUser.id &&
            ['In Manufacturing', 'Quality Check'].includes(diamond.currentStatus)
        );
    }
    
    getWorkerTodayTasks() {
        const assignedDiamonds = this.getWorkerAssignedDiamonds();
        return assignedDiamonds.map(diamond => ({
            id: diamond.id,
            name: `${diamond.itemType} ${diamond.serialNumber}`,
            status: diamond.currentStatus,
            priority: diamond.priority || 'Normal',
            estimatedTime: '2-4 hours'
        }));
    }
    
    getWorkerCompletedToday() {
        // In a real app, this would track completed steps today
        return [];
    }
    
    calculateWorkingHours() {
        // Simple calculation - in real app would track actual clock in/out
        return 6;
    }
    
    updateCurrentTasksGrid(tasks) {
        const grid = document.getElementById('currentTasksGrid');
        if (!grid) return;
        
        if (tasks.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h3>No tasks assigned</h3>
                    <p>You don't have any tasks assigned for today.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = tasks.map(task => `
            <div class="task-card ${task.priority.toLowerCase()}">
                <div class="task-header">
                    <h4>${task.name}</h4>
                    <span class="${task.priority.toLowerCase()}-badge">${task.priority}</span>
                </div>
                <p>Status: ${task.status}</p>
                <div class="progress-indicator">
                    <div class="progress-fill" style="width: 65%"></div>
                </div>
                <div class="task-actions">
                    <button class="action-button" onclick="app.startTask('${task.id}')">Continue Work</button>
                    <span class="time-left">${task.estimatedTime}</span>
                </div>
            </div>
        `).join('');
    }
    
    updateMyDiamondsGrid(diamonds) {
        const grid = document.getElementById('myDiamondsGrid');
        if (!grid) return;
        
        if (diamonds.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h3>No diamonds assigned</h3>
                    <p>You don't have any diamonds assigned for work.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = diamonds.map(diamond => `
            <div class="diamond-item" onclick="app.viewDiamondDetails('${diamond.id}')">
                <div class="diamond-image">💎</div>
                <div class="diamond-info">
                    <h4>${diamond.serialNumber} - ${diamond.caratWeight}ct</h4>
                    <p>Status: ${diamond.currentStatus}</p>
                    <p>Type: ${diamond.itemType}</p>
                </div>
                <button class="action-button" onclick="app.updateDiamondProgress('${diamond.id}'); event.stopPropagation();">Update Progress</button>
            </div>
        `).join('');
    }
    
    // Diamond Management
    handleAddDiamond() {
        if (!this.hasPermission('inventory')) {
            this.showToast('You do not have permission to add diamonds', 'warning');
            return;
        }
        
        const formData = this.collectDiamondFormData();
        
        if (!this.validateDiamondData(formData)) {
            return;
        }
        
        const diamondId = this.generateId();
        const diamond = this.createDiamondObject(diamondId, formData);
        
        this.data.diamonds[diamondId] = diamond;
        this.saveAllData();
        
        this.closeModal('addDiamondModal');
        this.clearDiamondForm();
        this.loadSectionData(this.currentSection);
        
        this.logAuditEvent('diamond_added', { diamondId: diamondId, serialNumber: diamond.serialNumber });
        this.showToast('Diamond added successfully!', 'success');
    }
    
    collectDiamondFormData() {
        return {
            itemType: document.getElementById('diamondItemType')?.value,
            serialNumber: document.getElementById('diamondSerialNumber')?.value,
            caratWeight: parseFloat(document.getElementById('caratWeight')?.value) || 0,
            cutGrade: document.getElementById('cutGrade')?.value,
            colorGrade: document.getElementById('colorGrade')?.value,
            clarityGrade: document.getElementById('clarityGrade')?.value,
            costPrice: parseFloat(document.getElementById('costPrice')?.value) || 0,
            estimatedSellingPrice: parseFloat(document.getElementById('estimatedSellingPrice')?.value) || 0,
            priorityLevel: document.getElementById('priorityLevel')?.value || 'Normal'
        };
    }
    
    validateDiamondData(data) {
        if (!data.itemType) {
            this.showToast('Please select an item type', 'warning');
            return false;
        }
        
        if (!data.serialNumber) {
            this.showToast('Serial number is required', 'warning');
            return false;
        }
        
        if (data.caratWeight <= 0) {
            this.showToast('Please enter a valid carat weight', 'warning');
            return false;
        }
        
        return true;
    }
    
    createDiamondObject(diamondId, formData) {
        return {
            id: diamondId,
            businessId: this.currentUser.businessId,
            serialNumber: formData.serialNumber,
            itemType: formData.itemType,
            caratWeight: formData.caratWeight,
            cutGrade: formData.cutGrade,
            colorGrade: formData.colorGrade,
            clarityGrade: formData.clarityGrade,
            costPrice: formData.costPrice,
            estimatedSellingPrice: formData.estimatedSellingPrice,
            currentStatus: 'Raw',
            assignedWorker: null,
            priority: formData.priorityLevel,
            createdAt: new Date().toISOString(),
            createdBy: this.currentUser.id,
            images: [],
            certificates: []
        };
    }
    
    viewDiamondDetails(diamondId) {
        const diamond = this.data.diamonds[diamondId];
        if (!diamond) return;
        
        // Create and show diamond details modal
        this.showDiamondDetailsModal(diamond);
    }
    
    showDiamondDetailsModal(diamond) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>💎 Diamond Details - ${diamond.serialNumber}</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                        <div class="detail-section">
                            <h3>Basic Information</h3>
                            <div class="detail-row">
                                <span>Serial Number:</span>
                                <span>${diamond.serialNumber}</span>
                            </div>
                            <div class="detail-row">
                                <span>Type:</span>
                                <span>${diamond.itemType}</span>
                            </div>
                            <div class="detail-row">
                                <span>Status:</span>
                                <span class="status-badge">${diamond.currentStatus}</span>
                            </div>
                            <div class="detail-row">
                                <span>Priority:</span>
                                <span>${diamond.priority || 'Normal'}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Specifications</h3>
                            <div class="detail-row">
                                <span>Carat Weight:</span>
                                <span>${diamond.caratWeight}ct</span>
                            </div>
                            <div class="detail-row">
                                <span>Color:</span>
                                <span>${diamond.colorGrade || 'Not specified'}</span>
                            </div>
                            <div class="detail-row">
                                <span>Clarity:</span>
                                <span>${diamond.clarityGrade || 'Not specified'}</span>
                            </div>
                            <div class="detail-row">
                                <span>Cut:</span>
                                <span>${diamond.cutGrade || 'Not specified'}</span>
                            </div>
                        </div>
                        
                        ${this.currentUser.role === 'Owner' ? `
                        <div class="detail-section">
                            <h3>Financial Information</h3>
                            <div class="detail-row">
                                <span>Cost Price:</span>
                                <span>₹${diamond.costPrice?.toLocaleString() || 'N/A'}</span>
                            </div>
                            <div class="detail-row">
                                <span>Estimated Selling Price:</span>
                                <span>₹${diamond.estimatedSellingPrice?.toLocaleString() || 'N/A'}</span>
                            </div>
                            <div class="detail-row">
                                <span>Profit Margin:</span>
                                <span>₹${((diamond.estimatedSellingPrice || 0) - (diamond.costPrice || 0)).toLocaleString()}</span>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="detail-section">
                            <h3>Manufacturing</h3>
                            <div class="detail-row">
                                <span>Assigned Worker:</span>
                                <span>${this.getWorkerName(diamond.assignedWorker) || 'Unassigned'}</span>
                            </div>
                            <div class="detail-row">
                                <span>Created:</span>
                                <span>${this.formatDate(diamond.createdAt)}</span>
                            </div>
                            <div class="detail-row">
                                <span>Progress:</span>
                                <div class="progress-indicator">
                                    <div class="progress-fill" style="width: ${this.calculateProgress(diamond)}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    ${this.currentUser.role !== 'Viewer' ? `
                    <button type="button" class="btn-primary" onclick="app.updateProgress('${diamond.id}'); this.closest('.modal').remove();">Update Status</button>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    updateProgress(diamondId) {
        const diamond = this.data.diamonds[diamondId];
        if (!diamond) return;
        
        const statusOptions = ['Raw', 'In Manufacturing', 'Quality Check', 'Completed'];
        const currentIndex = statusOptions.indexOf(diamond.currentStatus);
        
        const newStatus = prompt(`Update status for ${diamond.serialNumber}:\n\n1. Raw\n2. In Manufacturing\n3. Quality Check\n4. Completed\n\nEnter number (current: ${currentIndex + 1}):`, (currentIndex + 1).toString());
        
        if (newStatus && newStatus >= 1 && newStatus <= 4) {
            const newStatusText = statusOptions[parseInt(newStatus) - 1];
            diamond.currentStatus = newStatusText;
            diamond.lastUpdated = new Date().toISOString();
            
            this.saveAllData();
            this.loadSectionData(this.currentSection);
            this.logAuditEvent('progress_updated', { diamondId: diamondId, newStatus: newStatusText });
            this.showToast(`Status updated to: ${newStatusText}`, 'success');
        }
    }
    
    // Manufacturing Processes
    getDefaultProcesses() {
        return {
            'cutting': {
                id: 'cutting',
                name: 'Diamond Cutting',
                description: 'Precision cutting of raw diamonds',
                sequenceOrder: 1,
                estimatedDurationHours: 8,
                requiredSkills: ['Diamond Cutting', 'Precision Tools'],
                qualityCheckRequired: true
            },
            'polishing': {
                id: 'polishing',
                name: 'Diamond Polishing',
                description: 'Final polishing for brilliance',
                sequenceOrder: 2,
                estimatedDurationHours: 4,
                requiredSkills: ['Polishing', 'Quality Control'],
                qualityCheckRequired: true
            },
            'setting': {
                id: 'setting',
                name: 'Stone Setting',
                description: 'Setting diamonds in jewelry',
                sequenceOrder: 3,
                estimatedDurationHours: 6,
                requiredSkills: ['Stone Setting', 'Jewelry Making'],
                qualityCheckRequired: true
            },
            'final_qc': {
                id: 'final_qc',
                name: 'Final Quality Check',
                description: 'Final inspection and approval',
                sequenceOrder: 4,
                estimatedDurationHours: 2,
                requiredSkills: ['Quality Control', 'Inspection'],
                qualityCheckRequired: true
            }
        };
    }
    
    // Data Helper Functions
    getBusinessDiamonds() {
        if (!this.currentUser) return [];
        
        return Object.values(this.data.diamonds).filter(diamond => 
            diamond.businessId === this.currentUser.businessId
        );
    }
    
    getBusinessCustomers() {
        if (!this.currentUser) return [];
        
        return Object.values(this.data.customers).filter(customer => 
            customer.businessId === this.currentUser.businessId
        );
    }
    
    getBusinessInvoices() {
        if (!this.currentUser) return [];
        
        return Object.values(this.data.invoices).filter(invoice => 
            invoice.businessId === this.currentUser.businessId
        );
    }
    
    calculateMonthlyRevenue(invoices = null) {
        if (!invoices) invoices = this.getBusinessInvoices();
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return invoices
            .filter(invoice => {
                const invoiceDate = new Date(invoice.date);
                return invoiceDate.getMonth() === currentMonth && 
                       invoiceDate.getFullYear() === currentYear;
            })
            .reduce((total, invoice) => total + (invoice.total || 0), 0);
    }
    
    calculateTodayRevenue() {
        const invoices = this.getBusinessInvoices();
        const today = new Date().toDateString();
        
        return invoices
            .filter(invoice => new Date(invoice.date).toDateString() === today)
            .reduce((total, invoice) => total + (invoice.total || 0), 0);
    }
    
    getActiveEmployeeCount() {
        if (!this.currentUser) return 0;
        
        return Object.values(this.data.users).filter(user => 
            user.businessId === this.currentUser.businessId && 
            user.isActive
        ).length;
    }
    
    getWorkerName(workerId) {
        if (!workerId) return null;
        const worker = this.data.users[workerId];
        return worker ? `${worker.firstName} ${worker.lastName}` : 'Unknown';
    }
    
    calculateProgress(diamond) {
        const statusProgress = {
            'Raw': 0,
            'In Manufacturing': 50,
            'Quality Check': 80,
            'Completed': 100
        };
        return statusProgress[diamond.currentStatus] || 0;
    }
    
    // Worker Task Management
    startTask(diamondId) {
        const diamond = this.data.diamonds[diamondId];
        if (!diamond) return;
        
        // Update diamond status
        diamond.currentStatus = 'In Manufacturing';
        diamond.lastUpdated = new Date().toISOString();
        
        this.saveAllData();
        this.loadSectionData(this.currentSection);
        this.logAuditEvent('task_started', { diamondId: diamondId });
        this.showToast('Task started successfully!', 'success');
    }
    
    updateDiamondProgress(diamondId) {
        this.updateProgress(diamondId);
    }
    
    // Modal Management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input, select, textarea');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
    
    // Form Management
    clearDiamondForm() {
        const form = document.getElementById('addDiamondForm');
        if (form) {
            form.reset();
            this.generateSerialNumber();
        }
    }
    
    setupSerialNumberGeneration() {
        // Auto-generate serial number when adding new diamonds
        this.generateSerialNumber();
    }
    
    generateSerialNumber() {
        const serialInput = document.getElementById('diamondSerialNumber');
        if (serialInput) {
            const prefix = 'DM';
            const timestamp = Date.now().toString().slice(-6);
            serialInput.value = `${prefix}${timestamp}`;
        }
    }
    
    // Business Profile Management
    loadBusinessProfile(businessId) {
        this.businessProfile = this.data.businessProfiles[businessId];
        if (!this.businessProfile) {
            console.error('Business profile not found:', businessId);
            this.showToast('Business profile not found', 'error');
            this.logout();
        }
    }
    
    loadBusinessProfileData() {
        if (!this.businessProfile) return;
        
        document.getElementById('profileCompanyName').textContent = this.businessProfile.companyName;
        document.getElementById('profileBusinessType').textContent = this.businessProfile.businessType;
        document.getElementById('profileOwnerName').textContent = this.businessProfile.ownerName;
        document.getElementById('profileEmail').textContent = this.businessProfile.email;
        document.getElementById('profilePhone').textContent = this.businessProfile.phone;
        document.getElementById('profileGstin').textContent = this.businessProfile.gstin;
        document.getElementById('profileAddress').textContent = this.businessProfile.address;
    }

    editBusinessProfileField(field) {
        const newValue = prompt(`Enter new ${field}:`);
        if (newValue) {
            this.businessProfile[field] = newValue;
            this.saveAllData();
            this.loadBusinessProfileData();
            this.showToast(`${field} updated!`, 'success');
        }
    }
    
    // Inventory Management
    loadInventoryData() {
        const diamonds = this.getBusinessDiamonds();
        const tableBody = document.getElementById('inventoryTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = diamonds.map(diamond => `
            <tr>
                <td>${diamond.serialNumber}</td>
                <td>${diamond.itemType}</td>
                <td>${diamond.caratWeight}</td>
                <td>${diamond.colorGrade}</td>
                <td>${diamond.clarityGrade}</td>
                <td>${diamond.currentStatus}</td>
                <td>₹${diamond.costPrice.toLocaleString()}</td>
                <td>₹${diamond.estimatedSellingPrice.toLocaleString()}</td>
            </tr>
        `).join('');
    }

    // Customer Management
    loadCustomersData() {
        const customers = this.getBusinessCustomers();
        const tableBody = document.getElementById('customersTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = customers.map(customer => `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>₹${customer.totalPurchases.toLocaleString()}</td>
                <td>${customer.loyaltyPoints}</td>
                <td>${customer.vipStatus}</td>
            </tr>
        `).join('');
    }

    // Financial Management
    loadFinancialData() {
        const invoices = this.getBusinessInvoices();
        const diamonds = this.getBusinessDiamonds();
        
        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const totalExpenses = diamonds.reduce((sum, dia) => sum + dia.costPrice, 0); // Simplified
        const netProfit = totalRevenue - totalExpenses;

        document.getElementById('financialTotalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
        document.getElementById('financialTotalExpenses').textContent = `₹${totalExpenses.toLocaleString()}`;
        document.getElementById('financialNetProfit').textContent = `₹${netProfit.toLocaleString()}`;

        const transactionsTableBody = document.getElementById('transactionsTableBody');
        if(transactionsTableBody){
            transactionsTableBody.innerHTML = invoices.map(inv => `
                <tr>
                    <td>${this.formatDate(inv.date)}</td>
                    <td>Invoice #${inv.invoiceNumber}</td>
                    <td>Sale</td>
                    <td>₹${inv.total.toLocaleString()}</td>
                </tr>
            `).join('');
        }
    }

    // Employee Management
    loadEmployeesData() {
        const users = Object.values(this.data.users).filter(u => u.businessId === this.currentUser.businessId);
        const tableBody = document.getElementById('employeesTableBody');
        if(!tableBody) return;

        tableBody.innerHTML = users.map(user => `
             <tr>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.role}</td>
                <td>${user.isActive ? 'Active' : 'Inactive'}</td>
            </tr>
        `).join('');
    }
    
    // Billing and POS
    loadBillingData() {
       // No data to load directly, handled by invoice creation modal
    }
    
    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }
    
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-IN');
    }
    
    formatDateTime(date) {
        return new Date(date).toLocaleString('en-IN');
    }
    
    // Toast Notifications
    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icons[type] || icons.info}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }
    
    // Data Persistence
    saveAllData() {
        Object.keys(this.data).forEach(key => {
            localStorage.setItem(key, JSON.stringify(this.data[key]));
        });
    }
    
    loadApplicationData() {
        // Data is already loaded in constructor
        console.log('📊 Application data loaded');
    }
    
    setupAutoSave() {
        setInterval(() => {
            this.saveAllData();
            console.log('💾 Auto-save completed');
        }, this.settings.autoSaveInterval);
    }
    
    // Session Management
    updateLastActivity() {
        localStorage.setItem('lastActivity', Date.now().toString());
    }
    
    logout() {
        // Clear session data
        localStorage.removeItem('currentSession');
        localStorage.removeItem('lastActivity');
        
        // Reset application state
        this.currentUser = null;
        this.businessProfile = null;
        this.isAuthenticated = false;
        
        // Show auth screen
        this.showAuthScreen();
        
        // Log audit event
        this.logAuditEvent('logout');
        
        this.showToast('You have been logged out', 'info');
    }
    
    // Audit Logging
    logAuditEvent(action, details = {}) {
        const auditEvent = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            userId: this.currentUser?.id || 'anonymous',
            businessId: this.currentUser?.businessId || 'unknown',
            action: action,
            details: details,
            userAgent: navigator.userAgent,
            ip: 'localhost' // In real app, get from server
        };
        
        this.data.auditLogs.push(auditEvent);
        
        // Keep only last 1000 audit logs to prevent localStorage overflow
        if (this.data.auditLogs.length > 1000) {
            this.data.auditLogs = this.data.auditLogs.slice(-1000);
        }
        
        this.saveAllData();
    }
    
    // Charts Initialization
    initializeCharts() {
        if (typeof Chart !== 'undefined') {
            Chart.defaults.color = '#b0bec5';
            Chart.defaults.borderColor = '#334155';
            console.log('📈 Charts library initialized');
        }
    }

    // Invoice Management
    showCreateInvoiceModal() {
        this.showModal('createInvoiceModal');
        document.getElementById('invoiceDate').value = this.formatDate(new Date());
        document.getElementById('invoiceNumber').value = this.generateInvoiceNumber();
        document.getElementById('invoiceItemsContainer').innerHTML = '';
        this.addInvoiceItem();
    }

    addInvoiceItem() {
        const container = document.getElementById('invoiceItemsContainer');
        const itemIndex = container.children.length;
        const newItem = document.createElement('div');
        newItem.className = 'form-grid';
        newItem.innerHTML = `
            <div class="form-group">
                <label>Item</label>
                <select class="invoice-item" onchange="app.updateInvoiceTotals()">
                    ${Object.values(this.data.diamonds).map(d => `<option value="${d.id}">${d.serialNumber} - ${d.itemType}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="number" class="invoice-item-price" oninput="app.updateInvoiceTotals()">
            </div>
        `;
        container.appendChild(newItem);
    }
    
    updateInvoiceTotals() {
        let total = 0;
        document.querySelectorAll('.invoice-item-price').forEach(input => {
            total += parseFloat(input.value) || 0;
        });

        const gst = total * 0.03;
        const grandTotal = total + gst;

        document.getElementById('invoiceTotalAmount').textContent = total.toLocaleString();
        document.getElementById('invoiceGstAmount').textContent = gst.toLocaleString();
        document.getElementById('invoiceGrandTotal').textContent = grandTotal.toLocaleString();
        document.getElementById('invoiceTotalInWords').textContent = this.numberToWords(total);
        document.getElementById('invoiceGstInWords').textContent = this.numberToWords(gst);
    }

    generateInvoiceNumber() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const financialYear = month >= 3 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
        const invoiceCount = Object.values(this.data.invoices).filter(inv => inv.invoiceNumber.startsWith(financialYear)).length + 1;
        return `${financialYear}/${invoiceCount.toString().padStart(3, '0')}`;
    }
    
    numberToWords(num) {
        const a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        const b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
        return str.toUpperCase() + 'ONLY';
    }
    
    // Add Employee
    showAddEmployeeModal() {
        this.showModal('addEmployeeModal');
    }

    handleAddEmployee() {
        const firstName = document.getElementById('employeeFirstName').value;
        const lastName = document.getElementById('employeeLastName').value;
        const email = document.getElementById('employeeEmail').value;
        const phone = document.getElementById('employeePhone').value;
        const role = document.getElementById('employeeRole').value;
        const password = document.getElementById('employeePassword').value;

        if (firstName && lastName && email && phone && role && password) {
            const userId = this.generateId();
            this.data.users[userId] = {
                id: userId,
                businessId: this.currentUser.businessId,
                email,
                passwordHash: this.hashPassword(password),
                firstName,
                lastName,
                phone,
                role,
                isActive: true,
                createdAt: new Date().toISOString()
            };
            this.saveAllData();
            this.loadEmployeesData();
            this.closeModal('addEmployeeModal');
            this.showToast('Employee added successfully!', 'success');
        } else {
            this.showToast('Please fill all fields', 'warning');
        }
    }

    createInvoice() {
        const invoiceData = {
            invoiceNumber: document.getElementById('invoiceNumber').value,
            date: document.getElementById('invoiceDate').value,
            customerName: document.getElementById('invoiceCustomerName').value,
            customerPhone: document.getElementById('invoiceCustomerPhone').value,
            customerGstin: document.getElementById('invoiceCustomerGstin').value,
            customerAddress: document.getElementById('invoiceCustomerAddress').value,
            items: [],
            total: 0,
            gst: 0,
            grandTotal: 0
        };

        const itemElements = document.querySelectorAll('#invoiceItemsContainer .form-grid');
        itemElements.forEach(itemEl => {
            const id = itemEl.querySelector('.invoice-item').value;
            const price = parseFloat(itemEl.querySelector('.invoice-item-price').value);
            const diamond = this.data.diamonds[id];
            if (diamond) {
                invoiceData.items.push({ ...diamond, price });
                invoiceData.total += price;
            }
        });

        invoiceData.gst = invoiceData.total * 0.03;
        invoiceData.grandTotal = invoiceData.total + invoiceData.gst;

        this.data.invoices[this.generateId()] = invoiceData;
        this.saveAllData();
        this.generateInvoicePDF(invoiceData);
        this.closeModal('createInvoiceModal');
        this.showToast('Invoice created and downloaded!', 'success');
    }
    
    generateInvoicePDF(invoiceData) {
        const { jsPDF } = window;
        const doc = new jsPDF();

        const copies = ['ORIGINAL FOR RECIPIENT', 'DUPLICATE FOR TRANSPORTER', 'TRIPLICATE FOR SUPPLIER'];

        copies.forEach((copy, index) => {
            if (index > 0) doc.addPage();
            
            // Header
            doc.setFontSize(18);
            doc.text(this.businessProfile.companyName, 105, 20, { align: 'center' });
            doc.setFontSize(10);
            doc.text(this.businessProfile.address, 105, 28, { align: 'center' });
            doc.text(`GSTIN/UIN: ${this.businessProfile.gstin}`, 105, 36, { align: 'center' });
            
            doc.setFontSize(12);
            doc.text('TAX INVOICE', 105, 46, { align: 'center' });
            doc.text(copy, 105, 54, { align: 'center' });

            // Invoice Info
            doc.line(10, 60, 200, 60);
            doc.text(`Invoice No: ${invoiceData.invoiceNumber}`, 10, 68);
            doc.text(`Dated: ${invoiceData.date}`, 150, 68);
            doc.line(10, 74, 200, 74);
            
            // Buyer Info
            doc.text('Buyer:', 10, 82);
            doc.text(invoiceData.customerName, 10, 90);
            doc.text(invoiceData.customerAddress, 10, 98);
            doc.text(`GSTIN/UIN: ${invoiceData.customerGstin}`, 10, 106);

            // Table
            const tableData = invoiceData.items.map((item, i) => [
                i + 1,
                `${item.itemType} - ${item.serialNumber}`,
                '71023910', // HSN/SAC
                '1',
                item.price.toLocaleString(),
                item.price.toLocaleString()
            ]);
            
            doc.autoTable({
                head: [['#', 'Description', 'HSN/SAC', 'Qty', 'Rate', 'Amount']],
                body: tableData,
                startY: 112
            });

            // Totals
            let finalY = doc.autoTable.previous.finalY + 10;
            doc.text(`Total:`, 150, finalY);
            doc.text(invoiceData.total.toLocaleString(), 180, finalY);
            finalY += 8;
            doc.text(`IGST (3%):`, 150, finalY);
            doc.text(invoiceData.gst.toLocaleString(), 180, finalY);
            finalY += 8;
            doc.text(`Grand Total:`, 150, finalY);
            doc.text(invoiceData.grandTotal.toLocaleString(), 180, finalY);

            // In words
            finalY += 15;
            doc.text(`Amount Chargeable (in words): ${this.numberToWords(invoiceData.grandTotal)}`, 10, finalY);
            finalY += 8;
            doc.text(`Tax Amount (in words): ${this.numberToWords(invoiceData.gst)}`, 10, finalY);

            // Footer
             doc.text('For ' + this.businessProfile.companyName, 150, finalY + 30);
             doc.text('Authorised Signatory', 150, finalY + 38);
        });

        doc.save(`Invoice-${invoiceData.invoiceNumber.replace('/', '-')}.pdf`);
    }

    // Reports
    loadReportsData() {
        const diamonds = this.getBusinessDiamonds();
        const invoices = this.getBusinessInvoices();

        // Business Overview
        const totalValue = diamonds.reduce((sum, d) => sum + d.estimatedSellingPrice, 0);
        document.getElementById('reportBusinessValue').textContent = `₹${totalValue.toLocaleString()}`;
        document.getElementById('reportMonthlyRevenue').textContent = `₹${this.calculateMonthlyRevenue(invoices).toLocaleString()}`;
        
        // Manufacturing
        const pipelineCounts = {
            'Raw': diamonds.filter(d => d.currentStatus === 'Raw').length,
            'In Manufacturing': diamonds.filter(d => d.currentStatus === 'In Manufacturing').length,
            'Quality Check': diamonds.filter(d => d.currentStatus === 'Quality Check').length,
            'Completed': diamonds.filter(d => d.currentStatus === 'Completed').length,
        };
        document.getElementById('reportPipelineItems').textContent = diamonds.length;
        this.renderManufacturingChart(pipelineCounts);
        
        // Inventory
        document.getElementById('reportInventoryValue').textContent = `₹${totalValue.toLocaleString()}`;
        this.renderInventoryChart(diamonds);

        // Financial
        const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
        document.getElementById('reportTotalSales').textContent = `₹${totalSales.toLocaleString()}`;
        this.renderRevenueChart(invoices);
    }
    
    renderManufacturingChart(data) {
        const ctx = document.getElementById('manufacturingChart').getContext('2d');
        if (this.charts.manufacturing) this.charts.manufacturing.destroy();
        this.charts.manufacturing = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Item Count',
                    data: Object.values(data),
                    backgroundColor: '#ffd166'
                }]
            }
        });
    }

    renderInventoryChart(diamonds) {
        const inventoryData = diamonds.reduce((acc, diamond) => {
            acc[diamond.itemType] = (acc[diamond.itemType] || 0) + 1;
            return acc;
        }, {});
        const ctx = document.getElementById('inventoryChart').getContext('2d');
        if (this.charts.inventory) this.charts.inventory.destroy();
        this.charts.inventory = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(inventoryData),
                datasets: [{
                    data: Object.values(inventoryData),
                    backgroundColor: ['#ffd166', '#f4a261', '#e9c46a', '#e76f51', '#2a9d8f']
                }]
            }
        });
    }

    renderRevenueChart(invoices) {
        const monthlyRevenue = {};
        invoices.forEach(inv => {
            const month = new Date(inv.date).toLocaleString('default', { month: 'long' });
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + inv.total;
        });

        const ctx = document.getElementById('revenueChart').getContext('2d');
        if (this.charts.revenue) this.charts.revenue.destroy();
        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(monthlyRevenue),
                datasets: [{
                    label: 'Monthly Revenue',
                    data: Object.values(monthlyRevenue),
                    borderColor: '#ffd166',
                    tension: 0.1
                }]
            }
        });
    }
    
    toggleNotifications() {
        const dropdown = document.getElementById('notificationDropdown');
        dropdown.classList.toggle('show');
        if (dropdown.classList.contains('show')) {
            this.loadNotifications();
        }
    }

    loadNotifications() {
        const dropdown = document.getElementById('notificationDropdown');
        const notifications = [
            { text: "Diamond DM001 is ready for Quality Check.", time: "10 mins ago" },
            { text: "New invoice #2024-2025/001 created.", time: "1 hour ago" },
            { text: "Employee John Doe added.", time: "3 hours ago" }
        ];
        
        dropdown.innerHTML = notifications.map(n => `
            <div class="notification-item">
                <p>${n.text}</p>
                <span>${n.time}</span>
            </div>
        `).join('');
    }
}

// ===== GLOBAL FUNCTIONS FOR HTML ONCLICK EVENTS =====

function showSection(sectionId) {
    if (window.app) {
        app.showSection(sectionId);
    }
}

function showLoginForm() {
    if (window.app) {
        app.showLoginForm();
    }
}

function showRegisterForm() {
    if (window.app) {
        app.showRegisterForm();
    }
}

function showDemoLogin() {
    if (window.app) {
        app.showDemoLogin();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function showUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function logout() {
    if (window.app) {
        app.logout();
    }
}

function showAddDiamondModal() {
    if (window.app) {
        app.showModal('addDiamondModal');
        app.generateSerialNumber();
    }
}

function showAddEmployeeModal() {
    if (window.app) {
        app.showAddEmployeeModal();
    }
}

function handleAddEmployee() {
    if(window.app) {
        app.handleAddEmployee();
    }
}

function showCreateInvoiceModal() {
    if (window.app) {
        app.showCreateInvoiceModal();
    }
}


function closeModal(modalId) {
    if (window.app) {
        app.closeModal(modalId);
    }
}

function refreshDashboard() {
    if (window.app) {
        app.loadDashboardData();
        app.showToast('Dashboard refreshed!', 'success');
    }
}

function refreshWorkerDashboard() {
    if (window.app) {
        app.loadWorkerDashboardData();
        app.showToast('Dashboard refreshed!', 'success');
    }
}

function showQuickActions() {
    if (window.app) {
        app.showToast('Quick actions menu - Feature coming soon!', 'info');
    }
}

function toggleNotifications() {
    if(window.app) {
        app.toggleNotifications();
    }
}

function showUserProfile() {
    if (window.app) {
        app.showToast('User profile - Feature coming soon!', 'info');
    }
}

function showUserSettings() {
    if (window.app) {
        app.showToast('User settings - Feature coming soon!', 'info');
    }
}

function showHelp() {
    if (window.app) {
        app.showToast('Help & Support - Feature coming soon!', 'info');
    }
}

function clockInOut() {
    if (window.app) {
        app.showToast('Clock in/out feature - Feature coming soon!', 'info');
    }
}

function generateReport() {
    if (window.app) {
        app.showToast('Report generation - Feature coming soon!', 'info');
    }
}

function exportManufacturingData() {
    if (window.app) {
        app.showToast('Export functionality - Feature coming soon!', 'info');
    }
}

function filterManufacturingItems() {
    if (window.app) {
        app.showToast('Filter functionality - Feature coming soon!', 'info');
    }
}

function filterManufacturingByStatus() {
    if (window.app) {
        app.showToast('Status filter - Feature coming soon!', 'info');
    }
}

function calculatePrice() {
    const carat = parseFloat(document.getElementById('priceCarat').value) || 0;
    const cut = parseFloat(document.getElementById('priceCut').value) || 1;
    const color = parseFloat(document.getElementById('priceColor').value) || 1;
    const clarity = parseFloat(document.getElementById('priceClarity').value) || 1;
    
    if (carat > 0) {
        const price = carat * (cut + color + clarity) * 100000;
        document.getElementById('estimatedPrice').textContent = `₹${price.toLocaleString()}`;
    } else {
        document.getElementById('estimatedPrice').textContent = '₹0';
    }
}

function createInvoice() {
    if (window.app) {
        app.createInvoice();
    }
}

function addInvoiceItem() {
    if(window.app) {
        app.addInvoiceItem();
    }
}


// Initialize the application when DOM is loaded
function initializeApp() {
    console.log('🏁 Starting Diamond Manager Pro initialization...');
    window.app = new DiamondManagerPro();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    const userProfile = document.querySelector('.user-profile');
    
    if (userMenuDropdown && userProfile && !userProfile.contains(event.target)) {
        userMenuDropdown.classList.remove('show');
    }
});

// Handle escape key for modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiamondManagerPro;
}