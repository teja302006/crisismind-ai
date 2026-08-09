import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { BrainCircuit, Send, Sparkles, ShieldCheck, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

interface Message {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  provider?: 'gemini' | 'demo';
}

export const Copilot: React.FC = () => {
  const location = useLocation();
  const { showToast } = useNotifications();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'copilot',
      text: `### CrisisMind Copilot Active
Welcome to the emergency decision-support terminal. I am loaded with the current spatial data grid context (active incident telemetry, risk scoring maps, and resource availability records).

How can I assist you with diagnostic reasoning? Try selecting one of the EOC preset queries below.`,
      provider: 'demo'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState<'GEMINI' | 'DEMO'>('DEMO');

  // Detect context pushed from other dashboard views
  const routeState = location.state as {
    query?: string;
    activeZoneId?: string;
    activeIncidentId?: string;
  } | null;

  const [activeContext, setActiveContext] = useState<{
    zoneId?: string;
    incidentId?: string;
    label?: string;
  } | null>(null);

  useEffect(() => {
    if (routeState) {
      if (routeState.activeZoneId) {
        setActiveContext({ zoneId: routeState.activeZoneId, label: 'Zone Focus: Brickell Corridor' });
      } else if (routeState.activeIncidentId) {
        setActiveContext({ incidentId: routeState.activeIncidentId, label: `Incident Focus: ${routeState.activeIncidentId.substring(0, 8)}...` });
      }

      if (routeState.query) {
        // Auto-run query after a brief delay
        setTimeout(() => {
          handleSendMessage(routeState.query!, {
            activeZoneId: routeState.activeZoneId,
            activeIncidentId: routeState.activeIncidentId
          });
        }, 300);
      }
    }
  }, [routeState]);

  // Scroll to bottom on message list update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (text: string, customCtx?: any) => {
    if (!text.trim() || loading) return;

    // Add User Message
    const userMsgId = Math.random().toString(36).substr(2, 9);
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      // Compile query context
      const ctx = customCtx || {
        activeZoneId: activeContext?.zoneId,
        activeIncidentId: activeContext?.incidentId
      };

      const result = await apiService.queryCopilot(text, ctx);
      
      // Update AI provider status
      setAiProvider(result.provider.toUpperCase() as 'GEMINI' | 'DEMO');

      // Add Copilot response
      const copilotMsgId = Math.random().toString(36).substr(2, 9);
      setMessages(prev => [...prev, {
        id: copilotMsgId,
        sender: 'copilot',
        text: result.response,
        provider: result.provider
      }]);

    } catch (err) {
      console.error(err);
      showToast('AI COPILOT ERROR', 'Failed to communicate with AI endpoint.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const presetQueries = [
    { label: 'Why is this area high risk?', query: 'Why is this zone high risk?' },
    { label: 'Show important incidents', query: 'Show me the important incidents.' },
    { label: 'What resources are nearby?', query: 'What emergency resources are nearby?' },
    { label: 'What is happening near here?', query: 'What is happening near this area?' },
  ];

  // Helper to parse basic markdown alerts in our chat box
  const formatMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Header formats
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-extrabold text-white mt-3 mb-1.5">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={idx} className="text-xs font-bold text-slate-200 mt-2 mb-1">{line.replace('#### ', '')}</h4>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={idx} className="text-xs font-bold text-slate-100">{line.replace(/\*\*/g, '')}</p>;
      }
      // Alerts
      if (line.startsWith('> [!WARNING]')) {
        return null; // Skip header, next lines are formatted
      }
      if (line.startsWith('> [!IMPORTANT]')) {
        return null;
      }
      if (line.startsWith('> [!NOTE]')) {
        return null;
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-red-500 bg-red-950/20 px-3 py-1.5 my-2 rounded text-[11px] text-red-200 leading-normal">
            {line.replace('> ', '').replace(/\[!WARNING\]|\[!IMPORTANT\]|\[!NOTE\]/g, '')}
          </blockquote>
        );
      }
      // List items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="text-xs text-slate-300 ml-4 list-disc mb-1 leading-relaxed leading-normal">
            {line.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
          </li>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        return (
          <li key={idx} className="text-xs text-slate-300 ml-4 list-decimal mb-1 leading-relaxed leading-normal">
            {line.replace(/^\d+\.\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
          </li>
        );
      }
      // Normal paragraph
      if (line.trim() === '') return <div key={idx} className="h-2" />;
      return <p key={idx} className="text-xs text-slate-300 leading-relaxed leading-normal mb-1">{line}</p>;
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 h-full pb-20 lg:pb-6 flex flex-col justify-between text-left">
      
      {/* 1. Header & AI Mode Badge */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-950/30 border border-indigo-500/40 rounded-lg text-indigo-400 glow-blue">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">CrisisMind Copilot</h1>
            <p className="text-xs text-slate-400">Generative decision-support dialogue terminal</p>
          </div>
        </div>

        {/* AI cognition status */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-[10px] font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="text-slate-500">COGNITION:</span>
          <span className={aiProvider === 'GEMINI' ? 'text-indigo-400 glow-blue' : 'text-amber-500'}>
            {aiProvider === 'GEMINI' ? 'GEMINI 1.5' : 'DEMO ENGINE'}
          </span>
        </div>
      </div>

      {/* Active Selection Context Tag */}
      {activeContext && (
        <div className="px-3.5 py-1.5 bg-blue-950/20 border border-blue-900/40 rounded-lg flex items-center justify-between text-xs shrink-0">
          <span className="flex items-center gap-2 text-blue-400 font-semibold font-mono">
            <MapPin className="w-3.5 h-3.5" /> Locked Context: {activeContext.label}
          </span>
          <button
            onClick={() => setActiveContext(null)}
            className="text-[10px] text-slate-500 hover:text-slate-300"
            title="Clear Locked Focus"
          >
            Clear Focus
          </button>
        </div>
      )}

      {/* 2. CHAT TIMELINE (Scrollable) */}
      <div className="flex-1 overflow-y-auto min-h-[260px] bg-slate-900/20 border border-slate-900 rounded-2xl p-4 sm:p-5 my-4 space-y-4 shadow-inner">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div className={`p-4 rounded-2xl text-left shadow-lg ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'glass-panel rounded-tl-none border-slate-800'
            }`}>
              {msg.sender === 'user' ? (
                <p className="text-xs font-sans leading-relaxed leading-normal">{msg.text}</p>
              ) : (
                <div className="space-y-1">{formatMarkdown(msg.text)}</div>
              )}
            </div>
            
            {/* Metadata (timestamp / provider status) */}
            <span className="text-[9px] text-slate-500 font-mono">
              {msg.sender === 'user' ? 'OPERATOR' : `COPILOT (${msg.provider?.toUpperCase()})`}
            </span>
          </div>
        ))}
        {loading && (
          <div className="mr-auto max-w-[80%] flex items-center gap-2.5 p-4 glass-panel rounded-2xl rounded-tl-none text-slate-400 text-xs">
            <Loader2 className="w-4.5 h-4.5 animate-spin text-blue-500" /> Computing telemetry matrices...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 3. INPUT BLOCK & PRESETS */}
      <div className="space-y-4 shrink-0">
        
        {/* Preset chips */}
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query)}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-[10px] text-slate-300 border border-slate-800/80 rounded-full transition-all flex items-center gap-1 font-medium"
            >
              {p.label} <ArrowRight className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Type your emergency diagnostic query here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-800/80 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50"
            title="Chat Input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg glow-blue transition-colors shrink-0"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure Server-side API key containment. Copilot never invents environmental parameters.
        </p>

      </div>

    </div>
  );
};
export default Copilot;
