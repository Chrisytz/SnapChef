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
        
        const {exec} = require('child_process')
        const command = 'python model_train/image_run.py "${base64}"';
        
        exec(command, (error, stdout, stderr) => {
            if(error) {
                console.error("Error", error.message);
                return;
            }
        })

        res.send({Status: "ok"})
    } catch(error) {
        console.log("Erorr", error)
    }
})

server.get("/getImage", async(req, res) => {
    try {
        Images.find({}).then(data => {
            res.send({status: "ok", data: data});
        })
        console.log("done")
    } catch(e) {
        res.send({Error: e})
    }
})

// server.get("/getImage", async (req, res) => {
//     try {
//         console.log("hello2")
//         const data = await Images.find({});
//         console.log("hello")
//         console.log("Retrieved data:", data); // Add this line
//         res.send({ status: "ok", data: data });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send({ error: "Internal Server Error" });
//     }
// });