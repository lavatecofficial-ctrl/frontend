'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllApplications, Application } from './index';
import { FaRocket, FaUserAstronaut, FaDice } from 'react-icons/fa';

interface AppNavigatorProps {
  currentApp?: string;
  onAppChange?: (app: Application) => void;
}

export default function AppNavigator({ currentApp, onAppChange }: AppNavigatorProps) {
  const router = useRouter();
  const [activeApp, setActiveApp] = useState(currentApp || 'aviator');
  
  const applications = getAllApplications();
  
  const getAppIcon = (appName: string) => {
    switch (appName.toLowerCase()) {
      case 'aviator':
        return <FaRocket className="text-xl" />;
      case 'spaceman':
        return <FaUserAstronaut className="text-xl" />;
      case 'roulettes':
        return <FaDice className="text-xl" />;
      default:
        return <FaRocket className="text-xl" />;
    }
  };

  const handleAppChange = (app: Application) => {
    setActiveApp(app.name.toLowerCase());
    onAppChange?.(app);
    
    // Navigate to the app's portal
    router.push(`/portal/${app.name.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col space-y-2 p-4">
      <h3 className="text-white font-orbitron text-sm mb-4">Aplicaciones</h3>
      
      {applications.map((app) => (
        <button
          key={app.name}
          onClick={() => handleAppChange(app)}
          className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
            activeApp === app.name.toLowerCase()
              ? 'bg-white bg-opacity-10 border-white text-white'
              : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
          }`}
        >
          <div className="flex-shrink-0">
            {getAppIcon(app.name)}
          </div>
          <div className="flex-1 text-left">
            <div className="font-orbitron font-medium">{app.name}</div>
            <div className="text-xs opacity-75">{app.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
