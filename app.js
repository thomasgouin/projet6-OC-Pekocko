const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const identifiants = require('./config/config');

const saucesRoutes = require('./routes/Sauces');
const usersRoutes = require('./routes/Users');

mongoose.connect(`mongodb+srv://${identifiants.user}:${identifiants.mdp}@cluster0-hqadt.mongodb.net/${identifiants.dbName}?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
      useUnifiedTopology: true})
    .then(()=>console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', usersRoutes);


module.exports = app; 
