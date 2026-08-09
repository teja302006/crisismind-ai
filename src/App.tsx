import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { SimulationProvider } from './context/SimulationContext';
import { Layout } from './components/Layout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Incidents } from './pages/Incidents';
import { Copilot } from './pages/Copilot';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { Routes as RoutesPage } from './pages/Routes'; // Renamed to avoid name collision with react-router-dom
import { Resources } from './pages/Resources';
import { Analytics } from './pages/Analytics';
import { ReportIncident } from './pages/ReportIncident';
import { About } from './pages/About';

export const App: React.FC = () => {
  return (
    <NotificationProvider>
      <SimulationProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Landing Portal */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Command Center Subroutes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/risk" element={<RiskAnalysis />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/report" element={<ReportIncident />} />
              <Route path="/about" element={<About />} />
              
              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </SimulationProvider>
    </NotificationProvider>
  );
};

export default App;
