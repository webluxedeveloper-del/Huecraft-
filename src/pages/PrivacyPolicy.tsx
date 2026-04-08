import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail, Phone } from 'lucide-react';

const sections = [
  { id: 'introduction', title: '1. Introduction', icon: Shield },
  { id: 'information-collect', title: '2. Information We Collect', icon: Database },
  { id: 'how-we-use', title: '3. How We Use Information', icon: Eye },
  { id: 'data-sharing', title: '4. Data Sharing Policy', icon: Globe },
  { id: 'data-security', title: '5. Data Security', icon: Lock },
  { id: 'cookies', title: '6. Cookies', icon: Database },
  { id: 'user-rights', title: '7. User Rights', icon: UserCheck },
  { id: 'third-party', title: '8. Third-Party Services', icon: Globe },
  { id: 'consent', title: '9. Consent', icon: UserCheck },
  { id: 'contact', title: '10. Contact Information', icon: Mail },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    document.title = 'Privacy Policy | Huecraft Luxury Homes';
    
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
            Legal Transparency
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-luxury-ink mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-luxury-gray max-w-2xl mx-auto font-light">
            Your privacy is important to us. We are committed to protecting your personal data and being transparent about how we collect and use it.
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
                    <Shield className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">1. Introduction</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    Welcome to <strong>Huecraft Luxury Homes</strong>. We value the trust you place in us when sharing your personal information.
                  </p>
                  <p>
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. We are committed to ensuring that your privacy is protected and that we comply with applicable data protection laws.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 2. Information We Collect */}
              <section id="information-collect" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">2. Information We Collect</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services. The personal information we collect may include:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Personal Identifiers:</strong> Name, email address, and phone number.</li>
                    <li><strong>Project Details:</strong> Information regarding your property, design preferences, and specific service requirements.</li>
                    <li><strong>Communication Data:</strong> Any messages, inquiries, or feedback submitted via our contact forms or email.</li>
                  </ul>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 3. How We Use Information */}
              <section id="how-we-use" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">3. How We Use Information</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>We use the information we collect for various purposes, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To contact you regarding your inquiries and project requests.</li>
                    <li>To provide, operate, and maintain our services.</li>
                    <li>To improve, personalize, and expand our website and service offerings.</li>
                    <li>To understand and analyze how you use our website.</li>
                    <li>To send you administrative information, such as updates to our terms or policies.</li>
                  </ul>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 4. Data Sharing Policy */}
              <section id="data-sharing" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">4. Data Sharing Policy</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    <strong>We do not sell, rent, or trade your personal information to third parties.</strong>
                  </p>
                  <p>
                    We may share your data with our internal team and trusted service partners only when necessary to fulfill your requests or provide our services (e.g., specialized contractors or consultants involved in your project). All partners are required to maintain the confidentiality of your information.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 5. Data Security */}
              <section id="data-security" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">5. Data Security</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    We implement reasonable technical and organizational security measures designed to protect the security of any personal information we process.
                  </p>
                  <p>
                    However, please remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 6. Cookies */}
              <section id="cookies" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">6. Cookies</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    We use cookies and similar tracking technologies to track the activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                  </p>
                  <p>
                    You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 7. User Rights */}
              <section id="user-rights" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">7. User Rights</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>The right to access the personal information we hold about you.</li>
                    <li>The right to request that we correct any inaccuracies in your personal information.</li>
                    <li>The right to request the deletion of your personal information.</li>
                    <li>The right to object to or restrict the processing of your data.</li>
                  </ul>
                  <p>To exercise any of these rights, please contact us using the information provided below.</p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 8. Third-Party Services */}
              <section id="third-party" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">8. Third-Party Services</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    Our website may contain links to third-party websites or services (such as social media platforms or analytics providers) that are not owned or controlled by Huecraft Luxury Homes.
                  </p>
                  <p>
                    We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 9. Consent */}
              <section id="consent" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">9. Consent</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                  </p>
                </div>
              </section>

              <div className="h-[1px] w-full bg-luxury-divider" />

              {/* 10. Contact Information */}
              <section id="contact" className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-luxury-ink">10. Contact Information</h2>
                </div>
                <div className="prose prose-slate prose-luxury max-w-none text-luxury-gray font-light leading-relaxed space-y-4">
                  <p>
                    If you have any questions or concerns about this Privacy Policy or our data practices, please do not hesitate to contact us:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <a href="mailto:Huecrafthomes@gmail.com" className="flex items-center gap-3 p-4 rounded-2xl border border-luxury-divider hover:border-luxury-gold/30 transition-all group">
                      <div className="w-10 h-10 rounded-lg bg-luxury-gold/5 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-white transition-all">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-luxury-gray">Email</p>
                        <p className="text-sm font-medium text-luxury-ink">Huecrafthomes@gmail.com</p>
                      </div>
                    </a>
                    <a href="tel:+14379928442" className="flex items-center gap-3 p-4 rounded-2xl border border-luxury-divider hover:border-luxury-gold/30 transition-all group">
                      <div className="w-10 h-10 rounded-lg bg-luxury-gold/5 flex items-center justify-center group-hover:bg-luxury-gold group-hover:text-white transition-all">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-luxury-gray">Phone</p>
                        <p className="text-sm font-medium text-luxury-ink">+1 (437) 992-8442</p>
                      </div>
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
