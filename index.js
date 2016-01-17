'use strict';

var Messages = require('./lib/messages');
var stack = require('stack-utils');

var m = new Messages(13, 0);

console.log(m.version());
console.log(m.plan(100));

for (var i = 0; i < 99; i++) {
	console.log(m.test({ok: true, description: 'test ' + i, directive: 'time=3.2ms'}));
}

function foo() {
	try {
		require('assert').strictEqual(1, 2);
	} catch (e) {
		e.at = stack.at(foo);
		e.stack = stack.clean(e.stack);
		e.found = e.actual;
		e.wanted = e.expected;
		console.log(m.test({ok: false, description: 'should be equal'}));
		console.log(m.yaml(e));
	}
}

foo();
