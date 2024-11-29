const TTS_API_ENDPOINT = 'https://api.streamelements.com/kappa/v2/speech?';
const audioPlayer1 = document.querySelector('audio-player');

let lastReadText = null;
let audioMap = {};
let audioKeys = [];
// let audio = document.getElementById('audio');
function getTTSconfig() {
    const ttsconfig = JSON.parse(localStorage.getItem('voicedatastore'));
    console.log("ttsconfig",ttsconfig);
    return ttsconfig;
}
async function fetchAudio(txt) {
    try {
        if (txt === lastReadText) {
            return;
        }

        lastReadText = txt;

        if (audioMap[txt]) {
            return audioMap[txt];
        }

        const params = new URLSearchParams({
            voice: getTTSconfig().voice1.selectvoice || 'Conchita',
            text: txt
        });

        const resp = await fetch(TTS_API_ENDPOINT + params.toString());
        if (resp.status !== 200) {
            console.error("Mensaje incorrecto, status code:", resp.status);
            return;
        }

        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);

        audioMap[txt] = blobUrl;
        audioKeys.push(txt);

        return blobUrl;
    } catch (error) {
        console.error("Error fetchAudio:", error);
    }
}

const speaktext = document.getElementById('speaktext');
const speakbutton = document.getElementById('speakbutton');
speakbutton.addEventListener('click', () => {
    leerMensajes(speaktext.value);
});
function leerMensajes(text) {
    console.log('leerMensajes', text);
    if (text) {
        fetchAudio(text).then(audioUrl => {
          if (getTTSconfig().voice1.audioQueue) {
            audioPlayer1.addToQueue(audioUrl);
          } else {
            audioPlayer1.addToQueue(audioUrl);

//       const newaudio = new Audio(audioUrl);
    //        newaudio.play();
          }
        });
    }
}
export class TTS {
    constructor(message) {
        this.speak(message);
        this.config = getTTSconfig();
    }

    async speak(message) {
        console.log('TTS speak', message);
        const voices = speechSynthesis.getVoices();
        console.log("voices", voices);
        this.config = getTTSconfig();
        let voiceSelect = this.config.voice2.selectvoice;
        let selectedVoice = voices.find(voice => voice.name === voiceSelect);

        if (this.config.voice2.Randomvoice || !selectedVoice) {
            selectedVoice = setRandomVoice(voices);
        }
        // el simbolo para que sea este o este es // no tengo en mi teclado pero es el simbolo de la barra diagonal
        // if (!selectedVoice or !this.config ) return; en este ejemplo or es || y no ||

        let speed = this.config.voice2.defaultspeed;
        if (this.config.voice2.randomspeed) {
            speed = setRandomSpeed();
        }

        let pitch = this.config.voice2.defaultpitch;
        if (this.config.voice2.randompitch) {
            pitch = setRandomPitch();
        }

        const volume = this.config.voice2.volume;

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.voice = selectedVoice;
        utterance.rate = parseFloat(speed);
        utterance.pitch = parseFloat(pitch);
        utterance.volume = parseFloat(volume);

        console.log('utterance options', utterance);
        window.speechSynthesis.speak(utterance);

        // try {
        //     const audioUrl = await recordSpeechAndGetTTS(message, utterance);
        //     console.log('audioUrl', audioUrl);
        //     // Aquí puedes hacer algo con audioUrl, como reproducirlo o guardarlo
        // } catch (error) {
        //     console.error('Error recording speech:', error);
        // }
    }
}

function setRandomVoice(voices) {
    const randomIndex = Math.floor(Math.random() * voices.length);
    return voices[randomIndex];
}

function setRandomSpeed() {
    return (Math.random() * (1.5 - 0.5) + 0.5).toFixed(1);
}

