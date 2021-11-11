const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll("span");

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input Min With Today's Date
const today = new Date().toISOString().split('T')[0]; 
dateEl.setAttribute('min', today);

// Populate Countdown / Complete UI
const updateDOM = () => {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;  
    const days = Math.floor(distance / (day));
    const hours = Math.floor((distance % (day)) / (hour));
    const minutes = Math.floor((distance % (hour)) / (minute));
    const seconds = Math.floor((distance % (minute)) / second);

    // Hide Input
    inputContainer.hidden = true;

    // If the countdown is over, show complete
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} is Complete on ${countdownDate} `;
      completeEl.hidden = false;
    } else {
      // else show countdown in progress
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
}

// Take Value from Form Input
const updateCountdown = (event) => {
  event.preventDefault();
  countdownTitle = event.srcElement[0].value;
  countdownDate = event.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate
  }
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));
// Check for Valid Date
  if (countdownDate < today) {
    alert("Please Enter a Valid Date");
  } else {
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Reset All Values
const reset = () => {
  // Hide Countdowns, Show Input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  // Stop Countdown
  clearInterval(countdownActive);
  // Reset Values
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
}

const restorePreviousCountdown = () => {
  // Get countdown from localStorage if available
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On Load, check localStorage
restorePreviousCountdown();


