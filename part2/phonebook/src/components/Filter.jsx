const Filter = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <input type="text" value={props.value} onChange={props.onChange} />
    </form>
  );
};

export default Filter;
