import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import "./global.css";
import Home from "./components/home";
import Login from "./components/login";
import ProtectedRoute from "./components/protected-route";
import SSOCallback from "./components/sso-callback";
import Verify from "./components/verify";
import { DailifyProvider } from "./components/dailifyContext";
import ProfilePage from "./components/profile";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function App() {

  return (
    <HelmetProvider>
      <DailifyProvider>
        <Router>
          <ThemeProvider>
            <Routes>
              <Route path="/"
                element={
                  <ProtectedRoute>
                    <Helmet>
                      <title>Dailify - Dashboard</title>
                    </Helmet>

                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Helmet>
                      <title>Dailify - Dashboard</title>
                    </Helmet>

                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route path="/profile"
                element={
                  <ProtectedRoute>
                    <Helmet>
                      <title>Dailify - Profile</title>
                    </Helmet>

                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route path="/login" element={
                <>
                  <Helmet>
                    <title>Dailify - Login</title>
                  </Helmet>

                  <Login />
                </>
              } />

              <Route path="/login/sso-callback" element={<SSOCallback />} />

              <Route path="/sign-in/verify" element={<Verify />} />
            </Routes>
          </ThemeProvider>
        </Router>
      </DailifyProvider>
    </HelmetProvider>
  );
}