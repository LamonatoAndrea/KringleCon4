# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
# 3. Thaw Frost Tower's Entrance
## 3.0. Description
Difficulty: :christmas_tree::christmas_tree:  
Turn up the heat to defrost the entrance to Frost Tower. Click on the Items tab in your badge to find a link to the Wifi Dongle's CLI interface. Talk to Greasy Gopherguts outside the tower for tips.

## 3.1. [Side Challenge - Grepping for Gold](/03.%20Thaw%20Frost%20Tower's%20Entrance/03.01.%20Grepping%20for%20Gold/README.md)

## 3.2. Hints
**Adding Data to cURL requests** - *Greasy GopherGuts*: “When sending a [POST request with data](https://www.educative.io/edpresso/how-to-perform-a-post-request-using-curl), add --data-binary to your curl command followed by the data you want to send.”  
**Web Browsing with cURL** - *Greasy GopherGuts*: “[cURL,](https://linux.die.net/man/1/curl) makes HTTP requests from a terminal - in Mac, Linux, and modern Windows!”  
**Linux Wi-Fi Commands** - *Greasy GopherGuts*: “The [iwlist](https://linux.die.net/man/8/iwlist) and [iwconfig](https://linux.die.net/man/8/iwconfig) utilities are key for managing Wi-Fi from the Linux command line.”  

## 3.3. Solution
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
# [2. Where in the World is Caramel Santiaigo?](README.md)
# [2.1. Side Challenge - Exif Metadata](README.md)
# [3. Thaw Frost Tower's Entrance](README.md)
# [3.1. Side Challenge - Grepping for Gold](README.md)
# [4. Slot Machine Investigation](README.md)
# [4.1. Side Challenge - Logic Munchers](README.md)
# [5. Strange USB Device](README.md)
# [5.1. Side Challenge - IPv6 Sandbox](README.md)
# [6. Shellcode Primer](README.md)
# [6.1. Side Challenge - Holiday Hero](README.md)
# [7. Printer Exploitation](README.md)
# [7.0. Description](README.md)
# [8. Kerberoasting on an Open Fire](README.md)
# [8.1. Side Challenge - HoHo … No](README.md)
# [9. Splunk!](README.md)
# [9.1. Side Challenge - Yara Analysis](README.md)
# [10. Now Hiring!](README.md)
# [10.1. Side Challenge - IMDS Exploration](README.md)
# [11. Customer Complaint Analysis](README.md)
# [11.1. Side Challenge - Strace Ltrace Retrace](README.md)
# [12. Frost Tower Website Checkup](README.md)
# [12.1. Side Challenge - The Elf C0de Python Edition](README.md)
# [13. FPGA Programming](README.md)
# [13.1. Side Challenge - Frostavator](README.md)
# [14. Bonus! Blue Log4Jack](README.md)
# [15. Bonus! Red Log4Jack](README.md)
---
# [0. windovo\\thedead> whoami](/README.md)
# [1. KringleCon Orientation](/01.%20KringleCon%20Orientation/README.md)
# [16. That’s how Jack came from space](/README.md#16-thats-how-jack-came-from-space)
# [17. Narrative](/README.md#17-narrative)
# [18. Conclusions](/README.md#18-conclusions)