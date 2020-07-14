const Sauces = require('../models/Sauces');
const fs = require('fs');

exports.createSauce = (req, res, next)=>{
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(()=> res.status(201).json({message: 'Sauce enregistrée'}))
        .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) =>{
    let sauceObject = 0;

    if (req.file){
        Sauces.findOne({_id: req.params.id}).then((sauce) =>{
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`)
        });
        sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        };
    } else{
        sauceObject = { ...req.body };
    };

    Sauces.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) =>{
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

exports.getOneSauce = (req, res, next) =>{
    Sauces.findOne({_id: req.params.id})
    .then(sauce =>res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

exports.getAllSauces = (req, res, next) =>{
    Sauces.find()
    .then(sauces =>res.status(200).json(sauces))
    .catch(error => res.status(404).json({error}));
};


exports.setLikesDislikes = (req, res, next) =>{

    const like = req.body.like;
    const user = req.body.userId;
    const sauceId = req.params.id;

    if (like ===1){
        Sauces.findOne({_id: sauceId})
        .then((sauce)=>{
            if (!sauce.usersLiked.includes(user)){
                Sauces.updateOne(
                    {_id: sauceId},
                    {
                        $push: {usersLiked: user},
                        $inc: {likes: like},
                    }
                ).then(() => res.status(200).json({ message: 'Un nouveau like !' })).catch((error) => res.status(400).json({ error }));
            }else {
                return res.status(200).json({});
            }
        })  
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
