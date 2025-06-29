const mongoose = require('mongoose');

const fichierSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    chemin: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    taille: {
        type: Number,
        required: true
    },
    coursId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UE',
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateUpload: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Fichier', fichierSchema);
