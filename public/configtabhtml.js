import { htmlvoice, htmlvoiceevents, uiElement,blueuiElement} from './features/speechconfig.js';
import { htmlminecraft } from './features/Minecraftconfig.js';
//import { htmlobselement } from './features/obcontroller.js';
import { getTranslation, translations } from './translations.js';
import socketManager , { socketurl } from "./server/socketManager.js";
const tabs = document.querySelector('custom-tabs');
socketManager.emitMessage("join-room", "sala1");
/* socketManager.onMessage("QRCode", (data) => {
    console.log("QRCode", data,socketurl.constructSocketUrl(8090));
    const localip = socketurl.constructSocketUrl(8090);
    console.log("localip",localip);
    localStorage.setItem("qrCode", data.qrCode);
    localStorage.setItem("urlToQR", data.urlToQR);

});
if (localStorage.getItem('qrCode') && localStorage.getItem('urlToQR')) {
    const htmlQRCode = document.createElement('div');
    htmlQRCode.innerHTML = generatehtmlQRCode(localStorage.getItem('qrCode'),localStorage.getItem('urlToQR'));
    tabs.addContent(4,htmlQRCode); // Agrega al cuarto tab
    tabs.setTabTitle(4,`${getTranslation('qr')}`);
}
function generatehtmlQRCode(qrCode, urlToQR) {
    const htmlQRCode = `
    <div class="qr-code-container">
        <div class="qr-code">
            <img src="${qrCode}" alt="QR Code">
        </div>
        <div class="qr-code-text">
            <p>Scan the QR code with your phone to connect to the server.</p>
            <p>URL: ${urlToQR}</p>
        </div>
    </div>
    `;
    return htmlQRCode;
} */
const filemanagerhtml = `
    <drag-and-drop></drag-and-drop>
    <grid-container id="myGrid"></grid-container>

    <div id="galeria-elementos"></div>
`
const windows = new Map();
const windowsList = document.getElementById('windowsList');

function generatedropelement() {
    const div = document.createElement('div');
    const dropzone = document.createElement('drag-and-drop');
    const GridContainer = document.createElement('grid-container');
    GridContainer.id = "myGrid";
    
    div.appendChild(dropzone);
    div.appendChild(GridContainer);
    dropzone.addEventListener('DroppedFile', (event) => {
        console.log('File dropped:', event.detail.file);
        addfilesitems(GridContainer);  
    });
    GridContainer.toggleDarkMode(true);
    GridContainer.addEventListener('itemRemoved', (event) => {
        console.log('Elemento eliminado:', event.detail.id);
    });
    GridContainer.addEventListener('itemClick', (event) => {
        console.log('Elemento clickeado:', event.detail);
        const mapconfig = mapdatatooverlay(event.detail.additionalData);
        socketManager.emitMessage('create-overlay', {mapconfig,roomId:'sala1'});
    });
    addfilesitems(GridContainer);
    return div;
}
function mapdatatooverlay(data) {
  const config = {
    template: 'multi-grid',
    content: data.nombre || data.path,
    duration: 5000,
    src: [
      {
        nombre: data.nombre,
        path: data.path,
        mediaType: data.mediaType || data.type,
      },
    ],
  };
  return config;
}
function addfilesitems(GridContainer) {
  GridContainer.clearAll();
  setTimeout(() => {
    const files = JSON.parse(localStorage.getItem('filePaths'));
    console.log(files);
    files.forEach(file => {
        GridContainer.addItem(file.nombre, file.path, file.mediaType || file.type,file);
    console.log(file)});
  }, 250);
}
tabs.addContent(0, htmlvoiceevents); // Agrega al primer tab
tabs.setTabTitle(0,`${getTranslation('chat')}`);
tabs.addContent(1,htmlvoice); // Agrega al segundo tab
tabs.setTabTitle(1,`${getTranslation('voicesettings')}`);
tabs.addContent(2,htmlminecraft); // Agrega al tercer tab
tabs.setTabTitle(2,`${getTranslation('minecraft')}`);
tabs.addContent(3,uiElement); // Agrega al tercer tab
tabs.setTabTitle(3,`${getTranslation('filterwords')}`);
tabs.addContent(4,blueuiElement); // Agrega al tercer tab
tabs.setTabTitle(4,`${getTranslation('blacklist')}`);
tabs.addContent(5,generatedropelement()); // Agrega al tercer tab
tabs.setTabTitle(5,`${getTranslation('filemanager')}`);
//tabs.addContent(3,htmlobselement); // Agrega al tercer tab
//tabs.setTabTitle(3,`${getTranslation('obs')}`);
const modalwindow = document.createElement('dynamic-form');
modalwindow.initialize()
    .addField({
        type: 'url',
        name: 'windowurl',
        label: 'url',
        value: `${window.location.href}`,
        required: true,
    })
    .addField({
        type: 'number',
        name: 'windowwidth',
        label: 'width',
        value: 800,
        required: true,
    })
    .addField({
        type: 'number',
        name: 'windowheight',
        label: 'height',
        value: 600,
        required: true,
    })
    .addField({
        type: 'checkbox',
        name: 'alwaysontop',
        label: 'alwaysOnTop',
        value: false,
    })
    .addField({
        type: 'checkbox',
        name: 'ignoremouseevents',
        label: 'ignoreMouseEvents',
        value: false,
    })
    .render();
