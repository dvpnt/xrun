'use strict';

var expect = require('expect.js'),
	spawn = require('./helpers').spawn;

describe('xrun', function() {
	var test = function(text, args, dir, expected) {
		it(text, function() {
			var result = spawn(args, dir);
			expect(result.stdout).to.equal(expected.stdout);
			expect(result.stderr).to.equal(expected.stderr);
			expect(result.code).to.equal(expected.code);
		});
	};

	test('without package.json in cwd', [], 'empty', {
		stdout: '',
		stderr: '[xrun] can\'t find package.json\n',
		code: 1
	});

	test('with malformed package.json', [], 'malformed', {
		stdout: '',
		stderr: '[xrun] can\'t parse package.json\n',
		code: 1
	});

	test('without args just exit', [], 'ok', {
		stdout: '',
		stderr: '',
		code: 0
	});

	test('run script without args', ['script1'], 'ok', {
		stdout: '> xrun script1\n' +
			'> echo \'hello from xrun\' \n' +
			'hello from xrun\n',
		stderr: '',
		code: 0
	});

	test('run unexisting script ', ['unexisting'], 'ok', {
		stdout: '',
		stderr: '[xrun] missing script: unexisting\n',
		code: 1
	});

	test('run script without args', ['script1'], 'ok', {
		stdout: '> xrun script1\n' +
			'> echo \'hello from xrun\' \n' +
			'hello from xrun\n',
		stderr: '',
		code: 0
	});

	test('run script with args', ['script2', 'hello'], 'ok', {
		stdout: '> xrun script2\n' +
			'> echo hello\n' +
			'hello\n',
		stderr: '',
		code: 0
	});

	test('run script with space in arg', ['script2', 'oh hi'], 'ok', {
		stdout: '> xrun script2\n' +
			'> echo oh hi\n' +
			'oh hi\n',
		stderr: '',
		code: 0
	});

	test('working with npm `pre` and `post`', ['script3'], 'ok', {
		stdout: '> xrun script3\n' +
			'> echo \'script3\' \n' +
			'pre script3\n' +
			'script3\n' +
			'post script3\n',
		stderr: '',
		code: 0
	});

	test('working with npm config variables', ['script4'], 'ok', {
		stdout: '> xrun script4\n' +
			'> echo "$npm_package_config_message" \n' +
			'message from config\n',
		stderr: '',
		code: 0
	});

	[-1, 0, 1, 8].forEach(function(code) {
		test(
			'pass correct exit code for `' + code + '` code',
			['exit', code],
			'ok',
			{
				stdout: '> xrun exit\n' +
					'> node ./exit ' + code + '\n' +
					code + '\n',
				stderr: '',
				code: code === 0 ? 0 : 1
			}
		);
	});
});
