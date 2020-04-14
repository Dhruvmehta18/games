const express = require('express');

const app = express();
const fs = require('fs');

const port = 3000;

const handlebars = require('express-handlebars');
// Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');
// Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
  layoutsDir: `${__dirname}/views/layouts`,
}));
// Serves static files (we need it to import a css file)
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render('main', { layout: 'index' });
});
app.get('/animal.json', (req, res) => {
  const data = fs.readFileSync(`${process.cwd()}/animals.json`).toString();
  res.send(data);
});

app.listen(port, () => console.log(`App listening to port ${port}`));
