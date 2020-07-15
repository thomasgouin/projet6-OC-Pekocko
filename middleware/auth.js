// Ce middleware vient vérifier le Token pour chaque route demandée par l'utilisateur
const config = require('./../config/config');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]; // On récupère le Token dans le header de la requête 
        const decodedToken = jwt.verify(token, config.secret); // On vérifie le token de l'utilisateur grâce à notre clé secrète  
        const userId = decodedToken.userId; // On récupère l'id de l'utilisateur décodé
        // On vérifie que l'utilisateur a bien un id et que cet id corresponde à l'Id du créateur de la sauce
        if (req.body.userId && req.body.userId !== userId){
            throw 'User Id non valable !';
        } else {
            next();
        }
    }catch (error){
        res.status(401).json({error: error | 'Requête non authentifiée !' });
    }
};