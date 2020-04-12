const express = require('express');
const app = express();
const fs = require('fs');
var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});
const port = 3000;

const handlebars = require('express-handlebars');
//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');
//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
  layoutsDir: __dirname + '/views/layouts',
}));
//Serves static files (we need it to import a css file)
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.render('main', { layout: 'index' });
});
app.get('/animal.json', (req, res) => {
  const data = fs.readFileSync(process.cwd() + "/animals.json").toString();
  res.send(data);
});

app.listen(port, () => console.log(`App listening to port ${port}`));
