import { AnimatePresence, motion } from 'framer-motion';
import JSZip from 'jszip';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Database as DbIcon,
  FileCode2,
  Loader2,
  Terminal as TermIcon,
  Settings,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Server,
  Monitor,
  Cpu,
  Layers,
  Palette,
  Eye,
  EyeOff,
  Network,
  HardDrive
} from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import FolderTree, { type FileNode } from './FolderTree';

interface SystemDesignResultProps {
  data: {
    _id: string;
    projectName?: string;
    detailedArchitectureText: string;
    folderStructure: FileNode[];
    frontend: any;
    backend: any;
    deployment: any;
    isScaffolded?: boolean;
  };
}

export default function SystemDesignResult({ data }: SystemDesignResultProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'docs' | 'structure' | 'code' | 'settings'>('docs');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Custom interactive tab states
  const [showRawJson, setShowRawJson] = useState(false);
  const [expandedComponents, setExpandedComponents] = useState<Record<string, boolean>>({});
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>({});

  const toggleComponent = (name: string) => {
    setExpandedComponents(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleModel = (name: string) => {
    setExpandedModels(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:3000/builder/system-design/${data._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setIsDeleteModalOpen(false);
        navigate('/builder');
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || 'Failed to delete the project. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('A network error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  const [isScaffolding, setIsScaffolding] = useState(false);
  const [scaffoldProgress, setScaffoldProgress] = useState({ current: 0, total: 0, currentFile: '' });
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const addTerminalLog = (log: string) => {
    setTerminalLogs(prev => [...prev.slice(-8), log]);
  };

  const handleScaffold = async () => {
    if (!data._id) {
      alert('System Design ID is missing. Please generate the design again.');
      return;
    }

    const filesToGenerate = data.folderStructure.filter(node => node.type === 'file');
    if (filesToGenerate.length === 0) return;

    setIsScaffolding(true);
    setTerminalLogs([]);
    setScaffoldProgress({ current: 0, total: filesToGenerate.length, currentFile: '' });
    setActiveTab('code');

    const newGeneratedFiles: Record<string, string> = { ...generatedFiles };
    addTerminalLog(`[SYSTEM] Initializing scaffolding engine for Design ID: ${data._id}`);
    addTerminalLog(`[SYSTEM] Queueing ${filesToGenerate.length} code modules...`);

    for (let i = 0; i < filesToGenerate.length; i++) {
      const file = filesToGenerate[i];
      setScaffoldProgress({ current: i + 1, total: filesToGenerate.length, currentFile: file.path });
      setSelectedFile(file.path);

      const fileParts = file.path.split('/');
      const fileName = fileParts[fileParts.length - 1];
      addTerminalLog(`[GENERATOR] Synthesizing imports & schemas for ${fileName}`);

      try {
        const response = await fetch('http://localhost:3000/builder/generator/generate-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemDesignId: data._id,
            filePath: file.path,
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data) {
            newGeneratedFiles[file.path] = resData.data.content;
            setGeneratedFiles({ ...newGeneratedFiles });
            addTerminalLog(`[SUCCESS] Scaffolded: ${file.path} (${resData.data.content.length} chars)`);
          }
        } else {
          addTerminalLog(`[ERROR] Failed to compile: ${file.path}`);
        }
      } catch (error) {
        addTerminalLog(`[ERROR] Network timeout on: ${file.path}`);
        console.error(`Error generating ${file.path}:`, error);
      }
    }

    setIsScaffolding(false);
    setScaffoldProgress(prev => ({ ...prev, currentFile: 'Scaffolding Complete!' }));
    addTerminalLog(`[FINISHED] All models initialized successfully! Scaffold completed.`);
  };

  const handleExportZip = async () => {
    if (Object.keys(generatedFiles).length === 0) {
      alert("No code has been generated yet. Please start scaffolding first.");
      return;
    }

    const zip = new JSZip();

    Object.entries(generatedFiles).forEach(([filePath, content]) => {
      const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      zip.file(cleanPath, content);
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-${data._id}-code.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating zip:', error);
      alert('Failed to generate zip file.');
    }
  };

  const copyToClipboard = () => {
    if (selectedFile && generatedFiles[selectedFile]) {
      navigator.clipboard.writeText(generatedFiles[selectedFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tabs = [
    { id: 'docs', label: 'Detailed Architecture', icon: BookOpen },
    { id: 'structure', label: 'Data Models & APIs', icon: DbIcon },
    { id: 'code', label: 'Code Explorer & IDE', icon: FileCode2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto space-y-4 relative"
    >
      {/* Top Banner Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d0d12]/80 dark:bg-black/50 py-2.5 px-5 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
              Architecture Generated
            </h2>
            <p className="text-gray-400 text-[10px] mt-0.5 leading-tight">Review layers, trace data flows, and bootstrap code.</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {isScaffolding ? (
            <div className="flex items-center gap-2.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg">
              <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin flex-shrink-0" />
              <div className="text-left">
                <span className="text-[10px] font-bold text-white block leading-none">
                  Scaffolding ({scaffoldProgress.current}/{scaffoldProgress.total})
                </span>
                <span className="text-[8px] text-indigo-300 font-mono truncate max-w-[130px] block mt-0.5 leading-none">
                  {scaffoldProgress.currentFile}
                </span>
              </div>
            </div>
          ) : data.isScaffolded ? (
            /* Already scaffolded — only show the playground link */
            <>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <div className="text-left">
                  <span className="text-[10px] font-bold text-emerald-300 block leading-none">Already Scaffolded</span>
                  <span className="text-[8px] text-emerald-600 font-mono block mt-0.5 leading-none">Code stored in database</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/builder/${data._id}/playground`)}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-[0_2px_8px_rgba(16,185,129,0.2)] text-[11px] font-bold cursor-pointer"
              >
                <Code2 className="w-3 h-3" /> View in Playground
              </motion.button>
            </>
          ) : (
            /* Not yet scaffolded */
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/builder/${data._id}/playground`)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-[11px] transition-all cursor-pointer"
              >
                <Code2 className="w-3 h-3 text-gray-400" /> Open Playground
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/builder/${data._id}/playground`, { state: { autoScaffold: true } })}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all shadow-[0_2px_8px_rgba(99,102,241,0.2)] text-[11px] font-bold cursor-pointer"
              >
                <Code2 className="w-3 h-3 animate-pulse" /> Start Scaffolding
              </motion.button>
            </>
          )}
        </div>
      </div>


      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Panels (Detailed views) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Visual Scaffolder Progress Console (Shown during scaffolding) */}
          <AnimatePresence>
            {(isScaffolding || terminalLogs.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#09090d] border border-white/10 rounded-2xl p-5 overflow-hidden shadow-2xl relative font-mono text-[11px] leading-relaxed text-indigo-400"
              >
                <div className="flex items-center justify-between mb-3.5 border-b border-white/5 pb-2">
                  <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs text-white">
                    <TermIcon className="w-4 h-4 text-indigo-400" />
                    Engine Compiler Output
                  </span>
                  <span className="text-[10px] text-gray-500">Live feed</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/5 rounded-full h-1.5 mb-4 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(scaffoldProgress.current / (scaffoldProgress.total || 1)) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="space-y-1.5 h-32 overflow-y-auto">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-gray-600">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                      <span className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-semibold' : log.includes('[ERROR]') ? 'text-rose-400' : 'text-indigo-300'}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Main Container */}
          <div className="bg-[#0b0b0f]/80 dark:bg-black/40 rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Fluid Sliding Tab Bar */}
            <div className="flex border-b border-white/5 bg-[#0f0f15]/60 p-2 gap-1">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center gap-2.5 cursor-pointer ${isSelected ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
                      }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {isSelected && (
                      <motion.div
                        layoutId="active-result-tab"
                        className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Views Content */}
            <div className="p-4 md:p-6 min-h-[500px] max-h-[750px] overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'docs' ? (
                  <motion.div
                    key="docs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="prose prose-sm prose-invert prose-indigo max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0a0a0f] prose-pre:border prose-pre:border-white/10"

                  >
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                      {data.detailedArchitectureText}
                    </ReactMarkdown>
                  </motion.div>
                ) : activeTab === 'structure' ? (
                  <motion.div
                    key="structure"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-10"
                  >
                    {/* Visual Specs Header Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Network className="w-4 h-4 text-indigo-400 animate-pulse" />
                          System Architecture Specs
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Interactive breakdown of modules, endpoints, databases, and core libraries.</p>
                      </div>
                      
                      <button
                        onClick={() => setShowRawJson(!showRawJson)}
                        className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all border border-white/5 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                      >
                        {showRawJson ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Switch to Visual Dashboard</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                            <span>Inspect Raw JSON Data</span>
                          </>
                        )}
                      </button>
                    </div>

                    {showRawJson ? (
                      /* RAW JSON INSPECTION BACKUP */
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            Frontend Config Specs (JSON)
                          </h3>
                          <pre className="bg-[#050508] p-5 rounded-2xl border border-white/10 text-[11px] overflow-x-auto text-indigo-300/80 font-mono shadow-inner leading-relaxed custom-scrollbar">
                            {JSON.stringify(data.frontend, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Backend Config Specs (JSON)
                          </h3>
                          <pre className="bg-[#050508] p-5 rounded-2xl border border-white/10 text-[11px] overflow-x-auto text-emerald-300/80 font-mono shadow-inner leading-relaxed custom-scrollbar">
                            {JSON.stringify(data.backend, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      /* PREMIUM GLASSMORPHIC DASHBOARD SPECIFICATIONS */
                      <div className="space-y-12">
                        {/* 1. FRONTEND ARCHITECTURE SECTION */}
                        <div className="space-y-6">
                          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-indigo-400" />
                            Frontend Presentation Layer
                          </h4>

                          {/* Overview Specifications Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                              { label: 'Core Framework', val: data.frontend?.framework, icon: Monitor, color: 'text-indigo-400' },
                              { label: 'Styling Library', val: data.frontend?.styling, icon: Palette, color: 'text-fuchsia-400' },
                              { label: 'State Manager', val: data.frontend?.stateManagement, icon: Cpu, color: 'text-sky-400' },
                              { label: 'Routing Strategy', val: data.frontend?.routing, icon: Layers, color: 'text-emerald-400' }
                            ].map((spec, i) => {
                              const SpecIcon = spec.icon;
                              return (
                                <div key={i} className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 p-4 rounded-2xl transition-all flex items-start gap-3">
                                  <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${spec.color}`}>
                                    <SpecIcon className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-wider block leading-none mb-1">{spec.label}</span>
                                    <span className="text-xs font-bold text-white block truncate leading-tight">{spec.val || 'N/A'}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Proposed React Components Stack */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block pl-1">Proposed UI Components</span>
                            {(!data.frontend?.components || data.frontend.components.length === 0) ? (
                              <div className="text-center py-6 text-xs text-gray-600 italic bg-white/[0.01] rounded-2xl border border-white/5">No components specified.</div>
                            ) : (
                              <div className="space-y-3">
                                {data.frontend.components.map((comp: any, idx: number) => {
                                  const isExpanded = !!expandedComponents[comp.name];
                                  return (
                                    <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                                      {/* Component Accordion Header */}
                                      <button
                                        onClick={() => toggleComponent(comp.name)}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors focus:outline-none cursor-pointer"
                                      >
                                        <div className="flex items-center gap-3 min-w-0">
                                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0">
                                            {comp.name.substring(0, 2)}
                                          </div>
                                          <div className="min-w-0">
                                            <span className="text-xs font-bold text-white block leading-tight">{comp.name}</span>
                                            <span className="text-[9px] text-gray-500 font-mono block mt-0.5 truncate">{comp.path}</span>
                                          </div>
                                        </div>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                      </button>

                                      {/* Component Accordion Content */}
                                      {isExpanded && (
                                        <div className="border-t border-white/5 p-4 bg-black/20 space-y-4">
                                          <div>
                                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Responsibility Summary</span>
                                            <p className="text-xs text-gray-300 leading-relaxed">{comp.description}</p>
                                          </div>

                                          {/* Component Props Table */}
                                          {comp.props && comp.props.length > 0 && (
                                            <div className="space-y-1.5">
                                              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Interface API Props</span>
                                              <div className="overflow-x-auto rounded-xl border border-white/5">
                                                <table className="w-full text-left border-collapse text-[11px]">
                                                  <thead>
                                                    <tr className="bg-white/5 border-b border-white/5 text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                                                      <th className="py-2.5 px-3">Prop Name</th>
                                                      <th className="py-2.5 px-3">Data Type</th>
                                                      <th className="py-2.5 px-3 text-right">Required</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody className="divide-y divide-white/5">
                                                    {comp.props.map((prop: any, i: number) => (
                                                      <tr key={i} className="hover:bg-white/[0.01]">
                                                        <td className="py-2 px-3 font-mono font-bold text-gray-200">{prop.name}</td>
                                                        <td className="py-2 px-3 font-mono text-indigo-400">{prop.type}</td>
                                                        <td className="py-2 px-3 text-right">
                                                          <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                                            prop.required
                                                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                                                              : 'bg-white/5 text-gray-500'
                                                          }`}>
                                                            {prop.required ? 'YES' : 'NO'}
                                                          </span>
                                                        </td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          )}

                                          {/* Hooks & State pills */}
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                            {comp.hooksRequired && comp.hooksRequired.length > 0 && (
                                              <div>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1.5">Hooks Subscribed</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                  {comp.hooksRequired.map((hook: string, i: number) => (
                                                    <span key={i} className="text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-lg">{hook}</span>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                            {comp.stateVars && comp.stateVars.length > 0 && (
                                              <div>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1.5">Reactive States Managed</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                  {comp.stateVars.map((state: string, i: number) => (
                                                    <span key={i} className="text-[10px] font-mono bg-fuchsia-500/10 border border-fuchsia-500/15 text-fuchsia-400 px-2 py-0.5 rounded-lg">{state}</span>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 2. BACKEND LAYER SECTION */}
                        <div className="space-y-6 pt-4 border-t border-white/5">
                          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                            <Server className="w-4 h-4 text-emerald-400" />
                            Backend Engine Layer
                          </h4>

                          {/* Backend Specifications Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                              { label: 'Core Platform', val: data.backend?.framework, icon: Server, color: 'text-emerald-400' },
                              { label: 'Architecture Pattern', val: data.backend?.architecturePattern, icon: Cpu, color: 'text-sky-400' },
                              { label: 'Database Service', val: data.backend?.database, icon: DbIcon, color: 'text-indigo-400' },
                              { label: 'ORM Model', val: data.backend?.orm, icon: Layers, color: 'text-amber-400' },
                              { label: 'Caching Cache', val: data.backend?.cachingStrategy, icon: HardDrive, color: 'text-rose-400' },
                              { label: 'Background Service', val: data.backend?.backgroundJobs, icon: TermIcon, color: 'text-fuchsia-400' }
                            ].map((spec, i) => {
                              const SpecIcon = spec.icon;
                              return (
                                <div key={i} className="bg-white/1 hover:bg-white/2 border border-white/5 hover:border-white/10 p-4 rounded-2xl transition-all flex items-start gap-3">
                                  <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${spec.color}`}>
                                    <SpecIcon className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-wider block leading-none mb-1">{spec.label}</span>
                                    <span className="text-xs font-bold text-white block truncate leading-tight">{spec.val || 'N/A'}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Database Models & Schemas */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block pl-1">Database Models & Entity Mappings</span>
                            {(!data.backend?.models || data.backend.models.length === 0) ? (
                              <div className="text-center py-6 text-xs text-gray-600 italic bg-white/[0.01] rounded-2xl border border-white/5">No models specified.</div>
                            ) : (
                              <div className="space-y-3">
                                {data.backend.models.map((model: any, idx: number) => {
                                  const isExpanded = !!expandedModels[model.name];
                                  return (
                                    <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                                      {/* Model Header */}
                                      <button
                                        onClick={() => toggleModel(model.name)}
                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors focus:outline-none cursor-pointer"
                                      >
                                        <div className="flex items-center gap-3 min-w-0">
                                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                                            <DbIcon className="w-3.5 h-3.5" />
                                          </div>
                                          <div className="min-w-0">
                                            <span className="text-xs font-bold text-white block leading-tight">{model.name} Schema</span>
                                            <span className="text-[9px] text-gray-500 block mt-0.5 truncate">{model.description}</span>
                                          </div>
                                        </div>
                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                      </button>

                                      {/* Model Content */}
                                      {isExpanded && (
                                        <div className="border-t border-white/5 p-4 bg-black/20 space-y-4">
                                          {/* Fields Table */}
                                          {model.fields && model.fields.length > 0 && (
                                            <div className="overflow-x-auto rounded-xl border border-white/5">
                                              <table className="w-full text-left border-collapse text-[11px]">
                                                <thead>
                                                  <tr className="bg-white/5 border-b border-white/5 text-[9px] font-extrabold uppercase tracking-wider text-gray-400">
                                                    <th className="py-2.5 px-3">Field Key</th>
                                                    <th className="py-2.5 px-3">Data Type</th>
                                                    <th className="py-2.5 px-3">Uniqueness</th>
                                                    <th className="py-2.5 px-3">Nullable</th>
                                                    <th className="py-2.5 px-3 text-right">Relationship</th>
                                                  </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                  {model.fields.map((field: any, i: number) => (
                                                    <tr key={i} className="hover:bg-white/[0.01]">
                                                      <td className="py-2 px-3 font-mono font-bold text-gray-200">{field.name}</td>
                                                      <td className="py-2 px-3 font-mono text-emerald-400">{field.type}</td>
                                                      <td className="py-2 px-3">
                                                        <span className={`inline-block text-[8px] font-extrabold px-1.5 py-0.5 rounded ${
                                                          field.isUnique
                                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                                                            : 'text-gray-600'
                                                        }`}>
                                                          {field.isUnique ? 'UNIQUE' : '-'}
                                                        </span>
                                                      </td>
                                                      <td className="py-2 px-3">
                                                        <span className={`inline-block text-[8px] font-extrabold px-1.5 py-0.5 rounded ${
                                                          field.isNullable
                                                            ? 'bg-white/5 text-gray-500'
                                                            : 'bg-emerald-500/10 text-emerald-400'
                                                        }`}>
                                                          {field.isNullable ? 'NULLABLE' : 'REQUIRED'}
                                                        </span>
                                                      </td>
                                                      <td className="py-2 px-3 text-right">
                                                        {field.relationTo ? (
                                                          <span className="text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-lg">
                                                            ➡️ {field.relationTo}
                                                          </span>
                                                        ) : (
                                                          <span className="text-gray-600">-</span>
                                                        )}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          )}

                                          {/* Model Indexes */}
                                          {model.indexes && model.indexes.length > 0 && (
                                            <div className="pt-1.5 flex items-center gap-2">
                                              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Index Keys:</span>
                                              <div className="flex flex-wrap gap-1.5">
                                                {model.indexes.map((idxName: string, i: number) => (
                                                  <span key={i} className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded">{idxName}</span>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Proposed REST API Endpoints */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block pl-1">REST API Endpoints Specification</span>
                            {(!data.backend?.apiEndpoints || data.backend.apiEndpoints.length === 0) ? (
                              <div className="text-center py-6 text-xs text-gray-600 italic bg-white/[0.01] rounded-2xl border border-white/5">No REST endpoints specified.</div>
                            ) : (
                              <div className="grid grid-cols-1 gap-3.5">
                                {data.backend.apiEndpoints.map((ep: any, idx: number) => {
                                  // Determine color style for HTTP Methods
                                  let methodStyle = 'bg-white/5 text-gray-400 border-white/10';
                                  const method = (ep.method || 'GET').toUpperCase();
                                  if (method === 'GET') methodStyle = 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400';
                                  else if (method === 'POST') methodStyle = 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400';
                                  else if (method === 'PUT' || method === 'PATCH') methodStyle = 'bg-amber-500/10 border-amber-500/25 text-amber-400';
                                  else if (method === 'DELETE') methodStyle = 'bg-rose-500/10 border-rose-500/25 text-rose-400';

                                  return (
                                    <div key={idx} className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4">
                                      <div className="space-y-2 flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${methodStyle}`}>{method}</span>
                                          <code className="text-xs font-mono font-bold text-white truncate">{ep.path}</code>
                                          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-gray-400">
                                            {ep.authRequired ? (
                                              <>
                                                <Lock className="w-2.5 h-2.5 text-rose-400" />
                                                <span className="text-rose-400">SECURE</span>
                                              </>
                                            ) : (
                                              <>
                                                <Unlock className="w-2.5 h-2.5 text-gray-500" />
                                                <span>PUBLIC</span>
                                              </>
                                            )}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed">{ep.description}</p>
                                      </div>

                                      {/* Payload Details */}
                                      <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px] shrink-0">
                                        <div>
                                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Request Payload</span>
                                          {ep.requestPayload && typeof ep.requestPayload === 'object' && Object.keys(ep.requestPayload).length > 0 ? (
                                            <div className="mt-1 bg-black/35 p-2 rounded-lg border border-white/5 space-y-1">
                                              {Object.entries(ep.requestPayload).map(([k, v]) => (
                                                <div key={k} className="flex justify-between items-center text-[10px] font-mono gap-4">
                                                  <span className="text-gray-400 truncate">{k}</span>
                                                  <span className="text-indigo-300 text-right shrink-0">{String(v)}</span>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-[10px] text-gray-600 font-mono italic block mt-1">None (Void)</span>
                                          )}
                                        </div>

                                        <div>
                                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Response Payload</span>
                                          {ep.responsePayload && typeof ep.responsePayload === 'object' && Object.keys(ep.responsePayload).length > 0 ? (
                                            <div className="mt-1 bg-black/35 p-2 rounded-lg border border-white/5 space-y-1">
                                              {Object.entries(ep.responsePayload).map(([k, v]) => (
                                                <div key={k} className="flex justify-between items-center text-[10px] font-mono gap-4">
                                                  <span className="text-gray-400 truncate">{k}</span>
                                                  <span className="text-emerald-400 text-right shrink-0">{String(v)}</span>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-[10px] text-gray-600 font-mono italic block mt-1">None (Void)</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 3. THIRD-PARTY INTEGRATIONS SECTION */}
                        {data.backend?.thirdPartyIntegrations && data.backend.thirdPartyIntegrations.length > 0 && (
                          <div className="space-y-4 pt-4 border-t border-white/5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block pl-1">Third-Party Platform Integrations</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {data.backend.thirdPartyIntegrations.map((api: any, idx: number) => (
                                <div key={idx} className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 p-4 rounded-2xl transition-all flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0 uppercase">
                                    {api.provider.substring(0, 2)}
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-white block leading-tight">{api.provider} Integration</span>
                                    <p className="text-[10px] text-gray-400 leading-normal mt-1">{api.purpose}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : activeTab === 'code' ? (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-4"
                  >
                    {/* IDE Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <FileCode2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white font-mono">
                            {selectedFile ? selectedFile.split('/').pop() : 'IDE Workspace'}
                          </h3>
                          <span className="text-[10px] text-gray-500 font-mono block">
                            {selectedFile ? selectedFile : 'Select a file to explore'}
                          </span>
                        </div>
                      </div>

                      {selectedFile && generatedFiles[selectedFile] && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={copyToClipboard}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scale-up" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-gray-400" />
                              <span>Copy Source</span>
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>

                    {/* IDE Content */}
                    {selectedFile && generatedFiles[selectedFile] ? (
                      <div className="relative rounded-2xl overflow-hidden bg-[#060608] border border-white/10 font-mono text-[12px] leading-relaxed shadow-2xl">
                        <div className="flex">
                          {/* Simulated line numbers */}
                          <div className="text-right text-gray-600 px-4 py-4 select-none bg-white/[0.01] border-r border-white/5 text-[11px]">
                            {generatedFiles[selectedFile].split('\n').map((_, i) => (
                              <div key={i}>{i + 1}</div>
                            ))}
                          </div>
                          {/* Raw code contents */}
                          <pre className="p-4 overflow-x-auto text-indigo-200/90 w-full whitespace-pre font-mono">
                            <code>{generatedFiles[selectedFile]}</code>
                          </pre>
                        </div>
                      </div>
                    ) : selectedFile && isScaffolding && scaffoldProgress.currentFile === selectedFile ? (
                      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-400" />
                        <p className="text-sm font-semibold text-gray-400">Synthesizing file structure...</p>
                        <p className="text-xs text-indigo-400 font-mono mt-1.5">{selectedFile}</p>
                      </div>
                    ) : selectedFile ? (
                      <div className="flex flex-col items-center justify-center py-24 text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-sm">This file module has not been scaffolded yet.</p>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => navigate(`/builder/${data._id}/playground`, { state: { autoScaffold: true } })}
                          className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg cursor-pointer"
                        >
                          Scaffold Code Elements
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-24 text-gray-500 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                        <FileCode2 className="w-12 h-12 text-white/5 mb-3" />
                        <p className="text-sm">Select any file node from the proposed structure on the right.</p>
                        <p className="text-xs text-gray-600 mt-1">Browse and copy fully synthesized code files.</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/5 pb-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Settings className="w-4 h-4 text-indigo-400" />
                        Project Settings
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">Configure project properties and manage execution options.</p>
                    </div>

                    <div className="bg-red-950/10 border border-red-500/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
                      {/* Subtle ambient red background light */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />
                      
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                          <Trash2 className="w-4.5 h-4.5" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <h4 className="text-xs font-bold text-white">Danger Zone</h4>
                          <p className="text-[11px] text-gray-300 leading-relaxed max-w-xl">
                            Deleting this project will mark it as deleted and completely hide it from your workspace listing. This action is irreversible on the user interface, and all architecture specifications, models, and scaffolds will become inaccessible.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs transition-all shadow-[0_2px_8px_rgba(239,68,68,0.25)] hover:shadow-[0_4px_16px_rgba(239,68,68,0.4)] cursor-pointer border border-red-500/15"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Project
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side Proposed Scaffolding Explorer */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="space-y-4">
            <FolderTree
              structure={data.folderStructure}
              generatedFiles={Object.keys(generatedFiles)}
              onSelectFile={(path) => {
                setSelectedFile(path);
                setActiveTab('code');
              }}
              selectedFile={selectedFile}
            />
          </div>
        </div>
      </div>

      {/* Consent Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-sm bg-[#0c0c12]/95 border border-red-500/20 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden"
            >
              {/* Glow Line at top */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white">Delete Project?</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Are you absolutely sure you want to delete this project? This will permanently remove the system architecture for <span className="text-white font-semibold">"{data.projectName || (data.backend?.framework ? `${data.backend.framework} App` : data.frontend?.framework ? `${data.frontend.framework} App` : 'this project')}"</span>.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full mt-4">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(239,68,68,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border border-red-500/15"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3 h-3" />
                        <span>Yes, Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
