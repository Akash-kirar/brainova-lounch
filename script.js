const launchTime = new Date("2026-05-01T00:00:00+05:30").getTime();
const campaignStart = new Date("2026-01-01T00:00:00+05:30").getTime();

const timeParts = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

const launchStatus = document.getElementById("launch-status");
const progressBar = document.getElementById("progress-bar");
const progressLabel = document.getElementById("progress-label");
const waitlistForm = document.getElementById("waitlist-form");
const waitlistEmail = document.getElementById("waitlist-email");
const waitlistButton = document.getElementById("waitlist-button");
const waitlistMessage = document.getElementById("waitlist-message");
const waitlistStorageKey = "brainovaWaitlistEmail";

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateProgress(now) {
  const rawProgress = ((now - campaignStart) / (launchTime - campaignStart)) * 100;
  const percentage = Math.max(0, Math.min(100, rawProgress));

  progressBar.style.width = `${percentage}%`;
  progressLabel.textContent = `${Math.round(percentage)}% complete`;
}

function updateCountdown() {
  const now = Date.now();
  const difference = launchTime - now;

  updateProgress(now);

  if (difference <= 0) {
    timeParts.days.textContent = "00";
    timeParts.hours.textContent = "00";
    timeParts.minutes.textContent = "00";
    timeParts.seconds.textContent = "00";
    launchStatus.textContent = "Brainova is live. Users can now explore the app.";
    progressBar.style.width = "100%";
    progressLabel.textContent = "100% complete";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  timeParts.days.textContent = pad(days);
  timeParts.hours.textContent = pad(hours);
  timeParts.minutes.textContent = pad(minutes);
  timeParts.seconds.textContent = pad(seconds);

  launchStatus.textContent = "Counting down to Brainova on 1 May 2026 at 12:00 AM IST.";
}

function setWaitlistState(email) {
  waitlistEmail.value = email;
  waitlistButton.textContent = "Spot Reserved";
  waitlistMessage.textContent = "This browser has already saved an early-access email for Brainova.";
  waitlistMessage.classList.remove("is-error");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const savedEmail = localStorage.getItem(waitlistStorageKey);

if (savedEmail) {
  setWaitlistState(savedEmail);
}

waitlistForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = waitlistEmail.value.trim().toLowerCase();

  if (!isValidEmail(email)) {
    waitlistMessage.textContent = "Enter a valid email address to join the Brainova waitlist.";
    waitlistMessage.classList.add("is-error");
    waitlistButton.textContent = "Reserve My Spot";
    return;
  }

  localStorage.setItem(waitlistStorageKey, email);
  setWaitlistState(email);
  launchStatus.textContent = "Early access reserved. Brainova launches on 1 May 2026 at 12:00 AM IST.";
});

updateCountdown();
setInterval(updateCountdown, 1000);
