const square = document.querySelectorAll('.square');
const mole = document.getElementsByClassName('mole');
// const timeleft = document.getElementById('time-left');
const score = document.getElementById('score');
const resultMessage = document.getElementById('resultMessage');
const overlay = document.querySelector('.overlay');
const refreshContainer = document.getElementById('refresh-container');

let result = 0;
let moleTimer = null;

const TIME_LIMIT = 60;
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = parseInt(TIME_LIMIT/60);
const ALERT_THRESHOLD = parseInt(TIME_LIMIT*0.1);

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

const scorePrint = ()=>{
  score.textContent=result;
}

function randomSquare() {
  square.forEach(className => {
    className.classList.remove('mole');
  })
  let randomPosition = square[Math.floor(Math.random()*9)];
  randomPosition.classList.add('mole');

  hitPosition = randomPosition.id;
}

square.forEach(id=>{
  id.addEventListener('mouseup', ()=>{
    if(id.id===hitPosition){
      result+=1;
      scorePrint();
      randomSquare();
    }
  });
});

function moveMole(){
  moleTimer = setInterval(randomSquare,1000);
}

moveMole();

const refreshContainerClicked = ()=>{
  overlay.classList.toggle('displayNone');
  result=0;
  scorePrint();
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  moveMole();
  startTimer();
}

document.getElementById("timer").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

startTimer();

function onTimesUp() {
    clearInterval(timerInterval);
    clearInterval(moleTimer);
    overlay.classList.toggle('displayNone');
    resultMessage.textContent = `Game Over! Your final score is ${result}`;
    refreshContainer.addEventListener('click',refreshContainerClicked);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);
    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}