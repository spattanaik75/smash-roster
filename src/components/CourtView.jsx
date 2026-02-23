/**
 * Paddle court: modern visual with gradient, net, and player positioning.
 */
export default function CourtView({ teamA, teamB, rest = [], gameMode, avatars }) {
  const isDoubles = gameMode === 'doubles'
  
  const PlayerCard = ({ name, delay = 0 }) => {
    const avatar = avatars?.get(name)
    return (
      <div
        className="flex items-center gap-2 rounded-xl glass-card-strong px-3 py-2.5 shadow-xl animate-slide-up"
        style={{ animationDelay: `${delay}s` }}
      >
        {avatar && (
          <img 
            src={avatar.icon} 
            alt="" 
            className="w-6 h-6 rounded-full object-cover"
          />
        )}
        <span className="text-sm font-semibold text-slate-800 dark:text-white">{name}</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto animate-scale-in">
      {/* Court: vertical rectangle (portrait) with gradient and net */}
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-black/10 dark:border-white/20"
        style={{ aspectRatio: '5/6' }}
      >
        {/* Court background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600 via-emerald-500 to-teal-500" />
        
        {/* Court lines overlay - boundary */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-6 border-2 border-white rounded-lg" />
        </div>

        {/* Side lines for doubles */}
        {isDoubles && (
          <div className="absolute inset-0 opacity-15">
            <div className="absolute left-[30%] top-6 bottom-6 w-0.5 bg-white" />
            <div className="absolute right-[30%] top-6 bottom-6 w-0.5 bg-white" />
          </div>
        )}

        {/* Net line - center horizontal */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10">
          <div className="h-1 bg-white/90 shadow-lg" />
          <div className="absolute inset-x-0 -top-3 h-6 border-t border-b border-white/40" />
        </div>

        {/* Team A – top half */}
        <div className="absolute inset-0 top-0 bottom-1/2 flex items-center justify-center p-6 pb-10">
          {isDoubles ? (
            <div className="flex flex-col w-full gap-3">
              {teamA.map((name, idx) => (
                <PlayerCard key={name} name={name} delay={idx * 0.1} />
              ))}
            </div>
          ) : (
            <PlayerCard name={teamA[0]} delay={0} />
          )}
        </div>

        {/* Team B – bottom half */}
        <div className="absolute inset-0 top-1/2 bottom-0 flex items-center justify-center p-6 pt-10">
          {isDoubles ? (
            <div className="flex flex-col w-full gap-3">
              {teamB.map((name, idx) => (
                <PlayerCard key={name} name={name} delay={(idx + 2) * 0.1} />
              ))}
            </div>
          ) : (
            <PlayerCard name={teamB[0]} delay={0.1} />
          )}
        </div>
      </div>

      {/* Resting: outside court, below */}
      {rest.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 animate-fade-in">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-500 uppercase tracking-wider">Sitting out</span>
          <div className="flex flex-wrap justify-center gap-2">
            {rest.map((name) => {
              const avatar = avatars?.get(name)
              return (
                <span
                  key={name}
                  className="glass-button inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 shadow-lg"
                >
                  {avatar && (
                    <img 
                      src={avatar.icon} 
                      alt="" 
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  <span>{name}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
