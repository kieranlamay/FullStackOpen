const Persons = ({ persons, filterP }) => {
  return (
    <div>
      {(filterP !== null ? filterP : persons).map((person) => (
        <div key={person.name}>
          {person.name} {person.phone}
        </div>
      ))}
    </div>
  );
};

export default Persons;
