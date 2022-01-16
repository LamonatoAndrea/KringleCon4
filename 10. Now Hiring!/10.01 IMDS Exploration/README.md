# Writeup for SANS Holiday Hack Challenge 2021 – Jack’s Back! featuring KringleCon 4: Calling Birds
# 10. Now Hiring!

## 10.1. Side Challenge - IMDS Exploration
### 10.1.0. Task 1
```bash
🎄🎄🎄 Prof. Petabyte here. In this lesson you'll continue to build your cloud asset skills,
🎄🎄🎄 interacting with the Instance Metadata Service (IMDS) using curl.
🎄🎄🎄
🎄🎄🎄 If you get stuck, run 'hint' for assitance.
🎄🎄🎄

───────────────────────────────────────────────────────────────────────────────────────────────

Are you ready to begin? [Y]es: Y
```
### 10.1.1. Task 2
```bash
The Instance Metadata Service (IMDS) is a virtual server for cloud assets at the IP address
169.254.169.254. Send a couple ping packets to the server.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ ping 169.254.169.254 -c1
PING 169.254.169.254 (169.254.169.254) 56(84) bytes of data.
64 bytes from 169.254.169.254: icmp_seq=1 ttl=64 time=0.014 ms

--- 169.254.169.254 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.014/0.014/0.014/0.000 ms
```
### 10.1.2. Task 3
```bash
IMDS provides information about currently running virtual machine instances. You can use it
to manage and configure cloud nodes. IMDS is used by all major cloud providers.
Run 'next' to continue.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ next
```
### 10.1.3. Task 4
```bash
Developers can automate actions using IMDS. We\'ll interact with the server using the cURL
tool. Run 'curl http://169.254.169.254' to access IMDS data.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ curl http://169.254.169.254
latest
```
### 10.1.4. Task 5
```bash
Different providers will have different formats for IMDS data. We\'re using an AWS-compatible
IMDS server that returns 'latest' as the default response. Access the 'latest' endpoint.
Run 'curl http://169.254.169.254/latest'

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ curl http://169.254.169.254/latest
dynamic
meta-data
```
### 10.1.5. Task 6
```bash
IMDS returns two new endpoints: dynamic and meta-data. Let\'s start with the dynamic
endpoint, which provides information about the instance itself. Repeat the request
to access the dynamic endpoint: 'curl http://169.254.169.254/latest/dynamic'.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ curl http://169.254.169.254/latest/dynamic
fws/instance-monitoring
instance-identity/document
instance-identity/pkcs7
instance-identity/signature
```
### 10.1.6. Task 7
```bash
The instance identity document can be used by developers to understand the instance details.
Repeat the request, this time requesting the instance-identity/document resource:
'curl http://169.254.169.254/latest/dynamic/instance-identity/document'.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ curl http://169.254.169.254/latest/dynamic/instance-identity/document
{
        "accountId": "PCRVQVHN4S0L4V2TE",
        "imageId": "ami-0b69ea66ff7391e80",
        "availabilityZone": "np-north-1f",
        "ramdiskId": null,
        "kernelId": null,
        "devpayProductCodes": null,
        "marketplaceProductCodes": null,
        "version": "2017-09-30",
        "privateIp": "10.0.7.10",
        "billingProducts": null,
        "instanceId": "i-1234567890abcdef0",
        "pendingTime": "2021-12-01T07:02:24Z",
        "architecture": "x86_64",
        "instanceType": "m4.xlarge",
        "region": "np-north-1"
}
```
### 10.1.7. Task 8
```bash
Much of the data retrieved from IMDS will be returned in JavaScript Object Notation (JSON)
format. Piping the output to 'jq' will make the content easier to read.
Re-run the previous command, sending the output to JQ: 'curl
http://169.254.169.254/latest/dynamic/instance-identity/document | jq'

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ curl http://169.254.169.254/latest/dynamic/instance-identity/document | q
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   451  100   451    0     0   440k      0 --:--:-- --:--:-- --:--:--  440k
{
  "accountId": "PCRVQVHN4S0L4V2TE",
  "imageId": "ami-0b69ea66ff7391e80",
  "availabilityZone": "np-north-1f",
  "ramdiskId": null,
  "kernelId": null,
  "devpayProductCodes": null,
  "marketplaceProductCodes": null,
  "version": "2017-09-30",
  "privateIp": "10.0.7.10",
  "billingProducts": null,
  "instanceId": "i-1234567890abcdef0",
  "pendingTime": "2021-12-01T07:02:24Z",
  "architecture": "x86_64",
  "instanceType": "m4.xlarge",
  "region": "np-north-1"
}
```
### 10.1.8. Task 9
```bash
Here we see several details about the instance when it was launched. Developers can use this
information to optimize applications based on the instance launch parameters.
Run 'next' to continue.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ next
```
### 10.1.9. Task 10
```bash
In addition to dynamic parameters set at launch, IMDS offers metadata about the instance as
well. Examine the metadata elements available:
'curl http://169.254.169.254/latest/meta-data'

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ curl http://169.254.169.254/latest/meta-data
ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/ami
block-device-mapping/ebs0
block-device-mapping/ephemeral0
block-device-mapping/root
block-device-mapping/swap
elastic-inference/associations
elastic-inference/associations/eia-bfa21c7904f64a82a21b9f4540169ce1
events/maintenance/scheduled
events/recommendations/rebalance
hostname
iam/info
iam/security-credentials
iam/security-credentials/elfu-deploy-role
instance-action
instance-id
instance-life-cycle
instance-type
latest
latest/api/token
local-hostname
local-ipv4
mac
network/interfaces/macs/0e:49:61:0f:c3:11/device-number
network/interfaces/macs/0e:49:61:0f:c3:11/interface-id
network/interfaces/macs/0e:49:61:0f:c3:11/ipv4-associations/192.0.2.54
network/interfaces/macs/0e:49:61:0f:c3:11/ipv6s
network/interfaces/macs/0e:49:61:0f:c3:11/local-hostname
network/interfaces/macs/0e:49:61:0f:c3:11/local-ipv4s
network/interfaces/macs/0e:49:61:0f:c3:11/mac
network/interfaces/macs/0e:49:61:0f:c3:11/owner-id
network/interfaces/macs/0e:49:61:0f:c3:11/public-hostname
network/interfaces/macs/0e:49:61:0f:c3:11/public-ipv4s
network/interfaces/macs/0e:49:61:0f:c3:11/security-group-ids
network/interfaces/macs/0e:49:61:0f:c3:11/security-groups
network/interfaces/macs/0e:49:61:0f:c3:11/subnet-id
network/interfaces/macs/0e:49:61:0f:c3:11/subnet-ipv4-cidr-block
network/interfaces/macs/0e:49:61:0f:c3:11/subnet-ipv6-cidr-blocks
network/interfaces/macs/0e:49:61:0f:c3:11/vpc-id
network/interfaces/macs/0e:49:61:0f:c3:11/vpc-ipv4-cidr-block
network/interfaces/macs/0e:49:61:0f:c3:11/vpc-ipv4-cidr-blocks
network/interfaces/macs/0e:49:61:0f:c3:11/vpc-ipv6-cidr-blocks
placement/availability-zone
placement/availability-zone-id
placement/group-name
placement/host-id
placement/partition-number
placement/region
product-codes
public-hostname
public-ipv4
public-keys/0/openssh-key
reservation-id
security-groups
services/domain
services/partition
spot/instance-action
spot/termination-time
```
### 10.1.10. Task 11
```bash
By accessing the metadata elements, a developer can interrogate information about the system.
Take a look at the public-hostname element:
'curl http://169.254.169.254/latest/meta-data/public-hostname'

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ curl http://169.254.169.254/latest/meta-data/public-hostname
ec2-192-0-2-54.compute-1.amazonaws.comelfu@ef847607ac3f:~$
```
### 10.1.11. Task 12
```bash
Many of the data elements returned won\'t include a trailing newline, which causes the
response to blend into the prompt. Re-run the prior command, adding '; echo' to the end of
the command. This will add a new line character to the response.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ elfu@ef847607ac3f:~$ curl http://169.254.169.254/latest/meta-data/public-hostname ; echo
ec2-192-0-2-54.compute-1.amazonaws.com
```
### 10.1.12. Task 13
```bash
Many of the data elements returned won\'t include a trailing newline, which causes the
response to blend into the prompt. Re-run the prior command, adding '; echo' to the end of
the command. This will add a new line character to the response.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ elfu@ef847607ac3f:~$ curl http://169.254.169.254/latest/meta-data/public-hostname ; echo
ec2-192-0-2-54.compute-1.amazonaws.com
```
### 10.1.13. Task 14
```bash
There is a whole lot of information that can be retrieved from the IMDS server. Even AWS
Identity and Access Management (IAM) credentials! Request the endpoint
'http://169.254.169.254/latest/meta-data/iam/security-credentials' to see the instance IAM
role.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ curl http://169.254.169.254/latest/meta-data/iam/security-credentials
elfu-deploy-role
```
### 10.1.14. Task 15
```bash
There is a whole lot of information that can be retrieved from the IMDS server. Even AWS
Identity and Access Management (IAM) credentials! Request the endpoint
'http://169.254.169.254/latest/meta-data/iam/security-credentials' to see the instance IAM
role.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ curl http://169.254.169.254/latest/meta-data/iam/security-credentials
elfu-deploy-role
```
### 10.1.15. Task 16
```bash
Once you know the role name, you can request the AWS keys associated with the role. Request
the endpoint 'http://169.254.169.254/latest/meta-data/iam/security-credentials/elfu-deploy-
role' to get the instance AWS keys.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ curl 'http://169.254.169.254/latest/meta-data/iam/security-credentials/elfu-deploy-role'
{
        "Code": "Success",
        "LastUpdated": "2021-12-02T18:50:40Z",
        "Type": "AWS-HMAC",
        "AccessKeyId": "AKIA5HMBSK1SYXYTOXX6",
        "SecretAccessKey": "CGgQcSdERePvGgr058r3PObPq3+0CfraKcsLREpX",
        "Token": "NR9Sz/7fzxwIgv7URgHRAckJK0JKbXoNBcy032XeVPqP8/tWiR/KVSdK8FTPfZWbxQ==",
        "Expiration": "2026-12-02T18:50:40Z"
}
```
### 10.1.16. Task 17
```bash
So far, we\'ve been interacting with the IMDS server using IMDSv1, which does not require
authentication. Optionally, AWS users can turn on IMDSv2 that requires authentication. This
is more secure, but not on by default.
Run 'next' to continue.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ next
```
### 10.1.17. Task 18
```bash
For IMDSv2 access, you must request a token from the IMDS server using the
X-aws-ec2-metadata-token-ttl-seconds header to indicate how long you want the token to be
used for (between 1 and 21,600 secods).
Examine the contents of the 'gettoken.sh' script in the current directory using 'cat'.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ cat gettoken.sh 
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`

```
### 10.1.18. Task 19
```bash
This script will retrieve a token from the IMDS server and save it in the environment
variable TOKEN. Import it into your environment by running 'source gettoken.sh'.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ source gettoken.sh 
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    44  100    44    0     0  44000      0 --:--:-- --:--:-- --:--:-- 44000
```
### 10.1.19. Task 20
```bash
Now, the IMDS token value is stored in the environment variable TOKEN. Examine the contents
of the token by running 'echo $TOKEN'.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ echo $TOKEN
gYVa2GgdDYbR6R4AFnk5y2aU0sQirNIIoAcpOUh/aZk=
```
### 10.1.20. Task 21
```bash
With the IMDS token, you can make an IMDSv2 request by adding the X-aws-ec2-metadata-token
header to the curl request. Access the metadata region information in an
IMDSv2 request: 'curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-
data/placement/region'

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/placement/region
np-north-1
```
### 10.1.21. Task 22
```bash
🍬🍬🍬🍬Congratulations!🍬🍬🍬🍬
You've completed the lesson on Instance Metadata interaction. Run 'exit' to close.

───────────────────────────────────────────────────────────────────────────────────────────────

elfu@ef847607ac3f:~$ exit
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