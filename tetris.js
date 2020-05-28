// Written by Jacob Sundh 28/5-20

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let gameGrid = Array(10).fill().map(a => Array(21).fill().map(a => -1)); // 10x21 block grid for pieces
let tetro = {x: 4, y: 0, blocks: Array(4), shapeIndex: 1, rotation: 0, locked: false}; // the current position of the moving piece and its blocks.
let canMove = true;
let canRotate = true;
let level = 0;
let calculatedDropDelay = 900 * (1 - (level * 0.01));
let dropDelay = calculatedDropDelay;

const blockSize = 40; // size of one block

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

function drawTetromino() {
    let row = 0, column = 0;
    let shape = Object.values(tetrominos)[tetro.shapeIndex];
    let block = shape.rotations[tetro.rotation];
    let renderQueue = [];

    for (let bit = 0x8000; bit > 0; bit = bit >> 1) {
        if (block & bit) {
            if (gameGrid[tetro.x + column][tetro.y + row] === -1 || gameGrid[tetro.x + column][tetro.y + row] === 10) {
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
            if (gameGrid[e[0]][e[1] + 1] !== -1 && gameGrid[e[0]][e[1] + 1] !== 10) {
                tetro.locked = true;
            }
            gameGrid[e[0]][e[1]] = 10;
            tetro.blocks.push(e);
            updateCanvas();
        });
    } else {
        throw "error";
    }
}

function moveTetromino(distance) {
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
            if (gameGrid[e[0] + distance][e[1]] !== 10 && gameGrid[e[0] + distance][e[1]] !== -1) {
                possible = false;
            }
        } catch {
        }
    });



    if (possible) {
        tetro.blocks.forEach(e => {
            gameGrid[e[0]][e[1]] = -1;
        });

        tetro.blocks.forEach(e => {
            gameGrid[e[0] + distance][e[1]] = 10;
            e[0] = e[0] + distance;
        });

        updateCanvas();

        tetro.x += distance;
    }
}

function rotateTetromino() {
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

    if (canRotate && possible && !tetro.locked) {
        canRotate = false;

        if (tetro.rotation === 3) {
            tetro.rotation = 0;
        } else {
            tetro.rotation++;
        }

        tetro.blocks.forEach(e => {
            gameGrid[e[0]][e[1]] = -1;
        });

        tetro.blocks = Array(4);
        
        try { 
            drawTetromino(); 
            temp = [];
        } catch {
            tetro.rotation = temp[0];
            tetro.blocks = temp[1];
            gameGrid = temp[2];
        }

        setTimeout(function(){ canRotate = true; }, 200);

    }
}

// main canvas setup function
function setupCanvas() {
    updateCanvas();
    drawTetromino(0);
    mainLoop();

}

// resets board every times something moves and draws it again.
function updateCanvas() {
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 21; y++) {
            if (gameGrid[x][y] === -1) {
                ctx.clearRect(x * blockSize, y * blockSize, blockSize, blockSize);
            } else if (gameGrid[x][y] === 10) {            
                ctx.fillStyle = Object.values(tetrominos)[tetro.shapeIndex].color;
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            } else {
                ctx.fillStyle = Object.values(tetrominos)[gameGrid[x][y]].color;
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            }
        }
    }
}

function mainLoop() {
    let possible = true;
    // let lowestBlock = [[0,0]];
    // tetro.blocks.forEach(e => {
    //     if (e[1] > lowestBlock[0][1]) {
    //         lowestBlock = [];
    //         lowestBlock.push(e);
    //     } else if (e[1] == lowestBlock[0][1]) {
    //         lowestBlock.push(e);
    //     }
    // });

    tetro.blocks.forEach(e => {
        if (e[1] === 20) {
            possible = false;
        } else {
            if (gameGrid[e[0]][e[1] + 1] !== -1 && gameGrid[e[0]][e[1] + 1] !== 10) {
                possible = false;
            }
        }
    });


    if (possible) {
        setTimeout(mainLoop, dropDelay);
        tetro.blocks.forEach(e => {
            gameGrid[e[0]][e[1]] = -1;
        });

        tetro.blocks.forEach(e => {
            gameGrid[e[0]][e[1] + 1] = 10;
            e[1] += 1;
        });

        updateCanvas();

        tetro.y += 1;


    } else {
        tetro.blocks.forEach(e => {
            gameGrid[e[0]][e[1]] = tetro.shapeIndex;
        });

        tetro = {x: 4, y: 0, blocks: Array(4), shapeIndex: 1, rotation: 0, locked: false};
        dropDelay = calculatedDropDelay;
        updateCanvas();
        drawTetromino(0);
        mainLoop();
    }
}

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








