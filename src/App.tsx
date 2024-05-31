import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

const defaultLightConfig = {
  red: { time: 5000, next: 'green', color: 'bg-red-500' },
  green: { time: 3000, next: 'yellow', color: 'bg-green-500' },
  yellow: { time: 1000, next: 'red', color: 'bg-yellow-500' }
} as const;

type LightColor = keyof typeof defaultLightConfig;

function App() {
  const [lightConfig, setLightConfig] = useState(defaultLightConfig);
  const [currLights, setCurrLights] = useState<LightColor[]>(['red', 'red', 'red']);

  const changeLights = useCallback(() => {
    setCurrLights((prevLights) => 
      prevLights.map((light, index) => {
        const delay = index * 1000;
        setTimeout(() => {
          setCurrLights((lights) => {
            const newLights = [...lights];
            newLights[index] = lightConfig[light].next;
            return newLights;
          });
        }, delay);
        return light;
      })
    );
  }, [lightConfig]);

  useEffect(() => {
    const timer = setTimeout(changeLights, lightConfig[currLights[0]].time);
    return () => clearTimeout(timer);
  }, [currLights, changeLights, lightConfig]);

  return (
    <div className="">
      <header className="text-black py-6 shadow-lg">
        <h1 className='text-6xl font-bold text-center'>Coordinated Stoplights</h1>
      </header>
      <Dashboard currLights={currLights} setCurrLights={setCurrLights} setLightConfig={setLightConfig} lightConfig={lightConfig} />
      <div className="mt-20 flex flex-col items-center justify-center h-full space-y-10">
        {currLights.map((currLight, index) => (
          <Stoplight key={index} currLight={currLight} lightConfig={lightConfig} />
        ))}
      </div>
    </div>
  );
}

function Dashboard({ currLights, setCurrLights, setLightConfig, lightConfig }: { currLights: LightColor[], setCurrLights: React.Dispatch<React.SetStateAction<LightColor[]>>, setLightConfig: React.Dispatch<React.SetStateAction<typeof defaultLightConfig>>, lightConfig: typeof defaultLightConfig }) {
  const handleLightChange = (index: number, newLight: LightColor) => {
    setCurrLights((prevLights) => {
      const newLights = [...prevLights];
      newLights[index] = newLight;
      return newLights;
    });
  };

  const handleConfigChange = (color: LightColor, time: number) => {
    setLightConfig((prevConfig) => ({
      ...prevConfig,
      [color]: { ...prevConfig[color], time }
    }));
  };

  return (
    <div className="mt-10 p-4 bg-gray-200 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-center mb-4">Dashboard</h2>
      <div className="flex flex-col space-y-2">
        {currLights.map((light, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-xl">Stoplight {index + 1}</span>
            <select
              className="text-xl font-bold"
              value={light}
              onChange={(e) => handleLightChange(index, e.target.value as LightColor)}
            >
              {(['red', 'yellow', 'green'] as LightColor[]).map((option) => (
                <option key={option} value={option} className={defaultLightConfig[option].color}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
        {(['red', 'yellow', 'green'] as LightColor[]).map((color) => (
          <div key={color} className="flex justify-between items-center">
            <span className="text-xl">{color.charAt(0).toUpperCase() + color.slice(1)} Duration (ms)</span>
            <input
              type="number"
              className="text-xl font-bold"
              value={lightConfig[color].time}
              onChange={(e) => handleConfigChange(color, parseInt(e.target.value))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Stoplight({ currLight, lightConfig }: { currLight: LightColor, lightConfig: typeof defaultLightConfig }) {
  return (
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
  );
}

export default App;