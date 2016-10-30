// " " refers to floor
// "w" refers to wall block
// "dco" refers to door block with color c and orientatino o
// "sc" refers to switch block with color c

// "sp1" refers to spawn for player 1
// "sp2" refers to spawn for player 2

// color can be g(green) or r(red) or b(blue)
// orientation can be n(north/south) or w(west/east)

var blueprints = {
  test: [
          ["w"  , "w"  , "w"  , "w"],
          ["w"  , "sp1", " "  , "w"],
          ["w"  , " "  , "sp2", "w"],
          ["w"  , "w"  , "w"  , "w"]
        ]
};

var Wall = require("./wall.js");
var Floor = require("./floor.js");
var Switch = require("./switch.js");
var Door = require("./door.js");
var Spawn = require("./spawn.js");


function Map(blueprintName) {
  if (!blueprints[blueprintName]) {
    console.log("Invalid map name:", blueprintName, ", reverting to testmap");
    blueprintName = 'test';
  }
  this.blueprint = blueprints[blueprintName];
  this.rows = this.blueprint.length;
  this.cols = this.blueprint[0].length;
  this.map = [];
  this.spawns = [[],[]];
  this.doors = [];

  // Build the map
  for (var r = 0; r < this.rows; r++) {
    this.map.push([]);
    for (var c = 0; c < this.cols; c++) {
      var tile = this.blueprint[r][c];
      var obj;
      // Floor tile
      if (tile == " ") {
        obj = new Floor();
      }
      // Wall tile
      else if (tile == "w") {
        obj = new Wall();
      }
      // Spawns
      else if (tile == "sp1") {
        obj = new Spawn(1);
        this.spawns[0].push({x:c, y:r});
      }
      else if (tile == "sp2") {
        obj = new Spawn(2);
        this.spawns[1].push({x:c, y:r});
      }
      // Switch tile
      else if (tile.length == 2) {
        if (validColor(tile1)) {
          obj = new Switch(tile[1]);
        }
        else {
          console.log("Invalid switch color:", tile[1]);
        }
      }
      // Door tile
      else if (tile.length == 3) {
        if (validColor(tile[1]) && validOrientation(tile[2])) {
          obj = new Door(tile[1], tile[2]);
          this.doors.push({x:c, y:r});
        }
        else {
          console.log("Invalid door color:", tile[1]);
          console.log("Or invalid door orientation", tile[2]);
        }
      }
      else {
        console.log("Invalid tile value:", tile);
      }
      // Add the object to the object map
      this.map[r].push(obj);
    }
  }
}

module.exports = Map;