const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors')
router.use(cors());

require("../models/imageAIModel")

const ImageModel = mongoose.model('ImageAI');

// Other middleware and configurations
router.get('/getPreviewModel', async (req, res) => {
    try {
      const { page = 1, limit = 5 } = req.query;
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };
      const images = await ImageModel.paginate({}, options);
      // Sort by createdAt field in ascending order
      res.json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/', async (req, res) => {
    res.send({hello: "hello", api: process.env})
    
  });

// Other routes and middleware

module.exports = router;