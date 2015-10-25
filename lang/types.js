
exports.isType = function(obj, type) {
	return obj.type && type.prototype.type
			&& obj.type === type.prototype.type;
}

// Symbol

exports.Symbol = function(name) {
	this.name = name;
}
exports.Symbol.prototype.type = "symbol";

exports.Symbol.prototype.equals = function(other) {
	return this.name === other.name;
}

// Proc

exports.Proc = function(args, tree) {
	this.args = args;
	this.tree = tree;
}
exports.Proc.prototype.type = "proc";
