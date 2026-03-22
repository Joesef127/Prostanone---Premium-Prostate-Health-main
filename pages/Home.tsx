import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Moon, Clock, AlertCircle, Droplets, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import { PACKAGES, TESTIMONIALS, SMALL_PRINT } from '../constants';
import { ProstateDiagram } from '../components/ProstateDiagram';
import { useApp } from '../context/AppContext';
import FAQ from '../components/FAQ';
import { images } from '@/lib';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const { scrollY } = useScroll();
  const rotation = useTransform(scrollY, [0, 500], [0, 25]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  const handlePackageSelect = (pkgId: string) => {
    addToCart(pkgId);
    navigate('/summary');
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-background to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid md:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wide">NAFDAC Certified</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wide">Clinically Backed</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
              Transform Your <br />
              <span className="text-secondary">Prostate Health</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted max-w-lg">
              NAFDAC-certified herbal prostate health supplement. Supporting vitality and confidence for Nigerian men naturally. Distributed Only by Holis Botanical Gardens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quiz">
                <Button size="lg" className="w-full sm:w-auto">Take Free Prostate Check</Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Pricing
              </Button>
            </div>
          </motion.div>

          <motion.div style={{ rotate: rotation, opacity }} className="relative flex justify-center items-center">
            {/* Abstract Background Blob */}
            <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10" />

            {/* Product Image Placeholder - 3D Card Effect */}
            <div className="relative w-64 h-80 md:w-80 md:h-[450px] bg-white rounded-3xl shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500 overflow-hidden flex flex-col items-center">

              <div className="h-2/3 w-full bg-gradient-to-b from-primary to-secondary p-6 flex flex-col justify-between">
                <span className="text-white font-bold text-2xl tracking-widest uppercase text-center border-b border-white/20 pb-2">
                  Prostanone
                </span>

                {/* ✅ Added Product Image */}
                <img
                  src={images.prostanone}
                  alt="Prostanone Bottle"
                  className="w-28 h-28 object-contain mx-auto my-2 drop-shadow-xl"
                />

                <div className="text-center text-white/90">
                  <p className="text-4xl font-bold">60</p>
                  <p className="text-sm uppercase tracking-wide">Tablets</p>
                </div>
              </div>

              <div className="h-1/3 w-full bg-white p-6 flex flex-col items-center justify-center space-y-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <p className="text-xs text-gray-500 font-medium">Herbal Supplement</p>
                <p className="text-[10px] text-gray-400">NAFDAC Reg No: A7-1234L</p>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Awareness */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Are You Experiencing These Symptoms?</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">Early signs of BPH often go ignored. Don't let them disrupt your life.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Moon, title: "Waking at Night", desc: "Frequent urination disrupting sleep (Nocturia)." },
              { icon: Droplets, title: "Weak Flow", desc: "Difficulty starting or maintaining a steady stream." },
              { icon: AlertCircle, title: "Incomplete Emptying", desc: "Feeling like the bladder is never fully empty." },
              { icon: Clock, title: "Urgency", desc: "Sudden, strong urges that are hard to control." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-8 rounded-2xl hover:shadow-lg transition-shadow border border-transparent hover:border-primary/10 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{item.title}</h3>
                <p className="text-text-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <ProstateDiagram />
              <p className="text-center text-sm text-text-muted mt-4">Interactive diagram: Scroll to see transformation</p>
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Targeting the Root Cause</h2>
              <div className="space-y-6">
                {[
                  { title: "Inhibition", desc: "Blocks 5α-reductase, preventing DHT formation that causes growth." },
                  { title: "Anti-Inflammatory", desc: "Reduces swelling and discomfort in the prostate tissue." },
                  { title: "Muscle Relaxation", desc: "Relaxes bladder muscles for smoother, more complete emptying." },
                  { title: "Diuretic Action", desc: "Increases urine flow and flushes out bacteria naturally." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-text mb-1">{item.title}</h4>
                      <p className="text-text-muted text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trusted by Nigerian Men</h2>
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(i => <ShieldCheck key={i} className="text-accent" fill="currentColor" />)}
          </div>
          <p className="text-white/80">4.9/5 Average Rating based on 1,200+ reviews</p>
        </div>

        <div className="flex overflow-x-auto pb-8 gap-6 px-4 no-scrollbar snap-x">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="flex-shrink-0 w-80 md:w-96 bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 snap-center">
              <div className="flex gap-1 mb-4 text-accent">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="text-lg italic mb-6">"{t.text}"</p>
              <div>
                <p className="font-bold">{t.name}</p>
                <p className="text-sm text-white/60">{t.age} years old • {t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modern Pricing Carousel */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 tracking-tight">Choose Your Package</h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">Simple transparent pricing. Experience the power of nature with guaranteed results.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto lg:items-stretch">

          {/* Static Hero Image Card */}
          <div className="relative flex-shrink-0 w-full lg:w-[450px] rounded-3xl overflow-hidden shadow-2xl group border border-gray-200 lg:sticky lg:top-8 h-[400px] lg:h-auto lg:min-h-[500px]">
            <img src={images.prostanone_home} alt="Prostanone Premium Product" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-8">
              <div className="bg-accent text-primary text-xs font-bold uppercase py-1 px-3 rounded-full inline-block mb-3 self-start">Premium Quality</div>
              <h3 className="text-3xl font-bold text-white mb-2">100% Herbal</h3>
              <p className="text-white/90 text-sm">Manufactured in GMP-certified facilities using only the finest natural extracts.</p>
            </div>
          </div>

          {/* Scrolling Packages Wrapper */}
          <div className="flex-grow flex flex-col w-full min-w-0">
            {/* Drag/Swipe Hint */}
            <div className="flex justify-center mb-2 xl:hidden">
              <motion.div
                animate={{ x: [-8, 8, -8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2 text-primary font-medium text-sm bg-green-50/80 backdrop-blur px-4 py-1.5 rounded-full border border-green-200 shadow-sm"
              >
                <span>Swipe to compare packages</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>

            {/* Scrolling Packages */}
            <div className="flex overflow-x-auto gap-4 pb-12 snap-x snap-mandatory no-scrollbar flex-grow items-end px-4 pt-8">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative flex-shrink-0 w-[88vw] sm:w-72 lg:w-80 p-6 sm:p-8 rounded-3xl flex flex-col snap-center border transition-all duration-300 hover:shadow-2xl h-auto ${pkg.id === 'option-b'
                    ? 'border-primary bg-primary text-white shadow-xl scale-[1.02] z-10 mx-2'
                    : 'border-gray-200 bg-white'
                    }`}
                >
                  {pkg.id === 'option-b' && (
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    </div>
                  )}
                  {pkg.badge && (
                    <div className={`absolute -top-4 w-10/12 left-1/2 transform -translate-x-1/2 font-bold text-xs py-1.5 px-4 rounded-b-xl uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-sm ${pkg.id === 'option-b' ? 'bg-accent text-primary' : 'bg-gray-100 text-gray-600'}`}>
                      <ShieldCheck className="w-3 h-3" /> {pkg.badge}
                    </div>
                  )}

                  <div className="mt-4 relative z-10">
                    <h3 className={`text-xl font-bold mb-1 ${pkg.id === 'option-b' ? 'text-white' : 'text-text'}`}>{pkg.name}</h3>
                    {pkg.subtitle && <p className={`text-sm font-semibold mb-2 ${pkg.id === 'option-b' ? 'text-accent' : 'text-primary'}`}>{pkg.subtitle}</p>}
                  </div>

                  <div className="flex flex-col items-start gap-1 mb-6">
                    {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                      <span className={`text-sm line-through ${pkg.id === 'option-b' ? 'text-white/60' : 'text-gray-400'}`}>Was ₦{pkg.originalPrice.toLocaleString()}</span>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-extrabold tracking-tight ${pkg.id === 'option-b' ? 'text-white' : 'text-primary'}`}>₦{pkg.price.toLocaleString()}</span>
                    </div>
                    {pkg.savingsText && (
                      <span className={`text-sm font-bold px-2 py-1 rounded-md mt-2 ${pkg.id === 'option-b' ? 'bg-white/10 text-accent' : 'bg-green-50 text-green-700'}`}>
                        {pkg.savingsText}
                      </span>
                    )}
                  </div>

                  <p className={`text-sm mb-4 pb-4 border-b flex-grow ${pkg.id === 'option-b' ? 'text-white/80 border-white/10' : 'text-text-muted border-gray-100'}`}>
                    {pkg.description}
                    {pkg.recommendedFor && <><br /><br /><strong className={pkg.id === 'option-b' ? 'text-white' : 'text-gray-800'}>{pkg.recommendedFor}</strong></>}
                  </p>

                  {pkg.usageNote && (
                    <div className={`mb-6 flex items-center gap-2 p-3 rounded-xl text-xs font-bold leading-tight ${pkg.id === 'option-b' ? 'bg-white/10 text-accent' : 'bg-accent/10 text-primary'}`}>
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{pkg.usageNote}</span>
                    </div>
                  )}

                  <ul className="space-y-4 mb-8 text-sm">
                    <li className="flex items-center gap-3">
                      <div className={`p-1 rounded-full ${pkg.id === 'option-b' ? 'bg-white/10 text-accent' : 'bg-green-50 text-green-500'}`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className={pkg.id === 'option-b' ? 'text-white/90' : 'text-gray-600'}>{pkg.containers} Herbal Packs</span>
                    </li>
                    {pkg.deliveryText && (
                      <li className="flex items-center gap-3">
                        <div className={`p-1 rounded-full ${pkg.id === 'option-b' ? 'bg-white/10 text-accent' : 'bg-green-50 text-green-500'}`}>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span className={pkg.id === 'option-b' ? 'text-white/90' : 'text-gray-600'}>{pkg.deliveryText}</span>
                      </li>
                    )}
                  </ul>

                  <Button
                    size="lg"
                    variant={pkg.id === 'option-b' ? 'secondary' : 'outline'}
                    className={pkg.id === 'option-b' ? 'w-full shadow-lg shadow-accent/20 text-primary hover:bg-white hover:text-primary transition-colors relative z-10' : 'w-full border-gray-300 relative z-10'}
                    onClick={() => handlePackageSelect(pkg.id)}
                  >
                    Select Package
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-800 text-lg">
            <span className="text-2xl">📌</span> Everything You Need To Know
          </h4>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
            {SMALL_PRINT.map((text, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                <span className="leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Still Unsure?</h2>
          <p className="text-lg text-text-muted mb-8">Take our 2-minute assessment to get a personalized recommendation based on your specific symptoms.</p>
          <Link to="/quiz">
            <Button size="lg" className="shadow-xl">Start Free Assessment <ArrowRight className="ml-2 w-4 h-4" /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;