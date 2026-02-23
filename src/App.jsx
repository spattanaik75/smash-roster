import { useState } from 'react'
import SessionSetup from './components/SessionSetup'
import LiveSession, { SummaryScreen } from './components/LiveSession'

function App() {
  const [screen, setScreen] = useState('setup') // 'setup' | 'live' | 'summary'
  const [config, setConfig] = useState(null)
  const [sessionResult, setSessionResult] = useState(null)

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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <h1 className="text-xl font-bold text-slate-800">Paddle Roster</h1>
        <p className="text-sm text-slate-500">Fair rotations for your paddle group</p>
      </header>
      <main className="p-4 max-w-lg mx-auto">
        {screen === 'setup' && <SessionSetup onStart={handleStart} />}
        {screen === 'live' && config && (
          <LiveSession config={config} onEnd={handleEnd} />
        )}
        {screen === 'summary' && sessionResult && (
          <SummaryScreen
            config={sessionResult.config}
            rounds={sessionResult.rounds}
            onNewSession={handleNewSession}
          />
        )}
      </main>
    </div>
  )
}

export default App
