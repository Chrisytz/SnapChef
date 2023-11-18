const mongoose = require('mongoose')

// defining the schema of a goal document
const goalSchema = mongoose.Schema({
    // the ref specifies that it refers to the user document
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: [true, 'please add a text value']
    }
},
    {
    timestamps: true
})

// exporting goals model which will allow up to perform crud operations on documents in the goals collection
module.exports = mongoose.model('Goal', goalSchema)