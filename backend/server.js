const {spawn} = require('child_process')

const express = require('express');
const server = express();
const mongoose = require('mongoose');
const mongoUrl = "mongodb+srv://ybob566:A7brCxJT1QlJOzcW@image-object-detection.h1ikzcu.mongodb.net/?retryWrites=true&w=majority"


let cur_img = ""

const fs = require('fs')

const path = require('path')
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "model_train")
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null,"model" + path.extname(file.originalname))
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
require('./imageModelSchema')

const Images = mongoose.model("ImageSpecs")
const ImageModel = mongoose.model("ImageSchema")

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));

server.post("/uploadImage", async(req, res) => {
    const {base64} = req.body;
    try {
        // Images.create({image:base64});
    
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

server.get("/getImageSchema", async(req, res) => {
    try {
        ImageModel.find({}).then(data => {
            res.send({status: "ok", data: data});
        })
        console.log("SENTTTTT")
    } catch(e) {
        res.send({Error: e})
    }
})

server.get("/upload", (req, res) => {
    res.render("upload");

})

server.get("/getImageModel", async(req, res) => {
    res.send({image: cur_img});
})

server.post("/upload", upload.single('image'), (req, res) => {
    console.log("image uploaded")
    
    const exec_command = spawn('python', ['model_train/image_run.py'])
    
    exec_command.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataStr = data.toString();
        console.log(dataStr)
    });

    exec_command.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
      
        // Now that the Python script has finished, process the JSON file
        storeImage();
        
    });

    function storeImage() {
        directoryPath = "runs/detect/predict"
        try {
            var files = fs.readdirSync(directoryPath).filter(fn => fn.startsWith('model'));
            console.log(files)
            const file = "runs/detect/predict/" + files[0]
           
            const imageBuffer = fs.readFileSync(file);
           
            const base64str = imageBuffer.toString('base64');
            extension = file.slice(file.lastIndexOf('.') + 1);
            
            if(extension == "jpg") {
                extension = "jpeg"
            }
            
            image_str = "data:image/" + extension + ";base64," + base64str
            cur_img = image_str
            ImageModel.create({id:"model",image:image_str});
            

            processJsonFile(image_str);
        } catch(error) {
            console.log(error);
        }
        
    }

    function processJsonFile(img) {
        const jsonFilePath = '../objects.json';
        
        try {
            const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
            let jsonData = JSON.parse(fileContent)
        
            res.json({jsonData});
        } catch (err) {
            res.status(500).json({ error: "Error parsing JSON file", message: err.message });
        }
        
        deleteDirectory()
    }
    
    function deleteDirectory() {
        directoryPath = "runs"
        fs.rmdir(directoryPath, { recursive: true }, (err) => {
            if (err) {
              console.error(`Error deleting directory: ${err.message}`);
            } else {
              console.log(`Directory '${directoryPath}' deleted successfully.`);
            }
        });
    }

})  
