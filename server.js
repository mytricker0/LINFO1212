const express = require('express');
const session = require('express-session');
const MongoDBSession = require("connect-mongodb-session")(session);
const isAuth = require("./server/is-auth");
const { LoginSingupCollection, IncidentCollection } = require('./server/mongodb');

const bcrypt = require('bcrypt');

const cookieParser = require('cookie-parser');
const app = express();

const port = 3000;

const store = new MongoDBSession({
  uri: 'mongodb://localhost:27017/LINFO1212',
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


app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuth || false;
  next();
});

// Function to serve static files for different directories
function serveDirectory(directoryName) {
  app.use(`/${directoryName}`, express.static(__dirname + `/${directoryName}`));
}

// Serve multiple static directories
serveDirectory('static'); 
serveDirectory('scripts');
serveDirectory('images');

app.get('/', (req, res) => {
  res.render('index.ejs');
  
});

app.get('/login', async (req, res) => {
  
  res.render('login.ejs');
});

app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // Redirect to the login page after destroying the session
      res.redirect('/login');
    }
  });
});

app.get('/signup', async (req, res) => {
  res.render('signup.ejs');
});

app.get('/about', async (req, res) => {
  res.render('about.ejs');
});

app.get('/test', async (req, res) => {
  res.render('test.ejs');
});

app.get('/profile', async (req, res) => {
  res.render('profile.ejs');
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



app.get('/getUserIncidents', isAuth, async (req, res) => {
  try {
    console.log("getUserIncidents");
    const username = req.session.user;
    const incidents = await IncidentCollection.find({ username });
    res.json(incidents);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


app.get('/getallIncidents', async (req, res) => {
  try {
    console.log("getAllIncidents");
    // If you want to fetch all incidents regardless of user, remove the { username } filter
    const incidents = await IncidentCollection.find({});
    res.json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/deleteIncident/:incidentId', isAuth, async (req, res) => {
  try {
    const { incidentId } = req.params;
    const result = await IncidentCollection.deleteOne({ _id: incidentId });
    if (result.deletedCount === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'No incident found with that ID.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});




app.post('/saveIncident/:incidentId', isAuth, async (req, res) => {
  try {
      const { incidentId } = req.params;
      const { incidentType, location, description } = req.body;

      // You may want to add validation here to make sure the content is safe to save

      const result = await IncidentCollection.updateOne(
          { _id: incidentId },
          { $set: { incidentType, location, description } }
      );

      if (result.modifiedCount === 1) {
          res.json({ success: true });
      } else {
          res.json({ success: false });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
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
        req.session.user = username;
        // Passwords match, user is authenticated
        console.log("user is authenticated");
        res.redirect('/about');
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

app.post('/addIncident', isAuth, async (req, res) => {
  try {
    const { incidentType, location, description } = req.body;
    const username = req.session.user; // Assuming the username is stored in the session

    const newIncident = {
      username,
      incidentType,
      location,
      description
    };

    await IncidentCollection.create(newIncident);

    res.redirect('/profile'); // Redirect to a success page or back to the form
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});