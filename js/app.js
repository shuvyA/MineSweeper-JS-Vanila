'use strict';

console.log('THe SPRINT 1 -->> Shuvy Ankor');

var gBoard = [];

var gLevel = {
    SIZE: 6,
    MINES: 4
}

var gContMines = 0;
var gState = {
    isGameOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gInterval = 0;
var gStartTime = 0;

var SMILE_SAD_IMG = '<img src="img/sad.png">';
var SMILE_NORMAL_IMG = '<img src="img/normal.png">';
var SMILE_HAPPY_IMG = '<img src="img/sun.png">';

var BOMB_IMG = '<img src="img/1.png">';
var FLAG_IMG = '<img src="img/flag.png">';


//Play Fn initGame() in Body -- onload-->

function initGame() {
    gState.isGameOn = true;
    buildBoard();
    findMinesNgs(gBoard);
}

function updateClock() {
    if (gState.isGameOn) {
        var elClock = document.querySelector('.timer');
        gState.secsPassed = (Date.now() - gStartTime) / 1000;
        elClock.innerText = gState.secsPassed
        checkGameOver();
    }
}

function getRandomMines(mines) {

    if (Math.random() > 0.7) {
        if (gContMines === mines) return false;
        else {
            gContMines++;
            return true;
        }
    } else return false;
}



function buildBoard() {

    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {

            var bomb = getRandomMines(gLevel.MINES);

            board[i][j] = {
                bombsAroundCount: 0,
                isShown: false,
                isBomb: bomb,
                isMarked: false,
            };
        }
    }
    gBoard = board;
    return gBoard;
}

function renderBoard(board) {

    var elTbBoard = document.querySelector('.tb-board');

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var className = getClassName(i, j);
            var cell = board[i][j];
            strHTML += '<td class="' + className + '" onmousedown="cellMarked(event, this,' + i + ',' + j + ')"' +
                'onclick="cellClicked(this,' + i + ',' + j + ')"> '

            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    elTbBoard.innerHTML = strHTML;
}




function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];

    if (gStartTime === 0) {
        gStartTime = Date.now();
        gInterval = setInterval(updateClock, 500);
    }
    if (!gState.isGameOn && !checkGameOver()) return;


    //User has found a bomb
    if (cell.isBomb) {
        console.log('bomb');
        renderCell(i, j, BOMB_IMG);
        cell.isShown = true;
        gState.shownCount++;
        gState.isGameOn = false;


        //nbs cell-->>>
    } else if (cell.bombsAroundCount > 0) {
        renderCell(i, j, cell.bombsAroundCount);
        cell.isShown = true;
        gState.shownCount++;

        // console.log(cell.bombsAroundCount, 'nbs');

        //empty cell
    } else if (cell.bombsAroundCount === 0) {

        expandShown(i, j);
    }
    // console.log(i, j, 'sim lev GOLEM');
}


// MARK--FLAG--->>>>>
function cellMarked(event, elCell, i, j) {

    if (event.button === 2) {
        var cell = gBoard[i][j];

        if (!cell.isShown) {
            renderCell(i, j, FLAG_IMG);
            cell.isMarked = true;
            cell.isShown = true;
            gState.shownCount++;
            gState.markedCount++;

            // console.log('right mouse', i, j);
        }
    }
}

function checkGameOver() {
    if (gLevel.SIZE * gLevel.SIZE === gState.shownCount) {
        gState.isGameOn = false;
        alert('Winner!!');
        return true;
    }

}

function findMinesNgs(board) {

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (setMinesNegsCount(i, j) > 0) {

                board[i][j].bombsAroundCount = setMinesNegsCount(i, j);
            }
        }
    }
    gBoard = board;
    console.table(gBoard);
    renderBoard(gBoard);
}




function setMinesNegsCount(cellI, cellJ) {

    var count = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isBomb === true) count++;
        }
    }
    return count;
}


function getClassName(i, j) {
    var cellClass = 'cell-' + i + '-' + j;
    return cellClass;
}

function renderCell(i, j, value) {
    var cellSelector = '.' + getClassName(i, j)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}



function expandShown(cellI, cellJ) {

    for (var i = cellI - 2; i <= cellI + 2; i++) {
        if (i < 0 || i >= gBoard.length) continue;

        for (var j = cellJ - 2; j <= cellJ + 2; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i < 0 || i >= gBoard.length) continue;

            var cell = gBoard[i][j];
            if (cell.isBomb === true) continue;
            if (cell.isShown === true) continue;

            if (cell.bombsAroundCount > 0) {
                renderCell(i, j, cell.bombsAroundCount);
                cell.isShown = true;
                gState.shownCount++;
            } else {
                cell.isShown = true;
                gState.shownCount++;
                var className = getClassName(i, j);
                document.querySelector('.' + className).classList.add('mark');
            }
        }
    }
}
