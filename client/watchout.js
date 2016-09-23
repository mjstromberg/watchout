// start slingin' some d3 here.
var gameSettings = {
  enemyNum: 10,
  boardSize: 800,
  enemySize: 80,
  speed: 1000
};

// Append board svg to 

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

