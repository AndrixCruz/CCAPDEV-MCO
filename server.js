
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Assuming HTML files are in the 'public' directory

// MongoDB Connection URL
const mongoURI = 'mongodb://localhost:27017/MCO'; // Replace 'yourDatabaseName' with your database name

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => () => {
    console.log('Connected to MongoDB');
    const db = client.db('MCO'); // Replace 'yourDatabaseName' with your database name

    // Serve the HTML files
    app.get('/register', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'register.html'));
    });

    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });

    app.get('/profile', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'profile.html'));
    });

    app.get('/companyProfile', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'companyProfile.html'));
    });

    app.get('/user', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'user.html'));

    // Additional routes and logic for handling database operations

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch(err => console.error('Error connecting to MongoDB', err));});