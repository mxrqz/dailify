import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import "./global.css";
import Home from "./components/home";
import Login from "./components/login";
import ProtectedRoute from "./components/protected-route";
import SSOCallback from "./components/sso-callback";
import Verify from "./components/verify";
import { DailifyProvider } from "./components/dailifyContext";

export default function App() {
  return (
    <DailifyProvider>
      <Router>
        <ThemeProvider>
          <Routes>
            <Route path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />

            <Route path="/login/sso-callback" element={<SSOCallback />} />

            <Route path="/sign-in/verify" element={<Verify />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </DailifyProvider>
  );
}