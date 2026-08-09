-- CrisisMind AI Database Schema & Seed Script
-- Target: Supabase PostgreSQL (compatible with standard PostgreSQL 14+)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. TABLE DEFINITIONS
-- =========================================================================

-- Incidents table (Fused and monitored active hazards)
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL, -- CM-2026-XXXXX
    type VARCHAR(50) NOT NULL, -- Flood, Fire, Road Accident, Cyclone, Landslide, Industrial Accident, Extreme Heat, Infrastructure Failure
    location VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'moderate', 'high', 'critical')) NOT NULL,
    confidence INT CHECK (confidence BETWEEN 0 AND 100) DEFAULT 80,
    status VARCHAR(20) CHECK (status IN ('active', 'monitored', 'resolved')) DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Citizen Incident Reports
CREATE TABLE IF NOT EXISTS incident_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL, -- CM-REP-2026-XXXXX
    type VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'moderate', 'high', 'critical')) NOT NULL,
    description TEXT,
    contact_preference VARCHAR(50) DEFAULT 'anonymous',
    status VARCHAR(20) CHECK (status IN ('submitted', 'approved', 'rejected')) DEFAULT 'submitted',
    generated_incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk Zones
CREATE TABLE IF NOT EXISTS risk_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    radius DOUBLE PRECISION NOT NULL, -- In meters
    risk_score INT CHECK (risk_score BETWEEN 0 AND 100) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'moderate', 'high', 'critical')) NOT NULL,
    factors JSONB NOT NULL, -- Breakdown of weather, density, exposure, vulnerability, road closures
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Resources
CREATE TABLE IF NOT EXISTS emergency_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('hospital', 'fire station', 'police station', 'shelter', 'collection point')) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    distance DOUBLE PRECISION, -- Simulated distance from center/user in km
    availability VARCHAR(20) CHECK (availability IN ('available', 'limited', 'full')) DEFAULT 'available',
    capacity TEXT,
    contact_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessments history log
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES risk_zones(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    factors JSONB NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Interactions log
CREATE TABLE IF NOT EXISTS ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    context JSONB,
    provider VARCHAR(20) DEFAULT 'gemini',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Route Requests log
CREATE TABLE IF NOT EXISTS route_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_location VARCHAR(255),
    start_latitude DOUBLE PRECISION NOT NULL,
    start_longitude DOUBLE PRECISION NOT NULL,
    end_location VARCHAR(255),
    end_latitude DOUBLE PRECISION NOT NULL,
    end_longitude DOUBLE PRECISION NOT NULL,
    selected_route_type VARCHAR(20) DEFAULT 'fastest',
    routes_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('info', 'warning', 'danger', 'success')) DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 2. INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_incidents_coords ON incidents(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_reports_status ON incident_reports(status);
CREATE INDEX IF NOT EXISTS idx_resources_type ON emergency_resources(type);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(read) WHERE read = FALSE;

-- =========================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
-- Enable RLS on all tables
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- For hackathon simplicity, we allow public read access to dashboards,
-- and public insert for incident reports and feedback.
-- In production, write APIs should be gated behind auth.
CREATE POLICY "Enable read access for all users" ON incidents FOR SELECT USING (true);
CREATE POLICY "Enable write access for authenticated users" ON incidents FOR ALL USING (true);

CREATE POLICY "Enable insert for all users" ON incident_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all users" ON incident_reports FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON risk_zones FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON emergency_resources FOR SELECT USING (true);
CREATE POLICY "Enable select/insert for all users" ON notifications FOR ALL USING (true);
CREATE POLICY "Enable select/insert for all users" ON ai_interactions FOR ALL USING (true);
CREATE POLICY "Enable select/insert for all users" ON route_requests FOR ALL USING (true);

-- =========================================================================
-- 4. SEED DATA - URBAN FLOOD SIMULATION (Miami-centric coordinates: 25.7617, -80.1918)
-- =========================================================================

-- Seed Emergency Resources (25 total)
INSERT INTO emergency_resources (name, type, latitude, longitude, distance, availability, capacity, contact_phone) VALUES
-- Hospitals (5)
('Jackson Memorial Hospital', 'hospital', 25.7904, -80.2096, 4.2, 'limited', 'Trauma Level 1 - 90% Occupied', '305-585-1111'),
('Mercy Hospital', 'hospital', 25.7423, -80.2178, 3.8, 'available', 'Emergency Care - 65% Occupied', '305-854-4400'),
('Mount Sinai Medical Center', 'hospital', 25.8142, -80.1415, 7.5, 'available', 'General Beds - 70% Occupied', '305-674-2121'),
('Coral Gables Hospital', 'hospital', 25.7512, -80.2645, 7.6, 'full', 'ICU - At Capacity', '305-445-8461'),
('University of Miami Hospital', 'hospital', 25.7891, -80.2082, 4.1, 'available', 'General Beds - 55% Occupied', '305-689-5511'),

-- Fire Stations (5)
('Miami Fire Station 1 (EOC)', 'fire station', 25.7792, -80.1983, 2.1, 'available', '3 Rescue Units Active', '305-416-1600'),
('Miami Fire Station 2 (Downtown)', 'fire station', 25.7725, -80.1878, 1.3, 'available', '2 Rescue Engines Active', '305-416-1620'),
('Miami Fire Station 4 (Brickell)', 'fire station', 25.7621, -80.1952, 0.4, 'limited', '1 Engine Active, 1 Unit Deployed', '305-416-1640'),
('Miami Fire Station 9 (Coconut Grove)', 'fire station', 25.7285, -80.2415, 5.8, 'available', '2 Engines Active', '305-416-1690'),
('Miami Fire Station 12 (Little Havana)', 'fire station', 25.7773, -80.2241, 3.4, 'available', '2 Engines Active', '305-416-1720'),

-- Police Stations (5)
('Miami Police Department HQ', 'police station', 25.7801, -80.1995, 2.2, 'available', 'Tactical Operations Active', '305-603-6640'),
('MPD Brickell Substation', 'police station', 25.7601, -80.1931, 0.2, 'available', 'Patrols Active', '305-603-6680'),
('MPD Coconut Grove Station', 'police station', 25.7291, -80.2422, 5.9, 'available', 'Patrols Active', '305-603-6710'),
('MPD Little Havana Substation', 'police station', 25.7751, -80.2225, 3.2, 'available', 'Patrols Active', '305-603-6750'),
('Florida Highway Patrol Miami HQ', 'police station', 25.7835, -80.2612, 7.3, 'available', 'Road Safety Operations Active', '305-470-2500'),

-- Shelters (6)
('Miami Senior High School Shelter', 'shelter', 25.7745, -80.2295, 3.8, 'available', 'Capacity: 500/800 refugees', '305-649-9800'),
('Booker T. Washington School Shelter', 'shelter', 25.7885, -80.2032, 3.5, 'available', 'Capacity: 250/600 refugees', '305-324-8900'),
('Grapeland Heights Park Shelter', 'shelter', 25.7951, -80.2525, 6.8, 'limited', 'Capacity: 480/500 - Near Limit', '305-960-2920'),
('Shenandoah Park Community Center', 'shelter', 25.7585, -80.2285, 3.6, 'available', 'Capacity: 120/300 refugees', '305-859-2424'),
('Jose Marti Park Gymnasium', 'shelter', 25.7701, -80.2015, 1.8, 'full', 'Capacity: 400/400 - FULL', '305-960-2945'),
('Coconut Grove Elementary Gym', 'shelter', 25.7275, -80.2435, 6.0, 'available', 'Capacity: 50/400 refugees', '305-445-7876'),

-- Collection Points (4)
('Edison Community Supply Point', 'collection point', 25.8235, -80.2035, 7.2, 'available', 'Bottled water, sandbags, dry food', '305-758-1234'),
('Little Haiti Distribution Center', 'collection point', 25.8252, -80.1932, 7.3, 'available', 'Sandbags, medical kits, blankets', '305-758-5678'),
('Coral Way Distribution Hub', 'collection point', 25.7511, -80.2291, 3.7, 'limited', 'Limited sandbags left, water available', '305-859-9988'),
('Brickell Key Emergency Point', 'collection point', 25.7681, -80.1852, 1.1, 'full', 'Supplies exhausted, awaiting shipment', '305-555-0199');


-- Seed Incidents (30 total - Urban Flood Event)
INSERT INTO incidents (code, type, location, latitude, longitude, severity, confidence, status, description) VALUES
('CM-2026-00101', 'Flood', 'Brickell Ave & SE 12th St', 25.7618, -80.1917, 'critical', 95, 'active', 'Severe flash flooding. 3 feet of standing water reporting. Submerged vehicles. Residents advised to seek higher ground.'),
('CM-2026-00102', 'Flood', 'Biscayne Blvd & NE 15th St', 25.7895, -80.1872, 'high', 90, 'active', 'Coastal surge causing overflow. High tide is aggravating local drainage. Roads impassable for sedan vehicles.'),
('CM-2026-00103', 'Road Accident', 'I-95 Southbound near SW 8th St Exit', 25.7654, -80.2015, 'high', 88, 'active', 'Multi-car pileup in heavy rain. Structural impact to median barrier. FHP responding, 2 lanes blocked.'),
('CM-2026-00104', 'Flood', 'SW 8th St & SW 12th Ave (Little Havana)', 25.7645, -80.2132, 'moderate', 85, 'active', 'Street flooding up to curb level. Storm drains clogged with debris. Local businesses reporting minor water ingress.'),
('CM-2026-00105', 'Infrastructure Failure', 'Miami River Drawbridge (SE 2nd Ave)', 25.7712, -80.1925, 'critical', 92, 'active', 'Electrical failure due to water ingress. Bridge stuck in open position. Major arterial blockages across Downtown.'),
('CM-2026-00106', 'Flood', 'S Bayshore Dr & Darwin St (Coconut Grove)', 25.7298, -80.2395, 'high', 87, 'active', 'Bay surge water flooding coastal highway. Power lines down. Debris floating in street.'),
('CM-2026-00107', 'Flood', 'NE 2nd Ave & NE 36th St (Midtown)', 25.8105, -80.1922, 'moderate', 82, 'active', 'Localized urban flooding. High water on roads. Cars stalled. Local utility teams clearing drains.'),
('CM-2026-00108', 'Road Accident', 'Rickenbacker Causeway Midspan', 25.7485, -80.1652, 'moderate', 80, 'active', 'Two-car collision blocking eastbound lane. Debris cleanup in progress. Traffic backed up to mainland.'),
('CM-2026-00109', 'Landslide', 'Virginia Key Coastal Embankment', 25.7451, -80.1525, 'low', 75, 'active', 'Minor mudslide and embankment erosion along coastal path. Public works cordoning area off.'),
('CM-2026-00110', 'Infrastructure Failure', 'Substation Flooding (SW 3rd Ave)', 25.7685, -80.1982, 'critical', 96, 'active', 'FPL electrical substation flood warning. Danger of localized grid outage for 12,000 customers in Brickell and Downtown.'),
('CM-2026-00111', 'Flood', 'Edgewater Waterfront Walkway', 25.7981, -80.1865, 'moderate', 85, 'monitored', 'Sea walls breached. Sidewalks flooded. High tide retreating, monitoring water levels.'),
('CM-2026-00112', 'Industrial Accident', 'Port of Miami Fuel Depot Area', 25.7799, -80.1685, 'high', 89, 'active', 'Minor chemical runoff from container yard due to torrential rains. Environmental containment boom deployed.'),
('CM-2026-00113', 'Extreme Heat', 'Downtown Transit Hub', 25.7758, -80.1905, 'low', 98, 'resolved', 'Commuters reported heat exhaustion at bus terminal. Resolved after temporary AC relief bus deployed.'),
('CM-2026-00114', 'Road Accident', 'MacArthur Causeway Westbound', 25.7825, -80.1712, 'high', 91, 'active', 'Stalled shuttle bus in low-lying flooded section. Passengers evacuated. Tow trucks in route, heavy traffic delays.'),
('CM-2026-00115', 'Flood', 'Flagler St & NW 22nd Ave', 25.7741, -80.2312, 'moderate', 80, 'active', 'Localized flooding in low lying residential section. Drainage pump station operating at maximum capacity.'),
('CM-2026-00116', 'Flood', 'NW 7th St & NW 17th Ave', 25.7808, -80.2225, 'high', 86, 'active', 'Water depth 1.5 feet. Residential access limited. Fire rescue staged nearby in case of evacuation.'),
('CM-2026-00117', 'Fire', 'Apartment Building (Little Havana)', 25.7725, -80.2155, 'critical', 95, 'active', 'Electrical panel fire sparked by flood water contact. Building evacuated. Two fire engines on site.'),
('CM-2026-00118', 'Flood', 'Brickell Key Boulevard', 25.7692, -80.1831, 'high', 88, 'active', 'Only road leading to Brickell Key flooded. High-clearance vehicles only. Resident access restricted.'),
('CM-2026-00119', 'Infrastructure Failure', 'Sewer Main Leak (Coconut Grove)', 25.7325, -80.2325, 'moderate', 82, 'active', 'Storm sewer backflow detected. Wastewater leaking into surface runoff. Public health warning posted.'),
('CM-2026-00120', 'Cyclone', 'Key Biscayne Offshore Signals', 25.7015, -80.1585, 'moderate', 78, 'monitored', 'Tropical storm force winds registered at offshore buoy. Rain bands approaching coastal sectors.'),
('CM-2026-00121', 'Flood', 'NE 2nd Ave & NE 79th St', 25.8471, -80.1915, 'high', 87, 'active', 'Severe residential street flooding. Deep standing water. Localized canal overflow detected upstream.'),
('CM-2026-00122', 'Road Accident', 'Miami Design District (NE 40th St)', 25.8135, -80.1912, 'low', 90, 'resolved', 'Single car collision with light pole due to hydroplaning. Light pole secured, car towed.'),
('CM-2026-00123', 'Flood', 'Coral Way & SW 27th Ave', 25.7505, -80.2382, 'moderate', 84, 'active', 'Clogged storm drains leading to 1 foot of standing water in intersection. Utility crew in route.'),
('CM-2026-00124', 'Flood', 'SW 22nd St (Shenandoah)', 25.7538, -80.2228, 'low', 79, 'monitored', 'Moderate curb flooding. Yards flooded but residences dry. Rainfall intensity diminishing.'),
('CM-2026-00125', 'Infrastructure Failure', 'Wastewater Pump Station 3', 25.7915, -80.1895, 'high', 91, 'active', 'Backup generator failure in flooded facility. Emergency crew working on electrical systems.'),
('CM-2026-00126', 'Flood', 'NW 36th St & I-95 Underpass', 25.8101, -80.2085, 'critical', 94, 'active', 'Underpass flooded to depth of 4 feet. Multiple vehicles trapped. Water rising. Search and rescue deployed.'),
('CM-2026-00127', 'Flood', 'Biscayne Canal Spillway', 25.8612, -80.2012, 'high', 89, 'active', 'Canal levels approaching emergency levels. Spillway gate fully open. Residents downstream alerted.'),
('CM-2026-00128', 'Road Accident', 'SW 8th St & SW 27th Ave', 25.7648, -80.2381, 'moderate', 85, 'active', 'Collision between delivery truck and sedan. Debris in road. Traffic diverted.'),
('CM-2026-00129', 'Fire', 'Commercial Storefront (Coral Way)', 25.7515, -80.2185, 'critical', 92, 'active', 'Active commercial building fire. Heavy smoke visible. Multi-unit fire department response.'),
('CM-2026-00130', 'Flood', 'Coconut Grove Waterfront Marina', 25.7262, -80.2405, 'moderate', 80, 'monitored', 'Marina docks flooded. High tide peak has passed. Boats secure, minor structural damage to wooden piers.');


-- Seed Risk Zones (15 total)
INSERT INTO risk_zones (name, latitude, longitude, radius, risk_score, severity, factors) VALUES
('Brickell Critical Flood Corridor', 25.7618, -80.1917, 800, 91, 'critical', '{"weather": 95, "density": 88, "exposure": 92, "vulnerability": 85, "road_closures": 90, "historical": 89}'),
('Downtown Surge Area', 25.7795, -80.1875, 1000, 85, 'high', '{"weather": 95, "density": 85, "exposure": 80, "vulnerability": 78, "road_closures": 75, "historical": 82}'),
('Little Havana Lowland Sector', 25.7725, -80.2155, 900, 78, 'high', '{"weather": 90, "density": 80, "exposure": 85, "vulnerability": 82, "road_closures": 60, "historical": 74}'),
('Coconut Grove Coastal Belt', 25.7298, -80.2395, 1200, 82, 'high', '{"weather": 92, "density": 70, "exposure": 78, "vulnerability": 80, "road_closures": 85, "historical": 86}'),
('Edgewater Waterfront Zone', 25.7981, -80.1865, 800, 72, 'high', '{"weather": 92, "density": 75, "exposure": 80, "vulnerability": 65, "road_closures": 55, "historical": 70}'),
('I-95 SW Corridor (High Risk Transit)', 25.7654, -80.2015, 600, 88, 'high', '{"weather": 95, "density": 95, "exposure": 88, "vulnerability": 80, "road_closures": 85, "historical": 72}'),
('Midtown Localized Lows', 25.8105, -80.1922, 700, 64, 'moderate', '{"weather": 88, "density": 70, "exposure": 60, "vulnerability": 62, "road_closures": 50, "historical": 55}'),
('MacArthur Causeway Transit Zone', 25.7825, -80.1712, 1100, 68, 'moderate', '{"weather": 92, "density": 85, "exposure": 70, "vulnerability": 55, "road_closures": 70, "historical": 45}'),
('Rickenbacker Passage', 25.7485, -80.1652, 900, 58, 'moderate', '{"weather": 90, "density": 80, "exposure": 55, "vulnerability": 50, "road_closures": 60, "historical": 40}'),
('Virginia Key Coastal Fringe', 25.7451, -80.1525, 1300, 48, 'low', '{"weather": 90, "density": 20, "exposure": 35, "vulnerability": 45, "road_closures": 30, "historical": 50}'),
('Miami River Industrial Hub', 25.7712, -80.1925, 500, 89, 'high', '{"weather": 90, "density": 85, "exposure": 88, "vulnerability": 92, "road_closures": 85, "historical": 80}'),
('Coral Way Residential Sector', 25.7515, -80.2185, 1000, 76, 'high', '{"weather": 88, "density": 78, "exposure": 82, "vulnerability": 75, "road_closures": 60, "historical": 68}'),
('Design District Low Elevation', 25.8135, -80.1912, 600, 52, 'moderate', '{"weather": 85, "density": 70, "exposure": 50, "vulnerability": 52, "road_closures": 30, "historical": 48}'),
('Key Biscayne Northern Spit', 25.7015, -80.1585, 1500, 55, 'moderate', '{"weather": 92, "density": 35, "exposure": 60, "vulnerability": 58, "road_closures": 45, "historical": 62}'),
('Little Haiti Drainage Basin', 25.8252, -80.1932, 950, 74, 'high', '{"weather": 88, "density": 82, "exposure": 74, "vulnerability": 78, "road_closures": 55, "historical": 72}');


-- Seed Notifications (some read, some unread)
INSERT INTO notifications (title, message, type, read) VALUES
('CRITICAL FLOOD ALERT: Brickell Area', 'Severe flash flooding detected around Brickell Ave & SE 12th St. Water levels exceeding 3 feet. Evacuate low levels.', 'danger', false),
('INCIDENT SUBMITTED: CM-REP-0901', 'A citizen reported a sewer backflow in Coconut Grove. AI triage is evaluating.', 'info', false),
('INFRASTRUCTURE ALERT: River Drawbridge stuck', 'SE 2nd Ave drawbridge electrical outage. Impassable. Traffic rerouted.', 'danger', false),
('WEATHER WARNING: Flood Surge', 'High tide and offshore cyclone warnings active for Southeast Florida Coast.', 'warning', false),
('RESOURCE UPDATE: Jose Marti Shelter FULL', 'Jose Marti Park Shelter is at 100% capacity. New evacuees directed to Shenandoah Park.', 'warning', false),
('SYSTEM COMPILING: AI Model Active', 'AI Situation Copilot initialized with status: GEMINI COGNITION ENGINE ACTIVE.', 'success', true);

-- Seed Risk Assessments (10 historical records for Brickell Zone)
INSERT INTO risk_assessments (zone_id, overall_score, factors, explanation)
SELECT 
    id, 
    91, 
    '{"weather": 95, "density": 88, "exposure": 92, "vulnerability": 85, "road_closures": 90, "historical": 89}',
    'Risk increased to CRITICAL because multiple high-severity incidents are concentrated within a high-exposure zone while road accessibility has decreased.'
FROM risk_zones 
WHERE name = 'Brickell Critical Flood Corridor' 
LIMIT 1;

INSERT INTO risk_assessments (zone_id, overall_score, factors, explanation)
SELECT 
    id, 
    85, 
    '{"weather": 95, "density": 85, "exposure": 80, "vulnerability": 78, "road_closures": 75, "historical": 82}',
    'Risk levels remain HIGH due to high tide storm surge exceeding drainage capacity in low elevation urban corridors.'
FROM risk_zones 
WHERE name = 'Downtown Surge Area' 
LIMIT 1;
