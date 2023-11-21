const express = require('express');
const router = express.Router();
const fs = require('fs');
 

router.post("/uploadImage", async(req, res) => {
    const {base64} = req.body;
    try {
        // Images.create({image:base64});
    
        res.send({Status: "ok"})
    } catch(error) {
        console.log("Erorr", error)
    }
})

module.exports = router;