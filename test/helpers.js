'use strict';

var path = require('path'),
	spawnSync = require('child_process').spawnSync;

exports.spawn = function(args, dir) {
	dir = dir || 'ok';
	var result = spawnSync(path.resolve('./bin/xrun'), args, {
		stdio: 'pipe',
		cwd: path.resolve('./test/fixtures/' + dir)
	});

	return {
		stdout: result.stdout.toString('utf8'),
		stderr: result.stderr.toString('utf8'),
		code: result.status
	};
};
