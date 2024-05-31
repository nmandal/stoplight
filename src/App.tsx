import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

const lightConfig = {
  red: { time: 5000, next: 'green', color: 'bg-red-500' },
  green: { time: 3000, next: 'yellow', color: 'bg-green-500' },
  yellow: { time: 1000, next: 'red', color: 'bg-yellow-500' }
} as const;

type LightColor = keyof typeof lightConfig;

function App() {
  const [currLight, setCurrLight] = useState<LightColor>('red');

  const changeLight = useCallback(() => {
    setCurrLight((prevLight) => lightConfig[prevLight].next);
  }, []);

  useEffect(() => {
    const timer = setTimeout(changeLight, lightConfig[currLight].time);
    return () => clearTimeout(timer);
  }, [currLight, changeLight]);

  return (
    <div className="">
      <header className="text-black py-6 shadow-lg">
        <h1 className='text-6xl font-bold text-center'>Stoplight </h1>
      </header>
      <div className="mt-20 flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4 bg-gray-800 rounded-lg shadow-lg p-4">
          {(['red', 'yellow', 'green'] as LightColor[]).map((light) => (
            <div
              key={light}
              className={`w-24 h-24 rounded-full transition-colors duration-300 ${
                light === currLight ? lightConfig[light].color : `${lightConfig[light].color} opacity-20`
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;


