let currentWord = "";
let guessedWord = "";
let attempt = 0;
let maxAttempts = 5;  // Set to 5 attempts
const grid = document.getElementById('grid');
const apiURL = "https://api.dictionaryapi.dev/api/v2/entries/en/"; // Free Dictionary API
let isGameOver = false; // ตัวแปรสำหรับเก็บสถานะเกม
let currentHint = ""; // ตัวแปรสำหรับเก็บคำใบ้

// Fetch the word list from the JSON file
fetch('words.json')
    .then(response => response.json())
    .then(data => {
        const randomEntry = data[Math.floor(Math.random() * data.length)];
        currentWord = randomEntry.word.toUpperCase();
        currentHint = randomEntry.hint; // เก็บคำใบ้
        console.log("Word to guess: ", currentWord); // For debugging
    })
    .catch(error => console.error('Error fetching words:', error));

// Event listener for the submit button
document.getElementById('submit-btn').addEventListener('click', function() {
    // ตรวจสอบสถานะเกมก่อนที่จะอนุญาตให้ส่งคำใหม่
    if (isGameOver) {
        return; // ไม่ทำอะไรถ้าเกมจบแล้ว
    }

    guessedWord = document.getElementById('word-input').value.toUpperCase();
    if (guessedWord.length === 5) {
        validateWord(guessedWord);  // Check if the word is valid
    } else {
        document.getElementById('message').textContent = "Word must be 5 letters!";
    }
});

// Validate the guessed word using an API
function validateWord(guessedWord) {
    fetch(apiURL + guessedWord.toLowerCase()) // API call to check the word
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Word not found");
            }
        })
        .then(data => {
            attempt++;
            addGuessToGrid(guessedWord);  // Add the current guess to the history
            checkWord(guessedWord);       // Check if the guess is correct
        })
        .catch(error => {
            document.getElementById('message').textContent = "Not a valid English word!";
            console.error('Error:', error);
        });
}

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
    const message = document.getElementById('message');

    if (guessedWord === currentWord) {
        message.textContent = "Congratulations! You guessed it!";
        showRestartButton();  // Show restart button when correct guess is made
        isGameOver = true; // เปลี่ยนสถานะเกมเป็นจบ
    } else if (attempt >= maxAttempts) {
        message.textContent = `Game Over! The word was: ${currentWord}`;
        showRestartButton();  // Show restart button after maximum attempts
        isGameOver = true; // เปลี่ยนสถานะเกมเป็นจบ
    } else {
        message.textContent = `Try again! Attempts left: ${maxAttempts - attempt}`;
    }
}

// Show a "Try Again!" button after max attempts or winning
function showRestartButton() {
    const gameContainer = document.querySelector('.game-container');

    // Create the "Try Again!" button
    const restartBtn = document.createElement('button');
    restartBtn.textContent = "Try Again!";
    restartBtn.id = 'restart-btn';
    restartBtn.style.padding = '10px 20px';
    restartBtn.style.fontSize = '18px';
    restartBtn.style.marginTop = '20px';

    // Append the button to the game container
    gameContainer.appendChild(restartBtn);

    // Add event listener to reload the page when button is clicked
    restartBtn.addEventListener('click', function() {
        location.reload();  // Reload the page to restart the game
    });
}

// ฟังก์ชันสำหรับสุ่มคำใบ้
function giveHint() {
    const hintMessage = document.getElementById('hint-message');

    // แสดงคำใบ้ที่กำหนดเอง
    hintMessage.textContent = `Hint: ${currentHint}`;
}

// Event listener สำหรับปุ่ม Hint
document.getElementById('hint-btn').addEventListener('click', function() {
    if (!isGameOver) { // เช็คสถานะเกมก่อนให้กดปุ่ม
        giveHint();
    }
});
