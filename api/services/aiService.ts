import { GoogleGenerativeAI } from '@google/generative-ai';
import { dbService } from './dbService';
import { Incident, RiskZone, EmergencyResource } from '../types';

const apiProvider = process.env.AI_PROVIDER || 'gemini';
const apiKey = process.env.GEMINI_API_KEY || '';

// Safely initialize Gemini
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.error('Failed to initialize GoogleGenerativeAI client:', err);
  }
}

export interface CopilotContext {
  activeZoneId?: string;
  activeIncidentId?: string;
  userLat?: number;
  userLng?: number;
  routeSelected?: any;
}

export const aiService = {
  async queryCopilot(query: string, context: CopilotContext = {}): Promise<{ response: string; provider: 'gemini' | 'demo' }> {
    // 1. Fetch current application state as context
    const incidents = await dbService.getIncidents();
    const riskZones = await dbService.getRiskZones();
    const resources = await dbService.getEmergencyResources();
    const activeIncidents = incidents.filter(i => i.status === 'active');
    
    const structuredContext = {
      activeIncidentsCount: activeIncidents.length,
      criticalIncidentsCount: activeIncidents.filter(i => i.severity === 'critical').length,
      highIncidentsCount: activeIncidents.filter(i => i.severity === 'high').length,
      totalRiskZones: riskZones.length,
      criticalRiskZones: riskZones.filter(z => z.severity === 'critical').length,
      highRiskZones: riskZones.filter(z => z.severity === 'high').length,
      incidentsList: activeIncidents.slice(0, 10).map(i => ({
        code: i.code,
        type: i.type,
        location: i.location,
        severity: i.severity,
        confidence: i.confidence,
        description: i.description
      })),
      riskZonesList: riskZones.map(z => ({
        id: z.id,
        name: z.name,
        risk_score: z.risk_score,
        severity: z.severity,
        factors: z.factors
      })),
      resourcesCount: resources.length,
      limitedResources: resources.filter(r => r.availability === 'limited').map(r => r.name),
      fullResources: resources.filter(r => r.availability === 'full').map(r => r.name),
      selectedRoute: context.routeSelected || null,
      activeZoneId: context.activeZoneId || null,
      activeIncidentId: context.activeIncidentId || null,
      simulationMode: true
    };

    // If Gemini is available and configured, use it
    if (apiProvider === 'gemini' && genAI && apiKey) {
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: `You are CrisisMind Copilot, an emergency intelligence decision-support assistant.
Use ONLY the structured data supplied by the application context to construct responses.

Never invent:
* incidents that are not in the context
* locations that are not in the context
* road closures or infrastructure blocks not in the context
* emergency facilities not in the context
* live weather or forecasts not in the context
* official government instructions
* casualty numbers
* real-time conditions

If information is not present in the supplied context, explicitly say that it is unavailable.
If the application is operating in simulation mode (which it currently is), clearly identify the incident and risk data as simulated.
Provide general, safety-oriented decision support and always encourage users to follow official emergency authorities.
Respond using clean GitHub Markdown formatting.`
        });

        const prompt = `
Application Data Context:
\`\`\`json
${JSON.stringify(structuredContext, null, 2)}
\`\`\`

User Query:
"${query}"

Provide your professional decision support response:`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        if (responseText) {
          // Log interaction
          await dbService.createAiInteraction({ query, response: responseText, context: structuredContext, provider: 'gemini' });
          return { response: responseText, provider: 'gemini' };
        }
      } catch (err) {
        console.error('Gemini API call failed, falling back to Demo AI:', err);
      }
    }

    // Fall back to Demo AI Mode
    const demoResponse = this.generateDemoAiResponse(query, structuredContext, incidents, riskZones, resources);
    await dbService.createAiInteraction({ query, response: demoResponse, context: structuredContext, provider: 'demo' });
    return { response: demoResponse, provider: 'demo' };
  },

  generateDemoAiResponse(
    query: string, 
    ctx: any, 
    incidents: Incident[], 
    riskZones: RiskZone[], 
    resources: EmergencyResource[]
  ): string {
    const cleanQuery = query.toLowerCase();

    // 1. QUESTION: Why is this zone high/critical risk?
    if (cleanQuery.includes('why') && (cleanQuery.includes('risk') || cleanQuery.includes('zone') || cleanQuery.includes('area'))) {
      // Find active zone or default to Brickell (z1)
      let targetZone = riskZones.find(z => z.id === ctx.activeZoneId);
      if (!targetZone) {
        // Find highest risk zone
        targetZone = [...riskZones].sort((a, b) => b.risk_score - a.risk_score)[0];
      }

      if (targetZone) {
        const factors = targetZone.factors;
        return `### Risk Intelligence Report: ${targetZone.name}
**Assessed Risk Level:** ${targetZone.risk_score}/100 (${targetZone.severity.toUpperCase()})
**Status:** SIMULATED EMERGENCIES DETECTED

#### Primary Drivers of Risk:
1. **Weather Severity (${factors.weather}%)**: Torrential rain bands from the simulated coastal storm front are overwhelming the canal networks.
2. **Incident Cluster Density (${factors.density}%)**: Multiple high-severity incidents are concentrated within this zone's immediate radius.
3. **Infrastructure Vulnerability (${factors.vulnerability}%)**: Low-lying electrical systems and sewage drainage pumps are operating at capacity or experiencing critical outages.
4. **Road Accessibility Obstructions (${factors.road_closures}%)**: Major closures (such as flooded underpasses or stuck drawbridges) have lowered evacuation clearance capacity.

#### Risk Analysis summary:
The risk index is **${targetZone.risk_score}/100** because active flood incidents are concentrated in high-density urban areas. High tides are blocking surface discharge channels, causing water to pool rapidly.

> [!WARNING]
> **SIMULATION ADVISORY**: This analysis is generated from simulated hackathon data. Avoid low-lying structures in this corridor. Always follow instructions from local law enforcement and civil defense authorities.`;
      }
    }

    // 2. QUESTION: What is happening near this area?
    if (cleanQuery.includes('what') && (cleanQuery.includes('happening') || cleanQuery.includes('near') || cleanQuery.includes('here') || cleanQuery.includes('around'))) {
      const activeCount = ctx.activeIncidentsCount;
      const criticalCount = ctx.criticalIncidentsCount;
      
      let nearestIncidents = incidents.filter(i => i.status === 'active').slice(0, 3);
      let listMarkup = nearestIncidents.map(i => `- **[${i.code}] ${i.type}** at *${i.location}* (Severity: **${i.severity.toUpperCase()}**) - ${i.description}`).join('\n');

      return `### Situation Briefing: General Area Status
**Simulation Status:** active Urban Flood Event
**Active Incidents Detected:** ${activeCount} (including ${criticalCount} critical alerts)

#### Recent Incident Feed:
${listMarkup || '- No active hazards registered in the immediate quadrant.'}

#### Environmental Summary:
Canals are flowing at emergency levels, and road gridlock is high due to infrastructure failures. High water depths are reported on multiple thoroughfares.

> [!IMPORTANT]
> Seek high ground and stay off roads to allow emergency services access. This is a hackathon simulation dashboard and does not represent live emergency feeds.`;
    }

    // 3. QUESTION: Show me important incidents
    if (cleanQuery.includes('important') || cleanQuery.includes('critical') || cleanQuery.includes('show') && cleanQuery.includes('incident')) {
      const criticalIncidents = incidents.filter(i => i.severity === 'critical' && i.status === 'active');
      const highIncidents = incidents.filter(i => i.severity === 'high' && i.status === 'active');
      const topList = [...criticalIncidents, ...highIncidents].slice(0, 5);

      let listMarkup = topList.map(i => `1. **${i.code} - ${i.type}** (*${i.location}*)
   - **Severity:** \`${i.severity.toUpperCase()}\` | **Confidence:** ${i.confidence}%
   - **Details:** ${i.description}`).join('\n\n');

      return `### Prioritized Incident Triage (Severity Order)
The following critical and high-priority hazard incidents currently require immediate monitoring:

${listMarkup || 'No critical incidents are currently active.'}

#### Strategic Priorities:
- dispatching rescue units to flooded underpasses with stranded motorists.
- Restoring electrical grid stability around flooded substations.
- Routing traffic away from jammed drawbridges.

> [!NOTE]
> All incident items above are simulated.`;
    }

    // 4. QUESTION: What emergency resources are nearby?
    if (cleanQuery.includes('resource') || cleanQuery.includes('hospital') || cleanQuery.includes('station') || cleanQuery.includes('shelter')) {
      const hospitals = resources.filter(r => r.type === 'hospital').slice(0, 2);
      const fire = resources.filter(r => r.type === 'fire station').slice(0, 2);
      const shelters = resources.filter(r => r.type === 'shelter' && r.availability !== 'full').slice(0, 2);

      let markup = `### Critical Emergency Resources Map
Below are nearby facilities matching current location proximity:

#### Medical & Traumatic Centers:
${hospitals.map(h => `- **${h.name}** | Capacity: *${h.capacity}* | Status: \`${h.availability.toUpperCase()}\` | Phone: ${h.contact_phone}`).join('\n')}

