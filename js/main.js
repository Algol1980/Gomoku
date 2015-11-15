var app = (function(global) {
  var settings = {
    "playerFirstName": "Player1",
    "playerSecondName": "Player2",
    "boardSizeWidth": 19,
    "boardSizeHeight": 19,
  }
  var check = "x";

  var cellSize = 25;
  var boardWidth = 1 + cellSize * settings["boardSizeWidth"];
  var boardHeight = 1 + cellSize * settings["boardSizeHeight"];

  var canvas = qs("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = boardWidth;
  canvas.height = boardHeight;


  var board = qs("#boardJS");
  var startMenu = qs("#startMenuJS");
  var endGame = qs("#endGameJS");
  var startGameTwo = qs("#startGameTwo");

  var pauseListening = false;

  var cellsArray = [];


  $on(startGameTwo, "click", function() {
    qs("#startMenuJS").style.display = "none";
    qs("#boardJS").style.display = "block";
    startNewGame();
  });

  // $on(canvas, "click", function(event) {
  //     var position = getCursorPosition(event);
  //     checkPosition(position);

  // });

var listener = function (event) {
  if (pauseListening) {
      return false;
    }
   var position = getCursorPosition(event);
    checkPosition(position);
};

canvas.addEventListener('click', listener, false);


  $on(qs("#endGameJS"), "click", function(event) {
    var position = getCursorPosition(event);
    checkPosition(position);
  });

  endGame.onclick = function(event) {
    event.preventDefault();
    var target = event.target;
    if (target.id == 'ok') {
        startNewGame();
    }
    if (target.id == 'no') {
      window.location = "http://javascript.ru"
    }
  }


  // $delegate(qs("#ok"), qs("#endGameJS"), "click", startNewGame);

function startNewGame() {
    drawBoard();
    createCellsArray();
}

  function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    x = Math.min(x, boardWidth);
    y = Math.min(y, boardHeight);
    return [Math.floor(x / cellSize), Math.floor(y / cellSize)];

  }

  function checkPosition(pos) {
    if (cellsArray[pos[0]][pos[1]] != 0) {
      return;
    }
    cellsArray[pos[0]][pos[1]] = check;
    if (check == 'x') {
      drawCross(pos);
      console.log(pos);
      isWin(pos);
      check = 'o';
    } else {
      drawNull(pos);
      console.log(pos);
      isWin(pos);
      check = 'x';
    }
  }

  function drawCross(pos) {
    var x = pos[0] * cellSize;
    var y = pos[1] * cellSize;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + cellSize, y + cellSize);
    ctx.moveTo(x + cellSize, y);
    ctx.lineTo(x, y + cellSize);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ED9848";
    ctx.stroke();
  }

  function drawNull(pos) {
    var column = pos[0];
    var row = pos[1];
    var x = (column * cellSize) + (cellSize / 2);
    var y = (row * cellSize) + (cellSize / 2);
    var radius = (cellSize / 2) - (cellSize / 10);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.strokeStyle = "#ED9848";
    ctx.lineWidth = 2;
    ctx.stroke();
  }



  function createCellsArray() {
    // cellsArray = new Array([settings["boardSizeWidth"]],[settings["boardSizeHeight"]])
    for (var i = 0; i < settings["boardSizeWidth"]; i++) {
      cellsArray[i] = [];
      for (var j = 0; j < settings["boardSizeHeight"]; j++) {
        cellsArray[i][j] = 0;
      };
    };

  };

  function drawBoard() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();

    for (var x = 0; x <= ctx.canvas.width; x += cellSize) {
      ctx.moveTo(0.5 + x, 0);
      ctx.lineTo(0.5 + x, ctx.canvas.height);
    }

    for (var y = 0; y <= ctx.canvas.height; y += cellSize) {
      ctx.moveTo(0, 0.5 + y);
      ctx.lineTo(ctx.canvas.width, 0.5 + y);
    }
    ctx.strokeStyle = "#ED9848";
    ctx.stroke();
  }


  function isWin(pos) {

    var diag, rdiag, horizontal, vertical;
    horizontal = vertical = diag = rdiag = 0;
    var top, left, bottom, right;
    top = pos[1] - 4;
    left = pos[0] - 4;
    bottom = pos[1] + 4;
    right = pos[0] + 4;
    diag = rdiag = 0;
    top < 0 ? top = 0 : top;
    left < 0 ? left = 0 : left;

    bottom > settings["boardSizeWidth"] - 5 ? bottom = settings["boardSizeWidth"] - 1 : bottom;
    right > settings["boardSizeWidth"] - 5 ? right = settings["boardSizeWidth"] - 1 : right;
    console.log(top, left, bottom, right);

    for (var i = 0; i < settings["boardSizeWidth"] - 1; i++) {

      if (cellsArray[pos[0]][i] == check) {
        vertical++;
      } else {
        vertical = 0;
      }

      if (cellsArray[i][pos[1]] == check) {
        horizontal++;
      } else {
        horizontal = 0;
      }

      if (horizontal == 5 || vertical == 5) {
        showModalEndgame();
        return;
      }
    }

    for (var i = 0; i < 9; i++) {
      if (cellsArray[left + i][top + i] == undefined) {
        break;
      }
      if (cellsArray[left + i][top + i] == check) {
        diag++;
      } else {
        diag = 0;
      }
            if (diag == 5 || rdiag == 5) {
        showModalEndgame();
        return;
      }
    
      if (cellsArray[left + i][bottom - i] == undefined) {
        break;
      }
      if (cellsArray[left + i][bottom - i] == check) {
        rdiag++;
      } else {
        rdiag = 0;
      }
      if (diag == 5 || rdiag == 5) {
        showModalEndgame();
        return;
      }
      // console.log(diag, rdiag);
    }
  }

  function showModalEndgame() {
    pauseListening = true;
    canvas.removeEventListener();
    canvas.style.visibility = "hidden";
    qs("#boardJS").style.display = "none";
    qs("#endGameJS").style.display = "block";
  };


  






})(window);
