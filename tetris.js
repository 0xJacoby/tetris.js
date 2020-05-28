// Written by Jacob Sundh 28/5-20

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let gameGrid = Array(10).fill().map(a => Array(21).fill().map(a => -1)); // 10x21 block grid for pieces
let tetro = {x: 0, y: 0, blocks: Array(4), shapeIndex: 1}; // the current position of the moving piece and its blocks.

const blockSize = 40; // size of one block

// All the different tetris shapes and their rotations. Thoroughly explained in the documentation.
let tetrominos = {
    i: { rotations: [0x0F00, 0x2222, 0x00F0, 0x4444], img: "url()", color: "cyan" },
    j: { rotations: [0x44C0, 0x8E00, 0x6440, 0x0E20], img: "url()", color: "blue" },
    l: { rotations: [0x4460, 0x0E80, 0xC440, 0x2E00], img: "url()", color: "orange" },
    o: { rotations: [0xCC00, 0xCC00, 0xCC00, 0xCC00], img: "url()", color: "yellow" },
    s: { rotations: [0x06C0, 0x8C40, 0x6C00, 0x4620], img: "url()", color: "green" },
    t: { rotations: [0x0E40, 0x4C40, 0x4E00, 0x4640], img: "url()", color: "purple" },
    z: { rotations: [0x0C60, 0x4C80, 0xC600, 0x2640], img: "url()", color: "red" }
};

function drawTetromino(rotation) {
    let row = 0, column = 0;
    let shape = Object.values(tetrominos)[tetro.shapeIndex];
    let block = shape.rotations[rotation];
    ctx.fillStyle = shape.color;

    for (let bit = 0x8000; bit > 0; bit = bit >> 1) {
        if (block & bit) {
            tetro.blocks.push([tetro.x + column, tetro.y + row]);
            gameGrid[tetro.x + column][tetro.y + row] = tetro.shapeIndex;
            updateCanvas();
        }
        
        if (++column === 4) {
            column = 0;
            ++row;
        }
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
    });

    if (possible) {
        tetro.blocks.forEach(e => {
            gameGrid[e[0]][e[1]] = -1;
        });

        tetro.blocks.forEach(e => {
            gameGrid[e[0] + distance][e[1]] = tetro.shapeIndex;
            e[0] = e[0] + distance;
        });

        updateCanvas();

        tetro.x += distance;
    }
}

// main canvas setup function
function setupCanvas() {
    updateCanvas();

    drawTetromino(0);

}

// resets board every times something moves and draws it again.
function updateCanvas() {
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 21; y++) {
            if (gameGrid[x][y] === -1) {
                ctx.clearRect(x * blockSize, y * blockSize, blockSize, blockSize);
            } else {
                ctx.fillStyle = Object.values(tetrominos)[gameGrid[x][y]].color;
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            }
        }
    }
}

document.querySelector('body').onkeydown = function(e) {
    switch (e.keyCode) {
        case 37: // left arrow key
            moveTetromino(-1);
            break;
        case 38: // up arrow key

            break;
        case 39: // right arrow key
            moveTetromino(1);
            break;

        case 40: // down arrow key

            break;
    }
};

document.addEventListener("DOMContentLoaded", setupCanvas);








