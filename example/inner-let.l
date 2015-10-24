(print
	(let (a (+ 2 3))
		(let
			(b 4,
			 c (let (d 1) (- a d)))
			(* b c))))