var fs = require("fs")
var lang = require("./lang.js")

function pprint(obj) {
	console.log(JSON.stringify(obj, null, 2))
}

var srcfile = process.argv[2]
console.log("reading file: " + srcfile)

var src = fs.readFileSync(srcfile, {encoding:"utf-8"})
console.log(src.trim())

var tree = lang.parse(src)

// console.log("syntax tree:")
// console.log(tree)

console.log("output:")
lang.exec(tree, lang.stdlib)
