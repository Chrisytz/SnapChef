import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import History from "./pages/history";

import ImageClient from "./pages/imageClient"
import Nav from "./pages/nav";
import NoPage from "./pages/noPage";
import WebcamPage from './pages/webcam';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element ={<ImageClient />} />
          <Route path="/history" element ={<History />} />
          <Route path="/webcam" element ={<WebcamPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
