let countdown;
let timerDisplay = document.getElementById('timer');
let playButton = document.getElementById('playButton');
let audioElements = [
    document.getElementById('audio1'),
    document.getElementById('audio2'),
    document.getElementById('audio3')
];
let volumeControls = document.querySelectorAll('.volumeControl');
let distractionCount = document.getElementById('distractionCount');
let distractionCounter = sessionStorage.getItem('distractionCounter') || 0;
let volumeChangeCounts = [0, 0, 0]; 

function startTimer(seconds) {
    clearInterval(countdown);
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);

    distractionCounter++;
    sessionStorage.setItem('distractionCounter', distractionCounter);
    updateDistractionCount();
}

function displayTimeLeft(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainderSeconds = seconds % 60;
    const display = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainderSeconds).padStart(2, '0')}`;
    timerDisplay.textContent = display;
}

playButton.addEventListener('click', () => {
    let isPlaying = !audioElements[0].paused;

    if (!isPlaying) {
        audioElements[0].volume = 0.5;

        audioElements.forEach((audio, index) => {
            if (index !== 0) {
                audio.volume = 0;
            }
        });

        audioElements.forEach(audio => {
            audio.play();
        });

        playButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioElements.forEach(audio => {
            audio.pause();
        });
        playButton.innerHTML = '<i class="fas fa-play"></i>';
    }

    distractionCounter++;
    sessionStorage.setItem('distractionCounter', distractionCounter);
    updateDistractionCount();
});

volumeControls.forEach((control, index) => {
    control.addEventListener('input', (e) => {
        let audio = document.getElementById(control.parentElement.dataset.audio);
        audio.volume = e.target.value;

        if (e.target.value > 0 && volumeChangeCounts[index] === 0) {
            volumeChangeCounts[index]++;
            distractionCounter++;
            sessionStorage.setItem('distractionCounter', distractionCounter);
            updateDistractionCount();
        }
    });
});

function updateDistractionCount() {
    distractionCount.textContent = distractionCounter;
}

window.onload = () => {
    sessionStorage.removeItem('distractionCounter');
    updateDistractionCount();
};
