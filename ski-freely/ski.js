GRID_WIDTH = 31;
GRID_HEIGHT = 25;

BOARD_HEIGHT = 300;
BOARD_WIDTH = 300;

DENSITY = 5;


TREE = 1;
ROCK = 2;
SNOWBANK = 3;

LEEWAY = 3;
INTERVAL = 200;
SKIER_YPOS = 5;

X = 0;
Y = 1;

var skier = {
  init: function(pos) {
    skier.pos = pos;
    skier.left = false;
    skier.right = false;
    skier.down = false;
    skier.speeding = false;
    skier.height = 0;
    skier.direction = 2;
  },

  move: function() {

    if (skier.left) {
      skier.pos[X] -= 1;
    }

    if (skier.right) {
      skier.pos[X] += 1;
    }

    if (skier.speeding) {
      game.slideBoard(3);
    } else if (skier.down) {
      game.slideBoard(1);
    }
  },

  turn: function(pos) {
    var skierX = skier.pos[X];
    var skierY = skier.pos[Y];
    skier.left = false;
    skier.right = false;
    skier.down = true;
    skier.speeding = false;

    
    var newDirection;

    if (pos[X] <= skierX - LEEWAY && pos[Y] >= skierY) {
      // Lower left
      skier.left = true;
      // skierDOM.addClass("ski-downleft");
      newDirection = 1;
      // console.log("Lower left")
    } else if (pos[X] >= skierX + LEEWAY && pos[Y] >= skierY) {
      // lower right
      skier.right = true;
      // skierDOM.addClass("ski-downright");
      newDirection = 3;
      // console.log("lower right")
    } else if (pos[X] <= skierX && pos[Y] <= skierY) {
      // upper left
      skier.down = false;
      // skierDOM.addClass("ski-left");
      newDirection = 4;
      // console.log("upper left")
    } else if (pos[X] >= skierX && pos[Y] <= skierY) {
      // upper right
      skier.down = false;
      // skierDOM.addClass("ski-right");
      newDirection = 6;
      // console.log("upper right")
    } else  {
      // straight down
      skier.speeding = true;
      // skierDOM.addClass("ski-down");
      newDirection = 2;
      // console.log("straight down")
    }

    if (skier.direction !== newDirection) {
      skier.direction = newDirection;
    }
  },

  changeImage: function(direction) {
    var skierDOM = $('#skier');

    switch(direction) {
      case 4:
        skierDOM.addClass("ski-left");
        break;
      case 6:
        skierDOM.addClass("ski-right");
        break;
      case 1:
        skierDOM.addClass("ski-downleft");
        break;
      case 2:
        skierDOM.addClass("ski-down");
        break;
      case 3:
        skierDOM.addClass("ski-downright");
        break;
    }
  }
};

var game = {
  width: GRID_WIDTH,
  height: GRID_HEIGHT,

  init: function() {
    var pos = [Math.floor(game.width / 2), SKIER_YPOS];
    game.interval = INTERVAL;
    skier.init(pos);
    game.createBoard();
  },

  slideBoard: function (rows) {
    for (var i = 0; i < rows; i++) {
      game.board.splice(0, 1);
      if (game.occupied(skier.pos) && skier.height < 2) {
        game.over();
        return false;
      }
    }

    for (var j = 0; j < rows; j++) {
      var row = [];
      for (var x = 0; i < BOARD_WIDTH; i++) {
        row.push(0);
      }
      game.board.push(row);
    }
      
    for (var i; i < DENSITY; i++) {
      game.addObstacle();
    }
  },

  occupied: function(pos) {
    if (game.board[pos[Y]][pos[X]] > 0) {
      return true;
    }

    return false;
  },

  addObstacle: function(posY) {
    var x = Math.floor(Math.random() * BOARD_WIDTH);
    var y = posY || game.board.length - 1;

    game.board[y][x] = Math.floor(Math.random() * 3) + 1;
    // game.obstacles.push( new Obstacle([x, y], Math.floor(Math.random() * 3)) );
  },

  deleteObstacle: function(index) {
    game.board[y][x] = 0;
  },

  createBoard: function() {
    game.board = [];
    for (var y = 0; y < BOARD_HEIGHT; y++) {
      var row = [];

      for (var x = 0; x < BOARD_WIDTH; x++) {
        row.push(0);
      }

      game.board.push(row);

      for (var i = 0; i < DENSITY; i++) {
        game.addObstacle(y);
      }
    }
  },

  tick: function (key) {
    skier.move();
    console.log(game.board.length)
    // hit something?
    if ( game.occupied(skier.pos) ) {
      game.over();
    }

    if (skier.height > 0) {
      skier.height--;
    }

    view.render();
  },

  over: function() {
    clearInterval(game.loop);
    $('#ski-home').off("mousemove");
    $('#ski-home').off("click");
    $('#ski-home').after('<h1>GAME OVER!</h1>');
  }
};

var view = {
  init: function() {
    $('#ski-home').on("mousemove", "div", controller.mouseHandler );
    $('#ski-home').on("click", controller.clicker );
    view.render();
  },

  render: function() {
    var $board = $("#ski-home");
    $board.html("");

    var beginX = skier.pos[X] - Math.floor(game.width / 2),
        beginY = 0,
        endX = beginX + GRID_WIDTH,
        endY = GRID_HEIGHT;

    for(var y = beginY; y < endY; y++ ) {
      var $row = $("<div class='row'></div>");

      for(var x = beginX; x < endX; x++ ) {
        $box = $("<div class='box'></div>")
                .attr("data-x", x)
                .attr("data-y", y);

        // check box for things
        if (skier.pos[X] === x && skier.pos[Y] - skier.height === y ) {
          $box.attr("id", "skier");
        }

        if ( game.occupied([x,y]) ) {
          switch(game.board[y][x]) {
            case 1:
              $box.addClass("tree");
              break;
            case 2:
              $box.addClass("rock");
              break;
            default:
              $box.addClass("snow");
              break;
          }
        }

        $row.append($box);
      }

      $board.append($row);
      skier.changeImage(skier.direction);
    }
  }
};

var controller = {
  init: function() {
    game.init();
    view.init();
    game.loop = setInterval(game.tick, game.interval);
  },

  mouseHandler: function (e) {
    skier.turn([$(e.target).data('x'), $(e.target).data('y')]);
  },

  clicker: function() {
    skier.height = 4;
  },
};

$(document).ready(function() {
  controller.init();
});