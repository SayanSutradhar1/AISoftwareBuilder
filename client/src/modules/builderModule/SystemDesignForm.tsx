import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Code2, Database, HelpCircle, Layout, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';

interface FormProps {
  onSubmit: (data: { projectName: string; serviceType: string; description: string; dataFlow: string }) => void;
  isLoading: boolean;
}

const promptSuggestions = [
  {
    title: 'AI Collaborative Canvas',
    badge: 'Custom Fullstack',
    type: 'CUSTOM',
    description: 'A real-time collaborative whiteboarding and design canvas workspace for remote teams, featuring visual editing tools, AI image expansion, and dynamic team cursors.',
    dataFlow: 'User joins session -> Cursors synchronized via WebSockets -> Updates broadcasted -> Canvas state periodically persisted to MongoDB -> AI generator expands sketched layout on demand.'
  },
  {
    title: 'High-Scale E-Commerce Platform',
    badge: 'Dynamic Web App',
    type: 'DYNAMIC',
    description: 'An advanced next-gen storefront with high-performance product browsing, multi-category advanced search, instant cart updates, and a modern customer dashboard.',
    dataFlow: 'User browses optimized static listing catalog -> Client updates dynamic basket with localized Redux state -> User enters checkout -> Dynamic API verifies payment and updates stock ledger.'
  },
  {
    title: 'Modern Portfolio & Studio',
    badge: 'Static Website',
    type: 'STATIC',
    description: 'A premium, highly interactive digital agency studio portfolio showcasing creative projects, responsive case studies, and modern HSL glassmorphism contact inquiries.',
    dataFlow: 'User lands on animated landing portal -> Smooth scrolling triggers custom GPU-accelerated case study reveals -> Inquiries captured by client form and routed directly to serverless mailer.'
  }
];

