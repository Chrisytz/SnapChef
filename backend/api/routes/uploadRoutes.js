const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors')
router.use(cors());

require("../../imageSchema")
require('../../imageModelSchema')

const Images = mongoose.model("ImageSpecs")
const ImageModel = mongoose.model('ImageSchema');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "model_train")
    },
    filename: (req, file, cb) => {
    
        console.log(file);
        cb(null,"model" + path.extname(file.originalname))
        console.log("FILE STORED")
    }
})

const upload = multer({storage: storage})

router.post("/upload", upload.single('image'), (req, res) => {
    
    const scriptFilename = path.join(__dirname, '../../model_train', 'image_run.py');
    const exec_command = spawn('python3', [scriptFilename])

    exec_command.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataStr = data.toString();
        console.log(dataStr)
    });
    
    exec_command.stderr.on('data', (data) => {
        console.error(`stderr: ${data.toString()}`);
    });
    
    exec_command.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
      
        storeImage();
        
    });

    function storeImage() {
        directoryPath = "runs/detect/predict"
        try {
            var files = fs.readdirSync(directoryPath).filter(fn => fn.startsWith('model'));
            console.log(files)
            
            fs.unlink("model_train/" + files[0], (err) => {
                if (err) {
                    console.error(`Error deleting file: ${err}`);
                    return;
                }
                console.log(`File '${files[0]}' was deleted successfully.`);
            });

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
            json = {}
            json.objects = jsonData
            json.images = {image: img}
            res.json({json});
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

module.exports = router;