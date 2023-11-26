const mongoose = require('mongoose')

// schema that defines the user collection
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add a name']
    },
    email: {
        type: String,
        required: [true, 'please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'please add a password']
    }
},
    {
        timestamps: true
    })

// exporting user model
module.exports = mongoose.model('User', userSchema)