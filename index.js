const express = require('express');
const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const url = require('url');

const app = express();

const port = 3000;

const viewsPath = path.join(__dirname, './templates/views');
const partialsPath = path.join(__dirname, './templates/partials');
const gamesJsonPath = path.join(__dirname, '/games.json');
const animalJsonPath = path.join(__dirname, '/animals.json');

const gamesJson = JSON.parse(fs.readFileSync(gamesJsonPath).toString());
const animalJson = fs.readFileSync(animalJsonPath).toString();
// Sets our app to use the handlebars engine
app.set('views', viewsPath);
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);
// Serves static files (we need it to import a css file)
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { cards: gamesJson.games });
});

app.get('/memorygame', (req, res) => {
  res.render('memorygame', { homepage_url: `${req.protocol}://${req.headers.host}` });
});

app.get('/animal.json', (req, res) => {
  res.send(animalJson);
});

app.listen(port, () => console.log(`App listening to port ${port}`));
