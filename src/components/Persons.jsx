const Persons = ({ persons, filterP, remove }) => {
  return (
    <div>
      {(filterP !== null ? filterP : persons).map((person) => (
        <div key={person.name}>
          {person.name} {person.phone}
          <button onClick={() => remove(person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
