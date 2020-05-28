// Written by Jacob Sundh 28/5-20

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let gameGrid = Array(21).fill().map(a => Array(10).fill().map(a => -1)); // 10x21 block grid for pieces
let tetro = {x: 4, y: 0, blocks: Array(4), shapeIndex: 1, rotation: 0, locked: false}; // the current position of the moving piece and its blocks.
let pieces = []; // listan med bitar som står på tur (byter till svenska nu)
let deleteQueue = []; // rader som ska tas bort
let nextPiece; // nästa big på tur
let canMove = true;  // kollar om bitar kan roteras eller röras på
let canRotate = true;
let lost = false; // kollar om du har förlorat speler
let score = 0; // 3 variabler för de olika räkningarna under spelet
let lines = 0;
let level = 0;
let calculatedDropDelay = 900 * (1 - (level * 0.01)); // hur snabbt bitarna faller ner kalkylerat ut efter din level
let dropDelay = calculatedDropDelay;

let loseDisplay = document.getElementById("lose"); // alla uträckningars texter på sidan kopplas här via DOM
let scoreDisplay = document.getElementById("score");
let levelDisplay = document.getElementById("level");
let linesDisplay = document.getElementById("lines");
let tetrisDisplay = document.getElementById("tetris");

const blockSize = 40; // size of one block 

// next piece canvas:
let nextPieceCanvas = document.getElementById("nextpiece");
let nextCtx = nextPieceCanvas.getContext("2d");
nextCtx.scale(0.8, 0.8)

function drawNextPiece(pieceType) {
    let row = 0, column = 0;
    let block = Object.values(tetrominos)[pieceType].rotations[0];
    nextCtx.clearRect(0, 0, canvas.width, canvas.height);
    nextCtx.fillStyle = "white";

    for (let bit = 0x8000; bit > 0; bit = bit >> 1) { // går igenom en bits alla blok med hjälp av bitwise operatörer, och fyller dom med respektive färg
        if (block & bit) {
            nextCtx.fillRect(30 + column*blockSize, row*blockSize, blockSize, blockSize);
        }  
        if (++column === 4) {
            column = 0;
            ++row;
        }
    }
}

// All the different tetris shapes and their rotations. Thoroughly explained in the documentation.
let tetrominos = {
    i: { rotations: [0x0F00, 0x2222, 0x0F00, 0x2222], img: "url()", color: "cyan" },
    j: { rotations: [0x44C0, 0x8E00, 0x6440, 0x0E20], img: "url()", color: "blue" },
    l: { rotations: [0x4460, 0x0E80, 0xC440, 0x2E00], img: "url()", color: "orange" },
    o: { rotations: [0xCC00, 0xCC00, 0xCC00, 0xCC00], img: "url()", color: "yellow" },
    s: { rotations: [0x06C0, 0x8C40, 0x06C0, 0x8C40], img: "url()", color: "green" },
    t: { rotations: [0x0E40, 0x4C40, 0x4E00, 0x4640], img: "url()", color: "purple" },
    z: { rotations: [0x0C60, 0x4C80, 0x0C60, 0x4C80], img: "url()", color: "red" }
};

function drawTetromino() { // går igenom en bits alla blok med hjälp av bitwise operatörer, och fyller dom med respektive färg
    let row = 0, column = 0;
    let shape = Object.values(tetrominos)[tetro.shapeIndex];
    let block = shape.rotations[tetro.rotation];
    let renderQueue = [];

    for (let bit = 0x8000; bit > 0; bit = bit >> 1) {
        if (block & bit) {
            if (gameGrid[tetro.y + row][tetro.x + column] === -1 || gameGrid[tetro.y + row][tetro.x + column] === 10) {
                renderQueue.push([tetro.x + column, tetro.y + row]);
                
            }
        }
        
        if (++column === 4) {
            column = 0;
            ++row;
        }
    }

    if (renderQueue.length === 4) {
        renderQueue.forEach(e => {
            if (gameGrid[e[1] + 1][e[0]] !== -1 && gameGrid[e[1] + 1][e[0]] !== 10) {
                tetro.locked = true;
            }
            gameGrid[e[1]][e[0]] = 10;
            tetro.blocks.push(e);
            updateCanvas();
        });
    } else {
        throw {name : "NotImplementedError", message : "too lazy to implement"}; 
    }
}

