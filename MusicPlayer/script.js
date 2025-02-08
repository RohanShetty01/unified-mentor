// Select elements
const playButton = document.querySelector(".fa-play");
const forwardButton = document.querySelector(".fa-forward");
const backwardButton = document.querySelector(".fa-backward");
const seekBarOuter = document.querySelector(".seek-bar-outer");
const seekBarInner = document.querySelector(".seek-bar-inner");
const currentTimeElement = document.querySelector(
  ".time-container p:first-child"
);
const durationTimeElement = document.querySelector(
  ".time-container p:last-child"
);
const songTitle = document.querySelector(".song-info h1");
const artistName = document.querySelector(".song-info p");
const songImage = document.querySelector(".music-image img");
const songsContainer = document.querySelector(".songs-list");
const volumeSlider = document.querySelector("#volume-control");

// Song data (example array)
const songs = [
  {
    name: "DEAF KEV - Invincible",
    artist: "Glitch Hop",
    src: "songs/Song1.mp3",
    image: "https://i1.sndcdn.com/artworks-000129642585-3h6g4n-t500x500.jpg",
    duration: "1:01",
  },
  {
    name: "Cartoon, Jéja - On & On (feat. Daniel Levi)",
    artist: "NCS",
    src: "songs/Song2.mp3",
    image:
      "https://ncsmusic.s3.eu-west-1.amazonaws.com/tracks/000/000/152/1000x0/1705340894_JZ2NifV4gB_2024---CARTOON-JEYJA---On--On-ft.-Daniel-Levi.jpg",
    duration: "3:27",
  },
];

let currentSongIndex = 0;
let isPlaying = false;
const audio = new Audio(songs[currentSongIndex].src);

// Populate the song tiles dynamically
function populateSongTiles() {
  songsContainer.innerHTML = "";
  songs.forEach((song, index) => {
    const tile = document.createElement("div");
    tile.classList.add("tile");

    const img = document.createElement("img");
    img.src = song.image;
    img.alt = song.name;

    const tileInfo = document.createElement("div");
    tileInfo.classList.add("tile-info");

    const title = document.createElement("h3");
    title.textContent = song.name;

    const artist = document.createElement("p");
    artist.textContent = song.artist;

    tileInfo.appendChild(title);
    tileInfo.appendChild(artist);
    tile.appendChild(img);
    tile.appendChild(tileInfo);
    tile.addEventListener("click", () => playSelectedSong(index));

    songsContainer.appendChild(tile);
  });
}

// Update UI with current song details
function updateSongDetails(index) {
  const song = songs[index];
  songTitle.textContent = song.name;
  artistName.textContent = song.artist;
  songImage.src = song.image;
  durationTimeElement.textContent = song.duration;
  currentTimeElement.textContent = "0:00";
  seekBarInner.style.width = "0%";
}
// Update the slider's background based on the value
function updateVolumeSliderBackground() {
  const value = volumeSlider.value;
  volumeSlider.style.setProperty("--slider-value", `${value}%`);
}
updateVolumeSliderBackground();

function adjustVolume(event) {
  audio.volume = event.target.value / 100;
}

// Play or pause the audio
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    playButton.classList.remove("fa-pause");
    playButton.classList.add("fa-play");
  } else {
    audio.play();
    playButton.classList.remove("fa-play");
    playButton.classList.add("fa-pause");
  }
  isPlaying = !isPlaying;
}

// Change to the next song
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  audio.src = songs[currentSongIndex].src;
  updateSongDetails(currentSongIndex);
  audio.play();
  isPlaying = true;
  playButton.classList.remove("fa-play");
  playButton.classList.add("fa-pause");
}

// Change to the previous song
function playPreviousSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  audio.src = songs[currentSongIndex].src;
  updateSongDetails(currentSongIndex);
  audio.play();
  isPlaying = true;
  playButton.classList.remove("fa-play");
  playButton.classList.add("fa-pause");
}

// Update the seek bar and current time
function updateSeekBar() {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  if (!isNaN(duration)) {
    const percentage = (currentTime / duration) * 100;
    seekBarInner.style.width = `${percentage}%`;

    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60)
      .toString()
      .padStart(2, "0");
    currentTimeElement.textContent = `${minutes}:${seconds}`;
  }
}

// Jump to a specific time on the seek bar
function seek(event) {
  const offsetX = event.offsetX;
  const width = seekBarOuter.offsetWidth;
  const duration = audio.duration;
  if (!isNaN(duration)) {
    const seekTime = (offsetX / width) * duration;
    audio.currentTime = seekTime;
  }
}

// Play selected song from the list
function playSelectedSong(index) {
  currentSongIndex = index;
  audio.src = songs[index].src;
  updateSongDetails(index);
  audio.play();
  isPlaying = true;
  playButton.classList.remove("fa-play");
  playButton.classList.add("fa-pause");
}

// Event listeners
playButton.addEventListener("click", togglePlay);
forwardButton.addEventListener("click", playNextSong);
backwardButton.addEventListener("click", playPreviousSong);
audio.addEventListener("timeupdate", updateSeekBar);
seekBarOuter.addEventListener("click", seek);
volumeSlider.addEventListener("input", adjustVolume);
volumeSlider.addEventListener("input", updateVolumeSliderBackground);

// Initialize the player
updateSongDetails(currentSongIndex);
populateSongTiles();
