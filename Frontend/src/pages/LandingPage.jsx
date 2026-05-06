import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Users, 
  ShieldCheck, 
  Database, 
  Globe, 
  FileCheck, 
  BarChart3, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

/**
 * AGRISANGH: Verified Collective Farming Platform
 * UI/UX: Modern Indian Government-Tech Style
 */

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Problem', href: '#problem' },
    { name: 'Solution', href: '#solution' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Impact', href: '#impact' },
  ];

  return (
    <nav className="fixed w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-800 rounded flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">AgriSangh</span>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-green-800 px-1 pt-1 text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <button className="px-5 mx-3 py-2 rounded-md text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              Login
            </button>
            <button className="bg-green-800 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-green-900 transition-colors">
              Get Started
            </button>
          </div>
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-green-800"
              >
                {link.name}
              </a>
            ))}
            <button className="w-full text-left px-3 py-2 text-base font-medium text-green-800">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <div className="relative bg-white pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-800 border border-green-100 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2"></span>
            Digital India Agri-Infrastructure
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Transforming Fragmented Farmers Into <span className="text-green-800">One Trusted Unit</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            AgriSangh is a verified collective farming platform enabling small-hold farmers to operate with industrial scale. Build trust, ensure traceability, and access better markets without changing land ownership.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
            <button className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-md text-white bg-green-800 hover:bg-green-900 shadow-sm transition-all">
              Explore Platform <ArrowRight className="ml-2" size={18} />
            </button>
            <button className="flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-bold rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all">
              Learn More
            </button>
          </div>
        </div>
        <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-6 transform translate-y-4">
              <Users className="text-green-700 mb-4" size={32} />
              <div className="text-3xl font-bold text-gray-900">10k+</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Farmers Unified</div>
            </div>
            <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-6">
              <ShieldCheck className="text-green-700 mb-4" size={32} />
              <div className="text-3xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Verified Batches</div>
            </div>
            <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-6 transform translate-y-4">
              <FileCheck className="text-green-700 mb-4" size={32} />
              <div className="text-3xl font-bold text-gray-900">Zero</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Land Conflict</div>
            </div>
            <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-6">
              <BarChart3 className="text-green-700 mb-4" size={32} />
              <div className="text-3xl font-bold text-gray-900">2.4x</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Scale Efficiency</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProblemSection = () => {
  const problems = [
    { title: "Fragmented Land Holdings", desc: "Small plots make mechanization and modern tech adoption economically unviable." },
    { title: "Low Bargaining Power", desc: "Individual small farmers are forced to accept low prices from middle-men." },
    { title: "Lack of Traceability", desc: "Buyers cannot verify crop origin, leading to a massive trust deficit in the value chain." },
    { title: "Inaccessible Technology", desc: "High-end agri-tech remains out of reach for farmers operating at micro-scales." }
  ];

  return (
    <section id="problem" className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold tracking-widest text-green-800 uppercase mb-2">The Challenge</h2>
          <p className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Structural Barriers in Indian Agriculture</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((p, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-red-600 font-bold text-xl mb-4">0{idx + 1}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{p.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SolutionSection = () => (
  <section id="solution" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
        <div>
          <h2 className="text-xs font-bold tracking-widest text-green-800 uppercase mb-2">Our Solution</h2>
          <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">The AgriSangh Coordination Infrastructure</h3>
          <p className="text-lg text-gray-600 mb-8">
            We provide a digital layer that aggregates small farmers into "Sanghs" (Collectives), allowing them to function as a large-scale agricultural corporation.
          </p>
          <div className="space-y-6">
            {[
              { icon: Users, title: "Collective Identity", desc: "Formalized digital identity for farmer groups." },
              { icon: ShieldCheck, title: "Verified Crop Batches", desc: "Traceable batch IDs for every collective harvest." },
              { icon: Database, title: "Transparent Tracking", desc: "Every contribution is recorded on an immutable ledger." },
              { icon: Globe, title: "Buyer Verification", desc: "A portal for buyers to verify source and quality standards." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <item.icon className="text-green-800" size={24} />
                </div>
                <div>
                  <h4 className="text-md font-bold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 lg:mt-0 relative">
          <div className="bg-green-900 rounded-3xl p-8 text-white shadow-2xl">
             <div className="flex justify-between items-center mb-8 border-b border-green-700 pb-4">
                <span className="text-sm font-mono opacity-80">VERIFIED DASHBOARD // ID-8829</span>
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
             </div>
             <div className="space-y-6">
                <div className="h-16 bg-green-800/50 rounded-xl border border-green-700 p-4 flex items-center justify-between">
                  <span className="text-sm">Batch #772 - Basmati Rice</span>
                  <span className="bg-green-500 text-[10px] px-2 py-1 rounded font-bold">VERIFIED</span>
                </div>
                <div className="h-16 bg-green-800/50 rounded-xl border border-green-700 p-4 flex items-center justify-between">
                  <span className="text-sm">Collective Yield Est.</span>
                  <span className="text-lg font-bold">42.5 Tons</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-10 bg-green-800/50 rounded-lg border border-green-700"></div>
                  <div className="h-10 bg-green-800/50 rounded-lg border border-green-700"></div>
                  <div className="h-10 bg-green-800/50 rounded-lg border border-green-700"></div>
                </div>
             </div>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white border border-gray-200 p-6 rounded-2xl shadow-lg hidden sm:block">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600" />
              <span className="text-sm font-bold text-gray-900">Audit-Ready Documentation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Workflow = () => {
  const steps = [
    { title: "Registration", desc: "Farmers onboard with KYC and land verification." },
    { title: "Formation", desc: "AI-assisted grouping of farmers based on geography." },
    { title: "Coordination", desc: "Unified crop planning and input procurement." },
    { title: "Harvest", desc: "Collective batch creation and quality tagging." },
    { title: "Verification", desc: "Direct sale to verified institutional buyers." }
  ];

  return (
    <section id="workflow" className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold tracking-widest text-green-800 uppercase mb-2">The Process</h2>
          <p className="text-3xl font-extrabold text-gray-900">Seamless Digital Transition</p>
        </div>
        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-200"></div>
          <div className="grid lg:grid-cols-5 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center">
                <div className="w-12 h-12 bg-green-800 text-white rounded-full flex items-center justify-center font-bold z-10 mb-6 shadow-lg shadow-green-200">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-center text-sm text-gray-500 px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Impact = () => (
  <section id="impact" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-green-800 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6">Building National Agri-Resilience</h2>
          <div className="grid sm:grid-cols-3 gap-12">
            <div>
              <div className="text-4xl font-extrabold mb-2">35%</div>
              <div className="text-green-100 text-sm">Reduction in Input Costs</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">2.5x</div>
              <div className="text-green-100 text-sm">Increase in Market Reach</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold mb-2">100%</div>
              <div className="text-green-100 text-sm">Traceability Compliance</div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-green-700 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-green-700 rounded-full opacity-20"></div>
      </div>
    </div>
  </section>
);

const Vision = () => (
  <section className="py-20 bg-white border-t border-gray-100">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">The Future of Indian Farming</h2>
      <p className="text-xl text-gray-600 italic leading-relaxed">
        "Our vision is to build the coordination infrastructure that allows the smallest farmer in India to operate with the sophistication of a global agriculture enterprise—without ever giving up their land."
      </p>
      <div className="mt-8 flex justify-center items-center gap-4">
        <div className="h-px w-12 bg-gray-300"></div>
        <span className="text-sm font-bold text-green-800 uppercase tracking-widest">AgriSangh Vision 2030</span>
        <div className="h-px w-12 bg-gray-300"></div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-green-800 rounded flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">AgriSangh</span>
          </div>
          <p className="text-gray-600 text-sm max-w-sm">
            The verified collective farming platform for India. Enabling modern agricultural coordination through digital-first infrastructure.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6">Links</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#problem" className="hover:text-green-800 transition-colors">Problem</a></li>
            <li><a href="#solution" className="hover:text-green-800 transition-colors">Solution</a></li>
            <li><a href="#workflow" className="hover:text-green-800 transition-colors">Workflow</a></li>
            <li><a href="#impact" className="hover:text-green-800 transition-colors">Impact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6">Legal</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Data Security</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium uppercase tracking-widest">
        <span>© 2026 AgriSangh. All Rights Reserved.</span>
        <span>A Digital India Initiative Startup</span>
      </div>
    </div>
  </footer>
);

export default function AgriSanghLanding() {
  return (
    <div className="min-h-screen font-sans bg-white text-gray-900">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <Workflow />
      <Impact />
      <Vision />
      <Footer />
    </div>
  );
}