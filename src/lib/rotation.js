/**
 * Rotation engine: builds rounds for singles (2 per court) or doubles (4 per court).
 * Greedy: prefer players with fewer games and more rest when assigning.
 */

/**
 * @typedef {'singles' | 'doubles'} GameMode
 */

/**
 * @typedef {Object} SessionConfig
 * @property {number} courts
 * @property {number} sessionDurationMinutes
 * @property {number} matchDurationMinutes
 * @property {GameMode} gameMode
 * @property {string[]} playerNames
 */

/**
 * @typedef {Object} Match
 * @property {string[]} teamA - 1 (singles) or 2 (doubles) names
 * @property {string[]} teamB - 1 (singles) or 2 (doubles) names
 */

/**
 * @typedef {Object} Round
 * @property {number} roundIndex
 * @property {{ court: number; match: Match }[]} courts
 * @property {string[]} rest
 */

/**
 * Parse player names from pasted text (newlines or commas).
 * @param {string} text
 * @returns {string[]}
 */
export function parsePlayerNames(text) {
  if (!text || !text.trim()) return []
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Players per court: 2 for singles, 4 for doubles.
 * @param {GameMode} mode
 * @returns {number}
 */
export function playersPerCourt(mode) {
  return mode === 'singles' ? 2 : 4
}

/**
 * Total rounds from session and match duration.
 * @param {number} sessionMinutes
 * @param {number} matchMinutes
 * @returns {number}
 */
export function totalRounds(sessionMinutes, matchMinutes) {
  if (matchMinutes <= 0) return 0
  return Math.floor(sessionMinutes / matchMinutes)
}

/**
 * Build all rounds for the session (greedy fairness).
 * @param {SessionConfig} config
 * @returns {Round[]}
 */
export function buildRounds(config) {
  const { courts, sessionDurationMinutes, matchDurationMinutes, gameMode, playerNames } = config
  const names = [...playerNames]
  if (names.length === 0) return []

  const rounds = totalRounds(sessionDurationMinutes, matchDurationMinutes)
  if (rounds === 0) return []

  const perCourt = playersPerCourt(gameMode)
  const playersPerRound = courts * perCourt

  /** @type {{ name: string; games: number; restRounds: number }[]} */
  const state = names.map((name) => ({ name, games: 0, restRounds: 0 }))

  /** @type {Round[]} */
  const result = []

  for (let r = 0; r < rounds; r++) {
    // Sort: fewer games first, then more rest (prioritise giving rest to those who played more)
    const sorted = [...state].sort((a, b) => {
      if (a.games !== b.games) return a.games - b.games
      return b.restRounds - a.restRounds
    })

    const playing = sorted.slice(0, playersPerRound)
    const rest = sorted.slice(playersPerRound).map((s) => s.name)

    playing.forEach((s) => s.games++)
    rest.forEach((name) => {
      const s = state.find((x) => x.name === name)
      if (s) s.restRounds++
    })

    const roundMatches = []
    for (let c = 0; c < courts; c++) {
      const start = c * perCourt
      const courtPlayers = playing.slice(start, start + perCourt).map((s) => s.name)
      const half = perCourt / 2
      roundMatches.push({
        court: c + 1,
        match: {
          teamA: courtPlayers.slice(0, half),
          teamB: courtPlayers.slice(half),
        },
      })
    }

    result.push({
      roundIndex: r + 1,
      courts: roundMatches,
      rest,
    })
  }

  return result
}

/**
 * Fairness stats per player after rounds.
 * @param {Round[]} rounds
 * @param {string[]} playerNames
 * @returns {{ name: string; games: number; restRounds: number }[]}
 */
export function fairnessStats(rounds, playerNames) {
  const map = new Map(playerNames.map((name) => [name, { name, games: 0, restRounds: 0 }]))
  for (const round of rounds) {
    for (const { match } of round.courts) {
      for (const name of [...match.teamA, ...match.teamB]) {
        const s = map.get(name)
        if (s) s.games++
      }
    }
    for (const name of round.rest) {
      const s = map.get(name)
      if (s) s.restRounds++
    }
  }
  return Array.from(map.values())
}
