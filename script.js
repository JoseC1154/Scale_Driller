// DOM Elements
const startBtn = document.getElementById("start-btn");
const settingsCard = document.getElementById("settings-card");
const quizCard = document.getElementById("quiz-card");
const quizMode = document.getElementById("quiz-mode");
const keySelector = document.getElementById("key-selector");
const degreeSelector = document.getElementById("degree-selector");
const scaleType = document.getElementById("scale-type");
const questionArea = document.getElementById("question-area");
const inputUI = document.getElementById("input-ui");
const closeQuizBtn = document.getElementById("close-quiz");
const timerDisplay = document.getElementById("timer");
const helpBtn = document.getElementById("help-btn");

let timer;
let timeRemaining = 120; // 2 minutes

// Event Listeners
startBtn.addEventListener("click", startQuiz);
quizMode.addEventListener("change", updateSelectors);
closeQuizBtn.addEventListener("click", endQuiz);

function updateSelectors() {
  const mode = quizMode.value;
  const isDegreeTraining = mode === "degree-training";
  const isEasy = mode === "easy";

  keySelector.classList.toggle("hidden", !isEasy);
  degreeSelector.classList.toggle("hidden", !isDegreeTraining);
}

function startQuiz() {
  settingsCard.classList.add("hidden");
  quizCard.classList.remove("hidden");
  timeRemaining = 120;
  updateTimer();
  timer = setInterval(() => {
    timeRemaining--;
    updateTimer();
    if (timeRemaining <= 0) {
      endQuiz();
    }
  }, 1000);

  // For now, placeholder question
  questionArea.textContent = "What is the 3rd degree in the key of C?";
  generateKeysUI(["E", "F", "G", "A", "B"]);
}

function generateKeysUI(choices) {
  inputUI.innerHTML = "";
  choices.forEach(note => {
    const btn = document.createElement("button");
    btn.textContent = note;
    btn.addEventListener("click", () => handleAnswer(note));
    inputUI.appendChild(btn);
  });
}

function handleAnswer(selected) {
  // Placeholder logic for now
  const correct = "E";
  Array.from(inputUI.children).forEach(btn => {
    if (btn.textContent === correct) {
      btn.style.backgroundColor = "green";
    } else if (btn.textContent === selected) {
      btn.style.backgroundColor = "red";
    }
    btn.disabled = true;
  });
}

function updateTimer() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function endQuiz() {
  clearInterval(timer);
  settingsCard.classList.remove("hidden");
  quizCard.classList.add("hidden");
  inputUI.innerHTML = "";
  questionArea.textContent = "";
  timerDisplay.textContent = "2:00";
}