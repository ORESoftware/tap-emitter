import test from 'ava';
import Messages from '../lib/messages';

const m = new Messages(13, 0);

test('version', t => {
	t.is(m.version(), 'TAP version 13');
	t.is(new Messages(14, 0).version(), 'TAP version 14');
});

test('plan', t => {
	t.is(m.plan(2), '1..2');
	t.is(m.plan(3, 'foo'), '1..3 # foo');
});

test('test', t => {
	t.is(m.test({ok: true}), 'ok');
	t.is(m.test({ok: false}), 'not ok');
	t.is(m.test({ok: true, testNumber: 1}), 'ok 1');
	t.is(m.test({ok: false, testNumber: 2}), 'not ok 2');

	t.is(
		m.test({ok: true, testNumber: 3, description: 'foo'}),
		'ok 3 - foo'
	);

	t.is(
		m.test({ok: true, testNumber: 4, description: 'bar', directive: 'SKIP'})
		, 'ok 4 - bar # SKIP'
	);
});

test('diagnostic', t => {
	t.is(m.diagnostic('foo'), '# foo');
});

test('yaml', t => {
	t.is(m.yaml({foo: 'bar', baz: 3}), [
		'  ---',
		'  foo: bar',
		'  baz: 3',
		'  ...'
	].join('\n'));
});

test('indents', t => {
	const m4 = new Messages(13, 4);

	t.is(m4.version(), '    TAP version 13');
	t.is(m4.plan(2), '    1..2');
	t.is(m4.test({ok: true}), '    ok');
	t.is(m4.diagnostic('foo'), '    # foo');

	t.is(m4.yaml({foo: 'bar', baz: 3}), [
		'      ---',
		'      foo: bar',
		'      baz: 3',
		'      ...'
	].join('\n'));
});

