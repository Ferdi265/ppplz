'use strict';

const osu = require('./osu.js');

const fmtmods = (score) => {
	const mods = {
		Hidden: 8,
		HardRock: 16,
		SuddenDeath: 32,
		Perfect: 16384,
		DoubleTime: 64,
		NightCore: 512,
		FlashLight: 1024,
		FadeIn: 1048576,
		Easy: 2,
		NoFail: 1,
		HalfTime: 256,
		SpunOut: 4096,
		Key4: 32768,
		Key5: 65536,
		Key6: 131072,
		Key7: 262144,
		Key8: 524288,
	};
	const selected = score.mods;

	let modStr = '';

	if (
		selected & mods.Hidden ||
		selected & mods.HardRock ||
		selected & mods.DoubleTime ||
		selected & mods.NightCore ||
		selected & mods.SuddenDeath ||
		selected & mods.Perfect ||
		selected & mods.FlashLight ||
		selected & mods.FadeIn
	) {
		modStr += '+';
		if (selected & mods.Hidden) modStr += 'HD';
		if (selected & mods.HardRock) modStr += 'HR';
		if (selected & mods.NightCore) {
			modStr += 'NC';
		} else if (selected & mods.DoubleTime) {
			modStr += 'DT';
		}
		if (selected & mods.Perfect) {
			modStr += 'PF';
		} else if (selected & mods.SuddenDeath) {
			modStr += 'SD';
		}
		if (selected & mods.FlashLight) modStr += 'FL';
		if (selected & mods.FadeIn) modStr += 'FI';
	}
	if (
		selected & mods.Easy ||
		selected & mods.NoFail ||
		selected & mods.HalfTime ||
		selected & mods.SpunOut ||
		selected & mods.Key4 ||
		selected & mods.Key5 ||
		selected & mods.Key6 ||
		selected & mods.Key7 ||
		selected & mods.Key8
	) {
		modStr += '-';
		if (selected & mods.Easy) modStr += 'EZ';
		if (selected & mods.NoFail) modStr += 'NF';
		if (selected & mods.HalfTime) modStr += 'HT';
		if (selected & mods.SpunOut) modStr += 'SO';
		if (selected & mods.Key4) modStr += 'K4';
		if (selected & mods.Key5) modStr += 'K5';
		if (selected & mods.Key6) modStr += 'K6';
		if (selected & mods.Key7) modStr += 'K7';
		if (selected & mods.Key8) modStr += 'K8';
	}
	return modStr;
};
const fmtpp = (user, recent, beatmap, score, bestrank, userdata) => {
	return (
		(score === undefined ? '' : 'New PB! ') +
		(bestrank === undefined ? '' : '#' + bestrank + ' of your top plays! ') +
		(recent === undefined ? 'No recent plays.' : 'Achieved ' + recent.rating + ' on [https://osu.ppy.sh/b/' + beatmap.id + ' ' + beatmap.artist + ' - ' + beatmap.title + ' [' + beatmap.difficultyName + ']' + fmtmods(recent) + ']. ') +
		(score === undefined ? '' : 'Raw PP: ' + score.pp.toFixed(2) + '. ') +
		(bestrank === undefined ? '' : 'Weighted PP: ' + (score.pp * Math.pow(0.95, bestrank - 1)).toFixed(2) + '. ') +
		fmtuser(user, recent, beatmap, score, bestrank, userdata) 
	);
};
const fmttries = (user, recent, beatmap, score, bestrank, userdata) => {
	if (recent === undefined || osu.scoreEqual(recent, userdata.recent)) {
		return '';
	}
	return fmtpp(user, recent, beatmap, score, bestrank, userdata);
};
const fmtnotries = (user, recent, beatmap, score, bestrank, userdata) => {
	if (recent === undefined || recent.rating === 'F') {
		return '';
	}
	return fmttries(user, recent, beatmap, score, bestrank, userdata);
};
const fmtpbs = (user, recent, beatmap, score, bestrank, userdata) => {
	if (score === undefined) {
		return '';
	}
	return fmttries(user, recent, beatmap, score, bestrank, userdata);
};
const fmtuser = (user, recent, beatmap, score, bestrank, userdata) => {
	let relPP = user.pp - (userdata.pp || user.pp);
	let relRank = user.rank - (userdata.rank || user.rank);
	return (
		(relPP === 0 ? '' : relPP > 0 ? 'Gained ' + relPP.toFixed(2) + ' pp!' : 'Lost ' + (-1 * relPP).toFixed(2) + ' pp.') +
		(relPP !== 0 && relRank !== 0 ? ' ' : '') +
		(relRank === 0 ? '' : relRank < 0 ? 'Rose ' + (-1 * relRank) + ' ranks!' : 'Fell ' + relRank + ' ranks.')
	);
};

module.exports = {
	pp: fmtpp,
	tries: fmttries,
	notries: fmtnotries,
	pbs: fmtpbs,
	user: fmtuser
};
