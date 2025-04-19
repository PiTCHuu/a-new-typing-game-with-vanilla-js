const words = {
    english: [
        'the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are',
        'as', 'with', 'his', 'they', 'I', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by',
        'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'use',
        'an', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about', 'out',
        'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'him', 'into',
        'time', 'has', 'look', 'two', 'more', 'write', 'go', 'see', 'number', 'no', 'way', 'could',
        'people', 'my', 'than', 'first', 'water', 'been', 'call', 'who', 'oil', 'its', 'now', 'find',
        'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part', 'over', 'new', 'sound', 'take'
    ],
    punctuation: [
        'The black and white cat jumps quickly.', 'Are you ready? I am excited!', 
        'The man said: "I will come back tomorrow."', 'Three options: red, blue, green.',
        'I think, therefore I am.', 'Enter the code (1234) to continue.',
        'It\'s raining; the sky is getting darker.', 'Warning! Do not touch the electric wire.',
        'Paul, Mary, and John — my childhood friends — will come tomorrow.',
        'The doctor said everything was fine... for now.'
    ],
    numbers: [
        'In 2023, I read 42 books.', 'The price is $99.99 for 3 items.',
        'My number is 555-123-4567.', 'The zip code 90210 is in Beverly Hills.',
        'Page 123, paragraph 4, line 7.', 'The apartment is 650 sq ft with 3 bedrooms.',
        'Today\'s temperature is 75°F.', 'I ordered 5 pizzas for 12 people.',
        'The meeting starts at 10:30 AM and ends at 12:15 PM.', 'The match ended 3-2 after overtime.'
    ],
    quotes: [
        'Life is a mystery to be lived, not a problem to be solved.',
        'Happiness is not at the end of the road, happiness is the road.',
        'Failure is simply the opportunity to begin again, this time more intelligently.',
        'The journey of a thousand miles begins with a single step.',
        'Choose a job you love, and you will never have to work a day in your life.',
        'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
        'The greatest glory in living lies not in never falling, but in rising every time we fall.',
        'The only way to do great work is to love what you do.',
        'Success is walking from failure to failure with no loss of enthusiasm.',
        'The future belongs to those who believe in the beauty of their dreams.'
    ]
};

let currentMode = 'time';
let currentTimeOption = 60;
let currentWordCount = 50;
let timerInterval;
let progressInterval;
let startTime;
let endTime;
let timeLeft;
let wordIndex = 0;
let charIndex = 0;
let correctChars = 0;
let incorrectChars = 0;
let totalChars = 0;
let testActive = false;
let currentText = [];
let typingHistory = [];
let backspaceEnabled = true;
let isDarkTheme = true;

const textDisplay = document.getElementById('text-display');
const hiddenInput = document.getElementById('hidden-input');
const focusIndicator = document.getElementById('focus-indicator');
const timerDisplay = document.getElementById('timer-display');
const progressLeft = document.getElementById('progress-left');
const progressRight = document.getElementById('progress-right');
const resultsOverlay = document.getElementById('results-overlay');
const wpmElement = document.getElementById('wpm');
const cpmElement = document.getElementById('cpm');
const accuracyElement = document.getElementById('accuracy');
const timeElement = document.getElementById('time');
const restartButton = document.getElementById('restart-button');
const closeResults = document.getElementById('close-results');
const modeOptions = document.querySelectorAll('.mode-option');
const timerOptions = document.querySelectorAll('.timer-option');
const themeToggle = document.getElementById('theme-toggle');
const leaderboardToggle = document.getElementById('leaderboard-toggle');
const leaderboard = document.getElementById('leaderboard');
const gameContainer = document.getElementById('game-container');
const logoutBtn = document.getElementById('logout-btn');
const encouragementMessage = document.getElementById('encouragement-message');

function init() {
    setActiveMode('time');
    generateText();
    setupEventListeners();
    setupTheme();
}

function setupEventListeners() {
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            setActiveMode(option.dataset.mode);
        });
    });
    timerOptions.forEach(option => {
        option.addEventListener('click', () => {
            setActiveTimeOption(option.dataset.value);
        });
    });

    document.addEventListener('keydown', handleKeydown);
    focusIndicator.addEventListener('click', focusInput);
    hiddenInput.addEventListener('input', handleInput);
    restartButton.addEventListener('click', restart);
    closeResults.addEventListener('click', hideResults);
    themeToggle.addEventListener('click', toggleTheme);
    leaderboardToggle.addEventListener('click', toggleLeaderboard);
    logoutBtn.addEventListener('click', handleLogout);

    document.addEventListener('click', function(event) {
        if (leaderboard.classList.contains('active') && 
            !leaderboard.contains(event.target) && 
            event.target !== leaderboardToggle && 
            !leaderboardToggle.contains(event.target)) {
            leaderboard.classList.remove('active');
            adjustGameContainer();
        }
    });
}

