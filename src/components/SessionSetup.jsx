import { useState, useCallback } from 'react'
import { parsePlayerNames } from '../lib/rotation'

const STORAGE_KEY = 'paddle-roster-last-session'

function loadLastSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveLastSession(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // ignore
  }
}

export default function SessionSetup({ onStart }) {
  const [courts, setCourts] = useState(1)
  const [sessionDuration, setSessionDuration] = useState(120)
  const [matchDuration, setMatchDuration] = useState(15)
  const [gameMode, setGameMode] = useState('doubles')
  const [playerInput, setPlayerInput] = useState('')
  const [pasteHint, setPasteHint] = useState(false)

  const loadLast = useCallback(() => {
    const last = loadLastSession()
    if (!last) return
    setCourts(last.courts ?? 1)
    setSessionDuration(last.sessionDurationMinutes ?? 120)
    setMatchDuration(last.matchDurationMinutes ?? 15)
    setGameMode(last.gameMode ?? 'doubles')
    setPlayerInput((last.playerNames ?? []).join('\n'))
  }, [])

  const players = parsePlayerNames(playerInput)
  const perCourt = gameMode === 'singles' ? 2 : 4
  const neededPerRound = courts * perCourt
  const canStart = players.length >= perCourt && players.length >= 1

  const handleStart = () => {
    if (!canStart) return
    const config = {
      courts,
      sessionDurationMinutes: sessionDuration,
      matchDurationMinutes: matchDuration,
      gameMode,
      playerNames: players,
    }
    saveLastSession(config)
    onStart(config)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Game mode</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGameMode('singles')}
            className={`flex-1 py-3 px-4 rounded-xl text-base font-medium touch-manipulation ${
              gameMode === 'singles'
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            Singles
          </button>
          <button
            type="button"
            onClick={() => setGameMode('doubles')}
            className={`flex-1 py-3 px-4 rounded-xl text-base font-medium touch-manipulation ${
              gameMode === 'doubles'
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            Doubles
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Courts</label>
        <div className="flex gap-2">
          {[1, 2].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCourts(n)}
              className={`flex-1 py-3 px-4 rounded-xl text-base font-medium touch-manipulation ${
                courts === n ? 'bg-slate-800 text-white' : 'bg-white border border-slate-300 text-slate-700'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Session (min)</label>
          <input
            type="number"
            min={10}
            max={240}
            step={15}
            value={sessionDuration}
            onChange={(e) => setSessionDuration(Number(e.target.value) || 60)}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Match (min)</label>
          <input
            type="number"
            min={5}
            max={60}
            step={5}
            value={matchDuration}
            onChange={(e) => setMatchDuration(Number(e.target.value) || 10)}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 text-lg"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-slate-700">Players (one per line or comma)</label>
          <button
            type="button"
            onClick={loadLast}
            className="text-sm text-slate-600 underline"
          >
            Load last session
          </button>
        </div>
        <textarea
          value={playerInput}
          onChange={(e) => setPlayerInput(e.target.value)}
          onPaste={() => setPasteHint(true)}
          placeholder="Paste names from WhatsApp (new line or comma)"
          rows={5}
          className="w-full py-3 px-4 rounded-xl border border-slate-300 text-base resize-y"
        />
        {pasteHint && (
          <p className="mt-1 text-sm text-slate-500">
            Tip: paste a list and we'll split by newlines or commas.
          </p>
        )}
        <p className="mt-1 text-sm text-slate-500">
          {players.length} player{players.length !== 1 ? 's' : ''}. Need at least {neededPerRound} per round.
        </p>
      </div>

      <button
        type="button"
        onClick={handleStart}
        disabled={!canStart}
        className="w-full py-4 px-4 rounded-xl bg-slate-800 text-white text-lg font-semibold touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start session
      </button>
    </div>
  )
}
