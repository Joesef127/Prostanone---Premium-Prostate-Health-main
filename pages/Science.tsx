import React from 'react';
import { motion } from 'framer-motion';
import { ProstateDiagram } from '../components/ProstateDiagram';
import { images } from '@/lib';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { PAGE_URLS, SITE_CONFIG } from '../lib/seo';

const Science: React.FC = () => {
  // SEO configuration for science page
  useSeoMeta({
    title: "The Science Behind Prostanone - Prostate Health Research",
    description: "Discover the clinical research and science behind Prostanone. Learn about our 4 clinically-studied ingredients and how they target the root causes of prostate health issues.",
    keywords: [
      "prostate science",
      "clinical research",
      "saw palmetto",
      "BPH treatment",
      "prostate health formula",
      "ingredient research",
      "natural prostate supplement",
    ],
    url: PAGE_URLS.science,
      image: `${SITE_CONFIG.domain}/prostanone-science1.jpg`,
    imageAlt: "Prostanone Scientific Research",
    type: "article",
  });

  return (
    <div className="pt-20 bg-white">
      {/* Hero */}
      <section className="py-20 bg-secondary text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">The Science Behind Prostanone</h1>
          <p className="text-xl text-gray-300">Formulated with 4 clinically studied ingredients targeting the root causes of BPH.</p>
        </div>
      </section>

      {/* Mechanism */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 mb-12 justify-center items-center">
            <img src={images.prostanone_science1} alt="Prostanone Science" className="w-full md:w-1/2 max-w-sm h-auto rounded-3xl shadow-md object-cover" loading="lazy" />
            <img src={images.prostanone_science2} alt="Prostanone Science" className="w-full md:w-1/2 max-w-sm h-auto rounded-3xl shadow-md object-cover" loading="lazy" />
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Understanding BPH</h2>
              <p className="text-text-muted text-lg mb-6">
                Benign Prostatic Hyperplasia (BPH) affects 50% of men over 50. As the prostate enlarges, it compresses the urethra, causing weak flow and incomplete emptying. The primary driver is Dihydrotestosterone (DHT).
              </p>
              <ul className="space-y-4">
                {['Blocks DHT formation', 'Reduces Inflammation', 'Relaxes Bladder Muscles'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-lg font-medium text-text">
                    <div className="w-2 h-2 rounded-full bg-accent" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-background rounded-3xl p-8">
              <ProstateDiagram />
            </div>
          </div>
        </div>
      </section>


      {/* Ingredients */}
      <section className="py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-16">Clinical Ingredient Profile</h2>

          <div className="space-y-8">
            {[
              {
                name: "Saw Palmetto Extract",
                dose: "300mg",
                desc: "Inhibits 5α-reductase enzymes, stopping testosterone conversion to DHT.",
                stat: "25% reduction in nocturia"
              },
              {
                name: "Chimaphila Umbellata",
                dose: "50mg",
                desc: "Effective in treating urinary retention. Acts as a diuretic and anti-inflammatory.",
                stat: "Reduces prostate swelling"
              },
              {
                name: "Pareira Brava",
                dose: "25mg",
                desc: "Alkaloid muscle relaxant that reduces bladder spasms for comfortable urination.",
                stat: "Improves bladder emptying"
              },
              {
                name: "Hydrangea Arborescens",
                dose: "15mg",
                desc: "Traditional diuretic that increases urine flow and reduces bacterial adhesion.",
                stat: "Supports healthy flow"
              }
            ].map((ing, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start md:items-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold shrink-0">
                  {ing.dose}
                </div>
                <div className="grow">
                  <h3 className="text-xl font-bold text-primary mb-2">{ing.name}</h3>
                  <p className="text-text-muted">{ing.desc}</p>
                </div>
                <div className="bg-green-50 px-6 py-4 rounded-xl border border-green-100 shrink-0 w-full md:w-auto">
                  <span className="text-xs text-green-800 font-bold uppercase tracking-wide block mb-1">Clinical Result</span>
                  <span className="font-semibold text-green-900">{ing.stat}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Science;