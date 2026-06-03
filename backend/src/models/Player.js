const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a player name'],
    trim: true
  },
  rank: Number,
  team: String,
  league: String,
  nation: String,
  position: String,
  alternativePositions: [String],
  age: Number,
  gender: String,
  ovr: Number,
  pace: Number,
  shooting: Number,
  passing: Number,
  dribbling: Number,
  defending: Number,
  physical: Number,
  playstyles: [String],
  preferredFoot: String,
  skillMoves: Number,
  weakFoot: Number,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  strict: false
});

// Indexing for search optimization
playerSchema.index({ name: 'text', team: 'text', league: 'text', nation: 'text' });

module.exports = mongoose.model('Player', playerSchema, 'Men');
