import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Terminal, Activity, Code2, Plus, ArrowRight, Zap, Shield, HelpCircle } from 'lucide-react';

export default function WelcomeScreen() {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };


  const stats = [
    { label: 'Scaffolds Synthesized', value: '142+', icon: Code2, color: 'text-indigo-400' },
    { label: 'Compiler Integrity', value: '100%', icon: Shield, color: 'text-emerald-400' },
    { label: 'System Active Node Hours', value: '4,821h', icon: Activity, color: 'text-fuchsia-400' },
    { label: 'Avg Deliberation Time', value: '42s', icon: Zap, color: 'text-amber-400' }
  ];

  const quickStartTemplates = [
    {
      title: 'AI Collaborative Canvas',
      tier: 'Custom Fullstack',
      desc: 'Real-time whiteboarding canvas with team cursor sync and serverless exports.',
    },
    {
      title: 'High-Scale Storefront v2',
      tier: 'Dynamic Web App',
      desc: 'Performant product listings, interactive dynamic cart updates, and payment checkout flow.',
    },
    {
      title: 'Agency Studio Portfolio',
      tier: 'Static Website',
      desc: 'Animated high-quality digital agency showcase featuring sleek HSL glassmorphic contacts.',
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto py-8 space-y-10 relative"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Welcome Card */}
      <motion.div 
        variants={itemVariants}
        className="relative bg-gradient-to-br from-[#0c0c12]/90 via-[#0e0e16]/80 to-[#07070b]/90 border border-white/5 rounded-3xl p-8 md:p-12 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between"
      >
        <div className="absolute inset-0 bg-radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.08),transparent_60%)" />
        
        <div className="max-w-xl relative z-10 space-y-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Elite Orchestrator Platform
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Welcome to the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-fuchsia-400">
              AI Software Scaffolder
            </span>
          </h1>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
            Unleash multi-agent AI deliberation to transform your conceptual requirements into verified, high-performance system designs and structural source code.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link to="/builder/new">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-xs font-extrabold tracking-wider transition-all shadow-[0_8px_25px_rgba(99,102,241,0.3)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.45)] cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                CREATE NEW BUILDING
                <ArrowRight className="w-4 h-4 text-white/80" />
              </motion.button>
            </Link>

            <a href="#quickstart" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-gray-400" />
                Explore Guidelines
              </motion.button>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, y: -1 }}
              className="bg-[#07070b]/60 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4 backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl md:text-3xl font-black text-white">{stat.value}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* How it works Guidelines */}
      <motion.div 
        variants={itemVariants}
        id="quickstart"
        className="bg-[#07070b]/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-md"
      >
        <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          Scaffolding Lifecycle
        </span>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">1</span>
            <h4 className="font-bold text-sm text-gray-200">State Requirements</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Enter prompts describing the target application functionality, events, and transactional pipelines in the wizard.</p>
          </div>
          <div className="space-y-2.5">
            <span className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs">2</span>
            <h4 className="font-bold text-sm text-gray-200">System Synthesis</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">The AI models deliberate to define full-stack blueprints, database models, API endpoint maps, and file systems.</p>
          </div>
          <div className="space-y-2.5">
            <span className="w-7 h-7 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center font-bold text-xs">3</span>
            <h4 className="font-bold text-sm text-gray-200">Compile & Code</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Browse files in the dynamic folder tree explorer, kick off live file compiles, and export zipped code models directly.</p>
          </div>
        </div>
      </motion.div>

      {/* Suggested Templates */}
      <motion.div 
        variants={itemVariants}
        className="space-y-4"
      >
        <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block">
          Featured Scaffolder Templates
        </span>
        <div className="grid md:grid-cols-3 gap-4">
          {quickStartTemplates.map((template, idx) => (
            <Link key={idx} to="/builder/new" className="block group">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="h-full bg-[#08080c]/60 hover:bg-[#0b0b12]/80 border border-white/5 hover:border-indigo-500/20 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{template.title}</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400/90">{template.tier}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{template.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-indigo-400 group-hover:text-indigo-300 font-extrabold uppercase tracking-wider">
                  Open Prompt
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