#### First Responders:
${fire.map(f => `- **${f.name}** | Status: \`${f.availability.toUpperCase()}\` | Phone: ${f.contact_phone}`).join('\n')}

#### Evacuation Shelters (With Capacity):
${shelters.map(s => `- **${s.name}** | Capacity: *${s.capacity}* | Status: \`${s.availability.toUpperCase()}\``).join('\n')}

> [!IMPORTANT]
> If you are experiencing a life-threatening emergency, call 911 immediately. This platform is for demonstration and decision support only.`;

      return markup;
    }

    // 5. QUESTION: Explain this incident
    if (cleanQuery.includes('explain') || cleanQuery.includes('detail') || cleanQuery.includes('describe')) {
      let targetInc = incidents.find(i => i.id === ctx.activeIncidentId);
      if (!targetInc) {
        // Get the first critical incident
        targetInc = incidents.find(i => i.severity === 'critical');
      }

      if (targetInc) {
        const nearbyRes = resources.filter(r => r.type === 'hospital' || r.type === 'fire station').slice(0, 2);
        return `### Incident Assessment: ${targetInc.code} (${targetInc.type})
**Location:** ${targetInc.location}
**Threat Severity:** ${targetInc.severity.toUpperCase()}
**Confidence Level:** ${targetInc.confidence}%

