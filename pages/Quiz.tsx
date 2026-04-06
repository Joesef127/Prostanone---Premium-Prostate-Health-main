import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { QUIZ_QUESTIONS } from "../lib/constants.ts";
import { useApp } from "../context/AppContext";
import { QuizSeverity } from "../types";
import Button from "../components/Button";
import { ArrowLeft, Check } from "lucide-react";
import { useDynamicTitle } from "../hooks/useDynamicTitle";

const Quiz: React.FC = () => {
  useDynamicTitle("Prostate Health Check");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const { setQuizResult } = useApp();
  const navigate = useNavigate();

  const question = QUIZ_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [question.id]: score };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 300);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<number, number>) => {
    let totalScore = 0;
    // Simple logic: Sum of scores from Q2-Q7 (IPSS logic simplified)
    // Q1 is age, not part of symptom score usually, but let's just sum all for this demo
    Object.values(finalAnswers).forEach((s) => (totalScore += s));

    let severity = QuizSeverity.MILD;
    if (totalScore >= 8 && totalScore <= 19) severity = QuizSeverity.MODERATE;
    if (totalScore >= 20) severity = QuizSeverity.SEVERE;

    setQuizResult({
      score: totalScore,
      severity,
      answers: finalAnswers,
    });

    navigate("/results");
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 w-full">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="p-8 md:p-12 grow flex flex-col relative">
          {currentQuestionIndex > 0 && (
            <button
              onClick={prevQuestion}
              className="absolute top-8 left-8 text-gray-400 hover:text-primary transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}

          <div className="grow flex flex-col justify-center mt-8">
            <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2">
              Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 leading-tight">
                  {question.text}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option.score)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center group ${
                        answers[question.id] === option.score
                          ? "border-primary bg-primary/5 text-primary font-semibold"
                          : "border-gray-100 hover:border-primary/50 text-text"
                      }`}
                    >
                      <span>{option.text}</span>
                      {answers[question.id] === option.score && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
