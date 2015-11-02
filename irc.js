'use strict';

const irc = require('irc');
const pp = require('./pp.js');
const fmt = require('./fmt.js');

const c = new irc.Client('irc.ppy.sh', 'theFerdi265', {
	userName: 'theFerdi265',
	password: process.env.PPJS_IRCPASS,
	showErrors: true,
	floodProtection: true,
	floodProtectionDelay: 2000,
	autoConnect: false
});
const debug = parseInt(process.env.PPJS_DEBUG, 10);

c.on('pm', (f, t, m) => {
	const match = /^([^ !]*)!([^ !]+)(?: (.*))?/.exec(t);

	if (match === null) {
		return;
	}

	let mode = match[1];
	let cmd = match[2];
	let args = match[3] === undefined ? [] : match[3].split(' ');

	switch (mode) {
		case '':
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
			if (debug) console.error('[CMD -> ' + f + '] unrecognised osu mode');
			c.say(f, mode + ' is not an osu game mode');
			return;
	}
	switch (cmd) {
		case 'pp':
		case 'ppplz':
		case 'p':
			if (debug) console.error('[CMD -> ' + f + '] !ppplz');
			pp.pp(f, mode).then((t) => {
				if (debug) console.error('[MSG -> ' +f + '] ' + t);
				c.say(f, t);
			});
			break;
		case 'w':
		case 'watch':
			let fm;
			if (debug) console.error('[CMD -> ' + f + '] !watch');
			switch ((args[0] || 'watch').toLowerCase()) {
				case 'watch':
				case 'w':
				case 'notries':
				case 'n':
					fm = fmt.notries;
					break;
				case 'tries':
				case 't':
					fm = fmt.tries;
					break;
				case 'pbs':
				case 'pb':
				case 'p':
					fm = fmt.pbs;
					break;
				default:
					if (debug) console.error('[CMD -> ' + f + '] unrecognised !watch mode');
					c.say(f, args[0] + ' is not a !watch mode');
					return;
			}
			pp.watch(f, mode, fm, (t) => {
				if (debug) console.error('[MSG -> ' + f + '] ' + t);
				c.say(f, t);
			});
			break;
		case 'u':
		case 'uw':
		case 'unwatch':
			if (debug) console.error('[CMD -> ' + f + '] !unwatch');
			pp.unwatch(f, (t) => {
				if (debug) console.error('[MSG -> ' + f + '] ' + t);
				c.say(f, t);
			});
			break;
		default:
			if (debug) console.error('[CMD -> ' + f + '] unrecognised command');
			c.say(f, cmd + ' is not a recognised command.');
	}
});
c.on('error', (m) => {
	console.error(m);
});
c.on('motd', () => {
	if (debug) console.error('Connected')
});
c.connect();
