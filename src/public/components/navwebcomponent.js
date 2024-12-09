//bg-gray-800 fixed w-full z-50 mx-auto px-4 flex items-center justify-between h-16 active ml-6 flex space-x-2 px-3 py-2 
const STYLES = `
:host {
    all: initial; /* Reset all inherited styles */
    display: block; /* Ensure block-level display */
    margin: 0;
    padding: 0;
    box-sizing: border-box;
        position: relative;
    z-index: 10; /* Adjust number as needed */
}
:host * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

  .hidden { display: none; }
  .inline { display: inline; }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .h-5 { height: 1.25rem; }
  .h-6 { height: 1.5rem; }
  .h-16 { height: 4rem; }
  .w-5 { width: 1.25rem; }
  .w-64 { width: 16rem; }
  .w-full { width: 100%; }
  .h-full { height: 100%; }
  .p-6 { padding: 1.5rem; }
  .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .pt-16 { padding-top: 4rem; }
  .mt-5 { margin-top: 1.25rem; }
  .mb-4 { margin-bottom: 1rem; }
  .ml-6 { margin-left: 1.5rem; }
  .rounded { border-radius: 0.25rem; }
  .fixed { position: fixed; }
  .top-16 { top: 4rem; }
  .left-0 { left: 0; }
  .z-50 { z-index: 50; }
  .space-x-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .justify-between { justify-content: space-between; }
  .text-white { color: #ffffff; }
  .text-gray-300 { color: #d1d5db; }
  .text-gray-900 { color: #111827; }
  .font-bold { font-weight: 700; }
  .font-semibold { font-weight: 600; }
  .hover\\:text-white:hover { color: #ffffff; }
  .bg-gray-700 { background-color: #374151; }
  .bg-gray-800 { background-color: #1f2937; }
  .bg-gray-100 { background-color: #f7fafc; }
  .hover\\:bg-gray-700:hover { background-color: #374151; }
  .hover\\:text-white:hover { color: #ffffff; }
  .rounded-lg { border-radius: 0.5rem; }
  .border-0 { border-width: 0; }
  .border-gray-100 { border-color: #f7fafc; }
  .border-transparent { border-color: transparent; }
  .transparent { background-color: transparent; }
  .transition-transform { transition-property: transform; }
  .duration-300 { transition-duration: 300ms; }
  .ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
  .transform { transform: translateX(0); }
  .-translate-x-full { transform: translateX(-100%); }
  .active { font-weight: bold; border-left: 4px solid #646cff; }
  .nav-link { text-decoration: none; display: flex; align-items: center; padding: 0.5rem 1.5rem; color: #d1d5db; }
  .nav-button {
  position: relative;
  transition: all 0.3s ease;
}
@media (min-width: 640px) {
  .sm\:hidden {
    display: none !important;
  }
  .sm\:inline {
    display: inline !important;
  }
  .sm\:block {
    display: block !important;S
  }
  .sm\:flex {
    display: flex !important;
  }
  .sm\:grid {
    display: grid !important;
  }
  .sm\:items-center {
    align-items: center !important;
  }
  .sm\:px-6 {
    padding-left: 1.5rem !important; /* 24px */
    padding-right: 1.5rem !important;
  }
  .sm\:py-2 {
    padding-top: 0.5rem !important; /* 8px */
    padding-bottom: 0.5rem !important;
  }
  .sm\:hover\:bg-gray-700:hover {
    background-color: #4a5568 !important; /* Gray 700 */
  }
}
.nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
    background: transparent;
    border: none;
    border-radius: 0.25rem;
    color: #d1d5db;
    transition: color 0.2s;
}

/* Text span styles */
.nav-button-text {
    display: none; /* Hidden by default */
}

/* Icon styles */
.nav-button-icon {
    height: 1.25rem;
    width: 1.25rem;
    stroke: currentColor;
}

/* Media query for larger screens (sm and up) */
@media (min-width: 640px) {
    .nav-button {
        padding: 0.5rem 0.75rem;
    }

    .nav-button-text {
        display: inline;
        margin-left: 0.5rem;
    }

    .nav-button-icon {
        display: none; /* Hide icon on larger screens */
    }
}

.nav-button::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80%;
  height: 2px;
  background-color: #646cff;
  transition: transform 0.3s ease;
}

.nav-button.active {
  color: white;
  background-color: rgba(55, 65, 81, 0.8);
}

.nav-button.active::after {
  transform: translateX(-50%) scaleX(1);
}

.nav-link {
  position: relative;
  transition: all 0.3s ease;
}

.nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: #646cff;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-link.active {
  color: white;
  background-color: rgba(55, 65, 81, 0.8);
}

.nav-link.active::before {
  transform: scaleY(1);
}
`;

