import { useState, useCallback, useEffect } from 'react'
import { parsePlayerNames } from '../lib/rotation'
import { generateShareableURL } from '../lib/urlState'

const STORAGE_KEY = 'smash-roster-last-session'

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

export default function SessionSetup({ onStart, urlSession }) {
  const [sessionDuration, setSessionDuration] = useState(120)
  const [matchDuration, setMatchDuration] = useState(15)
  const [gameMode, setGameMode] = useState('doubles')
  const [playerInput, setPlayerInput] = useState('')
  const [showShareCopied, setShowShareCopied] = useState(false)

  useEffect(() => {
    if (urlSession) {
      setSessionDuration(urlSession.sessionDurationMinutes ?? 120)
      setMatchDuration(urlSession.matchDurationMinutes ?? 15)
      setGameMode(urlSession.gameMode ?? 'doubles')
      setPlayerInput((urlSession.playerNames ?? []).join('\n'))
    }
  }, [urlSession])

  const loadLast = useCallback(() => {
    const last = loadLastSession()
    if (!last) return
    setSessionDuration(last.sessionDurationMinutes ?? 120)
    setMatchDuration(last.matchDurationMinutes ?? 15)
    setGameMode(last.gameMode ?? 'doubles')
    setPlayerInput((last.playerNames ?? []).join('\n'))
  }, [])

  const players = parsePlayerNames(playerInput)
  const perCourt = gameMode === 'singles' ? 2 : 4
  const canStart = players.length >= perCourt && players.length >= 1

  const handleStart = () => {
    if (!canStart) return
    const config = {
      courts: 1,
      sessionDurationMinutes: sessionDuration,
      matchDurationMinutes: matchDuration,
      gameMode,
      playerNames: players,
    }
    saveLastSession(config)
    onStart(config)
  }

  const handleShare = async () => {
    if (!canStart) return
    const config = {
      courts: 1,
      sessionDurationMinutes: sessionDuration,
      matchDurationMinutes: matchDuration,
      gameMode,
      playerNames: players,
    }
    const url = generateShareableURL(config)
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SmashRoster Session',
          text: `Join our ${gameMode} session with ${players.length} players!`,
          url,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setShowShareCopied(true)
        setTimeout(() => setShowShareCopied(false), 2000)
      } catch {
        // Clipboard failed
      }
    }
  }

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-6">Session setup</h2>
        
        <div className="space-y-5">
          {/* Game mode */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Game mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGameMode('singles')}
                className={`relative py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 touch-manipulation ${
                  gameMode === 'singles'
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50 scale-[1.02]'
                    : 'bg-white/10 border border-white/20 text-slate-300 hover:bg-white/15'
                }`}
              >
                Singles
                {gameMode === 'singles' && (
                  <span className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setGameMode('doubles')}
                className={`relative py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 touch-manipulation ${
                  gameMode === 'doubles'
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50 scale-[1.02]'
                    : 'bg-white/10 border border-white/20 text-slate-300 hover:bg-white/15'
                }`}
              >
                Doubles
                {gameMode === 'doubles' && (
                  <span className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Duration inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Session (min)
              </label>
              <input
                type="number"
                min={10}
                max={240}
                step={15}
                value={sessionDuration}
                onChange={(e) => setSessionDuration(Number(e.target.value) || 60)}
                className="w-full py-2.5 px-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Match (min)
              </label>
              <input
                type="number"
                min={5}
                max={60}
                step={5}
                value={matchDuration}
                onChange={(e) => setMatchDuration(Number(e.target.value) || 10)}
                className="w-full py-2.5 px-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>

          {/* Players */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Players
              </label>
              <button
                type="button"
                onClick={loadLast}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Load last
              </button>
            </div>
            <textarea
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              placeholder="One per line or comma"
              rows={6}
              className="w-full py-3 px-4 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            />
            <p className="mt-2 text-xs text-slate-400">
              {players.length} player{players.length !== 1 ? 's' : ''} · need {perCourt}+ per match
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
          className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-base font-semibold shadow-xl shadow-emerald-500/30 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Start session
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={!canStart}
          className="py-4 px-5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white font-semibold shadow-lg touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/15 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          title="Share session"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
      {showShareCopied && (
        <p className="text-xs text-emerald-400 text-center animate-fade-in">Link copied to clipboard!</p>
      )}
    </div>
  )
}
