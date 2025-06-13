import React, { useState, useEffect } from 'react';

interface TimerProps {
}

interface TimerEntry {
  id: string;
  mode: 'focus' | 'shortBreak' | 'longBreak' | 'custom';
  duration: number; // in seconds
  timestamp: number; // Unix timestamp
}

const Timer: React.FC<TimerProps> = () => {
  const [time, setTime] = useState(25 * 60); // Initial time for Focus (25 minutes)
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak' | 'custom'>('focus');
  const [history, setHistory] = useState<TimerEntry[]>(() => {
    const savedHistory = localStorage.getItem('timerHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            // Record the completed session
            setHistory(prevHistory => [
              ...prevHistory,
              {
                id: Date.now().toString(),
                mode: timerMode,
                duration: calculateInitialTime(timerMode), // Store original duration
                timestamp: Date.now(),
              },
            ]);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timerMode]); // Add timerMode to dependencies

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('timerHistory', JSON.stringify(history));
  }, [history]);

  const calculateInitialTime = (mode: 'focus' | 'shortBreak' | 'longBreak' | 'custom') => {
    switch (mode) {
      case 'focus':
        return 25 * 60;
      case 'shortBreak':
        return 5 * 60;
      case 'longBreak':
        return 15 * 60;
      case 'custom':
        return 0; // Or a default custom value if applicable
      default:
        return 25 * 60;
    }
  };

  const handleModeChange = (mode: 'focus' | 'shortBreak' | 'longBreak' | 'custom') => {
    setIsRunning(false);
    setTimerMode(mode);
    setTime(calculateInitialTime(mode));
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Timer Content */}
        <main className="flex-1 overflow-auto bg-white flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => handleModeChange('focus')}
                className={`px-5 py-2 rounded-lg text-sm font-medium ${
                  timerMode === 'focus' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Focus
              </button>
              <button
                onClick={() => handleModeChange('shortBreak')}
                className={`px-5 py-2 rounded-lg text-sm font-medium ${
                  timerMode === 'shortBreak' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Short Break
              </button>
              <button
                onClick={() => handleModeChange('longBreak')}
                className={`px-5 py-2 rounded-lg text-sm font-medium ${
                  timerMode === 'longBreak' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Long Break
              </button>
              <button
                onClick={() => handleModeChange('custom')}
                className={`px-5 py-2 rounded-lg text-sm font-medium ${
                  timerMode === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Custom
              </button>
            </div>
            <h1 className="text-7xl font-bold text-gray-900 mb-2">{formatTime(time)}</h1>
            <p className="text-lg text-gray-600 mb-8">
              {timerMode === 'focus' && 'Focus'}
              {timerMode === 'shortBreak' && 'Short Break'}
              {timerMode === 'longBreak' && 'Long Break'}
              {timerMode === 'custom' && 'Custom Timer'}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg flex items-center justify-center"
              >
                {isRunning ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause mr-2"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play mr-2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    Start
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsRunning(false);
                  handleModeChange(timerMode); // Reset to current mode's default time
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw mr-2"><path d="M3 12a9 9 0 1 0 9-9Z" /><path d="M3.6 4c-.9 3.4-1 9.8 10 16" /></svg>
                Reset
              </button>
            </div>
          </div>
        </main>

        {/* History/Progress Section */}
        <aside className="w-72 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Timer History</h2>
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No sessions completed yet.</p>
          ) : (
            <div className="space-y-4">
              {history.map(entry => (
                <div key={entry.id} className="bg-gray-50 rounded-lg p-3 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 font-medium capitalize">{entry.mode} Session</p>
                    <p className="text-gray-500 text-sm">Duration: {formatTime(entry.duration)}</p>
                    <p className="text-gray-400 text-xs">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => setHistory(history.filter(item => item.id !== entry.id))}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Timer;
