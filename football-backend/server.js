// 🔥 CONFIRM FILE
console.log("🔥 SERVER FILE LOADED");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   🔥 MongoDB Connection
========================= */
mongoose
  .connect("mongodb://127.0.0.1:27017/footballDB")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("Mongo Error:", err));

/* =========================
   🔥 Match Schema
========================= */
const matchSchema = new mongoose.Schema({
  idEvent: String,
  league: String,
  homeTeam: String,
  awayTeam: String,
  homeTeamId: String, // ✅ NEW
  awayTeamId: String, // ✅ NEW
  homeScore: String,
  awayScore: String,
  homeBadge: String,
  awayBadge: String,
  date: String,
});

const Match = mongoose.model("Match", matchSchema);

/* =========================
   🔥 League IDs
========================= */
const leagueIds = [4328, 4335, 4331, 4332, 4334];

/* =========================
   ✅ TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend + DB is running 🚀");
});

/* =========================
   🔥 GET BADGE BY TEAM ID
========================= */
const getTeamBadgeById = async (teamId) => {
  if (!teamId) return "";

  try {
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id=${teamId}`);

    const data = await res.json();

    return data.teams?.[0]?.strTeamBadge || "";
  } catch (err) {
    console.log("❌ Error fetching badge:", teamId);
    return "";
  }
};

/* =========================
   🔥 SAFE JSON PARSER
========================= */
const safeJson = async (res) => {
  try {
    const text = await res.text();

    if (!text) {
      console.log("❌ Empty response from API");
      return {};
    }

    return JSON.parse(text);
  } catch (err) {
    console.log("❌ JSON parse failed");
    return {};
  }
};

/* =========================
   🔥 SYNC MATCHES
========================= */
app.get("/sync-matches", async (req, res) => {
  try {
    let allMatches = [];

    for (let id of leagueIds) {
      console.log("🔥 Fetching league:", id);

      const upcomingRes = await fetch(`https://www.thesportsdb.com/api/v1/json/1/eventsnext.php?id=${id}`);

      const pastRes = await fetch(`https://www.thesportsdb.com/api/v1/json/1/eventspastleague.php?id=${id}`);

      console.log("STATUS:", upcomingRes.status);

      const upcomingData = await safeJson(upcomingRes);
      const pastData = await safeJson(pastRes);

      if (upcomingData.events) allMatches.push(...upcomingData.events);
      if (pastData.events) allMatches.push(...pastData.events);
    }

    // 🔥 SAVE MATCHES
    for (let match of allMatches) {
      const homeBadge = await getTeamBadgeById(match.idHomeTeam);
      const awayBadge = await getTeamBadgeById(match.idAwayTeam);

      await Match.updateOne(
        { idEvent: match.idEvent },
        {
          idEvent: match.idEvent,
          league: match.strLeague,
          homeTeam: match.strHomeTeam,
          awayTeam: match.strAwayTeam,
          homeTeamId: match.idHomeTeam,
          awayTeamId: match.idAwayTeam,
          homeScore: match.intHomeScore,
          awayScore: match.intAwayScore,
          homeBadge,
          awayBadge,
          date: match.dateEvent,
        },
        { upsert: true },
      );
    }

    res.json({ message: "Matches + Logos synced ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✅ GET MATCHES
========================= */
app.get("/matches", async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: 1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🚀 START SERVER
========================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
