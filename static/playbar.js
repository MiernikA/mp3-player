let currentAlbum;
let currentPath;
let currentTitleToPrint;
let currentIndex;

const playImg = "/static/img/play_bt.png";
const puauseImg = "/static/img/pause_bt.png";
const imgPlaying = "/static/img/miniplaying.png";
const imgPlay = "/static/img/playmini.png";

function setData(path, albumInside, name) {
    currentPath = path;
    currentAlbum = albumInside.filter(item => !item.includes(".jpg"));
    currentIndex = currentAlbum.indexOf(name);
}


function updateSongColorByIndex() {

    const songLinks = document.querySelectorAll('.container .option_holder');

    songLinks.forEach((element, i) => {

        if (i === currentIndex) {
            element.children[1].classList.add('currently-playing-song');
            element.children[0].src = imgPlaying;
        } else {
            element.children[1].classList.remove('currently-playing-song');
            element.children[0].src = imgPlay;
        }

    });
}

function playSong(audioPlayer) {
    console.log('here')
    audioPlayer.src = currentPath + currentAlbum[currentIndex];
    const songNameToPrint = currentAlbum[currentIndex].replace(/\.mp3$/, '');
    const tmp = currentPath.split("/");
    const artist = tmp[tmp.length - 2].split(" - ");

    document.querySelector(".song-title").innerHTML = `<b>${songNameToPrint}</b><br><span>${artist[0]}</span>`;
    audioPlayer.play();
    isPlaying = true;
    updateSongColorByIndex(currentIndex);
}




function playBarSetUp(audioPlayer, albumInside, path, name) {

    setData(path, albumInside, name);

    const parts = path.split('/');
    const albumName = parts[parts.length - 2];
    const songNameToPrint = name.replace(/\.mp3$/, '');
    const artist = albumName.split("-");

    currentTitleToPrint = `<b>${songNameToPrint}</b><br><span>${artist[0]}</span>`;

    const currenttimeHolder = document.createElement("p");
    currenttimeHolder.textContent = "00:00 / 00:00";

    const title = document.createElement("p");
    title.className = "song-title";
    title.innerHTML = currentTitleToPrint;

    const textHolder = document.createElement("div");
    textHolder.className = "text-holder";

    const buttonHolder = document.createElement("div");
    buttonHolder.className = "button-holder";

    const playBar = document.querySelector(".play-bar");
    const slider = document.createElement("input");
    const btForward = document.createElement("img");
    const btBackward = document.createElement("img");

    btBackward.className = "controls";
    btForward.className = "controls";
    btBackward.src = "/static/img/backward_bt.png";
    btForward.src = "/static/img/forward_bt.png";


    btForward.onclick = function () {
        currentIndex = (currentIndex + 1) % currentAlbum.length;
        startStopButton.src = puauseImg;

        playSong(audioPlayer);
    };

    btBackward.onclick = function () {
        currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
        startStopButton.src = puauseImg;

        playSong(audioPlayer);
    };

    const startStopButton = document.createElement("img");
    startStopButton.src = puauseImg;
    startStopButton.className = "controls";

    startStopButton.onclick = function () {

        if (isPlaying) {
            audioPlayer.pause();
            startStopButton.src = playImg;
            isPlaying = false;
        } else {
            audioPlayer.play();
            startStopButton.src = puauseImg;
            isPlaying = true;
        }
    };

    while (playBar.firstChild) {
        playBar.removeChild(playBar.firstChild);
    }

    slider.type = "range";
    slider.min = 0;
    slider.value = 0;
    slider.disabled = true;


    audioPlayer.addEventListener('loadedmetadata', () => {
        if (audioPlayer.duration === Infinity || isNaN(Number(audioPlayer.duration))) {
            audioPlayer.currentTime = 1e101;
            audioPlayer.addEventListener('timeupdate', getDuration);
        }
    });


    function getDuration(event) {
        event.target.currentTime = 0;
        event.target.removeEventListener('timeupdate', getDuration);
        slider.max = audioPlayer.duration;
    }


    audioPlayer.addEventListener("timeupdate", function () {
        slider.value = audioPlayer.currentTime;
        const currentMin = Math.floor(audioPlayer.currentTime / 60);
        const currentSec = Math.floor(audioPlayer.currentTime - currentMin * 60);

        const endMin = Math.floor(audioPlayer.duration / 60);
        const endSec = Math.floor(audioPlayer.duration - endMin * 60);

        let minToPrint = currentMin;
        let secToPrint = currentSec;
        let minEnding = endMin;
        let secEnding = endSec;

        if (currentMin < 10) minToPrint = "0" + currentMin;
        if (currentSec < 10) secToPrint = "0" + currentSec;
        if (endMin < 10) minEnding = "0" + endMin;
        if (endSec < 10) secEnding = "0" + endSec;

        const currentTime = `${minToPrint}:${secToPrint}`;
        const endingTime = `${minEnding}:${secEnding}`;
        currenttimeHolder.textContent = `${currentTime} / ${endingTime}`;

        if (currentTime === endingTime && endMin !== NaN && endMin !== Infinity) {
            currentIndex = (currentIndex + 1) % currentAlbum.length;
            playSong(audioPlayer);
        }
    });

    audioPlayer.addEventListener("loadedmetadata", function () {
        slider.max = audioPlayer.duration;
    });

    currenttimeHolder.id = "timer";
    textHolder.appendChild(currenttimeHolder);
    textHolder.appendChild(title);

    buttonHolder.appendChild(btBackward);
    buttonHolder.appendChild(startStopButton);
    buttonHolder.appendChild(btForward);

    playBar.appendChild(slider);
    playBar.appendChild(textHolder);
    playBar.appendChild(buttonHolder);
}
