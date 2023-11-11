
const audio = new Audio();
let playlist = [];
let currentSongIndex = 0;
let isPlaying = false;
let isLooping = false;

const progress = document.getElementById('progress-bar');
const playPauseBtn = document.getElementById('playPauseBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const loopBtn = document.getElementById('loopBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const uploadFolder = document.getElementById('uploadFolder');
const playlistContainer = document.getElementById('playlist-container');
const uploadFolderBtn = document.getElementById('uploadFolderBtn');
const volumeControl = document.getElementById('volumeControl');

volumeControl.addEventListener('input', () => {
    audio.volume = parseFloat(volumeControl.value);
});
function updatePlaylist() {
    playlistContainer.innerHTML = '';
    playlist.forEach((song, index) => {
        const listItem = document.createElement('div');
        listItem.classList.add('playlist-item');
        listItem.innerText = song.name;
        if (index === currentSongIndex) {
            listItem.classList.add('active');
        }
        listItem.addEventListener('click', () => {
            playSong(index);
        });
        playlistContainer.appendChild(listItem);
    });
}

function playSong(index) {
    if (index >= 0 && index < playlist.length) {
        currentSongIndex = index;
        audio.src = URL.createObjectURL(playlist[index]);
        audio.play();
        isPlaying = true;
        playPauseBtn.innerText = 'Pause';
        updatePlaylist();
    }
}

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playPauseBtn.innerText = 'Play';
    } else {
        audio.play();
        isPlaying = true;
        playPauseBtn.innerText = 'Pause';
    }
});

nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    playSong(currentSongIndex);
});

prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    playSong(currentSongIndex);
});

loopBtn.addEventListener('click', () => {
    isLooping = !isLooping;
    loopBtn.innerText = `Loop: ${isLooping ? 'On' : 'Off'}`;
    audio.loop = isLooping;
});

shuffleBtn.addEventListener('click', () => {
    playlist.sort(() => Math.random() - 0.5);
    currentSongIndex = 0;
    playSong(currentSongIndex);
});

audio.addEventListener('timeupdate', () => {
    const progressPercentage = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercentage}%`;
});
audio.addEventListener('ended', () => {
    if (!isLooping) {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        playSong(currentSongIndex);
    }
});
progress.parentNode.addEventListener('click', (event) => {
    const clickPosition = event.clientX - progress.parentNode.getBoundingClientRect().left;
    const progressBarWidth = progress.parentNode.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * audio.duration;
    audio.currentTime = seekTime;
});

uploadFolder.addEventListener('change', () => {
    const files = uploadFolder.files;
    playlist = Array.from(files);
    updatePlaylist();
    currentSongIndex = 0;
    playSong(currentSongIndex);
});

uploadFolderBtn.addEventListener('click', () => {
    uploadFolder.click();
});

uploadFolder.addEventListener('change', () => {
    const files = uploadFolder.files;
    playlist = Array.from(files);
    updatePlaylist();
    currentSongIndex = 0;
    playSong(currentSongIndex);
});

const timeDisplay = document.getElementById('time-display');

audio.addEventListener('timeupdate', () => {
    const currentTime = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);
    timeDisplay.innerText = `${currentTime} / ${duration}`;
});

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

progress.parentNode.addEventListener('mousedown', (event) => {
    const onMouseMove = (moveEvent) => {
        const clickPosition = moveEvent.clientX - progress.parentNode.getBoundingClientRect().left;
        const progressBarWidth = progress.parentNode.clientWidth;
        const seekTime = (clickPosition / progressBarWidth) * audio.duration;
        audio.currentTime = seekTime;
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});