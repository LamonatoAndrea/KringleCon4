; TODO: Find the syscall number for sys_exit and put it in rax
mov rax, 60
; TODO: Put the exit_code we want (99) in rdi
mov rdi, 99
; Perform the actual syscall
syscall