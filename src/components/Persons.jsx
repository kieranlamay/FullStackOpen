const Persons = ({ persons, filterP, remove }) => {
  const list = filterP !== null ? filterP : persons;
  return (
    <div>
      {list.map((person) => (
        <div key={person.id ?? person.name}>
          {person.name} {person.number}
          <button onClick={() => remove(person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
