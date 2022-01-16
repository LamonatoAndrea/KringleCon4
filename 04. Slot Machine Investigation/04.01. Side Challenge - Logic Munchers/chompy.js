var challenges; // track challenges from server
var chomper; // player's avatar object
var chompySleepTime;
var score = 0; // start at 0 points
var lives = 3; // start with 3 extra lives
var stage = level *3; // every three stages means an increase in difficulty level
var trollogs = []; // array of bad guy objects
var chompyMoving = false; // tracks when he's on the move!
var gridStyle = getComputedStyle(document.getElementById("gamegrid")); // movement requires cell dimensions
var boxHeight = parseInt(gridStyle.gridAutoRows.replace("px",""));
var boxWidth  = parseInt(gridStyle.gridTemplateColumns.split(" ")[0].replace("px",""));
var ws; // will hold websocket connection
var icons = false;
var paused = false;
var sound = false;

function toggleSound(icon) { // defaults to mute
  if (icon.src.endsWith("sound.png")) {
    console.log("Muting!")
    icon.src = "/static/mute.png";
    sound = false;
  } else {
    console.log("Unmuting!");
    icon.src = "/static/sound.png";
    sound = true;
  }
}

function prettyPrint(text) { // 
  let replacements = [["//","÷"],[" ** 2","²"],[" ** 3","³"],["|","||"]];
  replacements.push(["^","⊕"],[/==/g,"="]); // set of replacements
  let prettyText = text;
  for (var i = 0; i < replacements.length; i++) { // cycle through swap options and apply to text
    prettyText = prettyText.replace(replacements[i][0],replacements[i][1]);
  }
  return prettyText;
}

function toggleTextImages() { // replace all text with icons, icons with text
  if (icons) {icons = false;}
  else {icons = true;}
  for (var y = 0; y < 5; y++) {
    for (var x = 0; x < 6; x++) {
      document.getElementById(x+","+y).innerHTML = text2images(document.getElementById(x+","+y).innerHTML);
    }
  }
}

