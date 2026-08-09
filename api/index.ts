import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { dbService } from './services/dbService';
import { aiService } from './services/aiService';
import { riskEngine } from './services/riskEngine';
import { routingEngine } from './services/routingEngine';

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Normalize Vercel serverless function paths
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.url.startsWith('/api/index.ts')) {
    req.url = req.url.replace('/api/index.ts', '');
  }
  next();
});

// Global logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// Create base sub-router to support dual prefix mounting
const router = express.Router();

// --- Incidents ---
router.get('/incidents', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const incidents = await dbService.getIncidents();
    res.json(incidents);
  } catch (err) {
    next(err);
  }
});

router.get('/incidents/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const incident = await dbService.getIncidentById(req.params.id);
    if (!incident) {
      res.status(404).json({ error: 'Incident not found' });
      return;
    }
    res.json(incident);
  } catch (err) {
    next(err);
  }
});

router.post('/incidents', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, location, latitude, longitude, severity, description, confidence } = req.body;
    if (!type || !location || !latitude || !longitude || !severity) {
      res.status(400).json({ error: 'Missing required parameters: type, location, latitude, longitude, severity' });
      return;
    }
    const newInc = await dbService.createIncident({ type, location, latitude, longitude, severity, description, confidence });
    res.status(201).json(newInc);
  } catch (err) {
    next(err);
  }
});

// --- Reports (Citizen reporting with AI triage simulation) ---
router.post('/reports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, location, latitude, longitude, severity, description, contactPreference } = req.body;
    
    // Field validations
    if (!type || !location || !latitude || !longitude || !severity || !description) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const latVal = parseFloat(latitude);
    const lngVal = parseFloat(longitude);
    if (isNaN(latVal) || isNaN(lngVal)) {
      res.status(400).json({ error: 'Invalid coordinates' });
      return;
    }

    const report = await dbService.createIncidentReport({
      type,
      location,
      latitude: latVal,
      longitude: lngVal,
      severity,
      description,
      contact_preference: contactPreference || 'anonymous'
    });

    res.status(201).json({
      message: 'REPORT RECEIVED',
      reportId: report.id,
      code: report.code,
      generatedIncidentId: report.generated_incident_id,
      status: 'AI ANALYSIS COMPLETE'
    });
  } catch (err) {
    next(err);
  }
});

// --- Risk Analysis ---
router.get('/risk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng } = req.query;
    const riskZones = await dbService.getRiskZones();

    if (lat && lng) {
      const latVal = parseFloat(lat as string);
      const lngVal = parseFloat(lng as string);
      
      if (!isNaN(latVal) && !isNaN(lngVal)) {
        const customCalculation = await riskEngine.calculateZoneRisk(latVal, lngVal);
        res.json({
          zones: riskZones,
          localCalculation: customCalculation
        });
        return;
      }
    }

    // Default aggregate statistics
    res.json({
      zones: riskZones,
      weatherBaseline: 92,
      summary: 'Extreme flooding events overlapping drainage bottlenecks.'
    });
  } catch (err) {
    next(err);
  }
});

// --- Emergency Resources ---
router.get('/resources', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await dbService.getEmergencyResources();
    res.json(resources);
  } catch (err) {
    next(err);
  }
});

// --- Safe Routes ---
router.post('/routes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startLat, startLng, endLat, endLng } = req.body;
    if (!startLat || !startLng || !endLat || !endLng) {
      res.status(400).json({ error: 'Missing coordinates for routing' });
      return;
    }

    const routes = await routingEngine.calculateRoutes(
      parseFloat(startLat),
      parseFloat(startLng),
      parseFloat(endLat),
      parseFloat(endLng)
    );

    // Save request log
    await dbService.createRouteRequest({
      start_latitude: parseFloat(startLat),
      start_longitude: parseFloat(startLng),
      end_latitude: parseFloat(endLat),
      end_longitude: parseFloat(endLng),
      routes_data: routes
    });

    res.json(routes);
  } catch (err) {
    next(err);
  }
});

// --- CrisisMind Copilot (AI chat assistant) ---
router.post('/copilot', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, context } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const result = await aiService.queryCopilot(query, context);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// --- Analytics ---
router.get('/analytics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = parseInt(req.query.days as string || '7');
    const analytics = await dbService.getAnalytics(days);
    res.json(analytics);
  } catch (err) {
    next(err);
  }
});

// --- Notifications ---
router.get('/notifications', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await dbService.getNotifications();
    res.json(notifications);
  } catch (err) {
    next(err);
  }
});

router.post('/notifications/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await dbService.markNotificationsRead();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Mount the router on both /api (local dev proxy) and root / (Vercel serverless function root)
app.use('/api', router);
app.use('/', router);

// =========================================================================
// ERROR HANDLING MIDDLEWARE
// =========================================================================

// Page not found error
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error catcher
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
}
export default app;
