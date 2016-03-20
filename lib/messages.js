'use strict';
var yaml = require('js-yaml');

module.exports = TapLines;

function TapLines(protocolVersion, indent) {
	this.protocolVersion = protocolVersion;
	this.indent = indent;
}

TapLines.prototype._indented = function () {
	var parts = new Array(this.indent);
	if (arguments.length > 0) {
		parts.push.apply(parts, arguments);
	}
	return parts;
};

function print(line) {
	if (Array.isArray(line)) {
		line = line.join(' ');
	}
	return line.trim() ? line : '';
}

TapLines.prototype.version = function () {
	return print(this._indented('TAP version', this.protocolVersion));
};

TapLines.prototype.plan = function (count, directive) {
	var parts = this._indented('1..' + count);
	if (directive) {
		parts.push('#', directive);
	}
	return print(parts);
};

TapLines.prototype.test = function (opts) {
	var parts = this._indented(opts.ok ? 'ok' : 'not ok');
	if (typeof opts.testNumber === 'number') {
		parts.push(opts.testNumber);
	}
	if (opts.description !== null && typeof opts.description !== 'undefined') {
		parts.push('-', opts.description);
	}
	if (opts.directive) {
		parts.push('#', opts.directive);
	}
	return parts.join(' ');
};

TapLines.prototype.diagnostic = function (message) {
	return print(this._indented('#', message));
};

TapLines.prototype.yaml = function (object) {
	// TODO: include this conditional check from tap?
	// if (obj && typeof obj === 'object' && Object.keys(obj).length) {
	var indent = new Array(this.indent + 3).join(' ');
	var y = yaml.safeDump(object).split('\n').map(function (l) {
		return l.trim() ? indent + l : '';
	}).join('\n');
	return indent + '---\n' + y + indent + '...';
};

TapLines.prototype.bailout = function (message) {
	return print(this._indented('Bail out!', message || ''));
};
