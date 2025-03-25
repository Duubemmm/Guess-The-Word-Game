const randomButton = document.querySelector(".random-button");
const resetButton = document.querySelector(".reset-button");
const hintButton = document.querySelector(".hint-button");
const wordButtonsContainer = document.querySelector(".word-buttons");
const displayArea = document.querySelector(".display-area");
const feedbackDiv = document.querySelector(".feedback");
const triesDisplay = document.getElementById("tries");
const mistakesDisplay = document.getElementById("mistakes");
const wrongLettersDisplay = document.getElementById("wrong-letters");
const triesProgress = document.querySelector(".tries-progress");
const timerDisplay = document.getElementById("time");

const scrambledWord = [
  "blockchain",
  "cryptocurrency",
  "decentralization",
  "bitcoin",
  "ethereum",
  "staking",
  "consensus",
  "wallet",
  "privatekey",
  "mining",
  "transaction",
  "smartcontract",
  "defi",
  "token",
  "exchange",
  "coin",
  "node",
  "airdrop",
  "tokenomics",
];
let remainingWords = [...scrambledWord]; // Track remaining words
let currentWord = "";
let scrambled = "";
let userInput = "";
let currentButtonIndex = 0;
let tries = 0;
let mistakes = 0;
let wrongLetters = [];
let timeLeft = 60;
let timerInterval;
const maxMistakes = 3;
let hintCount = 0;
const maxHints = 3;

// Function to get a random word without repeating until all are used
function getRandomWord() {
  if (remainingWords.length === 0) {
    remainingWords = [...scrambledWord]; // Reset if all words used
  }
  const randomIndex = Math.floor(Math.random() * remainingWords.length);
  const word = remainingWords[randomIndex];
  remainingWords.splice(randomIndex, 1); // Remove from remaining words
  return word;
}

// Function to create buttons based on word length
function createButtons(length) {
  wordButtonsContainer.innerHTML = "";
  for (let i = 0; i < length; i++) {
    const button = document.createElement("button");
    wordButtonsContainer.appendChild(button);
  }
}

// Modify the updateButtonIndex function
function updateButtonIndex(event) {
  const key = event.key;

  if (key === "Backspace") {
    // Handle backspace
    if (currentButtonIndex > 0) {
      currentButtonIndex--;
      userInput = userInput.slice(0, -1);
      wordButtonsContainer.children[currentButtonIndex].textContent = "";
      wordButtonsContainer.children[currentButtonIndex].style.border = "";
    }
  } else if (
    focusedButtonIndex !== null ||
    currentButtonIndex < wordButtonsContainer.children.length
  ) {
    // Use focused button if available, otherwise use currentButtonIndex
    const targetIndex =
      focusedButtonIndex !== null ? focusedButtonIndex : currentButtonIndex;
    const targetButton = wordButtonsContainer.children[targetIndex];

    // Check if the key is a single character (letter)
    if (key.length === 1 && /[a-zA-Z]/.test(key)) {
      // Only allow typing in empty buttons
      if (targetButton.textContent === "") {
        targetButton.textContent = key.toLowerCase();
        userInput =
          userInput.substring(0, targetIndex) +
          key.toLowerCase() +
          userInput.substring(targetIndex + 1);

        // Move focus to next empty button
        focusedButtonIndex = null;
        targetButton.style.border = "";
        currentButtonIndex = findNextEmptyButton();

        // Check if all buttons are filled
        if (currentButtonIndex === wordButtonsContainer.children.length) {
          checkUserInput();
        }
      }
    }
  }
}

// Function to check the user's input
function checkUserInput() {
  // First, rebuild userInput from all buttons to ensure accuracy
  userInput = Array.from(wordButtonsContainer.children)
    .map((button) => button.textContent || "")
    .join("");

  if (userInput === currentWord) {
    feedbackDiv.textContent = "Correct! Well done!";
    feedbackDiv.style.color = "green";
    clearInterval(timerInterval);
    setTimeout(() => {
      generateRandomWord();
    }, 1500);
  } else {
    feedbackDiv.textContent = "Incorrect. Try again!";
    feedbackDiv.style.color = "#ff6b6b";
    mistakes++;
    mistakesDisplay.textContent = mistakes;
    wrongLetters.push(userInput);
    updateWrongLetters();

    if (mistakes >= maxMistakes) {
      feedbackDiv.textContent =
        "Game Over! You've reached the maximum number of mistakes.";
      feedbackDiv.style.color = "red";
      clearInterval(timerInterval);
    }
  }
  tries++;
  triesDisplay.textContent = tries;
  updateTriesProgress();
}

