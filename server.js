const express = require('express');
const app = express();
const port = 3000;

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
  res.render('index.ejs');
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



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});