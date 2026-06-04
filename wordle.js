const height = 6;
const width = 5;

let row = 0;
let col = 0;
let gameOver = false;
const wordList = [
    "арбуз", "банка", "багор", "балет", "баран", "баржа", "башня", "белка",
    "букет", "булка", "буран", "вагон", "ванна", "ведро", "весна", "ветер",
    "вилка", "война", "ворон", "газон", "гамак", "глина", "горка", "груша",
    "девиз", "декор", "диван", "длина", "дозор", "доска", "драма", "дубок",
    "дукат", "дымка", "дырка", "егерь", "жатва", "жакет", "забор", "завод",
    "замок", "занос", "запад", "заряд", "затон", "зебра", "зерно", "икона",
    "инжир", "кабан", "казна", "кайма", "какао", "камыш", "канал", "капот",
    "карта", "касса", "каюта", "кефир", "кивок", "кизил", "кисет", "класс",
    "книга", "комар", "конус", "крона", "кулак", "кулон", "купон", "курок",
    "кухня", "лампа", "лента", "леска", "лиана", "лимон", "линия", "локон",
    "лоток", "лунка", "магия", "майка", "макет", "манго", "марка", "маска",
    "масса", "маяк", "медик", "мелок", "месяц", "мидия", "минор", "миска",
    "монах", "мороз", "мотор", "мышка", "набат", "навык", "наряд", "насос",
    "нация", "невод", "нитка", "норка", "норма", "обвал", "обряд", "огонь",
    "океан", "оклад", "ольха", "опера", "орден", "осень", "осока", "отдых",
    "пакет", "палас", "палец", "панда", "парад", "парик", "парус", "паста",
    "пауза", "пенал", "пешка", "пирог", "плита", "повар", "повод", "полка",
    "посох", "почта", "право", "пряжа", "птица", "пурга", "пушка", "пудра",
    "радар", "радио", "ранка", "рация", "ребус", "редис", "рейка", "речка",
    "рикша", "робот", "рожок", "рулон", "сабля", "садик", "самец", "санки",
    "сарай", "сатин", "свеча", "север", "седло", "сезон", "серия", "сетка",
    "силач", "синяк", "скала", "склад", "слава", "слеза", "слива", "слово",
    "смола", "сокол", "сопка", "спорт", "старт", "стена", "стоик", "столб",
    "стопа", "струя", "сумка", "сырок", "тайна", "тапка", "театр", "тиара",
    "титан", "тоник", "топор", "топот", "трава", "тренд", "тукан", "тулуп",
    "тумба", "тунец", "тучка", "тыква", "тюбик", "тяпка", "уклад", "улица",
    "умник", "усыпь", "факел", "фауна", "фасад", "фасон", "фишка", "фланг",
    "флора", "фокус", "форма", "форум", "фужер", "хатка", "хвост", "хутор",
    "цапля", "центр", "циник", "цифра", "чайка", "чашка", "челка", "череп",
    "черта", "чибис", "чижик", "чудак", "чулок", "шалаш", "шалун", "шапка",
    "шахта", "ширма", "шкала", "школа", "шорох", "шпага", "шпора", "штаты",
    "шторм", "штука", "шумок", "щенок", "экран", "элита", "ягель", "якорь",
    "ямина", "ярица", "ясень", "яхонт"
];

window.onload = function () {
    initialize();
};
const word = wordList[Math.floor(Math.random() * wordList.length)];
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
    } else if (key === "backspace") {
        if (col > 0) {
            col--;
            let tile = document.getElementById(row + "-" + col);
            tile.innerText = "";
        }
    } else if (key === "enter") {
        if (col !== width) return;
        update();

        if (!gameOver) {
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
        document.getElementById("answer").innerText = "🎉 Поздравляем! Вы угадали слово!";
        gameOver = true;
    }
}