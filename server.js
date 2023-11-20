
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = 3000;
const routes = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views'))); 

// MongoDB Connection URL
const mongoURI = 'mongodb://localhost:27017/MCO'; 

    // Start the server
    app.listen(3000, () => {
      console.log(`YAY`);
      MongoClient.connect(mongoURI, {})
        .then(client => () => {
        console.log('Connected to MongoDB');
        const db = client.db('MCO'); 
    }).catch(err => console.error('Error connecting to MongoDB', err));

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