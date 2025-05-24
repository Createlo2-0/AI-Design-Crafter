import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "@studio-freight/lenis";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GeneratorPage from "./pages/GeneratorPage";
import FeaturesPage from "./pages/FeaturesPage";
import GalleryPage from "./pages/GalleryPage";
import UserProfilePage from "./pages/UserProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navabar/Navbar";
import Footer from "./components/Footer/Footer";


function ProtectedRoute({ children }) {
  const { currentUser, loadingAuth } = useAuth();
  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-cyber-bg">
        <p className="text-neon-blue font-mono">Authenticating Access...</p>
      </div>
    );
  }
  return currentUser ? children : <Navigate to="/login" replace />;
}

const AnimatedPage = ({ children }) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };
  const pageTransition = { type: "tween", ease: "anticipate", duration: 0.4 };
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  const lenisRef = useRef(null);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8, // Increased for smoother inertia
      smooth: true,
      smoothTouch: true,
      gestureOrientation: "vertical",
      direction: "vertical",
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Reset scroll and resize Lenis on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      lenisRef.current.resize();
    }
  }, [location.pathname]);

  // Check if current route is admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div className="flex flex-col min-h-screen font-sans">
        {/* Main Content */}
        <main className="flex-1 w-full mx-auto p-6 relative z-10">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <AnimatedPage>
                    <HomePage />
                  </AnimatedPage>
                }
              />

              <Route
                path="/admin/*"
                element={
                  <AnimatedPage>
                    <AdminDashboard />
                  </AnimatedPage>
                }
              />

              <Route
                path="/login"
                element={
                  <AnimatedPage>
                    <LoginPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/signup"
                element={
                  <AnimatedPage>
                    <SignupPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/generate"
                element={
                  <ProtectedRoute>
                    <AnimatedPage>
                      <GeneratorPage />
                    </AnimatedPage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/features"
                element={
                  <AnimatedPage>
                    <FeaturesPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/gallery"
                element={
                  <AnimatedPage>
                    <GalleryPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AnimatedPage>
                      <UserProfilePage />
                    </AnimatedPage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <AnimatedPage>
                    <ResetPasswordPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="*"
                element={
                  <AnimatedPage>
                    <div className="text-center text-red-500 font-bold text-xl">
                      404 // Not Found
                    </div>
                  </AnimatedPage>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}

export default App;
