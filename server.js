const cors = require('cors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
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
    dbName: 'MCO',
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

app.get('/', async (req, res) => {
  const db = client.db('MCO');
  const restaurants = db.collection('restaurants');

  const authenticated = req.session.authenticated;
  const email = req.session.email;

  const loggedProfile = await db.collection('profiles').findOne({ email });

  const restaurantData = await restaurants.find({}).toArray();

  if (!authenticated) {
    try {
      res.render('index', { layout: 'main', restaurantData });
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      res.render('index', { layout: 'main', restaurantData, authenticated, loggedProfile });
    } catch (e) {
      console.log(e);
    }
  }
});

app.get('/user', async (req, res) => {
  const urlParams = new URLSearchParams(req.query);
  const username = urlParams.get('name');

  const db = client.db('MCO');
  const profiles = db.collection('profiles');
  const profile = await profiles.findOne({ username });

  const comments = db.collection('comments');
  const commentsList = await comments.find({ username, parent: null }).toArray();

  const authenticated = req.session.authenticated;
  const email = req.session.email;

  const loggedProfile = await profiles.findOne({ email });

  if (!authenticated) {
    try {
      res.render('user', { layout: 'main', profile, commentsList });
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      res.render('user', { layout: 'main', profile, authenticated, loggedProfile, commentsList });
    } catch (e) {
      console.log(e);
    }
  
  }
});

app.get('/login', (req, res) => {
  res.render('login', {layout: 'main'});
});

app.get('/authenticated', (req, res) => {
  if (req.session.authenticated) {
    res.render('authenticated', {layout: 'main'});
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'error' });
    } else {
      res.redirect('/');
    }
  });
});

app.get('/register', (req, res) => {
  res.render('register', {layout: 'main'});
});

app.get('/companyProfile', async (req, res) => {
  const urlParams = new URLSearchParams(req.query);
  const name = urlParams.get('name');
  const db = client.db('MCO');
  const restaurants = db.collection('restaurants');
  const restaurant = await restaurants.findOne({ name });

  const comments = db.collection('comments');
  // Get comments with company name and without parent
  const commentsList = await comments.find({ company: name, parent: null }).toArray();
  // Get comments with company name and with parent
  const repliesList = await comments.find({ company: name, parent: { $ne: null } }).toArray();

  const authenticated = req.session.authenticated;
  const email = req.session.email;

  const loggedProfile = await db.collection('profiles').findOne({ email });

  if (!authenticated) {
    res.render('companyProfile', { layout: 'main', restaurant, commentsList, repliesList });
  } else {
    res.render('companyProfile', { layout: 'main', restaurant, commentsList, repliesList, authenticated, loggedProfile });
  
  }
});

app.get('/search', async (req, res) => {
  try {
    const urlParams = new URLSearchParams(req.query);
    const searchQuery = urlParams.get('query');

    if (searchQuery === '') {
      res.redirect('/');
    }

    const db = client.db('MCO');
    const comments = db.collection('comments');
    const restaurants = db.collection('restaurants');

    const commentsList = await comments.find({ commentText: { $regex: searchQuery, $options: 'i' }, parent: null }).toArray();

    const restaurantsList = await restaurants.find({ name: { $regex: searchQuery, $options: 'i' } }).toArray();

    const authenticated = req.session.authenticated;
    const email = req.session.email;

    const loggedProfile = await db.collection('profiles').findOne({ email });

    if (!authenticated) {
      res.render('search', { layout: 'main', commentsList, restaurantsList });
    } else {
      res.render('search', { layout: 'main', commentsList, restaurantsList, authenticated, loggedProfile });
    }
  } catch (e) {
    console.log(e);
  }
});

