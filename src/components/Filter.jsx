const Filter = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        Search:{" "}
        <input type="text" value={props.value} onChange={props.onChange} />
      </div>
    </form>
  );
};

export default Filter;
