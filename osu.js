'use strict';

const rp = require('request-promise');

const apikey = process.env.PPJS_APIKEY;

const apicall = (endpoint, opts) => {
	opts.k = apikey;
	return rp({
		uri: 'https://osu.ppy.sh/api/' + endpoint,
		qs: opts,
		json: true
	}).then((j) => {
		if ('error' in j) {
			throw Error(j.error);
		}
		return j;
	});
};
const osuBeatmaps = (opts) => apicall('get_beatmaps', opts).then((j) => {
	if (j.length === 0) {
		throw Error('Beatmap does not exist');
	}
	return j.map((j) => {
		return {
			mode: parseInt(j.mode, 10),
			id: parseInt(j.beatmap_id, 10),
			setId: parseInt(j.beatmapset_id, 10),
			creator: j.creator,
			bpm: parseInt(j.bpm, 10),
			difficultyStars: parseFloat(j.difficultyrating),
			difficultyCS: parseFloat(j.diff_size),
			difficultyOD: parseFloat(j.diff_overall),
			difficultyAR: parseFloat(j.diff_approach),
			difficultyHP: parseFloat(j.diff_drain),
			difficultyName: j.version,
			lengthHit: parseInt(j.hit_length, 10),
			lengthTotal: parseInt(j.total_length, 10),
			combo: parseInt(j.max_combo, 10),
			countPlays: parseInt(j.playcount, 10),
			countPasses: parseInt(j.passcount, 10),
			countFavourites: parseInt(j.favourite_count, 10),
			title: j.title,
			artist: j.artist,
			source: j.source,
			genreId: parseInt(j.genre_id, 10),
			languageId: parseInt(j.language_id, 10),
			approved: Boolean(parseInt(j.approved, 10)),
			dateApproved: j.approved_date === null ? undefined : Date.parse(j.approved_date.replace('-', '/', 'g')),
			dateUpdated: Date.parse(j.last_update.replace('-', '/', 'g')),
			md5: j.file_md5
		};
	});
});
const osuUser = (opts) => apicall('get_user', opts).then((j) => {
	if (j.length === 0) {
		throw Error('User does not exist');
	}
	j = j[0];
	return {
		mode: opts.m || 0,
		id: parseInt(j.user_id, 10),
		name: j.username,
		count300: parseInt(j.count300, 10),
		count100: parseInt(j.count100, 10),
		count50: parseInt(j.count50, 10),
		countSS: parseInt(j.count_rank_ss, 10),
		countS: parseInt(j.count_rank_s, 10),
		countA: parseInt(j.count_rank_a, 10),
		countPlays: parseInt(j.playcount, 10),
		scoreRanked: parseInt(j.ranked_score, 10),
		scoreTotal: parseInt(j.total_score, 10),
		accuracy: parseFloat(j.accuracy),
		country: j.country,
		rankCountry: parseInt(j.pp_country_rank, 10),
		rank: parseInt(j.pp_rank, 10),
		level: parseFloat(j.level),
		pp: parseFloat(j.pp_raw),
		events: j.events
	};
});
const osuScores = (opts) => apicall('get_scores', opts).then((j) => {
	return j.map((j, i) => {
		const score = {
			mode: opts.m || 0,
			userId: parseInt(j.user_id, 10),
			userName: j.username,
			beatmapId: opts.b,
			score: parseInt(j.score, 10),
			count300: parseInt(j.count300, 10),
			count100: parseInt(j.count100, 10),
			count50: parseInt(j.count50, 10),
			countMiss: parseInt(j.countmiss, 10),
			countKatu: parseInt(j.countkatu, 10),
			countGeki: parseInt(j.countgeki, 10),
			combo: parseInt(j.maxcombo, 10),
			perfect: Boolean(parseInt(j.perfect, 10)),
			mods: parseInt(j.enabled_mods, 10),
			rating: j.rank.replace('H', '').replace('X', 'SS'),
			pp: parseFloat(j.pp),
			date: Date.parse(j.date.replace('-', '/', 'g'))
		};
		if (! ('u' in opts)) {
			score.rank = i + 1;
		}
		return score;
	});
});
const osuBest = (opts) => apicall('get_user_best', opts).then((j) => {
	return j.map((j, i) => {
		return {
			mode: opts.m || 0,
			userId: parseInt(j.user_id, 10),
			beatmapId: parseInt(j.beatmap_id, 10),
			score: parseInt(j.score, 10),
			count300: parseInt(j.count300, 10),
			count100: parseInt(j.count100, 10),
			count50: parseInt(j.count50, 10),
			countMiss: parseInt(j.countmiss, 10),
			countKatu: parseInt(j.countkatu, 10),
			countGeki: parseInt(j.countgeki, 10),
			combo: parseInt(j.maxcombo, 10),
			perfect: Boolean(parseInt(j.perfect, 10)),
			mods: parseInt(j.enabled_mods, 10),
			rating: j.rank.replace('H', '').replace('X', 'SS'),
			pp: parseFloat(j.pp),
			date: Date.parse(j.date.replace('-', '/', 'g')),
			rank: i + 1
		};
	});
});
const osuRecent = (opts) => apicall('get_user_recent', opts).then((j) => {
	return j.map((j) => {
		return {
			mode: opts.m || 0,
			userId: parseInt(j.user_id, 10),
			beatmapId: parseInt(j.beatmap_id, 10),
			score: parseInt(j.score, 10),
			count300: parseInt(j.count300, 10),
			count100: parseInt(j.count100, 10),
			count50: parseInt(j.count50, 10),
			countMiss: parseInt(j.countmiss, 10),
			countKatu: parseInt(j.countkatu, 10),
			countGeki: parseInt(j.countgeki, 10),
			combo: parseInt(j.maxcombo, 10),
			perfect: Boolean(parseInt(j.perfect, 10)),
			mods: parseInt(j.enabled_mods, 10),
			rating: j.rank.replace('H', '').replace('X', 'SS'),
			date: Date.parse(j.date.replace('-', '/', 'g')),
		};
	});
});
const osuMatch = (opts) => apicall('get_match', opts).then((j) => {
	if (j.length === 0) {
		throw Error('Match does not exist');
	}
	j = j[0];
	return {
		match: {
			id: parseInt(j.match.match_id, 10),
			name: j.match.name,
			start: Date.parse(j.match.start_time.replace('-', '/', 'g')),
			end: j.match.end_time === null ? undefined : Date.parse(j.match.end_time.replace('-', '/', 'g'))
		},
		games: j.games.map((j) => {
			return {
				id: parseInt(j.game_id, 10),
				start: Date.parse(j.start_time.replace('-', '/', 'g')),
				end: Date.parse(j.end_time.replace('-', '/', 'g')),
				beatmapId: parseInt(j.beatmap_id, 10),
				mode: parseInt(j.play_mode, 10),
				typeMatch: parseInt(j.match_type, 10),
				typeScoring: parseInt(j.scoring_type, 10),
				typeTeam: parseInt(j.team_type, 10),
				mods: parseInt(j.mods, 10),
				scores: j.scores.map((j) => {
					return {
						slot: parseInt(j.slot, 10),
						team: parseInt(j.team, 10),
						userId: parseInt(j.user_id, 10),
						score: parseInt(j.score, 10),
						count300: parseInt(j.count300, 10),
						count100: parseInt(j.count100, 10),
						count50: parseInt(j.count50, 10),
						countMiss: parseInt(j.countmiss, 10),
						countKatu: parseInt(j.countkatu, 10),
						countGeki: parseInt(j.countgeki, 10),
						combo: parseInt(j.maxcombo, 10),
						perfect: Boolean(parseInt(j.perfect, 10)),
						pass: Boolean(parseInt(j.pass, 10)),
						rank: parseInt(j.rank, 10)
					};
				})
			};
		})
	};
});
const osuReplay = (opts) => apicall('get_replay', opts);
const osuScoreEqual = (score1, score2) => {
	return (score1 === undefined && score2 === undefined) || (
		score1 !== undefined && score2 !== undefined &&
		score1.beatmapId === score2.beatmapId &&
		score1.score === score2.score &&
		score1.count300 === score2.count300 &&
		score1.count100 === score2.count100 &&
		score1.count50 === score2.count50 &&
		score1.countMiss === score2.countMiss &&
		score1.countKatu === score2.countKatu &&
		score1.countGeki === score2.countGeki &&
		score1.combo === score2.combo
	);

};

module.exports = {
	beatmaps: osuBeatmaps,
	user: osuUser,
	scores: osuScores,
	best: osuBest,
	recent: osuRecent,
	match: osuMatch,
	replay: osuReplay,
	scoreEqual: osuScoreEqual,
};
