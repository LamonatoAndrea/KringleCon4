; This would be a good place for a call
call hw

; This is the literal string 'Hello World', null terminated, as code. Except
; it'll crash if it actually tries to run, so we'd better jump over it!
db 'Hello World',0

; This would be a good place for a label and a pop
hw:
pop rax

; This would be a good place for a re... oh wait, it's already here. Hooray!
ret
