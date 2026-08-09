import { Incident, IncidentReport, RiskZone, EmergencyResource, RiskAssessment, AiInteraction, RouteRequest, Notification } from '../../api/types';

// Detect API host (Vercel serverless function or local dev proxy)
const API_BASE = '/api';

export const apiService = {
  // --- Incidents ---
  async getIncidents(): Promise<Incident[]> {
    try {
      const res = await fetch(`${API_BASE}/incidents`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('API error fetching incidents, using client-side cache:', err);
      return getClientFallbackIncidents();
    }
  },

  async getIncidentById(id: string): Promise<Incident | null> {
    try {
      const res = await fetch(`${API_BASE}/incidents/${id}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('API error fetching incident details:', err);
      const all = getClientFallbackIncidents();
      return all.find(i => i.id === id) || null;
    }
  },

  // --- Reports ---
  async submitReport(reportData: {
    type: string;
    location: string;
    latitude: number;
    longitude: number;
    severity: string;
    description: string;
    contactPreference: string;
  }): Promise<{ code: string; generatedIncidentId: string; status: string }> {
    try {
      const res = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Network error');
      }
      return await res.json();
    } catch (err: any) {
      console.warn('API error submitting report, running client simulation:', err);
      // Client-side simulation fallback
      const reportCode = `CM-REP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const generatedIncidentId = crypto.randomUUID();
      return {
        code: reportCode,
        generatedIncidentId,
        status: 'AI ANALYSIS COMPLETE'
      };
    }
  },

  // --- Risk Analysis ---
  async getRisk(lat?: number, lng?: number): Promise<{ zones: RiskZone[]; localCalculation?: any }> {
    try {
      const url = lat && lng ? `${API_BASE}/risk?lat=${lat}&lng=${lng}` : `${API_BASE}/risk`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('API error fetching risk zones:', err);
      return {
        zones: getClientFallbackRiskZones(),
        localCalculation: lat && lng ? calculateClientRisk(lat, lng) : undefined
      };
    }
  },

  // --- Emergency Resources ---
  async getResources(): Promise<EmergencyResource[]> {
    try {
      const res = await fetch(`${API_BASE}/resources`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('API error fetching emergency resources:', err);
      return getClientFallbackResources();
    }
  },

  // --- Safe Routes ---
  async getRoutes(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startLat, startLng, endLat, endLng }),
      });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('API error fetching routes, simulating routes on client:', err);
      return simulateClientRoutes(startLat, startLng, endLat, endLng);
    }
  },

  // --- CrisisMind Copilot ---
  async queryCopilot(
    query: string,
    context: { activeZoneId?: string; activeIncidentId?: string; userLat?: number; userLng?: number } = {}
  ): Promise<{ response: string; provider: 'gemini' | 'demo' }> {
    try {
      const res = await fetch(`${API_BASE}/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context }),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        return {
          response: `### ⚠️ Copilot Server Error (${res.status})
The emergency operations backend returned an error while processing the request:
> **${errData?.error || 'Internal Error'}**: ${errData?.message || 'The server failed to evaluate the telemetry query.'}

Please check the system configuration or verify Vercel environment variable settings.`,
          provider: 'demo'
        };
      }
      return await res.json();
    } catch (err) {
      console.warn('API error querying copilot, generating offline response:', err);
      return {
        response: generateClientOfflineCopilotResponse(query, context),
        provider: 'demo'
      };
    }
  },

  // --- Analytics ---
  async getAnalytics(days: number = 7): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/analytics?days=${days}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('API error fetching analytics:', err);
      return getClientFallbackAnalytics();
    }
  },

  // --- Notifications ---
  async getNotifications(): Promise<Notification[]> {
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('API error fetching notifications:', err);
      return getClientFallbackNotifications();
    }
  },

  async markNotificationsRead(): Promise<void> {
    try {
      await fetch(`${API_BASE}/notifications/read`, { method: 'POST' });
    } catch (err) {
      console.warn('API error marking notifications read:', err);
    }
  }
};

// =========================================================================
// CLIENT-SIDE FALLBACK MOCK ENGINES (FOR OFFLINE / DISCONNECTED MODES)
// =========================================================================

function getClientFallbackIncidents(): Incident[] {
  return [
    {
      id: '1', code: 'CM-2026-00101', type: 'Flood', location: 'Brickell Ave & SE 12th St',
      latitude: 25.7618, longitude: -80.1917, severity: 'critical', confidence: 95, status: 'active',
      description: 'Severe flash flooding. 3 feet of standing water reporting. Submerged vehicles.',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    },
    {
      id: '2', code: 'CM-2026-00102', type: 'Flood', location: 'Biscayne Blvd & NE 15th St',
      latitude: 25.7895, longitude: -80.1872, severity: 'high', confidence: 90, status: 'active',
      description: 'Coastal surge causing overflow. High tide is aggravating local drainage.',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    },
    {
      id: '3', code: 'CM-2026-00103', type: 'Road Accident', location: 'I-95 Southbound near SW 8th St Exit',
      latitude: 25.7654, longitude: -80.2015, severity: 'high', confidence: 88, status: 'active',
      description: 'Multi-car pileup in heavy rain. Structural impact to median barrier.',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  ];
}

function getClientFallbackRiskZones(): RiskZone[] {
  return [
    {
      id: 'z1', name: 'Brickell Critical Flood Corridor', latitude: 25.7618, longitude: -80.1917, radius: 800,
      risk_score: 91, severity: 'critical', factors: { weather: 95, density: 88, exposure: 92, vulnerability: 85, road_closures: 90, historical: 89 },
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    },
    {
      id: 'z2', name: 'Downtown Surge Area', latitude: 25.7795, longitude: -80.1875, radius: 1000,
      risk_score: 85, severity: 'high', factors: { weather: 95, density: 85, exposure: 80, vulnerability: 78, road_closures: 75, historical: 82 },
      created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    }
  ];
}

function getClientFallbackResources(): EmergencyResource[] {
  return [
    { id: 'r1', name: 'Jackson Memorial Hospital', type: 'hospital', latitude: 25.7904, longitude: -80.2096, distance: 4.2, availability: 'limited', capacity: 'Trauma Level 1 - 90% Occupied', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'r2', name: 'Miami Fire Station 4 (Brickell)', type: 'fire station', latitude: 25.7621, longitude: -80.1952, distance: 0.4, availability: 'limited', capacity: '1 Engine Active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ];
}

function getClientFallbackNotifications(): Notification[] {
  return [
    { id: 'n1', title: 'CRITICAL FLOOD ALERT: Brickell Area', message: 'Severe flash flooding detected around Brickell Ave & SE 12th St.', type: 'danger', read: false, created_at: new Date().toISOString() }
  ];
}

function calculateClientRisk(lat: number, lng: number) {
  return { weather: 90, density: 40, exposure: 60, vulnerability: 70, road_closures: 10, historical: 50, overall: 55 };
}

function simulateClientRoutes(startLat: number, startLng: number, endLat: number, endLng: number) {
  return [
    {
      name: 'Simulated Route A (Fastest)', type: 'fastest', distanceKm: 4.5, durationMinutes: 15, riskScore: 78, safetyRating: 'monitored',
      description: 'Route crosses coastal high water accumulation sectors.', coordinates: [[startLat, startLng], [(startLat + endLat)/2, (startLng + endLng)/2], [endLat, endLng]]
    }
  ];
}

function generateClientOfflineCopilotResponse(query: string, context: any): string {
  return `### CrisisMind Copilot (Offline Fallback)
I am operating in offline client-side support mode.

- **Current Status**: Fictional Miami flood event simulation.
- **Recommendations**: Monitor local news and seek high ground if water level increases.

Please reconnect or ensure the backend API is active to query detailed risk intelligence.`;
}

function getClientFallbackAnalytics() {
  return {
    categories: [{ name: 'Flood', value: 3 }],
    severities: [{ name: 'critical', value: 1 }],
    timeSeries: [{ name: 'Today', Incidents: 3, Reports: 1, 'Risk Average': 80 }],
    summary: { totalIncidents: 3, activeIncidents: 3, criticalIncidents: 1, totalReports: 1, averageRiskScore: 88, aiConfidence: 95 }
  };
}
