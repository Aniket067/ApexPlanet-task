const quizData = {
  web: [
    { question: "What does HTML stand for?", a: "Hyper Text Makeup Language", b: "Hyper Text Markup Language", c: "HighText Machine Language", d: "None of the above", correct: "b" },
    { question: "Which language is used for styling web pages?", a: "HTML", b: "JQuery", c: "CSS", d: "XML", correct: "c" },
    { question: "Which of these is a JavaScript framework?", a: "React", b: "HTML", c: "CSS", d: "MySQL", correct: "a" },
    { question: "Which tag is used to include JavaScript in HTML?", a: "<script>", b: "<js>", c: "<javascript>", d: "<code>", correct: "a" }
  ],
  general: [
    { question: "What is the capital of France?", a: "London", b: "Berlin", c: "Paris", d: "Madrid", correct: "c" },
    { question: "Which planet is known as the Red Planet?", a: "Earth", b: "Mars", c: "Venus", d: "Jupiter", correct: "b" },
    { question: "Which animal is known as the king of the jungle?", a: "Elephant", b: "Tiger", c: "Lion", d: "Giraffe", correct: "c" },
    { question: "Which is the largest ocean on Earth?", a: "Atlantic Ocean", b: "Indian Ocean", c: "Arctic Ocean", d: "Pacific Ocean", correct: "d" }
  ]
};

const startBtn = document.getElementById('start-btn');
const categorySelect = document.getElementById('category-select');
const startScreen = document.getElementById('start-screen');
const quizContainer = document.getElementById('quiz');
const questionEl = document.getElementById('question');
const aBtn = document.getElementById('a');
const bBtn = document.getElementById('b');
const cBtn = document.getElementById('c');
const dBtn = document.getElementById('d');
const submitBtn = document.getElementById('submit');
const resultEl = document.getElementById('result');
const progressText = document.getElementById('progress-text');
const timerEl = document.getElementById('timer');
const quizHeader = document.getElementById('quiz-header');

let currentQuiz = 0;
let score = 0;
let selected = null;
let currentData = [];
let timer;
let timeLeft = 15;

function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerEl.textContent = `${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `${timeLeft}s`;
    if (timeLeft === 0) {
      clearInterval(timer);
      autoSubmit();
    }
  }, 1000);
}

function autoSubmit() {
  if (!selected) {
    showCorrect();
  }
  submitBtn.click();
}

startBtn.addEventListener('click', () => {
  const category = categorySelect.value;
  currentData = quizData[category];
  startScreen.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  loadQuiz();
});

function loadQuiz() {
  clearSelection();
  resetTimer();
  const current = currentData[currentQuiz];
  progressText.textContent = `Question ${currentQuiz + 1} of ${currentData.length}`;
  questionEl.textContent = current.question;
  aBtn.textContent = current.a;
  bBtn.textContent = current.b;
  cBtn.textContent = current.c;
  dBtn.textContent = current.d;
  quizHeader.classList.remove('fade');
  void quizHeader.offsetWidth; // restart animation
  quizHeader.classList.add('fade');
}

function clearSelection() {
  [aBtn, bBtn, cBtn, dBtn].forEach(btn => {
    btn.style.backgroundColor = '#fff';
    btn.style.color = '#333';
    btn.classList.remove('correct', 'incorrect');
  });
  selected = null;
  resultEl.textContent = '';
}

[aBtn, bBtn, cBtn, dBtn].forEach(btn => {
  btn.addEventListener('click', () => {
    clearSelection();
    btn.style.backgroundColor = '#03a9f4';
    btn.style.color = 'white';
    selected = btn.id;
  });
});

submitBtn.addEventListener('click', () => {
  clearInterval(timer);
  if (!selected) {
    alert('Please select an answer or wait for auto-submit.');
    return;
  }

  const correctId = currentData[currentQuiz].correct;
  document.getElementById(correctId).classList.add('correct');

  if (selected !== correctId) {
    document.getElementById(selected).classList.add('incorrect');
  } else {
    score++;
  }

  setTimeout(() => {
    currentQuiz++;
    if (currentQuiz < currentData.length) {
      loadQuiz();
    } else {
      quizContainer.innerHTML = `
        <h2>You scored ${score} out of ${currentData.length}!</h2>
        <button onclick="location.reload()" class="btn">Restart</button>
      `;
    }
  }, 1200);
});