function text2images(text) { // flip text back and forth to iconography
  if (!icons) { // go from <img src='True'> to True
    return text.replace(/<img src=\"\/static\/symbols\//g,"").replace(/\.png\">/g,"");
  } else { // go from True to <img src='True'>
    text = text.replace(/\(/g,"( ").replace(/\)/g," )"); // lack of spaces w/parens are annoying!
    let wordarray = text.split(" ");
    let replaceables = ["True","False","not","and","or"];
    let returnarray = [];
    let tag = "<img src=\"/static/symbols/";
    for (var item in wordarray) {
      if (replaceables.includes(wordarray[item])) {
        returnarray.push(tag.concat(wordarray[item],".png\">"));
      } else {
        returnarray.push(wordarray[item]);
      }
    }
    return returnarray.join(" ").replace(/\( /g,"(").replace(/ \)/g,")");
  } 
}

function setIntervalX(callback, delay, repetitions) { // timing loop function
  var x = 0;
  var intervalID = window.setInterval(function () {
     callback();
     if (++x === repetitions) {
         window.clearInterval(intervalID);
     }
  }, delay);
}

function trollogCollision(trollogs, mover) { // check if any trollogs are on the same square
  if (trollogs.length <= 1) {return;} // only have 1 or 0? done
  else {
    for (i = 0; i < trollogs.length; i++) { // check each other trollog against mover
      if (i != mover) { // don't check mover against itself
        if (trollogs[mover].x == trollogs[i].x && trollogs[mover].y == trollogs[i].y) { // check for collision
          console.log(trollogs);
          console.log("Trollog "+mover+" eats trollog "+i);
          trollogs[i].die(); // kill one!
          if (sound){soundTrollogChomp.play();}
          return;
        }
      }
    }
  }
}

function moveit(timestamp, startTime, obj, duration, startx, starty, endx, endy){
  //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date:
  var timestamp = timestamp || new Date().getTime();
  var runtime = timestamp - startTime;
  var progress = runtime / duration;
  progress = Math.min(progress, 1);
  obj.avatar.style.left = ((startx + (endx - startx) * progress).toFixed(2)) + 'px';
  obj.avatar.style.top =  ((starty + (endy - starty) * progress).toFixed(2)) + 'px';
  if (runtime < duration){ // if duration not met yet
      requestAnimationFrame(function(timestamp){ // call requestAnimationFrame again with parameters
          moveit(timestamp, startTime, obj, duration, startx, starty, endx, endy);
      })
  } else {
    if (obj.avatar.id == "chomper") {chompyMoving = false;}
    if (obj.avatar.id == "trollog") {
      obj.avatar.src = "/static/trollog.png"; // switch back from walking to standing pose
      if (obj.x >= 0 && obj.x <= 5 && obj.y >= 0 && obj.y <= 4){ // ignore Trollogs stepping off the board
        if (challenges[obj.x][obj.y][0].length != 0 ) { // check for trollog/challenge collision
          ws.send('{"Type":"OneMore","Level":'+level+',"Style":'+style+',"Cell":[['+obj.x+'],['+obj.y+']]}'); // request a new challenge for that square
        }
        trollogCollision(trollogs, trollogs.indexOf(obj)); // check for trollog/trollog collision
      }
    }
    for (var i = 0; i < trollogs.length; i++) { // player/trollog collision detection
      if (chomper.x == trollogs[i].x && chomper.y == trollogs[i].y && !chompyMoving) {
        wigwags("Oh no! Eaten by a Trollog!")
        if (sound){soundEaten.play();}
        chomper.die();
      }
    }
  }
}

var nextTrollogTime;
function trollogClock() { // check if a trollog needs to be born or move
  let now = new Date().getTime();
  let jitter = (Math.random() * 4 - 2) * 1000; // jitter +/- 2 sec
  if (paused) {nextTrollogTime += 250;} // wait if game is paused
  if ((now > nextTrollogTime) && (trollogs.length <= level) && (chompyFlexTime == undefined)) { // time for a trollog?
    newTrollog();
  }
  if ((now > nextTrollogTime) || (nextTrollogTime == undefined)) { // when's the next trollog?
    nextTrollogTime = now + 1000 * (8 - stage) + jitter;
    if (nextTrollogTime - now < 3000) {nextTrollogTime = now + 3000}; // because at least 3 sec seems kind
  }
  for (i = 0; i < trollogs.length; i++) { // check who needs to move
    if (paused) {trollogs[i].timeToNextMove += 250;} // wait if game is paused
    if (now > trollogs[i].timeToNextMove) {
      trollogs[i].move(trollogs[i]);
    }
  }
  if ((ws != undefined) && (challenges != undefined)) { // good time to check WS status
    if (ws.readyState == 3) {
      chompTrain(); // CHOO! CHOO!
    }
  }
}
setInterval(trollogClock, 250)

window.addEventListener("keydown", function(e) { // disable scrolling with spacebar - it gets annoying
  // if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
  if(["Space"].indexOf(e.code) > -1) {
      e.preventDefault();
  }
}, false);

document.onkeydown = function (e) {
  switch(e.key) {
    case "Enter": // Enter
      if (!chompyMoving && !paused){chomper.chomp(chomper)}; break;
    case " ": // Space
      if (!chompyMoving && !paused){chomper.chomp(chomper)}; break;
    case "ArrowLeft": // Left Arrow
      chomper.move("l"); break;
    case "a": // Left Arrow
      chomper.move("l"); break;
    case "ArrowUp": // Up Arrow
      chomper.move("u"); break;
    case "w": // Up Arrow
      chomper.move("u"); break;
    case "ArrowRight": // Right Arrow
      chomper.move("r"); break;
    case "d": // Right Arrow
      chomper.move("r"); break;
    case "ArrowDown": // Down Arrow
      chomper.move("d"); break;
    case "s": // Down Arrow
      chomper.move("d"); break;
    case "Escape": // Esc
      doPause(); break;
    case "i": // toggle icons
      toggleTextImages(); break;
  }
  return;
}

function doPause() { // stop the troggles!
  if (paused) { // unpause!
    paused = false;
    wigwags("Unpaused!")
  }
  else { // pause!
    paused = true;
    wigwags("Paused!")
  }
}

function choice(choices) { // because you can't random.choice() in JS
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

var chompyFlexTime
function chompyFlex() { // Flex that Chompy for two sec
  let now = new Date().getTime();
  if (chompyFlexTime < now) { // time to get back to game?
    let buddies = document.getElementsByClassName("lives")
    for (i = 0; i < buddies.length; i++) {
      buddies[i].src = "/static/chomper.png"; // extra lives are content again
    }
    chompyMoving = false; // paralysis over!
    chompyFlexTime = undefined;
    chomper.avatar.remove(); // prep the next stage
    stage += 1;
    if (stage % 3 == 0) { // every three stages brings about a difficulty level increase
      level += 1;
    }
    if ((stage >= 3) && (style == 4)) {__POST_RESULTS__(victoryToken);}
    ws.send('{"Type":"GameStart","Level":'+level+',"Style":'+style+'}'); // new stage info will trigger board rebuild
  }
}
setInterval(chompyFlex, 250)

function checkWin() { // check to see if the stage has been won
  let workToDo = false;
  for (var col = 0; col < challenges.length; col++) { // check each cell for a true statement
    for (var cell = 0; cell < challenges[col].length; cell++) {
      if (challenges[col][cell][1] == true) {workToDo = true;};
    }
  }
  if (!workToDo) { // work's all done?  stage up!
    if (sound){soundWin.play();}
    while (trollogs.length > 0) {trollogs[0].die(trollogs[0]);} // kill all trollogs
    chomper.avatar.src = "/static/chomper-ahh.png" // pose for victory
    let buddies = document.getElementsByClassName("lives")
    for (i = 0; i < buddies.length; i++) {
      buddies[i].src = "/static/chomper-ahh.png"; // extra lives are happy too!
    }
    wigwags("Stage "+stage+" complete!");
    chompyMoving = true;
    chompyFlexTime = new Date().getTime() + 2000;
    chompyFlex();
  }
  return !workToDo; // if there's no work to do, checkWin returns true
}

function clickCell(cell) { // nav/chomp via mouse click
  let cellx = cell.dataset["x"]; // cell x,y are stored in dataset
  let celly = cell.dataset["y"];
  if (paused) {wigwags("Cannot move while paused!")}
  if (cellx == chomper.x && celly == chomper.y && !chompyMoving && !paused) {chomper.chomp(chomper);} // chomp first so moving doesn't also fire chomping
  if (cellx == chomper.x -1 && celly == chomper.y)  {chomper.move("l");} // if clicking one to the left, move left, etc.
  if (cellx == chomper.x +1 && celly == chomper.y)  {chomper.move("r");}
  if (cellx == chomper.x && celly == chomper.y - 1) {chomper.move("u");}
  if (cellx == chomper.x && celly == chomper.y + 1) {chomper.move("d");}
}

function chompySleep() { // put Chompy down for a couple seconds after death
  let now = new Date().getTime();
  if (chompySleepTime < now) { // time to wake?
    let buddies = document.getElementsByClassName("lives")
    for (i = 0; i < buddies.length; i++) {
      buddies[i].src = "/static/chomper.png"; // extra lives are happy again!
    }  
    // check for Trollogs
    let allClear = true;
    for (i = 0; i < trollogs.length; i++) {
      if (chomper.x == trollogs[i].x && chomper.y == trollogs[i].y) {
        allClear = false;
      }
    }
    if (allClear) {
      chomper.avatar.style.display = ""; // reappear!
      chompyMoving = false; // paralysis over!
      chompySleepTime = undefined;
    } else {
      chompySleepTime += 1000;
    }
  }
}
setInterval(chompySleep, 250)

class chompy { // class for avatar
  constructor(x, y){
    this.x = x;
    this.y = y;
    document.getElementById(x + ',' + y).innerHTML = ""; // starting space has no challenge
    this.avatar = document.createElement("img");
    this.avatar.src = "/static/chomper.png";
    this.avatar.id = "chomper";
    this.avatar.onclick = function() {chomper.chomp(chomper)}; // because this.chomp() isn't cool, I guess
    document.getElementById("gamegrid").appendChild(this.avatar);
    this.avatar.style["visibility"] = "hidden";
    this.place();
  }
  move(dir) {
    if (paused) {wigwags("Cannot move while game is paused!");}
    if (!chompyMoving && !paused) { // no moving while moving or paused!
      let startx = parseInt(this.avatar.style.left.replace("px",""));
      let starty = parseInt(this.avatar.style.top.replace("px",""));
      let endx = startx;
      let endy = starty;
      switch (dir) {
        case "u": if (this.y > 0) {this.y -= 1; endy -= boxHeight;} break;
        case "d": if (this.y < 4) {this.y += 1; endy += boxHeight;} break;
        case "l": if (this.x > 0) {this.x -= 1; endx -= boxWidth;} break;
        case "r": if (this.x < 5) {this.x += 1; endx += boxWidth;} break;
      }
      chompyMoving = true;
      requestAnimationFrame(function(timestamp) {
        let startTime = timestamp || new Date().getTime(); //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date
        moveit(timestamp, startTime, chomper, 200, startx, starty, endx, endy); // 1 block over .2 seconds
      })
      }
    }
  chomp(chomper) {
    if (challenges[this.x][this.y][0] != "") { // if there's a challenge for the current square
      setIntervalX(function () { // animate mouth movement
        if (chomper.avatar.src.includes("chomper.png")) {
          chomper.avatar.src = "/static/chomper-ahh.png";
        } else {
          chomper.avatar.src = "/static/chomper.png";
        }
      }, 25, 8);
      document.getElementById(this.x + ',' + this.y).innerHTML = "";
      if (challenges[this.x][this.y][1]) {
        if (sound){soundChomp.play();}
        let livesEarnedBefore = Math.floor(score / 5000);
        score += 100;
        let livesEarnedAfter = Math.floor(score / 5000);
        document.getElementById("score").innerHTML = "<h2>" + score + "</h2>";
        if (livesEarnedAfter > livesEarnedBefore) { // free life every 5000 points!
          lives += livesEarnedAfter - livesEarnedBefore;
          document.getElementById("lives").innerHTML = '\n';
          for (let i = 0; (i < lives) && (i < 3) ; i++) {
            document.getElementById("lives").innerHTML += '<img src="/static/chomper.png">\n';
          }
        }
      } else {
        if (sound){soundYuck.play();}
        wigwags("Oh no! Ate a wrong answer!")
        this.die(); // poor guy chokes on wrong answers!
      }
    }
    challenges[this.x][this.y] = [[],[]]; // either way, clear cell out
    checkWin();
  }
  die() { // when a player eats the wrong thing or gets eaten
    lives -= 1; // reduce life count
    if (lives >= 0) { // reduce visual indicator of lives
      document.getElementById("lives").innerHTML = '\n';
      for (let i = 0; (i < lives) && (i < 3) ; i++) {
        document.getElementById("lives").innerHTML += '<img class="lives" src="/static/chomper.png">\n';
      }
      chompyMoving = true; // so player can't move while dead
      chomper.avatar.style.display = "none"; // Chompy is also invisible
      let buddies = document.getElementsByClassName("lives")
      for (i = 0; i < buddies.length; i++) {
        buddies[i].src = "/static/chomper-boo.png"; // extra lives are sad
      }
      chompySleepTime = new Date().getTime() + 2000; // set wake time 2 sec in future
      chompySleep(); // pause and check if it's OK to wake
    } else { // Game over, man.  Game over!
      document.location = "/";
    }
  }
  place() {
    this.avatar.style.top = (this.y * boxHeight + 20) + "px";
    this.avatar.style.left = (this.x * boxWidth + 4) + "px";
  }
} // chompy = new chompy(3,2);

class trollog { // class for bad guys
  constructor(flavor, x, y) {
    this.flavor = flavor;
    this.x = x;
    this.y = y;
    this.longest = (8 - (stage / 2)) * 1000; // start at 8 sec, get to 3 sec ~ stage 10
    if (this.longest < 3000) { this.longest = 3000;} // I mean, I'm not a monster -RB
    let jitter = (Math.random() * 4 - 2) * 1000; // jitter +/- 2 sec
    this.timeToNextMove = new Date().getTime() + (this.longest - jitter);
    if (x == -1) {this.dir = "r";} // heads into the board
    if (x == 6)  {this.dir = "l";}
    if (y == -1) {this.dir = "d";}
    if (y == 5)  {this.dir = "u";}
    this.avatar = document.createElement("img");
    this.avatar.src = "/static/trollog.png";
    this.avatar.id = "trollog";
    this.avatar.className = "trollog";
    this.avatar.style["visibility"] = "hidden";
    document.getElementById("gamegrid").appendChild(this.avatar);
    this.avatar.style.top = (this.y * boxHeight + 20) + "px";
    this.avatar.style.left = (this.x * boxWidth + 12) + "px";
  }
  move(trollog) {
    trollog.avatar.style["visibility"] = "";
    trollog.avatar.src = "/static/trollog-walk.png";
    let jitter = Math.random() * 4 - 2; // jitter +/- 2 sec
    trollog.timeToNextMove = new Date().getTime() + (trollog.longest - jitter); // time the next move will occur
    let startx = parseInt(trollog.avatar.style.left.replace("px",""));
    let starty = parseInt(trollog.avatar.style.top.replace("px",""));
    let endx = startx;
    let endy = starty;
    switch (trollog.dir) {
      case "u": trollog.y -= 1; endy -= boxHeight; break;
      case "d": trollog.y += 1; endy += boxHeight; break;
      case "l": trollog.x -= 1; endx -= boxWidth; break;
      case "r": trollog.x += 1; endx += boxWidth; break;
    }
    if (trollog.y < 0 || trollog.y > 4 || trollog.x < 0 || trollog.x > 5) {
      trollog.die(trollog);
    }
    requestAnimationFrame(function(timestamp) {
      let startTime = timestamp || new Date().getTime(); //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date
      moveit(timestamp, startTime, trollog, 200, startx, starty, endx, endy); // 1 block over .2 seconds
    })
  }
  die() {
    this.avatar.remove(); // delete HTML element
    trollogs.splice(trollogs.indexOf(this),1); // remove from trollogs array
  }
}  // trollog1 = new trollog(1,-1,3);

function newTrollog() { // create bad guys
  wigwags("Look out! A Trollog is coming!");
  starts = []; // potential start locations for a new baddie
  for (let i = 0; i <= 5; i++) {
    starts.push([i,-1],[i,5]); // can start above or below any column
  }
  for (let i = 0; i <= 4; i++) {
    starts.push([-1,i],[6,i]); // can start left or right of any row
  }
  start = choice(starts);
  let fng = new trollog(0,start[0],start[1]); // generate new trollog
  trollogs.push(fng); // add it to the set
}

function wigwags(message) {
  var x = document.getElementById("wigwag");
  x.className = "show";
  x.textContent = message;
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function chompTrain() {
  let scheme = window.location.protocol == "https:" ? 'wss://' : 'ws://';
  let webSocketUri = scheme + window.location.hostname + (location.port ? ':'+location.port: '') + '/ws';
  console.log("Connecting to Chomper HQ at "+webSocketUri);
  ws = new WebSocket(webSocketUri);
  ws.onopen = function() {
    console.log('Connected');
    wigwags("Connected!");
    if (challenges == undefined) { // don't ask for board if this is a reconnect
      ws.send('{"Type":"GameStart","Level":'+level+',"Style":'+style+'}');
    }
  }
  ws.onclose = function() {
    wigwags("Disconnected!");
  }
  ws.onerror = function(e) {
    wigwags("Error! " + e);
    console.log('Error ' + e);
  }
  ws.onmessage = function (event) {
    var messageIn = JSON.parse(event.data);
    if (messageIn.Type == "Setup") { // handles game initialization
      document.getElementById("level").innerHTML = "<h2>"+level+"</h2>"; // set diff level and stage
      document.getElementById("stage").innerHTML = "<h2>"+stage+"</h2>";
      document.getElementById("hint").innerHTML = "<h3>"+messageIn.Hint+"</h3>";
      challenges = [[],[],[],[],[],[]]; // set up X,Y grid of challenges
      for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 6; x++) {
          challenges[x].push(messageIn["Challenges"][x*5+y]);
          challenges[x][y][0] = prettyPrint(challenges[x][y][0]); // replace upstream so cell updates don't stomp changes
          document.getElementById(x+","+y).innerText = challenges[x][y][0]; // first piece of each is the player-visible portion
          if (icons) { // show icons if they're into that
            document.getElementById(x+","+y).innerHTML = text2images(document.getElementById(x+","+y).innerHTML);
          }
        }
      }
      console.log("Challenges is "+challenges.length+" long and looks like: ");
      console.log(challenges);
      // set up player
      challenges[3][2] = [[],[]]; // no challenge under starting position
      chomper = new chompy(3,2); // create player's avatar
      chomper.avatar.style["visibility"] = "";  // run these two only now so it doesn't slide in from top-left
      chomper.avatar.className = "chomper";
      checkWin(); // just in case player is dealt all false (unlikely)
    }
    if (messageIn.Type == "HeresOne") { // handles game events
      let cellx = messageIn.Cell[0];
      let celly = messageIn.Cell[1];
      challenges[cellx][celly] = messageIn["Challenge"];
      document.getElementById(cellx+','+celly).innerHTML = prettyPrint(messageIn["Challenge"][0]);
      if (icons) { // are we in iconography mode? then show as icons
        document.getElementById(cellx+','+celly).innerHTML = text2images(document.getElementById(cellx+','+celly).innerHTML);
      }
      checkWin();
    }
    if (messageIn.Type == "Message") { // handles messages for player
      console.log(messageIn.Message);
      wigwags(messageIn.Message);
      if (messageIn.Message.slice(0,7) == "NetWars") {
        document.getElementById("wigwag").style.backgroundColor = "rgb(244, 0, 48)";
      }
    }
    if (messageIn.Type == "System") { // handles system messages
      console.log("Received system message: " + messageIn.Data);
    }
    if (messageIn.Type == "Redirect") { // handles system messages
      console.log("Received redirect: " + messageIn.Data);
      document.location=(messageIn.Location);
    }
  }
}
chompTrain(); // ride that train!
