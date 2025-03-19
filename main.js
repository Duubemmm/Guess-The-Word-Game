const randomButton = document.querySelector('.random-button');
const resetButton = document.querySelector('.reset-button');
const buttonElement = document.querySelectorAll('.word-buttons button');
const displayArea = document.querySelector('.display-area');

const scrambledWord = [
    "flowers", "light", "water", "trees", "birds", "butterfly", 
    "rain", "clouds", "sun", "moon", "stars", "mountains", "beach"
];

let currentWordIndex = 0;
let currentButtonIndex = 0;
let tries = 0;
let mistakes = 0;

// Function to update button text based on user input
function updateButtonIndex(event) {
    if (currentButtonIndex < buttonElement.length) {
        const key = event.key;

        // Check if the key is a single character (letter or number)
        if (key.length === 1 && /[a-zA-Z]/.test(key)) {
            buttonElement[currentButtonIndex].textContent = key.toUpperCase(); // Update the button text
            currentButtonIndex++; // Move to the next button
        }
    }
}

// Function to scramble a word
function scrambleWord(word) {
    const letters = word.split(""); // Convert the word into an array of letters
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index
        [letters[i], letters[j]] = [letters[j], letters[i]]; // Swap letters
    }
    return letters.join(""); // Convert the array back into a string
}

// Function to generate and display a random word
function generateRandomWord() {
    const randomIndex = Math.floor(Math.random() * scrambledWord.length); // Pick a random word
    const randomWord = scrambledWord[randomIndex]; // Set the current word
    const scrambled = scrambleWord(randomWord); // Scramble the word
    displayArea.textContent = scrambled; // Display the scrambled word
    resetButtons(); // Clear the buttons for the new word
}

// Function to reset the buttons
function resetButtons() {
    buttonElement.forEach(button => {
        button.textContent = ""; // Clear all button text
    });
    currentButtonIndex = 0; // Reset the index
}

// Function to reset the game
function resetGame() {
    resetButtons(); // Clear the buttons
    displayArea.textContent = ""; // Clear the displayed word
    tries = 0; // Reset tries
    mistakes = 0; // Reset mistakes
    console.log("Game reset. Ready for a new word!");
}

// Event listener for keydown events
document.addEventListener("keydown", updateButtonIndex);

// Event listener for the Random button
randomButton.addEventListener('click', generateRandomWord);

// Event listener for the Reset button
resetButton.addEventListener('click', resetGame);

// Initial load (optional)
generateRandomWord();