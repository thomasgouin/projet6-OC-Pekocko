const multer = require('multer');

const MIME_TYPES = {
    'image.jpeg': 'jpg',
    'image.png': 'png',
    'image.jpg': 'jpg'
};

const storage = multer.disckstorage({
    destination: (req, file, callback) =>{
        callback(null, 'images')
    },
    filename: (req, file, callback) =>{
        const name = file.orinalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)

    }
});

module.exports = multer({storage}).single('image');