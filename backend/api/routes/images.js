const express = require('express')
const router = express.Router();

router.get("/", async(req, res) => {
    res.status(200).json({
        message: "get request"
    })
})

router.post("/", async(req, res) => {
    const {base64} = req.body;
    try {

    } catch(error) {

    }
})