var app = (function(global) {
  var settings = {
    "playerFirstName": "Player1",
    "playerSecondName": "Player2",
    "boardSizeWidth": 19,
    "boardSizeHeight": 19,
  }
  var cellSize = 25;
  var boardWidth = 1 + cellSize * settings["boardSizeWidth"];
  var boardHeight = 1 + cellSize * settings["boardSizeHeight"];

  var canvas = qs("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = boardWidth;
  canvas.height = boardHeight;

  var board = qs("#boardJS");
  var startMenu = qs("#startMenuJS");
  var startGameTwo = qs("#startGameTwo");

  var cellsArray = [];


  $on(startGameTwo, "click", function() {
    qs("#startMenuJS").style.display = "none";
    qs("#boardJS").style.display = "block";
    drawBoard();
    createCellsArray();
  });

  $on(canvas, "click", function(event) {
    getCursorPosition(event);

  });

  function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
  x = e.pageX;
  y = e.pageY;
    }
    else {
  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    x = Math.min(x, boardWidth);
    y = Math.min(y, boardHeight);
        console.log(cellsArray[Math.floor(y/cellSize)][Math.floor(x/cellSize)]);
    return cellsArray[Math.floor(y/cellSize)][Math.floor(x/cellSize)];

}

  function createCellsArray() {
    // cellsArray = new Array([settings["boardSizeWidth"]],[settings["boardSizeHeight"]])
    for (var i = 0; i < settings["boardSizeWidth"]; i++) {
        cellsArray[i] = [];
      for (var j = 0; j < settings["boardSizeHeight"]; j++) {
        cellsArray[i][j] = "0";
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

    /* draw it! */
    ctx.strokeStyle = "#ED9848";
    ctx.stroke();
  }

})(window);
