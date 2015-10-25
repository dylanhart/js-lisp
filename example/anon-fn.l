((fn (s) (print s))
	"Hello!")

; Y combinator
; passes along one arg
(def Y (fn (f)
	((fn (x) (x x))
		(fn (y)
			(f 
				(fn (n)
					((y y) n)))))))

; fibonacci defined using Y comb.
(def fib (Y (fn (fib)
	(fn (n)
		(if (< n 2)
			1
			(+ (fib (- n 1)) (fib (- n 2))))))))

(print (fib 0) (fib 1) (fib 2) (fib 3) (fib 5) (fib 6))