const height = 6;
const width = 5;

let row = 0;
let col = 0;
let gameOver = false;

let wordList = [];
let word = "";
let wins = localStorage.getItem("wins") ? parseInt(localStorage.getItem("wins")) : 0;

window.onload = async function () {

    const response = await fetch("word.json");

    wordList = await response.json();

    word = wordList[Math.floor(Math.random() * wordList.length)];
    document.getElementById("wins-count").innerText = wins;

    initialize();

    checkAndCreateKeyboard();

    window.addEventListener("resize", checkAndCreateKeyboard);

    document.getElementById("start-btn").addEventListener("click", () => {
        document.getElementById("menu").style.display = "none";
    });
    
    const themeToggle = document.getElementById("theme-toggle");
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
        themeToggle.checked = true;
    }
    themeToggle.addEventListener("change", (e) => {
        if (e.target.checked) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("theme", "light");
        }
    });

};

function initialize() {
    let board = document.getElementById("board");
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r + "-" + c;
            tile.classList.add("tile");
            board.appendChild(tile);
        }
    }
    
}
    document.addEventListener("keydown", processKey);

function checkAndCreateKeyboard() {
    if (window.innerWidth <= 1024) {
        createMobileKeyboard();
    } else {
        const keyboardDiv = document.getElementById("keyboard");
        if (keyboardDiv) keyboardDiv.innerHTML = "";
    }
}

function createMobileKeyboard() {
    const keyboardDiv = document.getElementById("keyboard");
    if (!keyboardDiv) return;
    keyboardDiv.innerHTML = "";
    const rows = [
        ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
        ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
        ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "ё"]
    ];
    rows.forEach(rowLetters => {
        const rowDiv = document.createElement("div");
        rowDiv.style.display = "flex";
        rowDiv.style.justifyContent = "center";
        rowDiv.style.marginBottom = "6px";
        rowLetters.forEach(letter => {
            const btn = document.createElement("button");
            btn.textContent = letter.toUpperCase();
            btn.classList.add("key-btn");
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                processKey({ key: letter, preventDefault: () => {} });
            });
            rowDiv.appendChild(btn);
        });
        keyboardDiv.appendChild(rowDiv);
    });
    const specialRow = document.createElement("div");
    specialRow.style.display = "flex";
    specialRow.style.justifyContent = "center";
    specialRow.style.gap = "6px";
    specialRow.style.marginTop = "6px";
    const backBtn = document.createElement("button");
    backBtn.textContent = "⌫";
    backBtn.classList.add("key-btn", "special");
    backBtn.addEventListener("click", () => {
        processKey({ key: "Backspace", preventDefault: () => {} });
    });
    const enterBtn = document.createElement("button");
    enterBtn.textContent = "ПРОВЕРИТЬ";
    enterBtn.classList.add("key-btn", "special");
    enterBtn.addEventListener("click", () => {
        processKey({ key: "Enter", preventDefault: () => {} });
    });
    specialRow.appendChild(backBtn);
    specialRow.appendChild(enterBtn);
    keyboardDiv.appendChild(specialRow);
} 

function processKey(e) {
    if (gameOver) return;
    let key = e.key.toLowerCase();
    if (/^[а-яё]$/.test(key)) {
        if (col < width) {
            let tile = document.getElementById(row + "-" + col);
            tile.innerText = key.toUpperCase();
            col++;
        }
    } else if (key === "backspace") {
        if (col > 0) {
            col--;
            let tile = document.getElementById(row + "-" + col);
            tile.innerText = "";
        }
        } else if (key === "enter") {
        if (col !== width) return;
        const success = update(); 
        if (success && !gameOver) {
            row++;
            col = 0;
        }
        if (row === height && !gameOver) {
            gameOver = true;
            document.getElementById("answer").innerText = "Слово: " + word.toUpperCase();
        }
    }
}
function update() {
    let guess = "";
    for (let c = 0; c < width; c++) {
        let tile = document.getElementById(row + "-" + c);
        guess += tile.innerText.toLowerCase();
    }

    if (!wordList.includes(guess)) {
        alert("Такого слова нет в списке!");
        for (let c = 0; c < width; c++) {
            let tile = document.getElementById(row + "-" + c);
            tile.innerText = "";
            tile.classList.remove("correct", "present", "absent");
        }
        col = 0;
        return false; 
    }

    let colors = Array(width).fill("absent");
    let remainingLetters = word.split("");

    for (let i = 0; i < width; i++) {
        if (guess[i] === word[i]) {
            colors[i] = "correct";
            remainingLetters[i] = null;
        }
    }

    for (let i = 0; i < width; i++) {
        if (colors[i] === "correct") continue;
        let index = remainingLetters.indexOf(guess[i]);
        if (index !== -1) {
            colors[i] = "present";
            remainingLetters[index] = null;
        }
    }

    for (let i = 0; i < width; i++) {
        let tile = document.getElementById(row + "-" + i);
        tile.classList.remove("correct", "present", "absent");
        tile.classList.add(colors[i]);
    }

    if (guess === word) {
        wins++;
        localStorage.setItem("wins", wins);
        document.getElementById("wins-count").innerText = wins;
        document.getElementById("answer").innerText = "🎉 Поздравляем! Вы угадали слово!";
        gameOver = true;
    }
    return true;
}