
const cors = require('cors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const exphbs = require('express-handlebars');

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

app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({ 
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
}));

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

routes.get('/', async (req, res) => {
  const db = client.db('MCO');
  const restaurants = db.collection('restaurants');

  try {
    const restaurantData = await restaurants.find({}).toArray();
    res.render('index', { layout: 'main', restaurantData });
  } catch (e) {
    console.log(e);
  }
});

routes.get('/login', (req, res) => {
  res.render('login', {layout: 'main'});
});

routes.get('/register', (req, res) => {
  res.render('register', {layout: 'main'});
});

routes.get('/user', (req, res) => {
  res.render('user', {layout: 'main'});
});

routes.get('/companyProfile', async (req, res) => {
  const urlParams = new URLSearchParams(req.query);
  const name = urlParams.get('name');
  const db = client.db('MCO');
  const restaurants = db.collection('restaurants');
  const restaurant = await restaurants.findOne({ name });

  const comments = db.collection('comments');
  const commentsList = await comments.find({ company: name }).toArray();

  res.render('companyProfile', { layout: 'main', restaurant });
});

routes.get('/search', async (req, res) => {
  try {
    const urlParams = new URLSearchParams(req.query);
    const searchQuery = urlParams.get('query');

    const db = client.db('MCO');
    const comments = db.collection('comments');
    const restaurants = db.collection('restaurants');

    const commentsList = await comments.find({ commentText: { $regex: searchQuery, $options: 'i' } }).toArray();
    const restaurantsList = await restaurants.find({ name: { $regex: searchQuery, $options: 'i' } }).toArray();

    res.render('search', { layout: 'main', commentsList, restaurantsList });
  } catch (e) {
    console.log(e);
  }
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