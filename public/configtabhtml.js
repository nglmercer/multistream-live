import { htmlvoice, htmlvoiceevents, uiElement,blueuiElement} from './features/speechconfig.js';
import { htmlminecraft } from './features/Minecraftconfig.js';
//import { htmlobselement } from './features/obcontroller.js';
import { getTranslation, translations } from './translations.js';
//import socketManager , { socketurl } from "./server/socketManager.js";
const tabs = document.querySelector('custom-tabs');

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
function generatedropelement() {
    const div = document.createElement('div');
    const dropzone = document.createElement('drag-and-drop');
    const GridContainer = document.createElement('grid-container');
    GridContainer.id = "myGrid";
    
    div.appendChild(dropzone);
    div.appendChild(GridContainer);
    dropzone.addEventListener('DroppedFile', (event) => {
        console.log('File dropped:', event.detail.file);
        addfilesitems();  
    });
    function addfilesitems() {
        GridContainer.clearAll();
      setTimeout(() => {
        const files = JSON.parse(localStorage.getItem('filePaths'));
        console.log(files);
        files.forEach(file => {
            GridContainer.addItem(file.nombre, file.path, file.mediaType || file.type,file);
        console.log(file)});
      }, 250);
    }
    GridContainer.toggleDarkMode(true);
    GridContainer.addEventListener('itemRemoved', (event) => {
        console.log('Elemento eliminado:', event.detail.id);
    });
    GridContainer.addEventListener('itemClick', (event) => {
        console.log('Elemento clickeado:', event.detail);
        const mapconfig = mapdatatooverlay(event.detail.additionalData);
        //socket.emit('create-overlay', {mapconfig,roomId:'sala1'});
    });
    function mapdatatooverlay(data) {
      console.log(data);
      const config = {
        type: data.type.includes('video') ? 'video' : 'image',
        content: data.path,
        text: data.nombre,
        duration: 5000
      };
      return config;
    }
    addfilesitems();
    return div;
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
console.log('Window created:', e.detail);
windowModalcontainer.close();
});
modalwindow.addEventListener('form-change', (e) => {
  console.log('Form values changed:', e.detail);
});
modalwindow.setSubmitButton({ 
    label: 'create window', 
    disabled: undefined,
});
windowModalcontainer.appendChild(modalwindow);