const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, 'Please add a player name'],
    trim: true
  },
  Rank: String,
  Team: String,
  League: String,
  Nation: String,
  Position: String,
  Age: String,
  GENDER: String,
  OVR: String,
  PAC: String,
  SHO: String,
  PAS: String,
  DRI: String,
  DEF: String,
  PHY: String,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  strict: false
});

// Indexing for search optimization
playerSchema.index({ Name: 'text', Team: 'text', League: 'text', Nation: 'text' });

module.exports = mongoose.model('Player', playerSchema, 'Men');
