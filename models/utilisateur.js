// models.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  motDePasse: { type: String },
  role: { type: String, enum: ['author', 'admin'], default: 'author' },
  statut: { type: String,enum: ['EA', 'V'] ,  default: 'EA' },
  publications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],
});

module.exports = mongoose.model("User", userSchema);
