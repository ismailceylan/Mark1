define(
[
	"system/library/markdown/plugins/index",
	"./short-bkz",
	"./direct-bkz",
	"./bkz",
	"./photo",
	"./duyoji",
	"./conversation",
	"./spoiler",
	"./hashtag",

],
function( SystemPlugins, ShortBKZ, DirectBKZ, BKZ, Photo, Duyoji, Conversation, Spoiler, Hashtag )
{
	SystemPlugins.bkz = BKZ;
	SystemPlugins.photo = Photo;
	SystemPlugins.duyoji = Duyoji;
	SystemPlugins.hashtag = Hashtag;
	SystemPlugins.spoiler = Spoiler;
	SystemPlugins.shortBKZ = ShortBKZ;
	SystemPlugins.directBKZ = DirectBKZ;
	SystemPlugins.conversation = Conversation;
});
