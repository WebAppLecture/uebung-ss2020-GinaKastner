export class KeyBoard {

    constructor(keysDomReference, volume, decay, osci1, osci2, detune) {
        this.audioContext = new window.AudioContext();    
        this.playingNotes = {};
        this.loadedNotes = {};
        this.generateKeyboard(keysDomReference);
        this.setupVolume(volume);
        this.setupDecay(decay);
        this.setupOscillators(osci1, osci2, detune);
    }

    setupVolume(volume) {
        this.masterGainNode = this.audioContext.createGain();
        this.masterGainNode.gain.value = .2;
        volume.value = this.masterGainNode.gain.value;
        this.masterGainNode.connect(this.audioContext.destination);
        volume.addEventListener("input", (e) => this.volume = e.target.value);
    }

    setupDecay(decay) {
        this.decayValue = decay;
        this.decayQueue = {};
        this.decayLoop();
    }

    setupOscillators(osci1, osci2, detune) {
        this.oscillatorTable = ["sine", "square", "sawtooth", "triangle"];
        this.primaryOscillators = [];
        this.secondaryOscillators = [];
        this.osci1 = "sine";
        this.osci2 = "sawtooth";
        this.detune = 0;
        osci1.value = this.oscillatorTable.indexOf(this._osci1);
        osci2.value = this.oscillatorTable.indexOf(this._osci2);
        detune.value = 0;
        osci1.addEventListener("input", (e) => this.osci1 = this.oscillatorTable[e.target.value]);
        osci2.addEventListener("input", (e) => this.osci2 = this.oscillatorTable[e.target.value]);
        detune.addEventListener("input", (e) => this.detune = 10 ** e.target.value - 1);
    }

    set volume(volume) {
        this.masterGainNode.gain.value = volume;
    }

    set osci1(type) {
        this._osci1 = type;
        this.primaryOscillators.forEach(oscillator => oscillator.type = type);
    }

    set osci2(type) {
        this._osci2 = type;
        this.secondaryOscillators.forEach(oscillator => oscillator.type = type);
    }

    set detune(cents) {
        this._detune = cents;
        this.secondaryOscillators.forEach(oscillator => oscillator.detune.setValueAtTime(cents, this.audioContext.currentTime));
    }

    generateKeyboard(keysDomReference) {
        for(let i = 2; i <= 5; i++) {
            Object.keys(Note.NOTES).forEach(noteName => {
                let note = new Note(noteName, i);
                keysDomReference.appendChild(this.generateKey(note))
            });
        }    
    }

    generateKey(note) {
        let key = document.createElement("div");
        key.classList.add("key");
        key.setAttribute("data-note", note.note);
        key.setAttribute("data-octave", note.octave);
        key.innerHTML = note.note + "<sub>" + note.octave + "</sub>";
        
        key.addEventListener("mousedown",(e) => this.enter(note, e));
        key.addEventListener("mouseup", (e) => this.leave(note, e));

        key.addEventListener("mouseenter",(e) => this.enter(note, e));
        key.addEventListener("mouseleave",(e) => this.leave(note, e));
        return key;
    }

    getSoundSource(note) {
        let oscillator = this.audioContext.createOscillator(),
            oscillator2 = this.audioContext.createOscillator(),
            gainNode = this.audioContext.createGain();
        oscillator.frequency.value = note.frequency;
        oscillator2.frequency.value = note.frequency;
        oscillator.type = this._osci1;
        oscillator2.type = this._osci2;
        
        this.primaryOscillators.push(oscillator);
        this.secondaryOscillators.push(oscillator2);
        oscillator.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        oscillator2.detune.setValueAtTime(1000, this.audioContext.currentTime);
        gainNode.gain.value = 0;
        oscillator.start();
        oscillator2.start();
        return gainNode;
    }

    play(note) {
        if(!this.loadedNotes.hasOwnProperty(note.id)) {
            this.loadedNotes[note.id] = this.getSoundSource(note);
        } 
        this.playingNotes[note.id] = true;
        delete this.decayQueue[note.id];
        this.loadedNotes[note.id].gain.value = .7;
    }

    enter(note, event) {
        if(event.button === 0 && event.which === 1) {
            event.target.classList.add("active");
            this.play(note);
        }
    }

    release(note) {
        if(this.playingNotes[note.id]) {
            this.playingNotes[note.id] = false;
            this.decayQueue[note.id] = true;
        }
    }

    leave(note, event) {
        if(event.button === 0 && event.which === 1) {
            event.target.classList.remove("active");
            this.release(note);
        }
    }

    decayLoop() {
        requestAnimationFrame(this.decayLoop.bind(this));
        if(!this.lastCalled) {
            this.lastCalled = performance.now();
            return;
        }
        let delta = (performance.now() - this.lastCalled);
        this.lastCalled = performance.now();
        Object.keys(this.decayQueue).forEach(key => {
            if(this.decayValue.value > 0 && this.loadedNotes[key].gain.value > 0) {
                this.loadedNotes[key].gain.value -= 1/(this.decayValue.value/delta);
            } else {
                this.loadedNotes[key].gain.value = 0;
                delete this.decayQueue[key];
            }           
        })
    }
}


export class Note {

    constructor(note, octave) {
        if(Note.NOTES.hasOwnProperty(note)) {
            this.note = note;      
        } else {
            console.error("Illegal value given for 'note'! Must be one of ", Object.keys(Note.NOTES));
        }
        if(octave >= 0 && octave <= 8) {
            this.octave = octave;
        } else {
            console.error("Illegal value given for 'octave'! Must be between 0 and 8!");
        }      
    }

    get frequency() {
        return Note.NOTES[this.note] * (2 ** (this.octave - 4));
    }

    get id() {
        return this.note + this.octave;
    }

    static get NOTES() {
        return {
            "C": 261.626,
            "C#": 277.183,
            "D": 293.665,
            "D#": 311.127,
            "E": 329.628,
            "F": 349.228,
            "F#": 369.994,
            "G": 391.995,
            "G#": 415.305,
            "A": 440.000,
            "A#": 466.164,
            "B": 493.883,
        };
    }

}