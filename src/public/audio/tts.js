const TTS_API_ENDPOINT = 'https://api.streamelements.com/kappa/v2/speech?';
const audioPlayer1 = document.querySelector('audio-player');

let lastReadText = null;
let audioMap = {};
let audioKeys = [];
// let audio = document.getElementById('audio');
function getTTSconfig(storename = 'voicedatastore') {
    const ttsconfig = JSON.parse(localStorage.getItem(storename));
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
    const selectedCommentType = document.querySelector('input[name="comment-type"]:checked')?.value || getTTSconfig('commentsSettings').type_comments;
    let shouldRead = false;

    switch (selectedCommentType) {
        case 'any_comment':
            shouldRead = true;
            break;
        case 'dot_comment':
            shouldRead = text.startsWith('.');
            break;
        case 'interrogation_comment':
            shouldRead = text.startsWith('!');
            break;
        case 'slash_comment':
            shouldRead = text.startsWith('/');
            break;
        case 'command_comment':
            const commandPrefix = document.getElementById('command')?.value || getTTSconfig('commentsSettings').command;
            if (text.startsWith(commandPrefix)) {
                shouldRead = true;
                text = text.replace(commandPrefix, '');
            }
            break;
        default:
            shouldRead = true;
            break;
    }

    if (selectedvoicedata.selectvoiceoption === 'selectvoice2') {
        new TTS(text);
    } else {
        leerMensajes(text);
    }

    return true;
}
// Utility function to merge saved settings with default settings
function mergeSettings(defaultFields, savedSettings) {
    return defaultFields.map(fieldConfig => {
        // Create a copy of the field to avoid modifying the original
        const field = { ...fieldConfig.field };
        
        // If saved settings exist and have a value for this field
        if (savedSettings && savedSettings.hasOwnProperty(field.name)) {
            // Handle different field types
            switch (field.type) {
                case 'checkbox':
                    // Ensure it's a boolean
                    field.checked = !!savedSettings[field.name];
                    break;
                
                case 'radio':
                    // Check if saved value exists in options
                    if (field.options && field.options.some(opt => opt.value === savedSettings[field.name])) {
                        field.value = savedSettings[field.name];
                    }
                    break;
                
                case 'number':
                    // Validate number is within min/max
                    const savedValue = Number(savedSettings[field.name]);
                    if (!isNaN(savedValue)) {
                        if (field.min !== undefined && savedValue < field.min) {
                            field.value = field.min;
                        } else if (field.max !== undefined && savedValue > field.max) {
                            field.value = field.max;
                        } else {
                            field.value = savedValue;
                        }
                    }
                    break;
                
                default:
                    // For text and other types, directly assign the saved value
                    field.value = savedSettings[field.name];
            }
        }
        
        return { 
            field, 
            options: fieldConfig.options || undefined 
        };
    });
}

// Function to retrieve saved settings from localStorage
function getSavedSettings(name) {
    try {
        const savedSettings = localStorage.getItem(name);
        return savedSettings ? JSON.parse(savedSettings) : null;
    } catch (error) {
        console.error('Error retrieving settings from localStorage:', error);
        return null;
    }
}

// Modify form creation to use saved settings
function createFormWithFields(fields, name) {
    // Retrieve saved settings
    const savedSettings = getSavedSettings(name);
    // Merge saved settings with default fields
    const mergedFields = mergeSettings(fields, savedSettings);
    
    const myForm = document.createElement('dynamic-form');
    
    myForm.initialize();
    
    console.log("mergedFields",mergedFields)
    // Add fields dynamically using merged configuration
    mergedFields.forEach(fieldConfig => {
        const { field, options } = fieldConfig;
        myForm.addField(field, options);
    });
    
    return myForm;
}

// Updated setupForm function
function setupForm(form, name) {
    form.render()
        .setSubmitButton({
            label: 'Send',
            disabled: undefined,
            className: 'hidden'
        })
        .toggleDarkMode(true);
    
    // Add event listeners
    form.addEventListener('form-submit', (e) => {
        console.log('Datos modificados:', e.detail);
        console.log('¿Hay cambios?', form.hasChanges());
        localStorage.setItem(name, JSON.stringify(e.detail));
    });
    
    form.addEventListener('form-change', (e) => {
        //console.log('Form values changed:', e.detail);
        localStorage.setItem(name, JSON.stringify(e.detail));
    });
    
    return form;
}

// Configuration for the first form (User Settings)
const userSettingsFields = [
    { field: {
        type: 'checkbox',
        name: 'AllUsers',
        label: 'All Users',
        checked: true
    }},
    { field: {
        type: 'checkbox',
        name: 'followRole',
        label: 'Followers',
        checked: true
    }},
    { field: {
        type: 'checkbox',
        name: 'isSubscriber',
        label: 'isSubscriber',
        checked: true
    }},
    { field: {
        type: 'checkbox',
        name: 'isModerator',
        label: 'isModerator',
        checked: true
    }},
    { field: {
        type: 'checkbox',
        name: 'isNewGifter',
        label: 'isNewGifter',
        checked: true
    }},
    { field: {
        type: 'checkbox',
        name: 'teamMemberLevel',
        label: 'Team Members',
        checked: true
    }, options: { rowGroup: 'teamMember' }},
    { field: {
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
    }, options: { rowGroup: 'teamMember' }},
    { field: {
        type: 'checkbox',
        name: 'topGifterRank',
        label: 'Top Gifters',
        checked: true
    }, options: { rowGroup: 'topGifter' }},
    { field: {
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
    }, options: { rowGroup: 'topGifter' }}
];

// Configuration for the second form (Comments Settings)
const commentsSettingsFields = [
    { field: {
        type: 'radio',
        name: 'type_comments',
        label: 'prefix',
        options: [
            { value: 'any_comment', label: 'any comment' },
            { value: 'dot_comment', label: 'comments starting with (.)' },
            { value: 'interrogation_comment', label: 'comments starting with (?)' },
            { value: 'slash_comment', label: 'comments starting with (/)' },
            { value: 'command_comment', label: 'commands starting with :' }
        ],
        value: 'any_comment'
    }},
    { field: {
        type: 'text',
        name: 'command',
        label: 'command',
        value: '!speak'
    }}
];

// Create forms with saved settings
const myForm = createFormWithFields(userSettingsFields, 'userSettings');
const myForm2 = createFormWithFields(commentsSettingsFields, 'commentsSettings');

// Setup both forms
const configuredForm1 = setupForm(myForm, 'userSettings');
const configuredForm2 = setupForm(myForm2, 'commentsSettings');

// Append forms to DOM
document.getElementById('ttssettings').appendChild(configuredForm1);
document.getElementById('ttssettings1').appendChild(configuredForm2);
/* document.body.appendChild(myForm)
document.body.appendChild(myForm2) */

export { leerMensajes, handleleermensaje };
