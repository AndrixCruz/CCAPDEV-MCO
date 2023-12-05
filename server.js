
const cors = require('cors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mongoStore = require('connect-mongo');

const app = express();
const PORT = 3000;
const routes = express.Router();

const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
routes.use(express.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views'))); 
app.use(routes);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: mongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60,
  }),
}));

app.use('/', routes);

const mongoURI = process.env.MONGODB_URI;

const client = new MongoClient(mongoURI);

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (e) {
    console.log(e);
  }
});

function getDb(dbName = process.env.DB_NAME){
  return client.db(dbName);
}

routes.get('/', (req, res) => {
  res.sendFile('/views/index.html');
});

routes.get('/login', (req, res) => {
  res.sendFile('/views/login.html');
});

routes.get('/register', (req, res) => {
  res.sendFile('/views/register.html');
});

routes.get('/user', async (req, res) => {
  res.sendFile('/views/user.html');
});

routes.post('/register', async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const aboutMe = req.body.AboutMe;
  const age = req.body.age;
  const gender = req.body.gender;
  const food = req.body.food;
  const password = req.body.password;

  const db = client.db('MCO');
  const profiles = db.collection('profiles');

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    await profiles.insertOne({
      username,
      email,
      AboutMe: aboutMe,
      age,
      gender,
      food,
      password: hashPassword,
    });
    res.json({ status: 'ok' });
  } catch (e) {
    console.log(e);
    res.json({ status: 'error' });
  }
});

routes.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const db = client.db('MCO');
  const profiles = db.collection('profiles');

  try {
    const profile = await profiles.findOne({ email });
    const result = await bcrypt.compare(password, profile.password);

    if (result) {
      if (!req.session) {
        req.session = {};
      }

      if (req.session.authenticated) {
        req.session.email = email;
        res.json({ status: 'ok' });
      } else {
        req.session.authenticated = true;
        req.session.email = email;
        res.json({ status: 'ok' });
      }
    } else {
      res.json({ status: 'error', message: 'Invalid password' });
    }
  } catch (e) {
    console.log(e);
    res.json({ status: 'error', message: 'Invalid username' });
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

routes.post('/editpost', async (req, res) => {

});

routes.post('/editcomments', async (req, res) => {
  const commentId = req.body.commentId;
  const commentText = req.body.updatedCommentText;

  const db = client.db('MCO');
  const comments = db.collection('comments');

  try {
    // Update comment based on commentId
    const result = await comments.updateOne(
      { _id: ObjectId(commentId) },
      { $set: { commentText}},
    );

    if (result.modifiedCount === 1) {
      res.json({ status: 'ok' });
    } else {
      res.json({ status: 'error', message: 'Comment not found or no changes made' });
    }
  } catch (e) {
    console.log(e);
    res.json({ status: 'error' });
  }
});