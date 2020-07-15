const Sauces = require('../models/Sauces'); // on importe notre modèle pour les sauces
const fs = require('fs'); //On sélectionne le module file system

//Action pour créer une sauce (POST)
exports.createSauce = (req, res, next)=>{
    const sauceObject = JSON.parse(req.body.sauce); //On récupère l'ensemble des éléments créés par la requête utilisateur
    const sauce = new Sauces({
        ...sauceObject, // On sélectionne l'ensemble des éléments du formulaire
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //On crée l'URL de l'image
    });
    sauce.save() // On enregistre la sauce dans la BDD
        .then(()=> res.status(201).json({message: 'Sauce enregistrée'}))
        .catch(error => res.status(400).json({error}));
};
// Action pour modifier une sauce
exports.modifySauce = (req, res, next) =>{
    let sauceObject = 0;
    // Si l'utilisateur modifie l'image
    if (req.file){
        /* On sélectionne la sauce qui est modifiée grâce à son ID
            - on sélectionne l'image enregistrée sur le server
            - on supprime l'image du serveur avec fs.unlinkSync
            - on crée le nouvel objet sauceObjet constitué des nouvelles informations
            - on crée l'URL de la nouvelle image
        */
        Sauces.findOne({_id: req.params.id}).then((sauce) =>{
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`)
        });
        sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        };
    //Si l'utilisateur ne modifie pas l'image on enregistre les nouvelles informations dans l'objet sauceObject
    } else{
        sauceObject = { ...req.body };
    };
    // On met à jour MongoDB avec la méthode updateOne. 
    Sauces.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch((error) => res.status(400).json({ error }));
};
//Action pour supprimer une sauce
exports.deleteSauce = (req, res, next) =>{
    /* On selectionne la sauce renvoyée en requête puis : 
        - on retrouve l'image correspondante sur le serveur
        - on supprime l'image du serveur
        - on supprime la sauce de la base de données MongoDB avec la methode deleteOne
    */
    Sauces.findOne({ _id: req.params.id})
    .then(sauce =>{
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () =>{
            Sauces.deleteOne({_id: req.params.id})
            .then(()=> res.status(200).json({message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({error}));
        });
    })
    .catch(error => res.status(500).json({error}));
};
//Action pour renvoyer une sauce en particulier
exports.getOneSauce = (req, res, next) =>{
    //On sélectionne la sauce qui a le même id que dans la requête de l'utilisateur
    Sauces.findOne({_id: req.params.id})
    .then(sauce =>res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};
//Action pour renvoyer l'ensemble des sauces à l'utilisateur 
exports.getAllSauces = (req, res, next) =>{
    //On demande de trouver toutes les sauces
    Sauces.find()
    .then(sauces =>res.status(200).json(sauces))
    .catch(error => res.status(404).json({error}));
};

//Action pour la gestion des likes et dislikes
exports.setLikesDislikes = (req, res, next) =>{
    //On isole nos éléments dans des variables
    const like = req.body.like;
    const user = req.body.userId;
    const sauceId = req.params.id;

    //Dans le cas où l'utilisateur ajoute un like
    if (like ===1){
        //On sélectionne la sauce en question
        Sauces.findOne({_id: sauceId})
        .then((sauce)=>{
            /*On regarde si l'utilisateur n'a pas déjà liké la sauce, 
            dans ce cas on ajoute l'id de l'utilisateur et on incrémente la quantité de like de 1*/ 
            if (!sauce.usersLiked.includes(user)){
                Sauces.updateOne(
                    {_id: sauceId},
                    {
                        $push: {usersLiked: user},
                        $inc: {likes: like},
                    }
                ).then(() => res.status(200).json({ message: 'Un nouveau like !' })).catch((error) => res.status(400).json({ error }));
            //Si l'utilisateur a déjà liké, on ne fait rien sinon renvoyer le statut de normalité
            }else {
                return res.status(200).json({});
            }
        }) 
    /*Dans le cas où l'utilisateur veut ajouter un dislike, 
    même raisonnement que précédemment mais ajout d'un disklike */
    } else if(like === -1){
        Sauces.findOne({_id: sauceId})
        .then((sauce)=>{
            if (!sauce.usersLiked.includes(user)){
                Sauces.updateOne(
                    {_id: sauceId},
                    {
                        $push: {usersDisliked: user},
                        $inc: {dislikes: -like},
                    }
                ).then(() => res.status(200).json({ message: 'Un nouveau dislike...' })).catch((error) => res.status(400).json({ error }));
            }else{
                return res.status(200).json({});
            }
        })
    //Si l'utilisateur veut annuler un like ou un dislike
    } else if(like === 0){
        Sauces.findOne({_id: sauceId})
        .then((sauce)=>{
            if (sauce.usersLiked.includes(user)){
                Sauces.updateOne(
                    {_id: sauceId},
                    {
                        $pull: {usersLiked: user},
                        $inc: {likes: -1}
                    }   
                ).then(() => res.status(200).json({ message: 'Like retiré !' })).catch((error) => res.status(400).json({ error }))
            } else if(sauce.usersDisliked.includes(user)){
                Sauces.updateOne(
                    {_id: sauceId},
                    {
                        $pull: {usersDisliked: user},
                        $inc: {dislikes: -1}
                    }   
                ).then(() => res.status(200).json({ message: 'dislike retiré !' })).catch((error) => res.status(400).json({ error }))
            }
        }).catch((error) => res.status(404).json({error}));
    }
}
