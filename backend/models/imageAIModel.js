const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const ImageAIModel = new mongoose.Schema(
    {
        image:String
    },
    {
        collection: "ImageSpecs"
    }
)

ImageAIModel.plugin(mongoosePaginate)
mongoose.model("ImageAI", ImageAIModel)