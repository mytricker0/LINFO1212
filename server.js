const express = require('express');
const session = require('express-session');
const MongoDBSession = require("connect-mongodb-session")(session);
const isAuth = require("./server/is-auth");
const fs = require('fs');
const https = require('https');
const { LoginSingupCollection, IncidentCollection } = require('./server/mongodb');

const bcrypt = require('bcrypt');

const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

var privateKey = fs.readFileSync('./key.pem' );
var certificate = fs.readFileSync('./cert.pem' );

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

function serveDirectory(directoryName) { // fonction pour avoir accès aux fichiers 
  app.use(`/${directoryName}`, express.static(__dirname + `/${directoryName}`));
}

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
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
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

app.get('/profile',isAuth, async (req, res) => {
  try {
    const user = await LoginSingupCollection.findOne({ username: req.session.user });

    if (user) {
      res.render('profile.ejs', { username: user.username, email: user.email });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});






app.get('/incident', isAuth, (req, res) => {
  const address = req.query.address;

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

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const data = {
      username: username,
      email: email,
      password: hashedPassword,
    };

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

    const user = await LoginSingupCollection.findOne({ username });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
       

      if (passwordMatch) {
        req.session.isAuth = true;
        req.session.user = username;
        console.log("user is authenticated");
        
        res.redirect('/about');
      } else {
        console.log("Incorrect password");
        res.render('login.ejs', { message: 'Incorrect password' });
      }
    } else {
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
    const username = req.session.user; 

    const newIncident = {
      username,
      incidentType,
      location,
      description
    };

    await IncidentCollection.create(newIncident);

    res.redirect('/profile'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


const server = https.createServer({
  key: privateKey,
  cert: certificate,
  passphrase: 'ingi'
}, app);

server.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`);
});
