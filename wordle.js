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