export default function SystemDesignForm({ onSubmit, isLoading }: FormProps) {
  const [projectName, setProjectName] = useState('');
  const [serviceType, setServiceType] = useState('STATIC');
  const [description, setDescription] = useState('');
  const [dataFlow, setDataFlow] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !description.trim() || !dataFlow.trim()) return;
    onSubmit({ projectName, serviceType, description, dataFlow });
  };

  const applySuggestion = (suggestion: typeof promptSuggestions[0]) => {
    setProjectName(suggestion.title + ' Prototype');
    setServiceType(suggestion.type);
    setDescription(suggestion.description);
    setDataFlow(suggestion.dataFlow);
  };

  const types = [
    { 
      id: 'STATIC', 
      label: 'Static Website', 
      icon: Layout, 
      color: 'from-blue-500 to-indigo-500', 
      glow: 'rgba(59, 130, 246, 0.15)',
      desc: 'Optimized static generators or single page portals.' 
    },
    { 
      id: 'DYNAMIC', 
      label: 'Dynamic Web App', 
      icon: Database, 
      color: 'from-indigo-500 to-violet-500', 
      glow: 'rgba(99, 102, 241, 0.15)',
      desc: 'Robust state managers, interactive charts, and REST client.' 
    },
    { 
      id: 'CUSTOM', 
      label: 'Custom Fullstack', 
      icon: Code2, 
      color: 'from-violet-500 to-fuchsia-500', 
      glow: 'rgba(168, 85, 247, 0.15)',
      desc: 'Complex endpoints, database layers, and multi-agent queues.' 
    },
  ];

  return (
    <div className="relative">
      {/* Decorative ambient glow bubbles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto p-6 md:p-10 rounded-[2rem] bg-[#0d0d12]/60 dark:bg-black/40 backdrop-blur-2xl border border-white/10 dark:border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0H0v15h15V0zm15 15H15v15h15V15z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} 
        />

        {/* Wizard Header */}
        <div className="mb-10 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">Elite Architect Mode</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-fuchsia-300">
            Design Your Application
          </h2>
          <p className="text-gray-400 mt-2 text-sm max-w-xl mx-auto">
            Describe your vision. Our multi-agent AI system will deliberate and scaffold a ready-to-code architecture.
          </p>
        </div>

        {/* Suggestion Chips */}
        <div className="mb-8 relative z-10">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Fast templates
          </span>
          <div className="flex flex-wrap gap-2.5">
            {promptSuggestions.map((suggestion, idx) => (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applySuggestion(suggestion)}
                className="px-4 py-2 text-xs rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left text-gray-300 hover:text-white flex items-center gap-2 group backdrop-blur-sm cursor-pointer"
              >
                <span>{suggestion.title}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 font-bold transition-all">
                  {suggestion.badge}
                </span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-indigo-400" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Core Form */}
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {/* Project Name Input */}
          <div className="relative">
            <label htmlFor="projectName" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center justify-between">
              <span>1. Project Name</span>
              <span className="text-[10px] text-gray-500 font-light">Enter a unique identifier</span>
            </label>
            <div className="relative rounded-2xl overflow-hidden">
              <input
                id="projectName"
                type="text"
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={`w-full p-4 bg-[#14141b]/60 dark:bg-black/50 border text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${
                  focusedField === 'name'
                    ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)] bg-[#161622]/80'
                    : 'border-white/5'
                }`}
                placeholder="Give your project a name (e.g. My SaaS Dashboard, E-Commerce Engine...)"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
              <AnimatePresence>
                {focusedField === 'name' && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 origin-left"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Complexity Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
              2. Choose Architecture Tier
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {types.map((type) => {
                const IconComponent = type.icon;
                const isSelected = serviceType === type.id;
                return (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setServiceType(type.id)}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500/80 bg-indigo-500/5'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                    style={{
                      boxShadow: isSelected ? `0 10px 30px -10px ${type.glow}` : 'none'
                    }}
                  >
                    {/* Glowing Accent Ring on Selected Card */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent_50%)" />
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${type.color} text-white shadow-lg`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <motion.div 
                          layoutId="selected-indicator"
                          className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"
                        />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-sm text-white mb-1.5 flex items-center gap-1.5">
                        {type.label}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">{type.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="relative">
            <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center justify-between">
              <span>3. Application Description</span>
              <span className="text-[10px] text-gray-500 font-light">Describe key features</span>
            </label>
            <div className="relative rounded-2xl overflow-hidden">
              <textarea
                id="description"
                rows={4}
                onFocus={() => setFocusedField('desc')}
                onBlur={() => setFocusedField(null)}
                className={`w-full p-4 bg-[#14141b]/60 dark:bg-black/50 border text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none ${
                  focusedField === 'desc'
                    ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)] bg-[#161622]/80'
                    : 'border-white/5'
                }`}
                placeholder="Describe your web app (e.g. A next-gen analytics suite with client panels, real-time metrics feeds, and custom user reports...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <AnimatePresence>
                {focusedField === 'desc' && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-fuchsia-500 origin-left"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Data Flow Textarea */}
          <div className="relative">
            <label htmlFor="dataFlow" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center justify-between">
              <span>4. Data Flow & Event Pipelines</span>
              <span className="text-[10px] text-gray-500 font-light">Map critical steps</span>
            </label>
            <div className="relative rounded-2xl overflow-hidden">
              <textarea
                id="dataFlow"
                rows={4}
                onFocus={() => setFocusedField('flow')}
                onBlur={() => setFocusedField(null)}
                className={`w-full p-4 bg-[#14141b]/60 dark:bg-black/50 border text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none ${
                  focusedField === 'flow'
                    ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)] bg-[#161622]/80'
                    : 'border-white/5'
                }`}
                placeholder="Trace the business logic steps (e.g. User navigates dashboard -> Requests real-time update -> Socket connects backend -> Updates fetched from DB and broadcasted...)"
                value={dataFlow}
                onChange={(e) => setDataFlow(e.target.value)}
                required
              />
              <AnimatePresence>
                {focusedField === 'flow' && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-indigo-500 origin-left"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-4 border-t border-white/5">
            <motion.button
              type="submit"
              whileHover={isLoading || !description.trim() || !dataFlow.trim() ? {} : { scale: 1.03, y: -2 }}
              whileTap={isLoading || !description.trim() || !dataFlow.trim() ? {} : { scale: 0.97 }}
              disabled={isLoading || !description.trim() || !dataFlow.trim()}
              className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 shadow-xl cursor-pointer ${
                isLoading || !description.trim() || !dataFlow.trim()
                  ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:shadow-[0_15px_30px_rgba(99,102,241,0.3)]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm font-semibold tracking-wide">Deliberating Architecture...</span>
                </div>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
                  <span className="text-sm font-semibold tracking-wide">Synthesize Architecture</span>
                  <ArrowRight className="w-4 h-4 text-white/80" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
