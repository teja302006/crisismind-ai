import { Incident } from '../types';
import { dbService } from './dbService';

export interface RouteDetail {
  name: string;
  type: 'fastest' | 'lowest_risk' | 'emergency';
  distanceKm: number;
  durationMinutes: number;
  riskScore: number;
  safetyRating: 'clear' | 'monitored' | 'danger';
  description: string;
  coordinates: [number, number][]; // Lat, Lng nodes
}

export const routingEngine = {
  // Interpolates coordinates between start and end with a given curvature offset
  generatePath(
    start: [number, number],
    end: [number, number],
    curved: number = 0,
    steps: number = 20
  ): [number, number][] {
    const coords: [number, number][] = [];
    const [lat1, lng1] = start;
    const [lat2, lng2] = end;

    // Direct midpoints
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Linear interpolation
      let lat = lat1 + (lat2 - lat1) * t;
      let lng = lng1 + (lng2 - lng1) * t;

      // Add curvature perpendicular to the line direction
      if (curved !== 0) {
        const perpLat = -(lng2 - lng1);
        const perpLng = lat2 - lat1;
        const curveFactor = Math.sin(t * Math.PI) * curved;
        
        lat += perpLat * curveFactor;
        lng += perpLng * curveFactor;
      }

      // Add a tiny bit of random jitter so it looks like real roads
      if (i > 0 && i < steps) {
        lat += (Math.sin(i * 12.34) * 0.0003);
        lng += (Math.cos(i * 43.21) * 0.0003);
      }

      coords.push([lat, lng]);
    }
    return coords;
  },

  async calculateRoutes(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<RouteDetail[]> {
    const start: [number, number] = [startLat, startLng];
    const end: [number, number] = [endLat, endLng];
    
    // Base distance
    const baseDist = Math.sqrt(Math.pow(endLat - startLat, 2) + Math.pow(endLng - startLng, 2)) * 111; // Approx km

    // Fetch active incidents to assess route conflict
    const incidents = await dbService.getIncidents();
    const activeIncidents = incidents.filter(i => i.status === 'active');

    // 1. FASTEST ROUTE: Direct pathway, might intersect risk zones / incidents
    const fastestCoords = this.generatePath(start, end, 0.05);
    
    // Evaluate if this path crosses near any critical flood incidents
    let fastestRiskScore = 30;
    let incidentBlocks = 0;

    fastestCoords.forEach(([lat, lng]) => {
      activeIncidents.forEach(inc => {
        const dist = Math.sqrt(Math.pow(inc.latitude - lat, 2) + Math.pow(inc.longitude - lng, 2)) * 111;
        if (dist < 0.6) {
          const hazardImpact = inc.severity === 'critical' ? 25 : inc.severity === 'high' ? 15 : 5;
          fastestRiskScore += hazardImpact;
          if (inc.severity === 'critical' || inc.type === 'Infrastructure Failure') {
            incidentBlocks++;
          }
        }
      });
    });

    fastestRiskScore = Math.min(100, fastestRiskScore);
    const fastestBlocked = incidentBlocks > 1;

    // 2. LOWEST RISK ROUTE: Curves wide to bypass incidents
    // We curve opposite to fastest path offset
    const lowestRiskCoords = this.generatePath(start, end, -0.15);
    let lowestRiskScore = 15;
    lowestRiskCoords.forEach(([lat, lng]) => {
      activeIncidents.forEach(inc => {
        const dist = Math.sqrt(Math.pow(inc.latitude - lat, 2) + Math.pow(inc.longitude - lng, 2)) * 111;
        if (dist < 0.6) {
          // Bypassing should mean much lower impact
          lowestRiskScore += inc.severity === 'critical' ? 5 : 2;
        }
      });
    });
    lowestRiskScore = Math.min(45, lowestRiskScore);

    // 3. EMERGENCY ACCESS ROUTE: Uses expressways/authorized state lanes
    const emergencyCoords = this.generatePath(start, end, 0.25);
    let emergencyRiskScore = 20;

    return [
      {
        name: 'Fastest Route (Biscayne Way)',
        type: 'fastest',
        distanceKm: Math.round(baseDist * 10) / 10,
        durationMinutes: Math.round(baseDist * 3 + (fastestBlocked ? 40 : 5)),
        riskScore: fastestRiskScore,
        safetyRating: fastestRiskScore >= 75 ? 'danger' : fastestRiskScore >= 45 ? 'monitored' : 'clear',
        description: fastestBlocked 
          ? 'Heavy flooding and blockage detected on Brickell Ave intersection. Expect delays up to 45 mins.'
          : 'Direct route. Minor water pooling on road surface. High-clearance vehicles recommended.',
        coordinates: fastestCoords
      },
      {
        name: 'Lowest Risk Route (I-95 Avoidance)',
        type: 'lowest_risk',
        distanceKm: Math.round(baseDist * 1.3 * 10) / 10,
        durationMinutes: Math.round(baseDist * 1.3 * 2.5),
        riskScore: lowestRiskScore,
        safetyRating: 'clear',
        description: 'Bypasses low-lying coastal flooding zones. Fully open with active storm drain pumps operational.',
        coordinates: lowestRiskCoords
      },
      {
        name: 'Emergency Access Route (Civil Defense)',
        type: 'emergency',
        distanceKm: Math.round(baseDist * 1.1 * 10) / 10,
        durationMinutes: Math.round(baseDist * 1.1 * 1.8),
        riskScore: emergencyRiskScore,
        safetyRating: 'monitored',
        description: 'Restricted access corridor for registered rescue vehicles and ambulances. Sandbag barricade clearance required.',
        coordinates: emergencyCoords
      }
    ];
  }
};