function setActiveMode(mode) {
    currentMode = mode;
    modeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.mode === mode) {
            option.classList.add('active');
        }
    });

    const timerOptionsContainer = document.querySelector('.timer-options');
    if (mode === 'time') {
        timerOptionsContainer.style.display = 'flex';
    } else {
        timerOptionsContainer.style.display = 'none';
    }
    restart();
}

function setActiveTimeOption(value) {
    currentTimeOption = parseInt(value);
    timerOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.value === value) {
            option.classList.add('active');
        }
    });
    timerDisplay.textContent = currentTimeOption;
    restart();
}

function setupTheme() {
    const savedTheme = localStorage.getItem('dactyloRushTheme') || 'dark';
    isDarkTheme = savedTheme === 'dark';
    applyTheme();
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    localStorage.setItem('dactyloRushTheme', isDarkTheme ? 'dark' : 'light');
    applyTheme();
}

function applyTheme() {
    if (isDarkTheme) {
        document.body.classList.remove('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Theme';
    } else {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Theme';
    }
}

function toggleLeaderboard() {
    leaderboard.classList.toggle('active');
    adjustGameContainer();
}

function adjustGameContainer() {
    if (leaderboard.classList.contains('active')) {
        if (window.innerWidth > 768) {
            gameContainer.style.marginRight = '300px';
        }
    } else {
        gameContainer.style.marginRight = '0';
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = 'index.html';
    }
}

function generateText() {
    textDisplay.innerHTML = '';
    currentText = [];
    
    switch(currentMode) {
        case 'time':
        case 'words':
            const shuffledWords = [...words.english].sort(() => Math.random() - 0.5);
            const selectedWords = shuffledWords.slice(0, currentMode === 'words' ? currentWordCount : 100);
            currentText = selectedWords;
            break;
        case 'quote':
            const randomQuote = words.quotes[Math.floor(Math.random() * words.quotes.length)];
            currentText = randomQuote.split(' ');
            break;
        case 'punctuation':
            const randomPunctuation = words.punctuation.sort(() => Math.random() - 0.5).slice(0, 3).join(' ');
            currentText = randomPunctuation.split(' ');
            break;
        case 'numbers':
            const randomNumbers = words.numbers.sort(() => Math.random() - 0.5).slice(0, 3).join(' ');
            currentText = randomNumbers.split(' ');
            break;
    }

    currentText.forEach((word, index) => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word';
        wordElement.dataset.index = index;
        
        [...word].forEach((char, charIdx) => {
            const charElement = document.createElement('span');
            charElement.className = 'char';
            charElement.dataset.index = charIdx;
            charElement.textContent = char;
            wordElement.appendChild(charElement);
        });
        
        textDisplay.appendChild(wordElement);
    });

    const firstChar = textDisplay.querySelector('.word[data-index="0"] .char[data-index="0"]');
    if (firstChar) {
        firstChar.classList.add('current');
    }
}

function handleKeydown(e) {
    if (document.activeElement !== hiddenInput) {
        hiddenInput.focus();
        focusIndicator.style.display = 'none';
        
        if (!testActive) {
            startTest();
        }
    }
    
    if (e.key === 'Backspace' && backspaceEnabled) {
        handleBackspace();
    }
}

function focusInput() {
    hiddenInput.focus();
    focusIndicator.style.display = 'none';
    
    if (!testActive) {
        startTest();
    }
}

function handleBackspace() {
    if (!testActive || charIndex <= 0) return;
    const currentWord = textDisplay.querySelector(`.word[data-index="${wordIndex}"]`);
    if (!currentWord) return;

    const chars = currentWord.querySelectorAll('.char');
    if (charIndex < chars.length) {
        chars[charIndex].classList.remove('current');
    }
    charIndex--;
    
    if (charIndex < chars.length) {
        const prevChar = chars[charIndex];
        if (prevChar.classList.contains('correct')) {
            correctChars--;
        } else if (prevChar.classList.contains('incorrect')) {
            incorrectChars--;
        }
        totalChars--;
        
        prevChar.classList.remove('correct', 'incorrect');
        prevChar.classList.add('current');
    }
    
    hiddenInput.value = '';
}

function startTest() {
    testActive = true;
    startTime = new Date();
    wordIndex = 0;
    charIndex = 0;
    correctChars = 0;
    incorrectChars = 0;
    totalChars = 0;
    typingHistory = [];
    
    resultsOverlay.classList.remove('active');
    hiddenInput.value = '';
    
    if (currentMode === 'time') {
        timeLeft = currentTimeOption;
        timerDisplay.textContent = timeLeft;
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
        startProgressBar();
    }
    recordTypingData();
}

