define(
[
	"./string/slug",
	"./string/trim2",
	"./string/assign",
	"./string/config",
	"./string/extract",
	"./string/frequency",
	"./string/to-regexp",
	"./string/turkishify",
	"./string/html-encode",

	"./string/transportable",
	"./string/is-single-line",
	"./string/similarity-sort",
	"./string/serialize-key-value",
	"./string/escape-regexp-syntax",
	
	"./string/serialize-method-call",
	"./string/unserialize-key-value",
	"./string/unserialize-method-call",

],
function
(
	slug, trim2, assign, config, extract, frequency, toRegExp, turkishify, htmlencode,
	transportable, isSingleLine, similaritySort, serializeKeyValue, escapeRegexpSyntax,
	serializeMethodCall, unserializeKeyValue, unserializeMethodCall
)
{
	return {
		slug: slug,
		trim2: trim2,
		assign: assign,
		config: config,
		extract: extract,
		frequency: frequency,
		toRegExp: toRegExp,
		turkishify: turkishify,
		htmlencode: htmlencode,
		transportable: transportable,
		isSingleLine: isSingleLine,
		similaritySort: similaritySort,
		serializeKeyValue: serializeKeyValue,
		escapeRegexpSyntax: escapeRegexpSyntax,
		serializeMethodCall: serializeMethodCall,
		unserializeKeyValue: unserializeKeyValue,
		unserializeMethodCall: unserializeMethodCall
	}
});
