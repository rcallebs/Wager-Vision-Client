import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { NavLink } from "react-router-dom";
import Nav from "./components/Nav";
import Bets from "./pages/Bets";

const App = () => {
  return (
    <div className="App">
      <nav>
        <Nav />
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bets" element={<Bets />} />
        </Routes>
      </main>
      <footer></footer>
    </div>
  );
};

export default App;
