require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const path = require("path");
const Person = require("./models/person");

app.use(express.json());

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(morgan("tiny :body"));
app.use(cors());
app.use(express.static(path.join(__dirname, "dist")));

// remove this later
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  const time = new Date();
  response.send(
    `<div>Phonebook has info for ${
      persons.length
    } people</div><p>${time.toString()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then((person) => {
    response.json(person);
  });
  // compare as strings to avoid type mismatch between stored ids and URL param
  // const person = persons.find((person) => String(person.id) === String(id));
  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  // use string comparison to avoid mismatches when ids are numbers vs strings
  persons = persons.filter((person) => String(person.id) !== String(id));
  response.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  const id = Math.round(Math.random() * 100000);
  if (!request.body.name) {
    return response.status(400).json({ error: "name missing" });
  }

  if (!request.body.number) {
    return response.status(400).json({ error: "phone number missing" });
  }

  if (persons.find((person) => person.name === request.body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = new Person({
    // store ids as strings for consistency with URL params
    // id: String(id), // no longer needed because mongo creates its own ids?
    name: request.body.name,
    number: request.body.number, // do i even need this null if i check for it above
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.put("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => String(person.id) === String(id));

  if (person === undefined) {
    return response.status(404).json({ error: "person not found" });
  }

  if (!request.body.name)
    return response.status(400).json({ error: "name missing" });
  if (!request.body.number)
    return response.status(400).json({ error: "phone number missing" });

  person.name = request.body.name;
  person.number = request.body.number;
  response.json(person);
});
// comment
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
