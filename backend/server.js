const express = require('express');
const server = express();
const mongoose = require('mongoose');

const mongoUrl = "mongodb+srv://ybob566:A7brCxJT1QlJOzcW@image-object-detection.h1ikzcu.mongodb.net/?retryWrites=true&w=majority"

server.use(express.json({limit: "50mb"}));

const cors = require('cors')
server.use(cors());
server.set("view engine", "ejs")

mongoose
    .connect(mongoUrl, {
    useNewUrlParser:true,
    })
    .then(() => {
        console.log("connected to database");
    })
    .catch((e) => console.log(e));


require("./imageSchema")
const Images = mongoose.model("ImageSpecs")


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));

server.post("/uploadImage", async(req, res) => {
    const {base64} = req.body;
    try {
        Images.create({image:base64});

        res.send({Status: "ok"})
    } catch(error) {

    }
})

server.get("/getImage", async(req, res) => {
    try {
        Images.find({}).then(data => {
            res.send({status: "ok", data: data})
        })
    } catch(e) {
        res.send({Error: e})
    }
})