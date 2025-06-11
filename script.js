const timers = [
    { workTime: 25 * 60, breakTime: 5 * 60, currentTime: 25 * 60, isWorking: true, timerInterval: null, isPaused: false },
    { workTime: 10 * 60, breakTime: 5 * 60, currentTime: 10 * 60, isWorking: true, timerInterval: null, isPaused: false },
    { workTime: 15 * 60, breakTime: 5 * 60, currentTime: 15 * 60, isWorking: true, timerInterval: null, isPaused: false }
];

function updateDisplay(index) {
    const timer = timers[index];
    const timerDisplay = document.getElementById(`timer${index + 1}`);
    const statusDisplay = document.getElementById(`status${index + 1}`);
    const minutes = String(Math.floor(timer.currentTime / 60)).padStart(2, '0');
    const seconds = String(timer.currentTime % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
    statusDisplay.textContent = timer.isWorking ? '作業時間' : '休憩時間';
    const wrapper = timerDisplay.closest('.timer-wrapper');
    if(wrapper) {
        wrapper.className = 'timer-wrapper ' + (timer.isWorking ? 'working' : 'breaking');
    }
}

function startTimer(index) {
    const timer = timers[index];
    if (timer.timerInterval || timer.currentTime <= 0) return;
    timer.isPaused = false;
    timer.timerInterval = setInterval(() => {
        if (timer.currentTime > 0) {
            timer.currentTime--;
            updateDisplay(index);
        } else {
            clearInterval(timer.timerInterval);
            timer.timerInterval = null;
            const beep = document.getElementById('beep');
            beep.currentTime = 0;
            beep.play();
            flashScreen(document.getElementById(`timer${index + 1}`).closest('.timer-wrapper'));
            timer.isWorking = !timer.isWorking;
            timer.currentTime = timer.isWorking ? timer.workTime : timer.breakTime;
            updateDisplay(index);
            setTimeout(() => startTimer(index), 1000);
        }
    }, 1000);
}

function pauseTimer(index) {
    const timer = timers[index];
    if (timer.timerInterval) {
        clearInterval(timer.timerInterval);
        timer.timerInterval = null;
        timer.isPaused = true;
    }
}

function resetTimer(index) {
    pauseTimer(index);
    const timer = timers[index];
    timer.currentTime = timer.isWorking ? timer.workTime : timer.breakTime;
    timer.isPaused = false;
    updateDisplay(index);
}

function flashScreen(wrapper) {
    if (!wrapper) return;
    const orig = wrapper.style.transition;
    wrapper.style.transition = 'none';
    wrapper.style.filter = 'brightness(2)';
    setTimeout(() => {
        wrapper.style.filter = '';
        wrapper.style.transition = orig;
    }, 250);
}

// イベントリスナー設定
for(let i = 0; i < timers.length; i++) {
    document.getElementById(`startBtn${i + 1}`).addEventListener('click', () => startTimer(i));
    document.getElementById(`pauseBtn${i + 1}`).addEventListener('click', () => pauseTimer(i));
    document.getElementById(`resetBtn${i + 1}`).addEventListener('click', () => resetTimer(i));
    updateDisplay(i);
}

document.addEventListener('DOMContentLoaded', () => {
    for(let i = 0; i < timers.length; i++) {
        updateDisplay(i);
    }
});
