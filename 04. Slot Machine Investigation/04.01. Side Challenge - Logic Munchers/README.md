# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
## 4. [Slot Machine Investigation](/04.%20Slot%20Machine%20Investigation/README.md)

### 4.1. Side Challenge - Logic Munchers

### 4.2. Hints
**AND, OR, NOT, XOR** - *Noel Boetie*: “[This](http://www.natna.info/English/Teaching/CSI30-materials/Chapter1-cheat-sheet.pdf) might be a handy reference too.”  
**Boolean Logic** - *Noel Boetie*: “There are lots of special symbols for logic and set notation. [This one](http://notes.imt-decal.org/sets/cheat-sheet.html) covers AND, NOT, and OR at the bottom.”  

### 4.3. Solution
Analyzing the code of `chompy.js` it is possible to identify the function `moveit` that moves Chomper, the player’s avatar, the Trollogs, the bad guys, and identify their collisions, eventually calling the `die` function on our poor chompy Chomper.
When a Trollog moves onto a square, the square’s value changes so their movements are to be preserved in order to “munch” the maximum amount of squares.
A quick patch of the `moveit` function in the context of the game allows to prevent our Chomper from dying, and thus win the game easily:
```js
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
      console.log("Bored of being eaten?") // ### HERE’S MY PATCH ###
    }
  }
}
```
Instead of letting the player die, this function just shows a message in the console:  
![console](imgs/Bored_of_being_eaten.PNG)

### 4.4. Hopefully...
If I will find the time to work on it, I would like to make chomper play without human interaction... Stay tuned and let's see how it goes :)

---
## Back to main challenge 4. [Slot Machine Investigation](/04.%20Slot%20Machine%20Investigation/README.md)
---
## 5. [Strange USB Device](/05.%20Strange%20USB%20Device/README.md)
### 5.1. [Side Challenge - IPv6 Sandbox](/05.%20Strange%20USB%20Device/05.01.%20Side%20Challenge%20-%20IPv6%20Sandbox/README.md)
## 6. [Shellcode Primer](/06.%20Shellcode%20Primer/README.md)
### 6.1. [Side Challenge - Holiday Hero](/06.%20Shellcode%20Primer/06.01.%20Side%20Challenge%20-%20Holiday%20Hero/README.md)
## 7. [Printer Exploitation](/07.%20Printer%20Exploitation/README.md)
## 8. [Kerberoasting on an Open Fire](/08.%20Kerberoasting%20on%20an%20Open%20Fire/README.md)
### 8.1. [Side Challenge - HoHo … No](/08.%20Kerberoasting%20on%20an%20Open%20Fire/08.01.%20Side%20Challenge%20-%20HoHo%20…%20No/README.md)
## 9. [Splunk!](/09.%20Splunk!/README.md)
### 9.1. [Side Challenge - Yara Analysis](/09.%20Splunk!/09.01.%20Yara%20Analisys/README.md)
## 10. [Now Hiring!](/10.%20Now%20Hiring!/README.md)
### 10.1. [Side Challenge - IMDS Exploration](/10.%20Now%20Hiring!/10.01%20IMDS%20Exploration/README.md)
## 11. [Customer Complaint Analysis](/11.%20Customer%20Complaint%20Analysis/README.md)
### 11.1. [Side Challenge - Strace Ltrace Retrace](/11.%20Customer%20Complaint%20Analysis/11.01%20Side%20Challenge%20-%20Strace%20Ltrace%20Retrace/README.md)
## 12. [Frost Tower Website Checkup](/12.%20Frost%20Tower%20Website%20Checkup/README.md)
### 12.1. [Side Challenge - The Elf C0de Python Edition](/12.%20Frost%20Tower%20Website%20Checkup/12.01.%20Side%20Challenge%20-%20The%20Elf%20C0de%20Python%20Edition/README.md)
## 13. [FPGA Programming](/13.%20FPGA%20Programming/README.md)
### 13.1. [Side Challenge - Frostavator](/13.%20FPGA%20Programming/13.01.%20Side%20Challenge%20-%20Frostavator/README.md)
## 14. [Bonus! Blue Log4Jack](/14.%20Bonus!%20Blue%20Log4Jack/README.md)
## 15. [Bonus! Red Log4Jack](/15.%20Bonus!%20Red%20Log4Jack/README.md)
## 16. [That’s how Jack came from space](/README.md#16-thats-how-jack-came-from-space)
## 17. [Narrative](/README.md#17-narrative)
## 18. [Conclusions](/README.md#18-conclusions)
---
## 0. [windovo\\thedead> whoami](/README.md)
## 1. [KringleCon Orientation](/01.%20KringleCon%20Orientation/README.md)
## 2. [Where in the World is Caramel Santiaigo?](/02.%20Where%20in%20the%20World%20is%20Caramel%20Santiaigo/README.md)
### 2.1. [Side Challenge - Exif Metadata](/02.%20Where%20in%20the%20World%20is%20Caramel%20Santiaigo/02.01.%20Side%20Challenge%20-%20Exif%20Metadata/README.md)
## 3. [Thaw Frost Tower's Entrance](/03.%20Thaw%20Frost%20Tower's%20Entrance/README.md)
### 3.1. [Side Challenge - Grepping for Gold](/03.%20Thaw%20Frost%20Tower's%20Entrance/03.01.%20Grepping%20for%20Gold/README.md)