// start slingin' some d3 here.
var gameSettings = {
  enemyNum: 2,
  boardSize: 800,
  enemySize: 50,
  playerSize: 40,
  speed: 5000,
  isRunning: false
};
var left = 10;

// Enemies
var enemies = new Array(gameSettings.enemyNum).fill(0); // x values

// create the board with d3 to get a reference to that object
var gameBoard = d3.select('.game')
  .append('div')
  .attr('class', 'board')
  .style('height', function(element) {
    return gameSettings.boardSize + 'px';
  })
  .style('width', function(element) {
    return gameSettings.boardSize + 'px';
  });

// on board object, attach click event
gameBoard.on('click', function() {
  if (gameSettings.isRunning) {
    return;
  }
  gameSettings.isRunning = true;
  
  // set up player dragging
  var drag = d3.behavior.drag()
                        .on('drag', function(d) {
                          d3.select(this)
                            .style('top', function(d) {
                              if (d3.event.y < 0) {
                                return 0 + 'px';
                              }
                              if (d3.event.y > (gameSettings.boardSize - gameSettings.playerSize)) {
                                return (gameSettings.boardSize - gameSettings.playerSize) + 'px';
                              }
                              return (d3.event.y - (gameSettings.playerSize / 2)) + 'px';
                            })
                            .style('left', function(d) {
                              if (d3.event.x < 0) {
                                return 0 + 'px';
                              }
                              if (d3.event.x > (gameSettings.boardSize - gameSettings.playerSize)) {
                                return (gameSettings.boardSize - gameSettings.playerSize) + 'px';
                              }
                              return (d3.event.x - (gameSettings.playerSize / 2)) + 'px';
                            });
                        });

  var player = d3.select('.board')
                 .append('svg')
                 .attr('class', 'player')
                 .style('top', function(element) {
                   return (event.offsetY - (gameSettings.playerSize / 2)) + 'px';
                 })
                 .style('left', function(element) {
                   return (event.offsetX - (gameSettings.playerSize / 2)) + 'px';
                 })
                 .call(drag);

  //trigger game start
  updateEnemyLocations(enemies);
  setInterval(function() {
    updateEnemyLocations(enemies);
  }, gameSettings.speed);
});

// update function that takes an array of enemies
var updateEnemyLocations = function(data) {
  // add the new added enemies, in most cases its only for the first round
  var selection = d3.select('.board').selectAll('.enemy').data(data);

  // random location helper function
  var randomLocation = function() {
    return Math.floor(Math.random() * (gameSettings.boardSize - gameSettings.enemySize));
  };

  // for all the old elements, update location
  selection
    // transition
    .transition()
      .duration(gameSettings.speed)
      //css top = random
      .style('top', function(enemy) {
        return randomLocation() + 'px';
      })
      // css left = random
      .style('left', function(enemy) {
        return randomLocation() + 'px';
      });
      
  // new Elements needs a location
  selection.enter().append('svg')
    .attr('class', 'enemy')
    .style('top', function(enemy) {
      return randomLocation() + 'px';
    })
    .style('left', function(enemy) {
      //return randomLocation() + 'px';
      return '0px';
    });
};  

updateEnemyLocations(enemies);

var collisionDetector = function() {
  if (!gameSettings.isRunning) {
    return;
  }

  // check for collisions
  var isColliding = function(enemy, player) {
    var distanceHeight = Math.pow((enemy.x - player.x), 2);
    var distanceWidth = Math.pow((enemy.y - player.y), 2);
    var distance = Math.sqrt(distanceHeight + distanceWidth);

    if (distance < (gameSettings.playerSize + gameSettings.enemySize)) {
      return true;
    }
    return false;
  };

  var player = d3.select('.player')[0][0];
  var enemies = d3.selectAll('.enemy');
  enemies[0].forEach(function(enemy) {
    // Getting enemy's coordinates
    var xCoord = enemy.style.left;
    xCoord = Math.floor(xCoord.slice(0, -2));
    var yCoord = enemy.style.top;
    yCoord = Math.floor(yCoord.slice(0, -2));

    // Getting player's coordinates
    var xPlayer = player.style.left;
    xPlayer = Math.floor(xPlayer.slice(0, -2));
    var yPlayer = player.style.top;
    yPlayer = Math.floor(yPlayer.slice(0, -2));
    
    if (isColliding({x: xCoord, y: yCoord},
                    {x: xPlayer, y: yPlayer})) {
      // Game over!
      console.log('KA BOOM!');
    }
  });
};
setInterval(collisionDetector, 200);

//calling the update function with the starting enemies at specified time interval
// setInterval(function() {
//   updateEnemyLocations(enemies);
// }, gameSettings.speed);

/*

  TODO

  x Build the player, with css
    x make it spawn with click
  x Make the player draggable
  x Calculate collisions
    x Figure out if we can use 'tick'
    x Interpolate the enemy transition by 10
    x Set a tween function for every step in the interpolation and console log the current position
    x Create function to mathematically determine if there is a collision
    x Match the current enemy location with the current player location
  - Stop the game
  - Display score and timers
  - (DONE)
  - Increase number of enemies
  - Stop the game on collision, and make it static (enemies and player)
    - Create a reset button
  - Create game theme and style css accordingly

  GAME MECHANICS

  - The board gets populated with N enemies, static, non-moving
  - The player clicks the board where its not an enemy to spawn it's sircle and the game starts
  - The enemies start moving, and the score counter increases as long as no collisions happens
  - When a collision happens
    - Collision counter increases
    - High score gets calculated
    - Current score sets to 0
    - Enemies stop moving
    - Player can't move it's marker
  
  IDEAS

  - Increasing number of enemies
  - Increase rate of points for each rounds
  - on('Game Over') player resets the board with click on a button and that will activate the board
*/
