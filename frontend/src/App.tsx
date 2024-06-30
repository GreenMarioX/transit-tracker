import Sidebar from './sidebar/Sidebar';
import { ThemeProvider } from "@/components/ui/theme-provider";

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import HomePage from "./home/HomePage";
import MtaBusPage from "./mta/MtaBusPage";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div id="App" className="flex overflow-hidden w-screen h-screen">
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mta-bus" element={<MtaBusPage />} />
        </Routes>
        
        
      </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
