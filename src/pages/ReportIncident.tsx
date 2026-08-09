import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { useNotifications } from '../context/NotificationContext';
import { 
  FileEdit, 
  Send, 
  ShieldCheck, 
  MapPin, 
  AlertOctagon, 
  HelpCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export const ReportIncident: React.FC = () => {
  const { showToast } = useNotifications();

  // Form State
  const [type, setType] = useState('Flood');
  const [locationName, setLocationName] = useState('');
  const [lat, setLat] = useState('25.7617');
  const [lng, setLng] = useState('-80.1918');
  const [severity, setSeverity] = useState('moderate');
  const [description, setDescription] = useState('');
  const [contactPref, setContactPref] = useState('anonymous');

  // Execution States
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code: string; status: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Quick coordinate presets
  const handleSetCoordinates = (latitude: string, longitude: string, name: string) => {
    setLat(latitude);
    setLng(longitude);
    setLocationName(name);
    showToast('COORDINATES SET', `Locked target to: ${name}`, 'info');
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!locationName.trim()) tempErrors.locationName = 'Location name is required';
    if (!description.trim()) tempErrors.description = 'Provide a brief hazard description';
    
    const latVal = parseFloat(lat);
    const lngVal = parseFloat(lng);
    if (isNaN(latVal) || latVal < -90 || latVal > 90) tempErrors.lat = 'Invalid Latitude (-90 to 90)';
    if (isNaN(lngVal) || lngVal < -180 || lngVal > 180) tempErrors.lng = 'Invalid Longitude (-180 to 180)';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await apiService.submitReport({
        type,
        location: locationName,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        severity,
        description,
        contactPreference: contactPref
      });

      setResult({
        code: response.code,
        status: response.status
      });

      showToast(
        'INCIDENT REPORT REGISTERED',
        `Assigned tracking ID: ${response.code}. Triage status: APPROVED.`,
        severity === 'critical' ? 'danger' : 'success'
      );

      // Clear description
      setDescription('');
    } catch (err: any) {
      console.error(err);
      showToast('SUBMISSION ERROR', err.message || 'Failed to submit report.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const hazardTypes = [
    'Flood', 'Fire', 'Road Accident', 'Cyclone', 'Landslide', 'Industrial Accident', 'Extreme Heat', 'Infrastructure Failure'
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto min-h-full pb-20 lg:pb-6 text-left">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">Citizen Incident Reporting</h1>
          <p className="text-xs text-slate-400">File a hyperlocal disaster alert. Reports are triaged by EOC intelligence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Form panel (Left 2/3) */}
        <div className="md:col-span-2 space-y-4">
          {result ? (
            /* SUCCESS PANEL */
            <div className="glass-panel p-6 text-center flex flex-col items-center justify-center gap-4 animate-slide-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-300">REPORT RECEIVED</h3>
                <p className="text-xs text-slate-500">Tracking Code:</p>
                <code className="text-base font-mono font-bold text-white px-3 py-1 bg-slate-950 border border-slate-800 rounded">
                  {result.code}
                </code>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-[11px] font-mono text-emerald-400">
                STATUS: {result.status}
              </div>

              <p className="text-[11px] text-slate-500 leading-normal max-w-xs">
                Your report has been analyzed. The EOC Dashboard risk indices and active incident lists have been updated.
              </p>

              <button
                onClick={() => setResult(null)}
                className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
              >
                File Another Report
              </button>
            </div>
          ) : (
            /* SUBMISSION FORM */
            <form onSubmit={handleSubmit} className="glass-panel p-5 space-y-4.5">
              
              {/* Type & Severity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Disaster Type:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    {hazardTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Severity Level:</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="low">Low (street runoff)</option>
                    <option value="moderate">Moderate (curb overflow)</option>
                    <option value="high">High (building ingress)</option>
                    <option value="critical">Critical (imminent danger)</option>
                  </select>
                </div>
              </div>

              {/* Location Name */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Location/Intersection Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Brickell Ave & SE 14th St"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none ${
                    errors.locationName ? 'border-red-500' : 'border-slate-850'
                  }`}
                  title="Incident Location"
                />
                {errors.locationName && <span className="text-[9px] text-red-400 font-mono">{errors.locationName}</span>}
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Latitude:</label>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    title="Latitude coordinate"
                  />
                  {errors.lat && <span className="text-[9px] text-red-400 font-mono">{errors.lat}</span>}
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Longitude:</label>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    title="Longitude coordinate"
                  />
                  {errors.lng && <span className="text-[9px] text-red-400 font-mono">{errors.lng}</span>}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Hazard details / Description:</label>
                <textarea
                  rows={4}
                  placeholder="Provide explicit conditions (water depth, vehicle access, active obstacles)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none ${
                    errors.description ? 'border-red-500' : 'border-slate-850'
                  }`}
                  title="Incident Description"
                />
                {errors.description && <span className="text-[9px] text-red-400 font-mono">{errors.description}</span>}
              </div>

              {/* Contact preference */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">Contact Preference:</label>
                <div className="flex items-center gap-4 text-xs text-slate-300 py-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="contact"
                      checked={contactPref === 'anonymous'}
                      onChange={() => setContactPref('anonymous')}
                      className="accent-blue-600"
                    />
                    <span>Anonymous (EOC Cache only)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="contact"
                      checked={contactPref === 'mobile'}
                      onChange={() => setContactPref('mobile')}
                      className="accent-blue-600"
                    />
                    <span>Include Mobile Contact</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg glow-blue transition-colors mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" /> Sending to AI Triage...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Emergency Signal
                  </>
                )}
              </button>

            </form>
          )}
        </div>

        {/* Presets & Help (Right 1/3) */}
        <div className="space-y-5">
          <div className="glass-panel p-4 space-y-3">
            <span className="text-[10px] font-bold font-mono text-blue-400 uppercase block">Quick Coordinates Lock</span>
            <p className="text-[11px] text-slate-400 leading-normal">
              Click to mock coordinates in active flood grids:
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSetCoordinates('25.7618', '-80.1917', 'Brickell Ave & SE 12th St')}
                className="w-full text-left p-2 border border-slate-900 bg-slate-950 text-[10px] text-slate-300 rounded hover:border-slate-800 transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-red-500" /> Brickell Corridor (Critical)
              </button>
              <button
                onClick={() => handleSetCoordinates('25.7298', '-80.2395', 'S Bayshore Dr & Coconut Grove')}
                className="w-full text-left p-2 border border-slate-900 bg-slate-950 text-[10px] text-slate-300 rounded hover:border-slate-800 transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500" /> Coconut Grove Shore (High)
              </button>
              <button
                onClick={() => handleSetCoordinates('25.7725', '-80.2155', 'Little Havana Lowlands')}
                className="w-full text-left p-2 border border-slate-900 bg-slate-950 text-[10px] text-slate-300 rounded hover:border-slate-800 transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500" /> Little Havana low elevation
              </button>
            </div>
          </div>

          <div className="glass-panel p-4 space-y-2">
            <span className="text-[10px] font-bold font-mono text-slate-500 uppercase block">AI Verification Pipeline</span>
            <p className="text-[10px] text-slate-500 leading-relaxed leading-normal">
              Reports undergo automatic geospatial clustering and severity calculation. Once approved, hazard buffers are generated, and nearby rescue resources are notified.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
export default ReportIncident;
