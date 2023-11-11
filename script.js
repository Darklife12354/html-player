const audio = new Audio();
const playlist = [];
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
const timeDisplay = document.getElementById('time-display');

volumeControl.addEventListener('input', () => {
    audio.volume = parseFloat(volumeControl.value);
});

playPauseBtn.addEventListener('click', togglePlayPause);

nextBtn.addEventListener('click', () => {
    playSong((currentSongIndex + 1) % playlist.length);
});

prevBtn.addEventListener('click', () => {
    playSong((currentSongIndex - 1 + playlist.length) % playlist.length);
});

loopBtn.addEventListener('click', toggleLoop);

shuffleBtn.addEventListener('click', shufflePlaylist);

progress.parentNode.addEventListener('click', updateProgress);

uploadFolder.addEventListener('change', handleFileUpload);

uploadFolderBtn.addEventListener('click', () => {
    uploadFolder.click();
});

audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('ended', handleSongEnd);

progress.parentNode.addEventListener('mousedown', handleProgressBarDrag);

uploadFolder.addEventListener('change', handleFileUpload);

function updatePlaylist() {
    playlistContainer.innerHTML = '';
    playlist.forEach((song, index) => {
        const listItem = createPlaylistItem(song, index);
        playlistContainer.appendChild(listItem);
    });
}

function createPlaylistItem(song, index) {
    const listItem = document.createElement('div');
    listItem.classList.add('playlist-item');
    listItem.innerText = song.name;
    if (index === currentSongIndex) {
        listItem.classList.add('active');
    }
    listItem.addEventListener('click', () => {
        playSong(index);
    });
    return listItem;
}

function playSong(index) {
    if (index >= 0 && index < playlist.length) {
        currentSongIndex = index;
        audio.src = URL.createObjectURL(playlist[index]);
        audio.play();
        isPlaying = true;
        playPauseBtn.innerText = 'Pause';
        updatePlaylist();

        searchInput.value = '';
    }
}

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
    playPauseBtn.innerText = isPlaying ? 'Pause' : 'Play';
}

function toggleLoop() {
    isLooping = !isLooping;
    loopBtn.innerText = `Loop: ${isLooping ? 'On' : 'Off'}`;
    audio.loop = isLooping;
}

function shufflePlaylist() {
    playlist.sort(() => Math.random() - 0.5);
    currentSongIndex = 0;
    playSong(currentSongIndex);
}

function updateProgressBar() {
    const progressPercentage = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercentage}%`;
}

function handleSongEnd() {
    if (!isLooping) {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        playSong(currentSongIndex);
    }
}

function updateProgress(event) {
    const clickPosition = event.clientX - progress.parentNode.getBoundingClientRect().left;
    const progressBarWidth = progress.parentNode.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * audio.duration;
    audio.currentTime = seekTime;
}

function handleFileUpload() {
    const files = uploadFolder.files;
    playlist.splice(0, playlist.length, ...files);
    updatePlaylist();
    currentSongIndex = 0;
    playSong(currentSongIndex);
}

function handleProgressBarDrag(event) {
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
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

audio.addEventListener('timeupdate', () => {
    const currentTime = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);
    timeDisplay.innerText = `${currentTime} / ${duration}`;
});

const searchInput = document.createElement('input');
searchInput.setAttribute('type', 'text');
searchInput.setAttribute('id', 'searchInput');
searchInput.setAttribute('placeholder', 'Search songs...');
document.getElementById('controls-container').appendChild(searchInput);

searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase();
    const playlistItems = document.querySelectorAll('.playlist-item');

    playlistItems.forEach((item) => {
        const itemName = item.innerText.toLowerCase();

        // Check if the search term is included in the song name
        if (itemName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});