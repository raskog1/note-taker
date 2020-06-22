// Set dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Create array to store our notes
const notes = [];

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Displaying array by reading "db.json" file
app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    const results = JSON.parse(data);
    return res.json(results);
  });
});

// Displaying object by pulling from notes array
app.get("/api/notes/:id", function (req, res) {
  const chosen = notes.find((c) => c.id === parseInt(req.params.id));
  return res.json(chosen);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/api/notes", function (req, res) {
  // Create new note object, assign an ID, add to notes array
  const newNote = {
    id: notes.length + 1,
    title: req.body.title,
    text: req.body.text,
  };
  notes.push(newNote);

  // Add notes array to "db.json" for later retrieval
  fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
    if (err) throw err;
  });
  // Return results to the client
  res.json(notes);
});

app.delete("/api/notes/:id", function (req, res) {
  // Identify ID of note to delete
  const chosen = notes.find((c) => c.id === parseInt(req.params.id));
  // Remove note with matching ID from notes array
  notes.splice(chosen.id - 1, 1);
  // Reassign ID numbers to remaining objects in notes array
  for (let j = 0; j < notes.length; j++) {
    notes[j].id = j + 1;
  }

  // Rewrite notes array to "db.json" file
  fs.writeFile("./db/db.json", JSON.stringify(notes), function (err) {
    if (err) throw err;
  });
  // Repopulate webpage
  res.json(notes);
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
