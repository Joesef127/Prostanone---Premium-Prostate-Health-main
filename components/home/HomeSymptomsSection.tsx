import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Droplets, AlertCircle, Clock } from 'lucide-react';

const SYMPTOMS = [
  { icon: Moon,         title: 'Waking at Night',       desc: 'Frequent urination disrupting sleep (Nocturia).' },
  { icon: Droplets,     title: 'Weak Flow',              desc: 'Difficulty starting or maintaining a steady stream.' },
  { icon: AlertCircle,  title: 'Incomplete Emptying',    desc: 'Feeling like the bladder is never fully empty.' },
  { icon: Clock,        title: 'Urgency',                desc: 'Sudden, strong urges that are hard to control.' },
];

const HomeSymptomsSection: React.FC = () => (
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
        {SYMPTOMS.map((item, index) => (
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
);

export default HomeSymptomsSection;
