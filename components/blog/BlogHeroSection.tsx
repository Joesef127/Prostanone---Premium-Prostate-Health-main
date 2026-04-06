import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, PenSquare } from 'lucide-react';
import FadeIn from './FadeIn';
import { useAuth } from '../../context/AuthContext';

const BlogHeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <section className="bg-linear-to-br from-secondary to-secondary/90 text-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Prostate Health Blog</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Evidence-based insights on prostate health, nutrition, and lifestyle — written for
            Nigerian men who want to take control of their wellbeing.
          </p>
          <div className="mt-8">
            {isAdmin && (
              <button
                onClick={() => navigate('/blog/create')}
                className="inline-flex items-center gap-2 bg-accent text-secondary font-bold px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors shadow-md"
              >
                <PenSquare className="w-4 h-4" />
                Create post
              </button>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default BlogHeroSection;
