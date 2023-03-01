const express = require('express');
const path = require('path');
const api = require('./routes/app');
const db = require('./db/db.json');
const { clog } = require('./middleware/clog');
const { readAndAppend, writeToFile} = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware
app.use(clog);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use('/api', api);

// Get request for wildcard to index.html
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// Get request for notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

// Listening on PORT
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);