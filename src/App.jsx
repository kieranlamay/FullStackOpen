import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import phonebookService from "./services/phonebook";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", phone: "123" },
  ]);
  const [newName, setNewName] = useState("");
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");
  // null = no active search; array (possibly empty) = search performed
  const [filterP, setfilterP] = useState(null);

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.filter((person) => person.name == newName).length > 0) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const person = { name: newName, phone: phone };
    phonebookService.create(person).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
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

  // called on first open to fetch the current data
  useEffect(hook, []);

  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons persons={persons} filterP={filterP} />
    </div>
  );
};

export default App;
