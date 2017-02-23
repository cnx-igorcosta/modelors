const express = require('express');
const app = express();
const route = require('./routes/route');
const path    = require("path");
const connection = require('./config/database.js');

//DATABASE CONNECTION
var uri = process.env.MONGODB_URI || 'mongodb://localhost/modeloRs-app';
connection.connect(uri);

//STATIC SOURCES
app.use('/assets', express.static(path.join(__dirname+'/web/assets')))
app.use('/images', express.static(path.join(__dirname+'/web/images')))

//DEFINES PAGES
app.get('/', function(req, res) {
  res.sendFile('./web/index2.html', {root: __dirname});
});

route(app);

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('modelo RS is listening on http://%s:%s', host, port);
});
