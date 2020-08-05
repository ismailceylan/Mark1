define(
[
	"./url/parse",
	"./url/config",
	"./url/is-path",
	"./url/parse-host",
	"./url/is-external",
	"./url/serialize-querystring",
	"./url/unserialize-querystring",

],
function( parse, config, isPath, parseHost, isExternal, serializeQuerystring, unserializeQuerystring )
{
	return {
		parse: parse,
		config: config,
		isPath: isPath,
		parseHost: parseHost,
		isExternal: isExternal,
		serializeQuerystring: serializeQuerystring,
		unserializeQuerystring: unserializeQuerystring
	}
});
