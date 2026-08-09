import { createClient } from '@supabase/supabase-js';
import { Incident, IncidentReport, RiskZone, EmergencyResource, RiskAssessment, AiInteraction, RouteRequest, Notification } from '../types';

// Read configuration from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const isSupabaseEnabled = supabaseUrl !== '' && supabaseAnonKey !== '';

export const supabase = isSupabaseEnabled ? createClient(supabaseUrl, supabaseAnonKey) : null;

// =========================================================================
// IN-MEMORY / LOCAL DATABASE (SEED DATA)
// =========================================================================

let mockIncidents: Incident[] = [
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557001',
    code: 'CM-2026-00101',
    type: 'Flood',
    location: 'Brickell Ave & SE 12th St',
    latitude: 25.7618,
    longitude: -80.1917,
    severity: 'critical',
    confidence: 95,
    status: 'active',
    description: 'Severe flash flooding. 3 feet of standing water reporting. Submerged vehicles. Residents advised to seek higher ground.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557002',
    code: 'CM-2026-00102',
    type: 'Flood',
    location: 'Biscayne Blvd & NE 15th St',
    latitude: 25.7895,
    longitude: -80.1872,
    severity: 'high',
    confidence: 90,
    status: 'active',
    description: 'Coastal surge causing overflow. High tide is aggravating local drainage. Roads impassable for sedan vehicles.',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557003',
    code: 'CM-2026-00103',
    type: 'Road Accident',
    location: 'I-95 Southbound near SW 8th St Exit',
    latitude: 25.7654,
    longitude: -80.2015,
    severity: 'high',
    confidence: 88,
    status: 'active',
    description: 'Multi-car pileup in heavy rain. Structural impact to median barrier. FHP responding, 2 lanes blocked.',
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557004',
    code: 'CM-2026-00104',
    type: 'Flood',
    location: 'SW 8th St & SW 12th Ave (Little Havana)',
    latitude: 25.7645,
    longitude: -80.2132,
    severity: 'moderate',
    confidence: 85,
    status: 'active',
    description: 'Street flooding up to curb level. Storm drains clogged with debris. Local businesses reporting minor water ingress.',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557005',
    code: 'CM-2026-00105',
    type: 'Infrastructure Failure',
    location: 'Miami River Drawbridge (SE 2nd Ave)',
    latitude: 25.7712,
    longitude: -80.1925,
    severity: 'critical',
    confidence: 92,
    status: 'active',
    description: 'Electrical failure due to water ingress. Bridge stuck in open position. Major arterial blockages across Downtown.',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557006',
    code: 'CM-2026-00106',
    type: 'Flood',
    location: 'S Bayshore Dr & Darwin St (Coconut Grove)',
    latitude: 25.7298,
    longitude: -80.2395,
    severity: 'high',
    confidence: 87,
    status: 'active',
    description: 'Bay surge water flooding coastal highway. Power lines down. Debris floating in street.',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557007',
    code: 'CM-2026-00107',
    type: 'Flood',
    location: 'NE 2nd Ave & NE 36th St (Midtown)',
    latitude: 25.8105,
    longitude: -80.1922,
    severity: 'moderate',
    confidence: 82,
    status: 'active',
    description: 'Localized urban flooding. High water on roads. Cars stalled. Local utility teams clearing drains.',
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 40).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557008',
    code: 'CM-2026-00108',
    type: 'Road Accident',
    location: 'Rickenbacker Causeway Midspan',
    latitude: 25.7485,
    longitude: -80.1652,
    severity: 'moderate',
    confidence: 80,
    status: 'active',
    description: 'Two-car collision blocking eastbound lane. Debris cleanup in progress. Traffic backed up to mainland.',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557009',
    code: 'CM-2026-00109',
    type: 'Landslide',
    location: 'Virginia Key Coastal Embankment',
    latitude: 25.7451,
    longitude: -80.1525,
    severity: 'low',
    confidence: 75,
    status: 'active',
    description: 'Minor mudslide and embankment erosion along coastal path. Public works cordoning area off.',
    created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 50).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557010',
    code: 'CM-2026-00110',
    type: 'Infrastructure Failure',
    location: 'Substation Flooding (SW 3rd Ave)',
    latitude: 25.7685,
    longitude: -80.1982,
    severity: 'critical',
    confidence: 96,
    status: 'active',
    description: 'FPL electrical substation flood warning. Danger of localized grid outage for 12,000 customers in Brickell and Downtown.',
    created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 55).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557011',
    code: 'CM-2026-00111',
    type: 'Flood',
    location: 'Edgewater Waterfront Walkway',
    latitude: 25.7981,
    longitude: -80.1865,
    severity: 'moderate',
    confidence: 85,
    status: 'monitored',
    description: 'Sea walls breached. Sidewalks flooded. High tide retreating, monitoring water levels.',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557012',
    code: 'CM-2026-00112',
    type: 'Industrial Accident',
    location: 'Port of Miami Fuel Depot Area',
    latitude: 25.7799,
    longitude: -80.1685,
    severity: 'high',
    confidence: 89,
    status: 'active',
    description: 'Minor chemical runoff from container yard due to torrential rains. Environmental containment boom deployed.',
    created_at: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 70).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557013',
    code: 'CM-2026-00113',
    type: 'Extreme Heat',
    location: 'Downtown Transit Hub',
    latitude: 25.7758,
    longitude: -80.1905,
    severity: 'low',
    confidence: 98,
    status: 'resolved',
    description: 'Commuters reported heat exhaustion at bus terminal. Resolved after temporary AC relief bus deployed.',
    created_at: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 80).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557014',
    code: 'CM-2026-00114',
    type: 'Road Accident',
    location: 'MacArthur Causeway Westbound',
    latitude: 25.7825,
    longitude: -80.1712,
    severity: 'high',
    confidence: 91,
    status: 'active',
    description: 'Stalled shuttle bus in low-lying flooded section. Passengers evacuated. Tow trucks in route, heavy traffic delays.',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557015',
    code: 'CM-2026-00115',
    type: 'Flood',
    location: 'Flagler St & NW 22nd Ave',
    latitude: 25.7741,
    longitude: -80.2312,
    severity: 'moderate',
    confidence: 80,
    status: 'active',
    description: 'Localized flooding in low lying residential section. Drainage pump station operating at maximum capacity.',
    created_at: new Date(Date.now() - 1000 * 60 * 100).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 100).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557016',
    code: 'CM-2026-00116',
    type: 'Flood',
    location: 'NW 7th St & NW 17th Ave',
    latitude: 25.7808,
    longitude: -80.2225,
    severity: 'high',
    confidence: 86,
    status: 'active',
    description: 'Water depth 1.5 feet. Residential access limited. Fire rescue staged nearby in case of evacuation.',
    created_at: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 110).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557017',
    code: 'CM-2026-00117',
    type: 'Fire',
    location: 'Apartment Building (Little Havana)',
    latitude: 25.7725,
    longitude: -80.2155,
    severity: 'critical',
    confidence: 95,
    status: 'active',
    description: 'Electrical panel fire sparked by flood water contact. Building evacuated. Two fire engines on site.',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557018',
    code: 'CM-2026-00118',
    type: 'Flood',
    location: 'Brickell Key Boulevard',
    latitude: 25.7692,
    longitude: -80.1831,
    severity: 'high',
    confidence: 88,
    status: 'active',
    description: 'Only road leading to Brickell Key flooded. High-clearance vehicles only. Resident access restricted.',
    created_at: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 130).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557019',
    code: 'CM-2026-00119',
    type: 'Infrastructure Failure',
    location: 'Sewer Main Leak (Coconut Grove)',
    latitude: 25.7325,
    longitude: -80.2325,
    severity: 'moderate',
    confidence: 82,
    status: 'active',
    description: 'Storm sewer backflow detected. Wastewater leaking into surface runoff. Public health warning posted.',
    created_at: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 140).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557020',
    code: 'CM-2026-00120',
    type: 'Cyclone',
    location: 'Key Biscayne Offshore Signals',
    latitude: 25.7015,
    longitude: -80.1585,
    severity: 'moderate',
    confidence: 78,
    status: 'monitored',
    description: 'Tropical storm force winds registered at offshore buoy. Rain bands approaching coastal sectors.',
    created_at: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 150).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557021',
    code: 'CM-2026-00121',
    type: 'Flood',
    location: 'NE 2nd Ave & NE 79th St',
    latitude: 25.8471,
    longitude: -80.1915,
    severity: 'high',
    confidence: 87,
    status: 'active',
    description: 'Severe residential street flooding. Deep standing water. Localized canal overflow detected upstream.',
    created_at: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 160).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557022',
    code: 'CM-2026-00122',
    type: 'Road Accident',
    location: 'Miami Design District (NE 40th St)',
    latitude: 25.8135,
    longitude: -80.1912,
    severity: 'low',
    confidence: 90,
    status: 'resolved',
    description: 'Single car collision with light pole due to hydroplaning. Light pole secured, car towed.',
    created_at: new Date(Date.now() - 1000 * 60 * 170).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 170).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557023',
    code: 'CM-2026-00123',
    type: 'Flood',
    location: 'Coral Way & SW 27th Ave',
    latitude: 25.7505,
    longitude: -80.2382,
    severity: 'moderate',
    confidence: 84,
    status: 'active',
    description: 'Clogged storm drains leading to 1 foot of standing water in intersection. Utility crew in route.',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557024',
    code: 'CM-2026-00124',
    type: 'Flood',
    location: 'SW 22nd St (Shenandoah)',
    latitude: 25.7538,
    longitude: -80.2228,
    severity: 'low',
    confidence: 79,
    status: 'monitored',
    description: 'Moderate curb flooding. Yards flooded but residences dry. Rainfall intensity diminishing.',
    created_at: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 190).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557025',
    code: 'CM-2026-00125',
    type: 'Infrastructure Failure',
    location: 'Wastewater Pump Station 3',
    latitude: 25.7915,
    longitude: -80.1895,
    severity: 'high',
    confidence: 91,
    status: 'active',
    description: 'Backup generator failure in flooded facility. Emergency crew working on electrical systems.',
    created_at: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 200).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557026',
    code: 'CM-2026-00126',
    type: 'Flood',
    location: 'NW 36th St & I-95 Underpass',
    latitude: 25.8101,
    longitude: -80.2085,
    severity: 'critical',
    confidence: 94,
    status: 'active',
    description: 'Underpass flooded to depth of 4 feet. Multiple vehicles trapped. Water rising. Search and rescue deployed.',
    created_at: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 210).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557027',
    code: 'CM-2026-00127',
    type: 'Flood',
    location: 'Biscayne Canal Spillway',
    latitude: 25.8612,
    longitude: -80.2012,
    severity: 'high',
    confidence: 89,
    status: 'active',
    description: 'Canal levels approaching emergency levels. Spillway gate fully open. Residents downstream alerted.',
    created_at: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 220).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557028',
    code: 'CM-2026-00128',
    type: 'Road Accident',
    location: 'SW 8th St & SW 27th Ave',
    latitude: 25.7648,
    longitude: -80.2381,
    severity: 'moderate',
    confidence: 85,
    status: 'active',
    description: 'Collision between delivery truck and sedan. Debris in road. Traffic diverted.',
    created_at: new Date(Date.now() - 1000 * 60 * 230).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 230).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557029',
    code: 'CM-2026-00129',
    type: 'Fire',
    location: 'Commercial Storefront (Coral Way)',
    latitude: 25.7515,
    longitude: -80.2185,
    severity: 'critical',
    confidence: 92,
    status: 'active',
    description: 'Active commercial building fire. Heavy smoke visible. Multi-unit fire department response.',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  },
  {
    id: '1e1a8a25-2dfb-4cc6-8a03-9d4131557030',
    code: 'CM-2026-00130',
    type: 'Flood',
    location: 'Coconut Grove Waterfront Marina',
    latitude: 25.7262,
    longitude: -80.2405,
    severity: 'moderate',
    confidence: 80,
    status: 'monitored',
    description: 'Marina docks flooded. High tide peak has passed. Boats secure, minor structural damage to wooden piers.',
    created_at: new Date(Date.now() - 1000 * 60 * 250).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 250).toISOString()
  }
];

