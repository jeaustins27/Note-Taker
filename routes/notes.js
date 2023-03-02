const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

// GET route for all notes
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET route for a specific note via its ID
notes.get('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    // Filter the data to only include the note with the ID
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      // If there is a note with the ID, send it back to the client, if not send an error message
      return result.length > 0
        ? res.json(result)
        : res.json('No note exists with that ID');
    });
});


// POST Route for a new note
notes.post('/', (req, res) => {
  console.log(req.body);
  
  const { title, text } = req.body;
  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid()
    };
    
    readAndAppend(newNote, './db/db.json');
    res.json(`Congrats! Note added.`);
  } else {
    res.error('Error, not could not be added');
  }
});

// BONUS - DELETE route for a specific note via its ID
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Creates a new array of all notes exluding the current note via its ID
      const result = json.filter((note) => note.id !== noteId);

      // Saving the newly created array
      writeToFile('./db/db.json', result);

      res.json(`${noteId} has been deleted 🗑️`);
    });
});

module.exports = notes;