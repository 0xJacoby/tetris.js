// Written by Jacob Sundh 28/5-20

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let gameGrid = Array(10).fill().map(a => Array(21).fill().map(a => -1)); // 10x21 block grid for pieces

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

function drawTermino(shape, x, y, rotation) {
    let row = 0, column = 0;
    let block = shape.rotations[rotation];
    ctx.fillStyle = shape.color;

    for (let bit = 0x8000; bit > 0; bit = bit >> 1) {
        if (block & bit) {

            updateCanvas();
        }
        
        if (++column === 4) {
            column = 0;
            ++row;
        }
    }
}

// main canvas setup function
function setupCanvas() {
    updateCanvas();

    drawTermino(tetrominos.l, 40, 40, 0);


}

// resets board every times something moves and draws it again.
function updateCanvas() {
    
}

document.addEventListener("DOMContentLoaded", setupCanvas);








