function moveChomper(dir) {
	if (paused) {wigwags("Cannot move while game is paused!");}
	if (!chompyMoving && !paused) { // no moving while moving or paused!
		let startx = parseInt(chomper.avatar.style.left.replace("px",""));
		let starty = parseInt(chomper.avatar.style.top.replace("px",""));
		let endx = startx;
		let endy = starty;
		switch (dir) {
			case "u": if (chomper.y > 0) {chomper.y -= 1; endy -= boxHeight;} break;
			case "d": if (chomper.y < 4) {chomper.y += 1; endy += boxHeight;} break;
			case "l": if (chomper.x > 0) {chomper.x -= 1; endx -= boxWidth;} break;
			case "r": if (chomper.x < 5) {chomper.x += 1; endx += boxWidth;} break;
		}
		chompyMoving = true;
		requestAnimationFrame(function(timestamp) {
			let startTime = timestamp || new Date().getTime();
			moveit(timestamp, startTime, chomper, 1, startx, starty, endx, endy); // speed up the chomper
		})
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
      console.log("Bored of being eaten?")
    }
  }
}

