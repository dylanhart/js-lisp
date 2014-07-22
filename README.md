#JS-Lisp
##A simple lisp interpreter in js

To run lisp code:
``$ node lisp.js <filename>``

##Syntax

###Builtin Functions

| Name | Syntax | Description |
|------|--------|-------------|
| def | (def symbol value ...) | defines values onto the current scope |
| print | (print value ...) | prints values separated by a space |
| do | (do (code) ...) | execs all of its arguments |
| fn | (fn (arg1 arg2 ...) (code)) | return a function that takes the arglist as args and executes code |
| let | (let (symbol value ...) (code)) | defines values on a new scope and executes code |
| if | (if cond (iftrue) ?(iffalse)) | execs cond and runs iftrue if cond is true and runs iffalse if cond is false and iffalse exists |
| + - * / | (op arg1 arg2 ...) | reduces the arguments using the operator specified |
| or | (or arg1 arg2 ...) | returns the first true arg or false |
| and | (and arg1 arg2 ...) | returns true if all the args are true otherwise returns false |
| not | (not arg) | returns !arg |
| > < | (op a b) | returns whether a is > or < b |