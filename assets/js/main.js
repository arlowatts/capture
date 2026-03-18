// initialize the board array
const width = 8;
const height = 8;
const board = new Array(width * height);

// initialize the main element
const mainElement = document.createElement("main");
document.body.append(mainElement);

// initialize the board element
const boardElement = document.createElement("div");
boardElement.classList.add("board");
mainElement.append(boardElement);

// initialize the tile elements
const tileElements = new Array(width * height);

for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {

        let tile = document.createElement("div");
        tileElements[i * width + j] = tile;

        tile.classList.add("tile");

        if ((i + j) % 2 === 0)
            tile.classList.add("white");
        else
            tile.classList.add("black");

        tile.style.top = `${100 * i / height}%`;
        tile.style.left = `${100 * j / width}%`;

        tile.style.width = `${100 / width}%`;
        tile.style.height = `${100 / height}%`;

        let image = document.createElement("img");
        image.src = "";

        tile.addEventListener("click", () => highlightMoves(i, j));

        boardElement.append(tile);
        tile.append(image);
    }
}

// initialize an array of board tile indices
const indices = new Array(width * height);

for (let i = 0; i < height; i++)
    for (let j = 0; j < width; j++)
        indices[i * width + j] = [i, j];

const pieceValues = {
    pawn:   0,
    rook:   1,
    knight: 2,
    bishop: 3,
    queen:  4,
    king:   5,
};

const pieceImages = Object.keys(pieceValues).map((x) => "assets/images/" + x + ".svg");

const regularPieces = [pieceValues.pawn, pieceValues.rook, pieceValues.knight, pieceValues.bishop, pieceValues.queen];
const initialPiece = pieceValues.king;

const pieceMoves = [];
pieceMoves[pieceValues.pawn]   = (i, j) => indices.filter((x) => (x[0] === i - 1) && Math.abs(x[1] - j) === 1);
pieceMoves[pieceValues.rook]   = (i, j) => indices.filter((x) => (x[0] === i) !== (x[1] === j));
pieceMoves[pieceValues.knight] = (i, j) => indices.filter((x) => Math.abs((x[0] - i) * (x[1] - j)) === 2);
pieceMoves[pieceValues.bishop] = (i, j) => indices.filter((x) => (x[0] + x[1] === i + j) !== (x[0] - x[1] === i - j));
pieceMoves[pieceValues.queen]  = (i, j) => indices.filter((x) => ((x[0] === i) !== (x[1] === j)) || ((x[0] + x[1] === i + j) !== (x[0] - x[1] === i - j)));
pieceMoves[pieceValues.king]   = (i, j) => indices.filter((x) => (Math.abs(x[0] - i) <= 1) && (Math.abs(x[1] - j) <= 1) && ((x[0] !== i) || (x[1] !== j)));

placeInitialPiece();

function highlightMoves(i, j) {
    for (let k = 0; k < width * height; k++)
        tileElements[k].classList.remove("filled");

    let value = getTile(i, j);

    if (value !== null) {
        let moves = pieceMoves[value](i, j);

        for (const move of moves)
            tileElements[move[0] * width + move[1]].classList.add("filled");
    }
}

function placeInitialPiece() {
    let i = Math.floor(Math.random() * height);
    let j = Math.floor(Math.random() * width);

    setBoard(null);
    setTile(i, j, initialPiece);
}

// return the value of the tile at (i, j)
function getTile(i, j) {
    if (i < 0 || j < 0 || i >= height || j >= width) throw new Error(`Index ${i}, ${j} out of range`);

    return board[i * width + j];
}

// set the value of the tile at (i, j)
function setTile(i, j, value) {
    if (i < 0 || j < 0 || i >= height || j >= width) throw new Error(`Index ${i}, ${j} out of range`);
    if (value !== null && !Object.values(pieceValues).includes(value)) throw new Error(`Value ${value} out of range`);

    let index = i * width + j;

    board[index] = value;

    if (value === null)
        tileElements[index].firstChild.src = "";

    else
        tileElements[index].firstChild.src = pieceImages[value];
}

// set the value of all tiles on the board
function setBoard(value) {
    for (let i = 0; i < height; i++)
        for (let j = 0; j < width; j++)
            setTile(i, j, value);
}
