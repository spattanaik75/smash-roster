import { useState, useEffect } from 'react'
import SessionSetup from './components/SessionSetup'
import LiveSession, { SummaryScreen } from './components/LiveSession'
import { getSessionFromURL } from './lib/urlState'

function App() {
  const [screen, setScreen] = useState('setup')
  const [config, setConfig] = useState(null)
  const [sessionResult, setSessionResult] = useState(null)
  const [urlSession, setUrlSession] = useState(null)

  useEffect(() => {
    const sessionFromURL = getSessionFromURL()
    if (sessionFromURL) {
      setUrlSession(sessionFromURL)
    }
  }, [])

  const handleStart = (sessionConfig) => {
    setConfig(sessionConfig)
    setScreen('live')
  }

  const handleEnd = (result) => {
    setSessionResult(result)
    setScreen('summary')
  }

  const handleNewSession = () => {
    setConfig(null)
    setSessionResult(null)
    setScreen('setup')
  }

  const handleContinue = () => {
    if (sessionResult) {
      setConfig(sessionResult.config)
      setScreen('live')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ios-light-bg via-slate-100 to-ios-light-secondary dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {screen !== 'live' && (
        <header className="border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur-xl backdrop-saturate-180 px-6 py-4">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Smash<span className="text-emerald-500 dark:text-emerald-400">Roster</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Fair rotations for your paddle group</p>
          </div>
        </header>
      )}
      <main className={`max-w-lg mx-auto ${screen === 'live' ? 'p-3 pt-4' : 'p-6'}`}>
        <div key={screen} className="animate-fade-in">
          {screen === 'setup' && <SessionSetup onStart={handleStart} urlSession={urlSession} />}
          {screen === 'live' && config && (
            <LiveSession config={config} onEnd={handleEnd} />
          )}
          {screen === 'summary' && sessionResult && (
            <SummaryScreen
              config={sessionResult.config}
              rounds={sessionResult.rounds}
              onNewSession={handleNewSession}
              onContinue={handleContinue}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
