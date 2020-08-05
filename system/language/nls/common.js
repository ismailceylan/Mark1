define(
[
	'./tr/common'
],
{
	"tr": true,

	root:
	{
		firstArgMustStr: "First argument must be string instead of {{ current }}.",
		secArgMustObj: "Second argument must be object instead of {{ current }}.",
		controllerNotExists: "The controller doesn't exists: {{ file }}",
		noModuleDefiniton: "The script doesn't contain asynchronous module definition.",
		unknownLangEntry: "There is no language input called {{ key }}.",
		moduleNotExists: "Unknown module: {{ file }}",
		unknownException: "Unknown exception \"{{ name }}\" on {{ path }}",
		keyNotExists: "The key \"{{ keyname }}\" doesn't exists."
	},
});
