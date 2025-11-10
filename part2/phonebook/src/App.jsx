import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phonebookService from "./services/phonebook";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", phone: "123" },
  ]);
  const [newName, setNewName] = useState("");
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState(null);
  // null = no active search; array (possibly empty) = search performed
  const [filterP, setfilterP] = useState(null);

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = persons.find((person) => person.name === newName);
    if (newPerson !== undefined) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with the new one?`
        )
      ) {
        phonebookService
          .update(newPerson.id, { name: newName, phone: phone })
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== newPerson.id ? person : response.data
              )
            );
          })
          .then(() => {
            setMessage(`Updated ${newName} with new number ${phone}`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setMessage(
              `Information of ${newName} has already been removed from server. Refresh page to see latest data.`
            );
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          });
      }
      return;
    }

    const person = { name: newName, phone: phone };
    phonebookService
      .create(person)
      .then((response) => {
        setPersons(persons.concat(response.data));
      })
      .then(() => {
        setMessage(`Added ${newName}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
    // setPersons(persons.concat(person));
    // clear active search when adding a person
    setfilterP(null);
    setNewName("");
    setPhone("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const search = (event) => {
    event.preventDefault();
    const filtered_persons = persons.filter((person) =>
      person.name.toLowerCase().includes(query.toLowerCase())
    );
    console.log(filtered_persons);
    // set the filtered results (may be an empty array)
    setfilterP(filtered_persons);
    // keep the query in the input so user sees what was searched for
    console.log("query getting run");
  };

  const hook = () => {
    console.log("effect");
    phonebookService.getAll().then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  };

  const handleRemove = (id) => {
    const removePerson = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${removePerson.name}`)) {
      phonebookService.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  // called on first open to fetch the current data
  useEffect(hook, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter onChange={handleQueryChange} value={query} onSubmit={search} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        phone={phone}
        handlePhoneChange={handlePhoneChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filterP={filterP} remove={handleRemove} />
    </div>
  );
};

export default App;
