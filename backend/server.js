const {spawn} = require('child_process')

const express = require('express');
const server = express();
const mongoose = require('mongoose');
const mongoUrl = "mongodb+srv://ybob566:A7brCxJT1QlJOzcW@image-object-detection.h1ikzcu.mongodb.net/?retryWrites=true&w=majority"

const fs = require('fs')

const path = require('path')
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "model_train")
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

server.use(express.json({limit: "50mb"}));

server.set("view engine", "ejs");

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
        
        // const exec_command = spawn('python', ['model_train/image_run.py', base64])
        
        const binaryData = Buffer.from(base64, 'base64');
        const filePath = 'model_train/test.png';
        
        fs.writeFileSync(filePath, binaryData);

        console.log('Image saved successfully:', filePath);

        // exec(exec_command, (error, stdout, stderr) => {
        //     if(error) {
        //         console.error("Error", error.message);
        //         return;
        //     }
        // })

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

server.get("/upload", (req, res) => {
    res.render("upload");
})

server.post("/upload", upload.single('image'), (req, res) => {
    res.send("image uploaded")
})