const PAGES = {
    DASHBOARD: 'dashboard',
    PROJECTS: 'projects',
    MESSAGES: 'messages',
    SETTINGS: 'settings',
    LOGIN: 'login'
  };
  
  // Helper function to generate the SVG for a given page
  function getSvgIcon(page) {
    const icons = {
      [PAGES.DASHBOARD]: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>`,
      [PAGES.PROJECTS]: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>`,
      [PAGES.MESSAGES]: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
      </svg>`,
      [PAGES.SETTINGS]: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
      </svg>`,
      [PAGES.LOGIN]: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>`
    };
  
    return icons[page] || '';
  }
  
  // Get button content (with icon and label)
  function getButtonContent(page, index) {
    return `
      <span class="nav-button-text">${page.charAt(0).toUpperCase() + page.slice(1)}</span>
      <span class="sm:hidden">
        ${getSvgIcon(page) || `<span class="font-bold">${index + 1}</span>`}
      </span>
    `;
  }
  
  // Get sidebar content (with icon and label)
  function getSidebarContent(page, index, activePage) {
    const pageName = page.charAt(0).toUpperCase() + page.slice(1);
  
    return `
      <a href="#" class="nav-link flex items-center px-6 py-2 hover:bg-gray-700 ${activePage === page ? 'active' : ''}" 
         data-page="${page}">
        ${getSvgIcon(page)}
        ${pageName}
      </a>
    `;
  }
  
  // Set active page in localStorage
  function setActivePage(page) {
    localStorage.setItem('activePage', page);
    document.dispatchEvent(new CustomEvent('page-changed', { detail: page }));
  }
  
  // Get active page from localStorage or default to DASHBOARD
  function getActivePage() {
    return localStorage.getItem('activePage') || PAGES.DASHBOARD;
  }
  
  class SideBar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.isOpen = false;
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      let toggleTimeout;
      const toggleButton = document.querySelector('[data-toggle-sidebar]');
  
      document.addEventListener('toggle-sidebar', (e) => {
        const isToggleButtonClick = e.target === toggleButton;
  
        this.isOpen = !this.isOpen;
        this.updateVisibility();
  
        if (toggleTimeout) {
          clearTimeout(toggleTimeout);
        }
  
        if (this.isOpen && !isToggleButtonClick) {
          toggleTimeout = setTimeout(() => {
            const outsideClickHandler = (e) => {
              const sidebar = this.shadowRoot.querySelector('.sidebar');
              
              if (this.isOpen && !sidebar.contains(e.target) && e.target !== toggleButton) {
                this.isOpen = false;
                this.updateVisibility();
                
                document.removeEventListener('click', outsideClickHandler);
              }
            };
  
            document.addEventListener('click', outsideClickHandler);
          }, 599);
        }
      });
  
      const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          setActivePage(link.dataset.page);
          this.updateActiveLink(link.dataset.page);
        });
      });
  
      document.addEventListener('page-changed', (e) => {
        this.updateActiveLink(e.detail);
      });
    }
  
    updateActiveLink(activePage) {
      const links = this.shadowRoot.querySelectorAll('.nav-link');
      links.forEach(link => {
        if (link.dataset.page === activePage) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  
    updateVisibility() {
      const sidebar = this.shadowRoot.querySelector('.sidebar');
      if (this.isOpen) {
        sidebar.classList.remove('-translate-x-full');
      } else {
        sidebar.classList.add('-translate-x-full');
      }
    }
  
    render() {
        const activePage = getActivePage();
        const pages = [PAGES.DASHBOARD, PAGES.PROJECTS, PAGES.MESSAGES, PAGES.SETTINGS, PAGES.LOGIN];
    
        this.shadowRoot.innerHTML = `
          <style>
            ${STYLES}
          </style>
          <div class="sidebar fixed top-16 left-0 h-full w-64 bg-gray-800 text-white transform -translate-x-full transition-transform duration-300 ease-in-out">
            <nav class="mt-5">
              ${pages.map((page, index) => getSidebarContent(page, index, activePage)).join('')}
            </nav>
            <slot name="sidebar-content"></slot> <!-- Aquí va el slot -->
          </div>
        `;
      }
  }
  
customElements.define('side-bar', SideBar);
class NavBar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      this.shadowRoot.querySelector('#menuButton').addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('toggle-sidebar'));
      });
  
      const navButtons = this.shadowRoot.querySelectorAll('.nav-button');
      navButtons.forEach(button => {
        button.addEventListener('click', () => {
          setActivePage(button.dataset.page);
          this.updateActiveButton(button.dataset.page);
        });
      });
  
      document.addEventListener('page-changed', (e) => {
        this.updateActiveButton(e.detail);
      });
    }
  
    updateActiveButton(activePage) {
      const buttons = this.shadowRoot.querySelectorAll('.nav-button');
      buttons.forEach(button => {
        if (button.dataset.page === activePage) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
    }
  
    render() {
        const activePage = getActivePage();
        const pages = [PAGES.DASHBOARD, PAGES.PROJECTS, PAGES.MESSAGES, PAGES.SETTINGS, PAGES.LOGIN];
    
        this.shadowRoot.innerHTML = `
          <style>
          
          ${STYLES}
          </style>
          <nav class="bg-gray-800 fixed w-full z-50">
            <div class="mx-auto px-4">
              <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                  <button id="menuButton" class="text-gray-300 hover:text-white transparent">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                  </button>
                  <div class="ml-6 flex space-x-2">
                    ${pages.map((page, index) => `
                      <button class="nav-button px-3 py-2 transparent border-0 rounded text-gray-300 hover:text-white ${activePage === page ? 'active' : ''}" 
                        data-page="${page}">
                        ${getButtonContent(page, index)}
                      </button>
                    `).join('')}
                  </div>
                </div>
                <div class="flex items-center">
                  <slot name="navbar-content"></slot> <!-- Aquí va el slot -->
                </div>
              </div>
            </div>
          </nav>
        `;
      }
  }
  
  customElements.define('nav-bar', NavBar);
  class MainContent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      document.addEventListener('page-changed', () => {
        this.render();
      });
    }
  
    render() {
      const activePage = getActivePage();
      const slots = {
        dashboard: '<slot name="dashboard-content">No content available for Dashboard</slot>',
        projects: '<slot name="projects-content">No content available for Projects</slot>',
        messages: '<slot name="messages-content">No content available for Messages</slot>',
        settings: '<slot name="settings-content">No content available for Settings</slot>',
        login: '<slot name="login-content">No content available for Login</slot>'
      };
  
      this.shadowRoot.innerHTML = `
        <style>
          main {
            padding-top: 4rem;
            min-height: 100vh;
            background-color: rgb(24, 24, 27);
            color: white;
          } 
          .container {
            padding: 1.5rem; /* p-6 */
          }
          .title {
            font-size: 1.875rem; /* text-3xl */
            font-weight: 700; /* font-bold */
            margin-bottom: 1rem; /* mb-4 */
          }
        </style>
        <main>
          <div class="container">
            <h1 class="title">${activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
            ${slots[activePage] || '<p>No content available</p>'}
          </div>
        </main>
      `;
    }
  }
  
  customElements.define('main-content', MainContent);
  