let mockIncidentReports: IncidentReport[] = [];

let mockRiskZones: RiskZone[] = [
  {
    id: 'z1',
    name: 'Brickell Critical Flood Corridor',
    latitude: 25.7618,
    longitude: -80.1917,
    radius: 800,
    risk_score: 91,
    severity: 'critical',
    factors: { weather: 95, density: 88, exposure: 92, vulnerability: 85, road_closures: 90, historical: 89 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z2',
    name: 'Downtown Surge Area',
    latitude: 25.7795,
    longitude: -80.1875,
    radius: 1000,
    risk_score: 85,
    severity: 'high',
    factors: { weather: 95, density: 85, exposure: 80, vulnerability: 78, road_closures: 75, historical: 82 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z3',
    name: 'Little Havana Lowland Sector',
    latitude: 25.7725,
    longitude: -80.2155,
    radius: 900,
    risk_score: 78,
    severity: 'high',
    factors: { weather: 90, density: 80, exposure: 85, vulnerability: 82, road_closures: 60, historical: 74 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z4',
    name: 'Coconut Grove Coastal Belt',
    latitude: 25.7298,
    longitude: -80.2395,
    radius: 1200,
    risk_score: 82,
    severity: 'high',
    factors: { weather: 92, density: 70, exposure: 78, vulnerability: 80, road_closures: 85, historical: 86 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z5',
    name: 'Edgewater Waterfront Zone',
    latitude: 25.7981,
    longitude: -80.1865,
    radius: 800,
    risk_score: 72,
    severity: 'high',
    factors: { weather: 92, density: 75, exposure: 80, vulnerability: 65, road_closures: 55, historical: 70 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z6',
    name: 'I-95 SW Corridor (High Risk Transit)',
    latitude: 25.7654,
    longitude: -80.2015,
    radius: 600,
    risk_score: 88,
    severity: 'high',
    factors: { weather: 95, density: 95, exposure: 88, vulnerability: 80, road_closures: 85, historical: 72 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z7',
    name: 'Midtown Localized Lows',
    latitude: 25.8105,
    longitude: -80.1922,
    radius: 700,
    risk_score: 64,
    severity: 'moderate',
    factors: { weather: 88, density: 70, exposure: 60, vulnerability: 62, road_closures: 50, historical: 55 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z8',
    name: 'MacArthur Causeway Transit Zone',
    latitude: 25.7825,
    longitude: -80.1712,
    radius: 1100,
    risk_score: 68,
    severity: 'moderate',
    factors: { weather: 92, density: 85, exposure: 70, vulnerability: 55, road_closures: 70, historical: 45 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z9',
    name: 'Rickenbacker Passage',
    latitude: 25.7485,
    longitude: -80.1652,
    radius: 900,
    risk_score: 58,
    severity: 'moderate',
    factors: { weather: 90, density: 80, exposure: 55, vulnerability: 50, road_closures: 60, historical: 40 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z10',
    name: 'Virginia Key Coastal Fringe',
    latitude: 25.7451,
    longitude: -80.1525,
    radius: 1300,
    risk_score: 48,
    severity: 'low',
    factors: { weather: 90, density: 20, exposure: 35, vulnerability: 45, road_closures: 30, historical: 50 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z11',
    name: 'Miami River Industrial Hub',
    latitude: 25.7712,
    longitude: -80.1925,
    radius: 500,
    risk_score: 89,
    severity: 'high',
    factors: { weather: 90, density: 85, exposure: 88, vulnerability: 92, road_closures: 85, historical: 80 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z12',
    name: 'Coral Way Residential Sector',
    latitude: 25.7515,
    longitude: -80.2185,
    radius: 1000,
    risk_score: 76,
    severity: 'high',
    factors: { weather: 88, density: 78, exposure: 82, vulnerability: 75, road_closures: 60, historical: 68 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z13',
    name: 'Design District Low Elevation',
    latitude: 25.8135,
    longitude: -80.1912,
    radius: 600,
    risk_score: 52,
    severity: 'moderate',
    factors: { weather: 85, density: 70, exposure: 50, vulnerability: 52, road_closures: 30, historical: 48 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z14',
    name: 'Key Biscayne Northern Spit',
    latitude: 25.7015,
    longitude: -80.1585,
    radius: 1500,
    risk_score: 55,
    severity: 'moderate',
    factors: { weather: 92, density: 35, exposure: 60, vulnerability: 58, road_closures: 45, historical: 62 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'z15',
    name: 'Little Haiti Drainage Basin',
    latitude: 25.8252,
    longitude: -80.1932,
    radius: 950,
    risk_score: 74,
    severity: 'high',
    factors: { weather: 88, density: 82, exposure: 74, vulnerability: 78, road_closures: 55, historical: 72 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockEmergencyResources: EmergencyResource[] = [
  // Hospitals (5)
  { id: 'r1', name: 'Jackson Memorial Hospital', type: 'hospital', latitude: 25.7904, longitude: -80.2096, distance: 4.2, availability: 'limited', capacity: 'Trauma Level 1 - 90% Occupied', contact_phone: '305-585-1111', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r2', name: 'Mercy Hospital', type: 'hospital', latitude: 25.7423, longitude: -80.2178, distance: 3.8, availability: 'available', capacity: 'Emergency Care - 65% Occupied', contact_phone: '305-854-4400', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r3', name: 'Mount Sinai Medical Center', type: 'hospital', latitude: 25.8142, longitude: -80.1415, distance: 7.5, availability: 'available', capacity: 'General Beds - 70% Occupied', contact_phone: '305-674-2121', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r4', name: 'Coral Gables Hospital', type: 'hospital', latitude: 25.7512, longitude: -80.2645, distance: 7.6, availability: 'full', capacity: 'ICU - At Capacity', contact_phone: '305-445-8461', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r5', name: 'University of Miami Hospital', type: 'hospital', latitude: 25.7891, longitude: -80.2082, distance: 4.1, availability: 'available', capacity: 'General Beds - 55% Occupied', contact_phone: '305-689-5511', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Fire Stations (5)
  { id: 'r6', name: 'Miami Fire Station 1 (EOC)', type: 'fire station', latitude: 25.7792, longitude: -80.1983, distance: 2.1, availability: 'available', capacity: '3 Rescue Units Active', contact_phone: '305-416-1600', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r7', name: 'Miami Fire Station 2 (Downtown)', type: 'fire station', latitude: 25.7725, longitude: -80.1878, distance: 1.3, availability: 'available', capacity: '2 Rescue Engines Active', contact_phone: '305-416-1620', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r8', name: 'Miami Fire Station 4 (Brickell)', type: 'fire station', latitude: 25.7621, longitude: -80.1952, distance: 0.4, availability: 'limited', capacity: '1 Engine Active, 1 Unit Deployed', contact_phone: '305-416-1640', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r9', name: 'Miami Fire Station 9 (Coconut Grove)', type: 'fire station', latitude: 25.7285, longitude: -80.2415, distance: 5.8, availability: 'available', capacity: '2 Engines Active', contact_phone: '305-416-1690', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r10', name: 'Miami Fire Station 12 (Little Havana)', type: 'fire station', latitude: 25.7773, longitude: -80.2241, distance: 3.4, availability: 'available', capacity: '2 Engines Active', contact_phone: '305-416-1720', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Police Stations (5)
  { id: 'r11', name: 'Miami Police Department HQ', type: 'police station', latitude: 25.7801, longitude: -80.1995, distance: 2.2, availability: 'available', capacity: 'Tactical Operations Active', contact_phone: '305-603-6640', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r12', name: 'MPD Brickell Substation', type: 'police station', latitude: 25.7601, longitude: -80.1931, distance: 0.2, availability: 'available', capacity: 'Patrols Active', contact_phone: '305-603-6680', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r13', name: 'MPD Coconut Grove Station', type: 'police station', latitude: 25.7291, longitude: -80.2422, distance: 5.9, availability: 'available', capacity: 'Patrols Active', contact_phone: '305-603-6710', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r14', name: 'MPD Little Havana Substation', type: 'police station', latitude: 25.7751, longitude: -80.2225, distance: 3.2, availability: 'available', capacity: 'Patrols Active', contact_phone: '305-603-6750', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r15', name: 'Florida Highway Patrol Miami HQ', type: 'police station', latitude: 25.7835, longitude: -80.2612, distance: 7.3, availability: 'available', capacity: 'Road Safety Operations Active', contact_phone: '305-470-2500', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Shelters (6)
  { id: 'r16', name: 'Miami Senior High School Shelter', type: 'shelter', latitude: 25.7745, longitude: -80.2295, distance: 3.8, availability: 'available', capacity: 'Capacity: 500/800 refugees', contact_phone: '305-649-9800', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r17', name: 'Booker T. Washington School Shelter', type: 'shelter', latitude: 25.7885, longitude: -80.2032, distance: 3.5, availability: 'available', capacity: 'Capacity: 250/600 refugees', contact_phone: '305-324-8900', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r18', name: 'Grapeland Heights Park Shelter', type: 'shelter', latitude: 25.7951, longitude: -80.2525, distance: 6.8, availability: 'limited', capacity: 'Capacity: 480/500 - Near Limit', contact_phone: '305-960-2920', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r19', name: 'Shenandoah Park Community Center', type: 'shelter', latitude: 25.7585, longitude: -80.2285, distance: 3.6, availability: 'available', capacity: 'Capacity: 120/300 refugees', contact_phone: '305-859-2424', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r20', name: 'Jose Marti Park Gymnasium', type: 'shelter', latitude: 25.7701, longitude: -80.2015, distance: 1.8, availability: 'full', capacity: 'Capacity: 400/400 - FULL', contact_phone: '305-960-2945', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r21', name: 'Coconut Grove Elementary Gym', type: 'shelter', latitude: 25.7275, longitude: -80.2435, distance: 6.0, availability: 'available', capacity: 'Capacity: 50/400 refugees', contact_phone: '305-445-7876', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Collection Points (4)
  { id: 'r22', name: 'Edison Community Supply Point', type: 'collection point', latitude: 25.8235, longitude: -80.2035, distance: 7.2, availability: 'available', capacity: 'Bottled water, sandbags, dry food', contact_phone: '305-758-1234', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r23', name: 'Little Haiti Distribution Center', type: 'collection point', latitude: 25.8252, longitude: -80.1932, distance: 7.3, availability: 'available', capacity: 'Sandbags, medical kits, blankets', contact_phone: '305-758-5678', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r24', name: 'Coral Way Distribution Hub', type: 'collection point', latitude: 25.7511, longitude: -80.2291, distance: 3.7, availability: 'limited', capacity: 'Limited sandbags left, water available', contact_phone: '305-859-9988', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'r25', name: 'Brickell Key Emergency Point', type: 'collection point', latitude: 25.7681, longitude: -80.1852, distance: 1.1, availability: 'full', capacity: 'Supplies exhausted, awaiting shipment', contact_phone: '305-555-0199', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

let mockNotifications: Notification[] = [
  { id: 'n1', title: 'CRITICAL FLOOD ALERT: Brickell Area', message: 'Severe flash flooding detected around Brickell Ave & SE 12th St. Water levels exceeding 3 feet. Evacuate low levels.', type: 'danger', read: false, created_at: new Date().toISOString() },
  { id: 'n2', title: 'INCIDENT SUBMITTED: CM-REP-0901', message: 'A citizen reported a sewer backflow in Coconut Grove. AI triage is evaluating.', type: 'info', read: false, created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 'n3', title: 'INFRASTRUCTURE ALERT: River Drawbridge stuck', message: 'SE 2nd Ave drawbridge electrical outage. Impassable. Traffic rerouted.', type: 'danger', read: false, created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: 'n4', title: 'WEATHER WARNING: Flood Surge', message: 'High tide and offshore cyclone warnings active for Southeast Florida Coast.', type: 'warning', read: false, created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: 'n5', title: 'RESOURCE UPDATE: Jose Marti Shelter FULL', message: 'Jose Marti Park Shelter is at 100% capacity. New evacuees directed to Shenandoah Park.', type: 'warning', read: false, created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString() }
];

let mockRiskAssessments: RiskAssessment[] = [
  {
    id: 'ra1',
    zone_id: 'z1',
    overall_score: 91,
    factors: { weather: 95, density: 88, exposure: 92, vulnerability: 85, road_closures: 90, historical: 89 },
    explanation: 'Risk increased to CRITICAL because multiple high-severity incidents are concentrated within a high-exposure zone while road accessibility has decreased.',
    created_at: new Date().toISOString()
  },
  {
    id: 'ra2',
    zone_id: 'z2',
    overall_score: 85,
    factors: { weather: 95, density: 85, exposure: 80, vulnerability: 78, road_closures: 75, historical: 82 },
    explanation: 'Risk levels remain HIGH due to high tide storm surge exceeding drainage capacity in low elevation urban corridors.',
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  }
];

let mockAiInteractions: AiInteraction[] = [];
let mockRouteRequests: RouteRequest[] = [];

// =========================================================================
// DATA ACCESS SERVICE METHODS
// =========================================================================

export const dbService = {
  // --- Incidents ---
  async getIncidents(): Promise<Incident[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('incidents').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Incident[];
      console.error('Supabase getIncidents error, using mock:', error);
    }
    // Return sorted mock
    return [...mockIncidents].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getIncidentById(id: string): Promise<Incident | null> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('incidents').select('*').eq('id', id).single();
      if (!error && data) return data as Incident;
    }
    return mockIncidents.find(i => i.id === id) || null;
  },

  async createIncident(incident: Partial<Incident>): Promise<Incident> {
    const code = incident.code || `CM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newIncident: Incident = {
      id: incident.id || crypto.randomUUID(),
      code,
      type: incident.type || 'Flood',
      location: incident.location || 'Unknown Location',
      latitude: incident.latitude || 25.7617,
      longitude: incident.longitude || -80.1918,
      severity: incident.severity || 'moderate',
      confidence: incident.confidence || 80,
      status: incident.status || 'active',
      description: incident.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...incident
    };

    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('incidents').insert([newIncident]).select().single();
      if (!error && data) return data as Incident;
      console.error('Supabase createIncident error:', error);
    }

    mockIncidents.push(newIncident);
    return newIncident;
  },

  async updateIncident(id: string, updates: Partial<Incident>): Promise<Incident | null> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('incidents').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (!error && data) return data as Incident;
    }
    
    const idx = mockIncidents.findIndex(i => i.id === id);
    if (idx !== -1) {
      mockIncidents[idx] = {
        ...mockIncidents[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };
      return mockIncidents[idx];
    }
    return null;
  },

  // --- Reports ---
  async getIncidentReports(): Promise<IncidentReport[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('incident_reports').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as IncidentReport[];
    }
    return [...mockIncidentReports].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createIncidentReport(report: Partial<IncidentReport>): Promise<IncidentReport> {
    const reportCode = `CM-REP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReport: IncidentReport = {
      id: crypto.randomUUID(),
      code: reportCode,
      type: report.type || 'Flood',
      location: report.location || 'Unknown Location',
      latitude: report.latitude || 25.7617,
      longitude: report.longitude || -80.1918,
      severity: report.severity || 'moderate',
      description: report.description || '',
      contact_preference: report.contact_preference || 'anonymous',
      status: 'submitted',
      created_at: new Date().toISOString(),
      ...report
    };

    // Auto-approve and generate a real incident in the system (Simulating EOC auto-triage AI)
    const newIncident = await this.createIncident({
      type: newReport.type,
      location: newReport.location,
      latitude: newReport.latitude,
      longitude: newReport.longitude,
      severity: newReport.severity,
      confidence: 85, // AI confidence estimation
      status: 'active',
      description: `[Citizen Report ${newReport.code}]: ${newReport.description}`
    });

    newReport.status = 'approved';
    newReport.generated_incident_id = newIncident.id;

    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('incident_reports').insert([newReport]).select().single();
      if (!error && data) return data as IncidentReport;
      console.error('Supabase createIncidentReport error:', error);
    }

    mockIncidentReports.push(newReport);

    // Dynamic side effects for Mock Mode: Create notification & adjust risk zones
    await this.createNotification({
      title: `NEW CITIZEN REPORT RECEIVED`,
      message: `Incident reported at ${newReport.location}. Severity: ${newReport.severity.toUpperCase()}. Assigned ID: ${newIncident.code}.`,
      type: newReport.severity === 'critical' ? 'danger' : newReport.severity === 'high' ? 'warning' : 'info'
    });

    // Recalculate Risk Zones in mock database
    await this.recalculateRiskScores(newReport.latitude, newReport.longitude, newReport.severity);

    return newReport;
  },

  // --- Recalculate Risk Engine mock side effects ---
  async recalculateRiskScores(lat: number, lng: number, severity: string) {
    // Find closest risk zone and raise score
    let closestZone: RiskZone | null = null;
    let minDistance = Infinity;

    for (const zone of mockRiskZones) {
      const dist = Math.sqrt(Math.pow(zone.latitude - lat, 2) + Math.pow(zone.longitude - lng, 2));
      if (dist < minDistance) {
        minDistance = dist;
        closestZone = zone;
      }
    }

    // If within radius * 1.5, increase risk score
    if (closestZone && minDistance < 0.05) { // Roughly ~5km
      const scoreIncrease = severity === 'critical' ? 12 : severity === 'high' ? 8 : 4;
      const originalScore = closestZone.risk_score;
      const newScore = Math.min(100, originalScore + scoreIncrease);
      
      const newSeverity = newScore >= 90 ? 'critical' : newScore >= 75 ? 'high' : newScore >= 50 ? 'moderate' : 'low';
      
      closestZone.risk_score = newScore;
      closestZone.severity = newSeverity;
      closestZone.factors.density = Math.min(100, closestZone.factors.density + 5);
      closestZone.factors.road_closures = Math.min(100, closestZone.factors.road_closures + 8);
      closestZone.updated_at = new Date().toISOString();

      // Log risk assessment
      const ra: RiskAssessment = {
        id: crypto.randomUUID(),
        zone_id: closestZone.id,
        overall_score: newScore,
        factors: { ...closestZone.factors },
        explanation: `Risk index increased from ${originalScore} to ${newScore} after a new ${severity.toUpperCase()} incident report was confirmed nearby at lat: ${lat.toFixed(4)}, lng: ${lng.toFixed(4)}.`,
        created_at: new Date().toISOString()
      };
      mockRiskAssessments.push(ra);

      // Create notification
      await this.createNotification({
        title: `RISK INDEX INCREASED: ${closestZone.name}`,
        message: `Risk score elevated to ${newScore}/100 (${newSeverity.toUpperCase()}) due to rising cluster density.`,
        type: newSeverity === 'critical' ? 'danger' : 'warning'
      });
    }
  },

  // --- Risk Zones ---
  async getRiskZones(): Promise<RiskZone[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('risk_zones').select('*');
      if (!error && data) return data as RiskZone[];
    }
    return mockRiskZones;
  },

  async getRiskZoneById(id: string): Promise<RiskZone | null> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('risk_zones').select('*').eq('id', id).single();
      if (!error && data) return data as RiskZone;
    }
    return mockRiskZones.find(z => z.id === id) || null;
  },

  // --- Emergency Resources ---
  async getEmergencyResources(): Promise<EmergencyResource[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('emergency_resources').select('*');
      if (!error && data) return data as EmergencyResource[];
    }
    return mockEmergencyResources;
  },

  // --- Risk Assessments Log ---
  async getRiskAssessments(zoneId?: string): Promise<RiskAssessment[]> {
    if (isSupabaseEnabled && supabase) {
      let query = supabase.from('risk_assessments').select('*').order('created_at', { ascending: false });
      if (zoneId) query = query.eq('zone_id', zoneId);
      const { data, error } = await query;
      if (!error && data) return data as RiskAssessment[];
    }
    if (zoneId) {
      return mockRiskAssessments.filter(ra => ra.zone_id === zoneId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return [...mockRiskAssessments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createRiskAssessment(ra: Partial<RiskAssessment>): Promise<RiskAssessment> {
    const newRa: RiskAssessment = {
      id: crypto.randomUUID(),
      zone_id: ra.zone_id || 'z1',
      overall_score: ra.overall_score || 50,
      factors: ra.factors || { weather: 50, density: 50, exposure: 50, vulnerability: 50, road_closures: 50, historical: 50 },
      explanation: ra.explanation || 'Manual risk adjustment.',
      created_at: new Date().toISOString()
    };
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('risk_assessments').insert([newRa]).select().single();
      if (!error && data) return data as RiskAssessment;
    }
    mockRiskAssessments.push(newRa);
    return newRa;
  },

  // --- AI Interactions Log ---
  async getAiInteractions(): Promise<AiInteraction[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('ai_interactions').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as AiInteraction[];
    }
    return mockAiInteractions;
  },

  async createAiInteraction(ai: Partial<AiInteraction>): Promise<AiInteraction> {
    const newAi: AiInteraction = {
      id: crypto.randomUUID(),
      query: ai.query || '',
      response: ai.response || '',
      context: ai.context || null,
      provider: ai.provider || 'demo',
      created_at: new Date().toISOString()
    };
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('ai_interactions').insert([newAi]).select().single();
      if (!error && data) return data as AiInteraction;
    }
    mockAiInteractions.push(newAi);
    return newAi;
  },

  // --- Route Requests Log ---
  async getRouteRequests(): Promise<RouteRequest[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('route_requests').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as RouteRequest[];
    }
    return mockRouteRequests;
  },

  async createRouteRequest(rr: Partial<RouteRequest>): Promise<RouteRequest> {
    const newRr: RouteRequest = {
      id: crypto.randomUUID(),
      start_location: rr.start_location || 'Point A',
      start_latitude: rr.start_latitude || 25.7617,
      start_longitude: rr.start_longitude || -80.1918,
      end_location: rr.end_location || 'Point B',
      end_latitude: rr.end_latitude || 25.7617,
      end_longitude: rr.end_longitude || -80.1918,
      selected_route_type: rr.selected_route_type || 'fastest',
      routes_data: rr.routes_data || {},
      created_at: new Date().toISOString()
    };
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('route_requests').insert([newRr]).select().single();
      if (!error && data) return data as RouteRequest;
    }
    mockRouteRequests.push(newRr);
    return newRr;
  },

  // --- Notifications ---
  async getNotifications(): Promise<Notification[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Notification[];
    }
    return [...mockNotifications].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createNotification(notif: Partial<Notification>): Promise<Notification> {
    const newNotif: Notification = {
      id: crypto.randomUUID(),
      title: notif.title || 'System Notification',
      message: notif.message || '',
      type: notif.type || 'info',
      read: false,
      created_at: new Date().toISOString()
    };
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase.from('notifications').insert([newNotif]).select().single();
      if (!error && data) return data as Notification;
    }
    mockNotifications.push(newNotif);
    return newNotif;
  },

  async markNotificationsRead(): Promise<boolean> {
    if (isSupabaseEnabled && supabase) {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false);
      if (!error) return true;
    }
    mockNotifications.forEach(n => n.read = true);
    return true;
  },

  // --- Analytics data generator ---
  async getAnalytics(days: number = 7) {
    const incidents = await this.getIncidents();
    const reports = await this.getIncidentReports();
    const riskZones = await this.getRiskZones();

    // Group incidents by type
    const categories: Record<string, number> = {};
    incidents.forEach(i => {
      categories[i.type] = (categories[i.type] || 0) + 1;
    });

    // Group by severity
    const severities = {
      low: incidents.filter(i => i.severity === 'low').length,
      moderate: incidents.filter(i => i.severity === 'moderate').length,
      high: incidents.filter(i => i.severity === 'high').length,
      critical: incidents.filter(i => i.severity === 'critical').length,
    };

    // Simulated Incidents over time
    const timeSeries = [];
    const dateCursor = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Count incidents matching that day roughly
      // Seed with some stable historical fluctuation
      const seedRandomMultiplier = (d.getDate() % 5) + 2;
      const count = incidents.filter(inc => {
        const incDate = new Date(inc.created_at);
        return incDate.getDate() === d.getDate() && incDate.getMonth() === d.getMonth();
      }).length + seedRandomMultiplier;

      const citizenCount = reports.filter(rep => {
        const repDate = new Date(rep.created_at);
        return repDate.getDate() === d.getDate() && repDate.getMonth() === d.getMonth();
      }).length + Math.round(seedRandomMultiplier / 2);

      timeSeries.push({
        name: dayStr,
        Incidents: count,
        Reports: citizenCount,
        'Risk Average': Math.round(70 + (d.getDate() % 10) * 1.8),
      });
    }

    return {
      categories: Object.entries(categories).map(([name, value]) => ({ name, value })),
      severities: Object.entries(severities).map(([name, value]) => ({ name, value })),
      timeSeries,
      summary: {
        totalIncidents: incidents.length,
        activeIncidents: incidents.filter(i => i.status === 'active').length,
        criticalIncidents: incidents.filter(i => i.severity === 'critical').length,
        totalReports: reports.length,
        averageRiskScore: Math.round(riskZones.reduce((acc, z) => acc + z.risk_score, 0) / (riskZones.length || 1)),
        aiConfidence: 89 // average
      }
    };
  }
};
