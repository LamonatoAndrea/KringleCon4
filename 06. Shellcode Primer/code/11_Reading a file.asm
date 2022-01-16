call fopen
; TODO: Get a reference to this
db '/var/northpolesecrets.txt',0

fopen:
	mov rax, 2
	pop rdi
	mov rsi,0
	mov rdx,0
	syscall

; TODO: Call sys_read on the file handle and read it into rsp
mov rdi, rax
mov rax, 0
mov rsi, rsp
mov rdx, 136
syscall

; TODO: Call sys_write to write the contents from rsp to stdout (1)
mov rax, 1
mov rdi, 1
mov rsi, rsp
syscall

; TODO: Call sys_exit
exit:
	mov rax, 60
	syscall