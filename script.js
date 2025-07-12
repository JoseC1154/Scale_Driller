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
let timeRemaining = 120;
let currentKey = "C";
let currentDegree = 1;
let correctAnswer = "";
let correctCount = 0;
let incorrectCount = 0;

const MAJOR_SCALE = ["1", "2", "3", "4", "5", "6", "7"];
const MINOR_SCALE = ["1", "2", "b3", "4", "5", "b6", "b7"];

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const KEYS = ["C", "F", "G", "D", "A", "E", "B", "F#", "Ab", "Bb", "Db", "Eb"];
const DEGREE_LABELS = ["1", "2", "3", "4", "5", "6", "7"];

// Enharmonic Equivalents Map
const ENHARMONIC_MAP = {
  "C#": "Db", "Db": "C#",
  "D#": "Eb", "Eb": "D#",
  "F#": "Gb", "Gb": "F#",
  "G#": "Ab", "Ab": "G#",
  "A#": "Bb", "Bb": "A#"
};

// Event Listeners
startBtn.addEventListener("click", startQuiz);
quizMode.addEventListener("change", updateSelectors);
closeQuizBtn.addEventListener("click", endQuiz);

function updateSelectors() {
  const mode = quizMode.value;
  keySelector.classList.toggle("hidden", mode !== "easy");
  degreeSelector.classList.toggle("hidden", mode !== "degree-training");
}

function startQuiz() {
  settingsCard.classList.add("hidden");
  quizCard.classList.remove("hidden");
  timeRemaining = 120;
  correctCount = 0;
  incorrectCount = 0;
  updateTimer();

  timer = setInterval(() => {
    timeRemaining--;
    updateTimer();
    if (timeRemaining <= 0) endQuiz();
  }, 1000);

  nextQuestion();
}

function nextQuestion() {
  const mode = quizMode.value;
  const scale = scaleType.value === "major" ? MAJOR_SCALE : MINOR_SCALE;

  if (mode === "easy") {
    currentKey = keySelector.value;
    currentDegree = Math.floor(Math.random() * 7) + 1;
    askDegreeInKey(scale);
  } else if (mode === "intermediate") {
    currentKey = KEYS[Math.floor(Math.random() * KEYS.length)];
    currentDegree = Math.floor(Math.random() * 7) + 1;
    askDegreeInKey(scale);
  } else if (mode === "hard") {
    correctAnswer = NOTES[Math.floor(Math.random() * NOTES.length)];
    currentDegree = Math.floor(Math.random() * 7) + 1;
    questionArea.textContent = `${correctAnswer} is the ${ordinal(currentDegree)} degree of which key?`;
    generateKeysUI(KEYS);
  } else if (mode === "degree-training") {
    currentKey = KEYS[Math.floor(Math.random() * KEYS.length)];
    currentDegree = parseInt(degreeSelector.value);
    askDegreeInKey(scale);
  }
}

function askDegreeInKey(scale) {
  const rootIndex = NOTES.indexOf(currentKey);
  const intervals = getScaleNotes(scale, rootIndex);
  correctAnswer = intervals[currentDegree - 1];
  questionArea.textContent = `What is the ${ordinal(currentDegree)} degree in the key of ${currentKey}?`;
  const choices = generateChoices(correctAnswer);
  const isPiano = document.getElementById("icon-piano").classList.contains("active");
  if (isPiano) {
    renderPianoUI(correctAnswer);
  } else {
    generateKeysUI(choices);
  }
}

function handleAnswer(selected) {
  const correct = correctAnswer;
  const isCorrect = selected === correct || ENHARMONIC_MAP[selected] === correct;

  const keys = inputUI.querySelectorAll(".white-key, .black-key, button");

  keys.forEach(key => {
    const val = key.dataset.note || key.textContent;
    if (val === correct || ENHARMONIC_MAP[val] === correct) {
      key.classList.add("correct");
    } else if (val === selected) {
      key.classList.add("incorrect");
    }
    key.style.pointerEvents = "none";
  });

  if (isCorrect) correctCount++;
  else incorrectCount++;

  setTimeout(() => nextQuestion(), 1000);
}

function getScaleNotes(scale, rootIndex) {
  const intervals = [];
  let semitoneMap = {
    "1": 0, "2": 2, "b3": 3, "3": 4, "4": 5,
    "5": 7, "b6": 8, "6": 9, "b7": 10, "7": 11
  };
  for (const degree of scale) {
    const noteIndex = (rootIndex + semitoneMap[degree]) % 12;
    intervals.push(NOTES[noteIndex]);
  }
  return intervals;
}

function generateChoices(correct) {
  const pool = new Set([correct]);
  while (pool.size < 5) {
    const rand = NOTES[Math.floor(Math.random() * NOTES.length)];
    pool.add(rand);
  }
  return shuffle([...pool]);
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

function renderPianoUI(correct) {
  inputUI.innerHTML = "";

  const whiteNotes = ["C", "D", "E", "F", "G", "A", "B"];
  const blackNotes = ["C#", "D#", null, "F#", "G#", "A#", null];
  const startOctave = 4;
  const totalKeys = 14; // C4 to B5

  for (let i = 0; i < totalKeys; i++) {
    const noteIndex = i % 7;
    const octave = startOctave + Math.floor(i / 7);
    const whiteNote = whiteNotes[noteIndex] + octave;

    const whiteKey = document.createElement("div");
    whiteKey.className = "white-key";
    whiteKey.dataset.note = whiteNotes[noteIndex];
    whiteKey.textContent = whiteNotes[noteIndex]; // Optional label
    whiteKey.addEventListener("click", () => handleAnswer(whiteNotes[noteIndex]));
    inputUI.appendChild(whiteKey);

    const black = blackNotes[noteIndex];
    if (black) {
      const blackKey = document.createElement("div");
      blackKey.className = "black-key";
      blackKey.dataset.note = black;
      blackKey.textContent = black; // Optional label
      blackKey.addEventListener("click", () => handleAnswer(black));
      whiteKey.appendChild(blackKey);
    }
  }
}

function updateTimer() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function endQuiz() {
  clearInterval(timer);
  quizCard.classList.add("hidden");

  const resultsCard = document.getElementById("results-card");
  resultsCard.classList.remove("hidden");
  resultsCard.innerHTML = `
    <div class="results-summary">
      <h2>Quiz Complete</h2>
      <p>Correct: ${correctCount}</p>
      <p>Incorrect: ${incorrectCount}</p>
      <button id="try-again-btn">Try Again</button>
    </div>
  `;

  document.getElementById("try-again-btn").addEventListener("click", () => {
    resultsCard.classList.add("hidden");
    settingsCard.classList.remove("hidden");
    inputUI.innerHTML = "";
    questionArea.textContent = "";
    timerDisplay.textContent = "2:00";
  });
}

function ordinal(n) {
  const suffix = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}