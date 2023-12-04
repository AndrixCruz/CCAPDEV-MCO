
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
const mongoURI = process.env.MONGODB_URI;

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    // Serve the HTML files

    
    routes.post('/register', async (req, res) => {
      const username = req.body.username;
      const email = req.body.email;
      const AboutMe = req.body.AboutMe;
      const age = req.body.age;
      const gender = req.body.gender;
      const food = req.body.food;
      const password = req.body.password;

      const db = client.db('MCO');
      const profiles = db.collection('profiles');
      
      try {
        await profiles.insertOne({ username, email, AboutMe, age, gender, food, password });
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

    


routes.post('/addcomment', async (req, res) => {
  const company = req.body.company;
  const rating = req.body.rating;
  const commentText = req.body.commentText;

  const db = client.db('MCO');
  const comments = db.collection('comments');

  try {
      await comments.insertOne({ company, rating, commentText });
      res.json({ status: 'ok' });
  } catch (e) {
      console.log(e);
      res.json({ status: 'error' });
  }
});

routes.get('/getcomments', async (req, res) => {
  const db = client.db('MCO');
  const comments = db.collection('comments');

  try {
      const commentData = await comments.find({}).toArray();
      res.json(commentData);
  } catch (e) {
      console.error('Error:', e);
      res.json({ success: false });
  }
});



// ... (remaining server.js code) ...


    routes.post('/edituser', (req, res) => {
      // insert code here
    });

    routes.post('/editcomments', async (req, res) => {
      const commentId = req.body.commentId; // Unique identifier for the comment
      const updatedRating = req.body.updatedRating; // New rating
      const updatedCommentText = req.body.updatedCommentText; // New comment text
  
      const db = client.db('MCO');
      const comments = db.collection('comments');
  
      try {
          // Update the comment based on the comment ID
          const result = await comments.updateOne(
              { _id: new MongoClient.ObjectId(commentId) }, // Assuming _id is the unique identifier
              {
                  $set: {
                      rating: updatedRating,
                      commentText: updatedCommentText,
                  },
              }
          );
  
          // Check if the document was updated successfully
          if (result.modifiedCount === 1) {
              res.json({ status: 'ok' });
          } else {
              res.json({ status: 'error', message: 'Comment not found or no changes made' });
          }
      } catch (e) {
          console.error('Error:', e);
          res.json({ status: 'error' });
      }
  });

    
});
