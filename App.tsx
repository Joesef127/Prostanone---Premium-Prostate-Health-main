import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AppProvider } from './context/AppContext';
import { ModalProvider } from './context/ModalContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Modal from './components/ui/Modal';
import WhatsAppButton from './components/WhatsAppButton';
import NewsletterPopup from './components/NewsletterPopup';
import { API_BASE } from './lib/constants';

// Skeleton fallbacks
import HomeSkeleton from './components/skeleton-loaders/home/HomeSkeleton';
import AboutSkeleton from './components/skeleton-loaders/about/AboutSkeleton';
import ProductSkeleton from './components/skeleton-loaders/product/ProductSkeleton';
import BlogSkeleton from './components/skeleton-loaders/blog/BlogSkeleton';
import BlogPostSkeleton from './components/skeleton-loaders/blog/BlogPostSkeleton';
import ReviewsSkeleton from './components/skeleton-loaders/reviews/ReviewsSkeleton';
import QuizSkeleton from './components/skeleton-loaders/quiz/QuizSkeleton';
import ResultsSkeleton from './components/skeleton-loaders/results/ResultsSkeleton';
import SummarySkeleton from './components/skeleton-loaders/summary/SummarySkeleton';
import ContactSkeleton from './components/skeleton-loaders/contact/ContactSkeleton';
import CheckoutSkeleton from './components/skeleton-loaders/checkout/CheckoutSkeleton';
import ThankYouSkeleton from './components/skeleton-loaders/thank-you/ThankYouSkeleton';
import DistributorSkeleton from './components/skeleton-loaders/distributor/DistributorSkeleton';
import AdminSkeleton from './components/skeleton-loaders/admin/AdminSkeleton';
import Skeleton from './components/skeleton-loaders/Skeleton';

// Lazy page imports
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Science = lazy(() => import('./pages/Science'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Results = lazy(() => import('./pages/Results'));
const Summary = lazy(() => import('./pages/Summary'));
const Contact = lazy(() => import('./pages/Contact'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Product = lazy(() => import('./pages/Product'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const Distributor = lazy(() => import('./pages/Distributor'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const CreateBlog = lazy(() => import('./pages/CreateBlog'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminProfile = lazy(() => import('./pages/AdminProfile'));

// Wake up Render backend on first load (prevents cold-start delay on first real request)
if (API_BASE) {
  fetch(`${API_BASE}/api/ping`).catch(() => {});
}

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
    <ModalProvider>
    <AuthProvider>
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <WhatsAppButton />
          <NewsletterPopup />
          <main className="grow">
            <Routes>
              <Route path="/" element={<Suspense fallback={<HomeSkeleton />}><Home /></Suspense>} />
              <Route path="/about" element={<Suspense fallback={<AboutSkeleton />}><About /></Suspense>} />
              <Route path="/science" element={<Suspense fallback={<Skeleton className="min-h-screen w-full" />}><Science /></Suspense>} />
              <Route path="/reviews" element={<Suspense fallback={<ReviewsSkeleton />}><Reviews /></Suspense>} />
              <Route path="/quiz" element={<Suspense fallback={<QuizSkeleton />}><Quiz /></Suspense>} />
              <Route path="/results" element={<Suspense fallback={<ResultsSkeleton />}><Results /></Suspense>} />
              <Route path="/summary" element={<Suspense fallback={<SummarySkeleton />}><Summary /></Suspense>} />
              <Route path="/contact" element={<Suspense fallback={<ContactSkeleton />}><Contact /></Suspense>} />
              <Route path="/checkout" element={<Suspense fallback={<CheckoutSkeleton />}><Checkout /></Suspense>} />
              <Route path="/thank-you" element={<Suspense fallback={<ThankYouSkeleton />}><ThankYou /></Suspense>} />
              <Route path="/product" element={<Suspense fallback={<ProductSkeleton />}><Product /></Suspense>} />
              <Route path="/terms" element={<Suspense fallback={<Skeleton className="min-h-screen w-full" />}><TermsAndConditions /></Suspense>} />
              <Route path="/distributor" element={<Suspense fallback={<DistributorSkeleton />}><Distributor /></Suspense>} />
              <Route path="/blog" element={<Suspense fallback={<BlogSkeleton />}><Blog /></Suspense>} />
              <Route path="/blog/create" element={<Suspense fallback={<Skeleton className="min-h-screen w-full" />}><ProtectedRoute><CreateBlog /></ProtectedRoute></Suspense>} />
              <Route path="/blog/edit/:slug" element={<Suspense fallback={<Skeleton className="min-h-screen w-full" />}><ProtectedRoute><CreateBlog /></ProtectedRoute></Suspense>} />
              <Route path="/blog/:slug" element={<Suspense fallback={<BlogPostSkeleton />}><BlogPost /></Suspense>} />
              <Route path="/admin-login" element={<Suspense fallback={<Skeleton className="min-h-screen w-full" />}><AdminLogin /></Suspense>} />
              <Route path="/admin/profile" element={<Suspense fallback={<AdminSkeleton />}><ProtectedRoute><AdminProfile /></ProtectedRoute></Suspense>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
    <Modal />
    </AuthProvider>
    </ModalProvider>
    </ThemeProvider>
  );
};

export default App;