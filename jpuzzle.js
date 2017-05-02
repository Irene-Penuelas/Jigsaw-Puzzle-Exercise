/*
   Javascript: Exercise 6

   Author: Irene J. Penuelas
   Date: 4.26.17

   Filename: jpuzzle.js


   Global Variables List;

   grids
      An array of elements belonging to the grid class

   pieces
      An array of elements belonging to the pieces class

   mousePiece
      The puzzle piece currently selected by the user's mouse

   keyPiece
      The puzzle piece currently selected by the user's keyboard

   keyIndex
      The index number of keyPiece

   selectMode
      A Boolean value where true = keyboard use is in Select Piece mode,
      false = keyboard use is in Move Piece mode

   diffX
      The horizontal distance in pixels between the left edge of
      mousePiece and the mouse pointer

   diffX
      The vertical distance in pixels between the top edge of
      mousePiece and the mouse pointer

   maxZ
      An integer representing the highest z-index value on the Web page

   hoverGrid
      The grid square that the moving puzzle piece is currently hovered over



   Functions List:

   jumbleIt()
      Reloads the current Web page, thus re-arranging the puzzle

   solveIt()
      Places the puzzle images in the current order as background images
      for the grid squares

   init()
      Sets up and initializes the Web page, defining the grid and pieces array,
      and appying event handlers to mouse and keyboard actions

   keyGrab(e)
      "Grabs" a puzzle piece using the keyboard. Sets the value of the keyPiece
      variable and creates an event object to handle keyboard events.
      Pressing a spacebar toggles the operating mode between Select Piece and
      Move Piece. Pressing the four arrow keys either selects a new piece or moves
      the current piece

   keyMove(moveX, moveY)
      Moves the keyPiece moveX pixels to the right and moveY pixels down.

   selectPiece(diffIndex)
      Changes the index of the selected keyPiece by a value of diffIndex sets the
      format of the new keyPiece

   toggleMode()
      Switches the Web page between Select Piece mode and Move Piece mode. Drops the
      currently moving keyPiece onto the Web page, aligning it with the grid

   dropValid(object)
      Returns a Boolean value indicating whether it valid to drop the object. The function
      is false if dropping object will cover a puzzle piece and true if otherwise

   alignPiece(object)
      If object is over a grid square, aligns object with the top-left corner of the square

   highlightGrid(object)
      If object is over a grid square, sets the background color of the square to light green

   mouseGrab(e)
      "Grabs" a puzzle piece using the mousedown action. Sets the value of mousePiece. Calculates
      the value of diffX and diffY. Applies event handlers for mousemove and mouseup events

   mouseMove(e)
      Move mousePiece across the Web page, keeping a constant distance from the mouse pointer

   mouseDrop(e)
      Drops mousePiece on the Web page (if it is not over another puzzle piece). Aligns the
      piece with the grid. Turns off event handlers for the mousemove and mouseup events.



*/
// Global variable
var grids = new Array();
var pieces = new Array();
var mousePiece = null;
var keyPiece = null;
var keyIndex = null;
var selectMode = true;

var diffX = null;  // Difference in X
var diffY = null;  // Difference in Y
var maxZ = 1;
var hoverGrid = null;

window.onload = init;

