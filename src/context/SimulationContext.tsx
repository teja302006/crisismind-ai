import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { apiService } from '../services/apiService';
import { useNotifications } from './NotificationContext';
import { Incident } from '../../api/types';

interface SimulationContextType {
  isSimulationActive: boolean;
  setSimulationActive: (active: boolean) => void;
  triggerTick: () => Promise<void>;
  simulationTime: string;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const simulatedLocations = [
  { name: 'NW 20th St & NW 10th Ave', lat: 25.7952, lng: -80.2115 },
  { name: 'Flagler St & SW 8th Ave', lat: 25.7744, lng: -80.2081 },
  { name: 'S Miami Ave & SE 15th Rd', lat: 25.7592, lng: -80.1945 },
  { name: 'N Bayshore Dr & NE 20th St', lat: 25.7958, lng: -80.1861 },
  { name: 'Biscayne Blvd & NE 6th St', lat: 25.7808, lng: -80.1882 }
];

const simulatedDescriptions = [
  'Minor street flooding. Storm sewers overflowing, making sidewalks unusable.',
  'Stalled passenger car blocking the right lane. Driver is waiting for assistance.',
  'Power line arching due to high winds and water contact. Authorities contacted.',
  'Localized sewer backflow overflowing into private driveway. Strong odor reporting.',
  'Sandbags breached along coastal walk path. Surge water encroaching onto roadway.'
];

const incidentTypes = ['Flood', 'Road Accident', 'Infrastructure Failure', 'Flood', 'Flood'];

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSimulationActive, setSimulationActive] = useState<boolean>(true);
  const [simulationTime, setSimulationTime] = useState<string>('');
  const { showToast, fetchNotifications } = useNotifications();
  const tickRef = useRef<(() => Promise<void>) | null>(null);

  // Keep simulation clock ticking every second
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setSimulationTime(date.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerTick = async () => {
    try {
      // 1. Roll chance for new report (70% probability)
      if (Math.random() < 0.7) {
        const randLoc = simulatedLocations[Math.floor(Math.random() * simulatedLocations.length)];
        const randType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
        const randDesc = simulatedDescriptions[Math.floor(Math.random() * simulatedDescriptions.length)];
        const severities = ['moderate', 'high', 'critical'] as const;
        const randSev = severities[Math.floor(Math.random() * severities.length)];

        const reportResponse = await apiService.submitReport({
          type: randType,
          location: randLoc.name,
          latitude: randLoc.lat,
          longitude: randLoc.lng,
          severity: randSev,
          description: randDesc,
          contactPreference: 'mobile'
        });

        showToast(
          'SIMULATION: NEW INCOMING SIGNAL',
          `Citizen reported ${randType} at ${randLoc.name} (${randSev.toUpperCase()}). AI Code: ${reportResponse.code}`,
          randSev === 'critical' ? 'danger' : 'warning'
        );
      } else {
        // Resolve or monitor an existing incident
        const incidents = await apiService.getIncidents();
        const active = incidents.filter(i => i.status === 'active');
        if (active.length > 5) {
          // pick one random active incident and toggle to monitored
          const randInc = active[Math.floor(Math.random() * active.length)];
          
          // Call PUT API locally or simulate state change
          // In mock mode, this edits mockIncidents in the dbService directly via backend API if available, 
          // or we just trigger the UI update.
          const newStatus = Math.random() < 0.6 ? 'monitored' : 'resolved';
          
          // Try to update on the server
          try {
            await fetch(`/api/incidents/${randInc.id}`, {
              method: 'POST', // standard endpoint handler or put simulation
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus }) // If we have PUT API, otherwise Express app routing
            });
          } catch(e) {}

          showToast(
            'SIMULATION: HAZARD STATUS UPDATED',
            `Incident ${randInc.code} status changed to ${newStatus.toUpperCase()}`,
            'info'
          );
        }
      }

      // Reload notifications list
      await fetchNotifications();
    } catch (err) {
      console.error('Simulation tick execution failed:', err);
    }
  };

  // Keep a reference to triggerTick to bypass stale closures
  useEffect(() => {
    tickRef.current = triggerTick;
  });

  // Run simulation interval
  useEffect(() => {
    if (!isSimulationActive) return;

    const runInterval = async () => {
      if (tickRef.current) {
        await tickRef.current();
      }
    };

    // Trigger simulation tick every 18 seconds
    const interval = setInterval(runInterval, 18000);
    return () => clearInterval(interval);
  }, [isSimulationActive]);

  return (
    <SimulationContext.Provider
      value={{
        isSimulationActive,
        setSimulationActive,
        triggerTick,
        simulationTime
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within a SimulationProvider');
  return context;
};
