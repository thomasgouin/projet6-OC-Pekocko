const mongoose = require('mongoose');

const saucesSchema = mongoose.Schema({
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    userId: {type: String, required: true},
    usersLiked: {type: [String]},
    isersDislikes: {type: [String]}
});

module.exports = mongoose.model('Sauces', saucesSchema);