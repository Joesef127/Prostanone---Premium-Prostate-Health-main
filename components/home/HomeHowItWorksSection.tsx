import React from 'react';
import { ProstateDiagram } from '../ProstateDiagram';

const MECHANISMS = [
  { title: 'Inhibition',         desc: 'Blocks 5α-reductase, preventing DHT formation that causes growth.' },
  { title: 'Anti-Inflammatory',  desc: 'Reduces swelling and discomfort in the prostate tissue.' },
  { title: 'Muscle Relaxation',  desc: 'Relaxes bladder muscles for smoother, more complete emptying.' },
  { title: 'Diuretic Action',    desc: 'Increases urine flow and flushes out bacteria naturally.' },
];

const HomeHowItWorksSection: React.FC = () => (
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
            {MECHANISMS.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center">
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
);

export default HomeHowItWorksSection;
