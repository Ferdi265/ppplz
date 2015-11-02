'use strict';

const osu = require('./osu.js');

const fmtpp = (user, recent, beatmap, score, bestrank, userdata) => {
		return (
		(score === undefined ? '' : 'New PB! ') +
		(bestrank === undefined ? '' : '#' + bestrank + ' of your top plays! ') +
		'Achieved ' + recent.rating + ' on [https://osu.ppy.sh/b/' + beatmap.id + ' ' + beatmap.artist + ' - ' + beatmap.title + ' [' + beatmap.difficultyName + ']]. ' +
		(score === undefined ? '' : 'Raw PP: ' + score.pp.toFixed(2) + '.') +
		(bestrank === undefined ? '' : ' Weighted PP: ' + (score.pp * Math.pow(0.95, bestrank - 1)).toFixed(2) + '.') +
		fmtuser(user, recent, beatmap, score, bestrank, userdata) 
	);
};
const fmttries = (user, recent, beatmap, score, bestrank, userdata) => {
	if (osu.scoreEqual(recent, userdata.recent)) {
		return '';
	}
	return fmtpp(user, recent, beatmap, score, bestrank, userdata);
};
const fmtnotries = (user, recent, beatmap, score, bestrank, userdata) => {
	if (recent.rating === 'F') {
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
	return (relPP === 0 && relRank === 0 ? '' : ' ' +
		(relPP > 0 ? 'Gained ' + relPP.toFixed(2) + ' pp!' : 'Lost ' + (-1 * relPP).toFixed(2) + ' pp.') + ' ' +
		(relRank < 0 ? 'Rose ' + (-1 * relRank) + ' ranks!' : 'Fell ' + relRank + ' ranks.')
	);
};

module.exports = {
	pp: fmtpp,
	tries: fmttries,
	notries: fmtnotries,
	pbs: fmtpbs,
	user: fmtuser
};
