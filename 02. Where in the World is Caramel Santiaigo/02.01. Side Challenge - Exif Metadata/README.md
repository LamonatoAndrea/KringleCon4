# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
# 2. [Where in the World is Caramel Santiaigo?](/02.%20Where%20in%20the%20World%20is%20Caramel%20Santiaigo/README.md)
## 2.1. Side Challenge - Exif Metadata
The objective is to identify the file tampered by Jack Frost by knowing the `exiftool` is installed in the system.
The files are `docx` and `exiftool` is able to show metadata such as the `Last Modified By` value. By pivoting on this value it is possible to notice `2021-12-21.docx` was last modified by Jack Frost with a *handy* one-liner such as:
```bash
for f in $(ls -1); do exiftool $f | grep -v "Santa Claus" | grep "Last Modified By" && echo $f; done
```

The console output follows:
```bash
elf@1f079d1ce670:~$ ls
2021-12-01.docx  2021-12-06.docx  2021-12-11.docx  2021-12-16.docx  2021-12-21.docx
2021-12-02.docx  2021-12-07.docx  2021-12-12.docx  2021-12-17.docx  2021-12-22.docx
2021-12-03.docx  2021-12-08.docx  2021-12-13.docx  2021-12-18.docx  2021-12-23.docx
2021-12-04.docx  2021-12-09.docx  2021-12-14.docx  2021-12-19.docx  2021-12-24.docx
2021-12-05.docx  2021-12-10.docx  2021-12-15.docx  2021-12-20.docx  2021-12-25.docx

elf@a8c856b363a8:~$ for f in $(ls -1); do exiftool $f | grep -v "Santa Claus" | grep "Last Modified By" && echo $f; done
Last Modified By                : Jack Frost
2021-12-21.docx
```
```bash
HELP! That wily Jack Frost modified one of our naughty/nice records, and right 
before Christmas! Can you help us figure out which one? We've installed exiftool
for your convenience!

Filename (including .docx extension) > 2021-12-21.docx
Your answer: 2021-12-21.docx

Checking........
Wow, that's right! We couldn't have done it without your help! Congratulations!
```

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
# [0. windovo\\thedead> whoami](../README.md)
# [1. KringleCon Orientation](01.%20KringleCon%20Orientation/README.md)
# [16. That’s how Jack came from space](../README.md#16-thats-how-jack-came-from-space)
# [17. Narrative](../README.md#17-narrative)
# [18. Conclusions](../README.md#18-conclusions)