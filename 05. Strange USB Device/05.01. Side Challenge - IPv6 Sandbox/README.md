# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
## 5. [Strange USB Device](/05.%20Strange%20USB%20Device/README.md)

### 5.1. Side Challenge - IPv6 Sandbox
The objective is to identify a machine that is hosting a service providing the password for Candy Striper.

#### 5.1.0. Hints
**IPv6 Reference** - *Jewel Loggins*: “Check out [this Github Gist](https://gist.github.com/chriselgee/c1c69756e527f649d0a95b6f20337c2f) with common tools used in an IPv6 context.”

#### 5.1.1. Solution
The motd of this terminal is:
```bash
Tools:

* netcat
* nmap
* ping / ping6
* curl

Welcome, Kringlecon attendee! The candy striper is running as a service on                    
this terminal, but I can't remember the password. Like a sticky note under the                
keyboard, I put the password on another machine in this network. Problem is: I                
don't have the IP address of that other host.

Please do what you can to help me out. Find the other machine, retrieve the                   
password, and enter it into the Candy Striper in the pane above. I know you                   
can get it running again!
```

After quick reconnaissance, I noticed host `fe80::42:c0ff:fea8:a002` on which `nmap` exposed a service on port `9000/tcp` responding `PieceOnEarth` to most protocols:
```bash
elf@b7e156783d4e:~$ ping6 ff02::1 -c2
PING ff02::1(ff02::1) 56 data bytes
64 bytes from fe80::42:c0ff:fea8:a003%eth0: icmp_seq=1 ttl=64 time=0.035 ms
64 bytes from fe80::42:6bff:fe62:290d%eth0: icmp_seq=1 ttl=64 time=0.068 ms (DUP!)
64 bytes from fe80::42:c0ff:fea8:a002%eth0: icmp_seq=1 ttl=64 time=0.083 ms (DUP!)
64 bytes from fe80::42:c0ff:fea8:a003%eth0: icmp_seq=2 ttl=64 time=0.046 ms

--- ff02::1 ping statistics ---
2 packets transmitted, 2 received, +2 duplicates, 0% packet loss, time 15ms
rtt min/avg/max/mdev = 0.035/0.058/0.083/0.018 ms
```
```bash
elf@b7e156783d4e:~$ nmap -6 fe80::42:c0ff:fea8:a003%eth0 -sV
Starting Nmap 7.70 ( https://nmap.org ) at 2022-01-05 18:47 UTC
Nmap scan report for fe80::42:c0ff:fea8:a003
Host is up (0.000071s latency).
All 1000 scanned ports on fe80::42:c0ff:fea8:a003 are closed

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 13.55 seconds
```
```bash
elf@b7e156783d4e:~$ nmap -6 fe80::42:6bff:fe62:290d%eth0 -sV
Starting Nmap 7.70 ( https://nmap.org ) at 2022-01-05 18:48 UTC
Nmap scan report for fe80::42:6bff:fe62:290d
Host is up (0.000084s latency).
Not shown: 998 closed ports
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
3000/tcp open  ppp?
1 service unrecognized despite returning data. If you know the service/version, please submit t
he following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port3000-TCP:V=7.70%I=7%D=1/5%Time=61D5E82E%P=x86_64-pc-linux-gnu%r(Get
SF:Request,656,"HTTP/1\.1\x20200\x20OK\r\nContent-Security-Policy:\x20defa
SF:ult-src\x20'self';script-src\x20'self'\x20'unsafe-inline'\x20'unsafe-ev
SF:al';style-src\x20'self'\x20'unsafe-inline';font-src\x20'self'\x20data:;
SF:connect-src\x20'self'\x20ws://undefined\r\nX-DNS-Prefetch-Control:\x20o
SF:ff\r\nExpect-CT:\x20max-age=0\r\nX-Frame-Options:\x20SAMEORIGIN\r\nStri
SF:ct-Transport-Security:\x20max-age=15552000;\x20includeSubDomains\r\nX-D
SF:ownload-Options:\x20noopen\r\nX-Content-Type-Options:\x20nosniff\r\nX-P
SF:ermitted-Cross-Domain-Policies:\x20none\r\nReferrer-Policy:\x20no-refer
SF:rer-when-downgrade\r\nX-XSS-Protection:\x200\r\nContent-Type:\x20text/h
SF:tml;\x20charset=utf-8\r\nContent-Length:\x20926\r\nETag:\x20W/\"39e-/o/
SF:J\+QPx1izUxZzPiMoxvvyVeAA\"\r\nVary:\x20Accept-Encoding\r\nDate:\x20Wed
SF:,\x2005\x20Jan\x202022\x2018:49:18\x20GMT\r\nConnection:\x20close\r\n\r
SF:\n<!doctype\x20html>\n<html\x20lang=\"en\">\n\x20\x20<head>\n\x20\x20\x
SF:20\x20<meta\x20charset=\"utf8\">\n\x20\x20\x20\x20<meta\x20http-equiv=\
SF:"X-UA-Compatible\"\x20content=\"IE=edge\">\n\x20\x20\x20\x20<meta\x20na
SF:me=\"viewport\"\x20content=\"width=device-width,\x20initial-scale=1\.0,
SF:\x20user")%r(Help,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnection:
SF:\x20close\r\n\r\n")%r(NCP,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nCon
SF:nection:\x20close\r\n\r\n")%r(HTTPOptions,2CD,"HTTP/1\.1\x20200\x20OK\r
SF:\nContent-Security-Policy:\x20default-src\x20'self';script-src\x20'self
SF:'\x20'unsafe-inline'\x20'unsafe-eval';style-src\x20'self'\x20'unsafe-in
SF:line';font-src\x20'self'\x20data:;connect-src\x20'self'\x20ws://undefin
SF:ed\r\nX-DNS-Prefetch-Control:\x20off\r\nExpect-CT:\x20max-age=0\r\nX-Fr
SF:ame-Options:\x20SAMEORIGIN\r\nStrict-Transport-Security:\x20max-age=155
SF:52000;\x20includeSubDomains\r\nX-Download-Options:\x20noopen\r\nX-Conte
SF:nt-Type-Options:\x20nosniff\r\nX-Permitted-Cross-Domain-Policies:\x20no
SF:ne\r\nReferrer-Policy:\x20no-referrer-when-downgrade\r\nX-XSS-Protectio
SF:n:\x200\r\nAllow:\x20GET,HEAD\r\nContent-Type:\x20text/html;\x20charset
SF:=utf-8\r\nContent-Length:\x208\r\nETag:\x20W/\"8-ZRAf8oNBS3Bjb/SU2GYZCm
SF:btmXg\"\r\nVary:\x20Accept-Encoding\r\nDate:\x20Wed,\x2005\x20Jan\x2020
SF:22\x2018:49:18\x20GMT\r\nConnection:\x20close\r\n\r\nGET,HEAD");
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 24.59 seconds
```
```bash
elf@b7e156783d4e:~$ nmap -6 fe80::42:c0ff:fea8:a002%eth0 -sV
Starting Nmap 7.70 ( https://nmap.org ) at 2022-01-05 18:50 UTC
Nmap scan report for fe80::42:c0ff:fea8:a002
Host is up (0.00013s latency).
Not shown: 998 closed ports
PORT     STATE SERVICE     VERSION
80/tcp   open  http        nginx 1.14.2
9000/tcp open  cslistener?
1 service unrecognized despite returning data. If you know the service/version, please submit t
he following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port9000-TCP:V=7.70%I=7%D=1/5%Time=61D5E879%P=x86_64-pc-linux-gnu%r(NUL
SF:L,D,"PieceOnEarth\n")%r(GenericLines,D,"PieceOnEarth\n")%r(GetRequest,D
SF:,"PieceOnEarth\n")%r(HTTPOptions,D,"PieceOnEarth\n")%r(RTSPRequest,D,"P
SF:ieceOnEarth\n")%r(RPCCheck,D,"PieceOnEarth\n")%r(DNSVersionBindReqTCP,D
SF:,"PieceOnEarth\n")%r(DNSStatusRequestTCP,D,"PieceOnEarth\n")%r(Help,D,"
SF:PieceOnEarth\n")%r(SSLSessionReq,D,"PieceOnEarth\n")%r(TLSSessionReq,D,
SF:"PieceOnEarth\n")%r(Kerberos,D,"PieceOnEarth\n")%r(SMBProgNeg,D,"PieceO
SF:nEarth\n")%r(X11Probe,D,"PieceOnEarth\n")%r(FourOhFourRequest,D,"PieceO
SF:nEarth\n")%r(LPDString,D,"PieceOnEarth\n")%r(LDAPSearchReq,D,"PieceOnEa
SF:rth\n")%r(LDAPBindReq,D,"PieceOnEarth\n")%r(SIPOptions,D,"PieceOnEarth\
SF:n")%r(LANDesk-RC,D,"PieceOnEarth\n")%r(TerminalServer,D,"PieceOnEarth\n
SF:")%r(NCP,D,"PieceOnEarth\n")%r(NotesRPC,D,"PieceOnEarth\n")%r(JavaRMI,D
SF:,"PieceOnEarth\n")%r(WMSRequest,D,"PieceOnEarth\n")%r(oracle-tns,D,"Pie
SF:ceOnEarth\n")%r(ms-sql-s,D,"PieceOnEarth\n")%r(afp,D,"PieceOnEarth\n")%
SF:r(giop,D,"PieceOnEarth\n");

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 19.59 seconds
```
```bash
elf@b7e156783d4e:~$ nc -6 fe80::42:c0ff:fea8:a002%eth0 9000
PieceOnEarth
^C
```

Doesn’t this look like a password? Yes, because it is the password (and the answer):
```bash
ENTER THE CORRECT PHRASE TO ENGAGE THE CANDY STRIPER                                          
> PieceOnEarth
Your answer: PieceOnEarth                                                                         
                                                                                              
Checking....        
CANDY STRIPER REENGAGED. THANK YOU!
```

---
## Back to main challenge 5. [Strange USB Device](/05.%20Strange%20USB%20Device/README.md)
---
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
## 4. [Slot Machine Investigation](/04.%20Slot%20Machine%20Investigation/README.md)
### 4.1. [Side Challenge - Logic Munchers](/04.%20Slot%20Machine%20Investigation/04.01.%20Side%20Challenge%20-%20Logic%20Munchers/README.md)