

// Elements of controlbar
const songInfo = document.querySelector(".songinfo");
const masterPlay = document.getElementById("play");
const seekbar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");
const songTime = document.querySelector(".songtime");

let songIndex = 0;
let currentSong = new Audio();
let isPlaying = false;

// Songs collection
let songs = [
  { songName: "Aavan jaavan From WAR 2", filePath: "songs/Aavan Jaavan.mp3" },
  { songName: "Pardesiya From Param Sundari", filePath: "songs/Pardesiya.mp3" },
  { songName: "MF GABHRU -- Ikky", filePath: "songs/MF GABHRU.mp3" },
  { songName: "Preet Re From Dhadak2", filePath: "songs/Preet Re.mp3" },
  {songName: "Bas Ek Dhadak From Dhadak2",filePath: "songs/Bas Ek Dhadak.mp3"},
  {songName: "Saiyaara (From Saiyaara)",filePath: "songs/Saiyaara.mp3"},
];


// update song-card icon
const updateCardIcons = (playingIndex) => {
  let mainSongs = document.querySelectorAll(".song-container .song");
  mainSongs.forEach((card, index) => {
    let playIcon = card.querySelector(".play i");
    if (playIcon) {
      if (index === playingIndex && isPlaying) {
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
      } else {
        playIcon.classList.remove("fa-pause");
         playIcon.classList.add("fa-play");
      }
    }
  });
};

// update library icon

const updatelibraryIcons = (playingIndex) =>{
let songUl = document.querySelector("songlist ul");
if (!songUl) return;
Array.from(songUl.getElementsByTagName("li")).forEach((li,index) => {
  let LibraryIcons = li.querySelector(".fa-circle-play, .fa-circle-pause");
  if (LibraryIcons) {
    LibraryIcons.classList.remove("fa-circle-play");
    LibraryIcons.classList.add("fa-circle-pause");
  }else {
    LibraryIcons.classList.remove("fa-circle-play");
    LibraryIcons.classList.add("fa-circle-pause");
    
  }
});
};



// Play a song
const playMusic = (index) => {
  if (songIndex === index && isPlaying) {
    currentSong.pause();
    isPlaying = false;
    updatePlaybarIcon(false);
  } else {
    songIndex = index;
    currentSong.src = songs[index].filePath;
    currentSong.play();
    isPlaying = true;
    if (songInfo) songInfo.textContent = songs[index].songName;
    updatePlaybarIcon(true);
  }

updatelibraryIcons(index);
updateCardIcons(index);

};


// Update play/pause icon
const updatePlaybarIcon = (playing) => {
  if (masterPlay) {
    masterPlay.src = playing ? "SVG/center-pause.svg" : "SVG/center-play.svg";
  }
};

// Render Library
const LibrarySongs = () => {
  let songUl = document.querySelector(".songlist ul");
  if (!songUl) return;
  songUl.innerHTML = "";
  songs.forEach((song, index) => {
    let li = document.createElement("li");
    li.innerHTML = `<i class="fa-solid fa-music"></i> ${song.songName} <i class="fa-regular fa-circle-play"></i>`;
    li.classList.add("pointer");
    li.dataset.index = index;
    songUl.appendChild(li);
  });

  Array.from(songUl.getElementsByTagName("li")).forEach((li) => {
    li.addEventListener("click", () => playMusic(parseInt(li.dataset.index)));
  });
};

// Main song cards
function mainSongscard() {
  let mainSongs = document.querySelectorAll(".song-container .song");
  if (!mainSongs) return;
  mainSongs.forEach((card, index) => {
    card.addEventListener("click", (e) => {
      if (
        !e.target.classList.contains("fa-play") &&
        !e.target.classList.contains("fa-pause")
      ) {
        playMusic(index);
      }
    });
    let playIcon = card.querySelector(".play i");
    if (playIcon) {
      playIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        playMusic(index);
       
      });
    } 
  });
}



// Playbar controls
function playBarControl() {
  if (masterPlay) {
    masterPlay.addEventListener("click", () => {
      if (songIndex === 0 && !isPlaying) {
        playMusic(0);
      } else if (isPlaying) {
        currentSong.pause();
        isPlaying = false;
        updatePlaybarIcon(false);
      } else {
        currentSong.play();
        isPlaying = true;
        updatePlaybarIcon(true);
      }
    });
  }
  let nextBtn = document.getElementById("next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () =>
      playMusic((songIndex + 1) % songs.length)
    );
  }
  let prevBtn = document.getElementById("prev");
  if (prevBtn) {
    prevBtn.addEventListener("click", () =>
      playMusic((songIndex - 1 + songs.length) % songs.length)
    );
  }
}

// Update seekbar & time
currentSong.addEventListener("timeupdate", () => {
  if (currentSong.duration) {
    let progress = (currentSong.currentTime / currentSong.duration) * 100;
    if (circle) circle.style.left = progress + "%";

    let current = formatTime(currentSong.currentTime);
    let total = formatTime(currentSong.duration);
    if (songTime) songTime.textContent = `${current} / ${total}`;
  }
});

// Seek on click
if (seekbar) {
  seekbar.addEventListener("click", (e) => {
    let rect = seekbar.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    let percentage = clickX / rect.width;
    currentSong.currentTime = percentage * currentSong.duration;
  });
}

// Format time function
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  let mins = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  if (secs < 10) secs = "0" + secs;
  return `${mins}:${secs}`;
}

// Init
function main() {
  LibrarySongs();
  mainSongscard();
  playBarControl();
}

// When song ends → auto play next
currentSong.addEventListener("ended", () => {
  playMusic((songIndex + 1) % songs.length);
});


main();
