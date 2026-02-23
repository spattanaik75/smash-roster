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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {screen !== 'live' && (
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm px-6 py-4">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Smash<span className="text-emerald-400">Roster</span>
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Fair rotations for your paddle group</p>
          </div>
        </header>
      )}
      <main className={`max-w-lg mx-auto ${screen === 'live' ? 'p-4 pt-6' : 'p-6'}`}>
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
