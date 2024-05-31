import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

type Light = {
  position: number;
  color: string;
};

type SequenceStep = {
  colors: string[];
  duration: number;
};

type Configuration = {
  lights: Record<string, Light>;
  sequence: SequenceStep[];
};

type Configurations = {
  Standard: Configuration;
  Emergency: Configuration;
  ProtectedTurn: Configuration;
  PartyTime: Configuration;
};

const configurations: Configurations = {
  Standard: {
    lights: {
      red: { position: 1, color: 'bg-red-500' },
      yellow: { position: 2, color: 'bg-yellow-500' },
      green: { position: 3, color: 'bg-green-500' }
    },
    sequence: [
      { colors: ['green'], duration: 3000 },
      { colors: ['yellow'], duration: 1000 },
      { colors: ['red'], duration: 2000 }
    ]
  },
  Emergency: {
    lights: {
      red: { position: 1, color: 'bg-red-500' },
      yellow: { position: 2, color: 'bg-yellow-500' },
      green: { position: 3, color: 'bg-green-500' }
    },
    sequence: [
      { colors: ['red'], duration: 1000 },
      { colors: ['off'], duration: 1000 }
    ]
  },
  ProtectedTurn: {
    lights: {
      red: { position: 1, color: 'bg-red-500' },
      yellow: { position: 2, color: 'bg-yellow-500' },
      green: { position: 3, color: 'bg-green-500' },
      leftTurn: { position: 4, color: 'bg-teal-500' }
    },
    sequence: [
      { colors: ['leftTurn'], duration: 1000 },
      { colors: ['green'], duration: 1000 },
      { colors: ['yellow'], duration: 1000 },
      { colors: ['red'], duration: 1000 }
    ]
  },
  PartyTime: {
    lights: {
      red: { position: 1, color: 'bg-red-500' },
      purple: { position: 2, color: 'bg-purple-500' },
      green: { position: 3, color: 'bg-green-500' },
      orange: { position: 4, color: 'bg-orange-500' }
    },
    sequence: [
      { colors: ['red', 'orange'], duration: 500 },
      { colors: ['purple', 'green'], duration: 500 },
      { colors: ['purple', 'orange', 'green'], duration: 500 },
      { colors: ['purple', 'orange', 'green', 'red'], duration: 500 }
    ]
  }
};

function App() {
  const [configName, setConfigName] = useState<keyof Configurations>('Standard');
  const [currStep, setCurrStep] = useState(0);
  const [activeColors, setActiveColors] = useState<string[]>(configurations.Standard.sequence[0].colors);

  const config = configurations[configName];

  const changeLight = useCallback(() => {
    setCurrStep((prevStep) => (prevStep + 1) % config.sequence.length);
  }, [config.sequence.length]);

  useEffect(() => {
    setActiveColors(config.sequence[currStep].colors);
    const timer = setTimeout(changeLight, config.sequence[currStep].duration);
    return () => clearTimeout(timer);
  }, [currStep, changeLight, config.sequence]);

  const handleConfigChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setConfigName(event.target.value as keyof Configurations);
    setCurrStep(0);
  };

  return (
    <div>
      <header className="text-black py-6 shadow-lg">
        <h1 className="text-6xl font-bold text-center">Stoplight</h1>
      </header>
      <div className="mt-20 flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4 bg-gray-800 rounded-lg shadow-lg p-4">
          {Object.keys(config.lights).map((light) => (
            <div
              key={light}
              className={`w-24 h-24 rounded-full transition-colors duration-300 ${
                activeColors.includes(light) ? config.lights[light].color : `${config.lights[light].color} opacity-20`
              }`}
            />
          ))}
        </div>
        <div className="mt-6">
          <select value={configName} onChange={handleConfigChange} className="text-black">
            {Object.keys(configurations).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
