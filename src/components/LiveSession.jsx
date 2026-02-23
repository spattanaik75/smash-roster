import { useState } from 'react'
import { buildRounds, fairnessStats } from '../lib/rotation'

export default function LiveSession({ config, onEnd }) {
  const [rounds] = useState(() => buildRounds(config))
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0)

  const currentRound = rounds[currentRoundIndex]
  const isLastRound = currentRoundIndex >= rounds.length - 1
  const totalRounds = rounds.length

  const goNext = () => {
    if (isLastRound) {
      onEnd({ config, rounds })
      return
    }
    setCurrentRoundIndex((i) => i + 1)
  }

  if (!currentRound) {
    return (
      <div className="text-slate-600">
        No rounds. <button type="button" onClick={() => onEnd({ config, rounds: [] })} className="underline">Back to setup</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-slate-600 font-medium">
        Round {currentRound.roundIndex} of {totalRounds}
      </p>

      <div className="space-y-4">
        {currentRound.courts.map(({ court, match }) => (
          <div
            key={court}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500 mb-2">Court {court}</p>
            <p className="text-lg">
              {match.teamA.join(' / ')} <span className="text-slate-400">vs</span> {match.teamB.join(' / ')}
            </p>
          </div>
        ))}
      </div>

      {currentRound.rest.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-medium text-amber-800 mb-1">Resting</p>
          <p className="text-lg text-amber-900">{currentRound.rest.join(', ')}</p>
        </div>
      )}

      <button
        type="button"
        onClick={goNext}
        className="w-full py-4 px-4 rounded-xl bg-slate-800 text-white text-lg font-semibold touch-manipulation"
      >
        {isLastRound ? 'Finish session' : 'Next round'}
      </button>
    </div>
  )
}

export function SummaryScreen({ config, rounds, onNewSession }) {
  const stats = fairnessStats(rounds, config.playerNames)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Session summary</h2>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-sm font-medium text-slate-700">Player</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-700">Games</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-700">Rests</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.name} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                <td className="px-4 py-3 text-slate-600">{s.games}</td>
                <td className="px-4 py-3 text-slate-600">{s.restRounds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={onNewSession}
        className="w-full py-4 px-4 rounded-xl bg-slate-800 text-white text-lg font-semibold touch-manipulation"
      >
        New session
      </button>
    </div>
  )
}
