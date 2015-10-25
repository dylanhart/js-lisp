var types = require("./types.js");

var execAll = function (exec, scope, arr) {
	return arr.map(function(item) {
		return exec(item, scope);
	});
};

exports["def"] = function(exec, scope, args) {
	if (args.length % 2 != 0)
		throw new Error("invalid arg count: def takes an even number of args");

	for (var i = 0; i < args.length; i += 2) {
		var s = args[i];
		if (!types.isType(s, types.Symbol))
			throw new Error("cannot assign value to non-symbol");

		scope[s.name] = exec(args[i+1], scope);
	}

	return null;
};

exports["print"] = function(exec, scope, args) {
	console.log(execAll(exec, scope, args).join(" "));

	return null;
};

exports["do"] = function(exec, scope, args) {
	if (args.length < 1)
		throw new Error("invalid arg count: do must not be empty");

	var vals = execAll(exec, scope, args);
	return vals[vals.length - 1];
};

exports["fn"] = function(exec, scope, args) {
	if (args.length < 2)
		throw new Error("invalid arg count: fn must have args and code");

	var argNames = args[0].map(function(s) {
		if (!types.isType(s, types.Symbol))
			throw new Error("function args must be symbols");
		return s.name;
	});

	// build code tree out of rest of arguments
	var code;
	if (args.length > 2)
		code = args.slice(1).unshift(new types.Symbol("do"));
	else
		code = args[1];

	return new types.Proc(argNames, code, scope);
};

exports["let"] = function(exec, scope, args) {
	var assigns = args[0];
	if (assigns.length % 2 != 0)
		throw new Error("invalid assignment list in let");

	var newScope = Object.create(scope);
	for (var i = 0; i < assigns.length; i += 2) {
		var s = assigns[0];
		if (!types.isType(s, types.Symbol))
			throw new Error("cannot assign value to non-symbol");

		newScope[s.name] = exec(assigns[i+1], newScope);
	}

	// build code tree out of rest of arguments
	var code;
	if (args.length > 2)
		code = args.slice(1).unshift(new types.Symbol("do"));
	else
		code = args[1];

	return exec(code, newScope);
};

exports["if"] = function(exec, scope, args) {
	if (args.length != 2 && args.length != 3)
		throw new Error("invalid arg count: if takes 2 or 3 args");

	// cast to bool
	var cond = exec(args[0], scope) == true;

	if (cond) {
		// true
		return exec(args[1], scope);
	} else if (args.length == 3) {
		// false
		return exec(args[2], scope);
	} else {
		// false without value
		return null;
	}
};

exports["or"] = function(exec, scope, args) {
	if (args.length == 0)
		throw new Error("invalid arg count: or takes at least one argument");

	for (var i = 0; i < args.length; i++) {
		var val = exec(args[i], scope);
		if (val)
			return val;
	}

	return false;
}

exports["and"] = function(exec, scope, args) {
	if (args.length == 0)
		throw new Error("invalid arg count: and takes at least one argument");

	for (var i = 0; i < args.length; i++) {
		var val = exec(args[i], scope);
		if (!val)
			return val;
	}

	return true;
}

exports["not"] = function(exec, scope, args) {
	if (args.length != 1)
		throw new Error("invalid arg count: not takes a single argument");

	return !exec(args[0], scope);
}

var op = function(reductionFn) {
	return function(exec, scope, args) {
		if (args.length < 2)
			throw new Error("invalid arg count: cannot apply operator to < 2 arguments");

		return execAll(exec, scope, args).reduce(reductionFn);
	};
};

exports["+"] = op(function(a, b) {
	return a + b;
});

exports["-"] = op(function(a, b) {
	return a - b;
});

exports["*"] = op(function(a, b) {
	return a * b;
});

exports["/"] = op(function(a, b) {
	return a / b;
});

exports["<"] = function(exec, scope, args) {
	if (args.length != 2)
		throw new Error("invalid arg count: < takes two arguments");

	return exec(args[0], scope) < exec(args[1], scope);
}

exports[">"] = function(exec, scope, args) {
	if (args.length != 2)
		throw new Error("invalid arg count: > takes two arguments");

	return exec(args[0], scope) > exec(args[1], scope);
}