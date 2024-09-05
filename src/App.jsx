import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sidebar" element={<Sidebar />} />
      </Routes>
    </Router>
  );
}

export default App;
