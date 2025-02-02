const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Dog', 'Cat'], // Inicialmente com essas opções, mas pode expandir
        required: true
    },
    description: {
        type: String,
        required: true
    },
    idealConditions: {
        type: [String], // Lista de condições ideais (exemplo: "Apartment", "Kids-friendly")
        required: true
    }
});

module.exports = mongoose.model('Pet', PetSchema);
