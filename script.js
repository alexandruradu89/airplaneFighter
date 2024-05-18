let gameOver = false;
let score = 0;
let cyclicalFunctionsId = [];
const boardWidth = 7,
    boardHeight = 6;
    let planeColumn = boardHeight / 2;
const defaultCell = 0,
    obstacle = 1,
    projectile = 2;
const gameTempo = 1000,
    colorsTempo = 100,
    planeMovementTempo = 50;
const matrix = Array.from({length: boardHeight}, () =>
    new Array(boardWidth).fill(0));

function createTable() {
    const displayTable = document.createElement("table");
    displayTable.className = "styled-table";
    const tableBody = document.createElement("tbody");
    for (let i = 0; i < boardHeight; ++i) {
        const row = document.createElement("tr");
        for (let j = 0; j < boardWidth; ++j) {
            const cell = document.createElement("td");
            cell.id = i + "-" + j;
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    displayTable.appendChild(tableBody);
    document.body.appendChild(displayTable);
    moveplane();
    shoot();
}

function resetTable() {
    for (let i = 0; i < boardHeight; ++i) {
        for (let j = 0; j < boardWidth; ++j) {
            matrix[i][j] = 0;
        }
    }
}

function resetWinnerMessage() {
    const message = document.getElementById("winnerMessage");
    message.innerHTML = "";
}

function setColors() {
    for (let i = 0; i < boardHeight; ++i) {
        for (let j = 0; j < boardWidth; ++j) {
            let cellId = i + "-" + j;
            let currentCell = document.getElementById(cellId);
            currentCell.className = "";
            if (matrix[i][j] === defaultCell) {
                currentCell.classList.add("default-cell");
            }
            if (matrix[i][j] === obstacle) {
                currentCell.classList.add("obstaclce-cell");
            }
            if (matrix[i][j] === projectile) {
                currentCell.classList.add("projectile");
            }
            if ((i === boardHeight - 1) && (j === planeColumn)) {
                currentCell.classList.add("airplane-cell");
            }
        }
    }
}

function moveplane() {
    document.addEventListener("keydown", (event) => {
        if ((planeColumn > 0) && (event.key === "ArrowLeft")) {
            --planeColumn;
        }
        if ((planeColumn < boardWidth - 1) && (event.key ===
                "ArrowRight")) {
            ++planeColumn;
        }
    });

}

function newObstacles() {
    for (let i = 0; i < boardWidth; ++i) {
        matrix[0][i] = 0;
    }
    let halfWidth = (boardWidth / 2) | 0;
    let currentRandom = Math.floor(Math.random() * (halfWidth + 1));
    matrix[0][currentRandom] = obstacle;
    currentRandom = Math.floor(Math.random() * (halfWidth + 1));
    matrix[0][currentRandom + halfWidth] = obstacle;
}

function lowerObstacles() {
    for (let i = boardHeight - 1; i > 0; --i) {
        for (let j = 0; j < boardWidth; ++j) {
            if (matrix[i][j] === obstacle) {
                matrix[i][j] = defaultCell;
            }
            if (matrix[i - 1][j] === obstacle) {
                matrix[i][j] = obstacle;
            }
        }
    }
}

function checkGameOver() {
    if (matrix[boardHeight - 1][planeColumn] === obstacle) {
        const message = document.getElementById("winnerMessage");
        message.innerHTML = "Game Over! Your score is " + score;
        gameOver = true;
        for (const id of cyclicalFunctionsId) {
            clearInterval(id);
        }
        planeColumn = boardHeight / 2;
    }
}

function displayScore() {
    const currentScore = document.getElementById("score");
    currentScore.innerHTML = score;
}

function shoot() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
            matrix[boardHeight - 2][planeColumn] = projectile;
        }
    });
}

function advanceProjectiles() {
    for (let i = 1; i < boardHeight; ++i) {
        for (let j = 0; j < boardWidth; ++j) {
            if (matrix[i][j] === projectile) {
                matrix[i][j] = defaultCell;
                if (matrix[i - 1][j] === obstacle) {
                    matrix[i - 1][j] = defaultCell;
                    ++score;
                } else {
                    matrix[i - 1][j] = projectile;
                }
            }
        }
    }
}

function advanceGame() {
    if (gameOver) {
        gameOver = false;
        resetTable();
        setColors();
        advanceGame();
        score = 0;
        resetWinnerMessage();
    } else {
        startTime = Date.now();
        let currentId = 0;
        currentId = setInterval(displayScore, colorsTempo);
        cyclicalFunctionsId.push(currentId);
        currentId = setInterval(advanceProjectiles, colorsTempo);
        cyclicalFunctionsId.push(currentId);
        currentId = setInterval(checkGameOver, planeMovementTempo);
        cyclicalFunctionsId.push(currentId);
        currentId = setInterval(setColors, planeMovementTempo);
        cyclicalFunctionsId.push(currentId);
        currentId = setInterval(lowerObstacles, gameTempo);
        cyclicalFunctionsId.push(currentId);
        currentId = setInterval(newObstacles, gameTempo);
        cyclicalFunctionsId.push(currentId);
    }
}