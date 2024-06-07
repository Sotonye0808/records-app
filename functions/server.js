require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const guinnessRoutes = require('./routes/defaultRoute');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err, response) {
    if (err) {
        console.log('Error connecting to MongoDB');
    } else {
        console.log('Connected to MongoDB');
    }
}
);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('X-Requested-With', 'XMLHttpRequest')
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use('/api', guinnessRoutes);

PORT = process.env.PORT ? process.env.PORT : 3001;

module.exports = app;
/* module.exports = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} and connected to MongoDB`);
    }
); */
