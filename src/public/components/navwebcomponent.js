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
const svgs = {
  chat: `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
</svg>
`,
  image: `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>
`,
  config: `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
`,
  login: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>`,
  home: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
</svg>`,
  settings: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
  </svg>`,
  window: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
</svg>
`,
  messages: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
</svg>`,
clipboard: `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
</svg>`,
 shorts: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
 <path clip-rule="evenodd" d="m7.61 15.719.392-.22v-2.24l-.534-.228-.942-.404c-.869-.372-1.4-1.15-1.446-1.974-.047-.823.39-1.642 1.203-2.097h.001L15.13 3.59c1.231-.689 2.785-.27 3.466.833.652 1.058.313 2.452-.879 3.118l-1.327.743-.388.217v2.243l.53.227.942.404c.869.372 1.4 1.15 1.446 1.974.047.823-.39 1.642-1.203 2.097l-.002.001-8.845 4.964-.001.001c-1.231.688-2.784.269-3.465-.834-.652-1.058-.313-2.451.879-3.118l1.327-.742Zm1.993 6.002c-1.905 1.066-4.356.46-5.475-1.355-1.057-1.713-.548-3.89 1.117-5.025a4.14 4.14 0 01.305-.189l1.327-.742-.942-.404a4.055 4.055 0 01-.709-.391c-.963-.666-1.578-1.718-1.644-2.877-.08-1.422.679-2.77 1.968-3.49l8.847-4.966c1.905-1.066 4.356-.46 5.475 1.355 1.057 1.713.548 3.89-1.117 5.025a4.074 4.074 0 01-.305.19l-1.327.742.942.403c.253.109.49.24.709.392.963.666 1.578 1.717 1.644 2.876.08 1.423-.679 2.77-1.968 3.491l-8.847 4.965ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z" fill-rule="evenodd">
 </path></svg>`,
  suscription: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
  <path clip-rule="evenodd" d="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5H4Zm16.5 3h-17v11h17v-11ZM3.5 6A1.5 1.5 0 002 7.5v11A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0020.5 6h-17Zm7.257 4.454a.5.5 0 00-.757.43v4.233a.5.5 0 00.757.429L15 13l-4.243-2.546Z" fill-rule="evenodd">
  </path></svg>`
}

class AppConfig {
  static PAGES = {
    tab1: '1',
    tab2: '2',
    tab3: '3',
    tab4: '4',
    tab5: '5'
  };
  static PAGE_CONFIG = {
    [this.PAGES.tab1]: {
        label: 'Chat', 
        icon: svgs.chat
    },
    [this.PAGES.tab2]: {
        label: 'Action Events',
        icon: svgs.settings
    },
    [this.PAGES.tab3]: {
        label: 'image',
        icon: svgs.image
    },
    [this.PAGES.tab4]: {
        label: 'Settings',
        icon: svgs.config
    },
    [this.PAGES.tab5]: {
        label: 'Login',
        icon: svgs.login
    },
    
  }
  static slots = {
    1: '<slot name="1-content">No content available for Dashboard</slot>',
    2: '<slot name="2-content">No content available for Projects</slot>',
    3: '<slot name="3-content">No content available for Messages</slot>',
    4: '<slot name="4-content">No content available for Settings</slot>',
    5: '<slot name="5-content">No content available for Login</slot>'
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
         data-page="${page}">
        ${pageConfig.icon}
        ${pageConfig.label}
      </a>
    `;
  }
  static setActivePage(page) {
    localStorage.setItem('activePage', page);
    document.dispatchEvent(new CustomEvent('page-changed', { detail: page }));
  } 

  static getActivePage() {
    return localStorage.getItem('activePage') || Object.values(this.PAGES)[0];
  }
}
const pages = Object.values(AppConfig.PAGES);

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
          <nav class="mt-5">
            ${pages.map((page, index) => AppConfig.getSidebarContent(page, index, activePage)).join('')}
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
                  <button id="menuButton" class="text-gray-300 hover:text-white transparent">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                  </button>
                  <div class="ml-6 flex space-x-2">
                    ${pages.map((page, index) => `
                      <button class="nav-button px-3 py-2 transparent border-0 rounded text-gray-300 hover:text-white ${activePage === page ? 'active' : ''}" 
                        data-page="${page}">
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