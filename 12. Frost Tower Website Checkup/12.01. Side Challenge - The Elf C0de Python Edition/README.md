# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
## 12. [Frost Tower Website Checkup](/12.%20Frost%20Tower%20Website%20Checkup/README.md)

### 12.1. Side Challenge - The Elf C0de Python Edition

#### 12.1.0. Hints
**Function Calls** - *Ribb Bonbowford*: “You can call functions like myFunction(). If you ever need to pass a function to a munchkin, you can use myFunction without the ().”  
**Bumping into Walls** - *Ribb Bonbowford*: “Looping through long movements? Don't be afraid to moveUp(99) or whatever. You elf will stop at any obstacle.”  
**Moving the Elf** - *Ribb Bonbowford*: “You can move the elf with commands like elf.moveLeft(5), elf.moveTo({"x":2,"y":2}), or elf.moveTo(lever0.position).”  
**Lever Requirements** - *Ribb Bonbowford*: “Not sure what a lever requires? Click it in the Current Level Objectives panel.”  
#### 12.1.1. Solution
##### 12.1.0. Level 0
```python
import elf, munchkins, levers, lollipops, yeeters, pits
## Grab our lever object
lever = levers.get(0)
munchkin = munchkins.get(0)
lollipop = lollipops.get(0)
## move to lever position
elf.moveTo(lever.position)
## get lever int and add 2 and submit val
leverData = lever.data() + 2
lever.pull(leverData)
## Grab lollipop and stand next to munchkin
elf.moveLeft(1)
elf.moveUp(8)
## Solve the munchkin's challenge
munchList = munchkin.ask() # e.g. [1, 3, "a", "b", 4]
answer_list = []
for elem in munchList:
    if type(elem) == int:
        answer_list.append(elem)
munchkin.answer(answer_list)
elf.moveUp(2) # Move to finish
```
##### 12.1.1. Level 1
```python
import elf, munchkins, levers, lollipops, yeeters, pits
elf.moveLeft(10)
elf.moveUp(100)
```
##### 12.1.2. Level 2
```python
import elf, munchkins, levers, lollipops, yeeters, pits
elf.moveTo(lollipops.get(1).position)
elf.moveLeft(4)
elf.moveTo(lollipops.get(0).position)
elf.moveUp(4)
elf.moveLeft(3)
elf.moveUp(100)
```
##### 12.1.3. Level 3
```python
import elf, munchkins, levers, lollipops, yeeters, pits
lever = levers.get(0)
elf.moveTo(lever.position)
lever.pull(lever.data()+2)
elf.moveTo(lollipops.get(0).position)
elf.moveUp(100)
```
##### 12.1.4. Level 4
```python
import elf, munchkins, levers, lollipops, yeeters, pits
lever0, lever1, lever2, lever3, lever4 = levers.get()
elf.moveLeft(2)
lever4.pull("A String")
elf.moveUp (2)
lever3.pull(True)
elf.moveUp (2)
lever2.pull(1)
elf.moveUp (2)
lever1.pull([''])
elf.moveUp (2)
lever0.pull({})
elf.moveUp(20)
```
##### 12.1.5. Level 5
```python
import elf, munchkins, levers, lollipops, yeeters, pits
lever0, lever1, lever2, lever3, lever4 = levers.get()
elf.moveLeft(2)
lever4.pull("{} concatenate".format(lever4.data()))
elf.moveUp (2)
lever3.pull(not lever3.data())
elf.moveUp (2)
lever2.pull(lever2.data()+1)
elf.moveUp (2)
lst = lever1.data()
lst.append(1)
lever1.pull(lst)
elf.moveUp (2)
obj = lever0.data()
obj['strkey'] = "strvalue"
lever0.pull(obj)
elf.moveUp(20)
```
##### 12.1.6. Level 6
```python
import elf, munchkins, levers, lollipops, yeeters, pits
elf.moveUp(2)
lever = levers.get(0)
data = lever.data()
if type(data) == bool:
    data = not data
elif type(data) == int:
    data = data * 2 
lever.pull(data)
elf.moveUp(100)
```
##### 12.1.7. Level 7
```python
import elf, munchkins, levers, lollipops, yeeters, pits
for num in range(10): 
    elf.moveDown(100)
    elf.moveLeft(3)
    elf.moveUp(100)
    elf.moveLeft(3)
```
##### 12.1.8. Level 8
```python
import elf, munchkins, levers, lollipops, yeeters, pits
m0 = munchkins.get(0)
ask = m0.ask()
for k in ask.keys():
    if ask[k] == "lollipop":
        m0.answer(k)
all_lollipops = lollipops.get()
for lollipop in all_lollipops:
    elf.moveTo(lollipop.position)
elf.moveLeft(8)
elf.moveUp(100)
```
##### 12.1.9. Level 9
```python
import elf, munchkins, levers, lollipops, yeeters, pits
def func_to_pass_to_mucnhkin(list_of_lists):
    s = 0
    for l in list_of_lists:
        for e in l:
            if isinstance(e, int):
                s = s + int(e)
    return s
munchkins.get(0).answer(func_to_pass_to_mucnhkin)
all_levers = levers.get()
moves = [elf.moveDown, elf.moveLeft, elf.moveUp, elf.moveRight] * 2
for i, move in enumerate(moves):
    move(i+1)
    if (i < len(all_levers)):
        all_levers[i].pull(i)
elf.moveUp(2)
elf.moveLeft(4)
elf.moveUp(100)
```
##### 12.1.10. Level 10
```python
import elf, munchkins, levers, lollipops, yeeters, pits
import time
muns = munchkins.get()
lols = lollipops.get()[::-1]
for index, mun in enumerate(muns):
    while abs(mun.position["x"] - elf.position["x"]) < 6:
        time.sleep(0.05)
    elf.moveTo(lols[index].position)
elf.moveLeft(6)
elf.moveUp(100)
```

#### 12.2. Level 8 @ KringleCon3
This year I didn’t come up with any weird solution for this challenge but you can still insult [my Level 8 solution](https://github.com/LamonatoAndrea/KringleCon3/blob/main/04.%20Operate%20the%20Santavator/README.md#418-level-8) from last year.  
![meme](imgs/meme.png) https://www.secmeme.com/2013/02/the-internet-is-forever.html

---
## Back to main challenge 12. [Frost Tower Website Checkup](/12.%20Frost%20Tower%20Website%20Checkup/README.md)
---
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
## 4. [Slot Machine Investigation](/04.%20Slot%20Machine%20Investigation/README.md)
### 4.1. [Side Challenge - Logic Munchers](/04.%20Slot%20Machine%20Investigation/04.01.%20Side%20Challenge%20-%20Logic%20Munchers/README.md)
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