app.post('/register', async (req, res) => {
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

  const existingEmail = await profiles.findOne({ email });
  if (existingEmail) {
    res.json({ status: 'error', message: 'Email already exists' });
    return;
  }

  try {
    await profiles.insertOne({
      username,
      email,
      AboutMe: aboutMe,
      age,
      gender,
      food,
      password: hashPassword,
      company: "",
    });
    res.json({ status: 'ok' });
  } catch (e) {
    console.log(e);
    res.json({ status: 'error' });
  }
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const db = client.db('MCO');
  const profiles = db.collection('profiles');

  try {
    const profile = await profiles.findOne({ email });

    if (!profile) {
      res.status(401).json({ status: 'error', message: 'Invalid email' });
      return;
    }

    const result = await bcrypt.compare(password, profile.password);

    if (result) {
      if (!req.session) {
        req.session = {};
      }

      if (req.session.authenticated) {
        req.session.email = email;
        console.log(req.session);
        res.status(201).json(req.session);
      } else {
        req.session.authenticated = true;
        req.session.email = email;
        console.log(req.session);
        res.status(201).json(req.session);
      }
    } else {
      res.status(401).json({ status: 'error', message: 'Invalid password' });
    }
  } catch (e) {
    console.log(e);
    res.json({ status: 'error', message: 'Invalid email' });
  }
});

app.post('/addcomment', async (req, res) => {
  const { rating, comment, company, username, parent } = req.body;
  const db = client.db('MCO');
  const comments = db.collection('comments');

  if (rating === '' && comment === '') {
    res.json({ status: 'error', message: 'Please fill out all the fields' });
    return;
  }

  if (comment === '') {
    res.json({ status: 'error', message: 'Please enter a comment' });
    return;
  }

  if (rating === '') {
    res.json({ status: 'error', message: 'Please enter a rating' });
    return;
  }

  // Get highest commentId and increment by 1
  const highestCommentId = await comments.find().sort({ id: -1 }).limit(1).toArray();
  const id = highestCommentId.length === 0 ? 1 : highestCommentId[0].id + 1;

  try { 
    await comments.insertOne({
      id,
      rating,
      commentText: comment,
      company,
      helpful: null,
      username,
      parent: parent === 'null' ? null : parent,
    });
    res.json({ status: 'ok' });
  } catch (e) {
    console.log(e);
    res.json({ status: 'error' });
  }
});

app.post('/ownercomment', async (req, res) => {
  const commentId = req.body.buttonId;
  const commentText = req.body.ownerReply;
  const company = req.body.company;

  const db = client.db('MCO');
  const comments = db.collection('comments');

  if (commentText === '') {
    res.json({ status: 'error', message: 'Please enter a comment' });
    return;
  }

  const highestCommentId = await comments.find().sort({ id: -1 }).limit(1).toArray();
  const id = highestCommentId.length === 0 ? 1 : highestCommentId[0].id + 1;

  const comment = await comments.findOne({ id: parseInt(commentId) });
  const parentId = comment.id;

  try {
    await comments.insertOne({
      id,
      rating: null,
      commentText,
      company,
      helpful: null,
      parent: parentId,
    });
    res.json({ status: 'ok' });
  } catch (e) {
    console.log(e);
  }
});

app.get('/getcomments', async (req, res) => {
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

app.post('/edituser', async (req, res) => {
  const { AboutMe, age, gender, food, username } = req.body;
  const db = client.db('MCO');
  const profiles = db.collection('profiles');

  try {
    await profiles.updateOne(
      { username },
      { $set: {
        AboutMe,
        age,
        gender,
        food,
      }
    });

    res.json({ status: 'ok' });
  } catch (e) {
    console.log(e);
  }
});

app.post('/editcomment', async (req, res) => {
  const commentId = req.body.buttonId;
  const commentText = req.body.editedComment;

  if (commentText === '') {
    res.json({ status: 'error', message: 'Please enter a comment' });
    return;
  }

  const db = client.db('MCO');
  const comments = db.collection('comments');

  try {
    await comments.updateOne(
      { id: parseInt(commentId) },
      { $set: { commentText } },
    );
    res.json({ status: 'ok' });
  } catch (e) {
    console.log(e);
  }
});

app.post('/deletecomment', async (req, res) => {
  const commentId = req.body.buttonId;

  const db = client.db('MCO');
  const comments = db.collection('comments');

  try {
    await comments.deleteOne({ id: parseInt(commentId) });
    res.json({ status: 'ok' });
  } catch (e) {
    console.log(e);
  }
});

app.post('/helpfulcomment', async (req, res) => {
  const commentId = req.body.buttonId;

  const db = client.db('MCO');
  const comments = db.collection('comments');

  try {
    const comment = await comments.findOne({ id: parseInt(commentId) });

    await comments.updateOne(
      { id: parseInt(commentId) },
      { $set: { helpful: true } },
    );

    res.json({ status: 'ok' });
  } catch (e) {
    console.log(e);
  }
});