// " " refers to floor
// "w" refers to wall block
// "doCs" refers to door block with orientatino o,  color C, and state s.

// "win1"
// "win2"

// "bC" refers to switch (button) block with color C

// "sp1" refers to spawn for player 1
// "sp2" refers to spawn for player 2

// color can be G(green) or R(red) or B(blue), Y(yellow), P(magenta)
// orientation can be n(north/south) or w(west/east)

/*var blueprints = {
  test: [
          ["w"  , "w"  , "w"  , "w"],
          ["w"  , "sp1", " "  , "w"],
          ["w"  , " "  , "sp2", "w"],
          ["w"  , "w"  , "w"  , "w"]
        ]
};*/

var blueprints = {
  test: [
          ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
          ["w", " ", " ", " ", " ", "win2", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "win1", "sp1", " ", " ", " ", " ", "win2", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w"],
          ["w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "dhRc", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
      ["w", "bB", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", " ", " ", "w", "w", "w", "w", "w", " ", " ", " ", " ", " ", " ", " ", "bG", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", "dhBo", "w", "w", "w", "w", "dhGo", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", " ", " ", "w", "w", "w", "w", "w", "w", "w", "dhBc", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", " ", "bB", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", "bY", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "dhGc", "w", "dhYo", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", "bR", "w", "w", "w", "w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", " ", " ", " ", " ", " ", " ", " ", "dvRo", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", "bG", "w", "w", "w", "w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "dhGc", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "bR", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", "dhBo", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "bB", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "bG", "w", "w", "w", "w", "w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", " ", "w"],
      ["w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w"],
      ["w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", "w", "w", " ", "w", "w", "w", "dhYc", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w"],
      ["w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w"],
      ["w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "dvBo", " ", " ", " ", " ", " ", " ", "dvGc", " ", " ", "w", "w", "w", " ", " ", " ", " ", " ", " ", " ", "w", "w", "dhPc", "w"],
      ["w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", "w", "w", " ", "w", "w", " ", "w"],
      ["w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", "w", "w", "dhRo", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", "w", "w", " ", "w", "w", " ", "w"],
      ["w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", " ", "dvYc", "dvGc", "dvBc", " ", "w", "w", " ", "w"],
      ["w", "bR", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "bY", "w", "w", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", " ", "w", " ", "w", "w", "w", " ", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", "dhBo", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", " ", " ", "bP", "w", " ", "dvRo", " ", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "bR", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", " ", "dvYo", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "bP", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", "bG", "w", "w", "w", "w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "dhGc", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", "bR", "w", "w", "w", "w", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", " ", " ", " ", " ", " ", " ", " ", "dvRo", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", "bY", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "dhGc", "w", "dhYo", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", " ", "bB", "w", "w", "w", "w", "w", "w", "w", " ", "w", "w", "w", "w", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", "dhBo", "w", "w", "w", "w", "dhGo", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", " ", " ", "w", "w", "w", "w", "w", "w", "w", "dhBc", "w", "w", "w", "w", " ", "w"],
      ["w", "bB", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", " ", " ", " ", "w", "w", "w", "w", "w", " ", " ", " ", " ", " ", " ", " ", "bG", "w"],
      ["w", "w", "w", "w", "w", " ", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "dhRc", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
      ["w", " ", " ", " ", " ", "win1", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "sp2", " ", " ", " ", " ", "win1", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "w"],
      ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"]
    ]
};

var Wall = require("./wall.js");
var Win = require("./win.js");
var Floor = require("./floor.js");
var Switch = require("./switch.js");
var Door = require("./door.js");
var Spawn = require("./spawn.js");

function validColor(color)
{
    return color == "R" || color == "G" || color == "B" || color == "Y" || color == "P";
}

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
      else if (tile == "win1") {
        obj = new Win(1);
      }
      else if (tile == "win2") {
        obj = new Win(2);
      }
        
      // Switch tile
      else if (tile.length == 2) {
        if (validColor(tile[1])) {
          obj = new Switch(tile[1]);
        }
        else {
          console.log("Invalid switch color:", tile[1]);
        }
      }
      // Door tile
      else if (tile.length == 4) {
        if (validColor(tile[2]) /*&& validOrientation(tile[1])*/) 
        {
          var open = false;
          if (tile[3] == 'o')
              open = true;
          obj = new Door(tile[2],open,{x:c, y:r}/*, tile[2]*/);
          this.doors.push(obj);
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