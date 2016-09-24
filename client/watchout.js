// start slingin' some d3 here.
var gameSettings = {
  enemyNum: 10,
  boardSize: 800,
  enemySize: 50,
  speed: 2000
};

// Enemies
var enemies = new Array(gameSettings.enemyNum).fill('x'); // x values

// update function that takes an array of enemies
var updateEnemyLocations = function(data) {
  // add the new added enemies, in most cases its only for the first round
  var selection = d3.select('.board').selectAll('.enemy').data(data);

  // random location helper function
  var randomLocation = function() {
    return Math.floor(Math.random() * (gameSettings.boardSize - gameSettings.enemySize));
  };

  // new Elements needs a location
  selection.enter().append('svg')
    .attr('class', 'enemy')
    .style('top', function(enemy) {
      return randomLocation() + 'px';
    })
    .style('left', function(enemy) {
      return randomLocation() + 'px';
    });

  // for all the old elements, update location
  selection
    // transition
    .transition()
      .duration(gameSettings.speed)
    // css top = random
    .style('top', function(enemy) {
      return randomLocation() + 'px';
    })
    // css left = random
    .style('left', function(enemy) {
      return randomLocation() + 'px';
    }); 
};  

//calling the update function with the starting enemies at specified time interval
setInterval(function() {
  updateEnemyLocations(enemies);
}, gameSettings.speed);

/*

  TODO

  x Build the player, with css
    - make it spawn with click
  - Make the player draggable
  - Calculate collisions
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
