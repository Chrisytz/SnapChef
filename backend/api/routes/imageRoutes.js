const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors')
router.use(cors());

require("../../imageSchema")
require('../../imageModelSchema')

const Images = mongoose.model("ImageSpecs")
const ImageModel = mongoose.model('ImageSchema');

router.get("/getImage", async(req, res) => {
    try {
        Images.find({}).then(data => {
            res.send({status: "ok", data: data});
        })
        console.log("done")
    } catch(e) {
        res.send({Error: e})
    }
})

router.get("/getImageSchema", async(req, res) => {
    try {
        ImageModel.find({}).then(data => {
            res.send({status: "ok", data: data});
        })
        console.log("SENTTTTT")
    } catch(e) {
        res.send({Error: e})
    }
})

module.exports = router;