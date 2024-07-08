import Sidebar from './sidebar/Sidebar';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from './context/AuthContext'; // Assuming you have an AuthContext


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import HomePage from "./home/HomePage";
import MtaBusPage from "./mta/MtaBusPage";
import MTASubwayPage from './mta/MTASubwayPage';
import SettingsPage from './settings/SettingsPage';
import WmataBusPage from './wmata/WMATABusPage';
import WMATAMetroPage from './wmata/WMATAMetroPage';
import AppearancePage from './settings/appearance/AppearancePage';
import TransitSystemsPage from './settings/transit-systems/TransitSystemsPage';
import NotificationsPage from './settings/notifications/NotificationPage';
import ProfilePage from './settings/profile/ProfilePage';

import RegisterPage from './pages/RegisterPage'; // Assuming you have a register component
import ProtectedRoute from './components/ProtectedRoute'; // Assuming you have a ProtectedRoute component

import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div id="App" className="flex overflow-hidden w-screen h-screen">
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="flex overflow-hidden w-screen h-screen">
                      <Sidebar />
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/mta-bus" element={<MtaBusPage />} />
                        <Route path="/mta-subway" element={<MTASubwayPage />} />
                        <Route path="/wmata-bus" element={<WmataBusPage />} />
                        <Route path="/wmata-metro" element={<WMATAMetroPage />} />
                        <Route path="/settings" element={<SettingsPage />}>
                          <Route path="appearance" element={<AppearancePage />} />
                          <Route path="notifications" element={<NotificationsPage />} />
                          <Route path="transit-systems" element={<TransitSystemsPage />} />
                          <Route path="profile" element={<ProfilePage />} />
                        </Route>
                      </Routes>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
          <Toaster />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}


export default App;

