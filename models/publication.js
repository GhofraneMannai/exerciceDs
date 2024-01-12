// models.js
const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  datePublication: { type: Date, default: Date.now },
  contenu: { type: String, required: true },
});

// Ajouter un champ virtuel pour le résumé
publicationSchema.virtual('resume').get(function () {
  // Utilisez la méthode slice(0, n) pour extraire les n premiers caractères du contenu
  return this.contenu.slice(0, 10);
});

module.exports = mongoose.model("Publication", publicationSchema);