function recordTypingData() {
    const recordInterval = setInterval(() => {
        if (!testActive) {
            clearInterval(recordInterval);
            return;
        }
        
        const elapsedTime = (new Date() - startTime) / 1000;
        const currentWPM = Math.round((correctChars / 5) / (elapsedTime / 60));
        
        typingHistory.push({
            time: elapsedTime,
            wpm: currentWPM
        });
        
    }, 1000);
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endTest();
    }
}

function startProgressBar() {
    progressLeft.style.width = '0%';
    progressRight.style.width = '0%';
    
    let progress = 0;
    progressInterval = setInterval(() => {
        progress += 100 / (currentTimeOption * 1000 / 50); 
        const sideWidth = progress / 2;
        progressLeft.style.width = `${sideWidth}%`;
        progressRight.style.width = `${sideWidth}%`;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, 50);
}

function handleInput(e) {
    if (!testActive) return;
    
    const inputChar = e.data;
    if (!inputChar) return;
    const currentWord = textDisplay.querySelector(`.word[data-index="${wordIndex}"]`);
    if (!currentWord) return;
    
    const chars = currentWord.querySelectorAll('.char');
    const currentChar = charIndex < chars.length ? chars[charIndex] : null;
    
    if (inputChar === ' ') {
        if (charIndex >= chars.length) {
            wordIndex++;
            charIndex = 0;
            hiddenInput.value = '';
            if (wordIndex >= currentText.length) {
                endTest();
                return;
            }
            updateCurrentChar();
        } else {
            if (currentChar) {
                currentChar.classList.remove('current');
                currentChar.classList.add('incorrect');
                incorrectChars++;
                totalChars++;
                charIndex++;
                updateCurrentChar();
            }
        }
        return;
    }
    
    if (currentChar) {
        const correctChar = currentChar.textContent;
        
        currentChar.classList.remove('current');
        
        if (inputChar === correctChar) {
            currentChar.classList.add('correct');
            correctChars++;
        } else {
            currentChar.classList.add('incorrect');
            incorrectChars++;
    
            focusIndicator.classList.add('incorrect-input');
            setTimeout(() => {
                focusIndicator.classList.remove('incorrect-input');
            }, 200);
        }
        
        totalChars++;
        charIndex++;

        updateCurrentChar();
        if (currentMode === 'words' && wordIndex >= currentWordCount - 1 && charIndex >= chars.length) {
            endTest();
        }
    }
}

function updateCurrentChar() {
    const prevChar = textDisplay.querySelector('.char.current');
    if (prevChar) {
        prevChar.classList.remove('current');
    }
    
    const currentWord = textDisplay.querySelector(`.word[data-index="${wordIndex}"]`);
    if (currentWord) {
        const nextChar = currentWord.querySelector(`.char[data-index="${charIndex}"]`);
        if (nextChar) {
            nextChar.classList.add('current');
        }
    }
}

function endTest() {
    testActive = false;
    endTime = new Date();
    clearInterval(timerInterval);
    clearInterval(progressInterval);
    
    let timeElapsed;
    if (currentMode === 'time') {
        timeElapsed = currentTimeOption;
    } else {
        timeElapsed = (endTime - startTime) / 1000;
    }
    
    const wpm = Math.round(correctChars / 5 / (timeElapsed / 60));
    const cpm = Math.round(correctChars / (timeElapsed / 60));
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    
    wpmElement.textContent = wpm;
    cpmElement.textContent = cpm;
    accuracyElement.textContent = `${accuracy}%`;
    timeElement.textContent = `${Math.round(timeElapsed)}s`;

    let message = '';
    if (wpm < 30) {
        message = "Keep practicing! You're making progress with every key stroke.";
    } else if (wpm < 60) {
        message = "Good job! Your typing skills are developing nicely.";
    } else if (wpm < 90) {
        message = "Impressive speed! You're becoming a typing master.";
    } else {
        message = "Amazing! Your fingers are flying across the keyboard!";
    }
    
    if (encouragementMessage) {
        encouragementMessage.textContent = message;
    }
    
    resultsOverlay.classList.add('active');
    focusIndicator.style.display = 'block';
}

function hideResults() {
    resultsOverlay.classList.remove('active');
}

function restart() {
    clearInterval(timerInterval);
    clearInterval(progressInterval);
    testActive = false;
    hiddenInput.value = '';
    timerDisplay.textContent = currentTimeOption;
    progressLeft.style.width = '0%';
    progressRight.style.width = '0%';
    generateText();
    focusIndicator.style.display = 'block';
    resultsOverlay.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('resize', adjustGameContainer);
