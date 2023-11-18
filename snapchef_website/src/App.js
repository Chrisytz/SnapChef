import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import History from "./pages/history";

import ImageClient from "./pages/imageClient"
import Nav from "./pages/layout";
import NoPage from "./pages/noPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element ={<ImageClient />} />
          <Route path="/history" element ={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
