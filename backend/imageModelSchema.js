const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const ImageModelSchema = new mongoose.Schema(
    {
        id:String,
        image:String
    },
    {
        collection: "ImageSchema"
    }
)

ImageModelSchema.plugin(mongoosePaginate);
mongoose.model("ImageSchema", ImageModelSchema)