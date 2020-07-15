const express = require('express');
const bodyParser = require('body-parser');//Pour transformer les réponses en format JSON 
const mongoose = require('mongoose');
const path = require('path'); //Chemin pour les images 
const identifiants = require('./config/config');// appelle le fichier config où se trouve les id d'identification à MongoDB

const saucesRoutes = require('./routes/Sauces'); // Importe l'ensemble des routes pour les sauces
const usersRoutes = require('./routes/Users'); // Importe l'ensemble des routes pour les utilisateurs

//Paramètres de connextion à la base de données MongoDB Atlas
mongoose.connect(`mongodb+srv://${identifiants.user}:${identifiants.mdp}@cluster0-hqadt.mongodb.net/${identifiants.dbName}?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
      useUnifiedTopology: true})
    .then(()=>console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

// Configuration de l'API pour accepter les différentes origines de connexion. 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

// Définition du chemin d'importation des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Initialisation des routes dans l'API
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', usersRoutes);


module.exports = app; 