#### Hazard Profile:
- **Description:** ${targetInc.description}
- **Status:** ${targetInc.status.toUpperCase()}

#### Recommended Response Priorities:
1. **Evacuation & Security Cordons**: Police units should block entry to this intersection.
2. **Rescue Dispatch**: Local Fire Station (${nearbyRes[0]?.name || 'Station 4'}) is the closest dispatch point.
3. **Medical Routing**: Direct casualties to ${nearbyRes[1]?.name || 'Jackson Memorial Hospital'}.

> [!NOTE]
> This is a simulated disaster analysis.`;
      }
    }

    // 6. Generic Fallback Response
    return `### CrisisMind Decision Support
I am operating in **DEMO AI MODE** because the Gemini API key was not configured or could not be reached. 

#### Current Situation Summary:
- **Active Alerts**: There are **${ctx.activeIncidentsCount}** active incidents across the city.
- **High Risk Corridors**: **${ctx.highRiskZones + ctx.criticalRiskZones}** zones are exhibiting high/critical risk.
- **Top Threat**: Flooding in low-lying urban streets caused by coastal surges.

How can I help you navigate the command center? Try asking one of these preset questions:
- *What is happening near this area?*
- *Why is this zone high risk?*
- *Show me the important incidents.*
- *What emergency resources are nearby?*
- *Explain this incident.*

> [!IMPORTANT]
> CrisisMind AI is a decision-support prototype. It does not replace official advice from emergency services or government bulletins.`;
  }
};
