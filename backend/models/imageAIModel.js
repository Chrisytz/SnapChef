const mongoose = require('mongoose');

const ImageAIModel = new mongoose.Schema(
    {
        image:String
    },
    {
        collection: "ImageSpecs"
    }
)

mongoose.model("ImageAI", ImageAIModel)