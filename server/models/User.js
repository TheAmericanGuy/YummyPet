const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must be a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'In a relationship'],
        required: true,
    },
    hasChildren: {
        type: Boolean,
        required: true,
    },
    numberOfChildren: {
        type: Number,
        default: 0,
    },
    city: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    residenceType: {
        type: String,
        enum: ['Apartment', 'House', 'Farmhouse'],
        required: true,
    },
    petPreference: {
        type: [String],
        default: [],
    },
    annualIncome: {
        type: Number,
        required: true,
    }
});

// Middleware para fazer hash da senha antes de salvar no banco
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
