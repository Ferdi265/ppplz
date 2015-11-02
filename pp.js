'use strict';

const osu = require('./osu.js')
const fmt = require('./fmt.js');

let data = {};
let watching = {};

const pp = (username, mode, fm) => {
	mode = mode || 0;
	fm = fm || fmt.pp;

	let user;
	let recent;
	let beatmap;
	let score;
	let bestrank;
	let userdata;

	return new Promise((f) => osu.user({
		u: username,
		type: 'string',
		m: mode
	}).then((u) => {
		user = u;
		data[u.id] = data[u.id] || {};
		data[u.id][mode] = data[u.id][mode] || {};
		userdata = data[u.id][mode];
		return osu.recent({
			u: username,
			type: 'string',
			m: mode,
			limit: 1
		});
	}).then((r) => {
		if (r.length === 0) {
			throw Error('No recent plays');
		}
		recent = r[0];
		if (osu.scoreEqual(data[user.id].recent, r[0])) {
			return undefined;
		}
		return osu.beatmaps({
			b: recent.beatmapId,
			m: mode,
			a: 1,
			limit: 1
		});
	}).then((b) => {
		if (b === undefined) {
			return [];
		}
		if (b.length === 0) {
			throw Error('Beatmap does not exist');
		}
		beatmap = b[0];
		return osu.scores({
			b: beatmap.id,
			u: username,
			type: 'string',
			m: mode,
			limit: 1
		});
	}).then((s) => {
		if (s.length === 0) {
			return [];
		}
		score = s[0];
		if (!osu.scoreEqual(recent, score)) {
			score = undefined;
		}
		return osu.best({
			u: username,
			type: 'string',
			m: mode,
			limit: 50
		});
	}).then((b) => b.some((j) => {
		if (osu.scoreEqual(recent, j)) {
			bestrank = j.rank;
			return true;
		}
	})).then(() => {
		if (osu.scoreEqual(recent, userdata.recent)) {
			beatmap = userdata.beatmap;
			score = userdata.score;
			bestrank = userdata.bestrank;
		}
		f(fm(user, recent, beatmap, score, bestrank, userdata));
		userdata.pp = user.pp;
		userdata.rank = user.rank;
		userdata.recent = recent;
		userdata.beatmap = beatmap;
		userdata.score = score;
		userdata.bestrank = bestrank;
	}).catch((e) => {
		f('An error occurred: ' +  e);
		console.error(e.stack);
	}));
};
const iterate = (username, mode, cb) => {
	if (!watching[username]) {
		return cb('Stopped watching');
	}
	pp(username, mode, watching[username].fm).then((t) => {
		if (t !== '') {
			cb(t);
		}
		clearTimeout(watching[username].timeout);
		watching[username].timeout = setTimeout(unwatch.bind(undefined, username, cb), 1e3 * 60 * 15);
		setTimeout(iterate.bind(undefined, username, mode, cb), 5000);
	});
};
const unwatch = (username, cb) => {
	if (!watching[username]) {
		return cb('Not watching');
	}
	clearTimeout(watching[username].timeout);
	delete watching[username];
};
const watch = (username, mode, fm, cb) => {
	mode = mode || 0;
	fm = fm || fmt.watch;

	if (watching[username]) {
		return cb('Already watching');
	}
	watching[username] = {
		fm: fm
	};
	pp(username, mode, fmt.user).then((t) => {
		cb('Started watching');
		if (t !== '') {
			cb(t);
		}
		iterate(username, mode, cb);
	});
};

module.exports = {
	pp: pp,
	unwatch: unwatch,
	watch: watch
};
