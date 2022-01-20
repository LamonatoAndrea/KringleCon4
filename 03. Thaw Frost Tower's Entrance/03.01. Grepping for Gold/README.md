# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
## 3. [Thaw Frost Tower's Entrance](/03.%20Thaw%20Frost%20Tower's%20Entrance/README.md)

### 3.1. Side Challenge - Grepping for Gold
The objective is to extract information from an nmap scan using grep.

### 3.1.0. Hints
**Grep Cheat Sheet** - *Greasy GopherGuts*: “Check [this](https://ryanstutorials.net/linuxtutorial/cheatsheetgrep.php) out if you need a grep refresher.”

### 3.1.1. Solution
The motd of this terminal is:
```bash
Howdy howdy!  Mind helping me with this homew- er, challenge?
Someone ran nmap -oG on a big network and produced this bigscan.gnmap file.
The quizme program has the questions and hints and, incidentally,
has NOTHING to do with an Elf University assignment. Thanks!

Answer all the questions in the quizme executable:
- What port does 34.76.1.22 have open?
- What port does 34.77.207.226 have open?
- How many hosts appear "Up" in the scan?
- How many hosts have a web port open?  (Let's just use TCP ports 80, 443, and 8080)
- How many hosts with status Up have no (detected) open TCP ports?
- What's the greatest number of TCP ports any one host has open?

Check out bigscan.gnmap and type quizme to answer each question.
```

Below the full output.

#### 3.1.1.0. What port does 34.76.1.22 have open?
I used grep to search the host and checked the output:
```bash
elf@0227bf6380ca:~$ grep "34.76.1.22" bigscan.gnmap 
Host: 34.76.1.22 ()     Status: Up
Host: 34.76.1.22 ()     Ports: 62078/open/tcp//iphone-sync///      Ignored State: closed (999)

elf@3a26e5a3624b:~$ quizme
What port does 34.76.1.22 have open?
Please enter your answer or press h for a hint: 62078
That's correct!
We used this as a solution:
grep 34.76.1.22 bigscan.gnmap
This looks for "34.76.1.22" in the bigscan.gnmap file and shows us every place where it shows up.  In the results, we see:
  62078/open/tcp//iphone-sync///
This tells us port TCP 62078 was found open by nmap.
You have 5 challenges left.
```
Answer is: `62078`

#### 3.1.1.1. What port does 34.77.207.226 have open?
I used grep to search the host and checked the output:
```bash
elf@3a26e5a3624b:~$ grep "34.77.207.226" bigscan.gnmap 
Host: 34.77.207.226 ()     Status: Up
Host: 34.77.207.226 ()     Ports: 8080/open/tcp//http-proxy///      Ignored State: filtered (999)

elf@3a26e5a3624b:~$ quizme
What port does 34.77.207.226 have open?
Please enter your answer or press h for a hint: 8080
That's correct!
We used this as a solution:
grep 34.77.207.226 bigscan.gnmap
Like the previous challenge, this searches the nmap output file for a specific IP address.  In the output, we see TCP port 8080 is open:
  8080/open/tcp//http-proxy///
You have 4 challenges left.
```
Answer is: `8080`

#### 3.1.1.2. How many hosts appear "Up" in the scan?
The last line of a nmap scan file is generally the summary of hosts scanned, so `tail` did the trick:
```bash
elf@3a26e5a3624b:~$ tail -n 1 bigscan.gnmap 
## Nmap done at Fri Jul 26 12:4:23 -- 26054 IP addresses (26054 hosts up) scanned in 431.78 seconds

elf@3a26e5a3624b:~$ quizme
How many hosts appear "Up" in the scan?
Please enter your answer or press h for a hint: 26054
That's correct!
We used this as a solution:
grep Up bigscan.gnmap | wc -l
Running the grep part of the command returns every line with "Up" in it, and wc counts the bytes, characters, words, and lines that come out of grep. Using "-l" only shows lines.
You have 3 challenges left.
```
Answer is: `26054`

#### 3.1.1.3. How many hosts have a web port open?  (Let's just use TCP ports 80, 443, and 8080)
I used grep to search for a regex containing target ports:
```bash
elf@3a26e5a3624b:~$ grep -e "Ports:.*\?80\|8080\|443.*\?I" bigscan.gnmap | wc -l
14372

elf@3a26e5a3624b:~$ quizme
How many hosts have a web port open?  (Let's just use TCP ports 80, 443, and 8080)
Please enter your answer or press h for a hint: 14372
That's correct!
We used this as a solution:
grep -E "(80|443|8080)/open" bigscan.gnmap | wc -l
Using "-E" tells grep we"re giving it a regular expression (regex).  In this case, that regex says, "I want lines that have 8080/open, 443/open, or 80/open."
  If you want to be MORE correct, you might use "(\s8080|\s443|\s80)/open" to ensure you don't snag ports like 50080, but there weren't any in this file.
You have 2 challenges left.
```
Answer is: `14372`

#### 3.1.1.4. How many hosts with status Up have no (detected) open TCP ports?
I created two temporary files, one with all the IP addresses of hosts with "Status: Up" and one for hosts that shows at least one port. I then used `wc` to count lines in each file and did a subtraction using bash: 
```bash
elf@3a26e5a3624b:~$ grep "Status: Up" bigscan.gnmap | cut -d " " -f 2 > host_up
elf@3a26e5a3624b:~$ grep "Ports: " bigscan.gnmap | cut -d " " -f 2 > host_ports
elf@3a26e5a3624b:~$ echo $((`cat host_up | wc -l` - `cat host_ports | wc -l`))
402

elf@3a26e5a3624b:~$ quizme
How many hosts with status Up have no (detected) open TCP ports?
Please enter your answer or press h for a hint: 402
That's correct!
We used this as a solution:
echo $((`grep Up bigscan.gnmap | wc -l` - `grep Ports bigscan.gnmap | wc -l`))
Our solution is a little fancy, but the crux is this: use one grep|wc command to count how many hosts are "Up", and use another to count how many have "Ports" open.
You have 1 challenge left.
```
Answer is: `402`

#### 3.1.1.5. What's the greatest number of TCP ports any one host has open?
Assuming the longest line of the file would pretty accurately indicate the host with most ports opened, I used `grep` and `wc` to find that line, then I counted ports:
```bash
elf@3a26e5a3624b:~$ grep -Em1 "^.{$(wc -L <bigscan.gnmap)}\$" bigscan.gnmap 
Host: 34.77.152.226 ()     Ports: 22/open/tcp//ssh///, 25/open/tcp//smtp///, 80/open/tcp//http///, 110/open/tcp//pop3///, 135/open/tcp//msrpc///, 137/open/tcp//netbios-ns///, 139/open/tcp//netbios-ssn///, 143/open/tcp//imap///, 445/open/tcp//microsoft-ds///, 993/open/tcp//imaps///, 995/open/tcp//pop3s///, 3389/open/tcp//ms-wbt-server///      Ignored State: closed (988)

elf@3a26e5a3624b:~$ quizme
What's the greatest number of TCP ports any one host has open?
Please enter your answer or press h for a hint: 12
That's correct!
We used this as a solution:
grep -E "(open.*){12,}" bigscan.gnmap | wc -l && grep -E "(open.*){13,}" bigscan.gnmap | wc -l
In our solution, we count how many lines have "open" in them a number of times.  We get a few for 12 and none for 13.
One crafty tester employed the mighty powers of awk like this:
  awk 'BEGIN {print}{print gsub(/open/,"") ""}' bigscan.gnmap | sort -nr | head -1
You've done it!
```
Answer is: `12`

---
## [2. Where in the World is Caramel Santiaigo?](README.md)
## [2.1. Side Challenge - Exif Metadata](README.md)
## [3. Thaw Frost Tower's Entrance](README.md)
## [3.1. Side Challenge - Grepping for Gold](README.md)
## [4. Slot Machine Investigation](README.md)
## [4.1. Side Challenge - Logic Munchers](README.md)
## [5. Strange USB Device](README.md)
## [5.1. Side Challenge - IPv6 Sandbox](README.md)
## [6. Shellcode Primer](README.md)
## [6.1. Side Challenge - Holiday Hero](README.md)
## [7. Printer Exploitation](README.md)
## [7.0. Description](README.md)
## [8. Kerberoasting on an Open Fire](README.md)
## [8.1. Side Challenge - HoHo … No](README.md)
## [9. Splunk!](README.md)
## [9.1. Side Challenge - Yara Analysis](README.md)
## [10. Now Hiring!](README.md)
## [10.1. Side Challenge - IMDS Exploration](README.md)
## [11. Customer Complaint Analysis](README.md)
## [11.1. Side Challenge - Strace Ltrace Retrace](README.md)
## [12. Frost Tower Website Checkup](README.md)
## [12.1. Side Challenge - The Elf C0de Python Edition](README.md)
## [13. FPGA Programming](README.md)
## [13.1. Side Challenge - Frostavator](README.md)
## [14. Bonus! Blue Log4Jack](README.md)
## [15. Bonus! Red Log4Jack](README.md)
---
## [0. windovo\\thedead> whoami](/README.md)
## [1. KringleCon Orientation](/01.%20KringleCon%20Orientation/README.md)
## [16. That’s how Jack came from space](/README.md#16-thats-how-jack-came-from-space)
## [17. Narrative](/README.md#17-narrative)
## [18. Conclusions](/README.md#18-conclusions)