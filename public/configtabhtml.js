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
//tabs.addContent(3,htmlobselement); // Agrega al tercer tab
//tabs.setTabTitle(3,`${getTranslation('obs')}`);