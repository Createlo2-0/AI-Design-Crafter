import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "@studio-freight/lenis";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// import PhoneAuth from "./components/auth/PhoneAuth";
import GeneratorPage from "./pages/GeneratorPage";
import FeaturesPage from "./pages/FeaturesPage";
import GalleryPage from "./pages/GalleryPage";
import UserProfilePage from "./pages/UserProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

import Navbar from "./components/Navabar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./ProtectedRoute"; 

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

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
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

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      lenisRef.current.resize();
    }
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div className="flex flex-col min-h-screen font-sans">
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
                  <ProtectedRoute requiredRole="admin">
                    <AnimatedPage>
                      <AdminDashboard />
                    </AnimatedPage>
                  </ProtectedRoute>
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
              {/* <Route
                path="/login/phone"
                element={
                  <AnimatedPage>
                    <PhoneAuth />
                  </AnimatedPage>
                }
              /> */}
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