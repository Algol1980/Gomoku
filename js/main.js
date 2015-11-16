var app = (function(global) {
  var check = "X";
  var settings = {
    "playerFirstName": qs('#playerNameCross').value,
    "playerSecondName": qs('#playerNameNull').value,
    "boardSizeWidth": qs('#boardSizeInput').value,
    "boardSizeHeight": qs('#boardSizeInput').value,
    "status": " Ходит: " + check

  }


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




  $on(startGameTwo, "click", function() {
    qs("#startMenuJS").style.display = "none";
    qs("#boardJS").style.display = "block";
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
  
  function startNewGame() {
    drawBoard();
    createCellsArray();
  }

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
      isWin(pos);
      setCheck('O');
    } else {
      drawNull(pos);
      isWin(pos);
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

  function createCellsArray() {
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
    left > settings["boardSizeWidth"] - 5 ? left = settings["boardSizeWidth"] - 1 : left;
    console.log("Top: " + top, "left: " + left, "bottom: " + bottom, "right: " + right);

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
    var tmpX, tmpY, rtmpX, rtmpY;
    for (var i = 0; i < 9; i++) {
      if (left + i >= 18) {
        tmpX = 18;
        rtmpX = 18;
      } else {
        tmpX = left + i;
        rtmpX = left + i;
      }
      if (top + i >= 18) {
        tmpY = 18;
      } else {
        tmpY = top + i
      }
      if (bottom - i >= 18) {
        rtmpY = 18;
      } else {
        rtmpY = bottom - i
      }

      console.log("tmpX: " + tmpX, "tmpY: " + tmpY, "rtmpX: " + rtmpX, "rtmpY: " + rtmpY);
      if (cellsArray[tmpX][tmpY] == check) {
        diag++;
      } else {
        diag = 0;
      }
      if (diag == 5 || rdiag == 5) {
        showModalEndgame();
        return;
      }

      if (cellsArray[rtmpX][rtmpY] == check) {
        rdiag++;
      } else {
        rdiag = 0;
      }
      if (diag == 5 || rdiag == 5) {
        showModalEndgame();
        return;
      }
      console.log(diag, rdiag);
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