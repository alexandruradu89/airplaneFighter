 let planeColumn = 3;
 let gameOver = false;
 let score = 0;
 let cyclicalFunctionsId = [];
 const boardWidth = 7, boardHeight = 6;
 const matrix = Array.from({length: boardHeight}, () =>
                new Array(boardWidth).fill(0));
         
 function createTable() {
    const displayTable = document.createElement("table");
    displayTable.setAttribute("style", "border: 1px solid black");
    const tableBody = document.createElement("tbody");
    for (let i = 0; i < boardHeight; ++i) {
        const row = document.createElement("tr");
        for (let j = 0; j < boardWidth; ++j) {
            const cell = document.createElement("td");
            cell.id = i + "-" + j;
            cell.setAttribute("style", "width: 30px; height: 30px");
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
    for (let i  = 0; i < boardHeight; ++i) { 
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
            currentCell.setAttribute("style", "background-color: white; width: 30px; height: 30px");
            if (matrix[i][j] == 1) {
                currentCell.setAttribute("style", "background-color: blue;  width: 30px; height: 30px");
            }
            if (matrix[i][j] == 2) {
                currentCell.setAttribute("style", "background-color: red;  width: 30px; height: 30px");
            }
            if ((i == boardHeight - 1) && (j == planeColumn)) {
                currentCell.setAttribute("style", "background-color: green;  width: 30px; height: 30px");
            }
        }
    }
 }

 function moveplane() {
    document.addEventListener("keydown", (event) => {
        if ((planeColumn > 0) && (event.key === "ArrowLeft")) {
            --planeColumn;
        }
        if ((planeColumn < boardWidth - 1) && (event.key === "ArrowRight")) {
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
    matrix[0][currentRandom] = 1;
    currentRandom = Math.floor(Math.random() * (halfWidth + 1));
    matrix[0][currentRandom + halfWidth] = 1;
 }

 function lowerObstacles() {
    for (let i = boardHeight - 1; i > 0; --i) {
        for (let j = 0; j < boardWidth; ++j) {
            if (matrix[i][j] === 1) {
                matrix[i][j] = 0;
            }
            if (matrix[i - 1][j] === 1) {
                matrix[i][j] = 1;
            }
        }
    }
 }

 function checkGameOver() {
    if (matrix[boardHeight - 1][planeColumn] == 1) {
        const message = document.getElementById("winnerMessage");
        message.innerHTML = "Game Over! Your score is " + score;
        gameOver = true;
        for (const id of cyclicalFunctionsId) {
            clearInterval(id);
        }
        planeColumn = 3;
    }
 }

 function displayScore() {
    const currentScore = document.getElementById("score");
    currentScore.innerHTML = score;
 }

 function shoot() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
            matrix[boardHeight - 2][planeColumn] = 2;
        }
    });
}

function advanceProjectiles() {
    for (let i = 1; i < boardHeight; ++i) {
        for (let j = 0; j < boardWidth; ++j) {
            if (matrix[i][j] === 2) {
                matrix[i][j] = 0;
                if (matrix[i - 1][j] === 1) {
                    matrix[i - 1][j] = 0;
                    ++score;
                } else {
                    matrix[i - 1][j] = 2;
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
        currentId = setInterval(displayScore ,100);
        cyclicalFunctionsId.push(currentId);
        currentId = setInterval(advanceProjectiles ,100);
        cyclicalFunctionsId.push(currentId);
        currentId = setInterval(checkGameOver ,50);
        cyclicalFunctionsId.push(currentId);
        currentId = setInterval(setColors ,50);
        cyclicalFunctionsId.push(currentId);
        currentId = setInterval(lowerObstacles ,1000);
        cyclicalFunctionsId.push(currentId);
        currentId = setInterval(newObstacles ,1000);
        cyclicalFunctionsId.push(currentId);
    }
 }