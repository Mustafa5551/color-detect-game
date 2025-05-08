const board = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const highScoreDisplay = document.getElementById('highScore');
const toggleModeBtn = document.getElementById('toggleMode');

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let level = 2;
let timeLeft = 60;
let timer;

highScoreDisplay.textContent = highScore;

function generateColor(base, diff) {
  let color = base.map(v => Math.min(255, Math.max(0, v + diff)));
  return `rgb(${color.join(',')})`;
}

function generateBoard(size) {
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size}, auto)`;

  const baseColor = [random(50, 200), random(50, 200), random(50, 200)];
  const diff = Math.max(10, 60 - level * 2);
  const specialIndex = random(0, size * size - 1);
  const color = `rgb(${baseColor.join(',')})`;
  const specialColor = generateColor(baseColor, diff);

  for (let i = 0; i < size * size; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.backgroundColor = i === specialIndex ? specialColor : color;
    square.addEventListener('click', () => {
      if (i === specialIndex) {
        score++;
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('highScore', highScore);
        }
        updateScore();
        if (score % 4 === 0 && level < 8) level++;
        generateBoard(level + 1);
      } else {
        score = Math.max(0, score - 1);
        updateScore();
      }
    });
    board.appendChild(square);
  }
}

function updateScore() {
  scoreDisplay.textContent = score;
  highScoreDisplay.textContent = highScore;
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert(`انتهى الوقت! نتيجتك: ${score}`);
      resetGame();
    }
  }, 1000);
}

function resetGame() {
  score = 0;
  level = 2;
  timeLeft = 60;
  updateScore();
  timerDisplay.textContent = timeLeft;
  generateBoard(level + 1);
  startTimer();
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

toggleModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

resetGame();