function setRandomPitch() {
    return (Math.random() * (1.5 - 0.5) + 0.5).toFixed(1);
}
async function handleleermensaje(text) {
    const selectedvoicedata = getTTSconfig();
    console.log("newselectedVoice",selectedvoicedata);
    const selectedCommentType = document.querySelector('input[name="comment-type"]:checked').value;
    let shouldRead = false;

    switch (selectedCommentType) {
        case 'any-comment':
            shouldRead = true;
            break;
        case 'dot-comment':
            shouldRead = text.startsWith('.');
            break;
        case 'slash-comment':
            shouldRead = text.startsWith('/');
            break;
        case 'command-comment':
            const commandPrefix = document.getElementById('command').value;
            if (text.startsWith(commandPrefix)) {
                shouldRead = true;
                text = text.replace(commandPrefix, '');
            }
            break;
    }

    if (selectedvoicedata.selectvoiceoption === 'selectvoice2') {
        new TTS(text);
    } else {
        leerMensajes(text);
    }

    return true;
}
const myForm = document.createElement('dynamic-form');
myForm.initialize()
    .addField({
        type: 'checkbox',
        name: 'AllUsers',
        label: 'All Users',
        checked: true,
    })
    .addField({
        type: 'checkbox',
        name: 'followRole',
        label: 'Followers',
        checked: true,
    })
    .addField({
        type: 'checkbox',
        name: 'isSubscriber',
        label: 'isSubscriber',
        checked: true,
    })
    .addField({
        type: 'checkbox',
        name: 'isModerator',
        label: 'isModerator',
        checked: true,
    })
    .addField({
        type: 'checkbox',
        name: 'isNewGifter',
        label: 'isNewGifter',
        checked: true,
    })
    .addField({
        type: 'checkbox',
        name: 'teamMemberLevel',
        label: 'Team Members',
        checked: true,
    }, { rowGroup: 'teamMember' })
    .addField({
        type: 'number',
        name: 'teamMemberLevel_value',
        placeholder: 'Min. lvl',
        min: 0,
        max: 3,
        value: 1,
        showWhen: {
            field: 'teamMemberLevel',
            value: true
        }
    }, { rowGroup: 'teamMember' })
    .addField({
        type: 'checkbox',
        name: 'topGifterRank',
        label: 'Top Gifters',
        checked: true,
    }, { rowGroup: 'topGifter' })
    .addField({
        type: 'number',
        name: 'topGifterRank_value',
        placeholder: 'Top',
        min: 0,
        max: 3,
        value: 3,
        showWhen: {
            field: 'topGifterRank',
            value: true
        }
    }, { rowGroup: 'topGifter' })
myForm.render()
    .setSubmitButton({ 
        label: 'Send', 
        disabled: undefined,
        className: 'hidden'
    });
/* myForm.setInitialState({
    AllUsers: true,
    followRole: true,
    isSubscriber: true,
    isModerator: true,
    isNewGifter: true,
    teamMemberLevel: true,
    teamMemberLevel_value: 1,
    topGifterRank: true,
    topGifterRank_value: 3,
}); */

const myForm2 = document.createElement('dynamic-form');

myForm2.initialize()
    .addField({
        type: 'radio',
        name: 'type_comments',
        label: 'prefix',
        options: [
            { value: 'any comment', label: 'any comment' },
            { value: 'dot_comment', label: 'comments starting with (.)' },
            { value: 'interrogation_comment', label: 'comments starting with (?)' },
            { value: 'slash_comment', label: 'comments starting with (/)' },
            { value: 'command_comment', label: 'commands starting with :' },
        ],
        value: 'any comment',
    })
    .addField({
        type: 'text',
        name: 'command',
        label: 'command',
        value: '!speak',
    })
    .render()
    .setSubmitButton({ 
        label: 'Send', 
        disabled: undefined,
        className: 'hidden'
    });
myForm.addEventListener('form-submit', (e) => {
    console.log('Datos modificados:', e.detail);
    console.log('¿Hay cambios?', myForm.hasChanges());
});
myForm2.addEventListener('form-submit', (e) => {
    console.log('Datos modificados:', e.detail);
    console.log('¿Hay cambios?', myForm2.hasChanges());
});
myForm2.addEventListener('form-change', (e) => {
    console.log('Form values changed:', e.detail);
});
myForm.addEventListener('allchanges', (e) => {
    console.log('Datos modificados:', e.detail);
    console.log('¿Hay cambios?', myForm.hasChanges());
});
myForm.addEventListener('form-change', (e) => {
    console.log('Form values changed:', e.detail);
});
myForm2.toggleDarkMode(true);
myForm.toggleDarkMode(true);
document.getElementById('ttssettings').appendChild(myForm);
document.getElementById('ttssettings1').appendChild(myForm2);
/* document.body.appendChild(myForm)
document.body.appendChild(myForm2) */

export { leerMensajes, handleleermensaje };
