const bcrypt = require('bcrypt'); // On importe bcrypt
const jwt = require('jsonwebtoken');// On importe jsonwebtoken
const jwtSecret = require('./../config/config'); //On importe les données de connexion cachées
const Users = require('../models/Users'); // ON importe le modèle des utilisateurs

// Si un utilisateur veut s'enregistrer pour accéder au service
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //On vient sécuriser le mot de passe renseigné par l'utilisateur
    .then(hash =>{
        //On crée un objet qui renseigne les données de connexion de l'utilisateur
        const user = new Users({
            email: req.body.email, 
            password: hash
        });
        //On sauvegarde ces données dans la BDD 
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).jon({error}));
};

// Quand l'utilisateur veut se connecter à un compte existant
exports.login = (req, res, next) => {
    // On trouve l'utilisateur dans la BDD grâce à son email
    Users.findOne({email: req.body.email})
    .then(user =>{
        //Si l'utilisateur n'est pas enregistré, on indique le message d'erreur non trouvé
        if(!user){
            return res.status(401).json({error: 'Utilisateur non trouvé !'});
        }
        //On compare le mot de passe rentré par l'utilisateur avec celui enregistré dans la BDD en passant par bcrypt
        bcrypt.compare(req.body.password, user.password)
        .then(valid =>{
            //Si différent on renvoie le message d'erreur invalide
            if(!valid){
                return res.status(401).json({error: 'Mot de passe incorrect !'});
            }
            // Si ok alors on crée un json web token unique qui a une durée de 24h.
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    jwtSecret.secret,
                    {expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};