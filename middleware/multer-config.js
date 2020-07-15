//Pour la gestion des images et de leur URL

const multer = require('multer'); 
// On renseigne les extensions des fichiers acceptées
const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/jpg': 'jpg'
};
// On renseigne l'endroit où l'on veut stocker les images
const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'images')
    },
    //On crée l'URL de l'image 
    filename: (req, file, callback) =>{
        const name = file.originalname.split(' ').join('_'); //On supprime les espaces eventuels par des _
        const extension = MIME_TYPES[file.mimetype]; //On sélectionne la bonne extension
        callback(null, name + Date.now() + '.' + extension); // On crée l'url totale en y ajoutant un timestamp pour s'asurer que chaque image est unique
    }
});

module.exports = multer({storage}).single('image');