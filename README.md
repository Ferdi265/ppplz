# ppplz

An IRC bot for the osu!bancho server. Useful for knowing how much pp you gained off your plays.

*This project is WIP*

## Features

- How much pp was my last play worth? (only if it actually gave pp)
- How much pp did it actually count for? (only if in your top 50 plays)
- In what place of my top 50 plays is this play?
- How much pp did I gain/lose through this play?
- How many ranks did I rise/fall through this play?

## Commands

### !ppplz

Aliases: `!pp`, `!p`

Usage: `[mode]!pp`

Gives you information on your last play.

#### Examples

- `!pp`: Information on your last osu play
- `osu!ppplz`: Information on your last osu play
- `taiko!pp`: Information on your last taiko play

### !watch

Aliases: `!w`

Usage `[mode]!w [parameter]`

Waits for plays and automatically triggers `!pp`.
If you don't play or retry a map for 15 minutes or longer, it stops watching for plays

#### Parameters

- `tries`: Also send messages on fails and retries
- `notries`: Don't send messages on fails and retries (default)
- `pbs`: Only send messages on personal bests. These are the only plays that can give pp

#### Examples

- `!w`: Watches for osu plays, excluding fails and retries
- `ctb!w pbs`: Watches for Catch the Beat plays, only listens for personal bests
- `mania!watch tries`: Watches for osu!mania plays, including fails and retries

### !unwatch

Aliases: `!uw`, `!u`

Usage `!uw`

Stops watching for plays.

#### Examples

- `!uw`: Stops watching for plays

## Gamemodes

osu!ppplz works for all current osu! gamemodes.

### osu!

Aliases: o, 0

This is the default gamemode

### taiko

Aliases: t, 1

### CatchTheBeat

Aliases: ctb, c, 2

### osuMania

Aliases: mania, m, 3

## Installation

If you want to host the bot yourself, follow these instructions.

- Install node.js (recommended version is 5.0 or later)
- Clone this repository
- Run `npm install`
- Create `ppplz_env`

### ppplz_env

This file contains all the configuration options and keys needed for the bot to work.

This file should be a bash script exporting the following variables:

- `PPJS_APIKEY`: A valid osu api key
- `PPJS_IRCPASS`: A valid osu irc password
- `PPJS_USERNAME`: The username to login as
- `PPJS_DEBUG`: Whether to log debug messages or not.
  1 for yes, 0 or unset for no
  Will likely be expanded to include multiple levels of debug information

### Running

To run the bot, run `./ppplz`.
