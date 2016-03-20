import test from 'ava';
import path from 'path';
import fs from 'fs';
import atoe from 'array-to-events';
import Messages from '../lib/messages';

import {EventEmitter} from 'events';

function loadFixture(name) {
	return fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8');
}

function runTest(name, opts) {
	opts = opts || {};

	(opts.debug ? test.only : test)(name, t => {
		const events = JSON.parse(loadFixture(name + '.json'));
		const expected = loadFixture(name + '.tap').trim();
		const ee = new EventEmitter();
		const lines = [];
		const messages = new Messages(13, 0);

		ee.on('version', () => lines.push(messages.version()));
		ee.on('plan', plan => lines.push(messages.plan(plan.end)));
		ee.on('assert', assert => {
			const def = {
				ok: assert.ok
			};
			if (opts.id) {
				def.testNumber = assert.id;
			}
			lines.push(messages.test(def));
			if (assert.diag) {
				lines.push(messages.yaml(assert.diag));
			}
		});

		atoe(ee, events);

		const output = lines.join('\n').trim();

		if (opts.debug) {
			console.log(output);
		} else {
			t.is(output, expected);
		}
	});
}

runTest('basic');
runTest('bignum', {id: true});
runTest('bignum_many', {id: true});
// runTest('simple_yaml', {id: true});
