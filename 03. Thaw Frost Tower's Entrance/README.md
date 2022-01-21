# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
## 3. Thaw Frost Tower's Entrance
### 3.0. Description
Difficulty: :christmas_tree::christmas_tree:  
Turn up the heat to defrost the entrance to Frost Tower. Click on the Items tab in your badge to find a link to the Wifi Dongle's CLI interface. Talk to Greasy Gopherguts outside the tower for tips.

### 3.1. [Side Challenge - Grepping for Gold](/03.%20Thaw%20Frost%20Tower's%20Entrance/03.01.%20Grepping%20for%20Gold/README.md)

### 3.2. Hints
**Adding Data to cURL requests** - *Greasy GopherGuts*: “When sending a [POST request with data](https://www.educative.io/edpresso/how-to-perform-a-post-request-using-curl), add --data-binary to your curl command followed by the data you want to send.”  
**Web Browsing with cURL** - *Greasy GopherGuts*: “[cURL,](https://linux.die.net/man/1/curl) makes HTTP requests from a terminal - in Mac, Linux, and modern Windows!”  
**Linux Wi-Fi Commands** - *Greasy GopherGuts*: “The [iwlist](https://linux.die.net/man/8/iwlist) and [iwconfig](https://linux.die.net/man/8/iwconfig) utilities are key for managing Wi-Fi from the Linux command line.”  

### 3.3. Solution
For this challenge the "Wifi Dongle" from Objective 1 is going to be used. The motd of the tool is:
```
                        ATTENTION ALL ELVES

In Santa's workshop (wireless division), we've been busy adding new Cranberry
Pi features. We're proud to present an experimental version of the Cranberry
Pi, now with Wi-Fi support!

This beta version of the Cranberry Pi has Wi-Fi hardware and software
support using the Linux wireless-tools package. This means you can use iwlist
to search for Wi-Fi networks, and connect with iwconfig! Read the manual
pages to learn more about these commands:

man iwlist

man iwconfig

I'm afraid there aren't a lot of Wi-Fi networks in the North Pole yet, but if
you keep scanning maybe you'll find something interesting.

                                                 - Sparkle Redberry
```

Being near the thermostat it’s possible to identify the `FROST-Nidus-Setup` wireless network and connect to it without a password. 
```bash
elf@0674a4c39090:~$ iwconfig     
wlan0     IEEE 802.11  ESSID:off/any  
          Mode:Managed  Access Point: Not-Associated   Tx-Power=22 dBm   
          Retry:off   RTS thr:off   Fragment thr=7 B   
          Power Management:on

elf@a2e47f3eb6e0:~$ iwlist wlan0 scan
wlan0     Scan completed :
          Cell 01 - Address: 02:4A:46:68:69:21
                    Frequency:5.2 GHz (Channel 40)
                    Quality=48/70  Signal level=-62 dBm  
                    Encryption key:off
                    Bit Rates:400 Mb/s
                    ESSID:"FROST-Nidus-Setup"

elf@a2e47f3eb6e0:~$ iwconfig wlan0 essid "FROST-Nidus-Setup"   
** New network connection to Nidus Thermostat detected! Visit http://nidus-setup:8080/ to complete setup
(The setup is compatible with the 'curl' utility)
```

As soon as connected, the above message informs to access the URL `http://nidus-setup:8080/` in order to complete the thermostat setup:
```bash
elf@a2e47f3eb6e0:~$ curl http://nidus-setup:8080/
◈──────────────────────────────────────────────────────────────────────────────◈

Nidus Thermostat Setup

◈──────────────────────────────────────────────────────────────────────────────◈

WARNING Your Nidus Thermostat is not currently configured! Access to this
device is restricted until you register your thermostat » /register. Once you
have completed registration, the device will be fully activated.

In the meantime, Due to North Pole Health and Safety regulations
42 N.P.H.S 2600(h)(0) - frostbite protection, you may adjust the temperature.

API

The API for your Nidus Thermostat is located at http://nidus-setup:8080/apidoc

elf@a2e47f3eb6e0:~$ curl http://nidus-setup:8080/apidoc
◈──────────────────────────────────────────────────────────────────────────────◈

Nidus Thermostat API

◈──────────────────────────────────────────────────────────────────────────────◈

The API endpoints are accessed via:

http://nidus-setup:8080/api/<endpoint>

Utilize a GET request to query information; for example, you can check the
temperatures set on your cooler with:

curl -XGET http://nidus-setup:8080/api/cooler

Utilize a POST request with a JSON payload to configuration information; for
example, you can change the temperature on your cooler using:

curl -XPOST -H 'Content-Type: application/json' \
  --data-binary '{"temperature": -40}' \
  http://nidus-setup:8080/api/cooler


● WARNING: DO NOT SET THE TEMPERATURE ABOVE 0! That might melt important furniture

Available endpoints

┌─────────────────────────────┬────────────────────────────────┐
│ Path                        │ Available without registering? │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/cooler                 │ Yes                            │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/hot-ice-tank           │ No                             │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/snow-shower            │ No                             │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/melted-ice-maker       │ No                             │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/frozen-cocoa-dispenser │ No                             │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/toilet-seat-cooler     │ No                             │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/server-room-warmer     │ No                             │ 
└─────────────────────────────┴────────────────────────────────┘

elf@a2e47f3eb6e0:~$ curl http://nidus-setup:8080/register
◈──────────────────────────────────────────────────────────────────────────────◈

Nidus Thermostat Registration

◈──────────────────────────────────────────────────────────────────────────────◈

Welcome to the Nidus Thermostat registration! Simply enter your serial number
below to get started. You can find the serial number on the back of your
Nidus Thermostat as shown below:

+------------------------------------------------------------------------------+
|                                                                              |
|                                                                              |
|                              ....'''''''''''''...                            |
|                         .'''...  ...............',,,'.                       |
|                     .''.        ........''',,,;;;;,'.',,'.                   |
|                  .,'.                   ......'',;;;;;;,.',;.                |
|                ',.l.                          ....'',;:::;:xl:,              |
|              ,,.                                  ....',;:cl:,,::            |
|            .,,                      ,::::,           ....';:cc:;cx,          |
|          .'  .                     :dkkkkd;             ...';:ccdc.;.        |
|         ..                                                ...';::c;.,'       |
|        '.                                                  ...';:c:;'.;      |
|       .                                                      ...,;::;,.;     |
|      ..                          ....'.'.'.''                 ...';::;'.,    |
|      .                          .. ';'.'..,..                  ...,;::;.;.   |
|     '                                ..  .. .                   ...,::;,.c   |
|     .                                                           ...';::;';.  |
|    '                                                             ...,;:;,.;  |
|    ,                              ...........                    ...,;:;;.c  |
|    ,      ...                     .  .....  .                   .;:l:;::;.l  |
|    ;      .x.                     ....   ....                   .:ccc;:;;.l  |
|    ,      ...                     ......... .                   ...',;;;,.c  |
|    '.                             ...... . ..                    ...,;;;'.,  |
|     ;                             .  .   ....                   ...',;;,.:   |
|     ;                             ...........                  ....',;,'.;   |
|      :                                                        ....',,,'.c    |
|      .,              ----->       xx.x..x.x.x                .....',,'.:.    |
|       ''                                                    .....',,'.:.     |
|        ',                ......'';oxxxxxxdc.              ......''''.:.      |
|         .:               ....'ldlx00KKKKXXXd.l;         ......',''..:.       |
|           ;,'              ...,;coO0000KKKO:...       .......',;lc:;         |
|            .l;                ....,;;;;;,'....... .........'''.'ol.          |
|              'o;..                .......................'',''lo.            |
|                .:o.                     ..................'kdc.              |
|                  .,c;.                     .............,cc'                 |
|                      ':c:'.              ..........';cc:.                    |
|                          .;ccc:;,'.........',;:cllc,.                        |
|                               ...,;;::::::;,'..                              |
|                                                                              |
|                                                                              |
|                                                                              |
|                                                                              |
+------------------------------------------------------------------------------+



  Serial Number: ______________________


             +------------+
             |   Submit   |
             +------------+
```

Poking around it is possible to recognize that `http://nidus-setup:8080/api/cooler` is not authenticated and allows to set temperature to hot finally melting the Frost Tower Door:
```bash
elf@588b89ef0d85:~$ curl -XPOST -H 'Content-Type: application/json' \
  --data-binary '{"temperature": 40}' \
  http://nidus-setup:8080/api/cooler
```
```javascript
{
  "temperature": 40.04,
  "humidity": 75.9,
  "wind": 5.47,
  "windchill": 43.92,
  "WARNING": "ICE MELT DETECTED!"
}
```

The full terminal output is available [here](/03.%20Thaw%20Frost%20Tower's%20Entrance/Thaw%20Frost%20Tower's%20Entrance.txt).

---
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
