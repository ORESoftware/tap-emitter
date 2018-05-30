var tap = require('tap');

tap.test('passing nested test', function (t) {
	t.is('bar', 'bar');
	t.end();
});

tap.test('failing nested test', function (t) {
	t.ifError(new Error('foo'));
	t.end();
});
