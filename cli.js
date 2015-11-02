'use strict';

const pp = require('./pp.js');

const debug = parseInt(process.env.PPJS_DEBUG, 10);

if (process.argv.length < 3 || process.argv.length > 4) {
	if (debug) console.error('Invalid arguments');
	process.exit(1);
}

let username = process.argv[2];
let mode;

switch ((process.argv[3] || 'osu!').toLowerCase()) {
	case 'osu':
	case 'osu!':
	case 'o':
	case '0':
		mode = 0;
		break;
	case 'taiko':
	case 't':
	case '1':
		mode = 1;
		break;
	case 'ctb':
	case 'catchthebeat':
	case 'catch the beat':
	case 'c':
	case '2':
		mode = 2;
		break;
	case 'mania':
	case 'osumania':
	case 'osu!mania':
	case 'm':
	case '3':
		mode = 3;
		break;
	default:
		if (debug) console.error('Invalid arguments');
		process.exit(1);
}

pp.pp(username, mode).then((t) => {
	console.log(t);
});
