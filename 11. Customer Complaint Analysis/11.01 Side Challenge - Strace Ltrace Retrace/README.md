# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
# 11. Customer Complaint Analysis
## 11.0. Description

## 11.1. Side Challenge - Strace Ltrace Retrace
The objective is to fix and run the “make the candy” application without knowing much info on it.

The motd of this terminal is:
```bash
Please, we need your help! The cotton candy machine is broken!

We replaced the SD card in the Cranberry Pi that controls it and reinstalled the
software. Now it's complaining that it can't find a registration file!

Perhaps you could figure out what the cotton candy software is looking for...
```

A first run of the application shows the error “Unable to open configuration file.“:
```bash
kotton_kandy_co@02c959b4cc60:~$ ./make_the_candy 
Unable to open configuration file.
```

With strace it is possible to identify the application is looking for the file “registration.json” at the line `openat(AT_FDCWD, "registration.json", O_RDONLY) = -1 ENOENT (No such file or directory)`:
```bash
kotton_kandy_co@02c959b4cc60:~$ strace ./make_the_candy 
execve("./make_the_candy", ["./make_the_candy"], 0x7ffe824d5710 /* 12 vars */) = 0
brk(NULL)                               = 0x5567648fa000
access("/etc/ld.so.nohwcap", F_OK)      = -1 ENOENT (No such file or directory)
access("/etc/ld.so.preload", R_OK)      = -1 ENOENT (No such file or directory)
openat(AT_FDCWD, "/etc/ld.so.cache", O_RDONLY|O_CLOEXEC) = 3
fstat(3, {st_mode=S_IFREG|0644, st_size=19540, ...}) = 0
mmap(NULL, 19540, PROT_READ, MAP_PRIVATE, 3, 0) = 0x7f7ef0107000
close(3)                                = 0
access("/etc/ld.so.nohwcap", F_OK)      = -1 ENOENT (No such file or directory)
openat(AT_FDCWD, "/lib/x86_64-linux-gnu/libc.so.6", O_RDONLY|O_CLOEXEC) = 3
read(3, "\177ELF\2\1\1\3\0\0\0\0\0\0\0\0\3\0>\0\1\0\0\0\20\35\2\0\0\0\0\0"..., 832) = 832
fstat(3, {st_mode=S_IFREG|0755, st_size=2030928, ...}) = 0
mmap(NULL, 8192, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7f7ef0105000
mmap(NULL, 4131552, PROT_READ|PROT_EXEC, MAP_PRIVATE|MAP_DENYWRITE, 3, 0) = 0x7f7eefaf2000
mprotect(0x7f7eefcd9000, 2097152, PROT_NONE) = 0
mmap(0x7f7eefed9000, 24576, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0x1e7000) = 0x7f7eefed9000
mmap(0x7f7eefedf000, 15072, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_ANONYMOUS, -1, 0) = 0x7f7eefedf000
close(3)                                = 0
arch_prctl(ARCH_SET_FS, 0x7f7ef01064c0) = 0
mprotect(0x7f7eefed9000, 16384, PROT_READ) = 0
mprotect(0x556763e0a000, 4096, PROT_READ) = 0
mprotect(0x7f7ef010c000, 4096, PROT_READ) = 0
munmap(0x7f7ef0107000, 19540)           = 0
brk(NULL)                               = 0x5567648fa000
brk(0x55676491b000)                     = 0x55676491b000
openat(AT_FDCWD, "registration.json", O_RDONLY) = -1 ENOENT (No such file or directory)
fstat(1, {st_mode=S_IFCHR|0620, st_rdev=makedev(136, 0), ...}) = 0
write(1, "Unable to open configuration fil"..., 35Unable to open configuration file.
) = 35
exit_group(1)                           = ?
+++ exited with 1 +++
```

Once created, the application still crashes with error “Unregistered - Exiting.”:
```bash
kotton_kandy_co@02c959b4cc60:~$ touch registration.json

kotton_kandy_co@02c959b4cc60:~$ ./make_the_candy 
Unregistered - Exiting.
```

With ltrace it is possible to identify the function `getline(0x7ffcffb78de0, 0x7ffcffb78de8, 0x561356d00260, 0x7ffcffb78de8) = -1` trying to retrieve data from “registration.json”:
```bash
kotton_kandy_co@02c959b4cc60:~$ ltrace ./make_the_candy 
fopen("registration.json", "r")                           = 0x561356d00260
getline(0x7ffcffb78de0, 0x7ffcffb78de8, 0x561356d00260, 0x7ffcffb78de8) = -1
puts("Unregistered - Exiting."Unregistered - Exiting.
)                           = 24
+++ exited (status 1) +++
```

