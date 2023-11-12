const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
    {
        image:String
    },
    {
        collection: "ImageSpecs"
    }
)

mongoose.model("ImageSpecs", ImageSchema)