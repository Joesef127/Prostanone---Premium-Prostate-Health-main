import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PACKAGES } from '../lib/constants.ts';
import { useSeoMeta } from '../hooks/useSeoMeta';
import Button from '../components/Button';
import { CheckCircle, AlertTriangle, Shield, Clock, ArrowRight, Activity } from 'lucide-react';
import { QuizSeverity } from '../types';

const Results: React.FC = () => {
  // SEO configuration for results page
  useSeoMeta({
    title: "Your Prostate Health Results - Personalized Recommendations",
    description: "View your personalized prostate health assessment results and get tailored recommendations for improving your wellness with Prostanone.",
    keywords: [
      "health results",
      "assessment results",
      "personalized recommendations",
      "prostate health tips",
    ],
    url: "/results",
    robots: "noindex", // Don't index results pages as they're user-specific
  });

  const { quizResult, addToCart } = useApp();
  const navigate = useNavigate();

  // Redirect if no result
  useEffect(() => {
    if (!quizResult) navigate('/quiz');
  }, [quizResult, navigate]);

  if (!quizResult) return null;

  // Logic for recommendation
  let recommendedPackageId = 'starter'; // MILD
  if (quizResult.severity === QuizSeverity.MODERATE) recommendedPackageId = 'most-valuable';
  if (quizResult.severity === QuizSeverity.SEVERE) recommendedPackageId = 'loyalty';

  const recommendedPackage = PACKAGES.find(p => p.id === recommendedPackageId)!;

  const handleClaim = () => {
    addToCart(recommendedPackage.id);
    navigate('/summary');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4">Assessment Complete</span>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6">
            Your Symptoms are <span className={
              quizResult.severity === QuizSeverity.MILD ? 'text-green-600' :
                quizResult.severity === QuizSeverity.MODERATE ? 'text-yellow-600' : 'text-red-600'
            }>{quizResult.severity}</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Based on your answers, we've identified a personalized protocol to help you regain control of your prostate health.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Analysis Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-lg"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="text-accent" /> Analysis
            </h3>
            <div className="space-y-6">
              <p className="text-text leading-relaxed">
                Your score of <strong className="text-primary">{quizResult.score}</strong> indicates
                {quizResult.severity === QuizSeverity.MILD && " early signs of prostate enlargement. Acting now can prevent symptoms from worsening."}
                {quizResult.severity === QuizSeverity.MODERATE && " consistent interference with your daily life. A sustained 4-month protocol is recommended to reduce inflammation."}
                {quizResult.severity === QuizSeverity.SEVERE && " significant impact on quality of life. A comprehensive 6-month protocol is strongly advised for maximum relief."}
              </p>

              <div className="bg-background p-6 rounded-xl">
                <h4 className="font-bold mb-3">What this means for you:</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Potential sleep disruption</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Urinary flow restriction</li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Increased frequency</li>
                </ul>
              </div>

              {/* Recovery Timeline Chart */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Activity size={16} />
                  </div>
                  <h4 className="font-bold text-gray-800">Projected Recovery Timeline</h4>
                </div>

                <div className="relative h-48 bg-gray-50 rounded-2xl p-6 flex items-end justify-between gap-3 overflow-hidden">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-30">
                    <div className="border-t border-gray-300 w-full h-full"></div>
                    <div className="border-t border-gray-300 w-full h-full"></div>
                    <div className="border-t border-gray-300 w-full h-full"></div>
                  </div>

                  {((severity: QuizSeverity) => {
                    switch (severity) {
                      case QuizSeverity.SEVERE:
                        return [
                          { label: 'Month 0', height: 15, text: 'Start' },
                          { label: 'Month 2', height: 35, text: 'Stability' },
                          { label: 'Month 4', height: 65, text: 'Relief' },
                          { label: 'Month 6', height: 95, text: 'Optimal' },
                        ];
                      case QuizSeverity.MODERATE:
                        return [
                          { label: 'Week 0', height: 20, text: 'Start' },
                          { label: 'Week 4', height: 45, text: 'Better' },
                          { label: 'Week 8', height: 70, text: 'Good' },
                          { label: 'Week 16', height: 95, text: 'Optimal' },
                        ];
                      default: // MILD
                        return [
                          { label: 'Week 0', height: 25, text: 'Start' },
                          { label: 'Week 1', height: 50, text: 'Better' },
                          { label: 'Week 2', height: 75, text: 'Good' },
                          { label: 'Week 4', height: 95, text: 'Optimal' },
                        ];
                    }
                  })(quizResult.severity).map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-1/4 z-10">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${bar.height}%` }}
                        transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                        className="w-full bg-gradient-to-t from-primary/60 to-primary rounded-t-lg relative group shadow-sm"
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {bar.text} Comfort
                        </div>
                      </motion.div>
                      <span className="text-xs font-semibold text-gray-500 text-center leading-tight">{bar.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-3 text-center uppercase tracking-wider">Estimated prostate health trajectory</p>
              </div>
            </div>
          </motion.div>

          {/* Recommendation Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-primary text-white p-8 rounded-3xl shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="relative z-10">
              <span className="uppercase tracking-widest text-xs font-bold text-accent mb-2 block">Recommended Protocol</span>
              <h3 className="text-2xl font-bold mb-4">{recommendedPackage.name}</h3>
              {recommendedPackage.originalPrice && (
                <div className="text-lg text-white/70 line-through mb-1">
                  Was ₦{recommendedPackage.originalPrice.toLocaleString()}
                </div>
              )}
              <div className="text-4xl font-bold text-white mb-6">Now ₦{recommendedPackage.price.toLocaleString()}</div>

              <p className="text-white/80 mb-6 border-l-2 border-accent pl-4">
                {recommendedPackage.description}
                {recommendedPackage.subtitle && <><br /><em>{recommendedPackage.subtitle}</em></>}
              </p>

              {recommendedPackage.usageNote && (
                <div className="mb-6 flex items-center gap-2 p-3 rounded-xl bg-white/10 text-accent text-xs font-bold leading-tight">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{recommendedPackage.usageNote}</span>
                </div>
              )}

              <ul className="space-y-3 mb-8 text-sm text-white/90">
                <li className="flex gap-2 items-center"><Shield className="w-4 h-4 text-accent" /> {recommendedPackage.containers} Containers</li>
                <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-accent" /> NAFDAC Certified</li>
                {recommendedPackage.deliveryText && (
                  <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-accent" /> {recommendedPackage.deliveryText}</li>
                )}
              </ul>

              <Button
                fullWidth
                size="lg"
                onClick={handleClaim}
                className="bg-white !text-primary hover:bg-gray-50 font-extrabold text-lg group mb-4 shadow-2xl shadow-black/20 border-2 border-white"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Get Your Personalized Package <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Link to="/science" target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button
                  variant="outline"
                  fullWidth
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Learn More About the Science
                </Button>
              </Link>

              {recommendedPackage.savingsText && (
                <p className="text-center text-xs mt-4 text-accent">
                  {recommendedPackage.savingsText} with this package
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Results;