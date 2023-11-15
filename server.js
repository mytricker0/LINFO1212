const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoDBSession = require("connect-mongodb-session")(session);
const isAuth = require("./server/is-auth");


const cookieParser = require('cookie-parser');
const app = express();

const port = 3000;
const LoginSingupCollection = require('./server/mongodb');

const store = new MongoDBSession({
  uri: 'mongodb://localhost:27017/LoginSingup',
  collection: 'mySessions'
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: 'key that signs cookies',
  resave: false,
  saveUninitialized: false, // later set to true
  cookie: { secure: false },
  maxAge: 10 * 60 * 60 * 24, // 10 days
  store: store
}));

app.set('view engine', 'ejs');
app.set('views', './static/pages');

// Function to serve static files for different directories
function serveDirectory(directoryName) {
  app.use(`/${directoryName}`, express.static(__dirname + `/${directoryName}`));
}

// Serve multiple static directories
serveDirectory('static'); 
serveDirectory('scripts');
serveDirectory('images');

app.get('/', (req, res) => {
  res.render(' index.ejs');
  
});

app.get('/login', (req, res) => {
  
  res.render('login.ejs');
});

app.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

app.get('/about', (req, res) => {
  res.render('about.ejs');
});

app.get('/incident', isAuth, (req, res) => {
  // Access the entered address from the query parameters
  const address = req.query.address;

  // Assuming you have some data to pass, replace this with your actual data
  const incidentData = {
    location: address,
  };

  res.render('addIncident.ejs', { incidentData });
});


app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Generate a salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    // console.log(salt); ex : 2b$10$j8YTROunl67T4o34cq/3wO
    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword); ex : $2b$10$j8YTROunl67T4o34cq/3wOOIWIA98DMdBk9hYQy5jOyGIll0ibT8O
    const data = {
      username: username,
      email: email,
      password: hashedPassword,
    };

    // Save the user with the hashed password
    await LoginSingupCollection.create(data);

    res.render('login.ejs');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user with the provided username
    const user = await LoginSingupCollection.findOne({ username });

    if (user) {
      // Compare the entered password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
       
      // this method protects agains rainbow table attacks

      if (passwordMatch) {
        req.session.isAuth = true;
        // Passwords match, user is authenticated
        console.log("user is authenticated");
        res.render('about.ejs');
      } else {
        // Incorrect password
        console.log("Incorrect password");
        res.render('login.ejs');
      }
    } else {
      // User not found
      res.render('login.ejs');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});