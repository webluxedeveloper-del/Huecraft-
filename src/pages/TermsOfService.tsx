import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Info, AlertCircle, DollarSign, ShieldAlert, User, XCircle, ExternalLink, Copyright, RefreshCw, CheckCircle, Mail } from 'lucide-react';

const sections = [
  { id: 'introduction', title: '1. Introduction', icon: FileText },
  { id: 'website-purpose', title: '2. Website Purpose', icon: Info },
  { id: 'service-disclaimer', title: '3. Service Disclaimer', icon: AlertCircle },
  { id: 'pricing-disclaimer', title: '4. Pricing Disclaimer', icon: DollarSign },
  { id: 'no-guarantee', title: '5. No Guarantee Clause', icon: AlertCircle },
  { id: 'liability', title: '6. Limitation of Liability', icon: ShieldAlert },
  { id: 'user-responsibilities', title: '7. User Responsibilities', icon: User },
  { id: 'cancellation', title: '8. Cancellation / Modification', icon: XCircle },
  { id: 'third-party', title: '9. Third-Party Links', icon: ExternalLink },
  { id: 'intellectual-property', title: '10. Intellectual Property', icon: Copyright },
  { id: 'changes', title: '11. Changes to Terms', icon: RefreshCw },
  { id: 'acceptance', title: '12. Acceptance', icon: CheckCircle },
];

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    document.title = 'Terms of Service | Huecraft Luxury Homes';
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold mb-4 block">
            Legal Framework
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-luxury-ink mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-luxury-gray max-w-2xl mx-auto font-light">
            Please read these terms carefully before using our website or services. They outline our mutual rights and responsibilities.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-luxury-ink/40 mb-6 px-4">
                On this page
              </p>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 flex items-center gap-3 ${
                    activeSection === section.id 
                      ? 'bg-luxury-gold/5 text-luxury-gold font-semibold shadow-premium-sm' 
                      : 'text-luxury-gray hover:bg-luxury-divider/50 hover:text-luxury-ink'
                  }`}
                >
                  <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-luxury-gold' : 'text-luxury-gray/40'}`} />
                  {section.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 max-w-3xl">
            <div className="space-y-20">
              {/* 1. Introduction */}
              <section id="introduction" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">1. Introduction</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    Welcome to <strong>Huecraft Luxury Homes</strong>. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions.
                  </p>
                  <p>
                    These Terms of Service govern your use of our website and any inquiries or preliminary services requested through it. If you do not agree with any part of these terms, please do not use our website.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 2. Website Purpose */}
              <section id="website-purpose" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">2. Website Purpose</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    <strong>The information provided on this website is for informational and inquiry purposes only.</strong>
                  </p>
                  <p>
                    Submitting a request for a quote, proposal, or consultation through this website does not constitute a final contract for services. A formal, legally binding agreement is only established once a separate written contract is signed by both you and an authorized representative of Huecraft Luxury Homes.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 3. Service Disclaimer */}
              <section id="service-disclaimer" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">3. Service Disclaimer</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    Our ability to provide specific services and the feasibility of any design or construction work depends entirely on a professional site inspection and detailed assessment.
                  </p>
                  <p>
                    Preliminary advice or suggestions provided through the website are based on the information you provide and are subject to change upon physical inspection of the property and verification of site conditions.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 4. Pricing Disclaimer */}
              <section id="pricing-disclaimer" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">4. Pricing Disclaimer</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    Any prices, estimates, or "starting from" figures mentioned on this website are <strong>estimates only</strong>.
                  </p>
                  <p>
                    Final pricing is determined by the specific scope of work, materials selected, site complexities, and current market rates. We reserve the right to adjust estimates as more detailed information becomes available during the consultation process.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 5. No Guarantee Clause */}
              <section id="no-guarantee" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">5. No Guarantee Clause</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    While we strive for excellence, Huecraft Luxury Homes does not guarantee:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Exact matches for finishes, colors, or textures shown in digital renderings or photographs.</li>
                    <li>Specific completion dates, as construction timelines are subject to weather, supply chain issues, and regulatory approvals.</li>
                    <li>The availability of specific materials or third-party products at all times.</li>
                  </ul>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 6. Limitation of Liability */}
              <section id="liability" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">6. Limitation of Liability</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    To the maximum extent permitted by law, Huecraft Luxury Homes shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our website or services.
                  </p>
                  <p>
                    We are not responsible for delays caused by external conditions (e.g., natural disasters, labor strikes) or unforeseen site issues discovered after the commencement of work (e.g., structural defects, hidden hazardous materials).
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 7. User Responsibilities */}
              <section id="user-responsibilities" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">7. User Responsibilities</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>As a user of our website and services, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate, current, and complete information in all forms and communications.</li>
                    <li>Cooperate fully during the consultation and service process.</li>
                    <li>Ensure you have the legal right to request services for the property in question.</li>
                  </ul>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 8. Cancellation / Modification */}
              <section id="cancellation" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">8. Cancellation / Modification</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    Policies regarding the cancellation or modification of services will be defined in your specific service contract.
                  </p>
                  <p>
                    Huecraft Luxury Homes reserves the right to cancel or modify any preliminary inquiry or consultation if the information provided is found to be inaccurate or if the project falls outside our scope of expertise.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 9. Third-Party Links */}
              <section id="third-party" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">9. Third-Party Links</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    Our website may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of these websites and accept no responsibility for them or for any loss or damage that may arise from your use of them.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 10. Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <Copyright className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">10. Intellectual Property</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    All content on this website, including text, graphics, logos, images, and software, is the property of Huecraft Luxury Homes or its content suppliers and is protected by international copyright laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, or create derivative works from any part of this website without our express written permission.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 11. Changes to Terms */}
              <section id="changes" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">11. Changes to Terms</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    We reserve the right to update or modify these Terms of Service at any time without prior notice. Your continued use of the website following any changes constitutes your acceptance of the new terms.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 12. Acceptance */}
              <section id="acceptance" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">12. Acceptance</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    By using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                  </p>
                  <p>
                    If you have any questions regarding these terms, please contact us at <a href="mailto:Huecrafthomes@gmail.com" className="text-luxury-gold font-medium hover:underline">Huecrafthomes@gmail.com</a>.
                  </p>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
