import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertTriangle, ArrowLeft, Layers } from 'lucide-react';
import SystemDesignResult from './SystemDesignResult';
import SystemDesignPlayground from './SystemDesignPlayground';

interface SystemDesignResultWrapperProps {
  isPlayground?: boolean;
}

export default function SystemDesignResultWrapper({ isPlayground = false }: SystemDesignResultWrapperProps) {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchDesign() {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const response = await fetch(`http://localhost:3000/builder/system-design/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to load system design: Status ${response.status}`);
        }
        const res = await response.json();
        if (active) {
          if (res.success && res.data) {
            setData(res.data);
          } else {
            throw new Error('Design record not found or invalid format');
          }
        }
      } catch (err: any) {
        if (active) {
          console.error(err);
          setError(err?.message || 'Failed to retrieve design blueprint details');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchDesign();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="min-h-full">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col items-center justify-center py-36 text-center space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider font-mono">Synchronizing Blueprint</h4>
              <p className="text-[10px] text-gray-500">Retrieving compiler configuration schemas and modules...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto py-16 text-center space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/5">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Failed to Load Design</h3>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed mx-auto">
                {error}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-4">
              <Link to="/builder">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Go to Dashboard
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : data ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isPlayground ? (
              <SystemDesignPlayground data={data} />
            ) : (
              <SystemDesignResult data={data} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className="text-center py-20 text-gray-500 space-y-2"
          >
            <Layers className="w-10 h-10 mx-auto text-white/5 mb-2" />
            <p className="text-sm">Blueprint is empty or uninitialized.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
