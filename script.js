const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let currentTime = WORK_TIME;
let isWorking = true;
let timerInterval = null;
let isPaused = false;

const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const beep = document.getElementById('beep');

function updateDisplay() {
    const minutes = String(Math.floor(currentTime / 60)).padStart(2, '0');
    const seconds = String(currentTime % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
    statusDisplay.textContent = isWorking ? '作業時間' : '休憩時間';
    document.body.className = isWorking ? 'working' : 'breaking';
}

function startTimer() {
    if (timerInterval || currentTime <= 0) return;
    isPaused = false;
    timerInterval = setInterval(() => {
        if (currentTime > 0) {
            currentTime--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            beep.currentTime = 0;
            beep.play();
            flashScreen();
            isWorking = !isWorking;
            currentTime = isWorking ? WORK_TIME : BREAK_TIME;
            updateDisplay();
            setTimeout(startTimer, 1000);
        }
    }, 1000);
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
    }
}

function resetTimer() {
    pauseTimer();
    currentTime = isWorking ? WORK_TIME : BREAK_TIME;
    isPaused = false;
    updateDisplay();
}

function flashScreen() {
    const orig = document.body.style.transition;
    document.body.style.transition = 'none';
    document.body.style.filter = 'brightness(2)';
    setTimeout(() => {
        document.body.style.filter = '';
        document.body.style.transition = orig;
    }, 250);
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

document.addEventListener('DOMContentLoaded', updateDisplay);
updateDisplay();
