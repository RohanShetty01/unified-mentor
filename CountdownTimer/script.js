const dayInput = document.getElementById('day');
const hourInput = document.getElementById('hour');
const minInput = document.getElementById('min');
const secInput = document.getElementById('sec');

// Timer display elements
const dayDisplay = document.getElementById('day-display');
const hourDisplay = document.getElementById('hour-display');
const minDisplay = document.getElementById('min-display');
const secDisplay = document.getElementById('sec-display');

// Circular progress bar elements
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

let timerInterval;
let totalSeconds;
let originalSeconds;
let isPaused = false;

// Restrict inputs to numbers only
const inputs = [dayInput, hourInput, minInput, secInput];
inputs.forEach(input => {
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });
});

// Function to calculate total seconds from inputs
const calculateTotalSeconds = () => {
  const days = parseInt(dayInput.value) || 0;
  const hours = parseInt(hourInput.value) || 0;
  const minutes = parseInt(minInput.value) || 0;
  const seconds = parseInt(secInput.value) || 0;
  return (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60) + seconds;
};

// Convert seconds to the format: days, hours, minutes, seconds
const formatTime = (seconds) => {
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return { days, hours, minutes, secs };
};

// Show only relevant time units
const showRelevantUnits = (timeObj) => {
  const { days, hours, minutes, secs } = timeObj;
  document.querySelectorAll('.time-unit, .time-label').forEach(el => el.classList.remove('active'));

  if (days > 0) {
    dayDisplay.classList.add('active');
  }
  if (hours > 0 || days > 0) {
    hourDisplay.classList.add('active');
  }
  if (minutes > 0 || hours > 0 || days > 0) {
    minDisplay.classList.add('active');
  }
  secDisplay.classList.add('active');
};

// Update the circular progress bar
const setProgress = (percent) => {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
};

// Update the display of time and progress
const updateDisplay = (timeObj) => {
  dayDisplay.textContent = timeObj.days < 10 ? `0${timeObj.days}` : timeObj.days;
  hourDisplay.textContent = timeObj.hours < 10 ? `0${timeObj.hours}` : timeObj.hours;
  minDisplay.textContent = timeObj.minutes < 10 ? `0${timeObj.minutes}` : timeObj.minutes;
  secDisplay.textContent = timeObj.secs < 10 ? `0${timeObj.secs}` : timeObj.secs;

  showRelevantUnits(timeObj);

  const timeElapsed = originalSeconds - totalSeconds;
  const percentComplete = (timeElapsed / originalSeconds) * 100;
  setProgress(percentComplete);
};

// Start the timer
const startTimer = () => {
  totalSeconds = originalSeconds = calculateTotalSeconds();
  if (totalSeconds <= 0) return;

  document.querySelector('.time-input').style.display = 'none';
  document.querySelector('.progress-container').style.display = 'block';
  document.querySelector('.btns button').style.display = 'none';

  document.querySelector('.btns').innerHTML += `
    <button id="stop">STOP</button>
    <button id="reset">SET TIMER AGAIN</button>`;

  timerInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      return;
    }
    totalSeconds--;
    const timeObj = formatTime(totalSeconds);
    updateDisplay(timeObj);
  }, 1000);

  document.getElementById('stop').addEventListener('click', togglePause);
  document.getElementById('reset').addEventListener('click', resetTimer);
};

// Pause and resume functionality
const togglePause = () => {
  const stopButton = document.getElementById('stop');

  if (isPaused) {
    // Resume the timer
    stopButton.textContent = 'STOP';
    timerInterval = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        return;
      }
      totalSeconds--;
      const timeObj = formatTime(totalSeconds);
      updateDisplay(timeObj);
    }, 1000);
    isPaused = false;
  } else {
    // Pause the timer
    clearInterval(timerInterval);
    stopButton.textContent = 'RESUME';
    isPaused = true;
  }
};

// Reset the timer and go back to the input screen
const resetTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  totalSeconds = 0;
  originalSeconds = 0;

  // Reset displays
  dayDisplay.textContent = '00';
  hourDisplay.textContent = '00';
  minDisplay.textContent = '00';
  secDisplay.textContent = '00';
  setProgress(0); // Reset progress bar

  // Show the input form and hide the progress container
  document.querySelector('.time-input').style.display = 'flex';
  document.querySelector('.progress-container').style.display = 'none';

  // Remove additional buttons
  const btnsContainer = document.querySelector('.btns');
  btnsContainer.innerHTML = '<button>START</button>';

  // Reattach event listener to the start button
  document.querySelector('.btns button').addEventListener('click', startTimer);
};

// Event listener for Start button
document.querySelector('.btns button').addEventListener('click', startTimer);
