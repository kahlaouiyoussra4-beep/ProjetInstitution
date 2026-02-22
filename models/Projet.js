const mongoose = require('mongoose');

const partenaireSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cout: { type: Number, required: true }
});

const ProjetSchema = new mongoose.Schema({
  Id: { type: Number, required: true },
  intitule: { type: String, required: true },
  commun: { type: String, required: true },
  lieu: { type: String, required: true },
  axe: { type: String, required: true },
  sousAxe: { type: String, required: true },
  objectifs: { type: String, required: true },
  cout: { type: Number, required: true },
  partenaires: [partenaireSchema],
  composantes: { type: String, required: true },
  delai: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  avancementPhysique: { type: Number, min: 0, max: 100, required: true },
  avancementFinancier: { type: Number, min: 0, max: 100, required: true },
  observations: { type: String },
 
}, 
{ timestamps: true });

module.exports = mongoose.model('Projet', ProjetSchema);