import React, { useEffect, useState } from "react";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const leagueIds = [4328, 4335, 4331, 4332, 4334];

  // ✅ FAKE UPCOMING MATCHES (WITH REAL LOGOS)
  const fakeUpcomingMatches = [
    {
      idEvent: "1001",
      strLeague: "English Premier League",
      strHomeTeam: "Manchester United",
      strAwayTeam: "Chelsea",
      strHomeTeamBadge: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
      strAwayTeamBadge: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
      intHomeScore: null,
      intAwayScore: null,
    },
    {
      idEvent: "1002",
      strLeague: "Spanish La Liga",
      strHomeTeam: "Barcelona",
      strAwayTeam: "Real Madrid",
      strHomeTeamBadge: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
      strAwayTeamBadge: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
      intHomeScore: null,
      intAwayScore: null,
    },
    {
      idEvent: "1003",
      strLeague: "German Bundesliga",
      strHomeTeam: "Bayern Munich",
      strAwayTeam: "Borussia Dortmund",
      strHomeTeamBadge: "https://upload.wikimedia.org/wikipedia/en/1/1f/FC_Bayern_München_logo_%282017%29.svg",
      strAwayTeamBadge: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
      intHomeScore: null,
      intAwayScore: null,
    },
    {
      idEvent: "1004",
      strLeague: "Italian Serie A",
      strHomeTeam: "Juventus",
      strAwayTeam: "AC Milan",
      strHomeTeamBadge: "https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg",
      strAwayTeamBadge: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg",
      intHomeScore: null,
      intAwayScore: null,
    },
    {
      idEvent: "1005",
      strLeague: "French Ligue 1",
      strHomeTeam: "PSG",
      strAwayTeam: "Lyon",
      strHomeTeamBadge: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
      strAwayTeamBadge: "https://upload.wikimedia.org/wikipedia/en/c/c6/Olympique_Lyonnais.svg",
      intHomeScore: null,
      intAwayScore: null,
    },
  ];

  // ✅ FETCH MATCHES
  const fetchMatches = async () => {
    try {
      const res = await fetch("http://localhost:5000/matches");
      const data = await res.json();

      console.log("DB DATA:", data);

      // ✅ Normalize data to match your UI
      const formatted = data.map((match) => ({
        idEvent: match.idEvent,
        strLeague: match.league,
        strHomeTeam: match.homeTeam,
        strAwayTeam: match.awayTeam,
        strHomeTeamBadge: match.homeBadge,
        strAwayTeamBadge: match.awayBadge,
        intHomeScore: match.homeScore,
        intAwayScore: match.awayScore,
        dateEvent: match.date,
      }));

      // ✅ Combine with fake matches
      setMatches([...fakeUpcomingMatches, ...formatted]);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const upcomingMatches = matches.filter((m) => m.intHomeScore == null || m.intAwayScore == null);

  const finishedMatches = matches.filter((m) => m.intHomeScore != null && m.intAwayScore != null);
  return (
    <div style={container}>
      <h1 style={title}>⚽ Football Predictor</h1>

      {loading ? (
        <p style={{ marginTop: "40px" }}>Loading matches...</p>
      ) : (
        <>
          {/* 🔵 UPCOMING */}
          <h2 style={upcomingTitle}>Upcoming Matches</h2>

          <div style={grid}>
            {upcomingMatches.map((match) => (
              <div key={match.idEvent} style={card} onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                <p style={league}>{match.strLeague}</p>

                <div style={teams}>
                  <div style={teamBox}>
                    <img src={match.strHomeTeamBadge || "https://via.placeholder.com/40"} alt="" style={{ width: "40px" }} />
                    <p>{match.strHomeTeam}</p>
                  </div>

                  <span style={vs}>VS</span>

                  <div style={teamBox}>
                    <img src={match.strAwayTeamBadge || "https://via.placeholder.com/40"} alt="" style={{ width: "40px" }} />
                    <p>{match.strAwayTeam}</p>
                  </div>
                </div>

                <p style={upcomingText}>Upcoming Match</p>
              </div>
            ))}
          </div>

          {/* 🟢 FINISHED */}
          <h2 style={finishedTitle}>Finished Matches</h2>

          <div style={grid}>
            {finishedMatches.map((match) => (
              <div key={match.idEvent} style={card} onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                <p style={league}>{match.strLeague}</p>

                <div style={teams}>
                  <div style={teamBox}>
                    <img src={match.strHomeTeamBadge || "https://via.placeholder.com/40"} alt="" style={{ width: "40px" }} />
                    <p>{match.strHomeTeam}</p>
                  </div>

                  <span style={vs}>VS</span>

                  <div style={teamBox}>
                    <img src={match.strAwayTeamBadge || "https://via.placeholder.com/40"} alt="" style={{ width: "40px" }} />
                    <p>{match.strAwayTeam}</p>
                  </div>
                </div>

                <p style={score}>
                  {match.intHomeScore} - {match.intAwayScore}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;

/* ✅ STYLES */

const fallbackLogo = "https://via.placeholder.com/50?text=⚽";

const container = {
  textAlign: "center",
  padding: "30px",
  background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  color: "#fff",
  minHeight: "100vh",
};

const title = {
  fontSize: "2.5rem",
  marginBottom: "20px",
  letterSpacing: "1px",
};

const upcomingTitle = {
  color: "#00c6ff",
  marginTop: "20px",
};

const finishedTitle = {
  color: "#00ff99",
  marginTop: "50px",
};

const grid = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "20px",
  marginTop: "20px",
};

const card = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "15px",
  padding: "20px",
  width: "260px",
  transition: "all 0.3s ease",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

const teams = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
};

const teamBox = {
  textAlign: "center",
};

const logo = {
  width: "50px",
  height: "50px",
  objectFit: "contain",
};

const vs = {
  fontWeight: "bold",
  opacity: 0.7,
};

const league = {
  fontSize: "12px",
  opacity: 0.7,
};

const upcomingText = {
  marginTop: "10px",
  color: "#ffcc00",
};

const score = {
  marginTop: "10px",
  fontSize: "18px",
  fontWeight: "bold",
};

// Card Style