// Function to update the dotted radio button for tries
function updateTriesProgress() {
  triesProgress.innerHTML = "";
  for (let i = 0; i < tries; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot", "filled");
    triesProgress.appendChild(dot);
  }
  for (let i = tries; i < maxMistakes; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    triesProgress.appendChild(dot);
  }
}

// Function to update the wrong letters display
function updateWrongLetters() {
  wrongLettersDisplay.textContent = wrongLetters.join(", ");
}

// Function to scramble a word
function scrambleWord(word) {
  let scrambled;
  do {
    const letters = word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    scrambled = letters.join("");
  } while (scrambled === word);
  return scrambled;
}

// Function to generate and display a random word
function generateRandomWord() {
  resetGameState(); // Reset state for new word
  currentWord = getRandomWord();
  scrambled = scrambleWord(currentWord);
  displayArea.textContent = scrambled;
  createButtons(currentWord.length);
  setupButtonClicks();
  startTimer(); // Start new timer for current word
}

// Function to reset game state for new word
function resetGameState() {
  userInput = "";
  currentButtonIndex = 0;
  Array.from(wordButtonsContainer.children).forEach((button) => {
    button.textContent = "";
  });
  feedbackDiv.textContent = "";
  tries = 0;
  mistakes = 0;
  wrongLetters = [];
  triesDisplay.textContent = tries;
  mistakesDisplay.textContent = mistakes;
  wrongLettersDisplay.textContent = "";
  hintCount = 0;
  timeLeft = 60;
  timerDisplay.textContent = timeLeft;
  updateTriesProgress();
}

// Function to start the timer
function startTimer() {
  clearInterval(timerInterval); // Clear any existing timer
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      feedbackDiv.textContent = "Time's up! Game over.";
      feedbackDiv.style.color = "red";
    }
  }, 1000);
}

// Update the provideHint function
function provideHint() {
  if (hintCount >= maxHints) {
    feedbackDiv.textContent = "No more hints available!";
    feedbackDiv.style.color = "red";
    return;
  }

  const emptyIndices = [];
  Array.from(wordButtonsContainer.children).forEach((button, index) => {
    if (button.textContent === "") {
      emptyIndices.push(index);
    }
  });

  if (emptyIndices.length > 0) {
    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const correctLetter = currentWord[randomIndex];

    // Update both the button display AND userInput
    wordButtonsContainer.children[randomIndex].textContent = correctLetter;
    userInput =
      userInput.substring(0, randomIndex) +
      correctLetter +
      userInput.substring(randomIndex + 1);

    hintCount++;

    // Create popup animation
    const hintPopup = document.createElement("div");
    hintPopup.textContent = correctLetter;
    hintPopup.classList.add("hint-popup");
    wordButtonsContainer.children[randomIndex].appendChild(hintPopup);

    setTimeout(() => {
      hintPopup.remove();
    }, 1000);

    // Check if all letters are now filled
    currentButtonIndex = findNextEmptyButton();
    if (currentButtonIndex === wordButtonsContainer.children.length) {
      checkUserInput();
    }
  }
}

// Function to reset the game completely
function resetGame() {
  clearInterval(timerInterval);
  generateRandomWord(); // Generate new word on reset
}

// Event listeners
document.addEventListener("keydown", updateButtonIndex);
randomButton.addEventListener("click", resetGame); // Reset on random button
resetButton.addEventListener("click", resetGame);
hintButton.addEventListener("click", provideHint);

// Initial load
generateRandomWord();

// Track currently focused button
let focusedButtonIndex = null;

// Function to handle button clicks
function setupButtonClicks() {
  Array.from(wordButtonsContainer.children).forEach((button, index) => {
    button.addEventListener("click", () => {
      // Only allow focusing on empty buttons
      if (button.textContent === "") {
        focusedButtonIndex = index;
        // Highlight the focused button
        button.style.border = "2px solid #4caf50";
        // Remove highlight from other buttons
        Array.from(wordButtonsContainer.children).forEach((btn, i) => {
          if (i !== index) btn.style.border = "";
        });
      }
    });
  });
}

// Helper function to find next empty button
function findNextEmptyButton() {
  for (let i = 0; i < wordButtonsContainer.children.length; i++) {
    if (wordButtonsContainer.children[i].textContent === "") {
      return i;
    }
  }
  return wordButtonsContainer.children.length;
}
