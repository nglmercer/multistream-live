class Queue {
    constructor() {
        this.items = [];
        this.currentIndex = -1;
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        if (this.isEmpty()) {
            return "Underflow";
        }
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    getCurrent() {
        if (this.currentIndex >= 0 && this.currentIndex < this.items.length) {
            return this.items[this.currentIndex];
        }
        return null;
    }

    next() {
        if (this.currentIndex < this.items.length - 1) {
            this.currentIndex++;
            return this.getCurrent();
        }
        return null;
    }

    previous() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.getCurrent();
        }
        return null;
    }
    hasMore() {
        return this.currentIndex < this.items.length - 1;
    }
}
let isPlaying = false;

class Controlmedia {
    constructor(audioPlayer) {
        this.audioPlayer = audioPlayer;
        this.songQueue = new Queue();
    }
    nextaudio() {
        this.audioPlayer.audio.pause();
        this.audioPlayer.audio.currentTime = 0;
        if (!this.songQueue.isEmpty() && this.songQueue.next()) {
            this.playNextAudio(this.audioPlayer);
        } else {
            isPlaying = false;
        }
    }
    playNextAudio() {
        const audioUrl = this.songQueue.getCurrent();
        if (audioUrl) {
            this.audioPlayer.audio.src = audioUrl;
            this.audioPlayer.audio.load();
            this.audioPlayer.audio.play();
        }
    }
    playPreviousAudio() {
        const audioUrl = this.songQueue.previous();
        if (audioUrl) {
            this.audioPlayer.audio.src = audioUrl;
            this.audioPlayer.audio.load();
            this.audioPlayer.audio.play();
        }
    }

    addSong(audioUrl) {
        console.log('addSong', audioUrl);
        if (audioUrl) {
            this.songQueue.enqueue(audioUrl);3
            if (!isPlaying) {
                isPlaying = true;
                this.kickstartPlayer();
            }
        }
    }

    kickstartPlayer() {
        // if (this.songQueue.isEmpty()) {
        //     isPlaying = false;
        //     return;
        // }

        this.songQueue.next(); // Start at the first song
        isPlaying = true;
        this.playNextAudio(this.audioPlayer);

        this.audioPlayer.audio.onended = () => {
            this.nextaudio();
        };
    }
}
class AudioPlayer {
    constructor(audioId, onPrevious, onNext) {
      this.audio = document.getElementById(audioId);
      this.onPrevious = onPrevious;
      this.onNext = onNext;
      this.createControls();
      this.addEventListeners();
    }
    createControls() {
        const container = document.createElement('div');
        container.className = 'audio-player';
      this.audioTitle = document.createElement('div');
      this.audioTitle.className = 'audio-title';
      container.appendChild(this.audioTitle);
        this.playBtn = document.createElement('button');
        this.playBtn.innerHTML = '▶';
        this.playBtn.className = 'play-btn';
  
        this.prevBtn = document.createElement('button');
        this.prevBtn.innerHTML = '⏮';
        this.prevBtn.className = 'prev-btn';
  
        this.nextBtn = document.createElement('button');
        this.nextBtn.innerHTML = '⏭';
        this.nextBtn.className = 'next-btn';
  
        this.volumeSlider = document.createElement('input');
        this.volumeSlider.type = 'range';
        this.volumeSlider.min = 0;
        this.volumeSlider.max = 1;
        this.volumeSlider.step = 0.1;
        this.volumeSlider.value = 1;
        this.volumeSlider.className = 'volume-slider';
  
        this.progressBar = document.createElement('input');
        this.progressBar.type = 'range';
        this.progressBar.min = 0;
        this.progressBar.max = 20;
        this.progressBar.value = 0;
        this.progressBar.className = 'progress-bar';
  
        this.currentTime = document.createElement('span');
        this.currentTime.className = 'current-time';
        this.currentTime.textContent = '0:00';
  
        this.duration = document.createElement('span');
        this.duration.className = 'duration';
        this.duration.textContent = '0:00';
  
        this.volumetext = document.createElement('span');
        this.volumetext.className = 'volumetext';
        this.volumetext.textContent = '🔉';
  
  
        container.appendChild(this.progressBar);
        container.appendChild(this.currentTime);
        container.appendChild(this.duration);
      container.appendChild(this.prevBtn);
        container.appendChild(this.playBtn);
        container.appendChild(this.nextBtn);
        container.appendChild(this.volumetext);
        container.appendChild(this.volumeSlider);
  
        this.audio.parentNode.insertBefore(container, this.audio.nextSibling);
    }
  
    addEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        this.progressBar.addEventListener('input', () => this.setProgress());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.setDuration());
        this.audio.addEventListener('play', () => this.playBtn.innerHTML = '⏸');
        this.audio.addEventListener('pause', () => this.playBtn.innerHTML = '▶');
    }
  
    togglePlay() {
        if (!this.audio.src) return;
        if (this.audio.paused) {
            this.audio.play();
            this.playBtn.innerHTML = '⏸';
        } else {
            this.audio.pause();
            this.playBtn.innerHTML = '▶';
        }
    }
  
    playPrevious() {
      this.audio.pause();
      this.audio.currentTime = 0;
      if (this.onPrevious) {
        this.onPrevious();
      }
    }
  
  
    playNext() {
      this.audio.pause();
      this.audio.currentTime = 0;
      if (this.onNext) {
        this.onNext();
      }
    }
  
    setVolume() {
        if (!this.audio.src) return;
        this.audio.volume = this.volumeSlider.value;
    }
  
    setProgress() {
        if (!this.audio.src) return;
        const progress = this.progressBar.value;
        this.audio.currentTime = (progress / 100) * this.audio.duration;
    }
  
    updateProgress() {
        if (!this.audio.src) return;
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.value = progress;
        this.currentTime.textContent = this.formatTime(this.audio.currentTime);
    }
  
    setDuration() {
        if (!this.audio.src) return;
        this.duration.textContent = this.formatTime(this.audio.duration);
    }
  
    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
      setAudioInfo(title) {
      this.audioTitle.textContent = title;
    }
  }
  
export { Queue, Controlmedia, AudioPlayer };