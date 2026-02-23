import { useState, useEffect, useRef } from 'react'
import { buildRounds, buildNextRound, fairnessStats, leftoverMinutes } from '../lib/rotation'
import { assignAvatars } from '../lib/avatars'
import CourtView from './CourtView'

const MIN_LEFTOVER_TO_ADD_ROUND = 15

export default function LiveSession({ config, onEnd }) {
  const [rounds, setRounds] = useState(() => buildRounds(config))
  const [slideIndex, setSlideIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState(0)
  const [avatars] = useState(() => assignAvatars(config.playerNames))
  const touchStartX = useRef(0)

  const currentRound = rounds[slideIndex]
  const isLastRound = slideIndex >= rounds.length - 1
  const totalRounds = rounds.length

  const leftoverAfterFinish = leftoverMinutes(config, rounds.length)
  const canAddRound = isLastRound && leftoverAfterFinish >= MIN_LEFTOVER_TO_ADD_ROUND

  const statsSoFar = fairnessStats(rounds.slice(0, slideIndex + 1), config.playerNames)
  const approxMinsLeft = Math.max(0, leftoverMinutes(config, slideIndex + 1))

  const goToSlide = (idx) => {
    const newIdx = Math.max(0, Math.min(idx, rounds.length - 1))
    setSlideDirection(newIdx > slideIndex ? 1 : -1)
    setSlideIndex(newIdx)
  }

  const goNext = () => {
    if (isLastRound) {
      onEnd({ config, rounds })
      return
    }
    setSlideDirection(1)
    setSlideIndex((i) => i + 1)
  }

  const goPrev = () => {
    if (slideIndex > 0) {
      setSlideDirection(-1)
      setSlideIndex((i) => i - 1)
    }
  }

  const addRound = () => {
    const next = buildNextRound(rounds, config)
    if (!next) return
    setRounds((r) => [...r, next])
    setSlideDirection(1)
    setSlideIndex(rounds.length)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left (go right)
        if (slideIndex < rounds.length - 1) {
          goToSlide(slideIndex + 1)
        } else if (slideIndex === rounds.length - 1) {
          // On last round, swipe to + tab
          setSlideIndex(rounds.length)
        }
      } else if (diff < 0 && slideIndex > 0) {
        // Swipe right (go left)
        goToSlide(slideIndex - 1)
      }
    }
  }

  if (!currentRound && rounds.length === 0) {
    return (
      <div className="text-slate-400 text-sm">
        No rounds. <button type="button" onClick={() => onEnd({ config, rounds: [] })} className="underline text-emerald-400">Back to setup</button>
      </div>
    )
  }

  const match = currentRound?.courts?.[0]?.match
  const rest = currentRound?.rest ?? []
  const isOnAddTab = slideIndex === rounds.length
  const showAddTab = leftoverAfterFinish >= MIN_LEFTOVER_TO_ADD_ROUND

  return (
    <div className="flex flex-col min-h-0">
      {/* Session info */}
      <div className="flex items-center justify-between gap-3 mb-3 px-1">
        <div className="flex items-center gap-2">
          {!isOnAddTab ? (
            <>
              <span className="text-sm font-medium text-white">
                Round {slideIndex + 1}
              </span>
              <span className="text-xs text-slate-500">of {totalRounds}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-emerald-400">Add more rounds</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>~{approxMinsLeft} min left</span>
        </div>
      </div>

      {/* Slide container with swipe */}
      <div
        className="flex-1 min-h-0 relative overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Prev button overlay */}
        {slideIndex > 0 && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-all shadow-lg"
            aria-label="Previous round"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next button overlay - show even on last round to go to + tab */}
        {(slideIndex < rounds.length - 1 || (slideIndex === rounds.length - 1 && showAddTab)) && (
          <button
            type="button"
            onClick={() => {
              if (slideIndex < rounds.length) {
                goToSlide(slideIndex + 1)
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-all shadow-lg"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Slide content */}
        {!isOnAddTab ? (
          <div
            key={slideIndex}
            className={`w-full h-full flex flex-col justify-center px-2 ${
              slideDirection > 0 ? 'animate-slide-in-right' : 'animate-slide-in-left'
            }`}
          >
            {match && (
              <CourtView
                teamA={match.teamA}
                teamB={match.teamB}
                rest={rest}
                gameMode={config.gameMode}
                avatars={avatars}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center px-2 animate-scale-in">
            <button
              type="button"
              onClick={addRound}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <p className="mt-4 text-sm text-slate-400">Tap to add another round</p>
            <p className="text-xs text-slate-500 mt-1">~{leftoverAfterFinish} min remaining</p>
          </div>
        )}
      </div>

      {/* Dots navigation + add tab */}
      <div className="flex justify-center items-center gap-2 py-3">
        {rounds.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 ${
              idx === slideIndex
                ? 'w-8 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50'
                : idx < slideIndex
                  ? 'w-2 h-2 rounded-full bg-slate-600'
                  : 'w-2 h-2 rounded-full bg-slate-700 hover:bg-slate-600'
            }`}
            aria-label={`Go to round ${idx + 1}`}
          />
        ))}
        {showAddTab && (
          <button
            type="button"
            onClick={() => setSlideIndex(rounds.length)}
            className={`transition-all duration-300 ${
              isOnAddTab
                ? 'w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/50 flex items-center justify-center'
                : 'w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center'
            }`}
            aria-label="Add round"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      {/* Fairness so far – compact */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-3 mb-3">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          Games · Rest
        </p>
        <div className="flex flex-wrap gap-2">
          {statsSoFar.map((s) => {
            const avatar = avatars.get(s.name)
            return (
              <span
                key={s.name}
                className="inline-flex items-center gap-1.5 text-xs bg-white/10 backdrop-blur border border-white/20 rounded-lg px-3 py-1.5 transition-all hover:bg-white/15"
              >
                {avatar && (
                  <img 
                    src={avatar.icon} 
                    alt="" 
                    className="w-4 h-4 rounded-full object-cover"
                  />
                )}
                <span className="font-medium text-white truncate max-w-[3.5rem]">{s.name}</span>
                <span className="text-slate-400">{s.games}·{s.restRounds}</span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={goNext}
          className="flex-1 py-3 px-5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-semibold touch-manipulation hover:bg-white/15 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          {isLastRound ? 'Finish session' : 'Next round'}
        </button>
        {canAddRound && (
          <button
            type="button"
            onClick={addRound}
            className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold touch-manipulation whitespace-nowrap shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            + Add round
          </button>
        )}
      </div>
      {canAddRound && (
        <p className="text-xs text-slate-500 pt-2 text-center animate-fade-in">
          ~{leftoverAfterFinish} min left in session
        </p>
      )}
    </div>
  )
}

export function SummaryScreen({ config, rounds, onNewSession, onContinue }) {
  const stats = fairnessStats(rounds, config.playerNames)
  const avatars = assignAvatars(config.playerNames)
  const leftover = leftoverMinutes(config, rounds.length)
  const canContinue = leftover >= MIN_LEFTOVER_TO_ADD_ROUND

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Session summary</h2>
        <div className="space-y-2">
          {stats.map((s, idx) => {
            const avatar = avatars.get(s.name)
            return (
              <div
                key={s.name}
                className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/5 border border-white/10 animate-fade-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-center gap-2.5">
                  {avatar && (
                    <img 
                      src={avatar.icon} 
                      alt="" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                    />
                  )}
                  <span className="font-medium text-white">{s.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>{s.games} games</span>
                  <span>{s.restRounds} rests</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onNewSession}
          className="flex-1 py-4 px-6 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white text-base font-semibold shadow-lg touch-manipulation hover:bg-white/15 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          New session
        </button>
        {canContinue && onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-base font-semibold shadow-xl shadow-emerald-500/30 touch-manipulation hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue session
          </button>
        )}
      </div>
      {canContinue && (
        <p className="text-xs text-slate-500 text-center">~{leftover} min remaining</p>
      )}
    </div>
  )
}
