var app = (function(global) {
  var check = "X";
  var settings = {
    "playerFirstName": qs('#playerNameCross').value,
    "playerSecondName": qs('#playerNameNull').value,
    "boardSizeWidth": qs('#boardSizeInput').value,
    "boardSizeHeight": qs('#boardSizeInput').value,
    "status": " Ходит: " + check

  }

  qs("#statusJS").innerHTML = "Ходит: " + check;
  $bindModelInput(settings, 'playerFirstName', qs('#playerNameCross'));
  $bindModelInput(settings, 'playerSecondName', qs('#playerNameNull'));
  $bindModelInput(settings, 'boardSizeWidth', qs('#boardSizeInput'));

  qs('#playerNameCross').onchange = function() {
    settings.playerFirstName = settings.playerFirstName;
    qs("#playerF").innerHTML = settings.playerFirstName;
  };
  qs('#playerNameNull').onchange = function() {
    settings.playerSecondName = settings.playerSecondName;
    qs("#playerS").innerHTML = settings.playerSecondName;
  };
  qs('#boardSizeInput').onchange = function() {
    settings.boardSizeWidth = settings.boardSizeWidth;
    settings.boardSizeHeight = settings.boardSizeWidth;
  };

  qs("#playerF").innerHTML = settings.playerFirstName;
  qs("#playerS").innerHTML = settings.playerSecondName;

  function setCheck(newCheck) {
    check = newCheck;
    qs("#statusJS").innerHTML = "Ходит: " + check;

  }

  function setWinner(check) {
    qs("#endGameStatusJs").innerHTML = "Победил: " + check;
  }

  var cellSize = 25;


  var canvas = qs("canvas");
  var ctx = canvas.getContext("2d");
  var boardWidth, boardHeight;


  var board = qs("#boardJS");
  var startMenu = qs("#startMenuJS");
  var endGame = qs("#endGameJS");
  var startGameTwo = qs("#startGameTwo");
  var accordeonJS = qsa(".accContainer");

  var pauseListening = false;

  var cellsArray = [];


  endGame.onclick = function(event) {
    event.preventDefault();

    var target = event.target;
    if (target.id == 'ok') {
      startNewGame();
    }
    if (target.id == 'no') {
      endGame.style.display = "none";
      startMenu.style.display = "block";
    }
  }

  $on(startGameTwo, "click", function() {
    startMenu.style.display = "none";
    startNewGame();
  });


  var acc = qs(".startMenu"),
    liElement = acc.querySelectorAll(".accord"),
    size = liElement.length,
    i, liNode;

  for (i = 0; i < size; i++) {
    liNode = liElement[i];
    liNode.nextElementSibling.classList.add("closed");

    liNode.onclick = function() {
      var li = this;
      li.nextElementSibling.classList.toggle("closed");
    }
  }


  var listener = function(event) {
    if (pauseListening) {
      return false;
    }
    var position = getCursorPosition(event);
    checkPosition(position);
  };

  canvas.addEventListener('click', listener, false);




  function startNewGame() {
    if (endGame.style.display == "block") {
      endGame.style.display = "none";
    }
    board.style.display = "block";
    pauseListening = false;
    drawBoard();
    createcellsArray();
  }


  function showModalEndgame() {
    setWinner(check);
    pauseListening = true;
    canvas.removeEventListener();
    board.style.display = "none";
    endGame.style.display = "block";

  };

  function getCursorPosition(e) {
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
    if (check == 'X') {
      drawCross(pos);
      if (isWin(pos)) {
        showModalEndgame();
      }
      setCheck('O');
    } else {
      drawNull(pos);
      if (isWin(pos)) {
        showModalEndgame();
      }
      setCheck('X');
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

  function createcellsArray() {
    for (var i = 0; i < settings["boardSizeWidth"]; i++) {
      cellsArray[i] = [];
      for (var j = 0; j < settings["boardSizeHeight"]; j++) {
        cellsArray[i][j] = 0;
      };
    };

  };

  function drawBoard() {
    boardWidth = 1 + cellSize * settings["boardSizeWidth"];
    boardHeight = 1 + cellSize * settings["boardSizeHeight"];
    canvas.width = boardWidth;
    canvas.height = boardHeight;
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


  function lineCount(check, pos, dirX, dirY) {
    var count = 1;
    var r, c;
    r = pos[0] + dirX;
    c = pos[1] + dirY;

    while (r >= 0 && r < settings.boardSizeWidth && c >= 0 && c < settings.boardSizeWidth && cellsArray[r][c] == check) {
      count++;
      r += dirX;
      c += dirY;
    }

    win_row1 = r - dirX;
    win_column1 = c - dirY;
    r = pos[0] - dirX;
    c = pos[1] - dirY;
    while (r >= 0 && r < settings.boardSizeWidth && c >= 0 && c < settings.boardSizeWidth && cellsArray[r][c] == check) {
      count++;
      r -= dirX;
      c -= dirY;
    }

    win_row2 = r + dirX;
    win_column2 = c + dirY;
    return count;

  }

  function isWin(pos) {

    if (lineCount(check, pos, 1, 0) >= 5) {
      return true;
    }
    if (lineCount(check, pos, 0, 1) >= 5) {
      return true;
    }
    if (lineCount(check, pos, 1, -1) >= 5) {
      return true;
    }
    if (lineCount(check, pos, 1, 1) >= 5) {
      return true;
    } else {
      win_r1 = -1;
      return false;
    }

  } 




})(window);
