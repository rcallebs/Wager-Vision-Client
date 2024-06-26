import React, { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import Bets from "./pages/Bets";
import BetDetails from "./pages/BetDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { CheckSession } from "./services/Auth";
import AddBet from "./pages/AddBet";
import OddsData from "./pages/OddsData";
import SettledBets from "./pages/SettledBets";
import BetStats from "./pages/BetStats";
import Posts from "./pages/Posts";
import AddPost from "./pages/AddPost";
import NFLDetails from "./pages/NFLDetails";
import NFLodds from "./pages/NFLOdds";

const App = () => {
  let navigate = useNavigate();
  const [user, setUser] = useState(null);

  const checkToken = async () => {
    const user = await CheckSession();
    setUser(user);
  };

  const handleLogOut = () => {
    setUser(null);
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkToken();
    }
  }, []);

  return (
    <div className="background-container">
      <div className="App">
        <Nav user={user} handleLogOut={handleLogOut} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/bets" element={<Bets />} />
            <Route path="/settled-bets" element={<SettledBets />} />
            <Route path="/bets/:id" element={<BetDetails />} />
            <Route path="/add-bet" element={<AddBet />} />
            <Route path="/history" element={<BetStats />} />
            <Route path="/nfl" element={<NFLodds />} />
            <Route path="/nfl/:id" element={<NFLDetails />} />
            <Route path="/odds" element={<OddsData />} />
            <Route path="/discussion" element={<Posts />} />
            <Route path="/discussion/post" element={<AddPost />} />
          </Routes>
        </main>
        <footer></footer>
      </div>
    </div>
  );
};

export default App;