I just started inserting some random data:
```bash
kotton_kandy_co@02c959b4cc60:~$ echo "12345678" > registration.json 
```

Re-executing the application gives the same error, but ltrace shows that it is because the content of the file doesn’t match what the application expects with the `strstr` function:
```bash
kotton_kandy_co@02c959b4cc60:~$ ltrace ./make_the_candy 
fopen("registration.json", "r")                           = 0x55b16b0f1260
getline(0x7ffd73e349c0, 0x7ffd73e349c8, 0x55b16b0f1260, 0x7ffd73e349c8) = 9
strstr("12345678\n", "Registration")                      = nil
getline(0x7ffd73e349c0, 0x7ffd73e349c8, 0x55b16b0f1260, 0x7ffd73e349c8) = -1
puts("Unregistered - Exiting."Unregistered - Exiting.
)                           = 24
+++ exited (status 1) +++
```

First word is "Registration":
```bash
kotton_kandy_co@02c959b4cc60:~$ echo "Registration" >> registration.json
kotton_kandy_co@02c959b4cc60:~$ ltrace make_the_candy 
kotton_kandy_co@02c959b4cc60:~$ ltrace ./make_the_candy 
fopen("registration.json", "r")                           = 0x5561d5f8a260
getline(0x7ffceb55cdd0, 0x7ffceb55cdd8, 0x5561d5f8a260, 0x7ffceb55cdd8) = 13
strstr("Registration\n", "Registration")                  = "Registration\n"
strchr("Registration\n", ':')                             = nil
getline(0x7ffceb55cdd0, 0x7ffceb55cdd8, 0x5561d5f8a260, 0x7ffceb55cdd8) = -1
puts("Unregistered - Exiting."Unregistered - Exiting.
)                           = 24
+++ exited (status 1) +++
```
Then it expects a ":" character:
```bash
kotton_kandy_co@02c959b4cc60:~$ echo "Registration" >> registration.json
kotton_kandy_co@02c959b4cc60:~$ ltrace make_the_candy 
kotton_kandy_co@02c959b4cc60:~$ ltrace ./make_the_candy 
fopen("registration.json", "r")                           = 0x5561d5f8a260
getline(0x7ffceb55cdd0, 0x7ffceb55cdd8, 0x5561d5f8a260, 0x7ffceb55cdd8) = 13
strstr("Registration\n", "Registration")                  = "Registration\n"
strchr("Registration\n", ':')                             = nil
getline(0x7ffceb55cdd0, 0x7ffceb55cdd8, 0x5561d5f8a260, 0x7ffceb55cdd8) = -1
puts("Unregistered - Exiting."Unregistered - Exiting.
)                           = 24
+++ exited (status 1) +++
```
And finally it searches for the string "True":
```bash
kotton_kandy_co@019be853f544:~$ echo "Registration:" > registration.json
kotton_kandy_co@019be853f544:~$ ltrace ./make_the_candy 
fopen("registration.json", "r")                           = 0x561594d4f260
getline(0x7ffcbceb1900, 0x7ffcbceb1908, 0x561594d4f260, 0x7ffcbceb1908) = 14
strstr("Registration:\n", "Registration")                 = "Registration:\n"
strchr("Registration:\n", ':')                            = ":\n"
strstr(":\n", "True")                                     = nil
getline(0x7ffcbceb1900, 0x7ffcbceb1908, 0x561594d4f260, 0x7ffcbceb1908) = -1
puts("Unregistered - Exiting."Unregistered - Exiting.
)                           = 24
+++ exited (status 1) +++
```

The final content of the “registration.json” file is “Registration:True” and the application can now run:
```bash
kotton_kandy_co@02c959b4cc60:~$ echo "Registration:True" > registration.json 

kotton_kandy_co@02c959b4cc60:~$  ./make_the_candy 



Launching...

     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
                    **
                   *  *
                  *    *
                 *      *
                *        *
               *          *
              *            *
             *              *
            *                *
           *                  *
          *                    *
         *                      *
        *                        *
       *                          *
      *                            *
     *                              *
     *                              *
     *                              *
     *                              *
      *                            *
       *                          *
        *                        *
         *                      *
          *                    *
           *                  *
            *                *
             *              *
              *            *
               *          *
                *        *
                 *      *
                  *    *
                   *  *
                    **
         Candy making in progress
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