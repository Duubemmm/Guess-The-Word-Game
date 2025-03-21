const randomButton = document.querySelector('.random-button');
const resetButton = document.querySelector('.reset-button');
const hintButton = document.querySelector('.hint-button');
const wordButtonsContainer = document.querySelector('.word-buttons');
const displayArea = document.querySelector('.display-area');
const feedbackDiv = document.querySelector('.feedback');
const triesDisplay = document.getElementById('tries');
const mistakesDisplay = document.getElementById('mistakes');
const timerDisplay = document.getElementById('time');

const scrambledWord = [
    "flowers", "light", "water", "trees", "birds", "butterfly", 
    "rain", "clouds", "sun", "moon", "stars", "mountains", "beach"
];

let currentWord = "";
let scrambled = "";
let userInput = "";
let currentButtonIndex = 0;
let tries = 0;
let mistakes = 0;
let timeLeft = 60;
let timerInterval;
const maxMistakes = 3;

// Function to create buttons based on word length
function createButtons(length) {
    wordButtonsContainer.innerHTML = ""; // Clear existing buttons
    for (let i = 0; i < length; i++) {
        const button = document.createElement('button');
        wordButtonsContainer.appendChild(button);
    }
}

// Function to update button text based on user input
function updateButtonIndex(event) {
    const key = event.key;

    if (key === "Backspace") {
        // Handle backspace
        if (currentButtonIndex > 0) {
            currentButtonIndex--;
            userInput = userInput.slice(0, -1); // Remove the last character
            wordButtonsContainer.children[currentButtonIndex].textContent = ""; // Clear the button
        }
    } else if (currentButtonIndex < wordButtonsContainer.children.length) {
        // Check if the key is a single character (letter)
        if (key.length === 1 && /[a-zA-Z]/.test(key)) {
            wordButtonsContainer.children[currentButtonIndex].textContent = key.toLowerCase(); // Update the button text
            userInput += key.toLowerCase(); // Add the key to the user's input
            currentButtonIndex++; // Move to the next button

            // Check if all buttons are filled
            if (currentButtonIndex === wordButtonsContainer.children.length) {
                checkUserInput(); // Check if the user's input matches the original word
            }
        }
    }
}

// Function to check the user's input
function checkUserInput() {
    if (userInput === currentWord) {
        feedbackDiv.textContent = "Correct! Well done!";
        feedbackDiv.style.color = "green";
        tries++;
        triesDisplay.textContent = tries;
        generateRandomWord(); // Generate a new word
    } else {
        feedbackDiv.textContent = "Incorrect. Try again!";
        feedbackDiv.style.color = "red";
        mistakes++;
        mistakesDisplay.textContent = mistakes;

        // Check if the user has reached the maximum number of mistakes
        if (mistakes >= maxMistakes) {
            feedbackDiv.textContent = "Game Over! You've reached the maximum number of mistakes.";
            feedbackDiv.style.color = "red";
            resetGame();
        }
    }
}

// Function to scramble a word
function scrambleWord(word) {
    const letters = word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join("");
}

// Function to generate and display a random word
function generateRandomWord() {
    const randomIndex = Math.floor(Math.random() * scrambledWord.length);
    currentWord = scrambledWord[randomIndex];
    scrambled = scrambleWord(currentWord);
    displayArea.textContent = scrambled;
    createButtons(currentWord.length); // Create buttons based on word length
    resetButtons();
}

// Function to reset the buttons
function resetButtons() {
    userInput = "";
    currentButtonIndex = 0;
    Array.from(wordButtonsContainer.children).forEach(button => {
        button.textContent = "";
    });
    feedbackDiv.textContent = "";
}

// Function to reset the game
function resetGame() {
    resetButtons();
    displayArea.textContent = "";
    tries = 0;
    mistakes = 0;
    triesDisplay.textContent = tries;
    mistakesDisplay.textContent = mistakes;
    feedbackDiv.textContent = "Game reset. Ready for a new word!";
    feedbackDiv.style.color = "blue";
    clearInterval(timerInterval);
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    startTimer();
}

// Function to start the timer
function startTimer() {
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

// Function to provide a hint
function provideHint() {
    const emptyButtonIndex = Array.from(wordButtonsContainer.children).findIndex(
        button => button.textContent === ""
    );
    if (emptyButtonIndex !== -1) {
        const correctLetter = currentWord[emptyButtonIndex];
        wordButtonsContainer.children[emptyButtonIndex].textContent = correctLetter;
        userInput += correctLetter;
        currentButtonIndex++;
    }
}

// Event listeners
document.addEventListener("keydown", updateButtonIndex);
randomButton.addEventListener("click", generateRandomWord);
resetButton.addEventListener("click", resetGame);
hintButton.addEventListener("click", provideHint);

// Initial load
generateRandomWord();
startTimer();