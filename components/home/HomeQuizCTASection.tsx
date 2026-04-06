import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../Button';

const HomeQuizCTASection: React.FC = () => (
  <section className="py-24 bg-background">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold text-primary mb-6">Still Unsure?</h2>
      <p className="text-lg text-text-muted mb-8">Take our 2-minute assessment to get a personalized recommendation based on your specific symptoms.</p>
      <Link to="/quiz">
        <Button size="md" className="shadow-xl">Start Free Assessment <ArrowRight className="ml-2 w-4 h-4" /></Button>
      </Link>
    </div>
  </section>
);

export default HomeQuizCTASection;
