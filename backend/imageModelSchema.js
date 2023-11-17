const mongoose = require('mongoose');

const ImageModelSchema = new mongoose.Schema(
    {
        id:String,
        image:String
    },
    {
        collection: "ImageSchema"
    }
)

mongoose.model("ImageSchema", ImageModelSchema)