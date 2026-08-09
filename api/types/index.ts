// Shared TypeScript Types for CrisisMind AI

export interface Incident {
  id: string;
  code: string;
  type: string;
  location: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  status: 'active' | 'monitored' | 'resolved';
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentReport {
  id: string;
  code: string;
  type: string;
  location: string;
  latitude: number;
  longitude: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  contact_preference: string;
  status: 'submitted' | 'approved' | 'rejected';
  generated_incident_id?: string | null;
  created_at: string;
}

export interface RiskZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  risk_score: number; // 0-100
  severity: 'low' | 'moderate' | 'high' | 'critical';
  factors: {
    weather: number;
    density: number;
    exposure: number;
    vulnerability: number;
    road_closures: number;
    historical: number;
  };
  created_at: string;
  updated_at: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  type: 'hospital' | 'fire station' | 'police station' | 'shelter' | 'collection point';
  latitude: number;
  longitude: number;
  distance?: number; // in km from user / center
  availability: 'available' | 'limited' | 'full';
  capacity?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface RiskAssessment {
  id: string;
  zone_id: string;
  overall_score: number;
  factors: RiskZone['factors'];
  explanation: string;
  created_at: string;
}

export interface AiInteraction {
  id: string;
  query: string;
  response: string;
  context?: any;
  provider: 'gemini' | 'demo';
  created_at: string;
}

export interface RouteRequest {
  id: string;
  start_location?: string;
  start_latitude: number;
  start_longitude: number;
  end_location?: string;
  end_latitude: number;
  end_longitude: number;
  selected_route_type: 'fastest' | 'lowest_risk' | 'emergency';
  routes_data: any;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  read: boolean;
  created_at: string;
}
