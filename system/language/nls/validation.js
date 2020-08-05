define(
[
	'./tr/validation'
],
{
	"tr": true,

	root:
	{
		required: 'Don\'t leave this input empty!',
		url: 'That field doesn\'t look like a web address!',
		number: 'That field required number.',
		greater: 'Field must be greater than %s.',
		less: 'Field must be less than %s.',
		min_length: 'Field must contain minimum %s character(s).',
		max_length: 'Field must contain maximum %s character(s).',
		email: 'Field must contain an valid e-mail address.',
		matches: 'Field doesn\'t match with %s field.',
		alpha: 'Field must contain only %s and alphabetical characters.',
		hex: 'Field must contain only hexadecimal symbols.'
	},
});
