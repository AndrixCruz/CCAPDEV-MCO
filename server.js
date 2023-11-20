
const cors = require('cors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const routes = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views'))); 

// MongoDB Connection URL
const mongoURI = 'mongodb://localhost:27017/'; 

    // Start the server
    app.listen(3000, () => {
      console.log(`YAY`);
      mongoose.connect(mongoURI, {dbName: 'MCO'});
      
    // Serve the HTML files
    routes.route('/CCAPDEV-MCO/views/register', (req, res) => {
      res.sendFile(path.join(__dirname, 'views', 'register.html'));
    });

    routes.route('/CCAPDEV/views/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'views', 'login.html'));
    });

    routes.route('/CCAPDEV/views/profile', (req, res) => {
      res.sendFile(path.join(__dirname, 'views', 'profile.html'));
    });

    routes.route('/CCAPDEV/views/companyProfile', (req, res) => {
      res.sendFile(path.join(__dirname, 'views', 'companyProfile.html'));
    });

    routes.route('/CCAPDEV/views/user', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'user.html'));
    });
  
});