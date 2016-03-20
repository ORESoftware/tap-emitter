import test from 'ava';
import path from 'path';
import fs from 'fs';
import atoe from 'array-to-events';
import Messages from '../lib/messages';

import {EventEmitter} from 'events';

function loadFixture(name) {
	return fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8');
}

function tryLoad(...args) {
	for (var i = 0; i < args.length; i++) {
		try {
			return loadFixture(args[i]);
		} catch (e) {}
	}
	throw new Error('found none of these: ' + args.join(', '));
}

function processEvents(events, lines, indent, opts) {
	const ee = new EventEmitter();
	const messages = new Messages(13, indent);

	ee.on('version', () => lines.push(messages.version()));
	ee.on('plan', plan => lines.push(messages.plan(plan.end)));
	ee.on('bailout', message => lines.push(messages.bailout(message)));
	ee.on('comment', comment => lines.push(messages.diagnostic(comment.replace(/\n$/, '').replace(/^\s*#\s+/, ''))));
	ee.on('child', events => processEvents(events, lines, indent + 4, opts));
	ee.on('assert', assert => {
		const def = {
			ok: assert.ok,
			description: assert.name
		};
		if (opts.id !== false) {
			def.testNumber = assert.id;
		}
		if (assert.time) {
			def.directive = 'time=' + assert.time + 'ms';
		}
		if (assert.skip) {
			def.directive = 'Skip ' + assert.skip;
		}
		if (assert.todo) {
			def.directive = assert.todo === true ? 'TODO' : 'TODO ' + assert.todo;
		}
		lines.push(messages.test(def));
		if (assert.diag) {
			lines.push(messages.yaml(assert.diag));
		}
	});

	atoe(ee, events);
}

function runTest(name, opts) {
	opts = opts || {};

	(opts.debug ? test.only : test)(name, t => {
		const events = JSON.parse(loadFixture(name + '.json'));
		const expected = tryLoad(name + '.tap-out', name + '.tap').trim();
		const lines = [];
		processEvents(events, lines, 0, opts);

		const output = lines.join('\n').trim();

		if (opts.debug) {
			console.log(output);
		} else {
			t.is(output, expected);
		}
	});
}

runTest('bailout');
runTest('basic', {id: false});
runTest('bignum');
runTest('bignum_many');
runTest('broken-yamlish-looks-like-child');
runTest('child-extra');
runTest('combined');

runTest('simple_yaml');