function moveTetromino(distance) { // funktion som rör en bit på  i gamegriden
    let possible = true;
    tetro.blocks.forEach(e => {
        if (distance > 0) {
            if (e[0] === 9) { 
                possible = false;
            }
        } else {
            if (e[0] === 0) { 
                possible = false;
            }
        }
        
        try {
            if (gameGrid[e[1]][e[0] + distance] !== 10 && gameGrid[e[1]][e[0] + distance] !== -1) {
                possible = false;
            }
        } catch {
        }
    });



    if (possible) { // kollar om man är vid kanten eller inte
        tetro.blocks.forEach(e => {
            gameGrid[e[1]][e[0]] = -1;
        });

        tetro.blocks.forEach(e => {
            gameGrid[e[1]][e[0] + distance] = 10;
            e[0] = e[0] + distance;
        });

        updateCanvas();

        tetro.x += distance;
    }
}

function rotateTetromino() { // roterar bitar i gamegriden
    let temp = [];
    let bugfix = [0x44C0, 0x2222, 0x6C0, 0x4C40, 0x4C80];
    let block = Object.values(tetrominos)[tetro.shapeIndex].rotations[tetro.rotation];
    let possible = true;

    temp.push(tetro.rotation);
    temp.push(tetro.blocks);
    temp.push(gameGrid);

    if (bugfix.indexOf(block) > -1) {
        tetro.blocks.forEach(e => {
            if (e[0] === 9) {
                possible = false;
            }
        });
    }

    if (canRotate && possible && !tetro.locked) { // kollar om man kan rotera biten
        canRotate = false;

        if (tetro.rotation === 3) {
            tetro.rotation = 0;
        } else {
            tetro.rotation++;
        }

        tetro.blocks.forEach(e => {
            gameGrid[e[1]][e[0]] = -1;
        });

        tetro.blocks = Array(4);
        
        try { 
            drawTetromino(); 
            temp = [];
        } catch(error) {
            console.log(error.name);
            tetro.rotation = temp[0];
            tetro.blocks = temp[1];
            gameGrid = temp[2];
        }

        setTimeout(function(){ canRotate = true; }, 200);

    }
}

// main canvas setup function
function setupCanvas() {
    tetro.shapeIndex = randomPiece();
    nextPiece = randomPiece();
    drawNextPiece(nextPiece);
    updateCanvas();
    drawTetromino(0);
    mainLoop();

}

// resets board every times something moves and draws it again. (renderar skärmen utefter alla bitars positioner på gamegriden)
function updateCanvas() {
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 21; y++) {
            if (gameGrid[y][x] === -1) {
                ctx.clearRect(x * blockSize, y * blockSize, blockSize, blockSize);
            } else if (gameGrid[y][x] === 10) {            
                ctx.fillStyle = Object.values(tetrominos)[tetro.shapeIndex].color;
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            } else {
                ctx.fillStyle = Object.values(tetrominos)[gameGrid[y][x]].color;
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            }
        }
    }
}

