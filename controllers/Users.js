const bcrypt = require('bcrypt');
const users = require('../models/Users');
const Users = require('../models/Users');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        const user = new Users({
            email: req.body.email, 
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(err => res.status(500).jon({error}));
};

exports.login = (req, res, next) => {
    Users.findOne({email: req.body.email})
    .then()
    .catch(error => res.status(500).json({error}));
};