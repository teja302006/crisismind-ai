# CrisisMind AI 
### AI-Powered Hyperlocal Disaster Intelligence & Emergency Response Platform
*"From fragmented signals to life-saving decisions."*

CrisisMind AI is an advanced, full-stack Emergency Operations Center (EOC) tactical dashboard. During urban emergencies (such as coastal floods, hurricane storm surges, extreme rain events, and major grid failures), vital information is scattered across citizen reports, sensor data, and infrastructure logs. 

CrisisMind AI aggregates these fragmented signals into unified geographic coordinates, projects a dynamic 0–100 hyperlocal risk index, suggests escape route parameters, and integrates **CrisisMind Copilot** (powered by Google Gemini API) to provide structured diagnostic explanation and strategic recommendations.

---

## 🌟 Key Features

* **Interactive EOC Map**: Built with **Leaflet** and **OpenStreetMap** using a dark tactical canvas. Visualizes incident clusters, active risk zones, shelters, fire dispatch hubs, and police substations.
* **CrisisMind Copilot**: A secure, server-side chatbot powered by the **Google Gemini API**. It processes the current spatial database context (active hazards, capacity levels, road blocks) to answer operator queries without inventing mock telemetry.
* **Demo AI Fallback Engine**: Fully functional deterministic engine that activates automatically if the Gemini API key is missing or encounters a rate limit, generating structured markdown situation reports from active data.
* **Hyperlocal Risk Engine**: Projecting 0–100 risk values by weighing live weather severity, hazard cluster densities, population exposure, and drainage network age.
* **Safe Routes Simulator**: Computes path coordinates comparing the Fastest Highways (identifying delays/closures), Lowest Risk Corridors (avoiding flood zones), and Civil Defense access corridors.
* **Citizen Reporting Portal**: Validated reporting interface allowing citizen signal entry, generating custom tracking codes (`CM-2026-XXXXX`), and triggering EOC alarms.
* **Real-time Event Simulation**: Active ticker updates hazard variables, resolves old alarms, and pushes mock citizen alerts to keep the EOC interface moving.

---

## 🏗️ System Architecture

```
                 +---------------------------+
                 |    React Frontend (Vite)  |
                 +-------------+-------------+
                               |
                               | (CORS/JSON REST)
                               v
                 +-------------+-------------+
                 |    Express API Backend    |
                 +-------------+-------------+
                               |
            +------------------+------------------+
            |                                     |
            v                                     v
+-----------+-----------+             +-----------+-----------+
|    AI Service Layer   |             |   Database Service    |
+-----------+-----------+             +-----------+-----------+
            |                                     |
    +-------+-------+                     +-------+-------+
    |               |                     |               |
    v               v                     v               v
+---+---+       +---+---+             +---+---+       +---+---+
|Gemini |       | Demo  |             |Supa-  |       |Memory |
|API    |       | AI    |             |base   |       |Cache  |
|Engine |       |Engine |             |Client |       |Engine |
+-------+       +-------+             +-------+       +-------+
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory.

```bash
# Preferred AI Provider ('gemini' or 'demo')
AI_PROVIDER=gemini

# Google Gemini API credential key
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase database keys (leave blank to run in persistent memory/local mode)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 🚀 Local Development

### 1. Installation
Install all backend and frontend dependencies:
```bash
npm install
```

### 2. Run in Development Mode
Launches Vite frontend server (`localhost:5173`) and Express backend API (`localhost:3001`) concurrently:
```bash
npm run dev
```

### 3. Verify TypeScript & Production Build
Compiles frontend React scripts and outputs a optimized deployment directory inside `/dist`:
```bash
npm run build
```

---

## 💾 Database Configuration (Supabase PostgreSQL)

If you are using a live Supabase database instance:
1. Connect to your Supabase project SQL Editor.
2. Open and copy the contents of the [`supabase/schema.sql`](./supabase/schema.sql) file.
3. Run the SQL script. This creates:
   * Tables: `incidents`, `incident_reports`, `risk_zones`, `emergency_resources`, `notifications`, `ai_interactions`, etc.
   * Proper geospatial B-tree and coordinate indexes.
   * Row Level Security (RLS) policies allowing public read-access.
   * Default seed parameters populated with 30 mock incidents and 25 resources.
4. Input your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env` variables.

If these credentials are left blank, **CrisisMind AI automatically boots using the local memory cache database engine**, seeded with the exact same 30 incidents, 15 risk zones, and 25 resources.

---

## 🤖 Gemini API Security & AI Modes

* **Absolute Safety**: The `GEMINI_API_KEY` is contained strictly on the server-side (`api/services/aiService.ts`) and is never sent to the browser, compiled into client JS bundles, or exposed in public repos.
* **Cognitive Fallback**: If the Gemini API key is missing or fails, the interface automatically indicates:
  `COGNITION: DEMO ENGINE`
  The Copilot Chat remains operational, answering queries using our spatial geometry metrics and risk tables.

---

## 🌐 Vercel Deployment

This codebase is pre-configured for a clean Vercel monorepo deployment:
1. Push the code to a Git repository (GitHub/GitLab).
2. Connect the repository to Vercel.
3. Configure the **Build & Development Settings**:
   * Framework Preset: **Vite**
   * Output Directory: `dist`
4. Add the Environment Variables:
   * `GEMINI_API_KEY` (Your Google Gemini credential)
   * `AI_PROVIDER` (Set to `gemini`)
   * `VITE_SUPABASE_URL` (Optional)
   * `VITE_SUPABASE_ANON_KEY` (Optional)
5. Click **Deploy**. Vercel will automatically compile the React assets and map `/api/*` requests to the serverless function handler in `/api/index.ts`.

---

## 🛠️ Troubleshooting

* **Map is not showing tiles properly**: Ensure you have an active internet connection as Leaflet fetches map tile graphics directly from OpenStreetMap (`cartocdn`).
* **Express server port conflict**: If port 3001 is already in use by another app, configure the port in your environment: `PORT=3002 npm run dev`.