function mainLoop() { // huvud loopen för spelet. Kör varje sekund (lite snabbare beroende på level.)

    if (deleteQueue.length > 0) {
        deleteQueue.forEach(e => {
            gameGrid.splice(e, 1);
            gameGrid.unshift(Array(10).fill().map(a => -1));
        });


        lines += deleteQueue.length;
        linesDisplay.innerHTML = lines;

        score += deleteQueue.length * 30;
        scoreDisplay.innerHTML = score;  
        
        if (score > 100) {
            level++;
            levelDisplay.innerHTML = level + 1;
        }

        if (deleteQueue.length === 4) { // kollar om man fått tetris (4 rader borta på samma gång)
            tetrisDisplay.style.display = "block";
            setTimeout(function() {
                tetrisDisplay.style.display = "none";
            }, 1000);
        }

        deleteQueue = [];
    }

    let possible = true;

    tetro.blocks.forEach(e => {
        if (e[1] === 20) {
            possible = false;
        } else {
            if (gameGrid[e[1] + 1][e[0]] !== -1 && gameGrid[e[1] + 1][e[0]] !== 10) {
                possible = false;
            }
        }
    });


    if (possible) {
        if (!lost) {
        setTimeout(mainLoop, dropDelay);
        }
        tetro.blocks.forEach(e => {
            gameGrid[e[1]][e[0]] = -1;
        });

        tetro.blocks.forEach(e => {
            gameGrid[e[1] + 1][e[0]] = 10;
            e[1] += 1;
        });

        updateCanvas();

        tetro.y += 1;


    } else {
        gameGrid.forEach(e => {
            let lineDone = true;

            e.forEach(q => {
                if (q === -1) {
                    lineDone = false;
                }
            });

            if (lineDone) {
                deleteQueue.push(gameGrid.indexOf(e));
            }
        });

        tetro.blocks.forEach(e => {
            gameGrid[e[1]][e[0]] = tetro.shapeIndex;
        });

        score += 5;
        scoreDisplay.innerHTML = score;  
        
        if (score > 100) {
            level++;
            levelDisplay.innerHTML = level + 1;
        }

        gameGrid[2].forEach(e => {
            if (e !== -1) {
                lost = true;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                loseDisplay.style.display = "block";


            }
        });

        if (!lost) { // skapar en ny bit när den andra nått botten
            tetro = {x: 4, y: 0, blocks: Array(4), shapeIndex: nextPiece, rotation: 0, locked: false};
            nextPiece = randomPiece();
            drawNextPiece(nextPiece);
            dropDelay = calculatedDropDelay;
            updateCanvas();
            drawTetromino(0);
            mainLoop();
        }
    }
}

function randomPiece() { //generar en ny random bit av 20 möjliga. på detta sättet får man minst 4 av en bit under 20 möjliga genereringar
    if (pieces.length == 0) {
        pieces = [0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6];
    }
    
    return (pieces.splice(Math.floor(Math.random() * pieces.length), 1)[0]);
}


// nedan för här är bara keycodes för alla knappar. Som får saker att röra på sig

document.querySelector("body").onkeyup = function(e) { 
    if ((e.keyCode === 40 || e.keyCode === 83) && dropDelay !== calculatedDropDelay) {
        dropDelay = calculatedDropDelay;
    }
};

document.querySelector("body").onkeydown = function(e) {
    switch (e.keyCode) {
        case 37: // left arrow key
            if (canMove) {
                moveTetromino(-1);
                canMove = false;
                setTimeout(function(){ canMove = true; }, 50);
            }
            break;
        case 38: // up arrow key
            rotateTetromino();
            break;
        case 39: // right arrow key
            if (canMove) {
                moveTetromino(1);
                canMove = false;
                setTimeout(function(){ canMove = true; }, 50);
            }
            break;

        case 40: // down arrow key
            if (dropDelay !== 50)  {
                dropDelay = 50;
            }
            break;
        

        // alternative controls

        case 32: // space bar key
            rotateTetromino();

            if (lost) {
                location.reload();
            }
            break;

        case 87: // W key
            rotateTetromino();
            break;

        case 65: // A key
            if (canMove) {
                moveTetromino(-1);
                canMove = false;
                setTimeout(function(){ canMove = true; }, 50);
            }
            break;

        case 83: // S key
            if (dropDelay !== 50)  {
                dropDelay = 50;
            }
            break;

        case 68: // D key
            if (canMove) {
                moveTetromino(1);
                canMove = false;
                setTimeout(function(){ canMove = true; }, 50);
            }
            break;
    }
};

document.addEventListener("DOMContentLoaded", setupCanvas);








