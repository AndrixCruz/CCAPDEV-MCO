
const cors = require('cors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const Profile = require('./model/Profile');

const app = express();
const PORT = 3000;
const routes = express.Router();


app.use(cors());
routes.use(express.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views'))); 

// MongoDB Connection URL
const mongoURI = 'mongodb://localhost:27017/'; 

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Start the server
    app.listen(3000, async () => {
      console.log(`YAY`);
      try {
        await client.connect();
        console.log('Connected to MongoDB');
      } catch (e) {
        console.log(e);
      }
      
    // Serve the HTML files
    routes.get('/register', (req, res) => {
      res.render('register.html');
    });

    routes.get('/login', (req, res) => {
      res.render('login.html');
    });

    routes.post('/register', async (req, res) => {
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;

      const db = client.db('MCO');
      const profiles = db.collection('profiles');
      
      try {
        await profiles.insertOne({ username, email, password });
        res.json({ status: 'ok' });
      } catch (e) {
        console.log(e);
        res.json({ status: 'error' });
      }
    });
});
