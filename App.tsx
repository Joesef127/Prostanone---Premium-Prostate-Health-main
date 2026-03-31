import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Science from './pages/Science';
import Reviews from './pages/Reviews';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Summary from './pages/Summary';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import ThankYou from './pages/ThankYou';
import Product from './pages/Product.tsx';
import TermsAndConditions from './pages/TermsAndConditions';
import Distributor from './pages/Distributor';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import { AppProvider } from './context/AppContext';
import WhatsAppButton from './components/WhatsAppButton';
import NewsletterPopup from './components/NewsletterPopup';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <WhatsAppButton />
          <NewsletterPopup />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/science" element={<Science />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/results" element={<Results />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/product" element={<Product />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/distributor" element={<Distributor />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;