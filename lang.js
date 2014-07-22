var rgx = {
	symbol: /[\w_+-]+/,
	number: /-?\d+/,
	whitespace: /[\s,]+/,
	block: /\((.+)\)/
}

var keywords = [
	"def",
	"print",
	"do",
	"fn",
	"let",
	"+",
	"-",
	"*",
	"/"
]

var symbols = {}
keywords.forEach(function(k) {
	symbols[k] = new Symbol(k)
})

function Symbol(name) {
	this.name = name
}
Symbol.prototype.equals = function(b) {
	return this.name == b.name
}
// Symbol.prototype.toString = function() {
// 	return "S:" + this.name
// }

function Proc(tree, args) {
	this.tree = tree
	this.args = args
}

function read(tokens) {
	if (tokens.length == 0)
		throw new Error("EOF while reading")
	t = tokens.shift()
	if (t == "(") {
		var list = []
		var next = tokens[0]
		while (next != ")") {
			list.push(read(tokens))
			next = tokens[0]
		}
		tokens.shift()
		return list
	} else if (t == ")") {
		// console.log(tree)
		throw new Error("unmatched right paren")
	} else {
		if (rgx.number.test(t)) {
			return parseInt(t)
		} else if (rgx.symbol.test(t) || keywords.indexOf(t) >= 0) {
			return new Symbol(t)
		} else {
			throw new Error("invalid token: " + t)
		}
	}
	
}

function parse(src) {
	src = src.replace(/\n/, " ").replace(/([\(\)])/g, " $& ").replace(/\n/, " ")
	var tokens = src.split(rgx.whitespace).filter(function(t) {return t != ''})
	var tree = read(tokens)	
	return tree
}

function exec(tree, env) {
	if (Array.isArray(tree)) {
		var first = tree[0]

		if (!(first instanceof Symbol))
			throw new Error("first element of block must be a symbol")

		if (first.equals(symbols["do"])) {
			var ret
			for (var i = 1; i < tree.length; i++) {
				ret = exec(tree[i], env)
			}
			return ret
		} else if (first.equals(symbols["def"])) {
			if (tree.length % 2 != 1)
				throw new Error("invalid arg count for def")
			for (var i = 1; i < tree.length; i+=2) {
				var k = tree[i]
				var v = exec(tree[i+1], env)
				// console.log("k: " + k + " v: " + v)
				if (!(k instanceof Symbol))
					throw new Error("def name must be a symbol")
				env[k.name] = v
			};
			return null
		} else if (first.equals(symbols["print"])) {
			var elems = tree.slice(1)
			elems = elems.map(function(e) {return exec(e, env)})
			console.log(elems.join(" "))
			return null
		} else if (first.equals(symbols["+"])) {
			var elems = tree.slice(1)
			elems = elems.map(function(e) {return exec(e, env)})
			return elems.reduce(function(a, b) {return a + b})
		} else if (first.equals(symbols["-"])) {
			var elems = tree.slice(1)
			elems = elems.map(function(e) {return exec(e, env)})
			return elems.reduce(function(a, b) {return a - b})
		} else if (first.equals(symbols["*"])) {
			var elems = tree.slice(1)
			elems = elems.map(function(e) {return exec(e, env)})
			return elems.reduce(function(a, b) {return a * b})
		} else if (first.equals(symbols["/"])) {
			var elems = tree.slice(1)
			elems = elems.map(function(e) {return exec(e, env)})
			return elems.reduce(function(a, b) {return a / b})
		} else if (first.equals(symbols["fn"])) {
			//(fn (arg1 arg2 ...) (code ...))
			return new Proc(tree[2], tree[1].map(function(s) {return s.name}))
		} else if (first.equals(symbols["let"])) {
			//(let (k v k v ...) (code))
			var assigns = tree[1]
			if (assigns.length % 2 != 0)
				throw new Error("invalid assignment in let")

			var scope = {}
			scope.prototype = env
			for (var i = 0; i < assigns.length; i+=2) {
				var k = assigns[i]
				var v = exec(assigns[i+1], env)
				// console.log("k: " + k + " v: " + v)
				if (!(k instanceof Symbol))
					throw new Error("def name must be a symbol")
				scope[k.name] = v
			}
			exec(tree[2], scope)
		} else {
			var proc = env[first.name]
			if (proc === undefined)
				throw new Error("proc not found for symbol: " + first.name)
			if (!(proc instanceof Proc))
				throw new Error("symbol: " + first.name + " is not a proc")
			if (proc.args.length != tree.length - 1)
				throw new Error("invalid arg count")

			var scope = {}
			scope.prototype = env
			proc.args.forEach(function(argname, n) {
				scope[argname] = exec(tree[n+1], env)
			})
			return exec(proc.tree, scope)
		}
	} else if (tree instanceof Symbol) {
		return env[tree.name]
	} else {
		return tree
	}
}

var stdlib = {}

function newGlobalScope() {
	var gs = {}
	gs.prototype = stdlib
	return gs
}

exports.parse = parse
exports.exec = exec
exports.stdlib = stdlib
exports.newGlobalScope = newGlobalScope