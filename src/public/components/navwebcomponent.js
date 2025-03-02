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
  .material-symbols-rounded {
    font-family: 'Material Symbols Outlined';
    font-size: 1.5rem;
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
@media (min-width: 1280px) {
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
function returniconfont(icon, page, label) {
  return `        <div class="sidebar-item" data-page="${page}" data-label="${label}">
            <span class="material-symbols-rounded">${icon}</span>
        </div>
        `;
}
class AppConfig {
  static PAGES = {
    tab1: '1',
    tab2: '2',
    tab3: '3',
    tab4: '4',
    tab5: '5',
    tab6: '6',
    tab7: '7',
  };
  static PAGE_CONFIG = {
    [this.PAGES.tab1]: {
        label: '{{sections.console}}', 
        icon: returniconfont("terminal", "console", 'console'),
        section: 'console'
    },
    [this.PAGES.tab2]: {
        label: '{{sections.fileManager}}',
        icon: returniconfont("folder", "fileManager", 'fileManager'),
        section: 'fileManager'
    },
    [this.PAGES.tab3]: {
        label: '{{sections.plugins}}',
        icon: returniconfont("extension", "plugins", 'plugins'),
        section: 'plugins'
    },
    [this.PAGES.tab4]: {
        label: '{{sections.serverSettings}}',
        icon: returniconfont("tune", "serverSettings", 'serverSettings'),
        section: 'serverSettings'
    },
    [this.PAGES.tab5]: {
        label: 'server.properties',
        icon: returniconfont("settings_ethernet", "server.properties", 'server.properties'),
        section: 'server.properties'
    },
    [this.PAGES.tab6]: {
        label: '{{sections.kubekSettings}}',  
        icon: returniconfont("settings", "kubekSettings", 'kubekSettings'),
        section: 'kubekSettings'
    },
    [this.PAGES.tab7]: {
        label: '{{sections.systemMonitor}}',
        icon: returniconfont("area_chart", "systemMonitor", 'systemMonitor'),
        section: 'systemMonitor'
    },
  }
  static getslotcontent(tabname) {
    return `<slot name="${tabname}-content">${this.PAGE_CONFIG[tabname].label}</slot>`;
  }
  static slots = {
    1: `<slot name="1-content">${this.getslotcontent(this.PAGES.tab1)}</slot>`,
    2: `<slot name="2-content">${this.getslotcontent(this.PAGES.tab2)}</slot>`,
    3: `<slot name="3-content">${this.getslotcontent(this.PAGES.tab3)}</slot>`,
    4: `<slot name="4-content">${this.getslotcontent(this.PAGES.tab4)}</slot>`,
    5: `<slot name="5-content">${this.getslotcontent(this.PAGES.tab5)}</slot>`,
    6: `<slot name="6-content">${this.getslotcontent(this.PAGES.tab6)}</slot>`,
    7: `<slot name="7-content">${this.getslotcontent(this.PAGES.tab7)}</slot>`,
    
  };
  static getSvgIcon(page) {
    return this.PAGE_CONFIG[page]?.icon || '';
  }
  static getButtonContent(page, index) {
    const pageConfig = this.PAGE_CONFIG[page];
    return `
      <span class="nav-button-text">${pageConfig.label}</span>
      <span class="sm:hidden">
        ${pageConfig.icon || `<span class="font-bold">${index + 1}</span>`}
      </span>
    `;
  }

  static getSidebarContent(page, index, activePage) {
    const pageConfig = this.PAGE_CONFIG[page];
    return `
      <a href="#" class="nav-link flex items-center px-6 py-2 hover:bg-gray-700 ${activePage === page ? 'active' : ''}" 
         data-page="${page}" data-label="${pageConfig.section}">
        ${pageConfig.icon}
        ${pageConfig.label}
      </a>
    `;
  }
  static setActivePage(page) {
    localStorage.setItem('activePage', page);
    document.dispatchEvent(new CustomEvent('page-changed', 
      { 
        detail: page

       }));
    document.dispatchEvent(new CustomEvent('section-changed',
      {
        detail: AppConfig.PAGE_CONFIG[page].section
      }));
  } 

  static getActivePage() {
    return localStorage.getItem('activePage') || Object.values(this.PAGES)[0];
  }
}
const pages = Object.values(AppConfig.PAGES);

class SideBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.isOpen = false;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const toggleButton = document.querySelector('[data-toggle-sidebar]');

    document.addEventListener('toggle-sidebar', (e) => {
      const isToggleButtonClick = e.target === toggleButton;

      this.isOpen = !this.isOpen;
      this.updateVisibility();

      if (this.isOpen && !isToggleButtonClick) {
          const outsideClickHandler = (e) => {
            const sidebar = this.shadowRoot.querySelector('.sidebar');
            
            if (this.isOpen && !sidebar.contains(e.target) && e.target !== toggleButton) {
              this.updateVisibility();
              document.removeEventListener('click', outsideClickHandler);
            }
          };

          document.addEventListener('click', outsideClickHandler);
      }
    });

    const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        AppConfig.setActivePage(link.dataset.page);
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
      const activePage = AppConfig.getActivePage();
  
      this.shadowRoot.innerHTML = `
        <style>
          ${STYLES}
        </style>
        <div class="sidebar fixed top-16 left-0 h-full w-64 bg-gray-800 text-white transform -translate-x-full transition-transform duration-300 ease-in-out">
        <slot name="sidebar-content"></slot> <!-- Aquí va el slot -->
          <nav>
            ${pages.map((page, index) => AppConfig.getSidebarContent(page, index, activePage)).join('')}
          </nav>
        </div>
      `;
    }
}

customElements.define('side-bar', SideBar);
class NavBar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open', delegatesFocus: true });
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
          AppConfig.setActivePage(button.dataset.page);
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
        const activePage = AppConfig.getActivePage();
    
        this.shadowRoot.innerHTML = `
          <style>
          
          ${STYLES}
          </style>
          <nav class="bg-gray-800 fixed w-full z-50">
            <div class="mx-auto px-4">
              <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                  <button id="menuButton" type="button" aria-label="Toggle navigation" role="button" class="text-gray-300 hover:text-white transparent">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                  </button>
                  <div class="ml-6 flex space-x-2">
                    ${pages.map((page, index) => `
                      <button class="nav-button px-3 py-2 transparent border-0 rounded text-gray-300 hover:text-white ${activePage === page ? 'active' : ''}" 
                        data-page="${page}" data-label="${AppConfig.PAGE_CONFIG[page].section}">
                        ${AppConfig.getButtonContent(page, index)}
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
    const activePage = AppConfig.getActivePage();

    this.shadowRoot.innerHTML = `
      <style>
        main {
          min-height: min(100dvh, 100%);
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
          ${AppConfig.slots[activePage] || '<p>No content available</p>'}
        </div>
      </main>
    `;
  }
}

customElements.define('main-content', MainContent);
document.addEventListener('page-changed', (e) => {
  localStorage.setItem('activePage', e.detail);
});