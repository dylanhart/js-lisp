
(def double (fn (n) (* n 2)))
(print (double 2) (double (+ 2 2)))


(def fib 
	(fn (n)
		(if (< n 2)
			1
			(+
				(fib (- n 1))
				(fib (- n 2))))))
(print (fib 5))