function jumbleIt() {
  // Reloads the current Web page, thus re-arranging the puzzle
   window.location.reload();
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function solveIt~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function solveIt() {
  // Places the puzzle images in the current order as background images for the grid squares

   for (var i = 0; i < grids.length; i++) {
      pieces[i].style.backgroundImage = "";
      grids[i].style.backgroundImage = "url(piece"+i+".jpg)";
   }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function init~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function init() {
  // Sets up and initializes the Web page, defining the grid and pieces array, and appying event handlers to mouse and keyboard actions

   var allElem = document.getElementsByTagName("*");

   for (var i = 0; i < allElem.length; i++) {
      if (allElem[i].className == "grid") grids.push(allElem[i]); // push is adding elements to the end of the array
      if (allElem[i].className == "pieces") pieces.push(allElem[i]);
   }

   var randomIntegers = randomArray(pieces.length);

   for (var i = 0; i < pieces.length; i++) {
     pieces[i].style.backgroundImage = "url(piece" + randomIntegers[i] + ".jpg)";
     pieces[i].style.top = getStyle(pieces[i], "top");
     pieces[i].style.left = getStyle(pieces[i], "left");
     pieces[i].style.width = getStyle(pieces[i], "width");
     pieces[i].style.height = getStyle(pieces[i], "height");
     pieces[i].style.cursor = "pointer";

     addEvent(pieces[i], "mousedown", mouseGrab, false);
   }

   for (var i = 0; i < grids.length; i++) {
     grids[i].style.top = getStyle(grids[i], "top");
     grids[i].style.left = getStyle(grids[i], "left");
     grids[i].style.width = getStyle(grids[i], "width");
     grids[i].style.height = getStyle(grids[i], "height");
   }
   document.onkeydown = keyGrab;
   keyPiece = pieces[0];
   keyIndex = 0;
   keyPiece.style.borderColor = "red";

   document.getElementById("jumble").onclick = jumbleIt;
   document.getElementById("solve").onclick = solveIt;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function keyGrab~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function keyGrab(e){
  /*
    "Grabs" a puzzle piece using the keyboard. Sets the value of the keyPiece
    variable and creates an event object to handle keyboard events.
    Pressing a spacebar toggles the operating mode between Select Piece and
    Move Piece. Pressing the four arrow keys either selects a new piece or moves
    the current piece
  */
  var evt = e || window.event;

  if (evt.keyCode == 32) {
    toggleMode();
    return false;
  }
  else if (selectMode && evt.keyCode == 37) {
    selectPiece(-1);
    return false;
  }
  else if (selectMode && evt.keyCode == 39) {
    selectPiece(1);
    return false;
  }
  else if (!selectMode && evt.keyCode == 37) {
    keyMove(-8, 0);
    return false;
  }
  else if (!selectMode && evt.keyCode == 38) {
    keyMove(0, -8);
    return false;
  }
  else if (!selectMode && evt.keyCode == 39) {
    keyMove(8, 0);
    return false;
  }
  else if (!selectMode && evt.keyCode == 40) {
    keyMove(0, 8);
    return false;
  }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function keyMove~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function keyMove(moveX, moveY) {
  // Moves the keyPiece moveX pixels to the right and moveY pixels down.
  keyPiece.style.left = parseInt(keyPiece.style.left) + moveX + "px";
  keyPiece.style.top = parseInt(keyPiece.style.top) + moveY + "px";
  highlightGrid(keyPiece);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function selectPiece~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function selectPiece(diffIndex) {
  // Changes the index of the selected keyPiece by a value of diffIndex sets the format of the new keyPiece
  keyPiece.style.borderColor = "black";

  keyIndex = keyIndex + diffIndex;
  if (keyIndex == -1) {
    keyIndex = pieces.length - 1;
  }
  else if (keyIndex == pieces.length) {
    keyIndex = 0;
  }
    keyPiece = pieces[keyIndex];
    keyPiece.style.borderColor = "red";

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function toggleMode~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function toggleMode() {
  // Switches the Web page between Select Piece mode and Move Piece mode. Drops the currently moving keyPiece onto the Web page, aligning it with the grid
  if (dropValid(keyPiece)) {
    selectMode = !selectMode;
  }
  var modeBox = document.getElementById("keyMode");

  if (selectMode) {
    keyPiece.style.borderColor = "red";
    alignPiece(keyPiece);
    modeBox.value = "SELECT PIECE";
    modeBox.style.backgroundColor = "red";
  }
  else {
    keyPiece.style.borderColor = "rgb(151, 255, 151)";
    maxZ++;
    keyPiece.style.zIndex = maxZ;
    modeBox.value = "MOVE PIECE";
    modeBox.style.backgroundColor = "green";
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function dropValid~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function dropValid(object) {
  // Returns a Boolean value indicating whether it valid to drop the object. The function is false if dropping object will cover a puzzle piece and true if otherwise
  for (var i = 0; i < pieces.length; i++) {
    if (withinIt(object, pieces[i])){
      return false;
    }
    return true;
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function alignPiece~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function alignPiece(object) {
  for (var i = 0; i < grids.length; i++) {
    if (withinIt(object, grids[i])) {
      object.style.left = grids[i].style.left;
      object.style.top = grids[i].style.top;
      break;
    }
  }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function highlightGrid~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function highlightGrid(object) {
  // If object is over a grid square, sets the background color of the square to light green
  if (hoverGrid) {
    hoverGrid.style.backgroundColor = "";
  }
  for (var i = 0; i < grids.length; i++) {
    if (withinIt(object, grids[i])) {
      hoverGrid = grids[i];
      hoverGrid.style.backgroundColor = "rgb(192, 255, 192)";
      break;
    }
  }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function mouseGrab~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function mouseGrab(e) {
  // "Grabs" a puzzle piece using the mousedown action. Sets the value of mousePiece. Calculates the value of diffX and diffY. Applies event handlers for mousemove and mouseup events

  var evt = e || window.event; // First option means we're in W3C, second means IE
  mousePiece = evt.target || evt.srcElement;

  maxZ++;
  mousePiece.style.zIndex = maxZ;
  mousePiece.style.cursor = "move";

  var mouseX = evt.clientX;  // x-coordinate of pointer
  var mouseY = evt.clientY;  // Y-coordinate of pointer

  // This calculates the distance from the pointer to the piece edge
  diffX = parseInt(mousePiece.style.left) - mouseX;  // function but not a method. Not owned
  diffY = parseInt(mousePiece.style.top) - mouseY;

  addEvent(document, "mousemove", mouseMove, false);
  addEvent(document, "mouseup", mouseDrop, false);

  //alert("Event : " + evt.type + " on " + mousePiece.id);
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function mouseMove~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function mouseMove(e) {
  // Move mousePiece across the Web page, keeping a constant distance from the mouse pointer
  var evt = e || window.event;
  var mouseX = evt.clientX;
  var mouseY = evt.clientY;

  mousePiece.style.left = mouseX + diffX + "px";
  mousePiece.style.top = mouseY + diffY + "px";
  highlightGrid(mousePiece);
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~function mouseDrop~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function mouseDrop(e) {
  // Drops mousePiece on the Web page (if it is not over another puzzle piece). Aligns the piece with the grid. Turns off event handlers for the mousemove and mouseup events.

  if (dropValid(mousePiece)){
    alignPiece(mousePiece);
    removeEvent(document, "mousemove", mouseMove, false);
    removeEvent(document, "mouseup", mouseDrop, false);
    mousePiece.style.cursor = "pointer";
  }
}
