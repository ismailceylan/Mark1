define(
[
	"./header",
	"./italic",
	"./bold",
	"./itabold",
	"./new-line",
	"./blockquote",
	"./ordered-list",

	"./unordered-list",
	"./list-item",
	"./code",
	"./fenced-code",
	"./horizontal-rule",
	"./link",

	"./youtube-link",
	"./direct-link",
	"./email",
	"./table",
	
],
function
(
	Header, Italic, Bold, Itabold, NewLine, Blockquote, OrderedList,
	UnorderedList, ListItem, Code, FencedCode, HorizontalRule, Link,
	YoutubeLink, DirectLink, Email, Table
)
{
	return {
		header: Header,
		italic: Italic,
		bold: Bold,
		itabold: Itabold,
		newLine: NewLine,
		blockquote: Blockquote,
		orderedList: OrderedList,
		listItem: ListItem,
		unorderedList: UnorderedList,
		code: Code,
		fencedCode: FencedCode,
		horizontalRule: HorizontalRule,
		link: Link,
		youtubeLink: YoutubeLink,
		directLink: DirectLink,
		email: Email,
		table: Table,
	}
});
