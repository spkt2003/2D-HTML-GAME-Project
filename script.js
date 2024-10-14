let currentWord = "";
let guessedWord = "";
let attempt = 0;
let maxAttempts = 6;
const grid = document.getElementById('grid');

// Fetch the word list from the JSON file
fetch('words.json')
    .then(response => response.json())
    .then(data => {
        currentWord = data[Math.floor(Math.random() * data.length)].toUpperCase();
        console.log("Word to guess: ", currentWord); // For debugging
    })
    .catch(error => console.error('Error fetching words:', error));

// Event listener for the submit button
document.getElementById('submit-btn').addEventListener('click', function() {
    guessedWord = document.getElementById('word-input').value.toUpperCase();
    if (guessedWord.length === 5) {
        attempt++;
        addGuessToGrid(guessedWord);  // Add the current guess to the history
        checkWord(guessedWord);       // Check if the guess is correct
    } else {
        document.getElementById('message').textContent = "Word must be 5 letters!";
    }
});

// Add the guessed word to the grid (with color feedback)
function addGuessToGrid(guessedWord) {
    const guessRow = document.createElement('div');
    guessRow.classList.add('guess-row');

    // Create a temporary copy of the word for matching purposes
    let tempWord = currentWord.split('');

    // First pass: Check correct letters in the correct positions (Green)
    for (let i = 0; i < guessedWord.length; i++) {
        let cell = document.createElement('div');
        cell.textContent = guessedWord[i];
        cell.classList.add('grid-cell');
        if (guessedWord[i] === currentWord[i]) {
            cell.classList.add('correct-position');  // Add green class
            tempWord[i] = null;  // Mark letter as used
        }
        guessRow.appendChild(cell);
    }

    // Second pass: Check correct letters in the wrong positions (Yellow)
    for (let i = 0; i < guessedWord.length; i++) {
        let cell = guessRow.children[i];
        if (!cell.classList.contains('correct-position') && tempWord.includes(guessedWord[i])) {
            cell.classList.add('correct-letter');  // Add yellow class
            tempWord[tempWord.indexOf(guessedWord[i])] = null;  // Mark letter as used
        } else if (!cell.classList.contains('correct-position')) {
            // Incorrect letter (Gray)
            cell.classList.add('wrong-letter');  // Add gray class
        }
    }

    // Append the guess row to the grid
    grid.appendChild(guessRow);
}

// Check if the guessed word is correct or if the game is over
function checkWord(guessedWord) {
    if (guessedWord === currentWord) {
        document.getElementById('message').textContent = "Congratulations! You guessed it!";
    } else if (attempt >= maxAttempts) {
        document.getElementById('message').textContent = `Game Over! The word was: ${currentWord}`;
    } else {
        document.getElementById('message').textContent = `Try again! Attempts left: ${maxAttempts - attempt}`;
    }
}
