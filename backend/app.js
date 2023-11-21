// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const uploadRoutes = require('./api/routes/uploadRoutes');
const imageRoutes = require('./api/routes/imageRoutes');
const jsonRoutes = require('./api/routes/jsonRoutes');
const previewRoutes = require('./api/routes/previewRoutes');
const mongoUrl = "mongodb+srv://ybob566:A7brCxJT1QlJOzcW@image-object-detection.h1ikzcu.mongodb.net/?retryWrites=true&w=majority"

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use('/', uploadRoutes);
app.use('/', imageRoutes);
app.use('/', jsonRoutes);
app.use('/', previewRoutes);

app.set('view engine', 'ejs');

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((e) => console.log(e));

module.exports = app;