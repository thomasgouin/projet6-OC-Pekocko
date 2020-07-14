// Ce middleware vient vérifier le Token pour chaque route demandée par l'utilisateur
const config = require('./../config/config');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]; // On récupère le Token dans le header de la requête 
        const decodedToken = jwt.verify(token, config.secret);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId){
            throw 'User Id non valable !';
        } else {
            next();
        }
    }catch (error){
        res.status(401).json({error: error | 'Requête non authentifiée !' });
    }
};