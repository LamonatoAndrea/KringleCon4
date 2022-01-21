# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
## 8. [Kerberoasting on an Open Fire](/08.%20Kerberoasting%20on%20an%20Open%20Fire/README.md)

### 8.1. Side Challenge - HoHo … No
The aim of this challenge is to customize `Fail2ban` so to automatically block all IPs generating more than 10 failures/hour. The challenge is successful when a filter, a jail and an action are properly set up and working.  

Using grep on the file `/var/log/hohono.log` it is possible to find 4 types of failure log messages:
```bash
2021-12-19 23:40:08 Failed login from 16.62.11.108 for shinny
2021-12-19 23:40:19 Login from 176.202.88.199 rejected due to unknown user name
2021-12-19 23:38:15 16.62.11.108 sent a malformed request
2021-12-20 01:35:27 Invalid heartbeat 'bravo' from 188.150.137.180
```

Based on that, the filter `/etc/fail2ban/filter.d/hohono_filter.conf` I created is:
```bash
[Definition]
failregex = Failed login from <HOST> for
            Login from <HOST> rejected due to unknown user name
            <HOST> sent a malformed request
            Invalid heartbeat .*? from <HOST>
```
The jail `/etc/fail2ban/jail.d/hohono_jail.conf` is:
```bash
[hohono]
enabled  = true
port     = 0:65535
filter   = hohono_filter
logpath  = /var/log/hohono.log

maxretry = 10
findtime = 3600

bantime = 3600

action = hohono_action
```

The action `/etc/fail2ban/action.d/hohono_action.conf` is:
```bash
[Definition]
actionban   = /root/naughtylist add <ip>
actionunban = /root/naughtylist del <ip>
actioncheck = 
actionstart = 
actionstop = 

[Init]
```

By restarting the `fail2ban` service and running `/root/naughtylist refresh` it is possible to see that the configuration is a solution for the challenge:
```bash
root@8a9e21575182:~# /etc/init.d/fail2ban restart
 * Restarting Authentication failure monitor fail2ban                                   [ OK ] 
root@8a9e21575182:~# /root/naughtylist refresh
Refreshing the log file...
Log file refreshed! It may take fail2ban a few moments to re-process.
59.21.84.131 has been added to the naughty list!
150.76.170.37 has been added to the naughty list!
148.213.52.89 has been added to the naughty list!
212.93.16.75 has been added to the naughty list!
26.6.6.138 has been added to the naughty list!
107.28.49.25 has been added to the naughty list!
162.206.33.108 has been added to the naughty list!
208.206.188.4 has been added to the naughty list!
221.76.18.26 has been added to the naughty list!
220.226.57.81 has been added to the naughty list!
179.76.145.66 has been added to the naughty list!
49.244.77.90 has been added to the naughty list!
You correctly identifed 12 IPs out of 12 bad IPs
You incorrectly added 0 benign IPs to the naughty list




*******************************************************************
* You stopped the attacking systems! You saved our systems!
*
* Thank you for all of your help. You are a talented defender!
*******************************************************************
```

This challenge actually unlocks the objective “8) Kerberoasting on an Open Fire”.

---
## Back to main chapter 8. [Kerberoasting on an Open Fire](/08.%20Kerberoasting%20on%20an%20Open%20Fire/README.md)
---
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
## 5. [Strange USB Device](/05.%20Strange%20USB%20Device/README.md)
### 5.1. [Side Challenge - IPv6 Sandbox](/05.%20Strange%20USB%20Device/05.01.%20Side%20Challenge%20-%20IPv6%20Sandbox/README.md)
## 6. [Shellcode Primer](/06.%20Shellcode%20Primer/README.md)
### 6.1. [Side Challenge - Holiday Hero](/06.%20Shellcode%20Primer/06.01.%20Side%20Challenge%20-%20Holiday%20Hero/README.md)
## 7. [Printer Exploitation](/07.%20Printer%20Exploitation/README.md)
