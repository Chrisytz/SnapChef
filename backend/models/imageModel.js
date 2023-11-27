const mongoose = require('mongoose');

const ImageModel = new mongoose.Schema(
    {
        image:String
    },
    {
        collection: "ImageSpecs"
    }
)

mongoose.model("Image", ImageModel)