import { motion } from 'framer-motion';
import {
  ChevronRight,
  Clock,
  Code2,
  Database,
  Home as HomeIcon,
  Layers,
  Layout as LayoutIcon,
  Plus,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';

interface SystemDesignSummary {
  _id: string;
  projectName?: string;
  serviceType: string;
  description: string;
  createdAt: string;
}

export default function BuilderLayout() {
  const [designs, setDesigns] = useState<SystemDesignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { id: activeId } = useParams();
  const location = useLocation();

  useEffect(() => {
    async function fetchDesigns() {
      try {
        const response = await fetch('http://localhost:3000/builder/system-design');
        if (response.ok) {
          const res = await response.json();
          if (res.success && res.data) {
            setDesigns(res.data);
          }
        }
      } catch (err) {
        console.error('Error fetching designs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDesigns();
  }, [refreshTrigger, location.pathname]); // refetch when sub-views change or manually triggered

  const getComplexityIcon = (type: string) => {
    switch (type) {
      case 'STATIC':
        return <LayoutIcon className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'DYNAMIC':
        return <Database className="w-4 h-4 text-indigo-400 shrink-0" />;
      default:
        return <Code2 className="w-4 h-4 text-fuchsia-400 shrink-0" />;
    }
  };

  const getDerivedTitle = (desc: string, type: string) => {
    if (!desc) return 'Untitled Project';
    const words = desc.split(' ').filter(Boolean);
    if (words.length === 0) return 'Untitled Project';
    const cleanTitle = words.slice(0, 4).join(' ').replace(/[^a-zA-Z0-9\s]/g, '');
    return cleanTitle.length > 25 ? cleanTitle.substring(0, 25) + '...' : cleanTitle;
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#050508] text-white overflow-hidden font-sans relative">
      {/* Top Banner Navigation bar */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#07070b]/60 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-indigo-500/10"
            >
              <Layers className="text-white w-4 h-4" />
            </motion.div>
            <span className="font-bold text-sm tracking-tight text-white">ASB<span className="text-indigo-400">.AI</span></span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-xs text-gray-400 flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Architecture Scaffolder
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/5 cursor-pointer"
            >
              <HomeIcon className="w-3.5 h-3.5" /> Portal Home
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Main Split Panel Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column Persistent Design Sidebar */}
        <aside className="w-[340px] shrink-0 border-r border-white/5 flex flex-col bg-[#07070a]/90 backdrop-blur-md relative z-20">
          
          {/* Action Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Previous Buildings
            </span>
            <button 
              onClick={() => setRefreshTrigger(t => t + 1)}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh database records"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* "+ New Design" Button */}
          <div className="p-4 border-b border-white/5 shrink-0">
            <Link to="/builder/new">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-bold text-xs transition-all shadow-[0_5px_15px_rgba(99,102,241,0.25)] hover:shadow-[0_8px_20px_rgba(99,102,241,0.35)] cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                CREATE NEW BUILDING
              </motion.button>
            </Link>
          </div>

          {/* Scrolled list of design records */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1.5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-400 mb-2.5" />
                <span className="text-[10px] font-mono uppercase tracking-wider">Syncing Cluster...</span>
              </div>
            ) : designs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <Layers className="w-8 h-8 text-white/5 mb-3" />
                <span className="text-xs text-gray-500 font-semibold">No buildings found</span>
                <p className="text-[10px] text-gray-600 mt-1 max-w-[200px]">Create your first software design using our prompt engine.</p>
              </div>
            ) : (
              designs.map((design) => {
                const isSelected = activeId === design._id;
                const derivedTitle = design.projectName || getDerivedTitle(design.description, design.serviceType);
                return (
                  <Link 
                    key={design._id} 
                    to={`/builder/${design._id}`}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.01, x: 2 }}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all border flex items-start gap-3.5 group relative cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_5px_15px_rgba(99,102,241,0.08)]' 
                          : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/5 hover:border-white/10'
                      }`}
                    >
                      {/* Left Icon Panel */}
                      <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
                        isSelected 
                          ? 'bg-indigo-500/20 border-indigo-500/30' 
                          : 'bg-white/5 border-white/10 group-hover:border-white/20'
                      }`}>
                        {getComplexityIcon(design.serviceType)}
                      </div>

                      {/* Content panel */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                          <span className={`text-xs font-bold truncate block ${
                            isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
                          }`}>
                            {derivedTitle}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                        </div>
                        <p className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors line-clamp-2 leading-normal mb-1.5 font-light">
                          {design.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-[9px] text-gray-600 group-hover:text-gray-500 transition-colors">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(design.createdAt)}</span>
                          <span>•</span>
                          <span className="uppercase font-bold tracking-wider text-[8px] text-indigo-400/90">{design.serviceType}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Column Workspace Outlet */}
        <main className="flex-1 min-w-0 overflow-y-auto custom-scrollbar p-6 bg-[#040407] relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
