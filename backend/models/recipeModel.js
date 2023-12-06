const mongoose = require('mongoose')

// defining the schema of a goal document
const recipeSchema = mongoose.Schema({
    // the ref specifies that it refers to the user document
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImageAI',
    },
    recipe_name: {
        type: String,
        required: [true, 'please add a recipe_name value']
    },
    ingredients: {
        type: String,
        required: [true, 'please add a ingredients value']
    },
    steps: {
        type: [String],
        required: [true, 'please add a steps value']
    },
},
    {
    timestamps: true
})

// exporting goals model which will allow up to perform crud operations on documents in the goals collection
module.exports = mongoose.model('Recipe', recipeSchema)