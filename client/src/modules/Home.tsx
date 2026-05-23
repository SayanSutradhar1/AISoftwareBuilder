import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  Globe,
  Layers,
  MessageSquare,
  Minus,
  Plus,
  Rocket,
  Shield,
  Smartphone,
  Sparkles,
  Terminal,
  X,
  Zap
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors"
      >
        <span className="text-lg font-semibold">{question}</span>
        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Home = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: { staggerChildren: 0.1 },
  //   },
  // };

  // const itemVariants = {
  //   hidden: { y: 20, opacity: 0 },
  //   visible: { y: 0, opacity: 1 },
  // };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/40 selection:text-white overflow-x-hidden font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,0),rgba(5,5,5,1))]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <Code2 className="text-white w-6 h-6" />
            </motion.div>
            <span className="font-bold text-2xl tracking-tighter">ARCHITEX<span className="text-primary">.AI</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[13px] font-medium uppercase tracking-widest text-white/60">
            <a href="#features" className="hover:text-primary transition-colors">Capabilities</a>
            <a href="#engine" className="hover:text-primary transition-colors">The Engine</a>
            <a href="#showcase" className="hover:text-primary transition-colors">Showcase</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/chat">
              <Button variant="ghost" className="text-white/70 hover:text-white">Sign In</Button>
            </Link>
            <Link to="/my-space">
              <Button className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-bold tracking-tight">
                Get Early Access
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20">
          <motion.div 
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="container mx-auto px-6"
          >
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-foreground mb-8 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">v2.0 is now live</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl md:text-8xl lg:text-[100px] font-black tracking-tight leading-[0.9] mb-10"
              >
                UNLEASH THE <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-400 to-blue-500 animate-gradient-x">
                  INFINITE BUILDER
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                The world's first AI orchestrator that turns simple prompts into enterprise-grade system designs, dynamic web apps, and robust backends.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
              >
                <Link to="/my-space">
                  <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-primary hover:bg-primary/80 text-white font-black shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-all hover:scale-105">
                    START BUILDING FREE
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-full border-white/10 hover:bg-white/5 backdrop-blur-md font-bold">
                  WATCH THE REEL
                </Button>
              </motion.div>

              {/* Floating Dashboard Preview */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mt-24 relative max-w-6xl mx-auto"
              >
                <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-600 rounded-[2.5rem] blur opacity-25" />
                <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-4 shadow-2xl overflow-hidden aspect-21/9">
                  <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/20" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    <div className="ml-4 px-3 py-1 rounded-md bg-white/5 text-[10px] text-white/30 font-mono">
                      architex-workspace/project-delta
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-6 h-full">
                    <div className="col-span-3 border-r border-white/5 flex flex-col gap-4">
                      {[1,2,3,4].map(i => <div key={i} className="h-6 w-full bg-white/5 rounded" />)}
                    </div>
                    <div className="col-span-9 flex flex-col gap-4">
                      <div className="h-4 w-1/3 bg-primary/20 rounded" />
                      <div className="h-32 w-full bg-white/5 rounded flex items-center justify-center text-white/10 font-mono text-4xl font-bold">
                        {`{ BUILDER_READY }`}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 w-full bg-white/5 rounded" />
                        <div className="h-20 w-full bg-white/5 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Logo Cloud / Tech Stack */}
        <section className="py-20 border-y border-white/5 bg-white/2">
          <div className="container mx-auto px-6">
            <p className="text-center text-white/30 text-xs font-bold uppercase tracking-[0.3em] mb-12">Empowering Modern Tech Stacks</p>
            <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-40 grayscale">
              <div className="flex items-center gap-2 font-bold text-xl"><Globe className="w-6 h-6" /> NEXT.JS</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Database className="w-6 h-6" /> MONGODB</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Terminal className="w-6 h-6" /> SUPABASE</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Layers className="w-6 h-6" /> DOCKER</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Smartphone className="w-6 h-6" /> REACT NATIVE</div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-32">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <Badge className="mb-4 bg-primary/10 text-primary border-none">CORE ENGINE</Badge>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                  ONE ARCHITECT. <br />
                  INFINITE POSSIBILITIES.
                </h2>
              </div>
              <p className="text-white/40 max-w-sm text-lg leading-relaxed">
                Architex isn't just a code generator; it's a complete ecosystem for digital creation.
              </p>
            </div>

            <div className="grid md:grid-cols-4 grid-rows-2 gap-6 h-[800px] md:h-[600px]">
              {/* Feature 1: Large Box */}
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-linear-to-br from-primary/20 to-purple-900/20 border border-white/10 p-10 flex flex-col justify-end"
              >
                <div className="absolute top-10 right-10 p-6 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 group-hover:rotate-12 transition-transform">
                  <MessageSquare className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-4xl font-black mb-4">Neural Chat <br />Consultant</h3>
                <p className="text-white/50 text-lg max-w-md">
                  Brainstorm architecture, define requirements, and refine logic with an AI that knows your codebase inside out.
                </p>
              </motion.div>

              {/* Feature 2: Wide Box */}
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="md:col-span-2 relative group overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 p-10 flex flex-col justify-end"
              >
                <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Code2 className="w-24 h-24" />
                </div>
                <h3 className="text-3xl font-black mb-2">Automated Code Architect</h3>
                <p className="text-white/50">Generate full boilerplate and business logic in seconds.</p>
              </motion.div>

              {/* Feature 3: Normal Box */}
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="relative group overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 p-8 flex flex-col justify-between"
              >
                <Shield className="w-10 h-10 text-blue-400" />
                <div>
                  <h4 className="font-bold text-xl mb-2">Secure by Design</h4>
                  <p className="text-white/40 text-sm">Enterprise-grade security defaults.</p>
                </div>
              </motion.div>

              {/* Feature 4: Normal Box */}
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="relative group overflow-hidden rounded-[2.5rem] bg-linear-to-br from-blue-600/20 to-cyan-500/10 border border-white/10 p-8 flex flex-col justify-between"
              >
                <Zap className="w-10 h-10 text-cyan-400 animate-pulse" />
                <div>
                  <h4 className="font-bold text-xl mb-2">Instant Deploy</h4>
                  <p className="text-white/40 text-sm">Vercel & AWS native integration.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* The Engine / Process Section */}
        <section id="engine" className="py-32 bg-white/1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -z-10" />
          <div className="container mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-black mb-6">HOW IT WORKS</h2>
              <div className="h-1 w-24 bg-primary mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-16 relative">
              {/* Connecting Lines (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 -z-10" />
              
              <div className="text-center group">
                <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 group-hover:border-primary/50 transition-all group-hover:scale-110">
                  <span className="text-3xl font-black text-white/20 group-hover:text-primary">01</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Instruction</h4>
                <p className="text-white/40 leading-relaxed">Simply describe your vision in plain English. No technical jargon required.</p>
              </div>

              <div className="text-center group">
                <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 group-hover:border-primary/50 transition-all group-hover:scale-110">
                  <span className="text-3xl font-black text-white/20 group-hover:text-primary">02</span>
                </div>
                <h4 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Orchestration</h4>
                <p className="text-white/40 leading-relaxed">Our AI multi-agents deliberate and plan the full system architecture.</p>
              </div>

              <div className="text-center group">
                <div className="w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-8 group-hover:border-primary transition-all group-hover:scale-110 shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                  <Rocket className="w-10 h-10 text-primary" />
                </div>
                <h4 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Deployment</h4>
                <p className="text-white/40 leading-relaxed">The code is generated, tested, and ready to be deployed to your provider.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase / Portfolio */}
        <section id="showcase" className="py-32">
          <div className="container mx-auto px-6 text-center mb-20">
            <h2 className="text-5xl font-black mb-6">BUILT WITH ARCHITEX</h2>
            <p className="text-white/40 text-xl max-w-2xl mx-auto">See what others are building at light speed.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
            {[
              { title: "SaaS Dashboard", desc: "A full financial management suite.", img: "blue" },
              { title: "Creative Portfolio", desc: "3D animated gallery for artists.", img: "purple" },
              { title: "E-commerce Engine", desc: "High-performance store with AI search.", img: "cyan" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group relative rounded-[2rem] overflow-hidden border border-white/10 bg-white/5"
              >
                <div className={`h-64 w-full bg-${item.img}-500/10 flex items-center justify-center`}>
                  <div className="w-3/4 h-3/4 border-2 border-white/5 rounded-xl border-dashed" />
                </div>
                <div className="p-8">
                  <h4 className="text-2xl font-bold mb-2">{item.title}</h4>
                  <p className="text-white/40 mb-6">{item.desc}</p>
                  <Button variant="link" className="p-0 text-primary font-bold group-hover:gap-2 transition-all">
                    VIEW CASE STUDY <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[150px] -z-10" />
          <div className="container mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-6xl font-black mb-6">PRICING</h2>
              <p className="text-white/40 text-xl">Select a fuel grade for your project.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Plan 1 */}
              <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col">
                <h4 className="text-xl font-bold mb-4 uppercase text-white/50">Lite</h4>
                <div className="mb-8">
                  <span className="text-6xl font-black">$0</span>
                  <span className="text-white/30 ml-2">/MO</span>
                </div>
                <ul className="space-y-4 mb-10 grow">
                  {["3 Projects", "Static Export", "Basic AI Chat", "Community Access"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-white/60"><CheckCircle2 className="w-5 h-5 text-primary" /> {f}</li>
                  ))}
                </ul>
                <Button className="w-full h-14 rounded-2xl bg-white/10 text-white hover:bg-white/20">GET STARTED</Button>
              </div>

              {/* Plan 2: Featured */}
              <div className="p-10 rounded-[3rem] bg-primary border-4 border-primary shadow-[0_0_60px_rgba(var(--primary),0.3)] flex flex-col relative scale-105 z-20">
                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 bg-white text-primary rounded-full text-xs font-black">MOST POPULAR</div>
                <h4 className="text-xl font-bold mb-4 uppercase text-white/70">PRO</h4>
                <div className="mb-8">
                  <span className="text-6xl font-black text-white">$49</span>
                  <span className="text-white/70 ml-2">/MO</span>
                </div>
                <ul className="space-y-4 mb-10 grow">
                  {["Unlimited Projects", "Dynamic App Generation", "Backend Orchestration", "Custom Domains", "Priority Support"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-white font-medium"><CheckCircle2 className="w-5 h-5 text-white" /> {f}</li>
                  ))}
                </ul>
                <Button className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-white/90 font-black">GO PRO NOW</Button>
              </div>

              {/* Plan 3 */}
              <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col">
                <h4 className="text-xl font-bold mb-4 uppercase text-white/50">Titan</h4>
                <div className="mb-8">
                  <span className="text-6xl font-black">$199</span>
                  <span className="text-white/30 ml-2">/MO</span>
                </div>
                <ul className="space-y-4 mb-10 grow">
                  {["Everything in Pro", "System Design Blueprints", "Private AI Models", "White-label Output", "24/7 Dedicated Team"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-white/60"><CheckCircle2 className="w-5 h-5 text-primary" /> {f}</li>
                  ))}
                </ul>
                <Button className="w-full h-14 rounded-2xl bg-white/10 text-white hover:bg-white/20">CONTACT SALES</Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-4xl font-black mb-16 text-center">FREQUENTLY ASKED</h2>
            <div className="space-y-4">
              <FAQItem 
                question="What kind of applications can I build?"
                answer="Architex supports everything from simple React landing pages to complex full-stack applications with Node.js backends, MongoDB/PostgreSQL schemas, and integrated authentication. If it can be coded, Architex can build it."
              />
              <FAQItem 
                question="Do I own the code generated by Architex?"
                answer="Absolutely. All code generated is 100% yours. You can export it, modify it, and host it anywhere you like with zero vendor lock-in."
              />
              <FAQItem 
                question="How does the AI handle complex system designs?"
                answer="Architex uses a multi-agent orchestration system. One agent acts as the Lead Architect, another as the Security Expert, and another as the Senior Developer. They collaborate to ensure the output is robust and scalable."
              />
              <FAQItem 
                question="Can I integrate my own APIs?"
                answer="Yes! You can provide documentation or specs for your existing APIs, and Architex will generate the integration logic automatically."
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 relative">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto rounded-[4rem] bg-linear-to-r from-primary via-purple-600 to-blue-600 p-[2px]"
            >
              <div className="bg-[#050505] rounded-[3.9rem] py-20 px-10">
                <h2 className="text-5xl md:text-7xl font-black mb-10 leading-tight">
                  THE FUTURE OF SOFTWARE <br /> IS IN YOUR PROMPTS.
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <Link to="/my-space">
                    <Button size="lg" className="h-20 px-16 text-xl rounded-full bg-white text-black hover:bg-white/90 font-black">
                      BUILD YOUR VISION NOW
                    </Button>
                  </Link>
                  <p className="text-white/30 font-medium">Free forever for personal use. No credit card required.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-[#030303]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Code2 className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-2xl tracking-tighter">ARCHITEX.AI</span>
              </div>
              <p className="text-white/40 max-w-sm text-lg leading-relaxed mb-10">
                Revolutionizing software development through autonomous AI orchestration and neural code generation.
              </p>
              <div className="flex gap-6">
                <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-primary hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-primary hover:text-white transition-all">
                  <ExternalLink className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-primary hover:text-white transition-all">
                  <Globe className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.3em] text-primary mb-8">Product</h5>
              <ul className="space-y-4 text-white/50 font-bold">
                <li><a href="#" className="hover:text-white transition-colors">Neural Chat</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Code Architect</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.3em] text-primary mb-8">Company</h5>
              <ul className="space-y-4 text-white/50 font-bold">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 text-white/20 text-xs font-black uppercase tracking-[0.2em]">
            <p>© 2026 ARCHITEX AI SYSTEMS. BEYOND LIMITS.</p>
            <div className="flex gap-10 mt-8 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Status</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;