const windowModalcontainer = document.getElementById('windowModal');
modalwindow.toggleDarkMode();
modalwindow.addEventListener('form-submit', (e) => {
console.log('Window data submitted:', e.detail);
windowModalcontainer.close();
const config = {
    url: e.detail.windowurl,
    width: e.detail.windowwidth,
    height: e.detail.windowheight,
    alwaysOnTop: e.detail.alwaysontop,
    ignoreMouseEvents: e.detail.ignoremouseevents,
  };
  socketManager.emitMessage('create-window', config);
});
modalwindow.addEventListener('form-change', (e) => {
  console.log('Form values changed:', e.detail);
});
modalwindow.setSubmitButton({ 
    label: 'create window', 
    disabled: undefined,
});
socketManager.on('window-list', (windowList) => {
    windowList.forEach(({ id, ...config }) => {
      console.log("window-list",id, config);
      windows.set(id, config);
      const card = createWindowCard(id, config);
      card.setAttribute('data-window-id', id);
      windowsList.appendChild(card);
    });
  });
socketManager.on('window-created', ({ id, config }) => {
    windows.set(id, config);
    const card = createWindowCard(id, config);
    card.setAttribute('data-window-id', id);
    windowsList.appendChild(card);
  });
socketManager.on('window-closed', (id) => {
    windows.delete(id);
    const card = document.querySelector(`[data-window-id="${id}"]`);
    if (card) {
      card.remove();
    }
  });
socketManager.on('window-updated', (data) => {
  console.log('window-updated', data);
});
function createWindowCard(id, config) {
    const card = document.createElement('div');
    card.className = 'bg-gray-800 p-4 rounded-lg';
    card.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">${config.url}</h3>
        <button class="text-red-500 hover:text-red-600" onclick="closeWindow('${id}')">
          Cerrar
        </button>
      </div>
      <div class="space-y-2">
        <label class="flex items-center">
          <input type="checkbox" ${config.alwaysOnTop ? 'checked' : ''}
                 onchange="updateWindow('${id}', 'alwaysOnTop', this.checked)"
                 class="mr-2">
          Siempre Visible
        </label>
        <label class="flex items-center">
          <input type="checkbox" ${config.transparent ? 'checked' : ''}
                 onchange="updateWindow('${id}', 'transparent', this.checked)"
                 class="mr-2">
          Transparente
        </label>
        <label class="flex items-center">
          <input type="checkbox" ${config.ignoreMouseEvents ? 'checked' : ''}
                 onchange="updateWindow('${id}', 'ignoreMouseEvents', this.checked)"
                 class="mr-2">
          Ignorar Mouse
        </label>
      </div>
    `;
    return card;
  }
  window.updateWindow = (id, property, value) => {
    const currentConfig = windows.get(id) || {};
    const newConfig = { ...currentConfig };
    newConfig[property] = value;
    
    // Actualizar el mapa local antes de enviar
    windows.set(id, newConfig);
    
    // Enviar la configuración completa, no solo la propiedad actualizada
    socketManager.emitMessage('update-window', { id, config: newConfig });
  };
  window.closeWindow = (id) => {
    socketManager.emitMessage('close-window', id);
  };
windowModalcontainer.appendChild(modalwindow);