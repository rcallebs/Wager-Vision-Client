import React, { useState, useEffect } from "react";
import axios from "axios";
import MatchCard from "../components/MatchCard";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import nfl from "../assets/images/nfl.png";

function NFLOdds() {
  const [odds, setOdds] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(
          `https://wager-server-946d5db015ae.herokuapp.com/api/odds/nfl`,
          {
            params: {
              sportKey: "americanfootball_nfl",
              regions: "us",
              markets: "h2h",
              oddsFormat: "american",
              dateFormat: "iso",
            },
          }
        );
        setOdds(response.data);
      } catch (error) {
        setError("Error fetching odds. Please try again later.");
        console.error("Error fetching odds:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchOdds();
  }, []);

  const handleMatchClick = (match) => {
    navigate(`/nfl/${match.id}`);
  };

  const groupMatchesByDate = (matches) => {
    const groupedMatches = matches.reduce((acc, match) => {
      const date = format(new Date(match.commence_time), "MM-dd-yyyy");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(match);
      return acc;
    }, {});
    return groupedMatches;
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="nflcontaineroverview">
      <div className="nfllogo">
        <img src={nfl} />
      </div>
      <div className="nflscheduledetails">
        <h1>Upcoming NFL Games</h1>
        {isFetching && <p>Loading...</p>}
        {!isFetching && odds && (
          <div className="container">
            {Object.entries(groupMatchesByDate(odds)).map(([date, matches]) => (
              <div key={date}>
                {matches.map((match) => (
                  <div className="row" key={match.id}>
                    <div className="col-12">
                      <MatchCard
                        className="match-card"
                        match={match}
                        onClick={() => handleMatchClick(match)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NFLOdds;
