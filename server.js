
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
app.use(routes);

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

    routes.get('/login', async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;

    const db = client.db('MCO');
    const profiles = db.collection('profiles');

    try {
        const user = await profiles.findOne({ email, password });

        if (user) {
            const username = user.username || "Guest"; // Default to "Guest" if username is not found
            res.json({ status: 'ok', username });
        } else {
            res.json({ status: 'error' });
        }
    } catch (e) {
        console.error('Error:', e);
        res.json({ success: false });
    }
}); 

    

    routes.post('/addreview', async (req, res) => {
      //const username = req.body.username;
      //const time = req.body.time;
      //const restaurant = req.body.restaurant;
      const rating = req.body.rating;
      const comment = req.body.comment;
      //const email = req.body.email;

      const db = client.db('MCO');
      const reviews = db.collection('reviews');

      try {
        await reviews.insertOne({ rating, comment });
        res.json({ status: 'ok' });
      } catch (e) {
        console.log(e);
        res.json({ status: 'error' });
      }

    });

    routes.post('/edituser', (req, res) => {
      // insert code here
    });

    routes.post('/editreview', (req, res) => {
      // insert code here
    });

    
});
