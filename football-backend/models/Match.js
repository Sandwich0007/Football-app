const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  idEvent: String,
  league: String,
  homeTeam: String,
  awayTeam: String,
  homeScore: Number,
  awayScore: Number,
  homeBadge: String,
  awayBadge: String,
  date: String,
});

module.exports = mongoose.model("Match", matchSchema);
