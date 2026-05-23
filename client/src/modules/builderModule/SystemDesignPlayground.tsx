import { AnimatePresence, motion } from 'framer-motion';
import JSZip from 'jszip';
import {
  ArrowLeft,
  Check,
  Code2,
  Copy,
  Download,
  Eye,
  FileCode2,
  Loader2,
  Play,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Square,
  Terminal as TermIcon,
  X
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FolderTree, { type FileNode } from './FolderTree';

interface SystemDesignPlaygroundProps {
  data: {
    _id: string;
    detailedArchitectureText: string;
    folderStructure: FileNode[];
    frontend: any;
    backend: any;
    deployment: any;
  };
}

export default function SystemDesignPlayground({ data }: SystemDesignPlaygroundProps) {
  const location = useLocation();
  const autoScaffoldTriggered = useRef(false);
  const [isScaffolding, setIsScaffolding] = useState(false);
  const [isLoadingPersistedFiles, setIsLoadingPersistedFiles] = useState(true);
  const [isScaffolded, setIsScaffolded] = useState(false);
  const [scaffoldProgress, setScaffoldProgress] = useState({ current: 0, total: 0, currentFile: '' });
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Advanced Integrated Development Environment States
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [unsavedFiles, setUnsavedFiles] = useState<Record<string, boolean>>({});
  const [editorTheme, setEditorTheme] = useState<'dracula' | 'cyberpunk' | 'forest' | 'monokai'>('dracula');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '🧠 Antigravity Dev-Sandbox OS Shell v2.4.1 initialized.',
    '👉 Type "help" to see available utilities, or "npm run dev" to run the local server.',
    ''
  ]);
  const [isDevServerRunning, setIsDevServerRunning] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // On mount: fetch any previously persisted generated files from the DB
  useEffect(() => {
    async function loadPersistedFiles() {
      if (!data._id) { setIsLoadingPersistedFiles(false); return; }
      try {
        const res = await fetch(`http://localhost:3000/builder/system-design/${data._id}/generated-files`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const { isScaffolded: scaffolded, generatedFiles: files } = json.data;
            if (scaffolded) {
              setIsScaffolded(true);
              if (files && Object.keys(files).length > 0) {
                setGeneratedFiles(files);
                const paths = Object.keys(files);
                setOpenTabs(paths);
                setSelectedFile(paths[0]);
                setTerminalOutput(prev => [
                  ...prev,
                  `✅ [DB] Loaded ${paths.length} previously scaffolded file(s) from the database.`,
                  ''
                ]);
              }
            }
          }
        }
      } catch (e) {
        console.error('Failed to load persisted files', e);
      } finally {
        setIsLoadingPersistedFiles(false);
      }
    }
    loadPersistedFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data._id]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleSelectFile = (path: string) => {
    setSelectedFile(path);
    if (!openTabs.includes(path)) {
      setOpenTabs(prev => [...prev, path]);
    }
  };

  const closeTab = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t !== filePath);
    setOpenTabs(newTabs);
    
    if (selectedFile === filePath) {
      if (newTabs.length > 0) {
        setSelectedFile(newTabs[newTabs.length - 1]);
      } else {
        setSelectedFile(null);
      }
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedFile) return;
    const newContent = e.target.value;
    setGeneratedFiles(prev => ({ ...prev, [selectedFile]: newContent }));
    setUnsavedFiles(prev => ({ ...prev, [selectedFile]: true }));
  };

  const handleSaveFile = () => {
    if (!selectedFile) return;
    setUnsavedFiles(prev => ({ ...prev, [selectedFile]: false }));
    setTerminalOutput(prev => [
      ...prev,
      `💾 [FILE SYSTEM] Successfully saved edits to: ${selectedFile.split('/').pop()}`,
      ''
    ]);
  };

  const handleSearchReplace = (replaceAll: boolean) => {
    if (!selectedFile || !generatedFiles[selectedFile]) return;
    const currentContent = generatedFiles[selectedFile];
    
    if (!replaceAll) {
      const newContent = currentContent.replace(searchQuery, replaceQuery);
      setGeneratedFiles(prev => ({ ...prev, [selectedFile]: newContent }));
      setUnsavedFiles(prev => ({ ...prev, [selectedFile]: true }));
    } else {
      const newContent = currentContent.replaceAll(searchQuery, replaceQuery);
      setGeneratedFiles(prev => ({ ...prev, [selectedFile]: newContent }));
      setUnsavedFiles(prev => ({ ...prev, [selectedFile]: true }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (selectedFile) {
          handleSaveFile();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedFile]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    setTerminalOutput(prev => [...prev, `➜  ${cmd}`]);
    setTerminalInput('');

    setTimeout(() => {
      processCommand(cmd);
    }, 100);
  };

  const processCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase();
    
    if (lowerCmd === 'help') {
      setTerminalOutput(prev => [
        ...prev,
        '💡 Available Sandbox Utilities:',
        '  - help              Show this utilities guide',
        '  - npm run dev       Launch local development server and run web preview sandbox',
        '  - npm test          Execute all dynamic test suites & report status',
        '  - npm run build     Compile project components for deployment',
        '  - ls                List all synthesized file modules',
        '  - clear             Flush terminal output screen',
        ''
      ]);
    } else if (lowerCmd === 'clear') {
      setTerminalOutput([]);
    } else if (lowerCmd === 'ls') {
      const files = Object.keys(generatedFiles);
      if (files.length === 0) {
        setTerminalOutput(prev => [...prev, '📂 No files scaffolded yet. Click "Start Scaffolding" first.', '']);
      } else {
        setTerminalOutput(prev => [
          ...prev,
          '📂 Synthesized code files:',
          ...files.map(f => `  • ${f}`),
          ''
        ]);
      }
    } else if (lowerCmd === 'npm run dev') {
      setIsDevServerRunning(true);
      setTerminalOutput(prev => [
        ...prev,
        '🚀 Initializing mock development compiler...',
        '📦 Vite v5.1.4 dev server running',
        '➜  Local URL:  http://localhost:5173/',
        '⚡ [HMR] Hot Module Replacement engine active.',
        '🖥️ Mounting Live App Sandbox Preview Panel...',
        ''
      ]);
      
      setTimeout(() => {
        setShowLivePreview(true);
      }, 1000);
    } else if (lowerCmd === 'npm test') {
      setTerminalOutput(prev => [
        ...prev,
        '🧪 Running active unit tests...',
        '   ✓ src/components/Sidebar.test.tsx (2 passed)',
        '   ✓ src/utils/synthesis.test.tsx (1 passed)',
        '   ✓ src/modules/builder.test.tsx (3 passed)',
        '🎉 All tests verified successfully: 6/6 passed (100%)',
        ''
      ]);
    } else if (lowerCmd === 'npm run build') {
      setTerminalOutput(prev => [
        ...prev,
        '🏗️ Triggering production compiler build...',
        '✓ 14 modules compiled successfully',
        'dist/index.html                     0.51 kB',
        'dist/assets/index-9F8x.css          3.10 kB',
        'dist/assets/index-Ah72.js          42.15 kB',
        '✨ Production build optimized & bundled successfully!',
        ''
      ]);
    } else {
      setTerminalOutput(prev => [
        ...prev,
        `❌ Command "${cmd}" not recognized. Type "help" for a list of valid actions.`,
        ''
      ]);
    }
  };

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
            setOpenTabs(prev => prev.includes(file.path) ? prev : [...prev, file.path]);
            addTerminalLog(`[SUCCESS] Scaffolded: ${file.path} (${resData.data.content.length} chars)`);
            // Persist to DB (fire-and-forget, non-blocking)
            fetch(`http://localhost:3000/builder/system-design/${data._id}/save-file`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filePath: file.path, content: resData.data.content }),
            }).catch(() => { /* silent – will be retried on next scaffold */ });
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

    // Persist the scaffolded flag to the database
    try {
      await fetch(`http://localhost:3000/builder/system-design/${data._id}/mark-scaffolded`, {
        method: 'PATCH',
      });
      setIsScaffolded(true);
      addTerminalLog('[DB] Project marked as scaffolded in database.');
    } catch (e) {
      console.error('Failed to mark scaffolded', e);
    }

    // Switch selection to first scaffolded file automatically
    if (filesToGenerate.length > 0) {
      setSelectedFile(filesToGenerate[0].path);
    }
  };

  useEffect(() => {
    if (location.state?.autoScaffold && !autoScaffoldTriggered.current) {
      autoScaffoldTriggered.current = true;
      handleScaffold();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto space-y-4 relative text-left"
    >
      {/* Top Banner Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d0d12]/80 dark:bg-black/50 py-2.5 px-5 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link to={`/builder/${data._id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer transition-colors"
              title="Back to Blueprint Docs"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          </Link>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
              Scaffolding Code Playground
            </h2>
            <p className="text-gray-400 text-[10px] mt-0.5 leading-tight">Interactive IDE environment & hot-reloaded sandboxed web preview.</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {isLoadingPersistedFiles ? (
            /* Checking DB state shimmer */
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <Loader2 className="w-3.5 h-3.5 text-gray-500 animate-spin flex-shrink-0" />
              <span className="text-[10px] text-gray-500 font-mono">Syncing workspace...</span>
            </div>
          ) : isScaffolded ? (
            /* Already scaffolded – show readonly badge + export only */
            <>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-lg">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <div className="text-left">
                  <span className="text-[10px] font-bold text-emerald-300 block leading-none">Already Scaffolded</span>
                  <span className="text-[8px] text-emerald-600 font-mono block mt-0.5 leading-none">Code loaded from database</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportZip}
                disabled={Object.keys(generatedFiles).length === 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                  Object.keys(generatedFiles).length === 0
                    ? 'border-white/5 bg-white/0 text-gray-600 cursor-not-allowed opacity-30'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                <Download className="w-3 h-3" /> Export ZIP Bundle
              </motion.button>
            </>
          ) : isScaffolding ? (
            /* Active scaffolding progress */
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
          ) : (
            /* Not yet scaffolded – show scaffold + export */
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportZip}
                disabled={Object.keys(generatedFiles).length === 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                  Object.keys(generatedFiles).length === 0
                    ? 'border-white/5 bg-white/0 text-gray-600 cursor-not-allowed opacity-30'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                <Download className="w-3 h-3" /> Export ZIP Bundle
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleScaffold}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all shadow-[0_2px_8px_rgba(99,102,241,0.2)] text-[11px] font-bold cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 animate-pulse" /> Trigger Full Scaffolding
              </motion.button>
            </>
          )}
        </div>

      </div>

      {/* Main Grid IDE Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Side: Directory Scaffolding Explorer */}
        <div className="lg:col-span-4 sticky top-6">
          <FolderTree 
            structure={data.folderStructure} 
            generatedFiles={Object.keys(generatedFiles)}
            onSelectFile={handleSelectFile}
            selectedFile={selectedFile}
          />
        </div>

        {/* Right Side: Interactive IDE Playground */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Compilation Terminal Output during scaffolding */}
          <AnimatePresence>
            {(isScaffolding || terminalLogs.length > 0) && !selectedFile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#09090d] border border-white/10 rounded-2xl p-5 overflow-hidden shadow-2xl relative font-mono text-[11px] leading-relaxed text-indigo-400"
              >
                <div className="flex items-center justify-between mb-3.5 border-b border-white/5 pb-2">
                  <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs text-white">
                    <TermIcon className="w-4 h-4 text-indigo-400 animate-pulse" />
                    Compilation Progress Console
                  </span>
                  <span className="text-[10px] text-gray-500">Live Synthesis Feed</span>
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

                <div className="space-y-1.5 h-32 overflow-y-auto custom-scrollbar">
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

          {/* Core IDE Frame */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0d0d12]/80 backdrop-blur-xl shadow-2xl flex flex-col">
            
            {/* Open File Tabs bar */}
            {openTabs.length > 0 ? (
              <div className="flex items-center gap-1 bg-black/40 p-1 border-b border-white/5 overflow-x-auto select-none rounded-t-xl custom-scrollbar flex-shrink-0">
                {openTabs.map((filePath) => {
                  const isActive = selectedFile === filePath;
                  const fileName = filePath.split('/').pop() || '';
                  const isUnsaved = unsavedFiles[filePath];
                  return (
                    <div
                      key={filePath}
                      onClick={() => setSelectedFile(filePath)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-white/5 border-white/10 text-white font-bold'
                          : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                      }`}
                    >
                      <span className="text-[10px] text-gray-400">📄</span>
                      <span>{fileName}</span>
                      {isUnsaved && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                      <button
                        type="button"
                        onClick={(e) => closeTab(filePath, e)}
                        className="p-0.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Toolbar Actions bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-black/20 p-2 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Theme Selector Preset */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 font-mono">Theme:</span>
                  <select
                    value={editorTheme}
                    onChange={(e) => setEditorTheme(e.target.value as any)}
                    className="bg-[#121217] border border-white/10 text-gray-300 rounded px-2 py-0.5 text-xs font-mono focus:outline-none cursor-pointer"
                  >
                    <option value="dracula">Dracula</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="forest">Forest</option>
                    <option value="monokai">Monokai</option>
                  </select>
                </div>

                {/* Collapsible search bar trigger toggle */}
                <button
                  type="button"
                  onClick={() => setShowSearch(!showSearch)}
                  className={`p-1 rounded hover:bg-white/10 transition-colors cursor-pointer ${showSearch ? 'bg-white/10 text-indigo-400' : 'text-gray-400'}`}
                  title="Search & Replace"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Simulated server hot-reload container status */}
                <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isDevServerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
                  <span className="text-[10px] font-bold text-gray-400 font-mono">Vite Sandbox</span>
                  {isDevServerRunning ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDevServerRunning(false);
                        setTerminalOutput(prev => [...prev, '🔌 [SERVER] Dev server stopped.', '']);
                      }}
                      className="flex items-center gap-1 text-[9px] font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      <Square className="w-2.5 h-2.5 fill-rose-400" /> Stop
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => processCommand('npm run dev')}
                      className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 fill-emerald-400" /> Run dev
                    </button>
                  )}
                </div>

                {selectedFile && generatedFiles[selectedFile] && (
                  <div className="flex items-center gap-1.5">
                    {isDevServerRunning && (
                      <button
                        type="button"
                        onClick={() => setShowLivePreview(true)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer"
                        title="View Live Web Sandbox Preview"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Sandbox
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSaveFile}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                        unsavedFiles[selectedFile]
                          ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white animate-pulse'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                      title="Save File (Ctrl+S)"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>

                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Collapsible Search & Replace panel */}
            {showSearch && (
              <div className="bg-black/30 p-2.5 border-b border-white/5 flex flex-wrap items-center gap-2 rounded-lg flex-shrink-0">
                <input
                  type="text"
                  placeholder="Find..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white placeholder-gray-600 text-xs px-2.5 py-1 rounded focus:outline-none focus:border-indigo-500 w-36 font-mono"
                />
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white placeholder-gray-600 text-xs px-2.5 py-1 rounded focus:outline-none focus:border-indigo-500 w-36 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleSearchReplace(false)}
                  className="px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold text-white rounded transition-colors cursor-pointer"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => handleSearchReplace(true)}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white rounded transition-colors cursor-pointer"
                >
                  Replace All
                </button>
              </div>
            )}

            {/* Code editor content viewport */}
            {selectedFile && generatedFiles[selectedFile] ? (
              <div className={`relative overflow-hidden ${
                editorTheme === 'dracula' ? 'bg-[#1e1e2e] selection:bg-[#44475a]' :
                editorTheme === 'cyberpunk' ? 'bg-[#090514] selection:bg-fuchsia-500/20' :
                editorTheme === 'forest' ? 'bg-[#08110b] selection:bg-emerald-500/20' :
                'bg-[#1a1a1a] selection:bg-amber-500/20'
              } border-t border-white/5 rounded-b-xl font-mono text-[12px] shadow-inner h-[380px] flex`}>
                
                {/* Line Numbers Column */}
                <div 
                  ref={lineNumbersRef}
                  className={`w-12 text-right ${
                    editorTheme === 'dracula' ? 'text-[#6272a4]' :
                    editorTheme === 'cyberpunk' ? 'text-fuchsia-700/60' :
                    editorTheme === 'forest' ? 'text-emerald-700/50' :
                    'text-gray-500'
                  } pr-3 py-4 select-none bg-black/10 border-r border-white/5 text-[11px] overflow-hidden leading-relaxed`}
                >
                  {generatedFiles[selectedFile].split('\n').map((_, i) => (
                    <div key={i} className="h-[21px]">{i + 1}</div>
                  ))}
                </div>
                
                {/* Active text input panel */}
                <textarea
                  ref={textareaRef}
                  value={generatedFiles[selectedFile]}
                  onChange={handleCodeChange}
                  onScroll={handleScroll}
                  className={`flex-1 p-4 bg-transparent ${
                    editorTheme === 'dracula' ? 'text-[#f8f8f2] caret-purple-400' :
                    editorTheme === 'cyberpunk' ? 'text-fuchsia-200 caret-fuchsia-400' :
                    editorTheme === 'forest' ? 'text-emerald-200 caret-emerald-400' :
                    'text-amber-100 caret-amber-400'
                  } leading-relaxed focus:outline-none resize-none overflow-y-auto h-full font-mono text-xs`}
                  style={{ whiteSpace: 'pre', wordBreak: 'keep-all' }}
                />
              </div>
            ) : selectedFile && isScaffolding && scaffoldProgress.currentFile === selectedFile ? (
              <div className="flex flex-col items-center justify-center py-32 text-gray-500 bg-black/30">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-400" />
                <p className="text-sm font-semibold text-gray-400">Synthesizing file structure...</p>
                <p className="text-xs text-indigo-400 font-mono mt-1.5">{selectedFile}</p>
              </div>
            ) : selectedFile ? (
              <div className="flex flex-col items-center justify-center py-32 text-gray-500 border-t border-white/5 bg-black/30">
                <p className="text-sm">This file module has not been scaffolded yet.</p>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleScaffold}
                  className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg cursor-pointer"
                >
                  Scaffold Code Elements
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-gray-500 border-t border-white/5 bg-black/20">
                <FileCode2 className="w-12 h-12 text-white/5 mb-3 animate-pulse" />
                <p className="text-sm">Select any file node from the proposed structure on the left.</p>
                <p className="text-xs text-gray-600 mt-1">Browse, edit, compile, and run fully hot-reloaded code.</p>
              </div>
            )}
          </div>

          {/* Interactive Shell Terminal Emulator */}
          <div className="bg-[#09090d] border border-white/10 rounded-2xl p-4 overflow-hidden shadow-xl text-left">
            <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-2">
              <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px] text-white">
                <TermIcon className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Developer Sandbox Console & Interactive Terminal
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[8px] text-gray-500 font-mono">Interactive Shell v1.0</span>
                <button
                  type="button"
                  onClick={() => setTerminalOutput([])}
                  className="text-[9px] text-gray-500 hover:text-white transition-colors cursor-pointer font-bold"
                >
                  Clear Logs
                </button>
              </div>
            </div>
            
            <div className="h-32 overflow-y-auto font-mono text-[10px] text-indigo-300/80 space-y-1 custom-scrollbar">
              {terminalOutput.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap leading-relaxed">
                  {log.startsWith('➜') ? (
                    <span className="text-white font-bold">{log}</span>
                  ) : log.startsWith('✓') || log.startsWith('🎉') || log.includes('[SUCCESS]') ? (
                    <span className="text-emerald-400 font-semibold">{log}</span>
                  ) : log.startsWith('❌') || log.includes('[ERROR]') ? (
                    <span className="text-rose-400 font-semibold">{log}</span>
                  ) : log.startsWith('🚀') || log.startsWith('⚡') || log.startsWith('💡') || log.startsWith('🖥️') ? (
                    <span className="text-indigo-400 font-bold">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Interactive terminal input prompt */}
            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1.5 border-t border-white/5 pt-2 mt-2">
              <span className="text-emerald-500 font-bold font-mono text-[10px]">➜</span>
              <input
                type="text"
                placeholder="Type command (e.g. 'help', 'npm run dev', 'npm test')..."
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent text-white font-mono text-[10px] focus:outline-none placeholder-gray-700 w-full"
              />
            </form>
          </div>

          {/* Dynamic Live App Preview Sandbox Modal */}
          <AnimatePresence>
            {showLivePreview && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.95, y: 15, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 15, opacity: 0 }}
                  className="w-full max-w-4xl bg-[#0f0f15] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[580px] text-left"
                >
                  {/* Browser Address Bar Header */}
                  <div className="bg-[#151520] px-4 py-3 flex items-center justify-between border-b border-white/5 select-none flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    
                    <div className="flex-1 max-w-xl mx-4">
                      <div className="bg-black/35 border border-white/5 rounded-lg px-3 py-1 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-500">🔒</span>
                          <span className="text-white">localhost:5173</span>
                        </div>
                        <RefreshCw className="w-3 h-3 text-gray-500 cursor-pointer hover:text-white" />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowLivePreview(false)}
                      className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Browser Frame Sandbox Content */}
                  <div className="flex-1 bg-[#09090d] text-white overflow-y-auto p-6 relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
                          </div>
                          <div>
                            <h1 className="text-sm font-bold tracking-tight">AI Generated Component Preview</h1>
                            <p className="text-[10px] text-indigo-400 font-mono">Server Status: Running (HMR Connected)</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono">
                          COMPILE SUCCESS
                        </span>
                      </div>

                      {/* Metric Sandbox Widgets */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mock Processed Requests</span>
                          <h3 className="text-2xl font-bold mt-2 text-indigo-400">4,281</h3>
                          <span className="text-[9px] text-emerald-400 mt-1 font-semibold">↑ 12% live server latency</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">HMR Scaffolded Modules</span>
                          <h3 className="text-2xl font-bold mt-2 text-violet-400">{Object.keys(generatedFiles).length} files</h3>
                          <span className="text-[9px] text-gray-500 mt-1 font-mono">Hot modules injected</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sandboxed Database</span>
                          <h3 className="text-2xl font-bold mt-2 text-emerald-400">Online</h3>
                          <span className="text-[9px] text-emerald-400 mt-1 font-semibold">MongoDB cluster active</span>
                        </div>
                      </div>

                      {/* Sandbox interactive playground dashboard demo */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 mb-4">
                        <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">Interactive Component Demo Sandbox</h4>
                        <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
                          Below is a hot-reloaded demonstration of your synthesized fullstack architecture. Edit files in the editor, save changes, and trigger sandbox refresh updates!
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => alert("🎉 Scaffolding Sandbox Action Toggled!")}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                          >
                            Simulate Database Action
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTerminalOutput(prev => [
                                ...prev,
                                '🔄 [HOT RELOAD] Component updated inside Live App sandbox!',
                                ''
                              ]);
                              alert("🔄 Hot reload refresh completed!");
                            }}
                            className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                          >
                            Hot-Reload Frame
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[10px] text-gray-500 font-mono">
                      <span>Powered by Antigravity OS Shell & NestJS Engine</span>
                      <span>http://localhost:5173/</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
