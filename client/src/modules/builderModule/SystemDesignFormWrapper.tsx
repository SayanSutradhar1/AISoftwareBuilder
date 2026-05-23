import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SystemDesignForm from './SystemDesignForm';
import { motion } from 'framer-motion';
import { Cpu, RefreshCw, AlertTriangle } from 'lucide-react';

export default function SystemDesignFormWrapper() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: { projectName: string; serviceType: string; description: string; dataFlow: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/builder/system-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate system design');
      }

      const responseData = await response.json();
      if (responseData.success && responseData.data) {
        const newId = responseData.data._id;
        // Redirect to the newly synthesized system design details route
        navigate(`/builder/${newId}`);
      } else {
        throw new Error('Invalid response structure from synthesis API');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error generating system design. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full py-4">
      {loading ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-28 text-center space-y-6 max-w-md mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 relative">
              <Cpu className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Autonomous Agent Deliberation</h3>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Synthesizing layers, optimizing schemas, detailing endpoint requirements, and compiling dependency graphs...
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-indigo-400/90 font-bold uppercase tracking-wider font-mono">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Live compiling models
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-400 max-w-4xl mx-auto"
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                <span className="block font-bold mb-1">Deliberation Failed</span>
                {error}
              </div>
            </motion.div>
          )}
          <SystemDesignForm onSubmit={handleSubmit} isLoading={loading} />
        </div>
      )}
    </div>
  );
}
