const height = 6;
const width = 5;

let row = 0;
let col = 0;
let gameOver = false;

window.onload = function () {
    initialize();
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



function processKey(e) {
    if (gameOver) return;

    let key = e.key.toLowerCase();


    if (/^[а-яё]$/.test(key)) {
        if (col < width) {
            let tile = document.getElementById(row + "-" + col);
            tile.innerText = key.toUpperCase();
            col++;
        }
    }
    else if (key === "backspace") {
        if (col > 0) {
            col--;
            let tile = document.getElementById(row + "-" + col);
            tile.innerText = "";
        }
    }

    else if (key === "enter") {
        if (col !== width) return;

        row++;
        col = 0;

        if (row === height) {
            gameOver = true;
            document.getElementById("answer").innerText = "Игра окончена";
        }
    }
}