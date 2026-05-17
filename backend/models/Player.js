const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a player name'],
    trim: true
  },
  rank: {
    type: Number,
    required: [true, 'Please add a global rank']
  },
  team: {
    type: String,
    required: [true, 'Please add a team name'],
    trim: true
  },
  league: {
    type: String,
    required: [true, 'Please add a league name'],
    trim: true
  },
  nation: {
    type: String,
    required: [true, 'Please add a nationality'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Please add a playing position'],
    trim: true
  },
  alternativePositions: [String],
  age: {
    type: Number,
    required: [true, 'Please add an age']
  },
  gender: {
    type: String,
    enum: ['Men', 'Women'],
    default: 'Men'
  },
  ovr: {
    type: Number,
    required: [true, 'Please add an overall rating'],
    min: 1,
    max: 99
  },
  pace: {
    type: Number,
    required: [true, 'Please add pace rating']
  },
  shooting: {
    type: Number,
    required: [true, 'Please add shooting rating']
  },
  passing: {
    type: Number,
    required: [true, 'Please add passing rating']
  },
  dribbling: {
    type: Number,
    required: [true, 'Please add dribbling rating']
  },
  defending: {
    type: Number,
    required: [true, 'Please add defending rating']
  },
  physical: {
    type: Number,
    required: [true, 'Please add physical rating']
  },
  playstyles: [String],
  preferredFoot: {
    type: String,
    enum: ['Left', 'Right'],
    default: 'Right'
  },
  skillMoves: {
    type: Number,
    min: 1,
    max: 5
  },
  weakFoot: {
    type: Number,
    min: 1,
    max: 5
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexing for search optimization
playerSchema.index({ name: 'text', team: 'text', league: 'text', nation: 'text' });

module.exports = mongoose.model('Player', playerSchema);
