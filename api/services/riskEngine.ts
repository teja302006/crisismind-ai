import { dbService } from './dbService';
import { Incident } from '../types';

export interface RiskBreakdown {
  weather: number;
  density: number;
  exposure: number;
  vulnerability: number;
  road_closures: number;
  historical: number;
  overall: number;
}

export const riskEngine = {
  // Haversine distance formula
  getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  },

  async calculateZoneRisk(lat: number, lng: number): Promise<RiskBreakdown> {
    const incidents = await dbService.getIncidents();
    const activeIncidents = incidents.filter(i => i.status === 'active');

    // 1. Calculate incident density (within 3km radius)
    let nearbyWeightSum = 0;
    let roadClosuresCount = 0;

    activeIncidents.forEach(inc => {
      const distance = this.getDistanceKm(lat, lng, inc.latitude, inc.longitude);
      if (distance <= 3) {
        // Closer incidents weigh more
        const proximityFactor = Math.max(0, 1 - (distance / 3));
        
        let severityWeight = 10;
        if (inc.severity === 'critical') severityWeight = 30;
        else if (inc.severity === 'high') severityWeight = 20;
        else if (inc.severity === 'moderate') severityWeight = 15;

        nearbyWeightSum += severityWeight * proximityFactor;

        // Check if road block
        if (inc.type === 'Road Accident' || inc.type === 'Infrastructure Failure' || (inc.type === 'Flood' && inc.severity === 'critical')) {
          roadClosuresCount += proximityFactor;
        }
      }
    });

    // Normalize values to 0-100 scales
    const density = Math.min(100, Math.round(nearbyWeightSum * 2));
    const road_closures = Math.min(100, Math.round(roadClosuresCount * 30));

    // 2. Weather Severity (Simulating heavy rainfall context: 92%)
    // If there are many flood incidents, we raise weather factor
    const floodIncidents = activeIncidents.filter(i => i.type === 'Flood');
    const weather = Math.min(100, 75 + Math.round(floodIncidents.length * 0.8));

    // 3. Static/Slightly dynamic factors based on locations
    // We can simulate higher vulnerability & exposure closer to downtown (25.7795, -80.1875)
    const distToCenter = this.getDistanceKm(lat, lng, 25.7795, -80.1875);
    
    // Higher exposure in densely populated downtown/brickell
    const exposure = Math.max(30, Math.min(95, Math.round(95 - (distToCenter * 6))));
    
    // Older drainage networks in Downtown / Little Havana are more vulnerable
    const vulnerability = Math.max(40, Math.min(90, Math.round(85 - (distToCenter * 4) + (lat * 1000 % 10))));

    // Historical risk based on coordinates
    const historical = Math.max(35, Math.min(92, Math.round(88 - (distToCenter * 5) + (lng * 1000 % 12))));

    // Overall risk index is a weighted average
    // Weather: 25%, Density: 25%, Road Closures: 15%, Vulnerability: 15%, Exposure: 10%, Historical: 10%
    const weightedSum = 
      (weather * 0.25) + 
      (density * 0.25) + 
      (road_closures * 0.15) + 
      (vulnerability * 0.15) + 
      (exposure * 0.10) + 
      (historical * 0.10);

    const overall = Math.min(100, Math.max(10, Math.round(weightedSum)));

    return {
      weather,
      density,
      exposure,
      vulnerability,
      road_closures,
      historical,
      overall
    };
  }
};
